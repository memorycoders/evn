import { all, call, fork, put, takeLatest } from 'redux-saga/effects';
import http from '../apis/http';
import {
	AUTHENTICATION_TYPES, setIsLogin, setUserLogin, setInfoSignup,
	setIdForgotPass, setRemainedTimeSendOTP, setRemainTime, resetReaminTime,
	setLoading, setInfoResetPass, setRoleInfo
} from '../store/authentication/action';
import { NotificationError, NotificationSuccess } from '../common/components/Notification';
import { history } from '../utils/history'
import { EVN_TOKEN, ROLE_USER } from '../utils/constants';
import { getLoans } from './loan';
import { setUserData, getNotification, setUpdateAvatar } from '../store/infoAccount/action';
import { clearLoanWaitingStatus, viewDetail } from '../store/loans/action';

function* sglogin(action) {
	try {
		const rs = yield call(() =>
			http.post('auth/login', action.payload)
		)
		if (rs.data.code === 200) {
			const token =
				localStorage.getItem(EVN_TOKEN) || sessionStorage.getItem(EVN_TOKEN);
			NotificationSuccess("Thành công", rs.data.message);
			yield put(setIsLogin(true))
			console.log("rsUser", rs?.data?.data);
			yield put(setUserLogin(rs?.data?.data));
			yield put(getNotification(rs?.data?.data?.user?.id))
			yield put(setUpdateAvatar(rs?.data?.data?.user?.avatar))
			const loginPayload = {
				token: rs.data.data.token,
				customer: rs.data.data.customer,
				user: rs.data.data.user,
				// Thêm 
				agent_id: rs.data.data.agent_id,
				personal_information: rs.data.data.personal_information
			};
			yield put(setUserData(rs.data.data.personal_information))
			let user = rs.data.data.user.username
			if (action.payload.isRememberme) {
				localStorage.setItem(EVN_TOKEN, JSON.stringify(loginPayload || {}));
			} else {
				sessionStorage.setItem(EVN_TOKEN, JSON.stringify(loginPayload || {}));
			}
			let hasWaitingStatus = yield call(getLoans, { id: null });
			const permission = yield call(() =>
				http.get(`web/users/${rs?.data?.data?.user?.id}/permission`)
			)
			// console.log(" permission", permission);

			let first_role = permission?.data?.data[4]?.permission?.permissionName;
			if (first_role) {
				switch (first_role) {
					case 'Admin - Thêm mới tài khoản khách hàng':
						history.push('/admin/add-account')
						break;
					case 'Admin - Thêm mới người dùng':
						history.push('/admin/user-manager')
						break;
					case 'Admin - Danh sách người dùng':
						history.push('/admin/user-manager');
						break;
					case 'Admin - Phân quyền':
						history.push('/admin/role');
						break;
					case 'Admin - Quản lý sản phẩm đối tác':
						history.push('/product');
						break;
					case 'Admin - Quản lý nhà cung cấp':
						history.push('/provider');
						break;
					case 'Admin - Edit/Reset password':
						history.push('/admin/user-manager');
						break;
					case 'Admin - Quản lý template/email/sms':
						history.push('/email');
						break;
					case 'Customer - Theo dõi quá trình xét duyệt':
						history.push('/loan-list');
						break;
					case 'Customer - Đăng ký vay tiêu dùng':
						history.push('/loan-list');
						break;
					case 'Customer - Đăng ký vay điện mặt trời':
						if (hasWaitingStatus) {
							history.push('/loan-list')
						} else if (!hasWaitingStatus) {
							history.push('/loan/register')
						}
						break;
					case 'Customer - Vận hành':
						history.push('/system-and-sell');
						break;
					case 'Customer - Ký hợp đồng':
						history.push('/loan-list');
						break;
					case 'CustomerSearch - Tài khoản tiền gửi':
						history.push('/account/deposit');
						break;
					case 'CustomerSearch - Danh sách tài khoản':
						history.push('/admin/user-manager');
						break;
					case 'CustomerSearch - Tài khoản vay':
						history.push('/account/rent');
						break;
					case 'Provider - Lắp đặt - Đặt lịch + Cập nhật kết quả lắp đặt':
						history.push('/survey');
						break;
					case 'Provider - Hợp đồng':
						history.push('/survey');
						break;
					case 'Provider - Khảo sát - Tiếp nhận chuyển đại lý':
						history.push('/survey');
						break;
					case 'Provider - Khảo sát - Chuyển nhân viên khảo sát':
						history.push('/survey');
						break;
					case 'Provider - Khảo sát - Đặt lịch Cập nhật kết quả khảo sát':
						history.push('/survey');
						break;
					case 'Provider - Quản lý đại lý':
						history.push('/agency');
						break;
					case 'Provider - Vận hành - Bảo dưỡng':
						history.push('/operate');
						break;
					case 'Provider - Báo giá & hậu mãi':
						history.push('/quotation');
						break;
					case 'Provider - Thông tin nhân sự - quản lý nhận sự':
						history.push('/agency');
						break;
					case 'Support - Hướng dẫn sử dụng':
						history.push('/user-manual');
						break;
					case 'Provider - Xử lý sự cố':
						history.push('/operate');
						break;
					case 'Evnfc - Quản lý trạng thái đơn hàng':
						history.push('/order-list');
						break;
					case '':
						NotificationError("", 'Tài khoản không có quyền thao tác');
						break;
				}
			} else if (user === '0976627796') {
				history.push('/admin/role');
			} else NotificationError("", 'Tài khoản của bạn không có quyền thao tác.');
			localStorage.setItem(ROLE_USER, JSON.stringify(permission?.data?.data))
			yield put(setRoleInfo(permission?.data?.data));
		} else {
			NotificationError("", rs.data.message)
		}
	} catch (error) {
		console.log('err ', error)
		NotificationError("", error.message)
		yield put(setIsLogin(false))
	}
}



function* sgSignup(action) {
	console.log("action", action);

	try {
		yield put(setLoading(true));
		const rs = yield call(() =>
			http.post('auth/signupV2', action.payload)
		)
		console.log("sign up -> rs", rs)
		if (rs.data.code === 200) {
			yield put(setLoading(false));
			yield put(setInfoSignup({
				infoSignup: action.payload,
			}));
			NotificationSuccess("Thành công", "Đăng ký thành công")
			history.push('/login');
		} else {
			yield put(setLoading(false));
			NotificationError("", rs.data.message)
		}
	} catch (error) {
		yield put(setLoading(false));
		console.log('error => ', error)
	}
}

function* sgSignupResend(action) {
	try {
		yield put(setLoading(true));
		const rs = yield call(() =>
			http.post('auth/signupV2/resend', action.payload)
		)
		console.log("sign up -> rs", rs)
		if (rs.data.code === 200) {
			yield put(setLoading(false));
			NotificationSuccess("Thành công", "Gửi lại thành công")
		} else {
			yield put(setLoading(false));
			NotificationError("", rs.data.message)
		}
	} catch (error) {
		yield put(setLoading(false));
		console.log('error => ', error)
	}
}

function* sgSignupConfirmation(action) {
	try {
		const rs = yield call(() =>
			http.post('auth/signup/verify', action.payload)
		)
		console.log("sign up -> rs", rs)
		if (rs.data.code === 200) {
			NotificationSuccess("Thành công", rs.data.message);
			yield put(resetReaminTime())
			history.push('/login');
		} else {
			if (rs.data.data.otp) {
				yield put(setRemainedTimeSendOTP(true))
				yield put(setRemainTime())
			} else {
				yield put(setRemainedTimeSendOTP(false))
			}
			NotificationError("", rs.data.message)
		}
	} catch (error) {
		console.log('error => ', error)
	}
}

function* sgChangePassword(action) {
	try {
		const res = yield call(() =>
			http.put('auth/password/change', action.payload)
		)
		if (res.data.code === 200) {
			NotificationSuccess("Thành công", res.data.message);
			yield call(sgSignout);
		} else {
			NotificationError("", res.data.message)
		}
	} catch (error) {

	}
}

function* sgSignout() {
	try {
		const rs = yield call(() =>
			http.get('auth/log-out')
		)
		if (rs.data.code === 200) {
			yield put(setIsLogin(false));
			yield put(setUserLogin(rs.data.data));
			yield put(clearLoanWaitingStatus())
			yield put(viewDetail(false))
			localStorage.removeItem(EVN_TOKEN)
			sessionStorage.removeItem(EVN_TOKEN)
			localStorage.removeItem(ROLE_USER)
			history.push('/login');
		} else {
			NotificationError("", rs.data.message)
		}
	} catch (error) {
		console.log('error => ', error)
	}
}

function* sgForgotPassword(action) {
	try {
		yield put(setLoading(true));
		const rs = yield call(() =>
			http.put(`auth/password/reset?username=${action.payload}`)
		)
		console.log("sign out -> rs", rs)
		if (rs.data.code === 200) {
			yield put(setLoading(false));
			yield put(setIdForgotPass({
				idForgotPass: rs.data.data.otp.id,
				userName: action.payload
			}))
			history.push('/reset-password');
			NotificationSuccess("Thành công", "Gửi mã OTP thành công")
		} else {
			yield put(setLoading(false));
			NotificationError("", rs.data.message)
		}
	} catch (error) {
		yield put(setLoading(false));
		console.log('error => ', error)
	}
}

function* sgForgotPasswordConfirmation(action) {
	console.log('action => ', action)
	try {
		const rs = yield call(() =>
			http.put(`auth/password/reset/verify`, action.payload)
		)
		console.log("sgForgotPasswordConfirmation -> rs", rs)
		if (rs.data.code === 200) {
			NotificationSuccess("Thành công", rs.data.message);
			yield put(resetReaminTime())
			history.push('/login');
		} else {
			if (rs.data.data.otp) {
				yield put(setRemainedTimeSendOTP(true))
				yield put(setRemainTime())
			} else {
				yield put(setRemainedTimeSendOTP(false))
			}
			NotificationError("", rs.data.message)
		}
	} catch (error) {
		console.log('error => ', error)
	}
}

function* actionWatcher() {
	yield takeLatest(AUTHENTICATION_TYPES.LOGIN, sglogin)
	yield takeLatest(AUTHENTICATION_TYPES.SIGNUP, sgSignup)
	yield takeLatest(AUTHENTICATION_TYPES.CHANGE_PASSWORD, sgChangePassword)
	yield takeLatest(AUTHENTICATION_TYPES.SIGNUP_CONFIRM, sgSignupConfirmation)
	yield takeLatest(AUTHENTICATION_TYPES.SIGNOUT, sgSignout)
	yield takeLatest(AUTHENTICATION_TYPES.FORGOT_PASSWORD, sgForgotPassword)
	yield takeLatest(AUTHENTICATION_TYPES.FORGOT_PASSWORD_CONFIRMATION, sgForgotPasswordConfirmation)
	yield takeLatest(AUTHENTICATION_TYPES.SIGNUP_RESEND, sgSignupResend)
}

export default function* authenticationSaga() {
	yield all([fork(actionWatcher)]);
}