import React from 'react';

const RSI = ({ data }) => {
    const calculateRSI = (data) => {
      
        return 50; 
    };

    const rsi = calculateRSI(data);

    return (
        <div>
            <h3>Relative Strength Index (RSI):</h3>
            <p>{rsi}</p>
        </div>
    );
};

export default RSI;
