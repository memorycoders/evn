import { forEach } from 'lodash';
import { all, call, fork, put, takeLatest } from 'redux-saga/effects';
import http from '../apis/http';
import { NotificationError, NotificationSuccess } from '../common/components/Notification';
import { LOAN_TYPE, setLoanDetail, setLoansData, setLoanWaitingStatus, setRepaymentPlan, isEditLoan, viewDetail } from '../store/loans/action';
import { LOAN_STATUS, STATUS_CODE } from '../utils/constants';
import { history } from '../utils/history';
import FileSaver from 'file-saver';
import { EVN_TOKEN } from '../utils/constants';
import { getNotification } from '../store/infoAccount/action';
function* register(action) {

	console.log("actionRegister", action);

	try {
		const rs = yield call(() =>
			http.post('web/loan-los', action.payload)
		)
		if (rs.status === 200) {
			NotificationSuccess("Thành công", 'Đăng ký thành công');
			if (rs.data && rs.data.data) {
				console.log('1', rs)
				// history.push(`/loan-list?id=${rs?.data?.data?.loan_code}`)
				history.push(`/loan-list`)
			}
			yield put(isEditLoan(false));
			localStorage.setItem("isDuplicateAddress", false);
			localStorage.setItem("isDuplicateAddressContact", false);
			localStorage.setItem("isCompanyEVN", false);

			const token =
				localStorage.getItem(EVN_TOKEN) || sessionStorage.getItem(EVN_TOKEN);
			yield put(getNotification(JSON.parse(token)?.user?.id))

		} else {
			if (rs.data.message) {
				NotificationError('Lỗi', rs.data.message)
			}
		}
	} catch (error) {
		if (error.message) {
			NotificationError('Lỗi', error.message)
		}
	}
}

function* updateRegister(payload) {
	try {
		const rs = yield call(() =>
			http.put(`web/loan-los/${payload.data.id}`, payload.data.data)
		)
		if (rs.status === 200) {
			NotificationSuccess("Thành công", 'Cập nhật khoản vay thành công');
			if (rs.data && rs.data.data) {
				// history.push(`/loan-list?id=${rs.data.data.id}`)
				history.push(`/loan-list`)
			}
			yield put(isEditLoan(false));
			localStorage.setItem("isDuplicateAddress", false);
			localStorage.setItem("isDuplicateAddressContact", false);
			localStorage.setItem("isCompanyEVN", false);
		} else {
			if (rs.data.message) {
				NotificationError('Lỗi', rs.data.message)
			}
		}
	} catch (error) {
		if (error.message) {
			NotificationError('Lỗi', error.message)
		}
	}
}

export function* getLoans({ payload }) {

	// console.log("payload",payload);
	try {
		let url = ''
		if (payload?.user === 'Khách hàng vay tiêu dùng') {
			url = `web/loan-los/loan-of-customer?tab=FOLLOW_CONSUMER&pageIndex=${payload?.pageIndex ? payload?.pageIndex : 0}&pageSize=5&loanType=2`
		} else {
			url = `web/loan-los/loan-of-customer?tab=APPROVAL&pageIndex=${payload?.pageIndex ? payload?.pageIndex : 0}&pageSize=5`
		}
		if (payload.id) {
			if (payload.status) {
				yield put(isEditLoan(false))
				yield put(viewDetail(true))
			} else {
				yield put(isEditLoan(true))
				yield put(viewDetail(false))
			}
			// url += `/${payload.id}`;
			// url = `web/loan-los/${payload.id}` // GET DETAILS
		} else {
			if (payload.status === 2) {
				yield put(viewDetail(false))
			}
		}
		const rs = yield call(() =>
			http.get(url)
		)
		if (rs.status === 200) {
			let data = rs.data.data;
			if (payload.id) {
				data = {
					content: [rs.data.data]
				}
				yield put(setLoanDetail(data))
				// history.push('/loan/register')
			} else {
				yield put(setLoansData(data));
			}
			return yield call(checkLoans, data);
		}
	} catch (error) {

	}
}

function* checkLoans(loans) {
	// console.log("loans",loans);
	let hasWaitingStatus = false;
	if (loans && loans.content) {
		forEach(loans.content, (item) => {
			if (item.status) {
				hasWaitingStatus = true;
				return false;
			}
		})
	}

	yield put(setLoanWaitingStatus(hasWaitingStatus))
	return hasWaitingStatus;
}

function* getRepaymentPlan({ data }) {
	try {
		const rs = yield call(() =>
			http.get('web/loans/repayment-plan', { params: data })
		)

		if (rs.status === STATUS_CODE.SUCCESS) {
			yield put(setRepaymentPlan(rs.data.data))
		}

	} catch (ex) { }
}

function* delLoan(payload) {
	try {
		const res = yield call(() =>
			http.delete(`web/loans/${payload.id}`)
		)
		if (res.status === STATUS_CODE.SUCCESS) {
			NotificationSuccess('', "Xóa khoản vay thành công!");
			yield call(getLoans, { id: null, status: 2 });
			yield put(viewDetail(false))
		} else {
			NotificationError("", "Có sự cố xảy ra, vui lòng thử lại sau!")
		}
	} catch (ex) { }
}

function* downloadFileSg({ payload }) {
	console.log('payload => ', payload)
	try {
		const res = yield call(() =>
			http.get(`web/loans/ftps/download?file_uuid=${payload}&app_id=1`)
		)
		if (res.status === STATUS_CODE.SUCCESS) {
			window.open(res?.data?.data?.download_link, '_blank');
			// const myBlob = new Blob([res], {
			// 	encoding: "UTF-8",
			// 	type: payload.type,
			// })
			// FileSaver.saveAs(myBlob, payload.name)
		}
	} catch (ex) { }
}




function* signCloudFirstTime({ id }) {
	try {
		const res = yield call(() => http.get(`web/agreements/sign-cloud-first-time?loan_id=${id}`))
		if (res.status === STATUS_CODE.SUCCESS) {
		} else {
			NotificationError("", "Có sự cố xảy ra, vui lòng thử lại sau!")
		}
	} catch (ex) { }
}

function* actionWatcher() {
	yield takeLatest(LOAN_TYPE.REGISTER, register)
	yield takeLatest(LOAN_TYPE.GET_LOANS, getLoans)
	yield takeLatest(LOAN_TYPE.GET_REPAYMENT_PLAN, getRepaymentPlan)
	yield takeLatest(LOAN_TYPE.UPDATE_REGISTER, updateRegister)
	yield takeLatest(LOAN_TYPE.DEL_LOAN, delLoan)
	yield takeLatest(LOAN_TYPE.DOWNLOAD_FILE, downloadFileSg)
	yield takeLatest(LOAN_TYPE.SIGN_CLOUD_FIRST_TIME, signCloudFirstTime)
}

export default function* loanSaga() {
	yield all([fork(actionWatcher)]);
}