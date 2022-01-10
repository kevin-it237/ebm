const initialState = {
    payload : 0
};

export default function messageReducer(state = initialState, action){
    let nextState;
    if (action.type === 'ADD_TO_MESSAGE'){
        nextState = {
            ...state,
            payload: action.payload,
            loader: action.loader
        }
    }
    return nextState||state;
}