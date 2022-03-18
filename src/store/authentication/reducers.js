import { AUTHENTICATION_TYPES } from "./action";

export function authenticationReducer(
	state = {
		isLogin: false,
		customer: {},
		token: {},
		user: {},
		infoSignup: {},
		idForgotPass: '',
		isRemainedSendOTP: true,
		remainedTime: 3,
		isLoading: false,
		infoResetPass: '',
		personal_information:{},
		role_info: [],
		employee_id:'',
		agent_id: '',
	},
	action
) {
	switch (action.type) {
		case AUTHENTICATION_TYPES.SET_IS_LOGIN: {
			return {
				...state,
				isLogin: action.payload
			}
		}
		case AUTHENTICATION_TYPES.SET_USER_LOGIN: {
			return {
				...state,
				customer: action.payload.customer,
				token: action.payload.token,
				user: action.payload.user,
				personal_information: action.payload.personal_information,
				employee_id: action.payload.employee_id,
				agent_id: action.payload.agent_id
			}
		}
		case AUTHENTICATION_TYPES.SET_INFO_SIGNUP: {
			return {
				...state,
				infoSignup: action.payload,
			}
		}
		case AUTHENTICATION_TYPES.SET_ROLE_INFO: {
			return {
				...state,
				role_info: action.payload,
			}
		}
		case AUTHENTICATION_TYPES.UPDATE_AVATAR: {
			return {
				...state,
				user: action.payload
			}
		}
		case AUTHENTICATION_TYPES.SET_ID_FORGOTPASSWORD: {
			return {
				...state,
				idForgotPass: action.payload,
			}
		}
		case AUTHENTICATION_TYPES.REMAINED_TIME_SEND_OTP: {
			return {
				...state,
				isRemainedSendOTP: action.payload,
			}
		}
		case AUTHENTICATION_TYPES.SET_REMAIN_TIME: {
			return {
				...state,
				remainedTime: state.remainedTime - 1
			}
		}
		case AUTHENTICATION_TYPES.RESET_REMAIN_TIME: {
			return {
				...state,
				remainedTime: 3,
				infoSignup: {}
			}
		}
		case AUTHENTICATION_TYPES.CLEAR_TOKEN: {
			return {
				...state,
				customer: null,
				token: null,
				user: null,
				personal_information: null,
				employee_id: null,
				agent_id: null
			}
		}
		case AUTHENTICATION_TYPES.SET_LOADING: {
			return {
				...state,
				isLoading: action.payload,
			}
		}
		default: {
			return state;
		}
	}
}