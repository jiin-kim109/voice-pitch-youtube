import React, {Component} from 'react';
import search from 'youtube-search';
import * as actions from '../redux/modules/youtubeController';
import { connect } from 'react-redux';

import {
    InputGroup,
    InputGroupAddon,
    Input,
    Button,
} from 'reactstrap';

const API_KEY = "AIzaSyDTHIethDZcFhKJjcpYzwbBFXjS2p6zBJY";
const MAX_RESULTS = 7;

const opts = {
    maxResults: MAX_RESULTS,
    key: API_KEY,
    type: "video",
    videoDuration: "short",
}

class VideoSearch extends Component {
    constructor(props){
        super(props);
        this.state = { lastKeywords: "", nextPageToken: null }
        this.keywords = "";
    }
    componentDidMount(){
        search("best music", opts, (error, results) => {this.props.setSearchResults(results)});
    }
    searchKeywords = (event, pageToken=null) => {
        let options = opts;
        options.pageToken = pageToken;
        const keywords = pageToken ? this.state.lastKeywords : this.keywords;
        this.props.setSearchResults(null);
        search(this.keywords, options, (error, results) => {
            if(error) console.log(error);
            else {
                this.props.setSearchResults(results);
                this.setState({ lastKeywords: keywords, nextPageToken: results.nextPageToken });
            }
        });
    }

    render (){
        return(
            <div style={{display: 'inline-block', width: '100%'}}>
                <InputGroup style={{float: 'left', width: '400px'}}>
                    <Input placeholder="keywords..." onChange={event => {this.keywords = event.target.value}}/>
                    <InputGroupAddon addonType="append">
                        <Button onClick={event => this.searchKeywords(event)} color="info">Search</Button>
                    </InputGroupAddon>
                </InputGroup>
                <Button outline disabled={this.state.nextPageToken === null ? true:false} color="primary" 
                        style={{marginLeft: '20px'}}
                        onClick={event => this.searchKeywords(event, this.state.nextPageToken)}>
                    More Videos...
                </Button>
            </div>
        );
    };
};
const mapDispatchToProps = dispatch => ({
    setSearchResults: results => dispatch(actions.setSearchResults(results)),
});
export default connect(null, mapDispatchToProps)(VideoSearch);