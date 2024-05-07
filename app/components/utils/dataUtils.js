// dataUtils.js

import { fetchChartData, adjustCandleData } from "./chartUtils";

export const aggregateDataIntoSeconds = (data, timeframe) => {
  const secondsInTimeframe = parseInt(timeframe.replace('sec', ''));
  const aggregatedData = [];


  let bucketStartTime = data[0].time;
  let bucketEndTime = bucketStartTime + secondsInTimeframe;
  let bucketData = [];

  data.forEach(item => {
    if (item.time >= bucketStartTime && item.time < bucketEndTime) {
      bucketData.push(item);
    } else {
      if (bucketData.length > 0) {
        const open = bucketData[0].open;
        const high = Math.max(...bucketData.map(d => d.high));
        const low = Math.min(...bucketData.map(d => d.low));
        const close = bucketData[bucketData.length - 1].close;
        const volume = bucketData.reduce((sum, d) => sum + d.volume, 0);
        aggregatedData.push({ time: bucketStartTime, open, high, low, close, volume });
      }

      bucketStartTime = item.time;
      bucketEndTime = bucketStartTime + secondsInTimeframe;
      bucketData = [item];
    }
  });

  if (bucketData.length > 0) {
    const open = bucketData[0].open;
    const high = Math.max(...bucketData.map(d => d.high));
    const low = Math.min(...bucketData.map(d => d.low));
    const close = bucketData[bucketData.length - 1].close;
    const volume = bucketData.reduce((sum, d) => sum + d.volume, 0);
    aggregatedData.push({ time: bucketStartTime, open, high, low, close, volume });
  }

  return aggregatedData;
};


export const formatChartData = (data, chartType) => {
  if (chartType === 'line') {
    return data.map(item => ({
      time: item.time,
      value: typeof item.close === 'number' ? item.close : null 
    })).filter(item => item.value !== null);
  } else {
    return adjustCandleData(data);
  }
};


export const updateChartData = async (timeframe) => {
  const data = await fetchChartData(timeframe); 
  if (!data || data.length === 0) {
    console.error("No data available for the selected timeframe:", timeframe);
    return;
  }

  const formattedData = formatChartData(data); 
  if (chartRef.current && chartRef.current.candleSeries) {
    chartRef.current.candleSeries.setData(formattedData);
    chartRef.current.chart.timeScale().fitContent();
  }
};
