import React, {Component} from 'react';
import axios from 'axios';
import AudioDropZone from '../components/AudioDropZone';
import * as actions from '../redux/modules/audioSetter';
import { connect } from 'react-redux';

import { Button } from 'reactstrap';

class AudioDisplay extends Component{
    constructor(props){
        super(props);
        this.state = ({ mode: "dropzone", youtubeStream: ''} )
    }

    onAudioDropped(file){
        this.setState({ mode: 'file' });
        let reader = new FileReader();
        reader.addEventListener('load', e => this.props.setLocalAudioBuffer(e.target.result));
        reader.readAsArrayBuffer(file[0]);
        document.getElementById("r_file_btn").style.visibility = "visible";
    }

    onAudioFromYoutube(arrayBuffer){
        this.setState({ mode: 'youtube' });
        this.props.setLocalAudioBuffer(arrayBuffer);
        document.getElementById("r_file_btn").style.visibility = "visible";
    }

    componentDidUpdate(prevProp){
        if(this.props.videoId && prevProp.videoId !== this.props.videoId){
            this.setState({ mode: 'loading' });
            axios.get('api/youtube/' + this.props.videoId, { responseType: 'arraybuffer' })
                .then(fetch => {
                    this.onAudioFromYoutube(fetch.data);
                })
                .catch(e => console.log(e));
        }
    }

    render(){
        return(
            <div className="audio">
                {   this.state.mode === "dropzone"
                    && <AudioDropZone onDrop={file => this.onAudioDropped(file)}/> }
                {   this.state.mode === "youtube"
                    && <img src={'https://cdn.havecamerawilltravel.com/photographer/files/2020/01/youtube-logo-new-678x324@2x.jpg'} 
                            width="100%" height="100%"/>}
                {   this.state.mode === "file"
                    && <img src={'https://laptops-drivers.com/wp-content/uploads/2019/09/LK72B_Hero_Banner_Desktop.jpg'} 
                            width="100%" height="100%"/>}
                {   this.state.mode === "loading"
                    && <a>Downloading from Youtube<br/>this may take a while, please wait...</a>}
                
                <div className="player">
                    <Button id="r_file_btn"
                            color="success" 
                            style={{float: "right", visibility: "hidden"}}
                            onClick={() => {
                                document.getElementById("r_file_btn").style.visibility = "hidden";
                                const player = document.getElementById("audioPlayer");
                                if(player){
                                  document.getElementsByClassName("player")[0].removeChild(player);
                                }
                                this.setState({ mode: "dropzone" });
                            }}
                    >
                        Return
                    </Button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    results: state.youtube.results,
    videoId: state.youtube.videoId,
});
const mapDispatchToProps = dispatch => ({
    setLocalAudioBuffer: arrayBuffer => dispatch(actions.setLocalAudioBuffer(arrayBuffer)),
});
export default connect(mapStateToProps, mapDispatchToProps)(AudioDisplay);