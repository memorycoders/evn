import { COMMON_TYPES } from "./action";

export function commonReducer(
	state = {
		isShowSidebar: true,
		provinces: [],
		districts: [],
		communes: [],
		staticData: null,
		agents: []
	},
	action
) {
	switch(action.type) {
		case COMMON_TYPES.SHOW_SIDEBAR: {
			return {
				...state,
				isShowSidebar: action.payload
			}
		}
		case COMMON_TYPES.SET_PROVINCERS: {
			return {
				...state,
				provinces: action.payload
			}
		}
		case COMMON_TYPES.SET_DISTRICTS: {
			return {
				...state,
				districts: [...state.districts, ...action.payload]
			}
		}
		case COMMON_TYPES.SET_COMMUNE: {
			return {
				...state,
				communes: [...state.communes, ...action.payload]
			}
		}
		case COMMON_TYPES.SET_STATIC_DATA: {
			return {
				...state,
				staticData: action.payload
			}
		}
		case COMMON_TYPES.SET_AGENTS: {
			return {
				...state,
				agents: action.payload
			}
		}
		default:
			return state;
	}
}