// src/utils/drawingFunctions/trendLine.js
import { createPriceLine } from 'lightweight-charts';

export const drawTrendLine = (chart) => {
    if (!chart) {
        console.error("No chart reference provided for drawing.");
        return;
    }

    let lineSeries = chart.addLineSeries({
        color: 'blue',
        lineWidth: 2,
    });

    let startPrice = null;
    let endPrice = null;

    const handleMouseDown = (param) => {
        if (!param.time) return;
        startPrice = { time: param.time, value: param.price };
    };

    const handleMouseUp = (param) => {
        if (!param.time || !startPrice) return;
        endPrice = { time: param.time, value: param.price };

        lineSeries.setData([startPrice, endPrice]);

        // Reset
        startPrice = null;
        endPrice = null;
    };

    chart.subscribeClick(handleMouseDown);
    chart.subscribeClick(handleMouseUp);
};
