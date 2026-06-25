// backend/utils/bullyingDetection.js
// Detects bullying, harassment, and toxic content in messages

const bullyingKeywords = {
  high: [
    'kill yourself', 'kys', 'you deserve to die', 'go kill yourself',
    'hate you', 'i hate you', 'you suck', 'you\'re stupid',
    'you\'re dumb', 'retard', 'faggot', 'bitch', 'asshole',
    'worthless', 'useless', 'loser', 'ugly', 'fat', 'skinny',
    'nobody likes you', 'everyone hates you', 'go away', 'die',
    'you\'re pathetic', 'you\'re disgusting'
  ],
  medium: [
    'stupid', 'dumb', 'idiot', 'moron', 'jerk', 'annoying',
    'disgusting', 'gross', 'weird', 'freak', 'nerd', 'geek',
    'loser', 'lame', 'sucks', 'hate', 'awful', 'terrible'
  ],
  low: [
    'bad', 'mean', 'rude', 'ugly', 'dull', 'boring', 'sick'
  ]
};

const harasmentPatterns = [
  /repeated.*message|spam/i,
  /threatening/i,
  /blackmail|extort/i,
  /dox|publish.*address|release.*info/i,
  /mocking|making fun/i,
  /insult|disrespect/i,
];

/**
 * Detect bullying severity in a message
 * @param {string} message - The message text to analyze
 * @returns {Object} Detection result with severity, flags, and keywords found
 */
function detectBullying(message) {
  if (!message || typeof message !== 'string') {
    return { severity: 'none', isFlagged: false, keywords: [], reasons: [] };
  }

  const lowerMessage = message.toLowerCase();
  const foundKeywords = [];
  const reasons = [];
  let severity = 'none';

  // Check high-severity keywords
  for (const keyword of bullyingKeywords.high) {
    if (lowerMessage.includes(keyword)) {
      foundKeywords.push(keyword);
      reasons.push(`Contains harmful language: "${keyword}"`);
      severity = 'high';
    }
  }

  // Check medium-severity keywords (only if not already high)
  if (severity !== 'high') {
    for (const keyword of bullyingKeywords.medium) {
      if (lowerMessage.includes(keyword)) {
        foundKeywords.push(keyword);
        if (severity !== 'medium') {
          reasons.push(`Contains negative language: "${keyword}"`);
          severity = 'medium';
        }
      }
    }
  }

  // Check harassment patterns
  if (!severity || severity === 'none' || severity === 'low') {
    for (const pattern of harasmentPatterns) {
      if (pattern.test(message)) {
        reasons.push(`Matches harassment pattern: ${pattern.source}`);
        if (!severity || severity === 'none') {
          severity = 'medium';
        }
      }
    }
  }

  // Check for repeated capitalization (SHOUTING)
  const capsCount = (message.match(/[A-Z]/g) || []).length;
  if (capsCount > message.length * 0.5 && message.length > 5) {
    reasons.push('Message appears to be in all caps (aggressive tone)');
    if (severity === 'none') severity = 'low';
  }

  return {
    severity,
    isFlagged: severity !== 'none',
    keywords: [...new Set(foundKeywords)],
    reasons,
  };
}

module.exports = {
  detectBullying,
};
