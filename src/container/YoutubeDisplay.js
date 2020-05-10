import React, {Component} from 'react';
import YouTube from 'react-youtube';

class YoutubeDisplay extends Component{
    render(){
        const opts = {
            height: "300px",
        };
        return(
            <div className="display">
                <YouTube videoId={this.props.video_id} opts={opts} />
            </div>
        );
    }
}
export default YoutubeDisplay;