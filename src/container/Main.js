import React, {Component} from 'react';
import Gnb from '../components/Gnb';
import Monitor from './Monitor';
import AudioDisplay from '././AudioDisplay';
import VideoSearch from '../components/VideoSearch';

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
                    <div className="col1">
                        <AudioDisplay video_id={this.state.video_id}/>
                        <h4 className="header">Or<br/>Search on Youtube!</h4>
                        <div className="youtube_search">
                            <VideoSearch onSearchVideo={id => {}}/>
                        </div>
                    </div>
                    <div className="col2">
                        <Monitor />
                    </div>
                </div>
                <div className="youtube_list">

                </div>
            </div>
        );
    }
}
export default Main;