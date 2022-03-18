import { LOAN_TYPE } from "./action";

export function loanReducer(
	state = {
		loansData: {},
		repaymentPlan: [],
		hasWaitingStatus: false,
		loanDetail: {},
		isEditLoan: false,
		viewDetail: false,
		loanCode: {},
		agreementId: '',
		phone: '',
		signTime: '',
		second_phone: '',
	},
	action
) {
	switch(action.type) {
		case LOAN_TYPE.SET_LOAN_DATA: {
			return {
				...state,
				loansData: action.payload
			}
		}
		case LOAN_TYPE.SET_REPAYMENT_PLAN: {
			return {
				...state,
				repaymentPlan: action.payload
			}
		}
		case LOAN_TYPE.SET_LOAN_WAITING_STATUS: {
			return {
				...state,
				hasWaitingStatus: action.payload
			}
		}
		case LOAN_TYPE.CLEAR_LOAN_WAITING_STATUS: {
			return {
				...state,
				hasWaitingStatus:false
			}
		}
		case LOAN_TYPE.SET_LOAN_DETAIL: {
			return {
				...state,
				loanDetail: action.payload
			}
		}
		case LOAN_TYPE.IS_EDIT_LOAN: {
			return {
				...state,
				isEditLoan: action.payload,
			}
		}
		case LOAN_TYPE.VIEW_DETAIL: {
			return {
				...state,
				viewDetail: action.payload
			}
		}
		case LOAN_TYPE.SET_LOAN_CODE: {
			return {
				...state,
				loanCode: action.payload
			}
		}
		case LOAN_TYPE.SET_AGREEMENT_ID: {
			return {
				...state,
				agreementId: action.payload
			}
		}
		case LOAN_TYPE.SET_PHONE: {
			return {
				...state,
				phone: action.payload
			}
		}
		case LOAN_TYPE.SET_PHONE_SECOND: {
			return {
				...state,
				second_phone: action.payload
			}
		}
		case LOAN_TYPE.SET_SIGN_TIME: {
			return {
				...state,
				signTime: action.payload
			}
		}
		default:
			return state;
	}
}