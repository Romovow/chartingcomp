// drawingInstance.js
import React from 'react';
import TrendLine from './drawingFunctions/trendLine';

export const drawFunctions = {
    LineToolTrendLine: (canvasRef) => <TrendLine canvasRef={canvasRef} />,
   
};
