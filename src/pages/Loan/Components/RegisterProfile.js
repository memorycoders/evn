import { Button, Form } from 'antd';
import React, { useEffect, useState } from 'react';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import moment from "moment"
import { connect } from 'react-redux';
import { getCommune, getDistricts, getProvincers, getStaticData } from '../../../store/common/action';
import { register, updateRegister } from '../../../store/loans/action';
import Attachments from './Attachment';
import PersonalInfo from './PersonalInfo';
import OtherInfo from './OtherInfo';
import http from '../../../apis/http';

const RegisterProfile = (props) => {
	const { updateTabs, loanDetail, customer, updateTab, info, setInfo, getProvincers, register, updateRegister, getStaticData,
		staticData, collateral, otherCollateral, payment, userInfo } = props;
	const [isShowInfoOther, showInfoOther] = useState(false)
	let firstInit = false;
	useEffect(() => {
		if (!firstInit) {
			firstInit = true;
			getStaticData();
		}
	}, [])

	useEffect(() => {
		getCity()
	}, [])
	const [city, setCity] = useState([]);
	const getCity = async () => {
		const rs = await http.get(`web/dict_item/items?item_type=TinhThanh`);
		if (rs?.status === 200) {
			setCity(rs?.data?.data?.data);
		}
	}

	const DATE_FORMAT = "YYYY-MM-DD";
	const [form] = Form.useForm();

	useEffect(() => {
		if (customer && customer.personal_information) {
			setInfo({
				...info,
				personal_information: {
					...info.personal_information,
					phone_number: customer.personal_information && customer.personal_information.phone_number ? customer.personal_information.phone_number : "",
					birthday: customer.personal_information && customer.personal_information.birthday ? moment(customer.personal_information.birthday, DATE_FORMAT) : null,
					card_number: customer.personal_information && customer.personal_information.card_number ? customer.personal_information.card_number : "",
					email: customer.personal_information && customer.personal_information.email ? customer.personal_information.email : "",
					gender: customer.personal_information && customer.personal_information.gender ? customer.personal_information.gender : (customer?.personal_information.gender === 0 ? 0 : null),
					name: customer.personal_information && customer.personal_information.name ? customer.personal_information.name : "",
				}
			});
			form.setFieldsValue({
				card_number: customer && customer.personal_information && customer.personal_information.card_number ? customer.personal_information.card_number : info.personal_information.card_number,
				p_email: customer && customer.personal_information && customer.personal_information.email ? customer.personal_information.email : info.personal_information.email,
				gender: customer && customer.personal_information && customer.personal_information.gender ? customer.personal_information.gender : (customer?.personal_information?.gender === 0 ? 0 : null),
				p_name: customer.personal_information && customer.personal_information.name ? customer.personal_information.name : "",
				phone_number: customer && customer.personal_information && customer.personal_information.phone_number ? customer.personal_information.phone_number : "",
				birthday: customer && customer.personal_information && customer.personal_information.birthday ? moment(customer.personal_information.birthday, DATE_FORMAT) : null,
				id_card_issued_date: customer && customer.personal_information && customer.personal_information.id_card_issued_date ? moment(customer.personal_information.id_card_issued_date, DATE_FORMAT) : null,
			})
		}

	}, [customer])

	useEffect(() => {
		if (loanDetail.id) {
			updateTab(0);

			form.setFieldsValue({
				card_number: loanDetail?.personal_information?.card_number || info.personal_information.card_number,
				p_email: loanDetail?.personal_information?.email || info.personal_information.email,
				gender: loanDetail && loanDetail.personal_information && loanDetail.personal_information.gender ? loanDetail.personal_information.gender : (loanDetail?.personal_information?.gender === 0 ? 0 : null),
				p_name: loanDetail?.personal_information?.name || "",
				phone_number: loanDetail?.personal_information?.phone_number || "",
				birthday: loanDetail && loanDetail.personal_information && loanDetail.personal_information.birthday ? moment(loanDetail.personal_information.birthday, DATE_FORMAT) : null,
				id_card_issued_date: loanDetail && loanDetail.personal_information && loanDetail.personal_information.id_card_issued_date ? moment(loanDetail.personal_information.id_card_issued_date, DATE_FORMAT) : null,
				position: loanDetail?.working_information?.employee_code ? (loanDetail?.working_information?.position || info.working_information.position) : '',
				employee_code: loanDetail?.working_information?.employee_code || info.working_information.employee_code,
				contract_code: loanDetail?.working_information?.contract_code || info.working_information.contract_code,
				working_duration: loanDetail?.working_information?.employee_code ? loanDetail?.working_information?.working_duration : null,
				income: loanDetail?.working_information?.income || 1,
				department: loanDetail?.working_information?.department || info.working_information.department,
				company_id: loanDetail?.working_information?.company_id || info.working_information.company_id,
			})
		}
	}, [loanDetail])
	const next = () => {
		// console.log('info => ', info)
		showInfoOther(true);
		updateTabs(2)
	}
	const back = () => {
		// console.log('info => ', info)
		if (isShowInfoOther) {
			showInfoOther(false);
			updateTabs(1)
		} else {
			updateTab(0)
		}
	}
	const onFinish = () => {
		if (isShowInfoOther) {
			let collateralValue = 0;
			let paymentValue = 0;
			if (collateral.includes("1") && !collateral.includes("2")) {
				collateralValue = 8;
			}
			if (!collateral.includes("1") && collateral.includes("2")) {
				if (otherCollateral.includes("1") && otherCollateral.includes("2") && otherCollateral.includes("3")) {
					collateralValue = 7
				}
				if (otherCollateral.includes("1") && otherCollateral.includes("2") && !otherCollateral.includes("3")) {
					collateralValue = 6
				}
				if (otherCollateral.includes("1") && !otherCollateral.includes("2") && otherCollateral.includes("3")) {
					collateralValue = 5
				}
				if (otherCollateral.includes("1") && !otherCollateral.includes("2") && !otherCollateral.includes("3")) {
					collateralValue = 4;
				}
				if (!otherCollateral.includes("1") && otherCollateral.includes("2") && otherCollateral.includes("3")) {
					collateralValue = 3
				}
				if (!otherCollateral.includes("1") && otherCollateral.includes("2") && !otherCollateral.includes("3")) {
					collateralValue = 2
				}
				if (!otherCollateral.includes("1") && !otherCollateral.includes("2") && otherCollateral.includes("3")) {
					collateralValue = 1
				}
				if (!otherCollateral.includes("1") && !otherCollateral.includes("2") && !otherCollateral.includes("3")) {
					collateralValue = 0
				}
			}
			if (collateral.includes("1") && collateral.includes("2")) {
				if (otherCollateral.includes("1") && !otherCollateral.includes("2") && !otherCollateral.includes("3")) {
					collateralValue = 12;
				}
				if (otherCollateral.includes("1") && otherCollateral.includes("2") && !otherCollateral.includes("3")) {
					collateralValue = 14
				}
				if (otherCollateral.includes("1") && !otherCollateral.includes("2") && otherCollateral.includes("3")) {
					collateralValue = 15
				}
				if (!otherCollateral.includes("1") && !otherCollateral.includes("2") && otherCollateral.includes("3")) {
					collateralValue = 11
				}
				if (!otherCollateral.includes("1") && !otherCollateral.includes("2") && otherCollateral.includes("3")) {
					collateralValue = 9
				}
				if (!otherCollateral.includes("1") && !otherCollateral.includes("2") && !otherCollateral.includes("3")) {
					collateralValue = 8
				}
			}

			if (payment.length) {
				if (payment.includes("1") && payment.includes("2") && payment.includes("3")) {
					paymentValue = 7
				}
				if (payment.includes("1") && payment.includes("2") && !payment.includes("3")) {
					paymentValue = 6
				}
				if (payment.includes("1") && !payment.includes("2") && payment.includes("3")) {
					paymentValue = 5
				}
				if (payment.includes("1") && !payment.includes("2") && !payment.includes("3")) {
					paymentValue = 4;
				}
				if (!payment.includes("1") && payment.includes("2") && payment.includes("3")) {
					paymentValue = 3
				}
				if (!payment.includes("1") && payment.includes("2") && !payment.includes("3")) {
					paymentValue = 2
				}
				if (!payment.includes("1") && !payment.includes("2") && payment.includes("3")) {
					paymentValue = 1
				}
				if (!payment.includes("1") && !payment.includes("2") && !payment.includes("3")) {
					paymentValue = 0
				}
			}

			let payload = {
				...info,
				collateral: collateralValue,
				repayment_method: paymentValue,
				relative_persons: info.relative_persons.filter(i => i.name)
			}
			
			city?.map((item, index) => {
				if (item.id === payload.installation_city) {
					payload.installation_city = item.item_code
				}
				if (item.id === payload.contact_city) {
					payload.contact_city = item.item_code
				}
				if (item.id === payload.permanent_city) {
					payload.permanent_city = item.item_code
				}
			})
		
			if (props.isEditLoan) {
				updateRegister({ id: loanDetail.id, data: payload })
			} else {
				register(payload);
			}
		} else {
			document.getElementById("loan_info").scrollTop = 0;
			next();
		}
	};

	const onFinishFailed = errorInfo => {
		console.log('Failed:', errorInfo);
	};

	return (
		<>
			<Form layout="vertical" form={form} className="form-register" onFinish={onFinish} onFinishFailed={onFinishFailed} >
				<div className="loan_info loan_info_reigster" id="loan_info">
					<div className="l-border">
						{isShowInfoOther ?
							// <OtherInfo loanDetail={loanDetail} form={form} info={info} setInfo={setInfo} {...props}/>
							<Attachments staticData={staticData} info={info} setInfo={setInfo} />
							: <PersonalInfo userInfo={userInfo} customer={customer} staticData={staticData} loanDetail={loanDetail} form={form} info={info} setInfo={setInfo} {...props} />}
					</div>
					{/* <div className="l-border">
			<Attachments staticData={staticData} info={info} setInfo={setInfo}/>
		</div> */}
				</div>
				<div className="l-list-button-action">
					<Button icon={<ArrowLeftOutlined />} onClick={back}>Trở lại</Button>
					{/* <Button htmlType="submit" type="primary"> Đăng ký khoản vay <ArrowRightOutlined /></Button> */}
					<Button htmlType="submit" type="primary"> {isShowInfoOther ? (props.isEditLoan ? "Cập  nhật khoản vay" : 'Đăng ký khoản vay') : 'Tiếp theo'} <ArrowRightOutlined /></Button>
				</div>
			</Form>
		</>
	)
}

function mapDispatchToProps(dispatch) {
	return {
		getProvincers: () => dispatch(getProvincers()),
		getDistricts: (id) => dispatch(getDistricts(id)),
		getCommune: (id) => dispatch(getCommune(id)),
		register: (data) => dispatch(register(data)),
		updateRegister: (data) => dispatch(updateRegister(data)),
		getStaticData: () => dispatch(getStaticData())
	}
}

const mapStateToProps = (state) => ({
	provinces: state.common.provinces,
	districts: state.common.districts,
	communes: state.common.communes,
	staticData: state.common.staticData,
	customer: state.authentication.customer,
	loanDetail: state.loan.loanDetail,
	isEditLoan: state.loan.isEditLoan,
	userInfo: state.authentication,
})

export default connect(mapStateToProps, mapDispatchToProps)(RegisterProfile);