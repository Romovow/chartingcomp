import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

const ExponentialMA = ({ data }) => {
    const chartContainerRef = useRef(null);
    const chartRef = useRef(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: 400,
            layout: {
                backgroundColor: '#000000',
                textColor: '#d1d4dc',
            },
            grid: {
                vertLines: {
                    color: '#404040',
                },
                horzLines: {
                    color: '#404040',
                },
            },
        });

        const candleSeries = chart.addCandlestickSeries();
        candleSeries.setData(data);

        const emaSeries = chart.addLineSeries({
            color: 'blue',
            lineWidth: 2,
        });

        const calculateEMA = (data, length = 14) => {
            let ema = [];
            let k = 2 / (length + 1);
            ema[0] = { time: data[0].time, value: data[0].close }; 

            for (let i = 1; i < data.length; i++) {
                let emaValue = data[i].close * k + ema[i - 1].value * (1 - k);
                ema.push({ time: data[i].time, value: emaValue });
            }

            return ema;
        };

        const emaData = calculateEMA(data);
        emaSeries.setData(emaData);

        chartRef.current = chart;

        return () => {
            chart.remove();
        };
    }, [data]);

    return (
        <div ref={chartContainerRef} style={{ height: '400px' }}>
            <h3>Exponential Moving Average Overlay</h3>
        </div>
    );
};

export default ExponentialMA;
