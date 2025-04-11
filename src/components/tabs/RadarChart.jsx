import { features, getFeatureDetails } from "./features";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighChartsMore from "highcharts/highcharts-more";
// RadarChart.jsx
import React from "react";

// Initialize highcharts-more to enable polar/radar

const RadarChart = ({width, height, overallEvaluation, overallEvaluationScores}) => {
    const options = {
        chart: {
            polar: true,
            type: "line",
            width: width || 550,
            height: height || 550
        },
        title: {
            text: ""
        },
        pane: {
            size: "80%",
        },
        xAxis: {
            categories: features.map(feature => feature.label),
            tickmarkPlacement: "on",
            lineWidth: 0,
        },
        yAxis: {
            gridLineInterpolation: "polygon",
            lineWidth: 0,
            min: 0,
            max: 10,
            tickInterval: 1, // Steps from 1 → 10
        },
        tooltip: {
            shared: true,
            pointFormat:
                '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
        },
        series: [
            {
                name: "Score",
                data: getFeatureDetails(overallEvaluation, overallEvaluationScores).scores,
                pointPlacement: "on",
            },
        ],
        credits: {
            enabled: false  // ✅ This hides the Highcharts logo
        },
        };

    return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default RadarChart;
