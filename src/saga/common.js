import { all, call, fork, put, takeLatest } from 'redux-saga/effects';
import http from '../apis/http';
import { COMMON_TYPES, setAgents, setCommune, setDistricts, setProvincers, setStaticData, setLoansData } from '../store/common/action';
import { getLoans } from './loan';

function* getProvincers(action) {
	try {
		const rs = yield call(() => 
		    http.get('web/provinces')
		)
        if(rs.status === 200) {
            yield put(setProvincers(rs.data.data.content))
        }
	} catch (error) {
	}
} 

function* getDistricts(action) {
	try {
		const rs = yield call(() => 
		    http.get(`web/districts?province_id=${action.payload}`)
		)
        if(rs.status === 200) {
            yield put(setDistricts(rs.data.data.content))
        }
	} catch (error) {
	}
}

function* getCommune(action) {
	try {
		const rs = yield call(() => 
		    http.get(`web/communes?district_id=${action.payload}`)
		)
        if(rs.status === 200) {
            yield put(setCommune(rs.data.data.content))
        }
	} catch (error) {
	}
}
function* getStaticData() {
	try {
		const rs = yield call(() => 
		    http.get(`web/general/static-data`)
		)

        if(rs.status === 200) {
            yield put(setStaticData(rs.data.data))
        }
	} catch (error) {
	}
}

function* getAgents() {
	try {
		const rs = yield call(() => 
			http.get(`web/providers/agents`)
		)
		if(rs.status === 200) {
			yield put(setAgents(rs.data.data))
		}
	}catch(ex){}
}

function* assignOrder({data}) {
	try {
		yield call(() => 
		http.post(`web/providers/assign-order`, data)
	)
	}catch(ex){}
}


function* initData() {
	yield call(getLoans, {id: null, status: false});
}
function* getLoanLos() {
	try {
		const rs = yield call(() => 
			http.get(`web/loan-los`)
		)
		if(rs.status === 200) {
			let data = rs.data.data;
			console.log('loan', data)
			yield put(setLoansData(data));
			// yield put(setAgents(rs.data.data))
		}
	}catch(ex){}
}

function* actionWatcher() {
	yield takeLatest(COMMON_TYPES.INIT_DATA, initData)
	yield takeLatest(COMMON_TYPES.GET_PROVINCERS, getProvincers)
	yield takeLatest(COMMON_TYPES.GET_DISTRICTS, getDistricts)
	yield takeLatest(COMMON_TYPES.GET_COMMUNE, getCommune)
	yield takeLatest(COMMON_TYPES.GET_STATIC_DATA, getStaticData)
	yield takeLatest(COMMON_TYPES.GET_AGENTS, getAgents)
	yield takeLatest(COMMON_TYPES.ASSIGN_ORDER, assignOrder)
	yield takeLatest(COMMON_TYPES.GET_LOAN_LOS, getLoanLos)
}

export default function* commonSaga() {
	yield all([fork(actionWatcher)]);
}