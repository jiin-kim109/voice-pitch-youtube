import React, {Component} from 'react';
import ChartStream from '../components/ChartStream';
import { connect } from 'react-redux';
import { PitchDetector } from 'pitchy';

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

class Monitor extends Component{
  constructor(props){
    super(props);
    this.state = { 
      currentTick: 0, 
    };

    this.userAudio = {
      analyser: audioCtx.createAnalyser(),
      nodes: [],
      history: [{x: -1, y: -1}],
    };
    this.localAudio = {
      analyser: audioCtx.createAnalyser(),
      nodes: [],
      arrayBuffer: null,
      history: [{x: -1, y: -1}],
    };
  }

  _createUserAudioAnalyser(stream){
    const analyser = this.userAudio.analyser;
    const source = audioCtx.createMediaStreamSource(stream);
    const node = audioCtx.createScriptProcessor();
    source.connect(analyser);
    analyser.connect(node);
    node.connect(audioCtx.destination);

    this.userAudio = {
      ...this.userAudio,
      analyser: analyser,
      nodes: [...this.userAudio.nodes, source, node],
    }

    // keep track of user mic frequencies
    const detector = PitchDetector.forFloat32Array(analyser.fftSize);
    let input = new Float32Array(detector.inputLength);

    node.onaudioprocess = () => {
      this.userAudio.history[this.state.currentTick] = 
      { x: this.state.currentTick, 
        y: this._getPitch(analyser, detector, input),
      };
      this.setState({
        currentTick: this.state.currentTick+1,
      });
    };
  }

  _createLocalAudioAnalyser(){
    const analyser = this.localAudio.analyser;
    this.localAudio.analyser = analyser;

    const detector = PitchDetector.forFloat32Array(analyser.fftSize);
    let input = new Float32Array(detector.inputLength);

    // keep track of local audio frequencies
    let getLocalAudioPitch = (analyser, detector, input, sampleRate) => {
      this.localAudio.history[this.state.currentTick] = 
      { x: this.state.currentTick, 
        y: this._getPitch(analyser, detector, input),
      }
      window.requestAnimationFrame(() => getLocalAudioPitch(analyser, detector, input, audioCtx.sampleRate));
    }
    window.requestAnimationFrame(() => getLocalAudioPitch(analyser, detector, input, audioCtx.sampleRate));
  }

  _setLocalAudioSource(audioBuffer){
    const analyser = this.localAudio.analyser;
    this.localAudio.arrayBuffer = audioBuffer;
    this.localAudio.nodes.forEach(node => node.disconnect());

    audioCtx.decodeAudioData(audioBuffer, buffer => {
      // create source from the file
      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.start(0);

      // create stream node
      const streamNode = audioCtx.createMediaStreamDestination();
      source.connect(analyser);
      analyser.connect(streamNode);

      // attach stream node to audio element
      const audioElem = new Audio();
      audioElem.controls = true;
      audioElem.srcObject = streamNode.stream;
      audioElem.id = "audioFileSource";
      document.getElementsByClassName("audio")[0].appendChild(audioElem);

      this.localAudio = {
        ...this.localAudio,
        analyser: analyser,
        nodes: [...this.localAudio.nodes, source],
      }
    });
  }

  _getPitch(analyser, detector, input){
    analyser.getFloatTimeDomainData(input);
    let [pitch, ] = detector.findPitch(input, audioCtx.sampleRate);
    return parseFloat(pitch);
  }

  componentDidMount(){
    navigator.getUserMedia({audio:true}, 
      stream => {
        this._createUserAudioAnalyser(stream);
      }, e => alert('Error capturing audio.')
    );
    this._createLocalAudioAnalyser();
  }

  componentWillUnmount(){
    
    this.userAudio.nodes.forEach(node => node.disconnect());
    this.userAudio.analyser.disconnect();
    this.localAudio.nodes.forEach(node => node.disconnect());
    this.localAudio.analyser.disconnect();
    audioCtx.close();
  }

  render(){
    if(this.localAudio.arrayBuffer !== this.props.localAudioBuffer)
      this._setLocalAudioSource(this.props.localAudioBuffer);
    return (
      <div>
        <div className="monitor">
          <ChartStream data={this.localAudio.history} currentTick={this.state.currentTick} color="#ff00ff" key={0}/>  
          <ChartStream data={this.userAudio.history} currentTick={this.state.currentTick} color="#0000ff" key={1}/>
        </div>
      </div>  
    );
  }
}

const mapStateToProps = state => ({
  localAudioBuffer: state.setter.localAudioBuffer,
});
export default connect(mapStateToProps)(Monitor);