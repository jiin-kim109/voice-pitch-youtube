import React, {Component} from 'react';

import {
    InputGroup,
    InputGroupAddon,
    Input,
    Button,
} from 'reactstrap';

class VideoSearch extends Component {
    constructor(props){
        super(props);

        this.state = { video_id: "" }
        this.onInputChange = this.onInputChange.bind(this);
        this.onSearchEvent = this.onSearchEvent.bind(this);
    }
    onInputChange(event){
        let input = JSON.stringify(event.target.value);
        if(input.includes("?v=")){
            let regExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
            let id = input.match(regExp);
            id[1] = id[1].replace("\"", "");
            this.setState({
                video_id: id[1],
            });
        }
        else{
            this.setState({
                video_id: input,
            });
        }
    }
    onSearchEvent(){
        this.props.onSearchVideo(this.state.video_id);
    }

    render (){
        return(
            <div className="search">
                <InputGroup>
                    <Input onChange={this.onInputChange} placeholder="URL or video ID..." />
                    <InputGroupAddon addonType="append">
                        <Button onClick={this.onSearchEvent} color="success">Search</Button>
                    </InputGroupAddon>
                </InputGroup>
            </div>
        );
    };
};
export default VideoSearch;