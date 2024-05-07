// utils/chartUtils.js

const adjustCandleData = (data) => {
    return data.map((item, index, arr) => {
        if (index === 0) return item; 
        return {
            ...item,
            open: arr[index - 1].close 
        };
    });
};

const fetchChartData = async (timeframe) => {
    try {
        const response = await fetch('/api/aggregate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
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

function revertToPriceView() {
    const priceScale = chartRef.current.chart.priceScale('right');
    priceScale.applyOptions({
        mode: 0,
        scaleMargins: {
            top: 0.3,
            bottom: 0.25
        },
        autoScale: true
    });
    console.log("Reverted to price view. Price scale options:", priceScale.options());

    chartRef.current.chart.applyOptions({
        priceScale: {
            mode: 0,
            autoScale: true
        }
    });
    console.log("Chart options after reverting:", chartRef.current.chart.options());

    chartRef.current.candleSeries.applyOptions({
        priceFormat: {
            type: 'price',
            precision: 2
        }
    });
    console.log("Candle series options after reverting:", chartRef.current.candleSeries.options());
}


export {
    adjustCandleData,
    fetchChartData,
    revertToPriceView,
};
