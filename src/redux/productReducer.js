
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
    console.log(nextState)
    return nextState||state;
}