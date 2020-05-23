import React, {Component} from 'react';

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
    xDomainSize: 500,
    yDomain: [100, 800],
};

class ChartStream extends Component{
    render(){
        const data = this.props.data;
        const currentTick = this.props.currentTick;
        const xDomain = [currentTick - chartOpts.xDomainSize, currentTick];
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
                    stroke={this.props.color}
                    curve={'curveMonotoneX'}
                  />
                  <HorizontalGridLines/>
                </FlexibleXYPlot>
            </div>
        );
    }
}
export default ChartStream;