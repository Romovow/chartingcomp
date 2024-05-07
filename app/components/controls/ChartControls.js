import React, { useState } from 'react';
import './ChartControls.css'; 

const ChartControls = ({ selectedTimeframe, onTimeframeChange, selectedIndicator, onIndicatorChange, onChartTypeChange }) => {
  const [chartType, setChartType] = useState('candlestick'); 

  const timeframes = [
    { label: '1sec', value: '1sec' },
    { label: '5sec', value: '5sec' },
    { label: '15sec', value: '15sec' },
    { label: '30sec', value: '30sec' },
    { label: '1min', value: '1min' },
    { label: '5min', value: '5min' },
    { label: '15min', value: '15min' },
    { label: '30min', value: '30min' },
    { label: '1H', value: '1H' },
    { label: '4H', value: '4H' },
    { label: '1D', value: '1D' },
    { label: '1W', value: '1W' },
    { label: '1M', value: '1M' }
  ];

  const indicators = [
    { label: 'None', value: '' },
    { label: 'Moving Average', value: 'ma' },
    { label: 'Exponential MA', value: 'ema' },
    { label: 'Bollinger Bands', value: 'bollinger' },
    { label: 'MACD', value: 'macd' }
  ];


  return (
    <div className="chart-controls">
      {timeframes.map((timeframe) => (
        <button
          key={timeframe.value}
          className={`timeframe-button ${selectedTimeframe === timeframe.value ? 'active' : ''}`}
          onClick={() => onTimeframeChange(timeframe.value)}
        >
          {timeframe.label}
        </button>
      ))}
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
  className={`px-4 py-2 rounded ${
    chartType === 'candlestick' ? 'bg-blue-500 text-white' : 'bg-gray-200'
  }`}
  onClick={onChartTypeChange}
>
  {chartType === 'candlestick' ? 'Switch to Line Chart' : 'Switch to Candlestick Chart'}
</button>

    </div>
  );
};

export default ChartControls;
