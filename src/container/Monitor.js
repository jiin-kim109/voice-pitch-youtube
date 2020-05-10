import React, {Component} from 'react';
import ChartStream from './ChartStream';

class Monitor extends Component{

  render(){
    return (
      <div>
        <div className="chart">
          <ChartStream />
        </div>
      </div>  
    );
  }
}
export default Monitor;