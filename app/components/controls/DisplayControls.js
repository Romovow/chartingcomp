import React, { useState } from 'react';
import './DisplayControls.css'; 

const DisplayControls = ({ onLogScaleChange, onPercentageDisplayChange, onAutoScaleChange }) => {
    const [activeButton, setActiveButton] = useState('');

    return (
        <div className="display-controls">
            <button
                className={activeButton === 'log' ? 'active' : ''}
                onClick={() => {
                    onLogScaleChange(true);
                    setActiveButton('log');
                }}
            >
                Log x
            </button>
            <button
                className={activeButton === 'percent' ? 'active' : ''}
                onClick={() => {
                    onPercentageDisplayChange(true);
                    setActiveButton('percent');
                }}
            >
                %
            </button>
            <button
                className={activeButton === 'auto' ? 'active' : ''}
                onClick={() => {
                    onAutoScaleChange();
                    setActiveButton('auto');
                }}
            >
                Auto Scale
            </button>
        </div>
    );
};

export default DisplayControls;
