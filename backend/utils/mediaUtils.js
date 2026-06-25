/**
 * Media Utility Functions for Rich Content Responses
 * Provides helpers to create images, links, videos, and tables
 */

// Create an image media object
const createImage = (url, alt = '', title = '') => ({
  type: 'image',
  url,
  alt,
  title,
});

// Create a link media object
const createLink = (url, title = '', description = '') => ({
  type: 'link',
  url,
  title,
  description,
});

// Create a video embed object
const createVideo = (url, title = '') => ({
  type: 'video',
  url,
  title,
});

// Create a table media object
const createTable = (headers, rows) => ({
  type: 'table',
  data: {
    headers,
    rows,
  },
});

// Response templates with rich media
const MEDIA_RESPONSES = {
  student: {
    // Security tips with resources
    security_resources: {
      media: [
        createImage(
          'https://via.placeholder.com/400x250?text=Cyber+Security+Tips',
          'cyber-security-tips',
          'Essential Security Tips'
        ),
        createLink(
          'https://www.ncsc.gov.uk/collection/mobile-device-guidance',
          '🛡️ NCSC Mobile Security Guide',
          'Official UK government cyber security guidance'
        ),
        createLink(
          'https://www.staysafeonline.org/',
          '🔐 Stay Safe Online',
          'Educational resources on cyber safety'
        ),
      ],
    },

    // Reporting guidelines with visual table
    reporting_guide: {
      media: [
        createTable(
          ['Report Type', 'When to Use', 'Visibility'],
          [
            ['Anonymous Report', 'Sensitive/private concerns', 'Admin only'],
            ['Direct Report', 'Identified issues', 'Admin + Tracked'],
            ['Urgent Report', 'Immediate threats', 'Admin + Priority'],
          ]
        ),
        createLink(
          'https://www.cybertipline.org/',
          '🚨 CyberTipline',
          'National center for missing & exploited children'
        ),
      ],
    },

    // Password security
    password_security: {
      media: [
        createImage(
          'https://via.placeholder.com/400x200?text=Strong+Password+Requirements',
          'password-requirements',
          'How to Create Strong Passwords'
        ),
        createTable(
          ['Requirement', 'Example', 'Importance'],
          [
            ['Minimum 12 characters', 'MyP@ssw0rd!', 'Critical'],
            ['Mix of cases', 'MyPassword', 'High'],
            ['Numbers & symbols', 'P@ssw0rd1!', 'High'],
            ['Avoid personal info', 'Not: YourName123', 'Medium'],
          ]
        ),
      ],
    },

    // Phishing awareness
    phishing_awareness: {
      media: [
        createImage(
          'https://via.placeholder.com/400x300?text=Phishing+Email+Example',
          'phishing-example',
          'How to Spot Phishing Emails'
        ),
        createLink(
          'https://www.anti-phishing.org/',
          '⚠️ Anti-Phishing Working Group',
          'Learn about phishing tactics and protection'
        ),
      ],
    },
  },

  admin: {
    // User management dashboard
    user_management: {
      media: [
        createTable(
          ['Action', 'Purpose', 'Reversible'],
          [
            ['View', 'Monitor student activity', 'Yes'],
            ['Suspend', 'Restrict access temporarily', 'Yes'],
            ['Delete', 'Permanently remove account', 'No'],
          ]
        ),
        createLink(
          'https://www.isa.org/standards/',
          '📋 ISA Standards Reference',
          'Industrial security administration standards'
        ),
      ],
    },

    // Alert monitoring guide
    alert_monitoring: {
      media: [
        createImage(
          'https://via.placeholder.com/400x250?text=Alert+Dashboard',
          'alert-dashboard',
          'Alert Monitoring Dashboard'
        ),
        createTable(
          ['Alert Level', 'Response Time', 'Action Required'],
          [
            ['Critical', '< 1 hour', 'Immediate investigation'],
            ['High', '< 4 hours', 'Prompt review'],
            ['Medium', '< 24 hours', 'Standard review'],
            ['Low', '< 72 hours', 'Log for analysis'],
          ]
        ),
      ],
    },

    // Incident response
    incident_response: {
      media: [
        createLink(
          'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf',
          '📖 NIST Incident Handling Guide',
          'Computer Security Incident Handling Guide'
        ),
        createTable(
          ['Phase', 'Duration', 'Key Activities'],
          [
            ['Preparation', 'Ongoing', 'Tools, training, documentation'],
            ['Detection', 'Minutes-Hours', 'Identify incident'],
            ['Containment', 'Hours-Days', 'Stop spread, preserve evidence'],
            ['Recovery', 'Days-Weeks', 'Restore systems'],
          ]
        ),
      ],
    },

    // Compliance checklist
    compliance: {
      media: [
        createTable(
          ['Standard', 'Requirement', 'Status'],
          [
            ['GDPR', 'Data protection & privacy', 'Implemented'],
            ['FERPA', 'Student records privacy', 'Implemented'],
            ['COPPA', 'Children online privacy', 'Applicable'],
          ]
        ),
        createLink(
          'https://www.gdprregistry.org/',
          '✅ GDPR Compliance Tool',
          'Interactive GDPR compliance checking'
        ),
      ],
    },
  },
};

module.exports = {
  createImage,
  createLink,
  createVideo,
  createTable,
  MEDIA_RESPONSES,
};
