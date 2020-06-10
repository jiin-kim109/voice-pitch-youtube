import React, {Component} from 'react';
import axios from 'axios';
import AudioDropZone from '../components/AudioDropZone';
import * as actions from '../redux/modules/audioSetter';
import { connect } from 'react-redux';

class AudioDisplay extends Component{
    constructor(props){
        super(props);
        this.state = ({ mode: "none", youtubeStream: ''} )
    }

    onAudioDropped(file){
        let reader = new FileReader();
        reader.addEventListener('load', e => this.props.setLocalAudioBuffer(e.target.result));
        reader.readAsArrayBuffer(file[0]);
    }

    static getDerivedStateFromProps(props){
        axios.get('api/youtube/' + props.videoId, { responseType: 'arraybuffer' })
            .then(fetch => {
                const data = fetch.data;
                return { mode: 'youtube', youtubeStream: data };
            })
            .catch(e => {   
                return null;
            });
        return null;
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

const mapStateToProps = state => ({
    results: state.youtube.results,
});
const mapDispatchToProps = dispatch => ({
    setLocalAudioBuffer: arrayBuffer => dispatch(actions.setLocalAudioBuffer(arrayBuffer)),
});
export default connect(mapStateToProps, mapDispatchToProps)(AudioDisplay);