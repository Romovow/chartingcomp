export const drawTrendLine = (chartRef) => {
    if (!chartRef || !chartRef.chart) {
        console.error("Invalid chart reference provided.");
        return;
    }

    console.log("Chart initialization confirmed.");

    const chart = chartRef.chart;
    let lineSeries = chart.addLineSeries({
        color: 'blue',
        lineWidth: 2,
    });

    console.log("Line series added.");

    let startPrice = null;
    let tempLine = null;

    const handleClick = (param) => {
        console.log("Click event received:", param);

        if (!param.time || !param.point || !param.seriesData.size) {
            console.error("Invalid click data:", param);
            return;
        }

        let series = Array.from(param.seriesData.keys())[0];
        let priceData = param.seriesData.get(series);

        if (!priceData) {
            console.error("No price data available:", param);
            return;
        }

        let value = priceData.close;

        if (!startPrice) {
            startPrice = { time: param.time, value: value };
            console.log('Start Point Set:', startPrice);
                tempLine = chart.addLineSeries({
                color: 'red',
                lineWidth: 1,
                lineStyle: 2, 
            });
            tempLine.setData([startPrice, startPrice]); 
        } else {
            const endPrice = { time: param.time, value: value };
            console.log('End Point Set:', endPrice);

            if (endPrice.time <= startPrice.time) {
                console.error('End time must be greater than start time:', startPrice.time, endPrice.time);
                startPrice = null;
                if (tempLine) {
                    chart.removeSeries(tempLine);
                    tempLine = null;
                }
                return;
            }

            lineSeries.setData([startPrice, endPrice]);
            console.log("Line drawn from start to end.");
            startPrice = null;
            if (tempLine) {
                chart.removeSeries(tempLine);
                tempLine = null;
            }
        }
    };

    const handleMouseMove = (param) => {
        if (startPrice && tempLine) {
            let series = Array.from(param.seriesData.keys())[0];
            let priceData = param.seriesData.get(series);
            if (priceData) {
                let value = priceData.close;
                tempLine.setData([startPrice, { time: param.time, value }]);
            }
        }
    };

    chart.subscribeClick(handleClick);
    chart.subscribeCrosshairMove(handleMouseMove);
    console.log("Click and mouse move subscriptions set.");

    return {
        destroy: () => {
            chart.unsubscribeClick(handleClick);
            chart.unsubscribeCrosshairMove(handleMouseMove);
            chart.removeSeries(lineSeries);
            if (tempLine) chart.removeSeries(tempLine);
            console.log("Resources cleaned up on destroy.");
        }
    };
}
