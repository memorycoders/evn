export const COMMON_TYPES = {
	SHOW_SIDEBAR: 'common/showSidebar',
	GET_PROVINCERS: 'common/getProvincers',
	SET_PROVINCERS: 'common/setProvincers',
	GET_DISTRICTS: 'common/getDistricts',
	SET_DISTRICTS: 'common/setDistricts',
	GET_COMMUNE: 'common/getCommune',
	SET_COMMUNE: 'common/setCommune',
	GET_STATIC_DATA: 'common/getStaticData',
	SET_STATIC_DATA: 'common/setStaticData',
	INIT_DATA: 'common/initData',
	GET_AGENTS: 'common/getAgents',
	SET_AGENTS: 'common/setAgents',
	ASSIGN_ORDER: 'common/assignOrder',
	GET_LOAN_LOS: 'common/getLoanLos',
	SET_LOAN_DATA: 'common/setLoansData',
}

export function showSidebar(status) {
	return {
		type: COMMON_TYPES.SHOW_SIDEBAR,
		payload: status
	}
}

export function getProvincers() {
	return {
		type: COMMON_TYPES.GET_PROVINCERS
	}
}

export function setProvincers(s) {
	return {
		type: COMMON_TYPES.SET_PROVINCERS,
		payload: s
	}
}

export function getDistricts(id) {
	return {
		type: COMMON_TYPES.GET_DISTRICTS,
		payload: id
	}
}

export function setDistricts(s) {
	return {
		type: COMMON_TYPES.SET_DISTRICTS,
		payload: s
	}
}

export function getCommune(id) {
	return {
		type: COMMON_TYPES.GET_COMMUNE,
		payload: id
	}
}

export function setCommune(s) {
	return {
		type: COMMON_TYPES.SET_COMMUNE,
		payload: s
	}
}

export function getStaticData() {
	return {
		type: COMMON_TYPES.GET_STATIC_DATA,
	}
}

export function setStaticData(s) {
	return {
		type: COMMON_TYPES.SET_STATIC_DATA,
		payload: s
	}
}
 
export function initData() {
	return {
		type: COMMON_TYPES.INIT_DATA
	}
}

export function getAgents() {
	return {
		type: COMMON_TYPES.GET_AGENTS
	}
}

export function setAgents(data) {
	return {
		type: COMMON_TYPES.SET_AGENTS,
		payload: data
	}
}

export function assignOrder(data) {
	return {
		type: COMMON_TYPES.ASSIGN_ORDER,
		data
	}
}
export function getLoanLos(payload) {
	return {
		type: COMMON_TYPES.GET_LOAN_LOS,
		payload
	}
}
export const setLoansData = (payload) => {
	return {
		type: COMMON_TYPES.SET_LOAN_DATA,
		payload
	}
}