import React, { useState, useRef, useEffect } from 'react';

const ResizeHandle = ({ onResize }) => {
  const [isResizing, setIsResizing] = useState(false);
  const [lastTouchY, setLastTouchY] = useState(null);

  const resizeHandleRef = useRef(null);

  const handleMouseMove = (e) => {
    if (isResizing) {
      onResize(e);
    }
  };

  const handleTouchMove = (e) => {
    if (isResizing) {
      document.body.style.overflow = 'hidden';

      const touchY = e.touches[0].clientY;
      if (lastTouchY !== null) {
        const deltaY = touchY - lastTouchY;
        onResize({ clientY: e.clientY + deltaY });
      }
      setLastTouchY(touchY);
    }
  };

  const handleTouchEnd = () => {
    setIsResizing(false);
    setLastTouchY(null);

    document.body.style.overflow = '';
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd, { passive: false });
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isResizing, onResize]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleTouchStart = (e) => {
    e.stopPropagation(); 
    setIsResizing(true);
    setLastTouchY(e.touches[0].clientY);
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
      onTouchStart={handleTouchStart}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    ></div>
  );
};

export default ResizeHandle;
