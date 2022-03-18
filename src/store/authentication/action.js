export const AUTHENTICATION_TYPES = {
	SET_IS_LOGIN: 'authentication/setIsLogin',
	LOGIN: 'authentication/login',
	SET_USER_LOGIN: 'authentication/setUserLogin',
	SIGNUP: 'authentication/signup',
	REMAINED_TIME_SEND_OTP: 'authentication/remainedTimeSendOTP',
	SET_INFO_SIGNUP: 'authentication/setInfoSignup', 
	SIGNUP_CONFIRM: 'authentication/signupConfirmation',
	CHANGE_PASSWORD: 'authentication/changePassword',
	SIGNOUT: 'authentication/logout',
	FORGOT_PASSWORD: 'authentication/forgotPassword',
	SET_ID_FORGOTPASSWORD: 'authentication/setIdForgotPassword',
	FORGOT_PASSWORD_CONFIRMATION: 'authentication/setIdForgotPasswordConfirmation',
	SET_REMAIN_TIME: 'authentication/setRemainTime',
	RESET_REMAIN_TIME: 'authentication/resetReaminTime',
	CLEAR_TOKEN: 'authentication/clearToken',
	SET_LOADING: 'authentication/setLoading',
	SIGNUP_RESEND: 'authentication/signupResend',
	SET_ROLE_INFO: 'authentication/setRoleInfo',
	UPDATE_AVATAR: 'authentication/setUserAvatar'
}

export function setIsLogin(status) {
	return {
		type: AUTHENTICATION_TYPES.SET_IS_LOGIN,
		payload: status
	}
}

export function setRoleInfo(payload) {
	return {
		type: AUTHENTICATION_TYPES.SET_ROLE_INFO,
		payload
	}
}

export function setRemainTime() {
	return {
		type: AUTHENTICATION_TYPES.SET_REMAIN_TIME
	}
}

export function resetReaminTime() {
	return {
		type: AUTHENTICATION_TYPES.RESET_REMAIN_TIME
	}
}
export function setUserAvatar(payload){
	return {
		type: AUTHENTICATION_TYPES.UPDATE_AVATAR,
		payload,
	}
}
export function login(params) {
	return {
		type: AUTHENTICATION_TYPES.LOGIN,
		payload: params
	}
}

export function signup(params) {
	return {
		type: AUTHENTICATION_TYPES.SIGNUP,
		payload: params
	}
}

export function signupResend(params) {
	return {
		type: AUTHENTICATION_TYPES.SIGNUP_RESEND,
		payload: params
	}
}

export function signupConfirmation(params) {
	return {
		type: AUTHENTICATION_TYPES.SIGNUP_CONFIRM,
		payload: params
	}
}

export const setUserLogin = (payload) => {
	return {
		type: AUTHENTICATION_TYPES.SET_USER_LOGIN,
		payload
	}
}

export const setInfoSignup = (payload) => {
	return {
		type: AUTHENTICATION_TYPES.SET_INFO_SIGNUP,
		payload
	}
}

export const changePassword = (payload) => {
	return {
		type: AUTHENTICATION_TYPES.CHANGE_PASSWORD,
		payload
	}
}

export const signout = () => {
	return {
		type: AUTHENTICATION_TYPES.SIGNOUT,
	}
}

export const forgotPassword = (payload) => {
	return {
		type: AUTHENTICATION_TYPES.FORGOT_PASSWORD,
		payload
	}
}

export const forgotPasswordConfirmation = (payload) => {
	return {
		type: AUTHENTICATION_TYPES.FORGOT_PASSWORD_CONFIRMATION,
		payload
	}
}

export const setIdForgotPass = (payload) => {
	return {
		type: AUTHENTICATION_TYPES.SET_ID_FORGOTPASSWORD,
		payload
	}
}

export const setRemainedTimeSendOTP = (payload) => {
	return {
		type: AUTHENTICATION_TYPES.REMAINED_TIME_SEND_OTP,
		payload
	}
}
export const clearToken = () => {
	return {
		type: AUTHENTICATION_TYPES.CLEAR_TOKEN
	}
}
export const setLoading = (payload) => {
	return {
		type: AUTHENTICATION_TYPES.SET_LOADING,
		payload
	}
}