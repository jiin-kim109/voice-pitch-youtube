import React, {Component} from 'react';
import Gnb from '../components/Gnb';
import Monitor from '../components/Monitor';

class Main extends Component{
    render(){
        return(
            <div>
                <Gnb />
                <div className="bg_layout">
                    <div className="cell">
                        <p>aaa</p>
                    </div>
                    <div className="cell">
                        <Monitor />
                    </div>
                </div>
            </div>
        );
    }
}
export default Main;