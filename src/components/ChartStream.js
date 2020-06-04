import React from 'react';

import {
    FlexibleXYPlot,
    LineSeries,
    HorizontalGridLines,
} from 'react-vis';

Math.between = function(r1, r2, n){
    if(n >= r1 && n <= r2) return true;
    else return false;
}

const chartOpts = {
    xDomainSize: 100,
    yDomain: [100, 800],
};

function ChartStream(props) {
    const data = props.data;
    const xEnd = data[data.length-1].x;
    const xDomain = [xEnd - chartOpts.xDomainSize, xEnd];
    const yDomain = chartOpts.yDomain;
    return(
        <div className="chart">
            <FlexibleXYPlot 
                xDomain={xDomain}
                yDomain={yDomain}
              >
              <LineSeries 
                data={data}
                strokeStyle={"solid"}
                stroke={props.color}
                curve={'curveMonotoneX'}
              />
              <HorizontalGridLines/>
            </FlexibleXYPlot>
        </div>
    );
}
export default ChartStream;