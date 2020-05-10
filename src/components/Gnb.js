import React, {Component} from 'react';
import VideoSearch from './VideoSearch';

import {
    Navbar,
    Badge,
    NavItem,
} from 'reactstrap';

class Gnb extends Component{
    render(){
        return(
            <div>
                <Navbar className="nav" light>
                    <Badge className="brand" color="success" href="/">VoicePitch YT</Badge>
                    <NavItem className="searchBar">
                        <VideoSearch onSearchVideo={id => this.props.onSearchVideo(id)}/>
                    </NavItem>
                    <div className="profile">
                        <p>Github</p>
                    </div>
                </Navbar>
            </div>
        );
    }
}
export default Gnb;