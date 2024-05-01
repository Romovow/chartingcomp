import React from 'react';
import MovingAverage from './indicators/MovingAverage';
import ExponentialMA from './indicators/ExponentialMA';
import BollingerBands from './indicators/BollingerBands';
import RSI from './indicators/RSI';
import MACD from './indicators/MACD';

const IndicatorDisplay = ({ indicator, ohlcData, chartRef, macdContainerRef }) => {
    switch (indicator) {
        case 'ma':
            return <MovingAverage data={ohlcData} chartRef={chartRef} />;
        case 'ema':
            return <ExponentialMA data={ohlcData} chartRef={chartRef} />;
        case 'bollinger':
            return <BollingerBands data={ohlcData} chartRef={chartRef} />;
        case 'rsi':
            return <RSI data={ohlcData} chartRef={chartRef} />;
        case 'macd':
            return <MACD data={ohlcData} period={{ fast: 12, slow: 26, signal: 9 }} containerRef={macdContainerRef} />;
        default:
            return null;
    }
};

export default IndicatorDisplay;
