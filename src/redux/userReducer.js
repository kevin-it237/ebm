
const initialState = {
    payload: ""
};

export default function cartReducer(state = initialState, action){
    let nextState;
    if (action.type === 'USER_INFO'){
        nextState = {
            ...state,
            payload: action.payload,
        }
    }
    console.log(nextState)
    return nextState||state;
}