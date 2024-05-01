import React, { useEffect } from 'react';

const BollingerBands = ({ data, chartRef, period = 20, multiplier = 2 }) => {
    useEffect(() => {
        if (!chartRef.current || !chartRef.current.chart || data.length < period) {
            console.log("Chart not initialized or insufficient data");
            return;
        }

        const chart = chartRef.current.chart;
        const { upperBand, middleBand, lowerBand } = calculateBollingerBands(data, period, multiplier);

        const upperSeries = chart.addLineSeries({
            color: 'rgba(255, 0, 0, 0.8)',
            lineWidth: 1,
        });
        const middleSeries = chart.addLineSeries({
            color: 'rgba(0, 120, 255, 0.8)',
            lineWidth: 1,
        });
        const lowerSeries = chart.addLineSeries({
            color: 'rgba(0, 255, 0, 0.8)',
            lineWidth: 1,
        });

        upperSeries.setData(upperBand);
        middleSeries.setData(middleBand);
        lowerSeries.setData(lowerBand);

        return () => {
            chart.removeSeries(upperSeries);
            chart.removeSeries(middleSeries);
            chart.removeSeries(lowerSeries);
        };
    }, [data, chartRef, period, multiplier]);

    return null;
};

const calculateBollingerBands = (data, period, multiplier) => {
    let ma = calculateMovingAverage(data, period);
    let stdDev = calculateStandardDeviation(data, ma, period);

    let upperBand = ma.map((point, index) => ({
        time: point.time,
        value: point.value + stdDev[index].value * multiplier
    }));

    let lowerBand = ma.map((point, index) => ({
        time: point.time,
        value: point.value - stdDev[index].value * multiplier
    }));

    return { upperBand, middleBand: ma, lowerBand };
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

const calculateStandardDeviation = (data, ma, period) => {
    let stdDevData = [];
    for (let i = period - 1; i < data.length; i++) {
        let sumOfSquares = 0;
        for (let j = 0; j < period; j++) {
            sumOfSquares += Math.pow(data[i - j].close - ma[i - period + 1].value, 2);
        }
        let variance = sumOfSquares / period;
        stdDevData.push({
            time: data[i].time,
            value: Math.sqrt(variance)
        });
    }
    return stdDevData;
};

export default BollingerBands;
