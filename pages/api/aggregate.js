import ohlcData from '../../ohlcData.json';
export const config = {
  api: {
    responseLimit: false,
  },
}
// Precompute aggregated data for all timeframes
const precomputedData = precomputeDataForAllTimeframes(ohlcData);

function precomputeDataForAllTimeframes(data) {
  const timeframes = ['1sec', '5sec', '15sec', '30sec', '1min', '5min', '15min', '30min', '1H', '4H', '1D', '1W', '1M'];
  const results = {};
  timeframes.forEach(timeframe => {
    results[timeframe] = aggregateData(data, timeframe);
  });
  return results;
}

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { timeframes } = req.body;
    const aggregatedData = {};

    timeframes.forEach(timeframe => {
      aggregatedData[timeframe] = precomputedData[timeframe];
    });

    res.status(200).json(aggregatedData);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

function aggregateData(data, timeframe) {
  const timeframeInSeconds = {
    '1sec': 1, '5sec': 5, '15sec': 15, '30sec': 30,
    '1min': 60, '5min': 300, '15min': 900, '30min': 1800,
    '1H': 3600, '4H': 14400, '1D': 86400, '1W': 604800, '1M': 2592000,
  };
  const interval = timeframeInSeconds[timeframe] * 1000;
  const aggregatedDataMap = new Map();

  data.forEach(item => {
    const roundedTime = Math.floor(item.time * 1000 / interval) * interval;
    if (!aggregatedDataMap.has(roundedTime)) {
      aggregatedDataMap.set(roundedTime, {
        time: roundedTime / 1000,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        volume: item.volume
      });
    } else {
      const aggData = aggregatedDataMap.get(roundedTime);
      aggData.high = Math.max(aggData.high, item.high);
      aggData.low = Math.min(aggData.low, item.low);
      aggData.close = item.close;
      aggData.volume += item.volume;
    }
  });

  return Array.from(aggregatedDataMap.values());
}
