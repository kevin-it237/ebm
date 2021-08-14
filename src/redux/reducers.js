import { combineReducers } from 'redux';
import AuthReducer from '../applications/auth/redux/reducer/reducer';
import productReducer from "./productReducer";
import cartReducer from "./cartReducer";

const reducerCombination = combineReducers({
	AuthReducer,
	product: productReducer,
	cart: cartReducer
});

export default reducerCombination;
