import React from 'react';
import MovingAverage from './indicators/MovingAverage';
import ExponentialMA from './indicators/ExponentialMA';
import BollingerBands from './indicators/BollingerBands';
import RSI from './indicators/RSI';
import MACD from './indicators/MACD';

const IndicatorDisplay = ({ indicator, ohlcData }) => {
    switch (indicator) {
        case 'ma':
            return <MovingAverage data={ohlcData} />;
        case 'ema':
            return <ExponentialMA data={ohlcData} />;
        case 'bollinger':
            return <BollingerBands data={ohlcData} />;
        case 'rsi':
            return <RSI data={ohlcData} />;
        case 'macd':
            return <MACD data={ohlcData} />;
        default:
            return <div>Please select an indicator.</div>;
    }
};

export default IndicatorDisplay;
