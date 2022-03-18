import { all, fork } from 'redux-saga/effects';
import authenticationSaga  from './authentication.js';
import commonSaga from './common.js'
import loanSaga from './loan.js'
import infoAccountSaga from './infoAccount.js'
export default function* rootSaga() {
  yield all([
    fork(authenticationSaga),
    fork(commonSaga),
    fork(loanSaga),
    fork(infoAccountSaga),
  ])
}