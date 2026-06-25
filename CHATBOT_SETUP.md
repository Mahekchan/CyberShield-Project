# CyberShield AI Chatbot Implementation Guide

## Overview
The CyberShield AI Chatbot is an intelligent assistant integrated into both student and admin dashboards. It provides context-aware responses based on user type and helps guide users through platform features and security best practices.

## Features

### Frontend Features
- **Floating Widget**: A floating chatbot button in the bottom-right corner of the screen
- **Expandable Interface**: Users can open, minimize, or close the chat window
- **Message History**: Real-time message display with smooth scrolling
- **Suggested Actions**: Quick-access buttons for common questions
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Gradient UI**: Modern design matching the CyberShield brand colors (blue and cyan)

### Backend Features
- **Conversation Management**: Stores user conversations in MongoDB
- **Context-Aware Responses**: Different knowledge bases for students and admins
- **Conversation History**: Retrieve past conversations
- **Admin Analytics**: View all conversations across the system

## Project Structure

### Frontend Components
```
frontend/src/components/
├── ChatBot.tsx              # Main chatbot component
```

### Backend Files
```
backend/
├── controllers/
│   └── chatbotController.js # Chat logic and AI responses
├── models/
│   └── ChatbotConversation.js # Database schema
├── routes/
│   └── chatbotRoutes.js     # API endpoints
```

## Installation

### 1. Backend Setup

#### Install Required Packages
```bash
cd backend
npm install
```

The following packages are already included:
- **express**: Web framework
- **mongoose**: MongoDB ODM
- **axios**: HTTP client

#### Database Configuration
Ensure MongoDB is running and configured in your `.env` file:
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/cybershield
```

#### API Routes
The following endpoints are available:

**POST** `/api/chatbot/chat`
- Send a message to the chatbot
- Body: `{ message, userType, userId, conversationHistory }`
- Returns: `{ success, reply, suggestedActions }`

**GET** `/api/chatbot/history`
- Retrieve conversation history
- Query: `userId`, `userType`
- Returns: `{ success, messages }`

**POST** `/api/chatbot/clear`
- Clear a conversation
- Body: `{ userId, userType }`
- Returns: `{ success, message }`

**GET** `/api/chatbot/admin/conversations`
- Get all conversations (Admin only)
- Returns: `{ success, conversations, total }`

### 2. Frontend Setup

#### Environment Variables
Create a `.env` file in the `frontend/` directory:
```
VITE_API_URL=http://localhost:5000
VITE_CHATBOT_ENABLED=true
```

#### Component Integration
The ChatBot component is already integrated into:
- `frontend/src/pages/admin/AdminDashboard.tsx`
- `frontend/src/pages/student/StudentDashboard.tsx`

## Knowledge Base

### Student Knowledge Base
The chatbot helps students with:
- **How to report an issue?** - Guidance on anonymous and direct reporting
- **Security tips** - Best practices for cyber safety
- **Platform help** - Navigation and feature explanation
- **My settings** - Profile and preference management

### Admin Knowledge Base
The chatbot assists admins with:
- **How to manage users?** - User suspension, deletion, and management
- **Security tips** - Admin-level security guidelines
- **Flagged messages** - Reviewing and managing flagged content
- **Dashboard overview** - Dashboard features and statistics

## Customization

### Adding New Knowledge Base Entries

Edit `backend/controllers/chatbotController.js`:

```javascript
const KNOWLEDGE_BASE = {
  student: {
    'Your Question Here': 'Your detailed answer here...',
    // Add more entries
  },
  admin: {
    'Your Question Here': 'Your detailed answer here...',
    // Add more entries
  },
};
```

### Styling the Chatbot

The ChatBot component uses Material-UI theming. Modify the `sx` props in [frontend/src/components/ChatBot.tsx](frontend/src/components/ChatBot.tsx) to customize:
- Colors and gradients
- Font sizes and families
- Border radius and shadows
- Spacing and padding

### Suggested Actions

Update the `getSuggestedActions()` function in the controller to show different suggestions:

```javascript
const getSuggestedActions = (userType) => {
  const actions = {
    student: [
      'Custom Question 1',
      'Custom Question 2',
      'Custom Question 3',
    ],
    // ...
  };
  return actions[userType] || [];
};
```

## Advanced Features (Future Implementation)

### 1. OpenAI Integration
For AI-powered responses using OpenAI API:

```bash
npm install openai
```

Update the controller to use OpenAI for dynamic responses instead of the knowledge base.

### 2. Machine Learning
- Train models on conversation history
- Improve response accuracy over time
- Identify common user issues

### 3. Multi-Language Support
- Add translation layer
- Support multiple languages
- Localize knowledge base

### 4. Sentiment Analysis
- Analyze user sentiment
- Escalate to human support if needed
- Provide empathetic responses

### 5. Analytics Dashboard
- Track conversation metrics
- Identify common questions
- Improve FAQ documentation

## Troubleshooting

### Chatbot Not Appearing
1. Verify the component is imported in the dashboard files
2. Check browser console for errors
3. Ensure the API URL is correct in `.env`

### API Errors
1. Check MongoDB connection
2. Verify the backend server is running on port 5000
3. Check CORS configuration in `server.js`

### Messages Not Saving
1. Verify MongoDB connection string
2. Check that the ChatbotConversation model is properly defined
3. Review server logs for error messages

## Testing

### Manual Testing
1. Open the admin or student dashboard
2. Click the floating chatbot icon (bottom-right)
3. Type a message and press Enter or click Send
4. Verify responses are appropriate for the user type

### API Testing
Use Postman or curl to test endpoints:

```bash
# Send a message
curl -X POST http://localhost:5000/api/chatbot/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How to report an issue?",
    "userType": "student",
    "userId": "user123",
    "conversationHistory": []
  }'
```

## Performance Optimization

1. **Message Pagination**: Load older messages on demand
2. **Lazy Loading**: Load chatbot component only when needed
3. **Debouncing**: Debounce input changes to reduce API calls
4. **Caching**: Cache frequently asked questions

## Security Considerations

1. **Authentication**: Verify user identity before saving conversations
2. **Data Privacy**: Never store sensitive user information in conversation
3. **Input Validation**: Sanitize and validate all user inputs
4. **Rate Limiting**: Implement rate limiting to prevent abuse
5. **HTTPS**: Use HTTPS in production

## Support and Maintenance

- Monitor conversation logs for issues
- Update knowledge base based on user feedback
- Regular testing of API endpoints
- Keep dependencies updated

## File References

- [ChatBot Component](frontend/src/components/ChatBot.tsx)
- [Chatbot Controller](backend/controllers/chatbotController.js)
- [Chatbot Routes](backend/routes/chatbotRoutes.js)
- [Chatbot Model](backend/models/ChatbotConversation.js)
- [Admin Dashboard Integration](frontend/src/pages/admin/AdminDashboard.tsx)
- [Student Dashboard Integration](frontend/src/pages/student/StudentDashboard.tsx)

## Environment Files

- [Backend Environment Template](.env.example)
- [Frontend Environment Template](frontend/.env.example)
