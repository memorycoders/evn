import React, { useEffect } from 'react';
import { Switch, Route, Redirect, useRouteMatch, useLocation } from 'react-router-dom';

import Login from  './pages/Authentication/containers/LoginContainer';
import Signup from  './pages/Authentication/containers/RegisterContainer';
import AccountActivated from  './pages/Authentication/containers/AccountActivated';
import SignupSuccess from  './pages/Authentication/containers/RegisterSuccess';
import HomeContainer from './pages/Home/HomeContainer';
import OTPConfirmation from  './pages/Authentication/containers/OTPConfirmation';
import ForgotPassword from  './pages/Authentication/containers/ForgotPassword';
import ChangePassword from  './pages/InfoAccount/changePassword';
import LoanContainer from './pages/Loan';
import LoanList from './pages/LoanList';
import ResetPassword from './pages/Authentication/containers/ResetPassword';
import InfoAccountContainer from './pages/InfoAccount/InfoAccountContainer';
import Notification from './pages/InfoAccount/notification';
import Survey from './pages/Survey/container/index'
import Operate from './pages/Operate';
import ContractView from './pages/LoanList/containers/ContractView';
import IndentureView from './pages/LoanList/containers/IndentureView';
import OTPConfirm from './pages/LoanList/containers/OTPConfirm';
import SuccessSign from './pages/LoanList/containers/SuccessSign';
import Operate_Sell from './pages/Operate_Sell/maintain';
import incident from './pages/Operate_Sell/incident';
import Sign from './pages/LoanList/containers/Sign';
import Agency from './pages/Agency/container';
import OTPConfirm_second from './pages/LoanList/containers/OTPConfirm_second';
import ListEmployee from './pages/Agency/components/ListEmployee';
import Quotation from './pages/Quotation';
import AccountLoan from './pages/Account/AccountLoan'
import AccountBank from './pages/Account/AccountBank';
import UserManager from './pages/Admin/UserManager';
import AddAccount from './pages/Admin/AddAccount';
import AdminRole from './pages/Admin/Role';
import Faq from './pages/Support/Faq';
import MoneyTransferInstrusction from './pages/Support/MoneyTransferInstrusction';
import UserManual from './pages/Support/UserManual';
import ProductManager from './pages/ProductList';
import ProviderList from './pages/ProviderList';
import AdminAgency from "./pages/Admin/Agency/container/index"
import Email from './pages/Admin/Template/Email';
import Sms from './pages/Admin/Template/Sms';
import Template from './pages/Admin/Template/Template';
import TemplateNotification from './pages/Admin/Template/TemplateNotification';
import OrderList from './pages/OrderList';


const PAGES_HIDE_SIDEBAR = ['/login', '/signup', '/otp-confirmation', '/forgot-password', '/reset-password', '/signup-success', '/account-activated']
const Routes = (props) => {
    let location = useLocation();
    const { showSidebar } = props;
    useEffect(() => {
        let isShowSidebar = true;
        if(location.pathname && PAGES_HIDE_SIDEBAR.indexOf(location.pathname) > -1) {
            isShowSidebar = false;
        }
        showSidebar(isShowSidebar)
    }, [location])
    return (
        <div>
        <Switch>
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route path="/signup-success" component={SignupSuccess} />
            <Route path="/account-activated" component={AccountActivated} />
            <Route path="/home" component={HomeContainer}/>
            <Route path="/otp-confirmation" component={OTPConfirmation} />
            <Route path="/forgot-password" component={ForgotPassword} />
            <Route path="/loan" component={LoanContainer}/>
            <Route path="/loan-list" component={LoanList}/>
            <Route path="/change-password" component={ChangePassword} />
            <Route path="/info-account" component={InfoAccountContainer} />
            <Route path="/reset-password" component={ResetPassword} />
            <Route path="/notification" component={Notification} />
            <Route path="/operate" component={Operate} />
            <Route path="/survey" component={Survey} />
            <Route path="/contract-sign" component={ContractView} />
            <Route path="/indenture-sign" component={IndentureView} />
            <Route path="/incident-request" component={incident} />
            <Route path="/otp-contract-confirm" component={OTPConfirm} />
            <Route path="/success" component={SuccessSign} />
            <Route path="/success" component={SuccessSign} />
            <Route path="/otp-contract-confirm-second" component={OTPConfirm_second} />
            <Route path="/system-and-sell" component={Operate_Sell} />
            <Route path="/sign" component={Sign} />
            <Route path="/agency" component={Agency}/>
            <Route path="/employee" component={ListEmployee} />
            <Route path="/quotation" component={Quotation}/>
            <Route path="/account/rent" component={AccountLoan}/>
            <Route path="/account/deposit" component={AccountBank}/>
            <Route path="/admin/user-manager" component={UserManager} />
            <Route path="/admin/add-account" component={AddAccount} />
            <Route path='/admin/role' component={AdminRole}/>
            <Route path="/user-manual" component={UserManual} />
            <Route path="/faq" component={Faq} />
            <Route path="/money-transfer-instrusction" component={MoneyTransferInstrusction} /> 
            <Route path="/product" component={ ProductManager} /> 
            <Route path="/provider" component={ProviderList} /> 
            <Route path="/admin-agency" component={AdminAgency} /> 
            <Route path="/email" component={Email} /> 
            <Route path="/sms" component={Sms} /> 
            <Route path="/notification-template" component={TemplateNotification} /> 
            <Route path="/template" component={Template} /> 
            <Route path="/order-list" component={OrderList} /> 
            <Redirect exact from="/*" to={'/signup'} />
        </Switch>
        </div>
    );
};

export default Routes;