import React, { useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";
import ohlcData from '../../ohlcData.json';
import ChartControls from './controls/ChartControls';
import IndicatorDisplay from './controls/IndicatorDisplay';

import DisplayControls from './controls/DisplayControls';
import { min } from "lodash";

export default function Home() {
  const [chartType, setChartType] = useState('candlestick'); 
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [selectedIndicator, setSelectedIndicator] = useState('');
  const [aggregatedData, setAggregatedData] = useState({});
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const volumeChartContainerRef = useRef(null);
  const [logScale, setLogScale] = useState(false);
  const [percentageDisplay, setPercentageDisplay] = useState(false);
  const [chartData, setChartData] = useState([]);
  const macdContainerRef = useRef(null);

  const handleChartTypeChange = () => {
    const newChartType = chartType === 'candlestick' ? 'line' : 'candlestick';
    setChartType(newChartType);
  
    if (chartRef.current) {
      const chart = chartRef.current.chart;
      if (chartRef.current.candleSeries) {
        chart.removeSeries(chartRef.current.candleSeries);
      }
  
      let series;
      if (newChartType === 'candlestick') {
        series = chart.addCandlestickSeries({
          upColor: '#4bffb5',
          downColor: '#ff4976',
          borderDownColor: '#ff4976',
          borderUpColor: '#4bffb5',
          wickDownColor: '#838ca1',
          wickUpColor: '#838ca1',
          borderVisible: false,
        });
      } else {
        series = chart.addLineSeries({
          color: '#4bffb5',
          lineWidth: 2,
        });
      }
  
      chartRef.current.candleSeries = series;
  
      updateChartData(selectedTimeframe, newChartType);
    }
  };


  const updateChartData = (timeframe, chartType) => {
    let data = aggregatedData[timeframe];
    if (!data || data.length === 0) {
      console.error("No data available for the selected timeframe:", timeframe);
      return;
    }
  
    if (timeframe === '1sec') {
      console.log("Data for 1sec timeframe:", data);
      const twoMinutesAgo = Date.now() / 1000 - 120; 
      data = data.filter(d => d.time >= twoMinutesAgo);
      if (data.length > 120) {
        data = data.slice(-120); 
      }
    }
  
    let formattedData;
    if (chartType === 'candlestick') {
      formattedData = adjustCandleData(data);
    } else {
      formattedData = data.map(item => ({
        time: item.time,
        value: item.close
      })).filter(item => item !== null);
    }
  
    if (formattedData.length === 0) {
      console.error("All data points were invalid for the selected timeframe and chart type", timeframe, chartType);
      return;
    }
  
    if (chartRef.current && chartRef.current.candleSeries) {
      chartRef.current.candleSeries.setData(formattedData);
      chartRef.current.chart.timeScale().fitContent();
      setChartData(formattedData); 
    }
  };


const aggregateDataIntoSeconds = (data, timeframe) => {
  const secondsInTimeframe = parseInt(timeframe.replace('sec', ''));
  const aggregatedData = [];

  // Assuming data is sorted by time in ascending order
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


  useEffect(() => {
    if (selectedTimeframe && chartType) {
      updateChartData(selectedTimeframe, chartType);
    }
  }, [selectedTimeframe, chartType, aggregatedData]);
  

  const handleLogScaleChange = (useLogScale) => {
    setLogScale(useLogScale);
    if (chartRef.current) {
      chartRef.current.chart.applyOptions({
        priceScale: {
          mode: useLogScale ? 1 : 0,
        },
      });

      if (percentageDisplay) {
        const priceScale = chartRef.current.chart.priceScale('right');
        priceScale.applyOptions({
          mode: 0, 
          scaleMargins: {
            top: 0.3,
            bottom: 0.25
          },
          autoScale: true
        });
        chartRef.current.chart.applyOptions({
          priceScale: {
            mode: 0,
            autoScale: true
          }
        });
        chartRef.current.candleSeries.applyOptions({
          priceFormat: {
            type: 'price',
            precision: 2
          }
        });

        setPercentageDisplay(false);
      }
    }
  };

  useEffect(() => {
    if (aggregatedData[selectedTimeframe]) {
      const data = aggregatedData[selectedTimeframe];
      setChartData(data);
  
      if (chartRef.current && chartRef.current.candleSeries) {
        let formattedData;

        if (chartType === 'line') {
          formattedData = data.map(item => {
            return {
              time: item.time,
              value: typeof item.close === 'number' ? item.close : null 
            };
          }).filter(item => item.value !== null); 
        } else {
          formattedData = adjustCandleData(data); 
        }
  
        if (formattedData.length === 0) {
          console.error("All data points were invalid for the selected timeframe and chart type", selectedTimeframe, chartType);
          return;
        }
  
        chartRef.current.candleSeries.setData(formattedData);
        chartRef.current.chart.timeScale().fitContent();
      }
    }
  }, [aggregatedData, selectedTimeframe, chartType]);
  
  

const handlePercentageDisplayChange = (usePercentage) => {
  setPercentageDisplay(usePercentage);
  if (chartRef.current && chartRef.current.candleSeries) {
    const priceScale = chartRef.current.chart.priceScale('right');
    if (usePercentage) {
      if (chartData.length > 0) {
        console.log("Switching to percentage view.");
        const baseValue = chartData[0].open;  
        console.log("Current chart data:", chartData);
        console.log("Base value for percentage view:", baseValue);

        priceScale.applyOptions({
          mode: 2,
          scaleMargins: {
            top: 0.1,
            bottom: 0.1
          },
          autoScale: false,
          visiblePriceRange: {
            from: -100, 
            to: 100 
          }
        });

        chartRef.current.chart.applyOptions({
          priceScale: {
            mode: 2,
            autoScale: false
          }
        });

        chartRef.current.candleSeries.applyOptions({
          priceFormat: {
            type: 'percentage',
            minMove: 0.01,
            precision: 2,
            baseValue: baseValue  
          }
        });
      } else {
        console.error("No data available to set percentage view.");
      }
    } else {
      revertToPriceView();
    }
  } else {
    console.error("Chart reference or candle series not found.");
  }
};





function revertToPriceView() {
    const priceScale = chartRef.current.chart.priceScale('right');
    priceScale.applyOptions({
        mode: 0,
        scaleMargins: {
            top: 0.3,
            bottom: 0.25
        },
        autoScale: true
    });
    console.log("Reverted to price view. Price scale options:", priceScale.options());

    chartRef.current.chart.applyOptions({
        priceScale: {
            mode: 0,
            autoScale: true
        }
    });
    console.log("Chart options after reverting:", chartRef.current.chart.options());

    chartRef.current.candleSeries.applyOptions({
        priceFormat: {
            type: 'price',
            precision: 2
        }
    });
    console.log("Candle series options after reverting:", chartRef.current.candleSeries.options());
}





  const handleAutoScale = () => {
    if (chartRef.current) {
      chartRef.current.chart.timeScale().fitContent();
    }
  };
  useEffect(() => {
    const fetchAggregatedData = async () => {
      const timeframes = ['1sec', '5sec', '15sec', '30sec', '1min', '5min', '15min', '30min', '1H', '4H', '1D', '1W', '1M'];
  
      try {
        const response = await fetch('/api/aggregate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ timeframes }),
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log("Aggregated data received:", data); 
          setAggregatedData(data);
        } else {
          console.error('Failed to fetch aggregated data');
        }
      } catch (error) {
        console.error('Error fetching aggregated data:', error);
      }
    };
  
    fetchAggregatedData();
  }, []);
  

  useEffect(() => {
    if (!volumeChartContainerRef.current) return;

    const volumeChart = createChart(volumeChartContainerRef.current, {
      width: volumeChartContainerRef.current.clientWidth,
      height: 100,  
      layout: {
        background: { type: 'solid', color: '#1F1F2E' },
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: { color: '#444' },
        horzLines: { color: '#444' },
      },
      timeScale: {
        rightOffset: 10,
        barSpacing: 0.5,
        fixLeftEdge: true,
        lockVisibleTimeRangeOnResize: true,
        rightBarStaysOnScroll: true,
        borderVisible: false,
        borderColor: "#fff000",
        visible: true,
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const volumeSeries = volumeChart.addHistogramSeries({
      color: '#26a69a',
      priceFormat: {
        type: 'volume',
      },
      overlay: true,
      scaleMargins: {
        top: 0.1,
        bottom: 0.9,
      },
    });

    chartRef.current = { ...chartRef.current, volumeChart, volumeSeries };

    return () => {
      volumeChart.remove();
    };
  }, [volumeChartContainerRef.current]);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
        background: { type: 'solid', color: '#1F1F2E' },
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: { color: '#444' },
        horzLines: { color: '#444' },
      },
      timeScale: {
        rightOffset: 50,
        barSpacing: 0.5,
        fixLeftEdge: true,
        lockVisibleTimeRangeOnResize: true,
        rightBarStaysOnScroll: true,
        visible: true,
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: '#4bffb5',
      downColor: '#ff4976',
      borderDownColor: '#ff4976',
      borderUpColor: '#4bffb5',
      wickDownColor: '#838ca1',
      wickUpColor: '#838ca1',
      borderVisible: false,
    });

    const volumeSeries = chart.addHistogramSeries({
      color: '#26a69a',
      priceFormat: {
        type: 'volume',
      },
      overlay: true,
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    chartRef.current = { chart, candleSeries, volumeSeries };

    return () => {
      chart.remove();
    };
  }, []);

  
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.chart.timeScale().fitContent(); 
    }
  }, [chartRef.current]);
  


  const updateTimeFormatBasedOnZoom = (chart, from, to) => {
    const rangeInSeconds = to - from;
    let dateFormat;

    if (rangeInSeconds <= 3600) { 
      dateFormat = 'HH:mm';
    } else if (rangeInSeconds <= 86400) {
      dateFormat = 'HH:mm';
    } else {
      dateFormat = 'yyyy-MM-dd';
    }

    chart.applyOptions({
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        tickMarkFormatter: (time, tickMarkType, locale) => {
          const date = new Date(time * 1000);
          return formatDate(date, dateFormat);
        }
      }
    });
  };


const adjustCandleData = (data) => {
    return data.map((item, index, arr) => {
        if (index === 0) return item; 
        return {
            ...item,
            open: arr[index - 1].close 
        };
    });
};


  const formatDate = (date, format) => {
    const pad = (num) => num.toString().padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = date.getDate();
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    const getOrdinalNum = (n) => {
      let s = ["th", "st", "nd", "rd"],
        v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    return format
      .replace('yyyy', year)
      .replace('MM', month)
      .replace('dd', getOrdinalNum(day))
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  };


  const adjustAggregatedData = (data) => {
    if (!data) {
      console.log("Data is undefined or not yet available.");
      return [];
    }
    return data.map((item, index, arr) => {
      if (index === 0) return item;
      return {
        ...item,
        open: arr[index - 1].close, 
        volume: item.volume || 0 
      };
    });
  };

  const setInitialZoom = () => {
    if (!chartRef.current || !aggregatedData[selectedTimeframe]) return;
     
    const chart = chartRef.current.chart;
    const volumeChart = chartRef.current.volumeChart;
    const data = aggregatedData[selectedTimeframe];
     
    if (data.length === 0) return;
   
    let numberOfBars;

    switch (selectedTimeframe) {
       case '1sec':
       case '5sec':
       case '15sec':
       case '30sec':
         numberOfBars = 300; 
         break;
       case '1min':
       case '5min':
         numberOfBars = 60; 
         break;
       case '15min':
       case '30min':
         numberOfBars = 48; 
         break;
       case '1H':
         numberOfBars = 24; 
         break;
       case '4H':
         numberOfBars = 28; 
         break;
       case '1D':
         numberOfBars = 30;
         break;
       case '1W':
         numberOfBars = 12; 
         break;
       case '1M':
         numberOfBars = 12; 
         break;
       default:
         numberOfBars = 30; 
    }
   
    const startIndex = Math.max(0, data.length - numberOfBars);
    const endIndex = data.length - 1;
     
    const visibleRange = {
       from: data[startIndex].time,
       to: data[endIndex].time
    };
   
    chart.timeScale().setVisibleRange(visibleRange);
    volumeChart.timeScale().setVisibleRange(visibleRange);
   
   
    const timeScaleOptions = {
       timeVisible: true,
       secondsVisible: selectedTimeframe.includes('sec'),
    };
   
    chart.timeScale().applyOptions(timeScaleOptions);
    volumeChart.timeScale().applyOptions(timeScaleOptions);
   };
   
  

   useEffect(() => {
    if (!chartRef.current || !aggregatedData[selectedTimeframe]) {
      console.log("Chart not initialized or data not available");
      return;
    }
  
    const data = aggregatedData[selectedTimeframe];
    let adjustedData;
  
    if (chartType === 'line') {
      adjustedData = data.map(item => ({
        time: item.time,
        value: typeof item.close === 'number' ? item.close : null 
      })).filter(item => item.value !== null); 
    } else {
      adjustedData = adjustCandleData(data); 
    }
  
    if (adjustedData.length === 0) {
      console.error("All data points were invalid for the selected timeframe and chart type", selectedTimeframe, chartType);
      return;
    }

    if (chartType === 'line') {
      chartRef.current.candleSeries.setData(adjustedData);
    } else {
      chartRef.current.candleSeries.setData(adjustedData);
      chartRef.current.volumeSeries.setData(adjustedData.map(data => ({
        time: data.time,
        value: data.volume,
        color: data.close > data.open ? '#26a69a' : '#ef5350',
      })));
    }
  
    chartRef.current.chart.timeScale().fitContent(); 
    chartRef.current.volumeChart.timeScale().fitContent();
  
    setInitialZoom(); 
  }, [selectedTimeframe, aggregatedData, chartType]); 
  
  useEffect(() => {
    if (selectedTimeframe === '1sec' && chartData.length > 0 && chartRef.current) {
      const chart = chartRef.current.chart;
      const visibleData = chartData.slice(-120);
      const from = visibleData[0].time;
      const to = visibleData[visibleData.length - 1].time;
      chart.timeScale().setVisibleRange({ from, to });
    }
  }, [selectedTimeframe, chartData]);
  
  







  return (
    <main className="flex flex-col min-h-screen bg-[#1F1F2E]" style={{ maxHeight: '100vh', overflow: 'hidden' }}>
  
      <ChartControls
        selectedTimeframe={selectedTimeframe}
        onTimeframeChange={setSelectedTimeframe}
        selectedIndicator={selectedIndicator}
        onIndicatorChange={setSelectedIndicator}
        chartType={chartType}
        onChartTypeChange={handleChartTypeChange}
      />
  
      <DisplayControls
        onLogScaleChange={handleLogScaleChange}
        onPercentageDisplayChange={handlePercentageDisplayChange}
        onAutoScaleChange={handleAutoScale}
      />
  
      <div ref={chartContainerRef} className="chart-container" style={{ flex: 1,}}></div>
  
      <div ref={volumeChartContainerRef} className="volume-chart-container" style={{ height: '100px' }}></div>
  
      <IndicatorDisplay
        indicator={selectedIndicator}
        ohlcData={chartData}
        chartRef={chartRef}
        macdContainerRef={selectedIndicator === 'macd' ? macdContainerRef : null}
      />
  
      {selectedIndicator === 'macd' && (
        <div
          ref={macdContainerRef}
          className="macd-chart-container"
          style={{ width: '100%', height: '100px', overflow: 'hidden' }}
        ></div>
      )}
  
    </main>
  );
  
}