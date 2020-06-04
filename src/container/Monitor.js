import React, {Component} from 'react';
import ChartStream from '../components/ChartStream';
import { connect } from 'react-redux';
import { PitchDetector } from 'pitchy';
import isDeepEqual from "react-fast-compare";

const TICK_INTERVAL = 50;
const DATA_MEMORY_LIMIT = 2000;

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const MemoChartStream = React.memo(props => <ChartStream {...props} />, isDeepEqual);

class Monitor extends Component{
  constructor(props){
    super(props);
    this.state = {
      userData: [{x: -1, y: -1}],
      localData: [{x: -1, y: -1}],
    };

    this.audioStreams = [];
    this.audioStreams["user"] = {
      analyser: audioCtx.createAnalyser(),
      nodes: [],
    };
    this.audioStreams["local"] = {
      analyser: audioCtx.createAnalyser(),
      nodes: [],
      arrayBuffer: null,
    };
    this.tick = 0;
  }

  componentDidMount(){
    navigator.getUserMedia({audio:true}, 
      stream => {
        this._createUserStream(stream);
      }, e => alert('Error capturing audio.')
    );
    this._createLocalStream();

    this.t = setInterval(() => {this.tick++}, TICK_INTERVAL);
  }

  componentWillUnmount(){
    this.audioStreams["user"].nodes.forEach(node => node.disconnect());
    this.audioStreams["user"].analyser.disconnect();
    this.audioStreams["local"].nodes.forEach(node => node.disconnect());
    this.audioStreams["local"].analyser.disconnect();
    audioCtx.close();
    clearInterval(this.t);
  }

  _createUserStream(media){
    const analyser = this.audioStreams["user"].analyser;
    const source = audioCtx.createMediaStreamSource(media);
    const node = audioCtx.createScriptProcessor();
    source.connect(analyser);
    analyser.connect(node);
    node.connect(audioCtx.destination);

    this.audioStreams["user"] = {
      ...this.audioStreams["user"],
      analyser: analyser,
      nodes: [...this.audioStreams["user"].nodes, source, node],
    }

    // keep track of user mic frequencies
    const detector = PitchDetector.forFloat32Array(analyser.fftSize);
    let input = new Float32Array(detector.inputLength);

    node.onaudioprocess = () => {
      let userData = this.state.userData.concat({
        x: this.tick, 
        y: this._getPitch(analyser, detector, input),
      });
      if(userData.length > DATA_MEMORY_LIMIT) userData.splice(0, 1);
      this.setState({
        userData: userData
      });
    };
  }

  _createLocalStream(){
    const analyser = this.audioStreams["local"].analyser;
    this.audioStreams["local"].analyser = analyser;

    const detector = PitchDetector.forFloat32Array(analyser.fftSize);
    let input = new Float32Array(detector.inputLength);

    // keep track of local audio frequencies
    let getLocalAudioPitch = (analyser, detector, input) => {
      if(this.audioStreams["local"].arrayBuffer !== null) {
        let localData = this.state.localData.concat({
          x: this.tick,
          y: this._getPitch(analyser, detector, input),         
        });
        if(localData.length > DATA_MEMORY_LIMIT) localData.splice(0,1);
        this.setState({
          localData: localData,
        });
      }
      window.requestAnimationFrame(() => getLocalAudioPitch(analyser, detector, input));
    }
    window.requestAnimationFrame(() => getLocalAudioPitch(analyser, detector, input));
  }

  _setLocalAudioSource(audioBuffer){
    const analyser = this.audioStreams["local"].analyser;
    this.audioStreams["local"].arrayBuffer = audioBuffer;
    this.audioStreams["local"].nodes.forEach(node => node.disconnect());

    const blob = new Blob([audioBuffer], { type: "audio/wav" });
    const url = window.URL.createObjectURL(blob);
    const audioElem = new Audio();
    audioElem.controls = true;
    audioElem.src = url;
    audioElem.id = "audioFileSource";
    document.getElementsByClassName("audio")[0].appendChild(audioElem);

    const source = audioCtx.createMediaElementSource(audioElem);
    source.connect(analyser);
    source.connect(audioCtx.destination);
  }

  _getPitch(analyser, detector, input){
    analyser.getFloatTimeDomainData(input);
    let [pitch, ] = detector.findPitch(input, audioCtx.sampleRate);
    return parseFloat(pitch);
  }

  render(){
    if(this.props.localAudioBuffer
        && this.props.localAudioBuffer !== this.audioStreams["local"].arrayBuffer) 
      this._setLocalAudioSource(this.props.localAudioBuffer);
    return (
      <div>
        <div className="monitor">
          <MemoChartStream data={this.state.localData} color="#ff00ff" key={0}/>  
          <MemoChartStream data={this.state.userData} color="#0000ff" key={1}/>
        </div>
      </div>  
    );
  }
}

const mapStateToProps = state => ({
  localAudioBuffer: state.setter.localAudioBuffer,
});
export default connect(mapStateToProps)(Monitor);