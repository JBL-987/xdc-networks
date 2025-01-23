import React, { useState } from 'react';
import { Clipboard, CheckCircle } from 'lucide-react';

interface CopyTextProps {
  text: string;
}

const CopyText: React.FC<CopyTextProps> = ({ text }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000); // Revert back to clipboard icon after 2 seconds
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleRedirect = () => {
    // Redirect to BSC Scan or wallet based on the text (hash)
    const url = text.startsWith('0x') ? `https://bscscan.com/address/${text}` : '#';
    window.location.href = url; // Use window.location.href for redirection
  };

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', position: 'relative' }}>
      <span 
        onClick={handleRedirect} // Redirect on text click
        style={{ cursor: 'pointer', userSelect: 'none', marginRight: '8px', color: 'blue', textDecoration: 'underline' }}
      >
        {text}
      </span>
      <span 
        onClick={handleCopy} 
        onMouseEnter={() => setIsHovered(true)} 
        onMouseLeave={() => setIsHovered(false)} 
        style={{ cursor: 'pointer', position: 'relative' }}
      >
        {isCopied ? <CheckCircle size={16} color="green" /> : <Clipboard size={16} />}
        {isHovered && (
          <span 
            style={{ 
              position: 'absolute', 
              bottom: '100%', 
              left: '50%', 
              transform: 'translateX(-50%)', 
              backgroundColor: 'black', 
              color: 'white', 
              padding: '4px 8px', 
              borderRadius: '4px', 
              whiteSpace: 'nowrap',
              zIndex: 1,
              marginBottom: '4px'
            }}
          >
            Copy Address
          </span>
        )}
      </span>
    </div>
  );
};

export default CopyText;