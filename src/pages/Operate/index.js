import { Steps, Popover } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import '../../styles/operate.scss'
import { getLoans } from '../../store/loans/action';
import SurveySignature from '../Survey/components/SurveySignature';
import CalendarButton from '../../pages/Operate/Components/CalendarButton';
import InfoCustomer from '../Survey/components/InfoCustomer';
import http from "../../apis/http";
import { SCHEDULE_SURVER } from '../../utils/constants';

const customDot = (dot, { title }) => (
	<Popover placement="top"
		content={
			<span>
				{title}
			</span>
		}
	>
		{dot}
	</Popover>
);

function Operate(props) {
	let initDataCustomer = {
		"e_name" : "",
		"e_card_number" : "",
		"e_issue_address" : "",
		"e_issue_date" : "",
		"e_issue_month" : "",
		"e_issue_year" : "",
		"e_mobile" : "",
		"e_company" : "",
		"e_address" : "",
		"company_phone" : "",
		"collection_address" : "",
		"c_name" : "",
		"c_gender" : "",
		"c_birth_date" : "",
		"c_birth_month" : "",
		"c_birth_year" : "",
		"c_card_number" : "",
		"c_issue_address" : "",
		"c_issue_date" : "",
		"c_issue_month" : "",
		"c_issue_year" : "",
		"c_permanent_address" : "",
		"c_address" : "",
		"c_phone" : "",
		"c_email" : "",
		"c_literacy" : "",
		"c_marital_status" : "",
		"c_profile_provided" : "",
		"c_company" : "",
		"c_company_address" : "",
		"c_position" : "",
		"c_time_work" : "",
		"c_form_payment" : "",
		"c_contract_type" : "",
		"c_contract_time" : "",
		"c_family_name" : "",
		"c_family_gender" : "",
		"c_family_date" : "",
		"c_family_month" : "",
		"c_family_year" : "",
		"c_family_card" : "",
		"c_family_issue_address" : "",
		"c_family_issue_date" : "",
		"c_family_issue_month" : "",
		"c_family_issue_year" : "",
		"c_family_address" : "",
		"c_family_phone" : "",
		"c_family_email" : "",
		"c_ref_first_name" : "",
		"c_ref_first_relative" : "",
		"c_ref_first_address" : "",
		"c_ref_first_phone" : "",
		"c_ref_first_work" : "",
		"c_ref_second_name" : "",
		"c_ref_second_relative" : "",
		"c_ref_second_address" : "",
		"c_ref_second_phone" : "",
		"c_ref_second_work" : "",
		"income_average" : "",
		"fixed_salary" : "",
		"income_difference" : "",
		"income_average_family" : "",
		"fixed_salary_family" : "",
		"income_difference_family" : "",
		"total_cost" : "",
		"cost_live" : "",
		"cost_loan" : "",
		"cost_deference" : "",
		"income_accumulated" : "",
		"solar_ownership" : "",
		"solar_address" : "",
		"form_power" : "",
		"c_power_code" : "",
		"power_agreement" : "",
		"sign_date" : "",
		"sign_month" : "",
		"sign_year" : "",
		"power_unit_sign_contract" : "",
		"power_consume_half_year" : "",
		"start_hour_consume" : "",
		"end_hour_consume" : "",
		"percent_consum" : "",
		"house_type" : "",
		"roof_panel_style" : "",
		"roof_area" : "",
		"roof_panel_type" : "",
		"roof_year_use" : "",
		"shade_density" : "",
		"range_pin_inverter" : "",
		"fire_safety" : true,
		"regional_security" : true,
		"installability" : true,
		"radiation_zone" : "",
		"radiation_ensity" : "",
		"investment_capacity" : "",
		"battery_type" : "",
		"investment_cost" : "",
		"inverter_type" : "",
		"power_sold_average" : "",
		"power_save_average" : "",
		"power_sales_average" : "",
		"sales_save_average" : "",
		"simulate_efficiency" : "",
		"declare_address" : "",
		"declare_date" : "",
		"declare_month" : "",
		"declare_year" : "",
		"employee_collect_sign" : "",
		"employee_collect_name" : "",
		"customer_sign" : "",
		"customer_name" : ""
	}
	const [step, updateStep] = useState('');
	const [isShowInfoCustomer, showInfoCustomer] = useState(false);
	const [data, setData] = useState([]);
	// const [data, setData] = useState([])
	const [currentStaff, setCurrentStaff] = useState("");
	const [infoCustomer, setInfoCustomer] = useState(initDataCustomer)
	const [currentLoanCode, setCurrentLoanCode] = useState("1")
	const [loanCalendar, setLoanCalendar] = useState([]);
	const [listAgentID, setListAgentID] = useState([]);
	const [totalItem, setTotalItem] = useState(0)
	const TABS = {
		SURVEY: 'SURVEY',
		CONTRACT: 'CONTRACT',
		SETUP: 'SETUP'
	}
	const [currentSchedule, setCurrentSchedule] = useState(SCHEDULE_SURVER.SURVER)
	
	useEffect(() => {
		// getLoanLosList();
		getLoanLosList(TABS.SETUP);
	}, [])

	const getListByPage = async (tab, pageIndex) => {
		let page='';
		if(tab === 'SETUP') {page = 'MAINTAIN'}
		else if(tab === 'CONTRACT') {
			page = 'INCIDENT'
		}
		try {
			const rs = await http.get(`web/loan-los?tab=${tab === TABS.SURVEY ? 'SETUP' : "MAINTAIN"}&type=${page}&pageIndex=${pageIndex}&pageSize=5`);
			if(rs?.status === 200) {
				let _listAgentID = []
				rs?.data?.data?.content.forEach((item, index) => {
					if(item.agent?.id) {
						item.agent_id = item.agent?.id;
						_listAgentID.push({
							agent_id: item.agent?.id,
							index: index
						})
					}
					if(item.employee?.id) {
						item.employee_id = item.employee?.id
					}
				});
				setTotalItem(rs?.data?.data?.total_elements)
				setData(rs?.data?.data?.content) 
				setListAgentID(_listAgentID)

			} else {
				return NotificationError("", "Co?? l????i xa??y ra. Vui lo??ng th???? la??i");
			}
		}catch(ex){}
	}

	const getLoanLosList = async (tab) => {
		if(tab !== step) {
			setLoanCalendar([])
			updateStep(tab)
			switch(tab) {
				case TABS.SURVEY:
					setCurrentSchedule(SCHEDULE_SURVER.SURVER)
					break;
				case TABS.SETUP:
					setCurrentSchedule(SCHEDULE_SURVER.MAINTAIN)
					break;
				case TABS.CONTRACT:
					setCurrentSchedule(TABS.CONTRACT)
				break;
			}
			getListByPage(tab, 0)
		}
	}
	return (
		<div className="operate-wrapper">
			<span style={{ marginLeft: '5px' }} className='l-operate-title'>QUA??N LY?? H????P ??????NG</span>
			<div className="l-operate-container">
				<div className="step-by-step">
					<div onClick={ () => {getLoanLosList(TABS.SETUP)}} className={step === 'SETUP' ? "l-register active-step" : "l-register"}>
						<div className="l-register-inner">
							<div class='l-header-name'>Ba??o d??????ng</div>
							<CheckCircleOutlined />
						</div>
					</div>
					<div onClick={ () => {getLoanLosList(TABS.CONTRACT)}} className={step === 'CONTRACT' ? "l-approval active-step" : "l-approval"}>
						<div className="l-approval-inner">
							<div className="inner2">
								<div class='l-header-name'>X???? ly?? s???? c????</div>
							</div>
							<CheckCircleOutlined />
						</div>
					</div>
					<div onClick={ () => {getLoanLosList(TABS.SURVEY)
						}} className={step === 'SURVEY' ? "l-sign active-step" : "l-sign"}>
						<div className="l-sign-inner">
							<div class='l-header-name'>Hi????u su????t</div>
						</div>
						<CheckCircleOutlined />
					</div>
				</div>
				<div className='show'>
				<SurveySignature catch='van_hanh' totalItem={totalItem}  getListByPage={getListByPage} data={data} setCurrentLoanCode={setCurrentLoanCode} step='SURVER' currentSchedule={currentSchedule} listAgentID={listAgentID} index={step} setCurrentStaff={setCurrentStaff} setLoanCalendar={setLoanCalendar}/>
				</div>
				<InfoCustomer initDataCustomer={initDataCustomer} showInfoCustomer={showInfoCustomer} currentLoanCode={currentLoanCode} infoCustomer={infoCustomer} setInfoCustomer={setInfoCustomer} isShowInfoCustomer={isShowInfoCustomer}/>
				<div>
				<CalendarButton catch={step === 'CONTRACT' ? 'indent' : 'null'} step={currentSchedule} setLoanCalendar={setLoanCalendar} loanCalendar={loanCalendar} showInfoCustomer={showInfoCustomer} currentStaff={currentStaff}/>
				</div>
			</div>
		</div>
	)
}
function mapDispatchToProps(dispatch) {
	return {
	}
}
const mapStateToProps = (state) => {
	return {
		hasWaitingStatus: state.loan.hasWaitingStatus,
		loanDetail: state.loan.loanDetail,
		isEditLoan: state.loan.isEditLoan,
		customer: state.authentication.customer,
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(Operate);
