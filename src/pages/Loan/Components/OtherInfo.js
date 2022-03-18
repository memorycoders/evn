import { Col, Row, Form, Input, Checkbox, Select } from "antd";
import React, { useState, useEffect } from "react";
import Address from "./Address";
import RelativePerson from "./RelativePerson";
const OtherInfo = (props) => {
	const { loanDetail, info, setInfo, staticData, form } = props;
	const [isCompanyEVN, setCompanyEVN] = useState(false)
	const _rule = () => ({
		validator(rule, value) {
			if(value === undefined || value !== undefined && value.length === 0) {
				return Promise.reject(
					"Vui lòng điền thông tin!"
				);
			}
			return Promise.resolve();
		}
	})
	const working_duration_rule = () => ({
		validator(rule, value) {
			const regExp = /^[0-9]{1,2}$/;
			if(value && !regExp.test(value)) {
				return Promise.reject(
					"Số năm công tác không đúng định dạng!"
				);
			}
			return Promise.resolve();
		}
	})
	const income_rule = () => ({
		validator(rule, value) {
			const regExp = /^[0-9,]{1,100}$/;
			if(value && !regExp.test(value)) {
				return Promise.reject(
					"Thu nhập không đúng định dạng!"
				);
			}
			return Promise.resolve();
		}
	})
	const formatNumber = (x) => {
		let a = x?.toString().replace(/,/g, '');
		return a && a.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	}
	
	const handleInputOtherInfo = (e, type) => {
		setInfo({
			...info,
			working_information: {
				...info.working_information,
				[type]: e.target.value.toString().replace(/,/g, '')
			}
		})
	}

	useEffect(() => {
		if(localStorage.getItem("isDuplicateAddressContact") === 'true'){
			setDuplicateAddressContact(true);
			setInfo({
				...info,
				installation_address: {
					...info.installation_address,
					province_id: info.contact_address.province_id,
					district_id: info.contact_address.district_id,
					commune_id: info.contact_address.commune_id,
					street: info.contact_address.street
				}
			})
			form.setFieldsValue({
				installation_address_province_id: info.contact_address.province_id,
				installation_address_district_id: info.contact_address.district_id,
				installation_address_commune_id: info.contact_address.commune_id,
				installation_address_street: info.contact_address.street,
			})
		}
	}, []);

	const [isDuplicateAddressContact, setDuplicateAddressContact] = useState(false)
	const fnDuplicateAddressContact = () => {
		if(!isDuplicateAddressContact) {
			setInfo({
				...info,
				installation_address: {
					...info.installation_address,
					province_id: info.contact_address.province_id,
					district_id: info.contact_address.district_id,
					commune_id: info.contact_address.commune_id,
					street: info.contact_address.street
				}
			})
			form.setFieldsValue({
				installation_address_province_id: info.contact_address.province_id,
				installation_address_district_id: info.contact_address.district_id,
				installation_address_commune_id: info.contact_address.commune_id,
				installation_address_street: info.contact_address.street,
			})
		}
		setDuplicateAddressContact(!isDuplicateAddressContact);
		localStorage.setItem("isDuplicateAddressContact", !isDuplicateAddressContact);
		
	}
	const IS_NUMBER = /^\d+$/;
	const phoneRule = [({
		validator(rule, value) {
			let isShowMessage = false;
			if(value) {
				if(value.match(IS_NUMBER)) {
					if(value.length > 10) {
						isShowMessage = true;
						}
					} else {
						isShowMessage = true;
					}
				if(isShowMessage) {
					return Promise.reject(
						"Vui lòng kiểm tra lại số điện thoại!"
					);
				}
			} else {
				return Promise.reject(
					"Vui lòng nhập số điện thoại!"
				);
			}
			return Promise.resolve();
		}
	})]

	const ruleNumber = [({
		validator(rule, value) {
			if(value) {
				if(!value.match(IS_NUMBER))  {
					return Promise.reject(
						"Vui lòng kiểm tra lại mã đơn vị!"
					);
				}
			} else {
				return Promise.reject(
					"Vui lòng nhập mã đơn vị"
				);
			}
			return Promise.resolve();
		}
	})]
	useEffect(() => {
		if(localStorage.getItem("isCompanyEVN") === 'true') {
			setCompanyEVN(true);
		}
	}, [])

	useEffect(() => {
		setCompanyEVN(info?.working_information?.company_id || false);
	}, [info])

	const handleChangeCompany = () => {
		setInfo({
			...info,
			working_information: {
				...info.working_information,
				company_id: isCompanyEVN ? null : 1
			}
		})
		setCompanyEVN(!isCompanyEVN);
		localStorage.setItem("isCompanyEVN", !isCompanyEVN);
	}
	const renderEmployeeEVN = () => {
		if(isCompanyEVN) {
			return (
				<>
				<Row >
				<Col span={12} className="col-left">
					<Form.Item label="Đơn vị" name="department" required rules={[_rule]}>
						<Input defaultValue={info.working_information.department}  value={info.working_information.department} onChange={(e) => {handleInputOtherInfo(e, 'department')}}/>
					</Form.Item>
				</Col>
				<Col span={12} className="col-right">
					<Form.Item label="Vị trí công tác" name="position" required rules={[_rule]} required>
					<Input defaultValue={info.working_information.position}  value={info.working_information.position} onChange={(e) => {handleInputOtherInfo(e, 'position')}}/>
					</Form.Item>
				</Col>
				</Row>
				<Row>
					<Col span={12} className="col-left">
						<Form.Item label="Mã nhân viên" name="employee_code" required rules={[_rule]} required>
						<Input defaultValue={info.working_information.employee_code}  value={info.working_information.employee_code} onChange={(e) => {handleInputOtherInfo(e, 'employee_code')}}/>
						</Form.Item>
					</Col>
					<Col span={12} className="col-right">
						<Form.Item label="Mã hợp đồng"  name="contract_code" rules={[_rule]} required>
						<Input defaultValue={info.working_information.contract_code}  value={info.working_information.contract_code} onChange={(e) => {handleInputOtherInfo(e, 'contract_code')}}/>
						</Form.Item>
					</Col>
				</Row>
				</>
			)
		} else {
			return (
				<>
				<Row >
				<Col span={12} className="col-left">
					<Form.Item label="Mã nhân viên" name="employee_code">
						<Input defaultValue={info.working_information.employee_code}  value={info.working_information.employee_code} onChange={(e) => {handleInputOtherInfo(e, 'employee_code')}}/>
					</Form.Item>
				</Col>
				<Col span={12} className="col-right">
					<Form.Item label="Vị trí công tác" name="position" required rules={[_rule]} required>
					<Input defaultValue={info.working_information.position}  value={info.working_information.position} onChange={(e) => {handleInputOtherInfo(e, 'position')}}/>
					</Form.Item>
				</Col>
				</Row>
				<Row>
					<Col span={12} className="col-left">
						<Form.Item label="Số năm công tác" name="working_duration" required rules={[_rule, working_duration_rule]} required>
						<Input value={info.working_information.working_duration} onChange={(e) => {handleInputOtherInfo(e, 'working_duration')}}/>
						</Form.Item>
					</Col>
					<Col span={12} className="col-right">
						<Form.Item label="Thu nhập"  name="income" rules={[_rule, income_rule]} required normalize={e => formatNumber(e)}>
						<Input value={info.working_information.income} onChange={(e) => {handleInputOtherInfo(e, 'income')}}/>
						</Form.Item>
					</Col>
				</Row>
				</>
			)
		}
	}
	return (
		<>
		<p>* Thông tin bắt buộc</p>
		<Row><Checkbox checked={isCompanyEVN} onClick={handleChangeCompany}>Tôi là nhân viên EVN</Checkbox></Row>
			{renderEmployeeEVN()}
		<b>Thông tin người thân</b>
			<RelativePerson loanDetail={loanDetail} staticData={staticData} info={info} setInfo={setInfo} form={form} /> 
		<b>Địa chỉ lắp đặt điện mặt trời</b>
		<Row><Checkbox checked={isDuplicateAddressContact} onClick={fnDuplicateAddressContact}>Trùng địa chỉ liên lạc</Checkbox></Row>
		<Address loanDetail={loanDetail} disabled={isDuplicateAddressContact}  type="installation_address" {...props}/>
		</>
	)
}
export default OtherInfo;