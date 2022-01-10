
const initialState = {
    profile : [],
    product: []
};

export default function productReducer(state = initialState, action){
    let nextState;
    if (action.type === 'ALL_PROFILE_INFO'){
        nextState = {
            ...state,
            profile: action.profile
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