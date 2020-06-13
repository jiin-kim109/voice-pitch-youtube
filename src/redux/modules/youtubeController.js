
const SET_SEARCH_RESULTS = 'youtubeResults/SET_SEARCH_RESULTS';
const SET_SELECTED_VIDEO_ID = 'youtubeResults/SET_SELECTED_VIDEO_ID';

export const setSearchResults = results => ({type: SET_SEARCH_RESULTS, results});
export const setSelectedVideoId = videoId => ({type: SET_SELECTED_VIDEO_ID, videoId});

const initialState = {
    results: null,
    videoId: null,
};

export default function youtube(state = initialState, action){
    switch(action.type){
        case SET_SEARCH_RESULTS:
            return {
                ...state,
                results: action.results,
        };
        case SET_SELECTED_VIDEO_ID:
            return {
                ...state,
                videoId: action.videoId,
        };
        default:
            return state;
    }
}