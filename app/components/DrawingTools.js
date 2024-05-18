import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import ToolIcon from './utils/ToolIcon';
import './styles/DrawingTools.scss';
import { toolGroups, groupIcons } from './config/toolsConfig';
import { drawFunctions } from './utils/drawingInstance';

const DrawingTools = ({ canvasRef, setSelectedTool, endDrawingCallback, chartRef, priceScaleData }) => {
  const [drawingMode, setDrawingMode] = useState('none');
  const [toolbarVisible, setToolbarVisible] = useState(true);
  const [closeButtonVisible, setCloseButtonVisible] = useState(false); 
  const toolbarRef = useRef();
  const handleRef = useRef();
  const [selectedTool, setSelectedToolState] = useState(null);
  const [openGroups, setOpenGroups] = useState({});

  const toggleToolbar = (visible = !toolbarVisible) => {
    setToolbarVisible(visible);
    gsap.to(toolbarRef.current, {
      duration: 0.3,
      x: visible ? 0 : -50,
    });
    gsap.to(handleRef.current, {
      duration: 0.3,
      x: visible ? 50 : 0,
    });
  };

  const toggleGroup = (groupName) => {
    setOpenGroups(prev => ({ ...prev, [groupName]: !prev[groupName] }));
  };

  const handleToolSelection = (tool) => {
    setSelectedToolState(tool);
    setCloseButtonVisible(true); 
    if (typeof setSelectedTool === 'function') {
      setSelectedTool(tool); 
    }
  };

  const handleCloseButtonClick = () => {
    setSelectedToolState(null);
    setSelectedTool(null);
    setDrawingMode('none');
    setCloseButtonVisible(false); 
    endDrawingCallback();
    toggleToolbar(false);
  };

  useEffect(() => {
    if (selectedTool && drawFunctions.hasOwnProperty(selectedTool)) {
      setDrawingMode(drawFunctions[selectedTool](canvasRef, chartRef, priceScaleData, () => {
        endDrawingCallback();
        setSelectedToolState(null);
        setSelectedTool(null);
        setCloseButtonVisible(false); 
        toggleToolbar(false);
      }));
    } else {
      setDrawingMode(null);
    }
  }, [selectedTool, canvasRef, chartRef, setSelectedTool, endDrawingCallback, priceScaleData]);

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
      <button ref={handleRef} className="handle" onClick={() => toggleToolbar()}>
        {toolbarVisible ? <FiChevronLeft /> : <FiChevronRight />}
      </button>
      <div className="selected-tool-display">
        {selectedTool && <ToolIcon toolName={selectedTool} />}
      </div>
      {drawingMode}
      {closeButtonVisible && (
        <button className="close-drawing-button" onClick={handleCloseButtonClick}>
          Close Drawing
        </button>
      )}
    </div>
  );
};

export default DrawingTools;
