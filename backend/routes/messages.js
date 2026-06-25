const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Message schema
const messageSchema = new mongoose.Schema({
  senderId: String,
  receiverId: String,
  senderName: { type: String, default: "" },
  receiverName: { type: String, default: "" },
  text: String,
  language: { type: String, default: "English" },  // Language of the message (Hindi, Tamil, Bengali, etc.)
  englishMeaning: { type: String, default: "" },   // English translation/meaning
  isFlagged: Boolean,
  isWarning: { type: Boolean, default: false },     // Is this a warning message?
  warningType: { type: String, default: null },     // gentle, formal, severity, custom, restrict, suspend, ban
  templateUsed: { type: String, default: null },    // Which template was used
  severity: String,       // High, Medium, Low
  caseStatus: { type: String, default: "Flagged", enum: ["Flagged", "Pending Review", "Low Priority"] },
  adminNotes: { type: String, default: "" },  // Notes from admin about the case
  escalationAction: { type: String, default: null, enum: [null, "restrict", "suspend", "ban"] },  // Escalation action taken
  escalationDuration: { type: Number, default: null },  // Duration in days for restrict/suspend
  resolvedAt: { type: Date, default: null },  // When the case was resolved
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Reuse existing model or create
const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);

// POST - insert new message
router.post("/", async (req, res) => {
  try {
    const newMessage = new Message(req.body);
    await newMessage.save();
    res.status(201).json({ message: "Message saved successfully", data: newMessage });
  } catch (error) {
    console.error("Error inserting message:", error);
    res.status(500).json({ error: "Failed to insert message" });
  }
});

// GET - fetch all messages (supports filtering by receiverId)
router.get("/", async (req, res) => {
  try {
    const { receiverId } = req.query;
    
    console.log("📨 GET /api/messages called");
    console.log("Query receiverId param:", receiverId);
    
    let query = {};
    if (receiverId) {
      query.receiverId = receiverId;
      console.log("🔍 Filtering by receiverId:", receiverId);
    }
    
    const messages = await Message.find(query).sort({ createdAt: -1 });
    console.log(`✅ Found ${messages.length} messages`);
    if (receiverId) {
      console.log("Messages with this receiverId:", messages.map(m => ({
        _id: m._id,
        receiverId: m.receiverId,
        isWarning: m.isWarning,
        warningType: m.warningType,
        text: m.text?.substring(0, 30)
      })));
    }
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// GET - fetch only flagged messages with sender profile info from chat_db
router.get("/flagged", async (req, res) => {
  try {
    const flaggedMessages = await Message.find({ isFlagged: true }).sort({ createdAt: -1 });
    
    // Try to get connection to chat_db for user names
    const db = mongoose.connection.db;
    const adminDb = db.admin();
    
    // List all databases to find chat_db connection
    let chatDbUsers = null;
    try {
      // Try using the same connection's database switching capability
      const chatDb = mongoose.connection.useDb('chat_db', { useCache: true });
      const usersCollection = chatDb.collection('users');
      
      // Also get Student model from default db
      const Student = mongoose.models.Student || require('../models/Student');
      
      // Enrich messages with sender and receiver names from chat_db
      // Build safe $or conditions per message to avoid invalid ObjectId lookups
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
            }

            let senderUser = null;
            let senderName = msg.senderId;
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
              // Try as ObjectId
              if (mongoose.Types.ObjectId.isValid(msg.receiverId)) {
                receiverOrConditions.push({ _id: new mongoose.Types.ObjectId(msg.receiverId) });
              }
              // Try as string email/uid/id field
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
              if (!receiverUser) {
                console.log(`⚠️ Receiver not found - ID: ${msg.receiverId}, Message: ${msg._id}`);
              } else {
                console.log(`✓ Receiver found for ID: ${msg.receiverId} -> Name: ${receiverUser?.fullName || receiverUser?.name}`);
              }
            } else {
              console.log(`❌ No receiver ID for message ${msg._id}`);
            }
            
            if (receiverUser) {
              receiverName = receiverUser.fullName || receiverUser.name || msg.receiverId || "Unknown";
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
                  receiverName = receiverUser.fullName || msg.receiverId || "Unknown";
                  receiverClass = receiverUser.studentClass || null;
                }
              }
            }

            // Try to extract class information from the user documents using common field names
            if (!senderClass && senderUser) {
              senderClass = senderUser.studentClass || senderUser.className || senderUser.class || senderUser.student_class || null;
            }
            if (!receiverClass && receiverUser) {
              receiverClass = receiverUser.studentClass || receiverUser.className || receiverUser.class || receiverUser.student_class || null;
            }

            return {
              ...msg.toObject(),
              senderName,
              receiverName,
              senderClass,
              receiverClass,
            };
          } catch (err) {
            console.error("Error enriching message", msg._id, err);
            return {
              ...msg.toObject(),
              senderName: msg.senderId || "Unknown",
              receiverName: msg.receiverId || "Unknown",
              senderClass: null,
              receiverClass: null,
            };
          }
        }),
      );

      // Log counts for debugging: total flagged vs enriched returned
      console.log(`Flagged messages fetched: ${flaggedMessages.length}; Enriched: ${enrichedMessages.length}`);

      res.status(200).json(enrichedMessages);
    } catch (dbErr) {
      // Fallback: return messages with senderId and receiverId as names
      console.log("Chat DB not available, returning with senderId/receiverId as names");
      const messagesWithId = flaggedMessages.map(msg => ({
        ...msg.toObject(),
        senderName: msg.senderId || "Unknown",
        receiverName: msg.receiverId || "Unknown",
      }));
      res.status(200).json(messagesWithId);
    }
  } catch (error) {
    console.error("Error fetching flagged messages:", error);
    res.status(500).json({ error: "Failed to fetch flagged messages" });
  }
});

// PUT - update message case status (for admin actions)
router.put("/:messageId/status", async (req, res) => {
  try {
    const { messageId } = req.params;
    const { caseStatus, adminNotes } = req.body;

    // Validate caseStatus
    const validStatuses = ["Flagged", "Pending Review", "Low Priority"];
    if (!validStatuses.includes(caseStatus)) {
      return res.status(400).json({ error: "Invalid case status" });
    }

    // Prepare update object
    const updateData = {
      caseStatus,
      updatedAt: new Date(),
    };

    // Add admin notes if provided
    if (adminNotes) {
      updateData.adminNotes = adminNotes;
    }

    // If status is "Low Priority" (resolved), add resolved timestamp
    if (caseStatus === "Low Priority") {
      updateData.resolvedAt = new Date();
    } else {
      // If reopening, clear resolved timestamp
      updateData.resolvedAt = null;
    }

    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.status(200).json({
      message: "Case status updated successfully",
      data: updatedMessage,
    });
  } catch (error) {
    console.error("Error updating message status:", error);
    res.status(500).json({ error: "Failed to update message status" });
  }
});

// DEBUG endpoint - Get sample users from chat_db
router.get("/debug/users", async (req, res) => {
  try {
    const chatDb = mongoose.connection.useDb('chat_db', { useCache: true });
    const usersCollection = chatDb.collection('users');
    
    const sampleUsers = await usersCollection.find({}).limit(5).toArray();
    
    res.status(200).json({
      message: "Sample users from chat_db",
      count: sampleUsers.length,
      sample: sampleUsers,
    });
  } catch (error) {
    console.error("Error fetching sample users:", error);
    res.status(500).json({ error: "Failed to fetch sample users", details: error.message });
  }
});

// POST - Send warning message to student
router.post("/:reportId/warn", async (req, res) => {
  try {
    const { reportId } = req.params;
    const {
      studentName,
      studentId,
      warningType,
      messageContent,
      severity,
      adminId,
    } = req.body;

    console.log("⚠️ WARNING ENDPOINT CALLED");
    console.log("StudentId being saved:", studentId);
    console.log("StudentName:", studentName);
    console.log("WarningType:", warningType);
    console.log("AdminId:", adminId);

    // Validate request
    if (!reportId || !studentName || !studentId || !warningType || !messageContent) {
      console.log("❌ Missing required fields");
      return res.status(400).json({
        error: "Missing required fields: reportId, studentName, studentId, warningType, messageContent",
      });
    }

    // Create warning message record
    const warningMessage = new Message({
      senderId: adminId || "system-admin",
      receiverId: studentId,
      senderName: "CyberShield Admin",
      receiverName: studentName,
      text: messageContent,
      isFlagged: false,
      severity: severity || "High",
      warningType: warningType, // gentle, formal, severity, custom
      templateUsed: warningType,
      isWarning: true,
      caseStatus: "Pending Review",
      adminNotes: `Warning sent via ${warningType} template for report ${reportId}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await warningMessage.save();
    
    console.log("✅ Warning message saved with receiverId:", warningMessage.receiverId);

    // Update the original report to link it with warning
    const updatedReport = await Message.findByIdAndUpdate(
      reportId,
      {
        caseStatus: "Pending Review",
        adminNotes: `Warning message sent to student using ${warningType} template`,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    res.status(201).json({
      message: "Warning message sent successfully",
      data: {
        warningMessage,
        updatedReport,
      },
    });
  } catch (error) {
    console.error("Error sending warning message:", error);
    res.status(500).json({
      error: "Failed to send warning message",
      details: error.message,
    });
  }
});

// POST - Escalate case (Restrict, Suspend, Ban)
router.post("/:reportId/escalate", async (req, res) => {
  try {
    const { reportId } = req.params;
    const { action, duration, reason, adminId, studentName } = req.body;

    console.log("🔵 Escalate Endpoint Called");
    console.log("ReportId from params:", reportId);
    console.log("Action from body:", action);
    console.log("Full req.body:", req.body);
    console.log("AdminId:", adminId);

    // Validate request
    if (!reportId || !action || !adminId) {
      console.log("❌ Missing required fields");
      return res.status(400).json({
        error: "Missing required fields: reportId, action, adminId",
      });
    }

    if (!["restrict", "suspend", "ban"].includes(action)) {
      return res.status(400).json({
        error: "Invalid action. Must be 'restrict', 'suspend', or 'ban'",
      });
    }

    // Create escalation record
    const escalationMessage = new Message({
      senderId: adminId,
      senderName: "CyberShield Admin",
      receiverName: studentName || "Unknown",
      text: `Account ${action}ed: ${reason || "Policy violation"}`,
      isFlagged: false,
      severity: "High",
      caseStatus: "Pending Review",
      adminNotes: `${action.toUpperCase()} action taken - ${reason || "Policy violation"}${
        duration ? ` for ${duration} days` : ""
      }`,
      isWarning: true,
      warningType: action,
      templateUsed: action,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await escalationMessage.save();

    // Update the original report
    const updatedReport = await Message.findByIdAndUpdate(
      reportId,
      {
        caseStatus: "Pending Review",
        adminNotes: `Escalation action (${action}) taken - ${reason || "Policy violation"}${
          duration ? ` for ${duration} days` : ""
        }`,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    res.status(201).json({
      message: `User ${action}ed successfully`,
      data: {
        escalationRecord: escalationMessage,
        updatedReport,
        action,
        duration: duration || null,
      },
    });
  } catch (error) {
    console.error("❌ Error escalating case:", error);
    console.error("Error Stack:", error.stack);
    res.status(500).json({
      error: "Failed to escalate case",
      details: error.message,
    });
  }
});

module.exports = router;

