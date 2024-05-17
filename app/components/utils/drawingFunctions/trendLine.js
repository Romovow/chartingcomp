import React, { useEffect, useState } from 'react';
import { useMouseContext } from '../../context/MouseContext';

const TrendLine = ({ canvasRef, chartRef, endDrawingCallback }) => {
    const { isDrawing, setIsDrawing, selectedTool, setSelectedTool } = useMouseContext();
    const [line, setLine] = useState(null);
    const [drawingStage, setDrawingStage] = useState(0); // 0: not drawing, 1: start point set, 2: end point set
    const [movingPoint, setMovingPoint] = useState(null);
    const [lineSeries, setLineSeries] = useState(null);
    const [initialClick, setInitialClick] = useState(null);

    const clearLine = () => {
        setLine(null);
        setDrawingStage(0);
        setMovingPoint(null);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const getMidpoint = (line) => {
        const startPoint = chartRef.current.chart.timeScale().timeToCoordinate(line.start.time);
        const endPoint = chartRef.current.chart.timeScale().timeToCoordinate(line.end.time);
        const startPrice = chartRef.current.candleSeries.priceToCoordinate(line.start.price);
        const endPrice = chartRef.current.candleSeries.priceToCoordinate(line.end.price);
        return {
            x: (startPoint + endPoint) / 2,
            y: (startPrice + endPrice) / 2
        };
    };

    useEffect(() => {
        if (!canvasRef.current || !chartRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const drawAnchor = (point) => {
            ctx.fillStyle = 'blue';
            ctx.beginPath();
            ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
            ctx.fill();
        };

        const drawLine = (start, end, color) => {
            if (start && end) {
                const startPoint = chartRef.current.chart.timeScale().timeToCoordinate(start.time);
                const endPoint = chartRef.current.chart.timeScale().timeToCoordinate(end.time);
                const startPrice = chartRef.current.candleSeries.priceToCoordinate(start.price);
                const endPrice = chartRef.current.candleSeries.priceToCoordinate(end.price);

                if (startPoint !== null && endPoint !== null && startPrice !== null && endPrice !== null) {
                    ctx.beginPath();
                    ctx.moveTo(startPoint, startPrice);
                    ctx.lineTo(endPoint, endPrice);
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    drawAnchor({ x: startPoint, y: startPrice });
                    drawAnchor({ x: endPoint, y: endPrice });
                }
            }
        };

        const redrawLine = (color = 'blue') => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (line) {
                drawLine(line.start, line.end, color);
            }
        };

        const updateChartSeries = (newLine) => {
            if (lineSeries) {
                const data = [
                    { time: newLine.start.time, value: newLine.start.price },
                    { time: newLine.end.time, value: newLine.end.price }
                ];
                data.sort((a, b) => a.time - b.time);
                lineSeries.setData(data);
            } else {
                const series = chartRef.current.chart.addLineSeries({ color: 'blue' });
                const data = [
                    { time: newLine.start.time, value: newLine.start.price },
                    { time: newLine.end.time, value: newLine.end.price }
                ];
                data.sort((a, b) => a.time - b.time);
                series.setData(data);
                setLineSeries(series);
            }
        };

        const handleMouseEvents = (e) => {
            const rect = canvas.getBoundingClientRect();
            const position = { x: e.clientX - rect.left, y: e.clientY - rect.top };

            switch (e.type) {
                case 'mousedown':
                    handleMouseDown(position, e.button);
                    break;
                case 'mousemove':
                    handleMouseMove(position);
                    break;
                case 'mouseup':
                    handleMouseUp();
                    break;
                default:
                    break;
            }
        };

        const handleMouseDown = (position, button) => {
            if (button === 2) {
                setIsDrawing(false);
                setMovingPoint(null);
                setSelectedTool(null);
                return;
            }

            if (drawingStage === 0) {
                const time = chartRef.current.chart.timeScale().coordinateToTime(position.x);
                const price = chartRef.current.candleSeries.coordinateToPrice(position.y);
                if (time && price) {
                    clearLine(); 
                    setLine({ start: { time, price }, end: { time, price } });
                    setDrawingStage(1);
                    setIsDrawing(true);
                }
            } else if (drawingStage === 1) {
                const time = chartRef.current.chart.timeScale().coordinateToTime(position.x);
                const price = chartRef.current.candleSeries.coordinateToPrice(position.y);
                if (time && price) {
                    const newLine = { ...line, end: { time, price } };
                    setLine(newLine);
                    setDrawingStage(2);
                    setIsDrawing(false);
                    redrawLine('blue'); 
                    if (chartRef.current) {
                        chartRef.current.trendlines = [newLine]; 
                        updateChartSeries(newLine); 
                    }

                    setSelectedTool(null);
                    if (typeof endDrawingCallback === 'function') {
                        endDrawingCallback();
                    }
                }
            } else if (drawingStage === 2) {
                if (line) {
                    const startPoint = chartRef.current.chart.timeScale().timeToCoordinate(line.start.time);
                    const endPoint = chartRef.current.chart.timeScale().timeToCoordinate(line.end.time);
                    const startPrice = chartRef.current.candleSeries.priceToCoordinate(line.start.price);
                    const endPrice = chartRef.current.candleSeries.priceToCoordinate(line.end.price);

                    if (isNearPoint({ x: startPoint, y: startPrice }, position)) {
                        setMovingPoint({ pointType: 'start' });
                    } else if (isNearPoint({ x: endPoint, y: endPrice }, position)) {
                        setMovingPoint({ pointType: 'end' });
                    } else if (isNearLine(line, position)) {
                        setMovingPoint({ pointType: 'line', startPosition: position });
                        setInitialClick(position);
                    }
                }
            }
        };

        const handleMouseMove = (position) => {
            if (chartRef.current && chartRef.current.chart && chartRef.current.candleSeries) {
                const { chart, candleSeries } = chartRef.current;
                const timeScaleApi = chart.timeScale();

                const time = timeScaleApi.coordinateToTime(position.x);
                const price = candleSeries.coordinateToPrice(position.y);

                if (!isNaN(time) && time !== null && !isNaN(price)) {
                    if (drawingStage === 1 && line) {
                        const newLine = { ...line, end: { time, price } };
                        setLine(newLine);
                        redrawLine('lightblue'); 
                        canvas.style.cursor = 'crosshair';
                    } else if (movingPoint !== null && line) {
                        let newLine = { ...line };
                        if (movingPoint.pointType === 'start') {
                            newLine.start = { time, price };
                        } else if (movingPoint.pointType === 'end') {
                            newLine.end = { time, price };
                        } else if (movingPoint.pointType === 'line') {
                            const timeDelta = time - chart.timeScale().coordinateToTime(movingPoint.startPosition.x);
                            const priceDelta = price - candleSeries.coordinateToPrice(movingPoint.startPosition.y);
                            newLine.start = {
                                time: line.start.time + timeDelta,
                                price: line.start.price + priceDelta
                            };
                            newLine.end = {
                                time: line.end.time + timeDelta,
                                price: line.end.price + priceDelta
                            };
                            setMovingPoint({ ...movingPoint, startPosition: position });
                        }
                        setLine(newLine);
                        redrawLine('blue'); 
                        updateChartSeries(newLine); 
                        canvas.style.cursor = 'move';
                    } else if (drawingStage === 2 && line) {
                        const startPoint = chartRef.current.chart.timeScale().timeToCoordinate(line.start.time);
                        const endPoint = chartRef.current.chart.timeScale().timeToCoordinate(line.end.time);
                        const startPrice = chartRef.current.candleSeries.priceToCoordinate(line.start.price);
                        const endPrice = chartRef.current.candleSeries.priceToCoordinate(line.end.price);
                        if (isNearPoint({ x: startPoint, y:startPrice }, position) || isNearPoint({ x: endPoint, y: endPrice }, position)) {
                            canvas.style.cursor = 'pointer';
                        } else if (isNearLine(line, position)) {
                            canvas.style.cursor = 'move';
                        } else {
                            canvas.style.cursor = 'default';
                        }
                    } else {
                        let cursor = 'default';
                        if (line) {
                            const startPoint = chartRef.current.chart.timeScale().timeToCoordinate(line.start.time);
                            const endPoint = chartRef.current.chart.timeScale().timeToCoordinate(line.end.time);
                            const startPrice = chartRef.current.candleSeries.priceToCoordinate(line.start.price);
                            const endPrice = chartRef.current.candleSeries.priceToCoordinate(line.end.price);
                            if (isNearPoint({ x: startPoint, y: startPrice }, position)) {
                                cursor = 'pointer';
                            } else if (isNearPoint({ x: endPoint, y: endPrice }, position)) {
                                cursor = 'pointer';
                            } else if (isNearLine(line, position)) {
                                cursor = 'move';
                            }
                        }
                        canvas.style.cursor = cursor;
                    }
                }
            }
        };

        const handleMouseUp = () => {
            setMovingPoint(null);
            setInitialClick(null);
        };

        const isNearPoint = (point1, point2, distance = 5) => {
            if (!point1 || !point2) return false;
            return Math.hypot(point1.x - point2.x, point1.y - point2.y) <= distance;
        };

        const isNearLine = (line, point, distance = 5) => {
            if (!line.start || !line.end || !point) return false;
            const { start, end } = line;
            const a = end.y - start.y;
            const b = start.x - end.x;
            const c = end.x * start.y - start.x * end.y;
            const dist = Math.abs(a * point.x + b * point.y + c) / Math.sqrt(a * a + b * b);
            return dist <= distance;
        };

        const handleResize = () => {
            clearLine();
        };

        window.addEventListener('resize', handleResize);

        canvas.addEventListener('mousedown', handleMouseEvents);
        canvas.addEventListener('mousemove', handleMouseEvents);
        canvas.addEventListener('mouseup', handleMouseEvents);

        return () => {
            window.removeEventListener('resize', handleResize);
            canvas.removeEventListener('mousedown', handleMouseEvents);
            canvas.removeEventListener('mousemove', handleMouseEvents);
            canvas.removeEventListener('mouseup', handleMouseEvents);
        };
    }, [isDrawing, line, movingPoint, canvasRef, chartRef, lineSeries, initialClick]);

    return null;
};

export default TrendLine;

