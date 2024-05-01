import React, { useEffect } from 'react';

const MovingAverage = ({ data, chartRef, period = 14 }) => {
    useEffect(() => {
        if (!chartRef.current || !chartRef.current.chart || data.length < period) {
            console.log("Chart not initialized or insufficient data");
            return;
        }

        const chart = chartRef.current.chart; 
        const maData = calculateMovingAverage(data, period);
        const maSeries = chart.addLineSeries({
            color: 'rgba(255, 87, 51, 0.8)',
            lineWidth: 2,
        });

        maSeries.setData(maData);

        return () => chart.removeSeries(maSeries);
    }, [data, chartRef, period]);

    return null;
};


const calculateMovingAverage = (data, period) => {
    let maData = [];
    for (let i = period - 1; i < data.length; i++) {
        let sum = 0;
        for (let j = 0; j < period; j++) {
            sum += data[i - j].close;
        }
        maData.push({
            time: data[i].time,
            value: sum / period
        });
    }
    return maData;
};

export default MovingAverage;
