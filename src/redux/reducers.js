import { combineReducers } from 'redux';
import AuthReducer from '../applications/auth/redux/reducer/reducer';
import productReducer from "./productReducer";
import cartReducer from "./cartReducer";
import userReducer from "./userReducer"
import userPathReducer from "./userPath";

const reducerCombination = combineReducers({
	AuthReducer,
	product: productReducer,
	cart: cartReducer,
	user: userReducer,
	path: userPathReducer
});

export default reducerCombination;
