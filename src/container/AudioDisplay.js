import React, {Component} from 'react';
import AudioDropZone from '../components/AudioDropZone';
import * as actions from '../redux/modules/audioSetter';
import { connect } from 'react-redux';

class AudioDisplay extends Component{
    constructor(props){
        super(props);
        this.state = ({ mode: "none"} )
    }

    onAudioDropped(file){
        let reader = new FileReader();
        reader.addEventListener('load', e => this.props.setLocalAudioBuffer(e.target.result));
        reader.readAsArrayBuffer(file[0]);
    }

    render(){
        return(
            <div className="audio">
                {
                    this.state.mode === "none"
                    && <AudioDropZone onDrop={file => this.onAudioDropped(file)}/>
                }
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    setLocalAudioBuffer: arrayBuffer => dispatch(actions.setLocalAudioBuffer(arrayBuffer)),
});
export default connect(null, mapDispatchToProps)(AudioDisplay);