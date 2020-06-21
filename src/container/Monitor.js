import React, {Component} from 'react';
import ChartStream from '../components/ChartStream';
import { connect } from 'react-redux';
import { PitchDetector } from 'pitchy';
import isDeepEqual from "react-fast-compare";
import FrequencyMap from 'note-frequency-map';

const DEFAULT_FRAME_RATE = 40;
const FRAME_CHANGE_UNIT = 10;
const DEFAULT_VOLUME_MIN_FILTER_VALUE = 7;
const VOLUME_MIN_CHANGE_UNIT = 1;

const DATA_MEMORY_LIMIT = 2000;
const MAX_FREQUENCY_RANGE = 1500;
const FREQUENCY_RANGE_INTERVAL = 100;

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const MemoChartStream = React.memo(props => <ChartStream {...props} />, isDeepEqual);

class Monitor extends Component{
  constructor(props){
    super(props);
    this.state = {
      userData: [{x: -1, y: -1}],
      localData: [{x: -1, y: -1}],
      yDomain: [FREQUENCY_RANGE_INTERVAL, parseInt(MAX_FREQUENCY_RANGE/FREQUENCY_RANGE_INTERVAL/2)*FREQUENCY_RANGE_INTERVAL],
      frameRate: DEFAULT_FRAME_RATE,
      noiseFilter: DEFAULT_VOLUME_MIN_FILTER_VALUE,
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
    this.status = "ab";
  }

  componentDidMount(){
    navigator.getUserMedia({audio:true}, 
      stream => {
        this.status = this.status.replace('a', '');
        this.status = this.status.concat('c');
        this._createUserStream(stream);
      }, e => alert('Error capturing an audio input device.')
    );
    this._createLocalStream();

    this.resumeCtx = setInterval(() => {
      if(audioCtx.state !== "running")
        audioCtx.resume();
      else{
        this.status = this.status.replace('b', '');
        clearInterval(this.resumeCtx);
      }
    }, 3000);
    this.t = setInterval(() => {this.tick++}, this.state.frameRate);
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
    let array = new Uint8Array(analyser.frequencyBinCount);
    let pitch = null;

    node.onaudioprocess = () => {
      analyser.getByteFrequencyData(array);
      if(this._getVolume(array) < this.state.noiseFilter) 
        pitch = null;
      else
        pitch = this._getPitch(analyser, detector, input);

      let userData = this.state.userData.concat({
        x: this.tick, 
        y: pitch,
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
    let array = new Uint8Array(analyser.frequencyBinCount);
    let pitch = null;

    // keep track of local audio frequencies
    let getLocalAudioPitch = (analyser, detector, input) => {
      if(this.audioStreams["local"].arrayBuffer !== null) {
        analyser.getByteFrequencyData(array);
        if(this._getVolume(array) < this.state.noiseFilter) 
          pitch = null;
        else
          pitch = this._getPitch(analyser, detector, input);

        let localData = this.state.localData.concat({
          x: this.tick,
          y: pitch,         
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
    audioElem.id = "audioPlayer";
    const player = document.getElementById("audioPlayer");
    if(player){
      document.getElementsByClassName("player")[0].removeChild(player);
    }
    document.getElementsByClassName("player")[0].appendChild(audioElem);

    const source = audioCtx.createMediaElementSource(audioElem);
    source.connect(analyser);
    source.connect(audioCtx.destination);
  }

  _getPitch(analyser, detector, input){
    analyser.getFloatTimeDomainData(input);
    let [pitch, ] = detector.findPitch(input, audioCtx.sampleRate);
    return parseFloat(pitch);
  }

  _getVolume(array){
    let weight = 0;
    for (var i = 0; i < array.length; i++) {
        weight += array[i];
    }
    return weight / array.length;
  }

  render(){
    if(this.props.localAudioBuffer
        && this.props.localAudioBuffer !== this.audioStreams["local"].arrayBuffer) 
      this._setLocalAudioSource(this.props.localAudioBuffer);

    const frequency = parseFloat(this.state.userData[this.state.userData.length-1].y);
    const frequencyRange = [];
    for(let i=0; i<=MAX_FREQUENCY_RANGE-FREQUENCY_RANGE_INTERVAL; i+=FREQUENCY_RANGE_INTERVAL)
      frequencyRange.push(parseInt(i));
    const note = FrequencyMap.noteFromFreq(frequency);

    return (
      <div>
        <div className="monitor">
          <div className="properties">
            <p className="freq">frequency: {frequency !== null && frequency.toFixed(4)}</p>
            <h3 className="note">{note.name}{note.octave}</h3>
            <div style={{padding: "20px 0px 0px 5px"}}>
              { this.status.includes('a') && <a style={{color: "yellow"}}>Capturing an audio input device...<br/></a>}
              { this.status.includes('b') && <a style={{color: "yellow"}}>Error! Audio context suspended<br/></a>}
              { this.status.includes('c') && <a style={{color: "green"}}>Connected to user's microphone<br/></a>}
            </div>
          </div>
          <MemoChartStream data={this.state.localData} color="orange" key={0} yDomain={this.state.yDomain}/>  
          <MemoChartStream data={this.state.userData} color="#0000ff" key={1} yDomain={this.state.yDomain}/>
        </div>

        <div className="settings">
          <div className="zoom">
            <h5>Frequency Zoom</h5>
            <select value={this.state.yDomain[0]} onChange={event => {
              const bottom = parseInt(event.target.value);
              const top = this.state.yDomain[1] < bottom ? bottom+FREQUENCY_RANGE_INTERVAL : this.state.yDomain[1];
              this.setState({yDomain: [bottom, top]})
            }}>
            {
              frequencyRange.map((freq, key) => 
                (<option value={freq} key={key}>{freq}</option>)
              )
            }</select>
            <a> to </a>
            <select value={this.state.yDomain[1]} onChange={event => {
              const bottom = parseInt(this.state.yDomain[0]);
              const top = event.target.value
              this.setState({yDomain: [bottom, top]})
            }}>
            {
              frequencyRange
              .concat(MAX_FREQUENCY_RANGE)
              .filter(d => d > this.state.yDomain[0])
              .map((freq, key) => 
                (<option value={freq} key={key}>{freq}</option>)
              )
            }</select>
          </div>

          <div className="filter">
            <h5>Noise Filter</h5>
            <button onClick={() => {
              const filter = Math.max(this.state.noiseFilter - VOLUME_MIN_CHANGE_UNIT, 0); 
              this.setState({ noiseFilter: filter });
            }}>-</button>
              <a> {this.state.noiseFilter} </a>
            <button onClick={() => {
              const filter = this.state.noiseFilter + VOLUME_MIN_CHANGE_UNIT 
              this.setState({ noiseFilter: filter });
            }}>+</button>
          </div>

          <div className="frame">
            <h5>Frame Rate</h5>
            <button onClick={() => {
              clearInterval(this.t);
              const rate = this.state.frameRate + FRAME_CHANGE_UNIT;
              this.setState({ frameRate: rate }
                , () => this.t = setInterval(() => {this.tick++}, this.state.frameRate));
            }}>+</button>
              <a> {this.state.frameRate} </a>
            <button onClick={() => {
              clearInterval(this.t);
              const rate = Math.max(this.state.frameRate-FRAME_CHANGE_UNIT, 10);
              this.setState({ frameRate: rate }
                , () => this.t = setInterval(() => {this.tick++}, this.state.frameRate));
            }}>-</button>
          </div>
        </div>
      </div>  
    );
  }
}

const mapStateToProps = state => ({
  localAudioBuffer: state.audio.localAudioBuffer,
});
export default connect(mapStateToProps)(Monitor);