# Rich Media Support Documentation

## Overview
The CyberShield AI Chatbot now supports rich media content including images, links, videos, and data tables. This enhancement provides a more engaging and informative user experience.

## Supported Media Types

### 1. **Images** 📷
Display visual content to enhance explanations and guides.

**Example Usage:**
```javascript
createImage(
  'https://example.com/image.jpg',
  'alt-text-description',
  'Image Title'
)
```

**Features:**
- Responsive sizing (max-width: 100%, max-height: 300px)
- Click-to-enlarge interaction
- Hover zoom effect
- Lazy loading support

**Use Cases:**
- Security tips visual guides
- Dashboard screenshots
- Infographics
- Diagrams and flowcharts

---

### 2. **Links** 🔗
Embed external resource links with metadata.

**Example Usage:**
```javascript
createLink(
  'https://www.example.com/resource',
  'Resource Title',
  'Brief description of the resource'
)
```

**Features:**
- Rich link preview with title and description
- Icon indicator for external links
- Safe link handling (target="_blank", rel="noopener noreferrer")
- Hover effects for better UX

**Use Cases:**
- External security resources
- Educational materials
- Official guidelines (NIST, GDPR, etc.)
- Government resources
- Tool recommendations

---

### 3. **Videos** 🎬
Embed video content directly in chat responses.

**Example Usage:**
```javascript
createVideo(
  'https://www.youtube.com/embed/VIDEO_ID',
  'Video Title'
)
```

**Features:**
- Responsive video embedding
- Aspect ratio maintained (16:9)
- Full-screen support
- Works with YouTube, Vimeo, etc.

**Use Cases:**
- Training tutorials
- Security awareness videos
- Product demos
- Conference recordings

---

### 4. **Tables** 📊
Display structured data in an organized table format.

**Example Usage:**
```javascript
createTable(
  ['Header 1', 'Header 2', 'Header 3'],  // Headers array
  [
    ['Row 1 Cell 1', 'Row 1 Cell 2', 'Row 1 Cell 3'],
    ['Row 2 Cell 1', 'Row 2 Cell 2', 'Row 2 Cell 3'],
  ]  // Rows array
)
```

**Features:**
- Clean, professional styling
- Scrollable on small screens
- Header highlighting
- Zebra striping for readability
- Responsive design

**Use Cases:**
- Comparison tables
- Requirements documentation
- Feature matrices
- Compliance checklists
- Timeline/phase breakdowns

---

## Implementation Guide

### Backend Implementation

#### 1. Import Media Utilities
```javascript
const { createImage, createLink, createVideo, createTable, MEDIA_RESPONSES } = require('../utils/mediaUtils');
```

#### 2. Define Knowledge Base with Media
```javascript
const KNOWLEDGE_BASE = {
  student: {
    'Your Question': {
      text: 'Your detailed answer text here...',
      media: [
        createImage('url', 'alt', 'title'),
        createLink('url', 'title', 'description'),
        createTable(['Header1', 'Header2'], [['Cell1', 'Cell2']])
      ]
    },
    // ... more questions
  },
  admin: {
    // ... admin questions with media
  }
};
```

#### 3. Update Response Generation
```javascript
const generateAIResponse = (userType, message, conversationHistory = []) => {
  // ... existing logic ...
  
  return {
    reply: response.text,
    suggestedActions: getSuggestedActions(userType),
    media: response.media,  // Include media array
  };
};
```

### Frontend Implementation

#### 1. Media Type Definition
```typescript
export interface MediaContent {
  type: 'image' | 'link' | 'video' | 'embed' | 'table';
  url?: string;
  title?: string;
  description?: string;
  alt?: string;
  data?: Record<string, any>;
}
```

#### 2. Message Type Update
```typescript
interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestedActions?: string[];
  media?: MediaContent[];  // Add media property
}
```

#### 3. Render Media in Messages
```tsx
{message.media && message.media.length > 0 && (
  <MediaRenderer media={message.media} />
)}
```

---

## Pre-configured Media Responses

The system includes pre-configured media responses for common questions:

### Student Media Responses

#### Security Resources
- Images: Cyber security tips visual
- Links: NCSC Mobile Security Guide, Stay Safe Online

#### Reporting Guide
- Table: Report types, visibility levels
- Links: CyberTipline resource

#### Password Security
- Image: Password requirements visual
- Table: Password requirements comparison

#### Phishing Awareness
- Image: Phishing email example
- Links: Anti-Phishing Working Group

### Admin Media Responses

#### User Management
- Table: Admin actions and reversibility
- Links: ISA Standards reference

#### Alert Monitoring
- Image: Alert dashboard visual
- Table: Alert levels and response times

#### Incident Response
- Links: NIST Incident Handling Guide
- Table: Incident response phases

#### Compliance
- Table: Compliance standards checklist
- Links: GDPR Compliance Tool

---

## Customization

### Adding New Media to Existing Responses

```javascript
// In KNOWLEDGE_BASE
'Security tips': {
  text: 'Your security tips...',
  media: [
    createImage('https://example.com/security.jpg', 'Security', 'Security Tips'),
    createLink('https://ncsc.gov.uk/...', 'NCSC Guide', 'Official security guidance'),
  ]
}
```

### Creating Custom Media Response Sets

```javascript
// In MEDIA_RESPONSES
const MEDIA_RESPONSES = {
  student: {
    your_custom_response: {
      media: [
        createImage('url1', 'alt1', 'title1'),
        createVideo('url2', 'video title'),
        createTable(['Col1', 'Col2'], [['Data1', 'Data2']])
      ]
    }
  }
};
```

### Styling Media Content

Edit the `sx` props in the media renderer components:

```tsx
// In frontend/src/components/ChatBot.tsx

// Image styling
Box sx={{ maxHeight: 300, borderRadius: '8px' }}

// Link styling  
Box sx={{ backgroundColor: 'rgba(0, 0, 0, 0.05)', borderRadius: '6px' }}

// Table styling
TableContainer sx={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
```

---

## Best Practices

### 1. **Image Usage**
- ✅ Use placeholder images for now (via-placeholder.com)
- ✅ Include descriptive alt text
- ✅ Keep file sizes under 500KB
- ✅ Use appropriate formats (JPEG, PNG, WebP)
- ❌ Don't include sensitive or personal information

### 2. **Link Usage**
- ✅ Include official and authoritative sources
- ✅ Provide clear, descriptive titles
- ✅ Add brief descriptions explaining why the link is relevant
- ✅ Use stable, permanent URLs
- ❌ Don't link to paywalled content without notification

### 3. **Table Usage**
- ✅ Use for comparing options or listing data
- ✅ Keep tables concise (max 5 columns, 10 rows)
- ✅ Use clear, descriptive headers
- ✅ Include units of measurement
- ❌ Don't use tables for narrative content

### 4. **Video Usage**
- ✅ Use publicly available, embedded videos
- ✅ Include relevant, professional content
- ✅ Provide titles for accessibility
- ✅ Test embedding before deployment
- ❌ Don't use very long videos (20+ min) without summary

---

## File References

### Backend Files
- [Media Utilities](backend/utils/mediaUtils.js) - Media creation and predefined responses
- [Chatbot Controller](backend/controllers/chatbotController.js) - Updated with media support

### Frontend Files
- [ChatBot Component](frontend/src/components/ChatBot.tsx) - Updated with media rendering

### Integration Points
- [Admin Dashboard](frontend/src/pages/admin/AdminDashboard.tsx)
- [Student Dashboard](frontend/src/pages/student/StudentDashboard.tsx)

---

## Future Enhancements

1. **Custom Image Uploads**
   - Allow admins to upload custom images
   - Image CDN integration

2. **Advanced Table Features**
   - Sorting and filtering
   - Pagination
   - Data export (CSV, Excel)

3. **Interactive Embeds**
   - Embedded calculators
   - Interactive polls
   - Form submissions

4. **PDF Support**
   - Embed PDF viewers
   - Document downloads

5. **Rich Text Formatting**
   - Code blocks with syntax highlighting
   - Markdown support
   - HTML rendering (with sanitization)

---

## Troubleshooting

### Media Not Displaying

1. **Check URL accessibility**
   ```javascript
   // Verify URL is publicly accessible
   curl -I https://your-image-url.jpg
   ```

2. **Verify CORS headers** (for cross-origin requests)
   ```
   Access-Control-Allow-Origin: *
   ```

3. **Clear browser cache**
   - Press Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### Videos Not Embedding

1. **Verify embed URL format**
   - YouTube: `https://www.youtube.com/embed/VIDEO_ID`
   - Vimeo: `https://player.vimeo.com/video/VIDEO_ID`

2. **Check frame allow attributes**
   ```tsx
   <Box component="iframe" allowFullScreen />
   ```

3. **Test in different browsers**

### Tables Overflow

1. **Reduce column count** - Keep under 5 columns
2. **Use shorter cell content** - Abbreviate where possible
3. **Enable horizontal scroll** - Already built-in

---

## Performance Tips

1. **Lazy load images** - Use placeholder until visible
2. **Optimize image files** - Compress before URL
3. **Cache responses** - Store frequently accessed media
4. **Limit media per response** - Max 3-4 media items
5. **Use efficient formats** - WebP over PNG when possible

---

## Security Considerations

1. **URL Validation** - Only allow trusted domains
2. **XSS Prevention** - Sanitize all user inputs
3. **HTTPS Only** - Use secure URLs for all media
4. **Access Control** - Verify user permissions before showing sensitive media
5. **Rate Limiting** - Prevent abuse of media download endpoints

---

## Testing

### Manual Testing Checklist
- [ ] Images load correctly
- [ ] Links open in new tabs
- [ ] Videos play smoothly
- [ ] Tables display properly on mobile
- [ ] All media renders with correct styling
- [ ] Suggested actions appear after media
- [ ] No console errors

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ⚠️ IE 11 (limited support)

---

## Support

For issues or questions about rich media support:
1. Check the troubleshooting section above
2. Review the file references
3. Test with browser dev tools (F12)
4. Contact your development team

