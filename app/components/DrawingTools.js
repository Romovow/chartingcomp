// DrawingTools.js
import React, { useState, useCallback, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { createPriceLine, createTrendLine, createRectangle, createEllipse } from './utils/chartUtils';
import { FiX, FiTrendingUp, FiMinus, FiSquare, FiCircle, FiArrowRightCircle, FiChevronRight, FiChevronLeft, FiZap, FiLayers, FiTarget, FiCompass } from 'react-icons/fi';
import ToolIcon from './utils/ToolIcon';
import './styles/DrawingTools.scss';
import { toolGroups, groupIcons } from './config/toolsConfig';
import { executeDrawing } from './utils/drawingInstance';  // Adjust the import path as necessary


const DrawingTools = ({ chartRef }) => {
    const [drawingMode, setDrawingMode] = useState('none');
    const [toolbarVisible, setToolbarVisible] = useState(true);
    const toolbarRef = useRef();
    const handleRef = useRef();
    const drawingRef = useRef({ currentDrawing: null });
    const [selectedTool, setSelectedTool] = useState(null);
    const [openGroups, setOpenGroups] = useState({});  // Using an object to track open groups

    const toggleToolbar = () => {
        const newVisibility = !toolbarVisible;
        setToolbarVisible(newVisibility);
        gsap.to(toolbarRef.current, {
            duration: 0.3,
            x: newVisibility ? 0 : -50,
        });
        gsap.to(handleRef.current, {
            duration: 0.3,
            x: newVisibility ? 50 : 0,
        });
    };
    

    const toggleGroup = (groupName) => {
        setOpenGroups(prev => ({ ...prev, [groupName]: !prev[groupName] }));
    };
    console.log("Chart ref on init:", chartRef.current);
    const handleToolSelection = (tool) => {
        setSelectedTool(tool);
        if (chartRef && chartRef.current) {
            executeDrawing(tool, chartRef.current);  // Execute the drawing function for the selected tool
        } else {
            console.error("Chart reference is not defined.");
        }
    };
    
    return (
        <div className="drawing-container">
            <div ref={toolbarRef} className="toolbar">
                {Object.entries(toolGroups).map(([groupName, tools]) => (
                    <div key={groupName} className="tool-group-header">
                        <button onClick={() => toggleGroup(groupName)} className="group-button">
                            {groupIcons[groupName]}
                            <span className="group-name">{groupName}</span>
                        </button>
                        {openGroups[groupName] && (
                            <div className="tool-group">
                                {tools.map((tool, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleToolSelection(tool)}
                                        className={`tool-button ${selectedTool === tool ? 'active' : ''}`}
                                    >
                                        <ToolIcon toolName={tool} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <button ref={handleRef} className="handle" onClick={toggleToolbar}>
                {toolbarVisible ? <FiChevronLeft /> : <FiChevronRight />}
            </button>
            <div className="selected-tool-display">
                {selectedTool && <ToolIcon toolName={selectedTool} />}
            </div>
        </div>
    );
};


export default DrawingTools;