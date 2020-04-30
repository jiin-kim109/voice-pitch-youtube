import React, {Component} from 'react';
import YouTube from 'react-youtube';

import VideoSearch from '../components/VideoSearch';

class YoutubeDisplay extends Component{
    constructor (props){
        super(props);

        this.state = {
            video_id: "",
        };
    }
    search(id){
        this.setState({
            video_id: id,
        });
    }
    render(){
        const opts = {
            height: "500px",
            width: "100%",
        };
        return(
            <div>
                <YouTube videoId={this.state.video_id} opts={opts} />
                <VideoSearch onSearchVideo={id => this.search(id)}/>
            </div>
        );
    }
}
export default YoutubeDisplay;