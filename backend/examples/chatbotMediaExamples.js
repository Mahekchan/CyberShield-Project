/**
 * RICH MEDIA EXAMPLES FOR CHATBOT
 * 
 * This file contains ready-to-use examples of rich media responses
 * Copy and paste these into your knowledge base!
 */

const { createImage, createLink, createVideo, createTable } = require('./mediaUtils');

// ============================================
// STUDENT EXAMPLES
// ============================================

const STUDENT_EXAMPLES = {
  // Example 1: Password Security
  password_security_example: {
    key: 'How do I create a strong password?',
    content: {
      text: `A strong password is your first line of defense against cyber attacks. 
      
Here's what makes a password strong:
• Minimum 12-16 characters
• Mix of uppercase and lowercase letters
• Include numbers and special symbols (!@#$%^&*)
• Avoid personal information (names, birthdates)
• Don't reuse passwords across different accounts

Use a password manager like 1Password or Bitwarden to secure them!`,
      media: [
        createImage(
          'https://via.placeholder.com/400x250?text=Strong+Password+Requirements',
          'password-requirements',
          'Password Security Guidelines'
        ),
        createTable(
          ['Requirement', 'Example', 'Why Important'],
          [
            ['12+ characters', 'MyP@ssw0rd!', 'Harder to crack'],
            ['Uppercase + Lowercase', 'PaSsWoRd', 'Increases complexity'],
            ['Numbers & Symbols', 'Pass123!', 'Prevents dictionary attacks'],
            ['No personal info', 'Not YourName123', 'Prevents social engineering']
          ]
        ),
        createLink(
          'https://haveibeenpwned.com/',
          '🔍 Check if Compromised',
          'See if your password appears in known breaches'
        )
      ]
    }
  },

  // Example 2: Phishing Recognition
  phishing_example: {
    key: 'How do I recognize phishing emails?',
    content: {
      text: `Phishing emails are designed to trick you into revealing sensitive information. 
      
🚨 WARNING SIGNS:
• Urgent language ("Act Now!", "Verify Immediately!")
• Suspicious sender email (checks if it matches official domain)
• Requests for passwords or personal data
• Mismatched URLs (hover over links to see real destination)
• Poor grammar, spelling, or formatting
• Generic greetings ("Dear User" vs. your actual name)

✅ WHAT TO DO:
1. Don't click links or download attachments from unknown senders
2. Verify sender by contacting them through official channels
3. Report suspicious emails to your administrator
4. Forward to your IT security team

Remember: When in doubt, reach out to your admin!`,
      media: [
        createImage(
          'https://via.placeholder.com/500x300?text=Phishing+Email+Example',
          'phishing-example',
          'Example of Phishing Email'
        ),
        createTable(
          ['Red Flag', 'Safe Version', 'Phishing Version'],
          [
            ['Sender Email', 'noreply@company.com', 'noreply@companyy.com'],
            ['Greeting', 'Hello John', 'Dear User'],
            ['Link Text', 'company.com', 'Click here (but points elsewhere)'],
            ['Request', 'None', 'Verify your password']
          ]
        ),
        createLink(
          'https://www.fbi.gov/investigation/cyber/phishing',
          '🛡️ FBI Phishing Guide',
          'Official FBI guide on phishing prevention'
        )
      ]
    }
  },

  // Example 3: Two-Factor Authentication
  two_factor_example: {
    key: 'What is two-factor authentication (2FA)?',
    content: {
      text: `Two-Factor Authentication (2FA) adds an extra layer of security to your accounts.

Instead of just using a password, you also provide:
1. Something you KNOW (your password)
2. Something you HAVE (your phone, security key)
3. Something you ARE (your fingerprint)

This means even if someone has your password, they can't access your account without the second factor!

🎯 SETUP STEPS:
1. Go to your account settings
2. Find "Security" or "Two-Factor Authentication"
3. Choose your method (SMS, App, Backup Codes)
4. Follow the setup wizard
5. Save backup codes in a safe place

🔐 RECOMMENDED METHODS (in order of security):
1. Hardware security keys (YubiKey, etc.)
2. Authenticator apps (Google Authenticator, Microsoft Authenticator)
3. SMS codes (least secure but still good)`,
      media: [
        createImage(
          'https://via.placeholder.com/400x300?text=2FA+Security+Flow',
          '2fa-flow',
          'How Two-Factor Authentication Works'
        ),
        createTable(
          ['Method', 'Security Level', 'Convenience', 'Cost'],
          [
            ['Hardware Key', 'Critical', 'Medium', 'Paid'],
            ['Authenticator App', 'High', 'Good', 'Free'],
            ['SMS Code', 'Medium', 'Good', 'Free'],
            ['Email Code', 'Medium', 'Medium', 'Free']
          ]
        ),
        createLink(
          'https://www.microsoft.com/en-us/security/business/security-awareness/what-is-two-factor-authentication-2fa',
          '📖 Microsoft 2FA Guide',
          'Comprehensive guide to 2FA setup and best practices'
        ),
        createLink(
          'https://authy.com/',
          '🔐 Download Authy App',
          'Popular free authenticator app with cloud backup'
        )
      ]
    }
  }
};

// ============================================
// ADMIN EXAMPLES
// ============================================

const ADMIN_EXAMPLES = {
  // Example 1: User Account Management
  user_management_example: {
    key: 'How do I manage student accounts?',
    content: {
      text: `As an admin, you have several tools to manage student accounts:

📊 ACCOUNT MANAGEMENT ACTIONS:
• VIEW: Monitor account activity and status
• SUSPEND: Temporarily restrict access (reversible)
• DELETE: Permanently remove account (non-reversible)
• RESET: Force password reset on next login
• EXPORT: Download user data for reports

⚠️ IMPORTANT GUIDELINES:
1. Always document reasons for any account action
2. Notify students before suspending (when appropriate)
3. Keep suspension logs for audit purposes
4. Never share personal student data externally
5. Follow your institution's privacy policies

🔄 ACCOUNT STATES:
• Active: Full platform access
• Suspended: No access, account preserved
• Deleted: Permanent removal, data archived
• Locked: User attempted too many logins`,
      media: [
        createImage(
          'https://via.placeholder.com/500x300?text=User+Management+Interface',
          'user-management',
          'User Management Dashboard'
        ),
        createTable(
          ['Action', 'Effect', 'Reversible', 'When to Use'],
          [
            ['View', 'See activity only', 'N/A', 'Monitor users'],
            ['Suspend', 'Restrict access', 'Yes', 'Violations, policy breach'],
            ['Reset Password', 'Force new password', 'Yes', 'Account security'],
            ['Delete', 'Remove permanently', 'No', 'Last resort only'],
            ['Export', 'Download data', 'N/A', 'Reports, audits']
          ]
        ),
        createLink(
          'https://www.educause.edu/library/article/current-best-practices-student-account-management',
          '📋 EDUCAUSE Best Practices',
          'Educational institution account management guidelines'
        )
      ]
    }
  },

  // Example 2: Alert Response Procedures
  alert_response_example: {
    key: 'How do I respond to security alerts?',
    content: {
      text: `Effective alert response is critical for platform security.

⚡ ALERT SEVERITY LEVELS:

CRITICAL (🔴 Respond in < 1 hour)
• Unauthorized access attempts
• Data breach indicators
• System compromises
• Immediate administrator involvement required

HIGH (🟠 Respond in < 4 hours)
• Multiple failed login attempts
• Suspicious behavior patterns
• Policy violations
• Requires investigation

MEDIUM (🟡 Respond in < 24 hours)
• Unusual account activity
• Configuration changes
• Compliance alerts
• Document and monitor

LOW (🟢 Respond in < 72 hours)
• Information-only alerts
• Routine system notifications
• Archive and review periodically

📋 RESPONSE CHECKLIST:
1. [ ] Acknowledge the alert immediately
2. [ ] Assess severity and impact
3. [ ] Initiate investigation
4. [ ] Document findings
5. [ ] Take corrective action
6. [ ] Notify relevant stakeholders
7. [ ] Update incident log
8. [ ] Schedule follow-up`,
      media: [
        createImage(
          'https://via.placeholder.com/500x300?text=Alert+Response+Process',
          'alert-response',
          'Alert Response Timeline'
        ),
        createTable(
          ['Level', 'Response Time', 'Impact', 'Action Required'],
          [
            ['Critical', '< 1 hour', 'High', 'Immediate investigation'],
            ['High', '< 4 hours', 'Medium', 'Prompt review'],
            ['Medium', '< 24 hours', 'Low', 'Standard investigation'],
            ['Low', '< 72 hours', 'Minimal', 'Document and archive']
          ]
        ),
        createLink(
          'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf',
          '📖 NIST Incident Response Guide',
          'Computer Security Incident Handling guide (NIST SP 800-61 Rev. 2)'
        )
      ]
    }
  },

  // Example 3: Compliance Requirements
  compliance_example: {
    key: 'What are our compliance requirements?',
    content: {
      text: `Educational platforms must comply with multiple regulatory frameworks:

🔐 KEY COMPLIANCE STANDARDS:

GDPR (General Data Protection Regulation)
• Applies to EU residents' data
• Requires explicit consent for data processing
• Right to be forgotten provisions
• Data breach notification within 72 hours

FERPA (Family Educational Rights and Privacy Act)
• Protects student educational records
• Parents have access rights
• Limits third-party data sharing
• Student privacy by default

COPPA (Children's Online Privacy Protection Act)
• Protects children under 13
• Requires parental consent
• Strict data collection limits
• No behavioral advertising

CCPA (California Consumer Privacy Act)
• Applies to California residents
• Consumer rights to data access and deletion
• Opt-out of data sales
• Privacy policy requirements

📋 COMPLIANCE CHECKLIST:
• [ ] Privacy policy is current and accurate
• [ ] Data retention policies are documented
• [ ] User consent is properly obtained
• [ ] Third-party data sharing is authorized
• [ ] Breach notification procedures exist
• [ ] Staff training is up-to-date
• [ ] Regular audits are conducted
• [ ] Incident response plan is tested`,
      media: [
        createTable(
          ['Standard', 'Applies to', 'Key Requirement', 'Penalty'],
          [
            ['GDPR', 'EU residents', 'Data consent', 'Up to €20M'],
            ['FERPA', 'US students', 'Privacy protection', 'Federal action'],
            ['COPPA', 'Children <13', 'Parental consent', 'Up to $43k/violation'],
            ['CCPA', 'CA residents', 'Data rights', 'Up to $7,500/violation']
          ]
        ),
        createLink(
          'https://gdpr-info.eu/',
          '✅ GDPR Compliance Portal',
          'Complete GDPR regulations and guidance'
        ),
        createLink(
          'https://www2.ed.gov/policy/gen/guid/fpco/ferpa/',
          '📚 US Dept of Education FERPA',
          'Official FERPA regulations and resources'
        )
      ]
    }
  }
};

// ============================================
// HOW TO USE THESE EXAMPLES
// ============================================

/**
 * COPY AND PASTE INTO backend/controllers/chatbotController.js
 * 
 * Example:
 * 
 * const KNOWLEDGE_BASE = {
 *   student: {
 *     ...STUDENT_EXAMPLES.password_security_example.content,
 *     // Or use like this:
 *     'How do I create a strong password?': STUDENT_EXAMPLES.password_security_example.content,
 *   },
 *   admin: {
 *     'How do I manage student accounts?': ADMIN_EXAMPLES.user_management_example.content,
 *   }
 * };
 */

module.exports = {
  STUDENT_EXAMPLES,
  ADMIN_EXAMPLES,
};
