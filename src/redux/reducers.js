import { combineReducers } from 'redux';
import AuthReducer from '../applications/auth/redux/reducer/reducer';

const reducerCombination = combineReducers({
	AuthReducer,
});

export default reducerCombination;
