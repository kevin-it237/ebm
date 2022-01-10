import { combineReducers } from 'redux';
import AuthReducer from '../applications/auth/redux/reducer/reducer';
import productReducer from "./productReducer";
import cartReducer from "./cartReducer";
import userReducer from "./userReducer"
import userPathReducer from "./userPath";
import messageReducer from "./messageReducer";
import drawerReducer from "./drawerReducer";
import serviceReducer from "./serviceReducer";
import profileReducer from "./profileReducer";

const reducerCombination = combineReducers({
	AuthReducer,
	product: productReducer,
	service: serviceReducer,
	cart: cartReducer,
	user: userReducer,
	path: userPathReducer,
	message: messageReducer,
	drawer: drawerReducer,
	profile: profileReducer
});

export default reducerCombination;
