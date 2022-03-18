import { Steps, Popover, Button, Modal } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";

import { history } from '../../../utils/history';
import '../../../styles/loan.scss'
import RegisterProfile from '../Components/RegisterProfile';
import LoanInfomation from '../Components/LoanInfomation';
import bgTitle from '../../../asset/images/bg-title.png';
import { isEditLoan } from '../../../store/loans/action';
import { getLoans } from '../../../store/loans/action';
import { set } from 'lodash';
import ApproveStatus from '../Components/ApproveStatus';
import DigitalSignature from '../Components/DigitalSignature';

const { Step } = Steps;
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

function LoanRegister(props) {
	let currentDate = new Date();
	const [step, updateStep] = useState(0);
	const [tab, updateTab] = useState(0);
	const [listRule, setRuleChecked] = useState({})
	const [isBackFromInformation, setBackFromInformation] = useState(false);
	const [modalCareerType, setOpenModalCareerType] = useState(false);
	const [collateral, setCollateral] = useState([]);
	const [otherCollateral, setOtherCollateral] = useState(["1"]);
	const [payment, setPayment] = useState([]);
	const [isCheckPermanent, setCheckPermanent] = useState(false);
	const [isCheckContact, setCheckContact] = useState(false);
	const [info, setInfo] = useState({
		collateral: 0,
		// payment_method: 0,
		career_type: 1,
		loan_amount: 0,
		interest_rate: 0.078,
		term: 0,
		product_id: 1,
		provider_id: 1,
		product_name: '',
		repayment_method: 0,
		ownership_type: 1,
		mortgage_status: 1,
		// roof_type: 1,
		rental_status: 1,
		ppa_type: 1,
		installation_location: 1,
		expected_total_investment: 0,
		investment_amount: 0,
		cmis: "",
		power_capacity: 10,
		timeTerm: new Date(currentDate.setFullYear(currentDate.getFullYear() + 1)),
		personal_information: {
			additional_emails_list: [],
			additional_phone_numbers_list: [],
			id_card_issued_date: '',
			birthday: "null",
			card_number: "string",
			email: "",
			gender: 0,
			name: null,
			phone_number: "",
			"issued_by": "",
			"marital_status": '',
			"expiration_date": '',
			"passport": "",
			"address": '',
		},
		contact_address: "",
		permanent_address: "",
		installation_address: "",
		permanent_city: 0,
		permanent_district: 0,
		contact_city: 0,
		contact_district: 0,
		installation_city: 0,
		installation_district: 0,
		relative_persons: [
			{
				"name": "",
				"phone_number": "",
				"relation": 0,
				"card_number": "",
				"birthday": "",
				"id_card_issued_date": "",
				"address": "",
				"permanent_address": "",
				"email": "",
			}
		],
		"working_information": {
			"company_id": 1,
			"contract_code": null,
			"department": null,
			"employee_code": '',
			"income": 0,
			"pay_forms": '',
			'other_income': 0,
			'other_income_desc': '',
			"position": null,
			"working_duration": 1,
			"company_name": '',
			'working_address': '',
			'contract_type': 0
		},
		attachment_files: []

	});

	// console.log("info", info);


	const handleUpdateStep = (value) => {
		setBackFromInformation(false);
		if (value === 0 && step === 1) {
			setBackFromInformation(true);
		}
		updateStep(value)
	}

	const handleUpdateTab = (value) => {
		setBackFromInformation(false);
		if (value === 0 && tab === 1) {
			setBackFromInformation(true);
		}
		updateTab(value)
	}

	const handleCareerType = isCheck => {
		if (isCheck) {
			setInfo({
				...info,
				career_type: 1,
				working_information: {
					...info.working_information,
					company_id: 1,
				}
			})
			setOpenModalCareerType(false);
		} else {
			setInfo({
				...info,
				career_type: 0,
				working_information: {
					...info.working_information,
					company_id: null
				}
			})
			setOpenModalCareerType(false);
		}
		setOpenModalCareerType(false);
	}

	const handleCloseModal = () => {
		setOpenModalCareerType(false);
	}

	useEffect(() => {
		props.getLoans({ id: null, status: false, user: props?.user?.username })
		if (props.hasWaitingStatus && !props.isEditLoan && props?.user?.username !== '0976627796') {
			history.push('/loan-list');
		}
		// if(props.customer && props.customer.career_type || props.loanDetail?.working_information?.company_id) {
		if (props.loanDetail.hasOwnProperty(status) && props.loanDetail.status !== 1) {
			setOpenModalCareerType(false);
			if (props.loanDetail.status < 7) {
				updateStep(1)
			} else {
				updateStep(2)
			}
		} else {
			setOpenModalCareerType(true);
			updateStep(0)
		}

	}, [props.hasWaitingStatus, props.isEditLoan, props.loanDetail])



	useEffect(() => {
		if (props.loanDetail.id) {
			setInfo({
				...info,
				cmis: props.loanDetail.cmis || info.cmis,
				investment_amount: props.loanDetail.investment_amount || info.investment_amount,
				expected_total_investment: props.loanDetail.expected_total_investment || info.expected_total_investment,
				term: props.loanDetail.term || info.term,
				loan_amount: props.loanDetail.loan_amount || info.loan_amount,
				ownership_type: props.loanDetail.ownership_type || info.ownership_type,
				installation_location: props.loanDetail.installation_location || info.installation_location,
				mortgage_status: props.loanDetail.mortgage_status || info.mortgage_status,
				rental_status: props.loanDetail.rental_status || info.rental_status,
				ppa_type: props.loanDetail.ppa_type || info.ppa_type,
				contact_address: props.loanDetail.contact_address || info.contact_address,
				contact_city: props.loanDetail.contact_city || info.contact_city,
				contact_district: props.loanDetail.contact_district || info.contact_district,
				permanent_address: props.loanDetail.permanent_address || info.permanent_address,
				permanent_city: props.loanDetail.permanent_city || info.permanent_city,
				permanent_district: props.loanDetail.permanent_district || info.permanent_district,
				installation_address: props.loanDetail.installation_address || info.installation_address,
				installation_city: props.loanDetail.installation_city || info.installation_city,
				installation_district: props.loanDetail.installation_district || info.installation_district,
				repayment_method: props.loanDetail.repayment_method || info.repayment_method,
				power_capacity: props.loanDetail.power_capacity || info.power_capacity,
				personal_information: {
					...info.personal_information,
					additional_emails_list: props.loanDetail?.personal_information?.additional_emails_list || [],
					additional_phone_numbers_list: props.loanDetail?.personal_information?.additional_phone_numbers_list || [],
					birthday: props.loanDetail?.personal_information?.birthday || '',
					id_card_issued_date: props.loanDetail?.personal_information?.id_card_issued_date || '',
					card_number: props.loanDetail?.personal_information?.card_number || "",
					email: props.loanDetail?.personal_information?.email || '',
					gender: props.loanDetail?.personal_information?.gender === null ? null : (props.loanDetail?.personal_information?.gender || 0),
					name: props.loanDetail?.personal_information?.name || '',
					marital_status: props.loanDetail?.personal_information?.marital_status || 0,
					expiration_date: props.loanDetail?.personal_information?.expiration_date || '',
					passport: props.loanDetail?.personal_information?.passport || '',
					issued_by: props.loanDetail?.personal_information?.issued_by || ''
				},
				working_information: {
					...info.working_information,
					"company_id": props.loanDetail?.working_information?.company_id || null,
					"contract_code": props.loanDetail?.working_information?.contract_code || null,
					"department": props.loanDetail?.working_information?.department || null,
					"employee_code": props.loanDetail?.working_information?.employee_code || '',
					// "income": props.loanDetail?.working_information?.income || 0,
					"income": props.loanDetail?.working_information?.income || info.working_information?.income,
					"pay_forms": props.loanDetail?.working_information?.pay_forms || 1,
					"other_income": props.loanDetail?.working_information?.other_income || 0,
					"other_income_desc": props.loanDetail?.working_information?.other_income_desc || '',
					"position": props.loanDetail?.working_information?.position || null,
					"working_duration": props.loanDetail?.working_information?.working_duration || 1,
					"company_name": props.loanDetail?.working_information?.company_name || '',
					'working_address': props.loanDetail?.working_information?.working_address || "",
					'contract_type': props.loanDetail?.working_information?.contract_type || 0,
				},
				relative_persons: props?.loanDetail?.relative_persons?.length > 0 ? props?.loanDetail?.relative_persons : info.relative_persons,
			})
			setCheckContact(props.loanDetail.contact_address === props.loanDetail.installation_address ? true : false)
			setCheckPermanent(props.loanDetail.permanent_address === props.loanDetail.installation_address ? true : false)
		}
	}, [props.loanDetail])

	return (
		<div className="loan-wrapper">
			<div className="l-loan-container">
				<div className="step-by-step">
					<div className={step === 0 ? "l-register active-step" : "l-register"}>
						<div className="l-register-inner">
							<span>Đăng ký khoản vay</span>
							<CheckCircleOutlined />
						</div>
					</div>
					<div className={step === 1 ? "l-approval active-step" : step === 2 ? "finish-step" : "l-approval"}>
						<div className="l-approval-inner">
							<div className="inner2">
								<div>Phê duyệt</div>
							</div>
							<CheckCircleOutlined />
						</div>
					</div>
					<div className={step === 2 ? "l-sign active-step" : "l-sign"}>
						<div className="l-sign-inner">
							<div>Ký hợp đồng</div>
						</div>
						<CheckCircleOutlined />
					</div>
				</div>
				{!props.loanDetail.hasOwnProperty(status) ? <div style={{ backgroundColor: '#fff' }}>
					<div className="button-group">
						<Button className={tab === 0 ? "active" : ""}>
							Thông tin khoản vay
							</Button>
						<Button className={tab === 1 ? "active" : ""}>
							Thông tin cá nhân
							</Button>
						<Button className={tab === 2 ? "active" : ""}>
							File đính kèm
							</Button>
					</div>
					<div className={tab === 0 ? "show" : "hidden"}>
						<LoanInfomation
							isBackFromInformation={isBackFromInformation}
							listRule={listRule} setRuleChecked={setRuleChecked}
							updateTab={handleUpdateTab}
							info={info} setInfo={setInfo}
							otherCollateral={otherCollateral}
							setOtherCollateral={setOtherCollateral}
							collateral={collateral}
							setCollateral={setCollateral}
							payment={payment}
							setPayment={setPayment}
							isCheckContact={isCheckContact}
							setCheckContact={setCheckContact}
							isCheckPermanent={isCheckPermanent}
							setCheckPermanent={setCheckPermanent}
						/>
					</div>
					<div className={tab === 1 || tab === 2 ? "show" : "hidden"}>
						<RegisterProfile updateTabs={updateTab} updateTab={handleUpdateTab} info={info} setInfo={setInfo}
							payment={payment} otherCollateral={otherCollateral} collateral={collateral}
							isCheckContact={isCheckContact}
							isCheckPermanent={isCheckPermanent} />
					</div>
				</div> : (
						props.loanDetail.status === 1 ?
							<div style={{ backgroundColor: '#fff' }}>
								<div className="button-group">
									<Button className={tab === 0 ? "active" : ""}>
										Thông tin khoản vay
								</Button>
									<Button className={tab === 1 ? "active" : ""}>
										Thông tin cá nhân
								</Button>
									<Button className={tab === 2 ? "active" : ""}>
										File đính kèm
								</Button>
								</div>
								<div className={tab === 0 ? "show" : "hidden"}>
									<LoanInfomation
										isBackFromInformation={isBackFromInformation}
										listRule={listRule} setRuleChecked={setRuleChecked}
										updateTab={handleUpdateTab}
										info={info} setInfo={setInfo}
										otherCollateral={otherCollateral}
										setOtherCollateral={setOtherCollateral}
										collateral={collateral}
										setCollateral={setCollateral}
										payment={payment}
										setPayment={setPayment}
										isCheckContact={isCheckContact}
										setCheckContact={setCheckContact}
										isCheckPermanent={isCheckPermanent}
										setCheckPermanent={setCheckPermanent}
									/>
								</div>
								<div className={tab === 1 || tab === 2 ? "show" : "hidden"}>
									<RegisterProfile updateTabs={updateTab} updateTab={handleUpdateTab} info={info} setInfo={setInfo}
										payment={payment} otherCollateral={otherCollateral} collateral={collateral}
										isCheckContact={isCheckContact}
										isCheckPermanent={isCheckPermanent} />
								</div>
							</div> : (props.loanDetail.status < 7 || props.loanDetail.status === 9) ? <div>
								<ApproveStatus />
							</div> : <DigitalSignature />
					)}
			</div>
			<Modal
				className='career-type-popup'
				title="Bạn đang công tác tại"
				visible={modalCareerType}
			// onCancel={handleCloseModal}
			>
				<div className="career-btn">
					<div className={info.career_type ? "active" : ""} onClick={() => handleCareerType(true)}>Ngành điện</div>
					<div className={!info.career_type ? "active" : ""} onClick={() => handleCareerType(false)}>Ngoài ngành điện</div>
				</div>
			</Modal>
		</div>
	)
}
function mapDispatchToProps(dispatch) {
	return {
		getLoans: (payload) => dispatch(getLoans(payload)),
	}
}
const mapStateToProps = (state) => {
	return {
		hasWaitingStatus: state.loan.hasWaitingStatus,
		loanDetail: state.loan.loanDetail,
		isEditLoan: state.loan.isEditLoan,
		customer: state.authentication.customer,
		user: state.authentication.user,
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(LoanRegister);




