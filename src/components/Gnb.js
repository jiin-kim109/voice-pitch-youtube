import React from 'react';
import {
    Navbar,
    NavbarBrand,
    NavbarText,
} from 'reactstrap';

const Gnb = (props) => {
    return(
        <div>
            <div className="gnb">
            <Navbar className="nav" light>
                <NavbarBrand className="brand" href="/">VoicePitch YT</NavbarBrand>
                <NavbarText>Simple Text</NavbarText>
            </Navbar>
            <div className="profile" style={{float: "right", backgroundColor: "Red"}}>
                <p>Github</p>
            </div>
            </div>
        </div>
    );
}
export default Gnb;