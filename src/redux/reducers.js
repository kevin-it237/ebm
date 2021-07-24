import { combineReducers } from 'redux';
import AuthReducer from '../applications/auth/redux/reducer/reducer';
import productReducer from "./productReducer";

const reducerCombination = combineReducers({
	AuthReducer,
	product: productReducer
});

export default reducerCombination;
