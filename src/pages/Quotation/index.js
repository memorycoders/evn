import { Steps, Popover } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import '../../styles/operate.scss'
import SurveySignature from './components/SurveySignature';
import http from "../../apis/http";
import { SCHEDULE_SURVER } from '../../utils/constants';
import FullDetail from './components/FullDetail';
import AfterSales from './components/AfterSales';
import Equipment from './components/Equipment';

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

function Survey(props) {
	const [step, updateStep] = useState('');
	const [currentSchedule, setCurrentSchedule] = useState(SCHEDULE_SURVER.SURVER)
	const [isShowInfoCustomer, showInfoCustomer] = useState(false);
	const [data, setData] = useState([]);
	const [fields, setFields] = useState([])
	const [currentStaff, setCurrentStaff] = useState("");
	const [currentLoanCode, setCurrentLoanCode] = useState("1")
	const [loanCalendar, setLoanCalendar] = useState([]);
	const [listAgentID, setListAgentID] = useState([]);
	const [totalItem, setTotalItem] = useState(0);


	const TABS = {
		SURVEY: 'SURVEY',
		CONTRACT: 'CONTRACT',
		AFTER_SALE: 'AFTER_SALE',
		FULL: 'FULL'
	}
	useEffect(() => {
		handleClickTab(TABS.SURVEY);
	}, [])

	const getListByPage = async (tab, pageIndex) => {
		try {
			const rs = await http.get(`web/quotation/package?pageIndex=${pageIndex}&pageSize=5`);
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
				return NotificationError("", "Có lỗi xảy ra. Vui lòng thử lại");
			}
		}catch(ex){}
	}

	const handleClickTab = async (tab) => {
		if(tab !== step) {
			updateStep(tab)
			switch(tab) {
				case TABS.SURVEY:
					getListByPage(tab, 0)
					break;
				break;
			}
		}
	}
	const renderContent = () => {
		switch (step) {
			case TABS.SURVEY:
			return	<>
				<SurveySignature setFields={setFields}  totalItem={totalItem}  getListByPage={getListByPage} data={data} setCurrentLoanCode={setCurrentLoanCode} step='SURVER' currentSchedule={currentSchedule} listAgentID={listAgentID} index={step} setCurrentStaff={setCurrentStaff} setLoanCalendar={setLoanCalendar}/>
				<div style={{ marginTop: 20 }} className="content-step clear-input-border">
					<FullDetail setFields={setFields} fields={fields} setData={setData}/> 
				</div>
			</>
			case TABS.CONTRACT:
				return <Equipment/>
			case TABS.AFTER_SALE:
				return <AfterSales step={step} TABS={TABS}/>
				 
		}
	}
	return (
		<div className="operate-wrapper">
			<span style={{ marginLeft: '5px' }} className='l-operate-title'>BÁO GIÁ</span>
			<div className="l-operate-container">
				<div className="step-by-step">
					<div onClick={ () => {handleClickTab(TABS.SURVEY)}} className={step === 'SURVEY' ? "l-register active-step" : "l-register"}>
						<div className="l-register-inner">
							<div class='l-header-name'>Giá trọn gói</div>
							<CheckCircleOutlined />
						</div>
					</div>
					<div onClick={ () => {handleClickTab(TABS.CONTRACT)}} className={step === 'CONTRACT' ? "l-approval active-step" : "l-approval"}>
						<div className="l-approval-inner">
							<div className="inner2">
								<div class='l-header-name'>Giá chi tiết</div>
							</div>
							<CheckCircleOutlined />
						</div>
					</div>
					<div onClick={ () => {handleClickTab(TABS.AFTER_SALE)
						}} className={step === 'AFTER_SALE' ? "l-sign active-step" : "l-sign"}>
						<div className="l-sign-inner">
							<div class='l-header-name'>Hậu mãi</div>
						</div>
						<CheckCircleOutlined />
					</div>
				</div>
				{renderContent()}	
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
export default connect(mapStateToProps, mapDispatchToProps)(Survey);
