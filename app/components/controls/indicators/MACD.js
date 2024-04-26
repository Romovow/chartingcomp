import React from 'react';

const MACD = ({ data }) => {
    const calculateMACD = (data) => {
        return { macd: 0, signal: 0 };
    };

    const macdValues = calculateMACD(data);

    return (
        <div>
            <h3>MACD:</h3>
            <p>MACD: {macdValues.macd}, Signal: {macdValues.signal}</p>
        </div>
    );
};

export default MACD;
