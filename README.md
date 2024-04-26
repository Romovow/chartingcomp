# Charting Component Readme

## Overview

This React component integrates lightweight-charts for visualizing financial data like OHLC (Open, High, Low, Close) data and volume. It offers functionalities such as selecting different timeframes, toggling chart types, adjusting scale settings, and displaying indicators.

## Usage

### Installation

Ensure you have `React` and `lightweight-charts` installed in your project.

```bash
npm install react lightweight-charts
```

### Integration

1. Import the necessary modules:

```javascript
import React, { useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";
import ohlcData from '../../ohlcData.json'; // Sample OHLC data
import ChartControls from './controls/ChartControls';
import IndicatorDisplay from './controls/IndicatorDisplay';
import DisplayControls from './controls/DisplayControls';
```

2. Initialize the component:

```javascript
export default function ChartComponent() {
  // Component logic goes here
}
```

3. Customize as needed.

## Features

### Timeframe Selection

Users can choose from a range of predefined timeframes, such as 1 minute, 1 hour, 1 day, etc., to view the data.

### Chart Type

Switch between candlestick and line chart types to visualize the data.

### Scale Settings

Adjust the scale settings, including logarithmic scale and percentage display.

### Auto Scale

Automatically scale the chart to fit the content.

### Indicator Display

Display additional indicators on the chart for deeper analysis.

## Dependencies

- React: A JavaScript library for building user interfaces.
- lightweight-charts: A lightweight, mobile-friendly financial charting library.

## Example

```javascript
import React from "react";
import ChartComponent from "./ChartComponent";

function App() {
  return (
    <div className="App">
      <ChartComponent />
    </div>
  );
}

export default App;
```

## Notes

- Ensure to replace `ohlcData.json` with your actual data source.
- Customize chart styles and layouts as per your requirements.
- Refer to the `ChartControls`, `IndicatorDisplay`, and `DisplayControls` components for additional functionalities.

## Author

This charting component was developed by WalterSol for DelugeCash. 

Feel free to extend, modify, and integrate it into your applications as needed. If you encounter any issues or have suggestions for improvement, please submit them via [GitHub issues](https://github.com/yourusername/yourproject/issues).
# chartingtool
