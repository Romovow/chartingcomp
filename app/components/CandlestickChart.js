import React, { useEffect, useRef, useState, useCallback } from "react";
import { createChart } from "lightweight-charts";
import ChartControls from './controls/ChartControls';
import IndicatorDisplay from './controls/IndicatorDisplay';
import { fetchChartData, adjustCandleData, revertToPriceView } from "./utils/chartUtils";
import DisplayControls from './controls/DisplayControls';
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import AlignmentLineControl from './AlignmentLineControl';
import ResizableBox from "./utils/ResizeableBox";
import ResizeHandle from './utils/ResizeHandle';
import DrawingTools from "./DrawingTools";
import { MouseProvider, useMouseContext } from './context/MouseContext';

export default function Home() {
  const [chartType, setChartType] = useState('candlestick');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1sec');
  const [selectedIndicator, setSelectedIndicator] = useState('');
  const [aggregatedData, setAggregatedData] = useState({});
  const chartContainerRef = useRef(null);
  const chartRef = useRef({ chart: null, candleSeries: null, trendlines: [] });
  const canvasRef = useRef(null);

  const volumeChartContainerRef = useRef(null);
  const [logScale, setLogScale] = useState(false);
  const [percentageDisplay, setPercentageDisplay] = useState(false);
  const [chartData, setChartData] = useState([]);
  const macdContainerRef = useRef(null);
  const indicatorContainerRef = useRef(null);
  const [alignmentLinePosition, setAlignmentLinePosition] = useState(null);
  const [macdHeight, setMacdHeight] = useState();
  const [chartHeight, setChartHeight] = useState(820);

  const [selectedTool, setSelectedTool] = useState(null);

  const [volumeChartHeight, setVolumeChartHeight] = useState(280);
  const [indicatorHeight, setIndicatorHeight] = useState(200);

  const [isResizing, setIsResizing] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(100);
  const [resizeTimeout, setResizeTimeout] = useState(null);
  const [resizeFinished, setResizeFinished] = useState(false);

  const [chartPosition, setChartPosition] = useState({ x: 0, y: 0 });
  const [volumePosition, setVolumePosition] = useState({ x: 0, y: 150 });
  const [indicatorPosition, setIndicatorPosition] = useState({ x: 0, y: 300 });
  const [dragging, setDragging] = useState({ active: false, ref: null, startX: 0, startY: 0 });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) { 
        setChartHeight(300);
      } else {
        setChartHeight(820); 
      }
      updateCanvasSize(); // Update canvas size on window resize
    };

    handleResize(); 
    window.addEventListener("resize", handleResize); 

    return () => {
      window.removeEventListener("resize", handleResize); 
    };
  }, []); 

  const updateCanvasSize = () => {
    if (canvasRef.current && chartContainerRef.current) {
      canvasRef.current.width = chartContainerRef.current.clientWidth;
      canvasRef.current.height = chartContainerRef.current.clientHeight;
    }
  };

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

  useEffect(() => {
    if (selectedTimeframe === '1sec') {
      const intervalId = setInterval(() => {
        fetchChartData(selectedTimeframe).then(updateCharts);
      }, 10000);
      return () => clearInterval(intervalId);
    }
  }, [selectedTimeframe]);

  useEffect(() => {
    if (selectedTimeframe && chartType) {
      fetchChartData(selectedTimeframe, chartType).then(updateCharts);
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

    if (chartData.length > 0) {
      volumeSeries.setData(chartData.map(data => ({
        time: data.time,
        value: data.volume,
        color: data.close > data.open ? '#26a69a' : '#ef5350',
      })));
    }

    return () => {
      volumeChart.remove();
    };
  }, [volumeChartContainerRef.current, volumeChartHeight, chartData]);

  useEffect(() => {
    if (chartRef.current && chartRef.current.volumeChart && chartRef.current.volumeSeries) {
      chartRef.current.volumeChart.applyOptions({
        height: volumeChartHeight,
      });

      if (chartData.length > 0) {
        chartRef.current.volumeSeries.setData(chartData.map(data => ({
          time: data.time,
          value: data.volume,
          color: data.close > data.open ? '#26a69a' : '#ef5350',
        })));
      }
      chartRef.current.volumeChart.timeScale().fitContent();
    }
  }, [volumeChartHeight, chartData]);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartHeight,
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

    chartRef.current = { chart, candleSeries, trendlines: [] };
    updateCanvasSize();

    chart.subscribeCrosshairMove((param) => {
      if (!canvasRef.current || !param || !param.time) {
        return;
      }
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    });

    chart.timeScale().subscribeVisibleTimeRangeChange(() => {
      if (canvasRef.current) {
        updateCanvasSize();
      }
    });

    return () => {
      chart.remove();
    };
  }, [chartContainerRef, chartHeight]);

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

    if (volumeChart) {
      volumeChart.timeScale().setVisibleRange(visibleRange);
    }

    const timeScaleOptions = {
      timeVisible: true,
      secondsVisible: selectedTimeframe.includes('sec'),
    };

    chart.timeScale().applyOptions(timeScaleOptions);

    if (volumeChart) {
      volumeChart.timeScale().applyOptions(timeScaleOptions);
    }
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

    chartRef.current.candleSeries.setData(adjustedData);

    if (chartType !== 'line' && chartRef.current.volumeSeries) {
      chartRef.current.volumeSeries.setData(adjustedData.map(data => ({
        time: data.time,
        value: data.volume,
        color: data.close > data.open ? '#26a69a' : '#ef5350',
      })));
    }

    chartRef.current.chart.applyOptions({
      width: chartContainerRef.current.clientWidth,
      height: chartHeight,
    });
    chartRef.current.chart.timeScale().fitContent();

    if (chartRef.current.volumeChart) {
      chartRef.current.volumeChart.applyOptions({
        width: volumeChartContainerRef.current.clientWidth,
        height: volumeChartHeight,
      });
      chartRef.current.volumeChart.timeScale().fitContent();
    }

    setInitialZoom();
  }, [selectedTimeframe, aggregatedData, chartType, chartHeight, volumeChartHeight]);

  useEffect(() => {
    if (selectedTimeframe === '1sec' && chartData.length > 0 && chartRef.current) {
      const chart = chartRef.current.chart;
      const visibleData = chartData.slice(-120);
      const from = visibleData[0].time;
      const to = visibleData[visibleData.length - 1].time;
      chart.timeScale().setVisibleRange({ from, to });
    }
  }, [selectedTimeframe, chartData]);

  const handleMouseDown = (event, componentRef) => {
    event.preventDefault();
    const { clientX, clientY } = event;
    setDragging({ active: true, ref: componentRef, startX: clientX, startY: clientY });
  };

  const resizeState = useRef({
    startY: 0,
    startHeight: 0,
  });

  const handleMouseMove = useCallback(
    (event) => {
      if (!dragging.active || !dragging.ref) return;

      const { clientX, clientY } = event;
      const deltaX = clientX - dragging.startX;
      const deltaY = clientY - dragging.startY;

      if (dragging.ref === 'chart') {
        setChartPosition((prev) => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
      } else if (dragging.ref === 'volume') {
        setVolumePosition((prev) => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
      } else if (dragging.ref === 'indicator') {
        setIndicatorPosition((prev) => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
      }

      setDragging((prev) => ({
        ...prev,
        startX: clientX,
        startY: clientY,
      }));
    },
    [dragging]
  );

  const handleMouseUp = () => {
    setDragging({ active: false, ref: null, startX: 0, startY: 0 });
  };

  useEffect(() => {
    const chartContainer = chartContainerRef.current;
    if (!chartContainer) return;

    const handleMouseDown = (event) => {
      event.preventDefault();
      setIsResizing(true);
      resizeState.current.startY = event.clientY;
      resizeState.current.startHeight = chartContainer.clientHeight;
    };

    chartContainer.addEventListener('mousedown', handleMouseDown);

    return () => {
      if (chartContainer) {
        chartContainer.removeEventListener('mousedown', handleMouseDown);
      }
    };
  }, []); 

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
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove]);

  const handleResize = useCallback((deltaY) => {
    const totalHeight = chartHeight + volumeChartHeight + indicatorHeight;
    const chartProportion = chartHeight / totalHeight;
    const volumeProportion = volumeChartHeight / totalHeight;
    const indicatorProportion = indicatorHeight / totalHeight;

    const newTotalHeight = Math.max(150, totalHeight + deltaY);
    const newChartHeight = Math.max(50, newTotalHeight * chartProportion);
    const newVolumeChartHeight = Math.max(30, newTotalHeight * volumeProportion);
    const newIndicatorHeight = Math.max(50, newTotalHeight * indicatorProportion);

    setChartHeight(newChartHeight);
    setVolumeChartHeight(newVolumeChartHeight);
    setIndicatorHeight(newIndicatorHeight);
  }, [chartHeight, volumeChartHeight, indicatorHeight]);

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

  const handleResizeStart = (setHeight, initialHeight, otherSetHeight, otherInitialHeight) => (event) => {
    const startY = event.clientY;

    const doResize = (event) => {
      const currentY = event.clientY;
      const heightChange = startY - currentY;
      const newHeight = Math.max(initialHeight + heightChange, 50);
      const otherNewHeight = Math.max(otherInitialHeight - heightChange, 50);
      setHeight(newHeight);
      otherSetHeight(otherNewHeight);
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

  const chartStyle = isResizing ? { border: '2px solid blue' } : {};

  useEffect(() => {
    if (resizeFinished) {
      updateChartData(selectedTimeframe);
      setResizeFinished(false);
    }
  }, [resizeFinished, selectedTimeframe]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const totalHeight = containerRef.current.clientHeight;
        const totalAssignedHeight = chartHeight + volumeChartHeight + indicatorHeight;
        const scaleFactor = totalHeight / totalAssignedHeight;
        setChartHeight(Math.floor(chartHeight * scaleFactor));
        setVolumeChartHeight(Math.floor(volumeChartHeight * scaleFactor));
        setIndicatorHeight(Math.floor(indicatorHeight * scaleFactor));
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [chartHeight, volumeChartHeight, indicatorHeight, setChartHeight, setVolumeChartHeight, setIndicatorHeight]);

  const adjustProportions = useCallback((deltaY, minFirst, minSecond) => {
    const totalHeight = containerRef.current.clientHeight;
    const newChartHeight = Math.max(chartHeight - deltaY, minFirst);
    const newVolumeChartHeight = Math.max(volumeChartHeight + deltaY, minSecond);
    const remainingHeight = totalHeight - newChartHeight - newVolumeChartHeight;
    setChartHeight(newChartHeight);
    setVolumeChartHeight(newVolumeChartHeight);
    setIndicatorHeight(Math.max(remainingHeight, 50)); 
  }, [chartHeight, volumeChartHeight, indicatorHeight, setChartHeight, setVolumeChartHeight, setIndicatorHeight]);

  const handleChartVolumeResize = useCallback((e) => {
    setIsResizing(true);
    setStartY(e.clientY);
  
    const onMouseMove = (e) => {
      if (isResizing) {
        const deltaY = startY - e.clientY;
        const newChartHeight = chartHeight - deltaY;
        const newVolumeChartHeight = volumeChartHeight + deltaY;
  
        if (newChartHeight >= 100 && newVolumeChartHeight >= 50) {
          setChartHeight(newChartHeight);
          setVolumeChartHeight(newVolumeChartHeight);
        }
      }
    };
  
    const stopResize = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', stopResize);
      setIsResizing(false);
    };
  
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', stopResize);
  }, [chartHeight, volumeChartHeight, startY, isResizing]);

  return (
    <ResizableBox
      chartHeight={chartHeight}
      setChartHeight={setChartHeight}
      volumeChartHeight={volumeChartHeight}
      setVolumeChartHeight={setVolumeChartHeight}
      indicatorHeight={indicatorHeight}
      setIndicatorHeight={setIndicatorHeight}
      chartContainerRef={chartContainerRef}
      volumeChartContainerRef={volumeChartContainerRef}
    >
      <main className="flex flex-col bg-[#1F1F2E]" style={{ overflow: 'hidden' }}>
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <MouseProvider>
            <div className="chart-container" ref={chartContainerRef} style={{ position: 'relative', height: chartHeight }}>
              <canvas 
                ref={canvasRef} 
                className="canvas-overlay" 
                style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  zIndex: 10, 
                  width: '100%', 
                  height: '100%', 
                  pointerEvents: selectedTool ? 'auto' : 'none' 
                }} 
              />
              <DrawingTools 
                canvasRef={canvasRef} 
                setSelectedTool={setSelectedTool} 
                endDrawingCallback={() => {
                  
                }}
                chartRef={chartRef} 
              />
            </div>
          </MouseProvider>
          <ChartControls
            selectedTimeframe={selectedTimeframe}
            onTimeframeChange={setSelectedTimeframe}
            selectedIndicator={selectedIndicator}
            onIndicatorChange={setSelectedIndicator}
            chartType={chartType}
            onChartTypeChange={handleChartTypeChange}
          />
          <DisplayControls
            onLogScaleChange={setLogScale}
            onPercentageDisplayChange={setPercentageDisplay}
            onAutoScaleChange={handleAutoScale}
          />
          <ResizeHandle onResize={handleChartVolumeResize} />
        </div>
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
          <div ref={volumeChartContainerRef} style={{ height: volumeChartHeight, position: 'relative' }}></div>
        </div>
        <div style={{ position: 'relative', height: '200px' }}>
          <IndicatorDisplay indicator={selectedIndicator} ohlcData={chartData} chartRef={chartRef} />
        </div>
      </main>
    </ResizableBox>
  );
}