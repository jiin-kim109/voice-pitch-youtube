import React, {Component} from 'react';
import pitchAnalyser from 'pitch-analyser';

import {
    Card, CardTitle, CardText
} from 'reactstrap';
import {
  FlexibleWidthXYPlot,
  LineSeries,
  HorizontalGridLines,
} from 'react-vis';

const dummy = [
  {x:0, y:5},
  {x:1, y:3},
  {x:2, y:7},
  {x:3, y:15},
  {x:4, y:3},
  {x:5, y:7},
  {x:6, y:15},
];

class Monitor extends Component{
  constructor(){
    super();

    this.state = { note: "", cents: 0 };
  }
  analyserCallback = (payload) => {
    this.setState({
      note: payload.note,
      cents: payload.cents,
    });
  }
  componentDidMount(){
    const analyserOption = {
      callback: this.analyserCallback,
      returnNote: true,
      returnCents: true,
      decimals: 2
    };
    this.analyser = new pitchAnalyser(analyserOption);
    this.analyser.audioContext.resume();
  }
  componentWillUnmount(){
    this.analyser.close();
  }
  render(){
    return (
      <div>
        test chart
        <div className="chart">
          <FlexibleWidthXYPlot 
            height={500} 
            style={{backgroundColor: "black"}}
            xDomain={[0, 10]}
            >
            <LineSeries 
              margin={{left:"100", right:"100"}}
              data={dummy}
              strokeStyle={"solid"}
              stroke={"#0000ff"}
            />
            <HorizontalGridLines/>
          </FlexibleWidthXYPlot>
        </div>
        <Card>
            <CardTitle>{this.state.note}</CardTitle>
            <CardText>{this.state.cents}</CardText>
        </Card>
      </div>  
    );
  }
}
export default Monitor;