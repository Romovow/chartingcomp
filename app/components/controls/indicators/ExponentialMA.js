import React, { useEffect } from 'react';

const ExponentialMA = ({ data, chartRef, period = 14 }) => {
    useEffect(() => {
        if (!chartRef.current || !chartRef.current.chart || data.length < period) {
            console.log("Chart not initialized or insufficient data");
            return;
        }

        const chart = chartRef.current.chart; 
        const emaData = calculateExponentialMA(data, period);
        const emaSeries = chart.addLineSeries({
            color: 'rgba(60, 120, 216, 0.8)', 
            lineWidth: 2,
        });

        emaSeries.setData(emaData);

        return () => chart.removeSeries(emaSeries);
    }, [data, chartRef, period]);

    return null;
};

const calculateExponentialMA = (data, period) => {
    let emaData = [];
    let multiplier = 2 / (period + 1);
    let emaPrev = data[0].close; 

    for (let i = 0; i < data.length; i++) {
        let ema = (data[i].close - emaPrev) * multiplier + emaPrev;
        emaData.push({
            time: data[i].time,
            value: ema
        });
        emaPrev = ema; 
    }
    return emaData;
};

export default ExponentialMA;
