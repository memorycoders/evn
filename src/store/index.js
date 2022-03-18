import { combineReducers } from "redux";
import {authenticationReducer} from './authentication/reducers.js'
import { commonReducer } from "./common/reducers.js";
import { loanReducer } from "./loans/reducers.js";
import { userReducer } from './infoAccount/reducers.js';

const rootReducer = combineReducers({
  authentication: authenticationReducer,
  common: commonReducer,
  loan: loanReducer,
  user: userReducer,
});

export default rootReducer;