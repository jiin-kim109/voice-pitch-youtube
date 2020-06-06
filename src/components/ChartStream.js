import React from 'react';

import {
    FlexibleXYPlot,
    LineSeries,
} from 'react-vis';

Math.between = function(r1, r2, n){
    if(n >= r1 && n <= r2) return true;
    else return false;
}

const chartOpts = {
    xSize: 200,
};

function ChartStream(props) {
    const data = props.data;
    const xEnd = data[data.length-1].x;
    const xDomain = [xEnd - chartOpts.xSize, xEnd];
    const yDomain = props.yDomain;
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
                getNull={(d) => d.y !== null}
              />
              
            </FlexibleXYPlot>
        </div>
    );
}
export default ChartStream;