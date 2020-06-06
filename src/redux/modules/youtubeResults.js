
const SET_SEARCH_RESULTS = 'youtubeResults/SET_SEARCH_RESULTS';

export const setSearchResults = results => ({type: SET_SEARCH_RESULTS, results});

const initialState = {
    results: null,
};

export default function youtube(state = initialState, action){
    switch(action.type){
        case SET_SEARCH_RESULTS:
            return {
                ...state,
                results: action.results,
        };
        default:
            return state;
    }
}