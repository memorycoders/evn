import { USER_TYPE } from "./action";
import { EVN_TOKEN } from '../../utils/constants'

function findIndexNoti(noti, data){
    var index = -1;
    if (noti.length > 0) {
        for (let i = 0; i <noti.length; i++) {
            if (noti[i].id === data.id) {
                index = i;
                break;
            }
        }
	}
    return index;
}
export function userReducer(
	state = {
        // userData: {},
		userData: JSON.parse(sessionStorage.getItem(EVN_TOKEN))?.personal_information || JSON.parse(localStorage.getItem(EVN_TOKEN))?.personal_information,
		editable: false,
		noti:[],
    ava: JSON.parse(sessionStorage.getItem(EVN_TOKEN))?.user?.avatar || JSON.parse(localStorage.getItem(EVN_TOKEN))?.user?.avatar,
	},
	action
) {
	switch(action.type) {
		case USER_TYPE.SET_USER_DATA: {
			return {
				...state,
				userData: action.payload
			}
    }
    case USER_TYPE.SET_EDIT_USER: {
      return {
        ...state,
        editable: action.payload
      }
	  }
    case USER_TYPE.SET_UPDATE_AVATAR: {
      return{
        ...state,
        ava: action.payload
      }
    }
	
	// ---------- //
    case USER_TYPE.GET_NOTIFICATION: {
      return {
        ...state,
      }
    }
    case USER_TYPE.GET_NOTIFICATION_SUCCESS: {
      return {
		...state,
		noti:[...action.payload]
      }
    }
    case USER_TYPE.READ_NOTIFICATION: {
      return {
		...state,
      }
    }
    case USER_TYPE.READ_NOTIFICATION_SUCCESS: {
		// console.log("action",action.payload);
		// console.log("noti",state.noti);
		let index = findIndexNoti(state.noti, action.payload)
		if(index !== -1){
			state.noti[index].is_read = true
		}
		return {
			...state,
		}
		
    }
	
		default:
			return state;
	}
}