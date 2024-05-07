import React, { useEffect, useRef, useState, useCallback } from "react";
import { createChart } from "lightweight-charts";
import ChartControls from './controls/ChartControls';
import IndicatorDisplay from './controls/IndicatorDisplay';
import { fetchChartData, adjustCandleData, revertToPriceView } from "./utils/chartUtils";
import DisplayControls from './controls/DisplayControls';
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';

export default function Home() {
  const [chartType, setChartType] = useState('candlestick');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1sec');
  const [selectedIndicator, setSelectedIndicator] = useState('');
  const [aggregatedData, setAggregatedData] = useState({});
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const volumeChartContainerRef = useRef(null);
  const [logScale, setLogScale] = useState(false);
  const [percentageDisplay, setPercentageDisplay] = useState(false);
  const [alignmentLinePosition, setAlignmentLinePosition] = useState(null);
  const [chartData, setChartData] = useState([]);
  const macdContainerRef = useRef(null);


  const [macdHeight, setMacdHeight] = useState();
  const [chartHeight, setChartHeight] = useState(600);
  const [volumeChartHeight, setVolumeChartHeight] = useState(100);
  const totalHeight = chartHeight + volumeChartHeight; 

  const [indicatorHeight, setIndicatorHeight] = useState(200);
  const [isResizing, setIsResizing] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(100);
  const [resizeTimeout, setResizeTimeout] = useState(null);
  const [resizeFinished, setResizeFinished] = useState(false);

  const updateChartHeight = useCallback((deltaY) => {
    const newTotalHeight = chartHeight + volumeChartHeight - deltaY;
    const chartProportion = chartHeight / (chartHeight + volumeChartHeight);
    const newChartHeight = newTotalHeight * chartProportion;
    const newVolumeChartHeight = newTotalHeight * (1 - chartProportion);

    setChartHeight(newChartHeight);
    setVolumeChartHeight(newVolumeChartHeight);
  }, [chartHeight, volumeChartHeight]);

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
    const intervalId = setInterval(() => {
      if (selectedTimeframe === '1sec') {
        fetchChartData(selectedTimeframe);
      }
    }, 1000);  // Polling every second for 1sec timeframe

    return () => clearInterval(intervalId); 
  }, [selectedTimeframe]);


  useEffect(() => {
    if (selectedTimeframe && chartType) {
      fetchChartData(selectedTimeframe, chartType);
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
      height: volumeChartHeight,
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
    if (chartRef.current && chartRef.current.volumeChart) {
      chartRef.current.volumeChart.applyOptions({ height: volumeChartHeight });
    }
  }, [volumeChartHeight]);


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

  const handleMouseDown = (e) => {
    e.preventDefault(); 
    setIsResizing(true);
    setStartY(e.clientY);
    setStartHeight({
        chartHeight: chartHeight,
        volumeChartHeight: volumeChartHeight
    });
};




const handleMouseMove = throttle((event) => {
  if (!isResizing) return;
  const deltaY = startY - event.clientY;
  handleResize(deltaY);
  setStartY(event.clientY);
}, 16); 


useEffect(() => {
  if (chartContainerRef.current) {
    chartContainerRef.current.style.height = `${chartHeight}px`;
  }
  if (volumeChartContainerRef.current) {
    volumeChartContainerRef.current.style.height = `${volumeChartHeight}px`;
  }
}, [chartHeight, volumeChartHeight]);


const handleMouseUp = () => {
  setIsResizing(false);
};
useEffect(() => {
  const handleResize = () => {
    setTotalHeight(window.innerHeight * 0.7);
  };

  window.addEventListener('resize', handleResize);
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);
useEffect(() => {
  if (chartContainerRef.current) {
    chartContainerRef.current.style.height = `${chartHeight}px`;
  }
  if (volumeChartContainerRef.current) {
    volumeChartContainerRef.current.style.height = `${volumeChartHeight}px`;
  }
}, [chartHeight, volumeChartHeight]);

const handleResize = useCallback((deltaY) => {
  const newChartHeight = Math.max(50, chartHeight - deltaY); 
  const newVolumeChartHeight = Math.max(30, totalHeight - newChartHeight);  


  setChartHeight(newChartHeight);
  setVolumeChartHeight(newVolumeChartHeight);
}, [chartHeight, totalHeight]);

useEffect(() => {
  if (chartContainerRef.current) {
      chartContainerRef.current.style.height = `${chartHeight}px`;
      void chartContainerRef.current.offsetHeight;
  }
}, [chartHeight]);


useEffect(() => {
  if (chartContainerRef.current) {
      chartContainerRef.current.style.height = `${chartHeight}px`;
  }
  if (volumeChartContainerRef.current) {
      volumeChartContainerRef.current.style.height = `${volumeChartHeight}px`;
  }
}, [chartHeight, volumeChartHeight]);

  const updateCharts = (data) => {
    if (!data || data.length === 0) {
      console.error("No data available to update charts.");
      return;
    }
    if (chartRef.current) {
      const formattedData = formatChartData(data, chartType);
      chartRef.current.candleSeries.setData(formattedData);
      chartRef.current.volumeSeries.setData(formattedData.map(item => ({
        time: item.time,
        value: item.volume,
        color: item.close > item.open ? '#26a69a' : '#ef5350',
      })));
      chartRef.current.chart.timeScale().fitContent();
      chartRef.current.volumeChart.timeScale().fitContent();
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, startY, startHeight]);

  const triggerChartDataUpdate = () => {
    fetchChartData(selectedTimeframe)
      .then(data => {
        updateCharts(data); 
      });
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, startY, startHeight]);

  const handleResizeStart = (setHeight, initialHeight) => (event) => {
    const startY = event.clientY;

    const doResize = (event) => {
      const currentY = event.clientY;
      const heightChange = startY - currentY; 
      const newHeight = Math.max(initialHeight + heightChange, 50);
      setHeight(newHeight);
    };

    const stopResize = () => {
      document.removeEventListener('mousemove', doResize);
      document.removeEventListener('mouseup', stopResize);
      setResizeFinished(true);  
    };

    document.addEventListener('mousemove', doResize);
    document.addEventListener('mouseup', stopResize);
  };

  useEffect(() => {
    if (resizeFinished) {
      updateChartData(selectedTimeframe, chartType); 
      setResizeFinished(false);  
    }
  }, [resizeFinished, selectedTimeframe, chartType]);

  const ResizeHandle = ({ onStartResizing }) => (
    <div
        style={{
            position: 'absolute',
            top: '-5px',
            left: 0,
            right: 0,
            height: '10px',
            cursor: 'ns-resize',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            zIndex: 9999,
        }}
        onMouseDown={onStartResizing}
    ></div>
);

const chartStyle = isResizing ? { border: '2px solid blue' } : {};

  useEffect(() => {
    if (resizeFinished) {
      updateChartData(selectedTimeframe);
      setResizeFinished(false);
    }
  }, [resizeFinished, selectedTimeframe]);


  return (

    <main className="flex flex-col  bg-[#1F1F2E]" style={{ height: '100vh', overflow: 'hidden' }}>
      <ResizeHandle onStartResizing={handleResizeStart(setVolumeChartHeight, volumeChartHeight, setResizeFinished)} />
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
<div
  ref={chartContainerRef}
  className="chart-container"
  style={{ ...chartStyle, flex: 1, height: `${chartHeight}px`, minHeight: '50px' }}
>
  <ResizeHandle onStartResizing={handleMouseDown} />
</div>




<div style={{ position: 'relative' }}>
  <div
    ref={volumeChartContainerRef}
    className="volume-chart-container"
    style={{ ...chartStyle, height: `${volumeChartHeight}px` }}
  />
  <ResizeHandle onStartResizing={handleMouseDown} />
</div>

<div style={{ position: 'relative' }}>
  <div style={{ height: `${indicatorHeight}px` }}>
    <IndicatorDisplay
      indicator={selectedIndicator}
      ohlcData={chartData}
      chartRef={chartRef}
      macdContainerRef={selectedIndicator === 'macd' ? macdContainerRef : null}
    />
  </div>
  <ResizeHandle onStartResizing={handleMouseDown} />
</div>

{selectedIndicator === 'macd' && (
  <div
    ref={macdContainerRef}
    className="macd-chart-container"
    style={{ width: '100%', height: `${indicatorHeight}px`, overflow: 'hidden' }}
  ></div>
)}
</main>
);
}