import React, { useState } from 'react';
import './ChartControls.css'; 

const ChartControls = ({ selectedTimeframe, onTimeframeChange, selectedIndicator, onIndicatorChange, onChartTypeChange }) => {
  const [chartType, setChartType] = useState('candlestick');

  const timeframes = [
    { label: '1s', value: '1sec' },
    { label: '5s', value: '5sec' },
    { label: '15s', value: '15sec' },
    { label: '30s', value: '30sec' },
    { label: '1m', value: '1min' },
    { label: '5m', value: '5min' },
    { label: '15m', value: '15min' },
    { label: '30m', value: '30min' },
    { label: '1H', value: '1H' },
    { label: '4H', value: '4H' },
    { label: '1D', value: '1D' },
    { label: '1W', value: '1W' },
    { label: '1M', value: '1M' }
  ];

  const indicators = [
    { label: 'None', value: '' },
    { label: 'MA', value: 'ma' },
    { label: 'EMA', value: 'ema' },
    { label: 'Boll', value: 'bollinger' },
    { label: 'MACD', value: 'macd' }
  ];

  return (
    <div className="chart-controls-overlay">
      <div className="timeframe-controls">
        {timeframes.map((timeframe) => (
          <button
            key={timeframe.value}
            className={`timeframe-button ${selectedTimeframe === timeframe.value ? 'active' : ''}`}
            onClick={() => onTimeframeChange(timeframe.value)}
          >
            {timeframe.label}
          </button>
        ))}
      </div>
      <select
        className="indicator-select"
        value={selectedIndicator}
        onChange={(e) => onIndicatorChange(e.target.value)}
      >
        {indicators.map((indicator) => (
          <option key={indicator.value} value={indicator.value}>
            {indicator.label}
          </option>
        ))}
      </select>
      <button
        className={`chart-type-button ${
          chartType === 'candlestick' ? 'active' : ''
        }`}
        onClick={() => {
          const newChartType = chartType === 'candlestick' ? 'line' : 'candlestick';
          setChartType(newChartType);
          onChartTypeChange(newChartType);
        }}
      >
        {chartType === 'candlestick' ? 'Line' : 'Candle'}
      </button>
    </div>
  );
};

export default ChartControls;
