import { types } from './types';

/**
 * @param {object} user logged in.
 * @param {object} form when creating an account.
 * @param {boolean} loading_current_user check if there is an account logged when the application loads.
 * @param {string} redirect path to redirect user to.
 * @param {object} error errors that may happen in authetication.
 */
const INITIAL_STATE = {
	user: null,
	loading_current_user: true,
	redirect: null,
	error: null,
};

const AuthReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		
		default:
			return state;
	}
};

export default AuthReducer;
