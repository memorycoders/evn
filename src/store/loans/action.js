export const LOAN_TYPE = {
	REGISTER: 'loan/register',
	UPDATE_REGISTER: 'loan/updateRegister',
	GET_LOANS: 'loan/getLoans',
	GET_LOANS_DETAIL: 'loan/getLoanDetail',
	SET_LOAN_DATA: 'loan/setLoansData',
	GET_REPAYMENT_PLAN: 'loan/getRepaymentPlan',
	SET_REPAYMENT_PLAN: 'loan/setRepaymentPlan',
	SET_LOAN_WAITING_STATUS: 'loan/setLoanWaitingStatus',
	EDIT_LOAN: 'loan/editLoan',
	IS_EDIT_LOAN: 'loan/isEditLoan',
	SET_LOAN_CODE: 'loan/setLoanCode',
	SET_AGREEMENT_ID: 'loan/setAgreementId',
	SET_PHONE: 'loan/setPhone',
	SET_PHONE_SECOND: 'loan/setPhoneSecondPerson',
	SET_LOAN_DETAIL: 'loan/loanDetail',
	DEL_LOAN: 'loan/delLoan',
	VIEW_DETAIL: 'loan/viewDetail',
	DOWNLOAD_FILE: 'loan/downloadFile',
	SIGN_CLOUD_FIRST_TIME: 'loan/signCloudFirstTime',
	SET_SIGN_TIME: 'loan/setSignTime',
	CLEAR_LOAN_WAITING_STATUS: "load/clearloanwaitingstatus",
}


export function clearLoanWaitingStatus(){
	return{
		type:LOAN_TYPE.CLEAR_LOAN_WAITING_STATUS
	}
}
export function register(data) {
	return {
		type: LOAN_TYPE.REGISTER,
		payload: data
	}
}
export function updateRegister(data) {
	return {
		type: LOAN_TYPE.UPDATE_REGISTER,
		data
	}
}
export function getLoans(payload) {
	return {
		type: LOAN_TYPE.GET_LOANS,
		payload
	}
}

export function getLoanDetail(payload) {
	return {
		type: LOAN_TYPE.GET_LOANS_DETAIL,
		payload
	}
}

export const setLoansData = (payload) => {
	return {
		type: LOAN_TYPE.SET_LOAN_DATA,
		payload
	}
}

export const getRepaymentPlan = (data) => {
	return {
		type: LOAN_TYPE.GET_REPAYMENT_PLAN,
		data
	}
}

export const setRepaymentPlan = (payload) => {
	return {
		type: LOAN_TYPE.SET_REPAYMENT_PLAN,
		payload
	}
}

export const setLoanWaitingStatus = (payload) => {
	return {
		type: LOAN_TYPE.SET_LOAN_WAITING_STATUS,
		payload
	}
}

export const setLoanDetail = (payload) => {
	return {
		type: LOAN_TYPE.SET_LOAN_DETAIL,
		payload
	}
}

export const editLoan = (id) => {
	return {
		type: LOAN_TYPE.EDIT_LOAN,
		id
	}
}

export const isEditLoan = (payload) => {
	return {
		type: LOAN_TYPE.IS_EDIT_LOAN,
		payload
	}
}

export const setLoanCode = (payload) => {
	return {
		type: LOAN_TYPE.SET_LOAN_CODE,
		payload
	}
}

export const setAgreementId = (payload) => {
	return {
		type: LOAN_TYPE.SET_AGREEMENT_ID,
		payload
	}
}

export const setSignTime = (payload) => {
	return {
		type: LOAN_TYPE.SET_SIGN_TIME,
		payload
	}
}

export const setPhone = (payload) => {
	return {
		type: LOAN_TYPE.SET_PHONE,
		payload
	}
}

export const setPhoneSecondPerson = (payload) => {
	return {
		type: LOAN_TYPE.SET_PHONE_SECOND,
		payload
	}
}

export const viewDetail = (payload) => {
	return {
		type: LOAN_TYPE.VIEW_DETAIL,
		payload
	}
}

export const delLoan = (id) => {
	return {
		type: LOAN_TYPE.DEL_LOAN,
		id
	}
}

export const downloadFile = (payload) => {
	return {
		type: LOAN_TYPE.DOWNLOAD_FILE,
		payload
	}
}

export const signCloudFirstTime = (id) => {
	return {
		type: LOAN_TYPE.SIGN_CLOUD_FIRST_TIME,
		id
	}
}
