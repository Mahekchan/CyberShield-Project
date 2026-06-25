# Quick Start Guide for CyberShield AI Chatbot

## What Was Implemented

I've successfully built a personalized AI agent chatbot for your CyberShield system with the following features:

### ✅ Completed Components

1. **Frontend Chatbot Widget** (`frontend/src/components/ChatBot.tsx`)
   - Floating chatbot button (bottom-right corner)
   - Modern gradient UI matching CyberShield branding
   - Expandable/minimizable chat window
   - Real-time message display
   - Suggested action buttons for quick responses
   - Responsive design for all devices

2. **Backend Infrastructure**
   - **Controller** (`backend/controllers/chatbotController.js`) - AI response logic
   - **Model** (`backend/models/ChatbotConversation.js`) - Database schema for storing conversations
   - **Routes** (`backend/routes/chatbotRoutes.js`) - API endpoints

3. **Dashboard Integration**
   - ✅ Admin Dashboard - Chatbot integrated with admin-specific knowledge base
   - ✅ Student Dashboard - Chatbot integrated with student-specific knowledge base

4. **Knowledge Bases**
   - **Student Bot**: Helps with reporting, security tips, platform navigation, settings
   - **Admin Bot**: Helps with user management, flagged content, dashboard features, security guidelines

## Getting Started

### 1. Update Backend Configuration

Add these to your backend `.env` file:
```
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/cybershield
PORT=5000
NODE_ENV=development
```

### 2. Update Frontend Configuration

Create `frontend/.env`:
```
VITE_API_URL=http://localhost:5000
VITE_CHATBOT_ENABLED=true
```

### 3. Start the Backend Server

```bash
cd backend
npm install  # if needed
node ../server.js
```

### 4. Start the Frontend

```bash
cd frontend
npm install  # if needed
npm run dev
```

## Using the Chatbot

### For Students:
1. Go to Student Dashboard
2. Click the blue chatbot icon (bottom-right corner)
3. Ask questions like:
   - "How to report an issue?"
   - "Security tips"
   - "How do I use this platform?"
   - "How to change my settings?"

### For Admins:
1. Go to Admin Dashboard
2. Click the blue chatbot icon (bottom-right corner)
3. Ask questions like:
   - "How to manage users?"
   - "Show me flagged messages"
   - "Dashboard overview"
   - "Security guidelines for admins"

## Features

✨ **Intelligent Responses**: Different answers based on user type (student/admin)
💾 **Conversation History**: All conversations are saved to MongoDB
🎨 **Modern UI**: Beautiful gradient design with smooth animations
⚡ **Fast & Responsive**: Instant responses with loading indicators
🔄 **Suggested Actions**: Quick buttons for common questions
📱 **Mobile Friendly**: Works on all screen sizes

## Key Files

| File | Purpose |
|------|---------|
| `frontend/src/components/ChatBot.tsx` | Main chatbot component |
| `backend/controllers/chatbotController.js` | AI response logic |
| `backend/models/ChatbotConversation.js` | Database schema |
| `backend/routes/chatbotRoutes.js` | API endpoints |
| `CHATBOT_SETUP.md` | Detailed documentation |

## API Endpoints

- **POST** `/api/chatbot/chat` - Send a message
- **GET** `/api/chatbot/history` - Get conversation history
- **POST** `/api/chatbot/clear` - Clear conversation
- **GET** `/api/chatbot/admin/conversations` - View all conversations (admin)

## Future Enhancements

You can easily enhance the chatbot with:

1. **AI Integration** - Connect OpenAI GPT-3.5/4 for smarter responses
2. **Analytics** - Track most common questions and user satisfaction
3. **Multi-Language** - Support for multiple languages
4. **Escalation** - Route complex issues to human support
5. **Custom Training** - Train the bot on your specific CyberShield content

## Customization

To add more responses, edit `backend/controllers/chatbotController.js`:

```javascript
const KNOWLEDGE_BASE = {
  student: {
    'How to report an issue?': 'Your custom response...',
    // Add more Q&A pairs
  },
  admin: {
    'How to manage users?': 'Your custom response...',
    // Add more Q&A pairs
  },
};
```

## Troubleshooting

**Chatbot not appearing?**
- Check that ChatBot component is imported in the dashboard files
- Verify backend is running on port 5000
- Check browser console for errors

**Messages not saving?**
- Verify MongoDB connection in `.env`
- Check server logs for database errors

**API errors?**
- Ensure CORS is enabled in backend
- Verify the API URL in frontend `.env`

## Next Steps

1. ✅ Test the chatbot on both dashboards
2. 📝 Customize the knowledge base with your specific content
3. 🔐 Set up proper authentication/authorization
4. 📊 Monitor conversation logs for insights
5. 🚀 Deploy to production with HTTPS

---

**Need help?** Check `CHATBOT_SETUP.md` for detailed documentation and advanced features.
