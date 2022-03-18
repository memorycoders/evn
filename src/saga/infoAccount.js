import { forEach } from 'lodash';
import { all, call, fork, put, takeLatest } from 'redux-saga/effects';
import http from '../apis/http';
import { NotificationError, NotificationSuccess } from '../common/components/Notification';
import { USER_TYPE, setUserData, setEditUser, getNotification_Success, readNotification_Success, getNotification, setUpdateAvatar } from '../store/infoAccount/action';
import { AUTHENTICATION_TYPE, setUserAvatar } from '../store/authentication/action';
import { history } from '../utils/history';
// import { EVN_TOKEN } from '../../utils/constants';
import { EVN_TOKEN } from '../utils/constants';
function* getUserInfo() {
    try {
        const rs = yield call(() =>
            http.get('web/users/information')
        )
        if (rs.status === 200) {
            yield put(setUserData(rs.data.data));
        } else {
            if (rs.data.message) {
                NotificationError('', rs.data.message)
            }
        }
    } catch (error) {
        if (error.message) {
            NotificationError('', error.message)
        }
    }
}

function* updateUserInfo(action) {
    try {
        const rs = yield call(() =>
            http.put('web/customers/information', action.payload)
        )
        console.log("updateUserInfo -> rs", rs)
        if (rs.data.code === 200) {
            NotificationSuccess("", "Cập nhật thành công")
            yield put(setEditUser(false))
            yield put(setUserData(rs.data.data))
            if (action.payload.avatar) {
                yield put(setUpdateAvatar(action.payload?.avatar))
            }
            if (localStorage.getItem(EVN_TOKEN) === null) {
                const saveToStorage = JSON.parse(sessionStorage.getItem(EVN_TOKEN));
                saveToStorage.personal_information = rs.data.data;
                saveToStorage.user.avatar = action.payload?.avatar;
                yield put(setUserAvatar(saveToStorage.user))
                sessionStorage.setItem(EVN_TOKEN, JSON.stringify(saveToStorage));
            } else {
                const saveToStorage = JSON.parse(localStorage.getItem(EVN_TOKEN));
                saveToStorage.personal_information = rs.data.data;
                saveToStorage.user.avatar = action.payload?.avatar;
                yield put(setUserAvatar(saveToStorage.user))
                localStorage.setItem(EVN_TOKEN, JSON.stringify(saveToStorage));
            }

        } else {
            NotificationError("", rs.data.message)
        }
    } catch (error) {
        console.log('error => ', error)
        NotificationError("", error.message)
    }
}

function* getNoti(payload) {
    const { id } = payload;
    try {
        const rs = yield call(() =>
            http.get(`web/notifications?user_id=${id}`)
        )
        if (rs.status === 200) {
            // console.log("rsNoti",rs?.data?.data?.content);
            yield put(getNotification_Success(rs?.data?.data?.content))
        } else {
            if (rs.data.message) {
                NotificationError('', rs.data.message)
            }
        }
    } catch (error) {
        if (error.message) {
            NotificationError('', error.message)
        }
    }

}


function* readNoti({ payload }) {
    console.log("payload", payload);
    const { id, data } = payload

    try {
        const rs = yield call(() =>
            http.post(`web/notifications/${id}`, data)
        )
        if (rs.status === 200) {
            yield put(readNotification_Success(rs?.data?.data))
            yield put(getNotification(rs?.data?.data?.user_id))
        } else {
            if (rs.data.message) {
                NotificationError('', rs.data.message)
            }
        }
    } catch (error) {
        if (error.message) {
            NotificationError('', error.message)
        }
    }
}


function* actionWatcher() {
    yield takeLatest(USER_TYPE.GET_USER_INFO, getUserInfo)
    yield takeLatest(USER_TYPE.UPDATE_USER_INFO, updateUserInfo)
    yield takeLatest(USER_TYPE.GET_NOTIFICATION, getNoti)
    yield takeLatest(USER_TYPE.READ_NOTIFICATION, readNoti)
}

export default function* infoAccountSaga() {
    yield all([fork(actionWatcher)]);
}