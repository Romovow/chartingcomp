import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

const RSI = ({ data, period = 14, containerRef }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current || data.length < period) {
            console.log("Container not initialized or insufficient data");
            return;
        }

        const chart = createChart(containerRef.current, {
            width: containerRef.current.clientWidth,
            height: 150, // Set a fixed height for the RSI chart
            layout: {
                backgroundColor: '#000000',
                textColor: '#d1d4dc',
            },
            grid: {
                vertLines: {
                    color: '#334158',
                },
                horzLines: {
                    color: '#334158',
                },
            },
            priceScale: {
                autoScale: true,
            },
            timeScale: {
                borderVisible: false,
            },
        });

        const rsiSeries = chart.addLineSeries({
            color: 'rgba(0, 150, 136, 0.8)',
            lineWidth: 2,
        });

        const rsiData = calculateRSI(data, period);
        rsiSeries.setData(rsiData);

        chartRef.current = chart;

        return () => {
            chart.remove();
        };
    }, [data, containerRef, period]);

    return null;
};

const calculateRSI = (data, period) => {
    let rsiData = [];
    let gains = 0;
    let losses = 0;

    for (let i = 1; i < period; i++) {
        const change = data[i].close - data[i - 1].close;
        if (change >= 0) {
            gains += change;
        } else {
            losses -= change;
        }
    }

    let avgGain = gains / period;
    let avgLoss = losses / period;

    for (let i = period; i < data.length; i++) {
        const change = data[i].close - data[i - 1].close;
        if (change > 0) {
            avgGain = (avgGain * (period - 1) + change) / period;
            avgLoss = (avgLoss * (period - 1)) / period;
        } else {
            avgGain = (avgGain * (period - 1)) / period;
            avgLoss = (avgLoss * (period - 1) - change) / period;
        }

        const rs = avgGain / avgLoss;
        const rsi = 100 - (100 / (1 + rs));

        rsiData.push({
            time: data[i].time,
            value: rsi
        });
    }

    return rsiData;
};

export default RSI;
