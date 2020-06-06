import React, {Component} from 'react';
import Gnb from '../components/Gnb';
import Monitor from './Monitor';
import AudioDisplay from './AudioDisplay';
import VideoSearch from '../components/VideoSearch';
import YoutubeList from './YoutubeList';

class Main extends Component{
    render(){
        return(
            <div id="main">
                <Gnb onSearchVideo={id => this.onSearchVideo(id)}/>
                <div className="body_layout">
                    <div className="col1">
                        <AudioDisplay />
                        <div className="yt_tool">
                            <h4 className="header">Or search on Youtube!</h4>
                            <div className="searchBar">
                                <VideoSearch />
                            </div>
                        </div>
                    </div>
                    <div className="col2">
                        <Monitor />
                    </div>
                </div>
                <YoutubeList />
            </div>
        );
    }
}
export default Main;