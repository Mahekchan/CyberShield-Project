import React from "react";

interface PrivacyPolicyModalProps {
  isOpen: boolean; // Controls whether the modal is visible
  onClose: () => void; // Function to call when the modal should be closed
  policyContent: string; // The HTML content of the privacy policy
}

/**
 * PrivacyPolicyModal component displays the privacy policy content in a modal window.
 * It provides an overlay to dim the background and a close button.
 *
 * @param {object} props - Component props.
 * @param {boolean} props.isOpen - If true, the modal is visible.
 * @param {function} props.onClose - Callback function to close the modal.
 * @param {string} props.policyContent - The HTML string content of the privacy policy.
 */
const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
  policyContent,
}) => {
  // If the modal is not open, return null to render nothing
  if (!isOpen) return null;

  // Style for the modal overlay, covering the entire viewport
  const overlayStyle: React.CSSProperties = {
    position: "fixed", // Fixed position relative to the viewport
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Semi-transparent black background
    display: "flex", // Use flexbox to center the modal content
    justifyContent: "center", // Center horizontally
    alignItems: "center", // Center vertically
    zIndex: 1000, // Ensure the modal is on top of other elements
    padding: "20px", // Add some padding around the modal on smaller screens
  };

  // Style for the modal content box
  const modalContentStyle: React.CSSProperties = {
    backgroundColor: "#fff", // White background for the content area
    padding: "30px", // Padding inside the content box
    borderRadius: "12px", // Rounded corners for a softer look
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.3)", // Shadow for depth
    maxWidth: "700px", // Maximum width of the modal
    width: "90%", // Responsive width: 90% of parent (overlay) width
    maxHeight: "80vh", // Maximum height of the modal (80% of viewport height)
    overflowY: "auto", // Enable vertical scrolling if content exceeds maxHeight
    position: "relative", // Needed for absolute positioning of the close button
    fontFamily: "'Inter', sans-serif", // Font family for the content
    color: "#333", // Default text color
  };

  // Style for the close button
  const closeButtonStyle: React.CSSProperties = {
    position: "absolute", // Position absolutely within the modal content box
    top: "15px", // Distance from the top edge
    right: "15px", // Distance from the right edge
    background: "none", // No background fill
    border: "none", // No border
    fontSize: "24px", // Large font size for visibility
    cursor: "pointer", // Pointer cursor on hover
    color: "#555", // Color of the close icon
    fontWeight: "bold", // Bold text
    padding: "5px", // Padding for easier clicking
    lineHeight: "1", // Ensure consistent line height for the 'x'
  };

  return (
    <div style={overlayStyle} onClick={onClose}> {/* Click on overlay to close modal */}
      <div
        style={modalContentStyle}
        // Prevent clicks inside the modal content from bubbling up to the overlay and closing the modal
        onClick={(e) => e.stopPropagation()}
      >
        <button
          style={closeButtonStyle}
          onClick={onClose}
          aria-label="Close privacy policy" // Accessibility: describes button purpose for screen readers
        >
          &times; {/* HTML entity for multiplication sign, commonly used as a close icon */}
        </button>
        {/*
          Render policy content using dangerouslySetInnerHTML.
          This is used because the policyContent is a pre-formatted HTML string.
          WARNING: Only use with trusted content to prevent Cross-Site Scripting (XSS) vulnerabilities.
          For dynamic or untrusted content, a Markdown rendering library that sanitizes HTML is recommended.
        */}
        <div dangerouslySetInnerHTML={{ __html: policyContent }} />
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;