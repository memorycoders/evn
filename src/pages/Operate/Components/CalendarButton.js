import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Table, Button } from "antd";
import { ArrowRightOutlined } from '@ant-design/icons';

import '../../../styles/digitalSignature.scss';
import '../../../styles/operate.scss';
import http from "../../../apis/http";
import { signCloudFirstTime } from '../../../store/loans/action';
import DigitalSignature from '../../../pages/Operate/Components/DigitalSignature';
import MaintanceSignature from '../../../pages/Operate/Components/MaintanceSignature';
import { SCHEDULE_SURVER } from "../../../utils/constants";
const CalendarButton = (props) => {
	const {showInfoCustomer, currentStaff, loanCalendar, setLoanCalendar, step} = props;
	// const [dataSource, setDataSource] = useState([])
	const [calendarStep, updateCalendarStep] = useState(step);
	
	useEffect(() => {
		updateCalendarStep(step);
	}, [step])

    return (
        <div style={{ marginTop: '50px' }} className="digital-signature operate-signature">
            <div style={{ display: 'flex' }} className="loanlist-operate">
                    <div className="l-calendar-button">
						<Button disabled={calendarStep === 'SURVER' ? false : true} onClick={ () => {updateCalendarStep(SCHEDULE_SURVER.SURVER)}} className={calendarStep === 'SURVER' ? "status-btn-active" : "status-btn-default"}>
							<span className="l-calendar-name">Lịch khảo sát</span>
						</Button>
					</div>
					<div className="l-calendar-button calendar-last">
						<Button disabled={calendarStep === 'SET_UP' ? false : true} onClick={ () => {updateCalendarStep(SCHEDULE_SURVER.SET_UP)}} className={calendarStep === 'SET_UP' ? "status-btn-active" : "status-btn-default"}>
							<span className="l-calendar-name">Lịch lắp đặt</span>
						</Button>
					</div>					
					<div className="l-calendar-button calendar-last">
						<Button disabled={calendarStep === 'MAINTAIN' ? false : true} onClick={ () => {updateCalendarStep(SCHEDULE_SURVER.MAINTAIN)}} className={calendarStep === 'MAINTAIN' ? "status-btn-active" : "status-btn-default"}>
							<span className="l-calendar-name">Lịch bảo dưỡng</span>
						</Button>
					</div>					
					{/* <div className="l-calendar-button calendar-last">
						<Button disabled={calendarStep === 'INCIDENT' ? false : true} onClick={ () => {updateCalendarStep(SCHEDULE_SURVER.INCIDENT)}} className={(calendarStep === 'INCIDENT' || props.catch === 'indent') ? "status-btn-active" : "status-btn-default"}>
							<span className="l-calendar-name">Lịch xử lý sự cố</span>
						</Button>
					</div>	 */}
					<div className="l-calendar-button calendar-last">
						<Button disabled={calendarStep === 'CONTRACT' ? false : true} onClick={ () => {updateCalendarStep(SCHEDULE_SURVER.INCIDENT)}} className={(calendarStep === 'INCIDENT' || props.catch === 'indent') ? "status-btn-active" : "status-btn-default"}>
							<span className="l-calendar-name">Lịch xử lý sự cố</span>
						</Button>
					</div>	
            </div>
            <div className='show' style={{ marginTop: '20px'}}>
				<MaintanceSignature setLoanCalendar={setLoanCalendar} data={loanCalendar} index={calendarStep} showInfoCustomer={showInfoCustomer} currentStaff={currentStaff}/>
			</div>
        </div>
    )
}
function mapDispatchToProps(dispatch) {
    return {
        signCloudFirstTime: (id) => dispatch(signCloudFirstTime(id)),
    }
}
const mapStateToProps = (state) => {
    return {
        loansData: state.loan.loansData,
        customer: state.authentication.customer,
        loanDetail: state.loan.loanDetail,
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(CalendarButton);