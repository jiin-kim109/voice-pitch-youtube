import {combineReducers} from 'redux';
import audio from './audioSetter';
import youtube from './youtubeResults';

export default combineReducers({
    audio, youtube
});
