# Quick Reference: Adding Rich Media to Chatbot

## Step-by-Step Guide

### 1. **Add to Knowledge Base** (Backend)

Open `backend/controllers/chatbotController.js` and add your question:

```javascript
const KNOWLEDGE_BASE = {
  student: {
    'Your question here?': {
      text: 'Your detailed answer...',
      media: [
        // Add media here
      ]
    }
  }
};
```

### 2. **Add Media to Response**

Import helpers at the top:
```javascript
const { createImage, createLink, createVideo, createTable } = require('../utils/mediaUtils');
```

Use in your response:
```javascript
'Your question here?': {
  text: 'Your detailed answer...',
  media: [
    createImage('url', 'alt-text', 'Title'),
    createLink('url', 'Link Title', 'Description'),
    createTable(
      ['Column 1', 'Column 2', 'Column 3'],
      [
        ['Row 1 Cell 1', 'Row 1 Cell 2', 'Row 1 Cell 3'],
        ['Row 2 Cell 1', 'Row 2 Cell 2', 'Row 2 Cell 3']
      ]
    )
  ]
}
```

### 3. **Test Your Changes**

1. Restart backend: `npm start` (in backend directory)
2. Open chatbot in browser
3. Type your question
4. Verify media displays correctly

---

## Media Types Quick Reference

### Image
```javascript
createImage(url, altText, title)
```
**Example:**
```javascript
createImage(
  'https://via.placeholder.com/400x250',
  'security-tips',
  'Cyber Security Tips'
)
```

### Link
```javascript
createLink(url, title, description)
```
**Example:**
```javascript
createLink(
  'https://www.ncsc.gov.uk/guidance',
  'NCSC Security Guide',
  'Official UK cyber security guidance'
)
```

### Video
```javascript
createVideo(url, title)
```
**Example:**
```javascript
createVideo(
  'https://www.youtube.com/embed/dQw4w9WgXcQ',
  'Security Training Video'
)
```

### Table
```javascript
createTable(headersArray, rowsArray)
```
**Example:**
```javascript
createTable(
  ['Feature', 'Importance', 'Difficulty'],
  [
    ['2FA', 'Critical', 'Easy'],
    ['Strong Password', 'Critical', 'Easy'],
    ['VPN', 'High', 'Medium']
  ]
)
```

---

## Common Examples

### Security Tips with Resources
```javascript
'Best security practices': {
  text: 'Follow these essential practices...',
  media: [
    createImage('image-url', 'security', 'Best Practices'),
    createLink('https://example.com/guide', 'Complete Guide', 'Learn more'),
    createTable(
      ['Practice', 'Priority'],
      [['2FA', 'Critical'], ['Strong Password', 'Critical']]
    )
  ]
}
```

### Comparison Table
```javascript
'Compare options': {
  text: 'Here are the differences...',
  media: [
    createTable(
      ['Option', 'Cost', 'Features', 'Best For'],
      [
        ['Free', '$0', 'Basic', 'Individuals'],
        ['Pro', '$9.99', 'Advanced', 'Teams'],
        ['Enterprise', 'Custom', 'Full Suite', 'Organizations']
      ]
    )
  ]
}
```

### Video Tutorial
```javascript
'How to use feature X?': {
  text: 'Watch this video tutorial...',
  media: [
    createVideo('youtube-embed-url', 'Feature X Tutorial'),
    createLink('support-url', 'Need Help?', 'Support documentation')
  ]
}
```

---

## Best Image URLs to Use

### Placeholder Images (Free)
- **Via Placeholder**: `https://via.placeholder.com/400x250?text=Your+Text`
- **Placeholder.com**: `https://placeholder.com/400x250`
- **Lorem Picsum**: `https://picsum.photos/400/250`

### Real Resources
- **Your server**: Host images on your own server
- **CDN**: Use a CDN like Cloudinary or Imgix
- **Public repositories**: Wikipedia Commons, Unsplash, Pexels

### Example
```javascript
createImage(
  'https://via.placeholder.com/400x250?text=Security+Best+Practices',
  'security-best-practices',
  'Essential Security Tips'
)
```

---

## Testing Media in Development

### Test Image
```javascript
createImage(
  'https://via.placeholder.com/400x250?text=Test+Image',
  'test',
  'Test'
)
```

### Test Link
```javascript
createLink(
  'https://example.com',
  'Example Website',
  'A test link'
)
```

### Test Table
```javascript
createTable(
  ['Name', 'Age', 'Role'],
  [
    ['Alice', '30', 'Admin'],
    ['Bob', '25', 'User']
  ]
)
```

---

## Where to Add Content

### For Students
Edit in `KNOWLEDGE_BASE.student`:
```javascript
const KNOWLEDGE_BASE = {
  student: {
    // Add here ↓
    'Your student question': { ... }
  }
};
```

### For Admins
Edit in `KNOWLEDGE_BASE.admin`:
```javascript
const KNOWLEDGE_BASE = {
  admin: {
    // Add here ↓
    'Your admin question': { ... }
  }
};
```

---

## File Locations

📁 **Backend Controller** (Add knowledge base here)
```
backend/controllers/chatbotController.js
```

📁 **Media Utilities** (Media helper functions)
```
backend/utils/mediaUtils.js
```

📁 **Frontend Component** (Rendering logic)
```
frontend/src/components/ChatBot.tsx
```

---

## Common Mistakes to Avoid

❌ **Forgetting to import**: 
```javascript
// Wrong - will cause error
createImage('url', 'alt', 'title')

// Right - import first
const { createImage } = require('../utils/mediaUtils');
```

❌ **Wrong URL format**:
```javascript
// Wrong for YouTube videos
'https://www.youtube.com/watch?v=dQw4w9WgXcQ'

// Right - use embed URL
'https://www.youtube.com/embed/dQw4w9WgXcQ'
```

❌ **Forgetting text in response**:
```javascript
// Wrong - only media
{ media: [...] }

// Right - text + media
{ 
  text: 'Your answer here...',
  media: [...]
}
```

❌ **Too many media items**:
```javascript
// Avoid - 10+ media items (slow loading)
media: [item1, item2, ..., item10]

// Better - max 3-4 items
media: [item1, item2, item3]
```

---

## Quick Restart Checklist

After adding new content:

1. ✅ Save the file (`Ctrl+S`)
2. ✅ Restart backend server (`npm start`)
3. ✅ Clear browser cache (`Ctrl+Shift+R`)
4. ✅ Reload chatbot in browser
5. ✅ Test your question
6. ✅ Verify media displays

---

## Getting Help

- 📖 Read: [RICH_MEDIA_GUIDE.md](RICH_MEDIA_GUIDE.md)
- 🔧 See: [Media Utilities](backend/utils/mediaUtils.js)
- 💡 Copy: Examples in [RICH_MEDIA_GUIDE.md](RICH_MEDIA_GUIDE.md)
- 🐛 Debug: Check browser console (F12)

