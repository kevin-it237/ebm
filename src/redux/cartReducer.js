
const initialState = {
    payload: "",
    product: [],
    favorite: []
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
    if (action.type === 'ALL_CART_PRODUCT'){
        nextState = {
            ...state,
            product: action.product
        }
    }
    if (action.type === 'ALL_FAVORITE_PRODUCT'){
        nextState = {
            ...state,
            favorite: action.favorite
        }
    }
    return nextState||state;
}