import { drawTrendLine } from './drawingFunctions/trendLine';

// Import other drawing functions as needed

export const drawFunctions = {
    LineToolTrendLine: drawTrendLine,
    LineToolRectangle: drawTrendLine,
    LineToolEllipse: drawTrendLine,
    // Map other tools to their respective functions
};

export const executeDrawing = (toolName, chart) => {
    if (drawFunctions[toolName]) {
        drawFunctions[toolName](chart);
    } else {
        console.error("Drawing function not found for tool:", toolName);
    }
};