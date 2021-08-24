
const initialState = {
    payload : 0
};

export default function userPathReducer(state = initialState, action){
    let nextState;
    if (action.type === 'ADD_TO_PATH'){
        nextState = {
            ...state,
            payload: action.payload
        }
    }
    return nextState||state;
}