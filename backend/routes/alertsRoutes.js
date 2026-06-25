const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Define Message model (same as in messages.js)
const messageSchema = new mongoose.Schema({
  senderId: String,
  receiverId: String,
  senderName: { type: String, default: "" },
  receiverName: { type: String, default: "" },
  text: String,
  language: { type: String, default: "English" },
  englishMeaning: { type: String, default: "" },
  isFlagged: Boolean,
  isWarning: { type: Boolean, default: false },
  warningType: { type: String, default: null },
  templateUsed: { type: String, default: null },
  severity: String,
  caseStatus: { type: String, default: "Flagged", enum: ["Flagged", "Pending Review", "Low Priority"] },
  adminNotes: { type: String, default: "" },
  escalationAction: { type: String, default: null, enum: [null, "restrict", "suspend", "ban"] },
  escalationDuration: { type: Number, default: null },
  resolvedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Reuse existing model or create
const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);

// GET - fetch flagged messages for logged-in student dashboard (by Firebase UID)
router.get("/flagged-messages", async (req, res) => {
  try {
    const { receiverId } = req.query;
    
    if (!receiverId) {
      return res.status(400).json({ 
        error: "receiverId query parameter is required" 
      });
    }

    // Query flagged messages where receiverId matches
    // receiverId is stored as ObjectId in MongoDB
    let query = {
      isFlagged: true
    };

    try {
      if (mongoose.Types.ObjectId.isValid(receiverId)) {
        const objectId = new mongoose.Types.ObjectId(receiverId);
        query.receiverId = objectId;
      } else {
        query.receiverId = receiverId;
      }
    } catch (err) {
      console.error("❌ Error converting ID:", err);
      query.receiverId = receiverId;
    }

    const flaggedMessages = await Message.find(query).sort({ createdAt: -1 });
    
    // Enrich messages with sender and receiver names
    const enrichedMessages = await enrichMessagesWithUserData(flaggedMessages);
    
    res.status(200).json(enrichedMessages);
  } catch (error) {
    console.error("Error fetching flagged messages for receiver:", error);
    res.status(500).json({ error: "Failed to fetch flagged messages" });
  }
});

// GET - fetch all flagged alerts for a student by MongoDB ID (for StudentAlertsPage)
router.get("/student/:studentMongoId", async (req, res) => {
  try {
    const { studentMongoId } = req.params;
    
    if (!studentMongoId) {
      return res.status(400).json({ 
        error: "studentMongoId is required" 
      });
    }

    console.log("\n=== DEBUGGING ALERTS QUERY ===");
    console.log("📌 Searching for receiverId:", studentMongoId);
    console.log("📌 Type:", typeof studentMongoId);

    // First, let's see what receiverIds exist in the database
    const totalFlagged = await Message.find({ isFlagged: true }).limit(5);
    console.log("📊 Sample flagged messages in DB:");
    totalFlagged.forEach((msg, idx) => {
      console.log(`  [${idx}] receiverId:`, msg.receiverId, "| Type:", typeof msg.receiverId);
    });

    // Query flagged messages where receiverId matches the student's MongoDB ID
    let query = {
      isFlagged: true
    };

    // receiverId is stored as ObjectId in MongoDB, convert parameter to ObjectId
    try {
      if (mongoose.Types.ObjectId.isValid(studentMongoId)) {
        const objectId = new mongoose.Types.ObjectId(studentMongoId);
        // Match both ObjectId and string format just to be safe
        query.receiverId = objectId;
      } else {
        query.receiverId = studentMongoId;
      }
    } catch (err) {
      console.error("❌ Error converting ID:", err);
      query.receiverId = studentMongoId;
    }

    console.log("🔍 Query:", JSON.stringify(query, null, 2));

    const flaggedMessages = await Message.find(query).sort({ createdAt: -1 }).limit(100);
    
    console.log(`✅ Found ${flaggedMessages.length} alerts for student ${studentMongoId}`);
    console.log("=== END DEBUG ===\n");

    // Enrich messages with sender and receiver names
    const enrichedMessages = await enrichMessagesWithUserData(flaggedMessages);
    
    res.status(200).json(enrichedMessages);
  } catch (error) {
    console.error("Error fetching student alerts:", error);
    res.status(500).json({ error: "Failed to fetch student alerts", details: error.message });
  }
});

// Helper function to enrich messages with user data
async function enrichMessagesWithUserData(flaggedMessages) {
  try {
    const chatDb = mongoose.connection.useDb('chat_db', { useCache: true });
    const usersCollection = chatDb.collection('users');
    
    // Also get Student model from default db
    const Student = mongoose.models.Student || require('../models/Student');
    
    const enrichedMessages = await Promise.all(
      flaggedMessages.map(async (msg) => {
        try {
          // Get sender name
          const senderOrConditions = [];
          if (msg.senderId) {
            if (mongoose.Types.ObjectId.isValid(msg.senderId)) {
              senderOrConditions.push({ _id: new mongoose.Types.ObjectId(msg.senderId) });
            }
            senderOrConditions.push({ email: msg.senderId });
            senderOrConditions.push({ uid: msg.senderId });
            senderOrConditions.push({ userId: msg.senderId });
          }

          let senderUser = null;
          let senderName = msg.senderId || "Unknown";
          let senderClass = null;

          // Try chat_db first
          if (senderOrConditions.length > 0) {
            senderUser = await usersCollection.findOne({ $or: senderOrConditions });
          }
          
          if (senderUser) {
            senderName = senderUser.fullName || senderUser.name || msg.senderId;
            senderClass = senderUser.studentClass || senderUser.className || senderUser.class || senderUser.student_class || null;
          } else {
            // Try Student collection in default db
            if (msg.senderId) {
              let studentQuery = {};
              if (mongoose.Types.ObjectId.isValid(msg.senderId)) {
                studentQuery._id = new mongoose.Types.ObjectId(msg.senderId);
              } else {
                studentQuery = {
                  $or: [
                    { userId: msg.senderId },
                    { emailAddress: msg.senderId }
                  ]
                };
              }
              senderUser = await Student.findOne(studentQuery);
              if (senderUser) {
                senderName = senderUser.fullName || msg.senderId;
                senderClass = senderUser.studentClass || null;
              }
            }
          }

          // Get receiver name
          const receiverOrConditions = [];
          if (msg.receiverId) {
            if (mongoose.Types.ObjectId.isValid(msg.receiverId)) {
              receiverOrConditions.push({ _id: new mongoose.Types.ObjectId(msg.receiverId) });
            }
            receiverOrConditions.push({ email: msg.receiverId });
            receiverOrConditions.push({ uid: msg.receiverId });
            receiverOrConditions.push({ userId: msg.receiverId });
            receiverOrConditions.push({ id: msg.receiverId });
          }

          let receiverUser = null;
          let receiverName = msg.receiverId || "Unknown";
          let receiverClass = null;

          // Try chat_db first
          if (receiverOrConditions.length > 0) {
            receiverUser = await usersCollection.findOne({ $or: receiverOrConditions });
          }
          
          if (receiverUser) {
            receiverName = receiverUser.fullName || receiverUser.name || msg.receiverId;
            receiverClass = receiverUser.studentClass || receiverUser.className || receiverUser.class || receiverUser.student_class || null;
          } else {
            // Try Student collection in default db
            if (msg.receiverId) {
              let studentQuery = {};
              if (mongoose.Types.ObjectId.isValid(msg.receiverId)) {
                studentQuery._id = new mongoose.Types.ObjectId(msg.receiverId);
              } else {
                studentQuery = {
                  $or: [
                    { userId: msg.receiverId },
                    { emailAddress: msg.receiverId }
                  ]
                };
              }
              receiverUser = await Student.findOne(studentQuery);
              if (receiverUser) {
                receiverName = receiverUser.fullName || msg.receiverId;
                receiverClass = receiverUser.studentClass || null;
              }
            }
          }

          const msgObj = msg.toObject ? msg.toObject() : msg;

          // Map Message fields to Alert fields for frontend compatibility
          return {
            ...msgObj,
            // Ensure id field is set (from _id)
            id: msg._id || msg.id,
            // Map text field to comment for frontend
            comment: msg.text || "",
            cleaned: msg.englishMeaning || msg.text || "",
            // Use severity as the primary label
            labels: msg.severity ? [msg.severity] : ["Flagged"],
            // Use caseStatus as reason
            reasons: [msg.caseStatus || "Flagged"],
            // Ensure created_at is ISO string
            created_at: msg.createdAt ? new Date(msg.createdAt).toISOString() : new Date().toISOString(),
            // Add platform (could be determined from other fields or left as is)
            platform: msg.platform || "Unknown",
            senderName,
            receiverName,
            senderClass,
            receiverClass,
          };
        } catch (err) {
          console.error("Error enriching message", msg._id, err);
          const msgObj = msg.toObject ? msg.toObject() : msg;
          return {
            ...msgObj,
            id: msg._id || msg.id,
            comment: msg.text || "",
            cleaned: msg.englishMeaning || "",
            labels: [msg.severity || "Flagged"],
            reasons: [msg.caseStatus || "Flagged"],
            created_at: msg.createdAt ? new Date(msg.createdAt).toISOString() : new Date().toISOString(),
            platform: "Unknown",
            senderName: msg.senderId || "Unknown",
            receiverName: msg.receiverId || "Unknown",
            senderClass: null,
            receiverClass: null,
          };
        }
      }),
    );

    return enrichedMessages;
  } catch (dbErr) {
    console.log("Chat DB not available, returning messages without enrichment:", dbErr.message);
    return flaggedMessages.map(msg => {
      const msgObj = msg.toObject ? msg.toObject() : msg;
      return {
        ...msgObj,
        id: msg._id || msg.id,
        comment: msg.text || "",
        cleaned: msg.englishMeaning || "",
        labels: [msg.severity || "Flagged"],
        reasons: [msg.caseStatus || "Flagged"],
        created_at: msg.createdAt ? new Date(msg.createdAt).toISOString() : new Date().toISOString(),
        platform: "Unknown",
        senderName: msg.senderId || "Unknown",
        receiverName: msg.receiverId || "Unknown",
      };
    });
  }
}

module.exports = router;
