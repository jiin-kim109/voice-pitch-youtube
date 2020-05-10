import React, {Component} from 'react';
import pitchAnalyser from 'pitch-analyser';

import {
    FlexibleWidthXYPlot,
    LineSeries,
    HorizontalGridLines,
} from 'react-vis';
import {
    Card, CardTitle, CardText
} from 'reactstrap';

Math.between = function(r1, r2, n){
    if(n >= r1 && n <= r2) return true;
    else return false;
}

const chart_opts = {
    height: 500,
    xDomain: [0, 300],
    xLengthMaximum: 1000,
    yDomain: [0, 500],
    ySize: () => { return this.yDomain[1] - this.yDomain[0] },
    yDomainMargin: 50,
    yLerpTime: 1,
    noiseFreqDiff: 70,
};

class Chart extends Component{
    constructor(props){
        super(props);

        const analyserOption = {
            callback: this.analyserCallback.bind(this),
            returnNote: true,
            returnCents: true,
            decimals: 2
        };
        this.analyser = new pitchAnalyser(analyserOption);
        this.t = setTimeout(() => { this.analyser.state !== "running" ? this.analyser.audioContext.resume() : clearTimeout(this.t); }, 3000);
    
        this.state = 
        { 
            tick: 0,
            data: [{x:0, y:0}],
        };
        this.lastFrequencyAvg = parseFloat(0.0);
        this.xDomain = chart_opts.xDomain;
        this.yDomain = chart_opts.yDomain;
    }

    analyserCallback = (payload) => {
        payload.frequency = parseFloat(payload.frequency);
        Math.abs(payload.frequency - this.lastFrequencyAvg) > chart_opts.noiseFreqDiff
            ?   this.appendChartData({x:this.state.tick, y:null})
            :   this.appendChartData({x:this.state.tick, y:payload.frequency});
        this.lastFrequencyAvg = (this.lastFrequencyAvg + payload.frequency)/2;
    }

    appendChartData(coords){
        this.setState( state => {
            const data = state.data.concat(coords);
            if(state.data.length > chart_opts.xLengthMaximum) state.data.splice(0, 1);
            const tick = state.tick + 1;
            return {
                tick,
                data,
            };
        });
        this.xDomain = this.state.tick > chart_opts.xDomain[1]
            ? [this.state.tick - chart_opts.xDomain[1], this.state.tick]
            : chart_opts.xDomain;
        const yDiff = coords.y - this.yDomain[1];

    }

    componentDidMount(){
    }

    componentWillUnmount(){
        clearTimeout(this.t);
        this.analyser.close();
    }
    render(){
        return(
            <div>
                <FlexibleWidthXYPlot 
                    height={chart_opts.height}
                    xDomain={this.xDomain}
                    yDomain={this.yDomain}
                    style={{backgroundColor: "black"}}
                  >
                  <LineSeries 
                    data={this.state.data}
                    strokeStyle={"solid"}
                    stroke={"#0000ff"}
                    curve={'curveMonotoneX'}
                    getNull={(d) => d.y !== null}
                  />
                  <HorizontalGridLines/>
                </FlexibleWidthXYPlot>
                <Card>
                    <CardTitle>{this.state.note}</CardTitle>
                    <CardText>{this.state.frequency}</CardText>
                </Card>
            </div>
        );
    }
}
export default Chart;