import React, { useState, useRef, useEffect } from 'react';

const ResizeHandle = ({ onResize }) => {
    const [isResizing, setIsResizing] = useState(false);

    const resizeHandleRef = useRef(null);
  
    const handleMouseMove = (e) => {
      if (isResizing) {
        onResize(e);
      }
    };
  
    const handleMouseUp = () => {
      setIsResizing(false);
    };
  
    useEffect(() => {
      if (isResizing) {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      } else {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      }
  
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }, [isResizing, onResize]);
  
    const handleMouseDown = (e) => {
      e.preventDefault();
      setIsResizing(true);
    };
  
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        const deltaY = e.key === 'ArrowUp' ? -10 : 10;
        onResize({ clientY: e.clientY + deltaY });
      }
    };
  
    const handleMouseOut = () => {
      setIsResizing(false);
    };
  
    const handleMouseOver = () => {
      if (isResizing) {
        setIsResizing(false);
      }
    };
  
    return (
      <div
        ref={resizeHandleRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        style={{
          height: '10px',
          cursor: 'ns-resize',
          backgroundColor: isResizing ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.5)',
          zIndex: 9999,
          position: 'absolute',
          width: '100%',
          bottom: '-5px',
        }}
        onMouseDown={handleMouseDown}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      ></div>
    );
  };
  
  export default ResizeHandle;
  