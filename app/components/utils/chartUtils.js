// Define all utility functions and constants directly
const adjustCandleData = (data) => {
    return data.map((item, index, arr) => {
        if (index === 0) return item;
        return { ...item, open: arr[index - 1].close };
    });
};

const fetchChartData = async (timeframe) => {
    try {
        const response = await fetch('/api/aggregate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ timeframe }),
        });

        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        const aggregatedData = data[timeframe];
        if (aggregatedData.length === 0) {
            console.error("No data available for the selected timeframe");
            return;
        }

        return aggregatedData;
    } catch (error) {
        console.error("Error fetching aggregated data:", error.message);
    }
};

function revertToPriceView(chartRef) {
    const priceScale = chartRef.current.chart.priceScale('right');
    priceScale.applyOptions({
        mode: 0,
        scaleMargins: { top: 0.3, bottom: 0.25 },
        autoScale: true
    });
    console.log("Reverted to price view. Price scale options:", priceScale.options());

    chartRef.current.chart.applyOptions({
        priceScale: { mode: 0, autoScale: true }
    });
    console.log("Chart options after reverting:", chartRef.current.chart.options());

    chartRef.current.candleSeries.applyOptions({
        priceFormat: { type: 'price', precision: 2 }
    });
    console.log("Candle series options after reverting:", chartRef.current.candleSeries.options());
}

const createTrendLine = (chart, { x, y, price }) => {
    const lineSeries = chart.addLineSeries({ lineWidth: 2, color: 'rgba(0, 123, 255, 0.8)' });
    lineSeries.setData([{ time: x, value: price }]);

    return {
        update: ({ x, y, price }) => lineSeries.update({ time: x, value: price }),
        remove: () => chart.removeSeries(lineSeries)
    };
};

const createPriceLine = (chart, price) => {
    const priceLine = chart.addPriceLine({
        price,
        color: 'red',
        lineWidth: 2,
        lineStyle: 0,  // Solid line
        axisLabelVisible: true,
        title: 'Horizontal line'
    });

    return {
        update: (newPrice) => priceLine.applyOptions({ price: newPrice }),
        remove: () => chart.removePriceLine(priceLine)
    };
};


export {
    adjustCandleData,
    fetchChartData,
    revertToPriceView,
    createTrendLine,
    createPriceLine
};