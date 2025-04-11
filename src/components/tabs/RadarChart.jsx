import { features, getFeatureDetails } from "./features";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighChartsMore from "highcharts/highcharts-more";
// RadarChart.jsx
import React from "react";

// Initialize highcharts-more to enable polar/radar

const RadarChart = ({overallEvaluation, overallEvaluationScores}) => {
    const options = {
        chart: {
            polar: true,
            type: "line",
        },
        title: {
            text: "Radar Chart with Lines",
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
        };

    return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default RadarChart;
