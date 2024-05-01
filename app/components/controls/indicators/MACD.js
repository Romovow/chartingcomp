import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

const MACD = ({ data, period = { fast: 12, slow: 26, signal: 9 }, containerRef }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || data.length < period.slow) {
      console.log("Container not initialized or insufficient data");
      return;
    }
  
    // Ensure the chart uses the full width of the container
    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      layout: {
        background: { type: 'solid', color: '#1F1F2E' },
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: { color: '#444' },
        horzLines: { color: '#444' },
      },
      timeScale: {
        rightOffset: 0, // Adjusted to zero to use full width
        barSpacing: 0.5,
        fixLeftEdge: true,
        lockVisibleTimeRangeOnResize: true,
        rightBarStaysOnScroll: true,
        borderVisible: false,
        visible: true,
        timeVisible: true,
        secondsVisible: false,
      },
    });
  
    const { macdLine, signalLine, histogram } = calculateMACD(data, period.fast, period.slow, period.signal);
  
    const macdSeries = chart.addLineSeries({
      color: 'rgba(255, 206, 86, 0.8)',
      lineWidth: 2,
    });
  
    const signalSeries = chart.addLineSeries({
      color: 'rgba(54, 162, 235, 0.8)',
      lineWidth: 2,
    });
  
    const histogramSeries = chart.addHistogramSeries({
      color: '#26a69a',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
      scaleMargins: {
        top: 0.32,
        bottom: 0,
      },
    });
  
    macdSeries.setData(macdLine);
    signalSeries.setData(signalLine);
    histogramSeries.setData(histogram);
  
    // Fit content to ensure all data is visible initially
    chart.timeScale().fitContent();
  
    chartRef.current = chart;
  
    return () => {
      chart.remove();
    };
  }, [data, containerRef, period]);
  

  return null;
};


const calculateMACD = (data, fastPeriod, slowPeriod, signalPeriod) => {
    const fastEMA = calculateExponentialMA(data, fastPeriod);
    const slowEMA = calculateExponentialMA(data, slowPeriod);

    // Ensure that the slowEMA has values before calculating the MACD line
    const macdLine = fastEMA.map((fast, index) => {
        if (index < slowEMA.length) {
            return {
                time: fast.time,
                value: fast.value - slowEMA[index].value
            };
        }
        return null;
    }).filter(item => item !== null);

    const signalLine = calculateExponentialMA(macdLine, signalPeriod);

    // Ensure that the signalLine has values before calculating the histogram
    const histogram = macdLine.map((macd, index) => {
        if (index < signalLine.length) {
            return {
                time: macd.time,
                value: macd.value - signalLine[index].value
            };
        }
        return null;
    }).filter(item => item !== null);

    return { macdLine, signalLine, histogram };
};

const calculateExponentialMA = (data, period) => {
    if (!data || data.length === 0) return [];

    let emaData = [];
    let multiplier = 2 / (period + 1);
    let emaPrev = data[0].close;  // Assuming data[0] is valid

    for (let i = 1; i < data.length; i++) {
        let ema = (data[i].close - emaPrev) * multiplier + emaPrev;
        emaData.push({
            time: data[i].time,
            value: ema
        });
        emaPrev = ema;
    }
    return emaData;
};


export default MACD;
