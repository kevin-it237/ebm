const initialState = {
    payload : false
};

export default function drawerReducer(state = initialState, action){
    let nextState;
    if (action.type === 'ADD_TO_REDUCER'){
        nextState = {
            ...state,
            payload: action.payload
        }
    }
    return nextState||state;
}