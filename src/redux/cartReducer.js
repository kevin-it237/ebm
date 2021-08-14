
const initialState = {
    payload: ""
};

export default function cartReducer(state = initialState, action){
    let nextState;
    if (action.type === 'ADD_TO_CART'){
        nextState = {
            ...state,
            payload: action.payload
        }
    }
    return nextState||state;
}