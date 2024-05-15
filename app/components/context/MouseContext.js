// context/MouseContext.js
import React, { createContext, useContext, useState } from 'react';

const MouseContext = createContext();

export const MouseProvider = ({ children }) => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [selectedTool, setSelectedTool] = useState(null);

    return (
        <MouseContext.Provider value={{ isDrawing, setIsDrawing, selectedTool, setSelectedTool }}>
            {children}
        </MouseContext.Provider>
    );
};

export const useMouseContext = () => useContext(MouseContext);
