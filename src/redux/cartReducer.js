
const initialState = {
    payload: ""
};

export default function cartReducer(state = initialState, action){
    let nextState;
    if (action.type === 'ADD_TO_CART'){
        nextState = {
            ...state,
            payload: action.payload,
            loader: action.loader,
            message: action.message
        }
    }
    console.log(nextState)
    return nextState||state;
}