// CyberShield AI - Role-based Intelligent Assistant
// For Cyberbullying Detection and Alert System in School Environments
// Ensures role-based access, ethical responses, and student privacy protection

const SYSTEM_PROMPT_STUDENT = `You are CyberShield AI, a supportive and ethical assistant for students in a cyberbullying detection system.

Your role:
- Help students report bullying, harassment, or threats safely
- Provide resources for mental health and support
- Explain how CyberShield detects harmful messages (transparent, non-threatening)
- Guide students through reporting (anonymous or direct) 
- Offer cyber safety tips and best practices
- Prioritize student safety and confidentiality

Guidelines:
- Always be empathetic and supportive
- Never shame or blame students
- Encourage reaching out to trusted adults
- Respect student privacy—never share personal data
- Explain the system clearly without technical jargon
- Provide actionable, step-by-step guidance`;

const SYSTEM_PROMPT_ADMIN = `You are CyberShield AI, an efficient and professional assistant for school administrators.

Your role:
- Help administrators monitor alerts and flagged messages
- Guide incident response and escalation procedures
- Provide analytics and reporting features
- Explain detection methods and system capabilities
- Assist with user management and account settings
- Support compliance and documentation

Guidelines:
- Provide clear, factual information only
- Respect student privacy—never share unnecessary details
- Focus on actionable insights and trends
- Explain system capabilities transparently
- Guide proper incident handling and documentation
- Support ethical decision-making in moderation`;

/**
 * Generate a local AI response using role-based templates and heuristics.
 * Ensures ethical, supportive, and role-appropriate guidance.
 */
function generateAIResponse(userMessage, userType, conversationHistory = []) {
  const message = (userMessage || '').trim();
  const history = Array.isArray(conversationHistory) ? conversationHistory : [];

  // Validate user type
  const isStudent = userType === 'student';
  const isAdmin = userType === 'admin';

  // Basic normalization
  const lower = message.toLowerCase();

  // Helper to build a formatted multi-paragraph reply
  const buildReply = (paragraphs = []) => paragraphs.filter(Boolean).join('\n\n');

  // ========== STUDENT RESPONSES ==========
  if (isStudent) {
    // Bullying / insult / harassment - PRIORITY: Empathetic & Supportive
    if (/(insult|bully|bullying|mean|harass|hurt|threat|abuse|cyberbully)/i.test(lower)) {
      const paragraphs = [
        "I'm really sorry that you received a hurtful message — that can be upsetting and distressing. Please know that harmful online comments don't define your worth, and you're not alone. Many students experience this, and support is available.",
        "CyberShield is here to help: Our system detects harmful or abusive messages in real time and can alert trusted school staff or allow you to submit an anonymous report. If you're feeling unsafe or overwhelmed, please reach out to a trusted adult or school counselor right away.",
        "What would help most? I can guide you through: (1) creating a safe, anonymous report, (2) collecting evidence (screenshots), (3) tips for responding or staying safe online, or (4) mental health resources. You choose.",
      ];

      return {
        reply: buildReply(paragraphs),
        suggestedActions: ['Report this incident', 'Collect evidence', 'Get mental health resources', 'Talk to a trusted adult'],
        media: [],
      };
    }

    // Reporting concerns - PRIORITY: Clear guidance & safety
    if (/(report|anonymous|submit|urgent|threat|unsafe|emergency)/i.test(lower)) {
      const paragraphs = [
        "You can safely report concerning messages through CyberShield in two ways:",
        "1. **Anonymous Report**: Report without revealing your identity. This is completely confidential and safe.",
        "2. **Direct Report**: Include your identity so school staff can reach out to you for more context.",
        "When you report, include: the harmful message, when it happened, who sent it, and any screenshots. School staff will review your report quickly and take appropriate action to keep you safe.",
        "If this is an immediate emergency or threat to safety, please contact a school administrator or emergency services right away.",
      ];

      return {
        reply: buildReply(paragraphs),
        suggestedActions: ['Report Anonymously', 'Submit Direct Report', 'Emergency Support', 'Contact a Staff Member'],
        media: [],
      };
    }

    // Security / account safety
    if (/(password|2fa|two[- ]factor|security|safe|phish|account)/i.test(lower)) {
      const paragraphs = [
        "Keeping your account secure protects your privacy and safety. Here's what to do:",
        "• **Strong Password**: Use 12+ characters with uppercase, lowercase, numbers, and symbols. Never share it.",
        "• **Two-Factor Authentication (2FA)**: Enable it to add an extra security layer. Even if someone gets your password, they can't access your account.",
        "• **Suspicious Links**: Never click links from unknown senders or download unexpected files.",
        "• **If Compromised**: Change your password immediately and contact school IT support.",
      ];

      return {
        reply: buildReply(paragraphs),
        suggestedActions: ['Update Password', 'Enable 2FA', 'Learn about phishing', 'Report suspicious activity'],
        media: [],
      };
    }

    // Privacy / data protection
    if (/(privacy|data|personal information|anonymous|private|confidential|gdpr)/i.test(lower)) {
      const paragraphs = [
        "Your privacy and confidentiality are fundamental to CyberShield.",
        "• **Data Protection**: We use secure encryption to protect all your information.",
        "• **Limited Access**: Only authorized school staff can view your reports and account data.",
        "• **Anonymity Option**: You can report bullying completely anonymously—your identity is protected.",
        "• **No Sharing**: We never share your personal data with third parties without permission.",
        "Questions about how your data is handled? Contact your school administrator or data privacy officer.",
      ];

      return {
        reply: buildReply(paragraphs),
        suggestedActions: ['Privacy Settings', 'Learn about encryption', 'Contact privacy officer', 'View privacy policy'],
        media: [],
      };
    }

    // Platform help / how to use
    if (/(what is|how does|how to|platform|shieldchat|features|help|guide)/i.test(lower)) {
      const paragraphs = [
        "**ShieldChat** is part of CyberShield, a system designed to detect harmful messages and keep students safe.",
        "Key features:",
        "• **Real-time Detection**: Harmful messages are detected automatically, and staff are alerted.",
        "• **Safe Reporting**: Report bullying anonymously or directly—you control who knows.",
        "• **Resources**: Access mental health resources, security tips, and support information.",
        "• **Confidential**: Your reports and conversations are private and protected.",
        "What would you like help with? I can guide you through reporting, account settings, privacy, or security.",
      ];

      return {
        reply: buildReply(paragraphs),
        suggestedActions: ['How to report', 'Security tips', 'Privacy settings', 'Mental health resources'],
        media: [],
      };
    }
  }

  // ========== ADMIN RESPONSES ==========
  if (isAdmin) {
    // Alert monitoring / incident response
    if (/(alert|incident|flagged|response|escalate|action|monitor)/i.test(lower)) {
      const paragraphs = [
        "**Alert Management & Incident Response:**",
        "1. **Review Alerts**: Check the real-time alerts dashboard for flagged messages by severity.",
        "2. **Assess Context**: Review the full conversation and user history before taking action.",
        "3. **Document**: Record the incident details, your assessment, and actions taken.",
        "4. **Escalate if Needed**: For serious threats or safety concerns, escalate to school leadership immediately.",
        "5. **Follow Up**: Ensure student safety and provide support resources when appropriate.",
        "Always prioritize student safety and follow your school's incident response protocol.",
      ];

      return {
        reply: buildReply(paragraphs),
        suggestedActions: ['View alerts', 'Review flagged messages', 'Escalation protocol', 'Incident documentation'],
        media: [],
      };
    }

    // User management / student accounts
    if (/(user|student|account|manage|suspend|delete|access|permission)/i.test(lower)) {
      const paragraphs = [
        "**User Management Guidelines:**",
        "• **View Users**: Access student accounts and activity history (authorized staff only).",
        "• **Suspend/Restrict**: Temporarily restrict access if a student violates policies. Document the reason.",
        "• **Disable Account**: Permanently remove accounts when students graduate or leave. Archive their data per policy.",
        "• **Permissions**: Ensure only authorized staff have admin access. Review access logs regularly.",
        "• **Privacy**: Never share student data unnecessarily. Follow FERPA and local privacy regulations.",
        "Always document account actions and maintain an audit trail.",
      ];

      return {
        reply: buildReply(paragraphs),
        suggestedActions: ['Manage users', 'View access logs', 'Update permissions', 'Archive data'],
        media: [],
      };
    }

    // Analytics / reporting
    if (/(analytic|report|trend|statistic|data|metric|dashboard)/i.test(lower)) {
      const paragraphs = [
        "**Analytics & Reporting:**",
        "• **Trends**: Monitor patterns in flagged messages—common times, types of harassment, affected groups.",
        "• **Response Times**: Track how quickly incidents are resolved and staff respond.",
        "• **Feedback**: Review student feedback on chatbot responses to improve the system.",
        "• **Reports**: Generate summaries for school leadership on system activity and outcomes.",
        "• **Privacy**: Never include identifying student information in public reports. Use aggregated, anonymized data.",
        "Use insights to improve detection, train staff, and enhance student safety protocols.",
      ];

      return {
        reply: buildReply(paragraphs),
        suggestedActions: ['View dashboard', 'Generate reports', 'Export analytics', 'Review trends'],
        media: [],
      };
    }

    // System capabilities / transparency
    if (/(how does|detection|algorithm|model|system|capability|explainability)/i.test(lower)) {
      const paragraphs = [
        "**System Transparency & Capabilities:**",
        "CyberShield uses advanced content analysis to detect harmful messages (bullying, threats, harassment, abuse).",
        "• **What It Does**: Scans messages for harmful language, intent, and context patterns. Alerts staff to potential threats.",
        "• **What It Doesn't Do**: It's not perfect. False positives and false negatives can occur. Always use human judgment.",
        "• **Why Transparency Matters**: Students and staff deserve to know how the system works, its limitations, and that humans make final decisions.",
        "• **Safeguards**: Staff review all flagged content before taking action. No automated blocking or punishment.",
        "Questions about system design or limitations? I'm here to explain clearly and honestly.",
      ];

      return {
        reply: buildReply(paragraphs),
        suggestedActions: ['System limitations', 'Detection accuracy', 'Staff training', 'Policy guidelines'],
        media: [],
      };
    }
  }

  // ========== DEFAULT RESPONSES (Both roles) ==========
  const defaultParagraphs = isStudent
    ? [
        "Hi there — thanks for reaching out! I'm here to help with:",
        "• Reporting bullying, harassment, or threats safely (anonymous or direct)",
        "• Understanding how CyberShield protects you",
        "• Security and privacy tips",
        "• Mental health resources and support",
        "What's on your mind? I'm here to listen and help.",
      ]
    : [
        "Hello — I'm ready to assist with:",
        "• Alert monitoring and incident response",
        "• User management and account administration",
        "• Analytics, reporting, and system insights",
        "• Detection transparency and system capabilities",
        "• Compliance and documentation",
        "What do you need help with?",
      ];

  return {
    reply: buildReply(defaultParagraphs),
    suggestedActions: isStudent
      ? ['How to report', 'Security tips', 'Get support', 'Learn about CyberShield']
      : ['View alerts', 'Manage users', 'Generate reports', 'System capabilities'],
    media: [],
  };
}

function generateSuggestedActions(userMessage, userType) {
  // Reuse same heuristics as generateAIResponse for consistency
  const msg = (userMessage || '').toLowerCase();
  if (/(insult|bully|bullying|harass|threat|abuse)/i.test(msg)) {
    return ['Report this incident', 'Collect evidence (screenshots)', 'Contact a trusted adult'];
  }
  if (/(password|security|2fa|phish|phishing)/i.test(msg)) {
    return ['Update Password', 'Enable 2FA', 'Security Tips'];
  }
  if (/(privacy|data|anonymous|gdpr)/i.test(msg)) {
    return ['Learn about privacy', 'Manage settings', 'Contact Administrator'];
  }
  return ['How to report', 'Security tips', 'Platform help'];
}

function isOpenAIConfigured() {
  // Local mode: no external AI required
  return false;
}

module.exports = {
  generateAIResponse,
  generateSuggestedActions,
  isOpenAIConfigured,
};
