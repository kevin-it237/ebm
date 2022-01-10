
const initialState = {
    service : [],
    product: []
};

export default function productReducer(state = initialState, action){
    let nextState;
    if (action.type === 'ADD_ALL_PARENT_SERVICE'){
        nextState = {
            ...state,
            service: action.service
        }
    }
    if (action.type === 'ADD_ALL_PRODUCT'){
        nextState = {
            ...state,
            product: action.product
        }
    }
    return nextState||state;
}