import React, {Component} from 'react';
import search from 'youtube-search';
import * as actions from '../redux/modules/youtubeResults';
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
}

class VideoSearch extends Component {
    constructor(props){
        super(props);
        this.state = { pageToken: "1" }
        this.keyword = "";
    }
    componentDidMount(){
        search("best music", opts, (error, results) => {this.props.setSearchResults(results)});
    }
    searchKeyword = () => {
        let options = opts;
        //pageToken
        search(this.keyword, options, (error, results) => {
            if(error) console.log(error);
            else this.props.setSearchResults(results);
        });
    }

    render (){
        return(
            <div>
                <InputGroup>
                    <Input placeholder="keywords..." onChange={event => {this.keyword = event.target.value}}/>
                    <InputGroupAddon addonType="append">
                        <Button onClick={this.searchKeyword} color="info">Search</Button>
                    </InputGroupAddon>
                </InputGroup>
            </div>
        );
    };
};
const mapDispatchToProps = dispatch => ({
    setSearchResults: results => dispatch(actions.setSearchResults(results)),
});
export default connect(null, mapDispatchToProps)(VideoSearch);