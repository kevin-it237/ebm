
const initialState = {
    payload : 0
};

export default function productReducer(state = initialState, action){
    let nextState;
    if (action.type === 'ADD_TO_FAVORITE'){
        nextState = {
            ...state,
            payload: action.payload,
            loader: action.loader
        }
    }

    if (action.type === 'ALL_PRESTATION'){
        nextState = {
            ...state,
            payload: action.payload
        }
    }

    return nextState||state;
}