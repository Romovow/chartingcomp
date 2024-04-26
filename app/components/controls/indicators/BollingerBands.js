import React from 'react';

const BollingerBands = ({ data }) => {
    const calculateBollingerBands = (data) => {
        return { upper: 0, middle: 0, lower: 0 };
    };

    const bands = calculateBollingerBands(data);

    return (
        <div>
            <h3>Bollinger Bands:</h3>
            <p>Upper: {bands.upper}, Middle: {bands.middle}, Lower: {bands.lower}</p>
        </div>
    );
};

export default BollingerBands;
