
const SET_LOCAL_AUDIO_BUFFER = 'audioSetter/SET_LOCAL_AUDIO_BUFFER';

export const setLocalAudioBuffer = arrayBuffer => ({type: SET_LOCAL_AUDIO_BUFFER, arrayBuffer});

const initialState = {
    localAudioBuffer: null,
};

export default function audio(state = initialState, action){
    switch(action.type){
        case SET_LOCAL_AUDIO_BUFFER:
            return {
                ...state,
                localAudioBuffer: action.arrayBuffer,
        };
        default:
            return state;
    }
}