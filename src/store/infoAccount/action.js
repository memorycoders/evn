export const USER_TYPE = {
    GET_USER_INFO: 'user/getUserInfo',
    SET_USER_DATA: 'user/setUserData',
    UPDATE_USER_INFO: 'user/updateUserData',
    SET_EDIT_USER: 'user/sêtditUser',
    GET_NOTIFICATION: "user/getNotification",
    GET_NOTIFICATION_SUCCESS: "user/getNotification_Success",
    GET_NOTIFICATION_ERR: "user/getNotification_Err",
    READ_NOTIFICATION: "user/readNotification",
    READ_NOTIFICATION_SUCCESS: "user/readNotification_Success",
    SET_UPDATE_AVATAR: "user/setUpdateAvatar"
}


export function getNotification(id) {
    return {
        type: USER_TYPE.GET_NOTIFICATION,
        id
    }
}
export function setUpdateAvatar(payload){
    return{
        type: USER_TYPE.SET_UPDATE_AVATAR,
        payload
    }
}
export function getNotification_Success(data) {
    return {
        type: USER_TYPE.GET_NOTIFICATION_SUCCESS,
        payload: data
    }
}
export function getNotification_Err(err) {
    return {
        type: USER_TYPE.GET_NOTIFICATION_ERR,
        payload: err
    }
}

export function readNotification(id, data) {
    return {
        type: USER_TYPE.READ_NOTIFICATION,
        payload: {
            id: id,
            data: data
        }
    }
}
export function readNotification_Success(data) {
    return {
        type: USER_TYPE.READ_NOTIFICATION_SUCCESS,
        payload: data
    }
}

export function getUserInfo() {
    return {
        type: USER_TYPE.GET_USER_INFO,
    }
}
export function setUserData(payload) {
    return {
        type: USER_TYPE.SET_USER_DATA,
        payload,
    }
}
export function updateUserInfo(payload) {
    return {
        type: USER_TYPE.UPDATE_USER_INFO,
        payload
    }
}
export function setEditUser(payload) {
    return {
        type: USER_TYPE.SET_EDIT_USER,
        payload
    }
}
