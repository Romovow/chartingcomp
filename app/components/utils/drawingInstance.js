// drawingInstance.js
import React from 'react';
import TrendLine from './drawingFunctions/trendLine';

export const drawFunctions = {
    LineToolTrendLine: (canvasRef, chartRef, endDrawingCallback) => (
    <TrendLine
      canvasRef={canvasRef}
      chartRef={chartRef}
      endDrawingCallback={endDrawingCallback}
    />
  ),
};
