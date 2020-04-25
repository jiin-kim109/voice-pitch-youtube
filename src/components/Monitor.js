import React, {Component} from 'react';
import pitchAnalyser from 'pitch-analyser';

import {
    Card, CardTitle, CardText
} from 'reactstrap';

class Monitor extends Component{
  constructor(){
    super();

    this.state = { note: "", cents: 0 };

    const analyserOption = {
      callback: this.analyserCallback,
      returnNote: true,
      returnCents: true,
      decimals: 2
    };
    this.analyser = new pitchAnalyser(analyserOption);
  }
  analyserCallback = (payload) => {
    this.setState({
      note: payload.note,
      cents: payload.cents,
    });
  }
  render(){
    return (
      <div>
        <Card>
            <CardTitle>{this.state.note}</CardTitle>
            <CardText>{this.state.cents}</CardText>
        </Card>
      </div>  
    );
  }
}
export default Monitor;