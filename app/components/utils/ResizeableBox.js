import React, { useState, useRef, useCallback, useEffect } from 'react';

const ResizableBox = React.memo(({
    children,
    chartHeight,
    setChartHeight,
    volumeChartHeight,
    setVolumeChartHeight,
    indicatorHeight,
    setIndicatorHeight,
  }) => {
    const containerRef = useRef(null);
    const isResizing = useRef(false);
    const startY = useRef(0);
  
  
    const enhancedChildren = React.Children.map(children, (child, index) => {
      const height = index === 0 ? chartHeight : index === 1 ? volumeChartHeight : indicatorHeight;
      return (
        <div key={index} style={{ position: 'relative', height: `${height}px` }}>
          {child}
        </div>
      );
    });
  
    return (
        <div ref={containerRef} style={{ height: '100vh', overflow: 'hidden', position: 'relative' }}>
        {enhancedChildren}
      </div>
    );
  });
  
export default ResizableBox;
