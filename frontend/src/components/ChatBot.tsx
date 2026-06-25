import React, { useEffect } from 'react';

const Chatbot = () => {
  useEffect(() => {
    const scriptId = 'bp-script';
    
    // Only inject if it doesn't exist to prevent duplicates
    if (!document.getElementById(scriptId)) {
      const s = document.createElement('script');
      s.id = scriptId;
      s.src = "https://cdn.botpress.cloud/webchat/v3.6/inject.js";
      s.async = true;
      
      s.onload = () => {
        const c = document.createElement('script');
        c.src = "https://files.bpcontent.cloud/2026/01/05/11/20260105111701-SUGPS0I7.js";
        c.defer = true;
        document.body.appendChild(c);
      };
      
      document.body.appendChild(s);
    }
  }, []);

  return null;
};

export default Chatbot;