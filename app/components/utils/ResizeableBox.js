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

    const handleResize = useCallback(() => {
      if (!containerRef.current) return;
      const totalHeight = containerRef.current.clientHeight;
      const totalAssignedHeight = chartHeight + volumeChartHeight + indicatorHeight;
      const scaleFactor = totalHeight / totalAssignedHeight;
      setChartHeight(Math.floor(chartHeight * scaleFactor));
      setVolumeChartHeight(Math.floor(volumeChartHeight * scaleFactor));
      setIndicatorHeight(Math.floor(indicatorHeight * scaleFactor));
    }, [chartHeight, volumeChartHeight, indicatorHeight, setChartHeight, setVolumeChartHeight, setIndicatorHeight]);

    useEffect(() => {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, [handleResize]);

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

ResizableBox.displayName = 'ResizableBox';

export default ResizableBox;
