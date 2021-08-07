
const initialState = {
    payload: ""
};

export default function productReducer(state = initialState, action){
    let nextState;
    if (action.type === 'ADD_TO_CART'){
        nextState = {
            ...state,
            payload: action.payload
        }
    }

    if (action.type === 'SEARCH_INSTITUTE'){
        nextState = {
            ...state,
            payload: action.payload
        }
    }
    return nextState||state;
}