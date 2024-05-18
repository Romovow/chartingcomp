import React, { useEffect, useState } from 'react';
import { useMouseContext } from '../../context/MouseContext';

const TrendLine = ({ canvasRef, chartRef, endDrawingCallback }) => {
    const { isDrawing, setIsDrawing, selectedTool, setSelectedTool } = useMouseContext();
    const [line, setLine] = useState(null);
    const [drawingStage, setDrawingStage] = useState(0);
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

    const formatDate = (time) => {
        const date = new Date(time * 1000);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}/${mm}/${dd}`;
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

        const drawText = (text, x, y, color = 'black', fontSize = '14px', fontWeight = 'bold', backgroundColor = 'rgba(255, 255, 255, 0.8)') => {
            ctx.fillStyle = backgroundColor;
            const padding = 2;
            const textWidth = ctx.measureText(text).width;
            ctx.fillRect(x - padding, y - parseInt(fontSize, 10), textWidth + padding * 2, parseInt(fontSize, 10) + padding * 2);
            ctx.fillStyle = color;
            ctx.font = `${fontWeight} ${fontSize} Arial`;
            ctx.textBaseline = 'top';
            ctx.fillText(text, x, y - parseInt(fontSize, 10) + padding);
        };

        const drawTextWithBackground = (text, x, y, textColor, fontSize, fontWeight, bgColor, marginBottom = 0) => {
            ctx.font = `${fontWeight} ${fontSize}`;
            ctx.textBaseline = 'top';
            const padding = 5;
        

            const textMetrics = ctx.measureText(text);
            const textWidth = textMetrics.width;
            const textHeight = parseInt(fontSize, 10);

            ctx.fillStyle = bgColor;

            const rectX = x - padding;
            const rectY = y - padding - marginBottom;
            const rectWidth = textWidth + padding * 2;
            const rectHeight = textHeight + padding * 2;
            const cornerRadius = 5;
        
            ctx.beginPath();
            ctx.moveTo(rectX + cornerRadius, rectY);
            ctx.lineTo(rectX + rectWidth - cornerRadius, rectY);
            ctx.quadraticCurveTo(rectX + rectWidth, rectY, rectX + rectWidth, rectY + cornerRadius);
            ctx.lineTo(rectX + rectWidth, rectY + rectHeight - cornerRadius);
            ctx.quadraticCurveTo(rectX + rectWidth, rectY + rectHeight, rectX + rectWidth - cornerRadius, rectY + rectHeight);
            ctx.lineTo(rectX + cornerRadius, rectY + rectHeight);
            ctx.quadraticCurveTo(rectX, rectY + rectHeight, rectX, rectY + rectHeight - cornerRadius);
            ctx.lineTo(rectX, rectY + cornerRadius);
            ctx.quadraticCurveTo(rectX, rectY, rectX + cornerRadius, rectY);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = textColor;
            ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.shadowBlur = 3;
            ctx.fillText(text, x, y - marginBottom);
        

            ctx.shadowColor = 'transparent';
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowBlur = 0;
        };
        
        const drawLine = (start, end, color) => {
            if (start && end) {
                const startPoint = chartRef.current.chart.timeScale().timeToCoordinate(start.time);
                const endPoint = chartRef.current.chart.timeScale().timeToCoordinate(end.time);
                const startPrice = chartRef.current.candleSeries.priceToCoordinate(start.price);
                const endPrice = chartRef.current.candleSeries.priceToCoordinate(end.price);
        
                if (startPoint !== null && endPoint !== null && startPrice !== null && endPrice !== null) {
                    ctx.setLineDash([]);
                    ctx.beginPath();
                    ctx.moveTo(startPoint, startPrice);
                    ctx.lineTo(endPoint, endPrice);
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    drawAnchor({ x: startPoint, y: startPrice });
                    drawAnchor({ x: endPoint, y: endPrice });

                    const midpoint = {
                        x: (startPoint + endPoint) / 2,
                        y: (startPrice + endPrice) / 2
                    };
                    drawAnchor(midpoint);
        
                    ctx.fillStyle = 'rgba(0, 0, 255, 0.1)'; 
                    ctx.fillRect(startPoint, canvas.height - 25, endPoint - startPoint, 25); 
        
         
                    ctx.fillStyle = 'rgba(0, 0, 255, 0.1)'; 
                    ctx.fillRect(canvas.width - 50, Math.min(startPrice, endPrice), 50, Math.abs(endPrice - startPrice)); 
        
                  
                    ctx.strokeStyle = 'rgba(0, 0, 255, 0.5)';
                 ctx.lineWidth = 1;
                    ctx.setLineDash([5, 5]); 
        
                    ctx.beginPath();
                    ctx.moveTo(startPoint, 0);
       ctx.lineTo(startPoint, canvas.height);
                  ctx.stroke();
                    drawTextWithBackground(`T: ${formatDate(start.time)}`, startPoint + 5, canvas.height - 5, 'blue', '14px', 'bold', 'rgba(255, 255, 255, 0.8)', 10); 
        
                    ctx.beginPath();
                    ctx.moveTo(endPoint, 0);
            ctx.lineTo(endPoint, canvas.height);
                    ctx.stroke();
                    drawTextWithBackground(`T: ${formatDate(end.time)}`, endPoint + 5, canvas.height - 5, 'blue', '14px', 'bold', 'rgba(255, 255, 255, 0.8)', 10); 
        
                   
                    ctx.beginPath();
                    ctx.moveTo(0, startPrice);
             ctx.lineTo(canvas.width, startPrice);
                    ctx.stroke();
                    drawTextWithBackground(`P: ${start.price.toFixed(2)}`, canvas.width - 50, startPrice - 15, 'blue', '14px', 'bold', 'rgba(255, 255, 255, 0.8)');
        
                    ctx.beginPath();
                    ctx.moveTo(0, endPrice);
                    ctx.lineTo(canvas.width, endPrice);
                    ctx.stroke();
                    drawTextWithBackground(`P: ${end.price.toFixed(2)}`, canvas.width - 50, endPrice - 15, 'blue', '14px', 'bold', 'rgba(255, 255, 255, 0.8)');
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

                    const midpoint = {
                        x: (startPoint + endPoint) / 2,
                        y: (startPrice + endPrice) / 2
                    };

                    if (isNearPoint({ x: startPoint, y: startPrice }, position)) {
                        setMovingPoint({ pointType: 'start' });
                    } else if (isNearPoint({ x: endPoint, y: endPrice }, position)) {
                        setMovingPoint({ pointType: 'end' });
                    } else if (isNearPoint(midpoint, position)) {
                        setMovingPoint({ pointType: 'middle', startPosition: position });
                        setInitialClick(position);
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
                        } else if (movingPoint.pointType === 'line' || movingPoint.pointType === 'middle') {
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
                            setInitialClick(position); // Update the initial click position
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

                        const midpoint = {
                            x: (startPoint + endPoint) / 2,
                            y: (startPrice + endPrice) / 2
                        };

                        if (isNearPoint({ x: startPoint, y: startPrice }, position) || isNearPoint({ x: endPoint, y: endPrice }, position) || isNearPoint(midpoint, position)) {
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

                            const midpoint = {
                                x: (startPoint + endPoint) / 2,
                                y: (startPrice + endPrice) / 2
                            };

                            if (isNearPoint({ x: startPoint, y: startPrice }, position) || isNearPoint({ x: endPoint, y: endPrice }, position) || isNearPoint(midpoint, position)) {
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
