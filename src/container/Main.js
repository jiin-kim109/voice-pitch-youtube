import React, {Component} from 'react';
import Gnb from '../components/Gnb';
import Monitor from './Monitor';
import YoutubeDisplay from './YoutubeDisplay';

class Main extends Component{
    render(){
        return(
            <div id="main">
                <Gnb />
                <div className="body_layout">
                    <div className="col_1">
                        <YoutubeDisplay />
                    </div>
                    <div className="col_2">
                        <Monitor />
                    </div>
                </div>
            </div>
        );
    }
}
export default Main;