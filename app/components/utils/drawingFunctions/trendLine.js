import React, { useEffect, useState } from 'react';
import { useMouseContext } from '../../context/MouseContext';

const TrendLine = ({ canvasRef, chartRef, endDrawingCallback }) => {
    const { isDrawing, setIsDrawing, selectedTool, setSelectedTool } = useMouseContext();
    const [line, setLine] = useState(null);
    const [drawingStage, setDrawingStage] = useState(0); // 0: not drawing, 1: start point set, 2: end point set
    const [movingPoint, setMovingPoint] = useState(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const drawAnchor = (point, isActive = false) => {
            ctx.fillStyle = isActive ? 'red' : 'blue';
            ctx.beginPath();
            ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
            ctx.fill();
        };

        const drawLine = (start, end, isActive = false) => {
            if (start && end) {
                ctx.beginPath();
                ctx.moveTo(start.x, start.y);
                ctx.lineTo(end.x, end.y);
                ctx.strokeStyle = isActive ? 'red' : 'blue';
                ctx.lineWidth = 2;
                ctx.stroke();
                drawAnchor(start, isActive);
                drawAnchor(end, isActive);
            }
        };

        const redrawLine = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (line) {
                drawLine(line.start, line.end, true);
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
            if (button === 2) { // Right click to exit drawing mode
                setIsDrawing(false);
                setMovingPoint(null);
                setSelectedTool(null); // Reset selected tool
                return;
            }

            if (drawingStage === 0) {
                setLine({ start: position, end: position });
                setDrawingStage(1);
                setIsDrawing(true);
            } else if (drawingStage === 1) {
                const newLine = { ...line, end: position };
                setLine(newLine);
                setDrawingStage(2);
                setIsDrawing(false);
                if (chartRef.current) {
                    chartRef.current.trendlines.push(newLine); // Add the drawn line to the chart reference
                    // Add the trendline to the Lightweight Chart
                    const series = chartRef.current.chart.addLineSeries();
                    series.setData([
                        { time: new Date().getTime() / 1000, value: newLine.start.y },
                        { time: new Date().getTime() / 1000, value: newLine.end.y }
                    ]);
                }
                
                setSelectedTool(null); // Reset selected tool
                if (typeof endDrawingCallback === 'function') {
                    endDrawingCallback();
                }
            }
        };

        const handleMouseMove = (position) => {
            if (movingPoint !== null && line) {
                let newLine = { ...line };
                if (movingPoint.pointType === 'start' || movingPoint.pointType === 'end') {
                    newLine[movingPoint.pointType] = position;
                } else if (movingPoint.pointType === 'line') {
                    const { offset } = movingPoint;
                    const start = { x: position.x - offset.x, y: position.y - offset.y };
                    const end = {
                        x: position.x - offset.x + (line.end.x - line.start.x),
                        y: position.y - offset.y + (line.end.y - line.start.y)
                    };
                    newLine = { start, end };
                }
                setLine(newLine);
                redrawLine();
                canvas.style.cursor = 'move';
            } else if (drawingStage === 1 && line) {
                const newLine = { ...line, end: position };
                setLine(newLine);
                redrawLine();
                canvas.style.cursor = 'crosshair';
            } else {
                let cursor = 'default';
                if (line) {
                    if (isNearPoint(line.start, position) || isNearPoint(line.end, position)) {
                        cursor = 'pointer';
                    } else if (isNearLine(line, position)) {
                        cursor = 'move';
                    }
                }
                canvas.style.cursor = cursor;
            }
        };

        const handleMouseUp = () => {
            setMovingPoint(null);
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

        canvas.addEventListener('mousedown', handleMouseEvents);
        canvas.addEventListener('mousemove', handleMouseEvents);
        canvas.addEventListener('mouseup', handleMouseEvents);

        return () => {
            canvas.removeEventListener('mousedown', handleMouseEvents);
            canvas.removeEventListener('mousemove', handleMouseEvents);
            canvas.removeEventListener('mouseup', handleMouseEvents);
        };
    }, [isDrawing, line, movingPoint, canvasRef]);

    return null;
};

export default TrendLine;
