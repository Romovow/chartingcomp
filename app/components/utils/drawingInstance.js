import { drawTrendLine } from './drawingFunctions/trendLine';


export const drawFunctions = {
    LineToolTrendLine: drawTrendLine,
    LineToolRectangle: drawTrendLine,
    LineToolEllipse: drawTrendLine,

};

export const executeDrawing = (toolName, chartRef) => {
    if (drawFunctions[toolName] && chartRef) {
        drawFunctions[toolName](chartRef);
    } else {
        console.error("Drawing function not found for tool, or chart reference is missing:", toolName);
    }
};
