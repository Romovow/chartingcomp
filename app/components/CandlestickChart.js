import React, { useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";
import ohlcData from '../../ohlcData.json';
import ChartControls from './controls/ChartControls';
import IndicatorDisplay from './controls/IndicatorDisplay';
import DisplayControls from './controls/DisplayControls';

export default function Home() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [selectedIndicator, setSelectedIndicator] = useState('');
  const [aggregatedData, setAggregatedData] = useState({});
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const volumeChartContainerRef = useRef(null);
  const [logScale, setLogScale] = useState(false);
  const [percentageDisplay, setPercentageDisplay] = useState(false);


  const handleChartTypeChange = (type) => {
    if (chartRef.current) {
      chartRef.current.candleSeries.applyOptions({
        type: type === 'candlestick' ? 'candlestick' : 'line',
      });
    }
  };


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
      chartRef.current.candleSeries.setData(aggregatedData[selectedTimeframe]);
    }
  }, [aggregatedData, selectedTimeframe]);

  const handlePercentageDisplayChange = (usePercentage) => {
    setPercentageDisplay(usePercentage);
    if (chartRef.current && chartRef.current.candleSeries) {
      const priceScale = chartRef.current.chart.priceScale('right');
      if (usePercentage) {
        const basePrice = aggregatedData[selectedTimeframe][0]?.close; 

        priceScale.applyOptions({
          mode: 2, 
          scaleMargins: {
            top: 0.2,
            bottom: 0.2
          },
          autoScale: false
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
            baseValue: basePrice,
            precision: 2
          }
        });
      } else {
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
      }
    }
  };

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
      layout: {
        background: { type: 'solid', color: '#1F1F2E' },
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: { color: '#444' },
        horzLines: { color: '#444' },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      rightPriceScale: {
        scaleMargins: {
          top: 0.3,
          bottom: 0.25,
        },
      },
      timeScale: {
        rightOffset: 50,  
        barSpacing: 0.5,
        fixLeftEdge: false,
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

    chartRef.current = { chart, candleSeries };

    return () => {
      chart.remove();
    };
  }, []);





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


  const updateDataOnZoom = (from, to) => {
    console.log("Updating data on zoom:", from, to);
    const visibleRange = to - from;
    let buffer = visibleRange * 0.5;
    buffer = Math.max(buffer, 86400 * 30);  

    const expandedFrom = Math.max(minTimestamp, from - buffer);
    const expandedTo = Math.min(maxTimestamp, to + buffer);
    const visibleData = ohlcData.filter(d => d.time >= expandedFrom && d.time <= expandedTo);
    const adjustedData = adjustCandleData(visibleData);

    if (chartRef.current) {
      chartRef.current.candleSeries.setData(adjustedData);
      chartRef.current.volumeSeries.setData(visibleData.map(data => ({
        time: data.time,
        value: data.volume,
        color: data.close > data.open ? '#26a69a' : '#ef5350',
      })));

      updateTimeFormatBasedOnZoom(chartRef.current.chart, from, to);
    }
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

    const displayRanges = {
      '1sec': 10 * 60 * 1000, 
      '5sec': 30 * 60 * 1000, 
      '15sec': 2 * 60 * 60 * 1000, 
      '30sec': 4 * 60 * 60 * 1000, 
      '1min': 8 * 60 * 60 * 1000,
      '5min': 24 * 60 * 60 * 1000, 
      '15min': 3 * 24 * 60 * 60 * 1000, 
      '30min': 7 * 24 * 60 * 60 * 1000, 
      '1H': 14 * 24 * 60 * 60 * 1000,  
      '4H': 60 * 24 * 60 * 60 * 1000,  
      '1D': 180 * 24 * 60 * 60 * 1000,  
      '1W': 365 * 24 * 60 * 60 * 1000,  
      '1M': 5 * 365 * 24 * 60 * 60 * 1000  
    };

    const rangeToDisplay = displayRanges[selectedTimeframe] || 24 * 60 * 60 * 1000;  
    const maxTime = ohlcData.reduce((max, o) => Math.max(max, o.time), 0);
    const toDate = new Date(maxTime * 1000);
    const fromDate = new Date(toDate.getTime() - rangeToDisplay);

    const extendedToDate = new Date(toDate.getTime() + 3 * 24 * 60 * 60 * 1000);

    chart.timeScale().setVisibleRange({
      from: fromDate.getTime() / 1000,
      to: extendedToDate.getTime() / 1000
    });

    volumeChart.timeScale().setVisibleRange({
      from: fromDate.getTime() / 1000,
      to: extendedToDate.getTime() / 1000
    });
  };



  useEffect(() => {
    if (!chartRef.current || !aggregatedData[selectedTimeframe]) {
      console.log("Chart not initialized or data not available");
      return;
    }

    const adjustedData = adjustAggregatedData(aggregatedData[selectedTimeframe]);

    chartRef.current.candleSeries.setData(adjustedData);
    chartRef.current.volumeSeries.setData(adjustedData.map(data => ({
      time: data.time,
      value: data.volume,
      color: data.close > data.open ? '#26a69a' : '#ef5350',
    })));

    chartRef.current.chart.timeScale().fitContent();
    chartRef.current.volumeChart.timeScale().fitContent();

    setInitialZoom(); 
  }, [selectedTimeframe, aggregatedData]);







  return (
    <main className="flex flex-col min-h-screen bg-[#1F1F2E]">
      <ChartControls
        selectedTimeframe={selectedTimeframe}
        onTimeframeChange={setSelectedTimeframe}
        selectedIndicator={selectedIndicator}
        onIndicatorChange={setSelectedIndicator}
        onChartTypeChange={handleChartTypeChange}
      />

      <DisplayControls
        onLogScaleChange={handleLogScaleChange}
        onPercentageDisplayChange={handlePercentageDisplayChange}
        onAutoScaleChange={handleAutoScale}
      />
      <div ref={chartContainerRef} className="chart-container flex-grow" style={{ minHeight: '400px' }}></div>
      <div ref={volumeChartContainerRef} className="volume-chart-container" style={{ height: '100px' }}></div>
      <IndicatorDisplay indicator={selectedIndicator} ohlcData={ohlcData} />
    </main>
  );
}