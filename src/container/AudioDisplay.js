import React, {Component} from 'react';
import AudioDropZone from '../components/AudioDropZone';

class AudioDisplay extends Component{

    constructor(props){
        super(props);
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.state = { audio: null, duration: 0, };
    }

    onAudioDropped(file){
        let reader = new FileReader();
        reader.addEventListener('load', e => {
            this.audioCtx.decodeAudioData(e.target.result, buffer => {
                let source = this.audioCtx.createBufferSource();
                source.buffer = buffer;
                source.connect(this.audioCtx.destination);
                source.start(0);
    
                this.setState({
                    audio: source,
                    duration: buffer.duration,
                });
            });
        });
        reader.readAsArrayBuffer(file[0]);
    }

    render(){
        return(
            <div className="audio">
                {
                    this.state.audio === null
                    ? <AudioDropZone onDrop={file => this.onAudioDropped(file)}/>
                    : (<audio controls>
                        <source src={this.state.audio} type="audio/mpeg"/>
                        Your browser does not support the audio element.
                       </audio>)
                }
            </div>
        );
    }
}
export default AudioDisplay;