import React from 'react';

const MovingAverage = ({ data, type }) => {
    const calculateSMA = (data, period = 14) => {
        if (data.length < period) return [];
        
        return data.slice(period - 1).map((_, index) => {
            let sum = 0;
            for (let i = index; i < index + period; i++) {
                sum += data[i].close;
            }
            return {
                time: data[index + period - 1].time,
                value: sum / period 
            };
        });
    };

    const calculateEMA = (data, period = 14) => {
        if (data.length < period) return [];

        let ema = [{ time: data[0].time, value: data[0].close }]; 
        let multiplier = 2 / (period + 1);

        for (let i = 1; i < data.length; i++) {
            let value = (data[i].close - ema[i - 1].value) * multiplier + ema[i - 1].value;
            ema.push({ time: data[i].time, value });
        }
        return ema;
    };

    const movingAverage = type === 'SMA' ? calculateSMA(data) : calculateEMA(data);


    return (
        <div>
            <h3>{type} Moving Average:</h3>
            <p>Last Value: {movingAverage.length > 0 ? movingAverage[movingAverage.length - 1].value.toFixed(2) : 'N/A'}</p>
        </div>
    );
};

export default MovingAverage;
