// Quick test script to verify alerts are in database
require('dotenv').config();
const mongoose = require('mongoose');

async function testAlerts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const messageSchema = new mongoose.Schema({ receiverId: String, text: String, severity: String, senderName: String, isFlagged: Boolean, createdAt: Date }, { strict: false });
    const Message = mongoose.model("Message", messageSchema);
    
    const alerts = await Message.find({ receiverId: "68d97001b6446edbce28d649", isFlagged: true });
    console.log(`✅ Found ${alerts.length} alerts in database`);
    alerts.forEach(a => console.log(`   - ${a.senderName}: ${a.text.substring(0, 40)}... [${a.severity}]`));
    
    await mongoose.disconnect();
  } catch (e) {
    console.error('Error:', e.message);
  }
}

testAlerts();
