import React, {Component} from 'react';

class Gnb extends Component{
    render(){
        return(
            <div className="gnb">
                <h4 className="title">
                    VoicePitch-YT
                </h4>
                <a className="profile" href="https://github.com/jiin-kim109/voice-pitch-youtube" target="_blank" rel="noopener noreferrer">
                    <i class="fa fa-github" style={{fontSize: "36px"}}></i>
                </a>
            </div>
        );
    }
}
export default Gnb;