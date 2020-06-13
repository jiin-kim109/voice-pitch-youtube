import React, {Component} from 'react';
import { connect } from 'react-redux';
import * as actions from '../redux/modules/youtubeController';

import {
    Card, CardImg, CardTitle, Cardtext
} from 'reactstrap';

class YoutubeList extends Component {
    constructor(props){
        super(props);
        this.state = {selected: ""};
    }

    selectVideo(idx, result){
        this.setState({ selected: idx }, () => this.props.setSelectedVideoId(result.id));
    }

    render(){
        return(
            <div className="yt_list">
                { this.props.results ? this.props.results.map((result,idx) => (
                    <Card 
                        className={idx === this.state.selected ? 'selected' : ''}
                        onClick={() => this.selectVideo(idx, result)}
                        key={idx}
                    >
                        <CardImg className="thumbnail" top width="100%" src={result.thumbnails.default.url} alt=""/>
                        <CardTitle className="title">{result.title}</CardTitle>
                    </Card>                
                )) : <a>Loading videos from Youtube...</a>}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    results: state.youtube.results,
});
const mapDispatchToProps = dispatch => ({
    setSelectedVideoId: videoId => dispatch(actions.setSelectedVideoId(videoId)),
});
export default connect(mapStateToProps, mapDispatchToProps)(YoutubeList);