import React, {Component} from 'react';
import Gnb from '../components/Gnb';
import Monitor from './Monitor';
import YoutubeDisplay from './YoutubeDisplay';

class Main extends Component{
    state = {
        video_id: "",
    }
    onSearchVideo(id){
        this.setState({
            video_id: id,
        });
    }
    render(){
        return(
            <div id="main">
                <Gnb onSearchVideo={id => this.onSearchVideo(id)}/>
                <div className="body_layout">
                    <div className="audio">
                        <YoutubeDisplay video_id={this.state.video_id}/>
                        <h4>Or<br/>Search on Youtube...</h4>
                    </div>
                    <div className="monitor">
                        <Monitor />
                    </div>
                </div>
            </div>
        );
    }
}
export default Main;