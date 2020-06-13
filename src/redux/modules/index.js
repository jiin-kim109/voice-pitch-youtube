import {combineReducers} from 'redux';
import audio from './audioSetter';
import youtube from './youtubeController';

export default combineReducers({
    audio, youtube
});
