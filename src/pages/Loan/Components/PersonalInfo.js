import { Button, Select, Col, DatePicker, Input, Row, Form } from 'antd';
import React, { useState, useEffect } from 'react';
import moment from "moment";
import Address from './Address';
import RelativePerson from "./RelativePerson";
import http from "../../../apis/http";
import { connect } from 'react-redux';
import NumberFormat from 'react-number-format';
const PersonalInfo = (props) => {
	const [errorPayForm, setPayForm] = useState("");
	const [errorIncome, setIncome] = useState("");
	const [errorPayment, setPayment] = useState("")
	const [city, setCity] = useState([]);
	const [distric, setDistric] = useState([]);
	const { loanDetail, info, setInfo, form, provinces, districts, getDistricts, communes, getCommune, staticData, customer,
		isCheckContact, isCheckPermanent, userInfo } = props;
	// const [isDuplicateAddress, setDuplicateAddress] = useState(false)
	const GENDERS = {
		M: 0,
		F: 1
	}

	const payForms = [
		{ value: 1, name: "Chuyển khoản" },
		{ value: 2, name: "Tiền mặt" },
		// { value: 3, name: "Khác" },
	]
	const getCity = async () => {
		const rs = await http.get(`web/dict_item/items?item_type=TinhThanh`);
		if (rs?.status === 200) {
			setCity(rs?.data?.data?.data);
		}
	}
	const getDistric = async (item) => {
		const rs = await http.get(`web/dict_item/items?item_type=TinhThanh&parent_id=${item}`);
		if (rs?.status === 200) {
			setDistric(rs?.data?.data?.data);
		}
	}

	useEffect(() => {
		form.setFieldsValue({
			contact_address: info.contact_address ? info.contact_address : null,
			permanent_address: info.permanent_address ? info.permanent_address : null,
			installation_address: info.installation_address ? info.installation_address : null,
			contact_city: info.contact_city ? info.contact_city : null,
			permanent_city: info.permanent_city ? info.permanent_city : null,
			installation_city: info.installation_city ? info.installation_city : null,
			contact_district: info.contact_district ? info.contact_district : null,
			permanent_district: info.permanent_district ? info.permanent_district : null,
			installation_district: info.installation_district ? info.installation_district : null,
			p_name: userInfo?.personal_information?.name,
			card_number: userInfo?.personal_information?.card_number,
			phone_number: userInfo?.user?.phone_number,
			p_email: userInfo?.user?.email,
			gender: info?.personal_information?.gender
		})
	}, [info])

	// useEffect(() => {
	// 	getCity();
	// 	if (info.installation_city) {
	// 		getDistric(info.installation_city);
	// 	}
	// 	if (info.contact_city) {
	// 		getDistric(info.contact_city);
	// 	}
	// 	if (info.permanent_city) {
	// 		getDistric(info.permanent_city);
	// 	}
	// }, [info.installation_city, info.contact_city, info.permanent_city])
	useEffect(() => {
		getCity();
		if (info.installation_city) {
			getDistric(info.installation_city);
		}
		if (info.contact_city) {
			getDistric(info.contact_city);
		}
		if (info.permanent_city) {
			getDistric(info.permanent_city);
		}
	}, [info.installation_city,info.contact_city,info.permanent_city])

	const marital = [
		{ value: 0, name: "Độc thân" },
		{ value: 1, name: "Đã kết hôn" },
		// { value: 3, name: "Khác" },
	]
	const dateFormat = 'DD/MM/YYYY';
	const handleInputPersonalInfo = (e, type) => {
		setInfo({
			...info,
			personal_information: {
				...info.personal_information,
				[type]: e.target.value
			}
		})
	}
	const handleChangePayForm = (e) => {
		console.log('??', e)
		setPayForm("")
		setInfo({
			...info,
			personal_information: {
				...info.personal_information,
				marital_status:e,
				card_number: userInfo?.personal_information?.card_number,
				phone_number: userInfo?.user?.phone_number,
				email: userInfo?.user?.email,
				name: userInfo?.personal_information?.name,
			}
		})
	}
	const handleSelectBirthday = (e, value) => {
		setInfo({
			...info,
			personal_information: {
				...info.personal_information,
				birthday:moment(e).format('YYYY-MM-DD')
				// birthday: moment(value, dateFormat)
			}
		})
	}

	const handleSelectDateRange = (e, value) => {
		setInfo({
			...info,
			personal_information: {
				...info.personal_information,
				// id_card_issued_date: moment(value, dateFormat)
				id_card_issued_date: moment(e).format('YYYY-MM-DD')
			}
		})
	}
	
	
	

	
	const handleSelectDate = (e, value) => {
		setInfo({
			...info,
			personal_information: {
				...info.personal_information,
				// expiration_date: moment(value, dateFormat)
				expiration_date:moment(e).format('YYYY-MM-DD')
			}
		})
	}
	const changeGender = (value) => {
		setInfo({
			...info,
			personal_information: {
				...info.personal_information,
				gender: value
			}
		});
		form.setFieldsValue({ gender: value });
	}
	const _rule = () => ({
		validator(rule, value) {

			if (value === undefined || value !== undefined && value.length === 0) {
				return Promise.reject(
					"Vui lòng điền thông tin!"
				);
			}
			return Promise.resolve();
		}
	})

	const validation = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

	const working_duration_rule = () => ({
		validator(rule, value) {
			const regExp = /^[0-9]{1,2}$/;
			if (value && !regExp.test(value)) {
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
			if (value && !regExp.test(value)) {
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

	const ruleEmail = [() => ({
		validator(rule, value) {
			if (value === undefined || value !== undefined && value.length === 0) {
				return Promise.reject(
					"Vui lòng nhập email!"
				);
			} else {
				const listCheck = value.split("@");
				if (
					value.includes("..") ||
					listCheck[0].startsWith(".") ||
					listCheck[0].endsWith(".") ||
					(listCheck.length > 1 &&
						listCheck[1].startsWith(".")) ||
					(listCheck.length > 1 &&
						listCheck[1].endsWith("."))
				) {
					return Promise.reject(
						"Email không đúng định dạng!"
					);
				}
				if (value.length > 255) {
					return Promise.reject(
						"Email vượt quá 255 ký tự!"
					);
				}
				if (validation.test(value)) {
					return Promise.resolve();
				} else {
					return Promise.reject(
						"Email không đúng định dạng!"
					);
				}
			}
		}
	}),
	]

	const disabledDate = (currentDate) => {
		const currentTimes = currentDate?.valueOf();
		const nowTimes = moment().endOf("day").valueOf();
		return currentTimes >= nowTimes;
	}

	
	const handleChangeAddress = (e, type) => {
		if (type === 'permanent_city' || type === 'permanent_district' || type === 'installation_city' || type === 'installation_district'
			|| type === 'contact_city' || type === 'contact_district') {
			if(type === 'permanent_city') {
				setInfo({
					...info,
					[type]: e,
					permanent_district: null,
				});
			} else if(type === 'installation_city') {
				setInfo({
					...info,
					[type]: e,
					installation_district: null,
				});
			} else if(type === 'contact_city') {
				setInfo({
					...info,
					[type]: e,
					contact_district: null,
				});
			} else {
				setInfo({
					...info,
					[type]: e,
				});
			}
		} else {
			setInfo({
				...info,
				[type]: e.target.value,
			})
		}
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

	const renderEmployeeEVN = () => {
		if (info.career_type) {
			return (
				<>
					<Row >
						<Col span={12} className="col-left">
							<Form.Item label="Đơn vị" name="department" required rules={[_rule]}>
								<Input className="text-input-left" defaultValue={info.working_information.department} value={info.working_information.department} onChange={(e) => { handleInputOtherInfo(e, 'department') }} />
							</Form.Item>
						</Col>
						<Col span={12} className="col-right">
							<Form.Item label="Vị trí công tác" name="position" required rules={[_rule]} required>
								<Input className="text-input-left" defaultValue={info.working_information.position} value={info.working_information.position} onChange={(e) => { handleInputOtherInfo(e, 'position') }} />
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={12} className="col-left">
							<Form.Item label="Mã nhân viên" name="employee_code" required rules={[_rule]} required>
								<Input className="text-input-left" defaultValue={info.working_information.employee_code} value={info.working_information.employee_code} onChange={(e) => { handleInputOtherInfo(e, 'employee_code') }} />
							</Form.Item>
						</Col>
						<Col span={12} className="col-right">
							<Form.Item label="Mã hợp đồng" name="contract_code" rules={[_rule]} required>
								<Input className="text-input-left" defaultValue={info.working_information.contract_code} value={info.working_information.contract_code} onChange={(e) => { handleInputOtherInfo(e, 'contract_code') }} />
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
								<Input className="text-input-left" defaultValue={info.working_information.employee_code} value={info.working_information.employee_code} onChange={(e) => { handleInputOtherInfo(e, 'employee_code') }} />
							</Form.Item>
						</Col>
						<Col span={12} className="col-right">
							<Form.Item label="Vị trí công tác" name="position" required rules={[_rule]} required>
								<Input className="text-input-left" defaultValue={info.working_information.position} value={info.working_information.position} onChange={(e) => { handleInputOtherInfo(e, 'position') }} />
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={12} className="col-left">
							<Form.Item label="Số năm công tác" name="working_duration" required rules={[_rule, working_duration_rule]} required>
								<Input className="text-input-left" value={info.working_information.working_duration} onChange={(e) => { handleInputOtherInfo(e, 'working_duration') }} />
							</Form.Item>
						</Col>
						<Col span={12} className="col-right">
							<Form.Item label="Thu nhập" name="income" rules={[_rule, income_rule]} required normalize={e => formatNumber(e)}>
								<Input className="text-input-left" value={info.working_information.income} onChange={(e) => { handleInputOtherInfo(e, 'income') }} />
							</Form.Item>
						</Col>
					</Row>
				</>
			)
		}
	}


	const handleChangePayment = (value) => {
		if (value) {
			setPayment("")
			setInfo({
				...info,
				working_information: {
					...info.working_information,
					pay_forms: value
				}
			})
		} else {
			setPayment("Vui lòng chọn hình thức trả lương")
		}
	}

	const handleChangeIncome = (e) => {
		if (e.floatValue) {
			setIncome("")
			setInfo({
				...info,
				working_information: {
					...info.working_information,
					income: e.floatValue
				}
			})
		}
	}

	const handleChangeOtherIncome = (e) => {
		if (e.value) {
			// setOtherIncome("")
			setInfo({
				...info,
				working_information: {
					...info.working_information,
					other_income: e.value,
				}
			})
		}
	}

	const handleChangeDescIncome = (e) => {
		if (e.target.value) {
			// setOtherIncomeDesc("")
			setInfo({
				...info,
				working_information: {
					...info.working_information,
					other_income_desc: e.target.value,
				}
			})
		} else {
			// setOtherIncomeDesc("Vui lòng nhập mô tả thu nhập khác!")
		}
	}
	const changeWorkingAddress = (e) => {
		if (e.target.value) {
			// setErrorWorkingAddress("");
			setInfo({
				...info,
				working_information: {
					...info.working_information,
					working_address: e.target.value,
				}
			})
		}
	}

	const changeComapnyName = (e) => {
		if (e.target.value) {
			// setErrorCompanyName("");
			setInfo({
				...info,
				working_information: {
					...info.working_information,
					company_name: e.target.value,
				}
			})
		}
	}

	const changeContractType = (e) => {
		if ((e === 0 || e === 1)) {
			// setErrorContractType("");
			// setContractType(e)
			setInfo({
				...info,
				working_information: {
					...info.working_information,
					contract_type: e
				}
			})
		}
	}


	return (
		<>
			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<div className="info-title">Thông tin cá nhân</div>
				<div style={{ textAlign: 'right', color: '#B42E2E' }}> *Thông tin bắt buộc</div>
			</div>
			<Row>
				<Col span={12} className="col-left">
					<Form.Item label="Tên khách hàng theo CMND/CCCD (có dấu)"
						className="require-style"
						name="p_name"
						rules={[
							() => ({
								validator(rule, value) {
									if (!value) return Promise.reject("Vui lòng nhập Tên khách hàng!");
									if (value && value.trim() === '') return Promise.reject("Vui lòng nhập Tên khách hàng!");
									const regExp = /\`|\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\+|\=|\[|\{|\]|\}|\||\\|\'|\<|\,|\.|\>|\?|\/|\""|\;|\:|\_|\d/;
									if (regExp.test(value)) return Promise.reject("Tên khách hàng sai định dạng")
									if (value.length > 255) return Promise.reject("Tên khách hàng không được lớn hơn 255 ký tự");
									return Promise.resolve();
								}
							})
						]}>
						<Input className="text-input-left" defaultValue={userInfo?.personal_information?.name} value={userInfo?.personal_information?.name} onChange={(e) => { handleInputPersonalInfo(e, 'name') }} />
					</Form.Item>
				</Col>
				<Col span={12} className="col-right">
					<Form.Item label="Ngày sinh"
						name="birthday"
						rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}>
						<DatePicker placeholder="Chọn ngày" format={dateFormat} onChange={handleSelectBirthday}
							disabledDate={disabledDate} value={info.personal_information.birthday ? moment(info.personal_information.birthday, dateFormat) : null} />
					</Form.Item>
				</Col>
			</Row>
			<Row >
				<Col span={12} className="col-left">
					<Form.Item label="Số CMND/CCCD/Hộ chiếu"
						className="require-style"
						name="card_number"
						rules={[
							() => ({
								validator(rule, value) {
									if (!value) return Promise.reject("Vui lòng nhập Số CMND/CCCD/Hộ chiếu!");
									if (value && value.trim() === '') return Promise.reject("Vui lòng nhập Số CMND/CCCD/Hộ chiếu!");
									const regExp = /^[A-Za-z0-9]*$/;
									const char = /^[A-Za-z]*$/;
									const int = /^[0-9]*$/;
									// if (!regExp.test(value)) return Promise.reject("Số CMND/CCCD/Hộ chiếu sai định dạng");
									if (!char.test(value.charAt(0))) {
										if (!int.test(value)) return Promise.reject("Số CMND/CCCD/Hộ chiếu sai định dạng");
									} else {
										if (!int.test(value.substring(1))) {
											if (!int.test(value)) return Promise.reject("Số CMND/CCCD/Hộ chiếu sai định dạng");
										}
									}
									if (value.length > 12) return Promise.reject("Số CMND/CCCD/Hộ chiếu không được lớn hơn 12 ký tự");
									return Promise.resolve();
								}
							})
						]}>
						<Input className="text-input-left" disabled defaultValue={userInfo?.personal_information?.card_number} value={userInfo?.personal_information?.card_number} onChange={(e) => { handleInputPersonalInfo(e, 'card_number') }} />
					</Form.Item>
				</Col>
				<Col span={12} className="col-right">
					<Form.Item label="Ngày cấp"
						name="id_card_issued_date"
						rules={[{ required: true, message: 'Vui lòng chọn ngày cấp CMND/CCCD/Hộ chiếu' }]}>
						<DatePicker placeholder="Chọn ngày" format={dateFormat} onChange={handleSelectDateRange}
							disabledDate={disabledDate} value={info.personal_information.id_card_issued_date ? moment(info.personal_information.id_card_issued_date, dateFormat) : null} />
					</Form.Item>
				</Col>

			</Row>

			<Row>
				<Col span={12} className="col-left">
					<Form.Item label="Nơi cấp"
						name="issued_by"
						rules={[{ required: true, message: 'Vui lòng chọn nơi cấp CMND/CCCD/Hộ chiếu' }]}>
						<Input className="text-input-left" defaultValue={info.personal_information.issued_by}
							value={info.personal_information.issued_by} onChange={(e) => { handleInputPersonalInfo(e, 'issued_by') }} />
					</Form.Item>
				</Col>
				<Col span={12} className="col-right">
					<Form.Item label="Hộ chiếu"
						name="passport"
					>
						<Input className="text-input-left" defaultValue={info.personal_information.passport}
							value={info.personal_information.passport} onChange={(e) => { handleInputPersonalInfo(e, 'passport') }} />
					</Form.Item>
				</Col>
			</Row>
			<Row>
				<Col span={12} className="col-left">
					<Form.Item label="Ngày hết hạn"
						name="expiration_date"
					>
						<DatePicker placeholder="Chọn ngày" format={dateFormat} onChange={handleSelectDate}
							value={info.personal_information.expiration_date ? moment(info.personal_information.expiration_date, dateFormat) : null} />
					</Form.Item>
				</Col>
				<Col span={12} className="col-right">
					<Form.Item label="Tình trạng hôn nhân"
						name="marital_status"
						rules={[{ required: true, message: 'Vui lòng chọn tình trạng hôn nhân' }]}>
						{/* <Input className="text-input-left" defaultValue={info.personal_information.marital_status} 
					value={info.personal_information.marital_status} onChange={(e)=> {handleInputPersonalInfo(e, 'marital_status')}}/> */}
						<Select style={{ width: '100%' }} onChange={(value) => { handleChangePayForm(value) }} placeholder='Chọn tình trạng hôn nhân'>
							{
								marital?.map((item) => {
									return (
										<Option value={item.value}>{item.name}</Option>
									)
								})
							}
						</Select>
					</Form.Item>
				</Col>
			</Row>
			<Row>
				<Col span={12} className="col-left">
					<Form.Item className="require-style" label="Email" name="p_email" rules={ruleEmail}>
						<Input className="text-input-left"  disabled defaultValue={userInfo?.user?.email}  value={userInfo?.user?.email} onChange={(e) => { handleInputPersonalInfo(e, 'email') }} />
					</Form.Item>
				</Col>
				<Col span={12} className="col-right">
					<Form.Item label="Số điện thoại"
						className="require-style"
						name="phone_number"
						rules={[
							() => ({
								validator(rule, value) {
									if (!value) return Promise.reject("Vui lòng nhập Số điện thoại!");
									if (value && value.trim() === '') return Promise.reject("Vui lòng nhập Số điện thoại!");
									const regExp = /^[0-9]*$/;
									// if (!regExp.test(value.replace('+', ''))) return Promise.reject("Số điện thoại không đúng định dạng");
									if (value.startsWith('0') && value.length !== 10) return Promise.reject("Số điện thoại không đúng định dạng");
									if (value.startsWith('84') && value.length !== 11) return Promise.reject("Số điện thoại không đúng định dạng");
									if (!(value.startsWith('0') || value.startsWith('84'))) return Promise.reject("Số điện thoại không đúng định dạng");
									const phoneHeader = ['86', '96', '97', '98', '32', '33', '34', '35', '36', '37', '38', '39', '88', '91', '94', '93', '84', '85', '81', '82',
										'89', '90', '93', '70', '79', '77', '76', '78', '92', '56', '58', '99', '59']
									if (value.startsWith('0') && !phoneHeader.includes(value.substring(1, 3))
										|| value.startsWith('84') && !phoneHeader.includes(value.substring(2, 4))) {
										return Promise.reject("Số điện thoại không tồn tại");
									}
									return Promise.resolve();
								}
							})
						]}>
						<Input className="text-input-left" disabled defaultValue={userInfo?.user?.phone_number} value={userInfo?.user?.phone_number} onChange={(e) => { handleInputPersonalInfo(e, 'phone_number') }} />
					</Form.Item>
				</Col>
			</Row>
			<Row>
				<Col span={12} className="col-left">
					<Form.Item className="require-style" label="Địa chỉ liên lạc" name="contact_address"
						rules={[() => ({
							validator(rule, value) {
								if (!value) return Promise.reject("Vui lòng nhập Địa chỉ liên lạc!");
								if (value.length > 255) return Promise.reject("Địa chỉ liên lạc không được lớn hơn 255 ký tự");
								return Promise.resolve();
							}
						})
						]}
					>
						<Input disabled={isCheckContact} className="text-input-left" value={info.contact_address} onChange={(e) => { handleChangeAddress(e, 'contact_address') }} />
					</Form.Item>
				</Col>
				<Col span={12} className="col-right">
					<Form.Item className="require-style" label="Giới tính" name="gender"
					// rules={[{required: true, message: 'Vui lòng chọn giới tính'}]}
					>
						<div className="l-list-button">
							<Button type="primary" className={`${info.personal_information.gender === GENDERS.M ? 'active' : ''}`} shape="round" size="default" onClick={() => { changeGender(GENDERS.M) }}>Nam</Button>
							<Button type="primary" className={`${info.personal_information.gender === GENDERS.F ? 'active' : ''}`} shape="round" size="default" onClick={() => { changeGender(GENDERS.F) }}>Nữ</Button>
						</div>
					</Form.Item>
				</Col>
			</Row>
			<Row>
				<Col span={12} className="col-left">
					<Form.Item className="require-style" label="Thành phố" name="contact_city"
						rules={[() => ({
							validator(rule, value) {
								if (!value) return Promise.reject("Vui lòng chọn thành phố!");
								return Promise.resolve();
							}
						})
						]}
					>
						<Select disabled={isCheckContact} className="text-input-left"
						//  value={info.contact_city ? info.contact_city : null}
						defaultValue={info.contact_city ? info.contact_city : null}
						value={info.contact_city ? info.contact_city : null} 
						  onChange={(e) => {
							
							// let a = city?.filter(_ => _.id === e);
							// handleChangeAddress(e,'contact_city', a[0].item_code);
							// getDistric(e);

							handleChangeAddress(e, 'contact_city')
							getDistric(e)
						}}>
							{city?.map((item) => (
								<Select.Option value={item.id}>{item?.item_name}</Select.Option>
							))}
						</Select>
					</Form.Item>
				</Col>
				<Col span={12} className="col-right">
					<Form.Item className="require-style" label="Quận/Huyện" name="contact_district"
						rules={[() => ({
							validator(rule, value) {
								if (!value) return Promise.reject("Vui lòng chọn quận/huyện");
								return Promise.resolve();
							}
						})
						]}>
						<Select disabled={isCheckContact} className="text-input-left" value={info.contact_district ? info.contact_district : null} onChange={(e) => { handleChangeAddress(e, 'contact_district') }}>
							{distric?.map((item) => (
								<Select.Option value={item.item_code}>{item?.item_name}</Select.Option>
							))}
						</Select>
					</Form.Item>
				</Col>
			</Row>
			<Row>
				<Col span={12} className="col-left">
					<Form.Item className="require-style" label="Địa chỉ thường trú" name="permanent_address"
						rules={[() => ({
							validator(rule, value) {
								if (!value) return Promise.reject("Vui lòng nhập Địa chỉ thường trú!");
								if (value.length > 255) return Promise.reject("Địa chỉ thường trú không được lớn hơn 255 ký tự");
								return Promise.resolve();
							}
						})
						]}
					>
						<Input disabled={isCheckPermanent} className="text-input-left" value={info.permanent_address} onChange={(e) => { handleChangeAddress(e, 'permanent_address') }} />
					</Form.Item>
				</Col>
			</Row>
			<Row>
				<Col span={12} className="col-left">
					<Form.Item className="require-style" label="Thành phố" name="permanent_city"
						rules={[() => ({
							validator(rule, value) {
								if (!value) return Promise.reject("Vui lòng chọn thành phố!");
								return Promise.resolve();
							}
						})
						]}
					>
						<Select disabled={isCheckPermanent} className="text-input-left" 
						defaultValue={info.permanent_city}
						 value={info.permanent_city} 
						 onChange={(e) => {
							handleChangeAddress(e, 'permanent_city')
							getDistric(e)
						}}>
							{city?.map((item) => (
								<Select.Option value={item.id}>{item?.item_name}</Select.Option>
							))}
						</Select>
					</Form.Item>
				</Col>
				<Col span={12} className="col-right">
					<Form.Item className="require-style" label="Quận/Huyện" name="permanent_district"
						rules={[() => ({
							validator(rule, value) {
								if (!value) return Promise.reject("Vui lòng chọn quận/huyện");
								return Promise.resolve();
							}
						})
						]}>
						<Select disabled={isCheckPermanent} className="text-input-left" defaultValue={info.permanent_district} value={info.permanent_district} onChange={(e) => { handleChangeAddress(e, 'permanent_district') }}>
							{distric?.map((item) => (
								<Select.Option value={item.item_code}>{item?.item_name}</Select.Option>
							))}
						</Select>
					</Form.Item>
				</Col>
			</Row>
			<Row>
				<Col span={12} className="col-left">
					<Form.Item className="require-style" label="Địa chỉ lắp đặt điện mặt trời" name="installation_address"
						rules={[() => ({
							validator(rule, value) {
								if (!value) return Promise.reject("Vui lòng nhập Địa chỉ lắp đặt điện mặt trời!");
								if (value.length > 255) return Promise.reject("Địa chỉ lắp đặt điện mặt trời không được lớn hơn 255 ký tự");
								return Promise.resolve();
							}
						})
						]}			>
						<Input disabled className="text-input-left" value={info.installation_address} onChange={(e) => { handleChangeAddress(e, 'install') }} />
					</Form.Item>
				</Col>
			</Row>
			<Row>
				<Col span={12} className="col-left">
					<Form.Item className="require-style" label="Thành phố" name="installation_city"
						rules={[() => ({
							validator(rule, value) {
								if (!value) return Promise.reject("Vui lòng chọn thành phố!");
								return Promise.resolve();
							}
						})
						]}
					>
						<Select disabled className="text-input-left"
							defaultValue={info?.installation_city ? info?.installation_city : null} 
							value={info?.installation_city ? info?.installation_city : null} 
							onChange={(e) => {
								handleChangeAddress(e, 'installation_city')
								getDistric(e)
							}}>
							{city?.map((item) => (
								<Select.Option value={item.id}>{item?.item_name}</Select.Option>
							))}
						</Select>
					</Form.Item>
				</Col>
				<Col span={12} className="col-right">
					<Form.Item className="require-style" label="Quận/Huyện" name="installation_district"
						rules={[() => ({
							validator(rule, value) {
								if (!value) return Promise.reject("Vui lòng chọn quận/huyện");
								return Promise.resolve();
							}
						})
						]}>
						<Select disabled className="text-input-left" 
						defaultValue={info.installation_district ? info.installation_district : null} 
						value={info.installation_district ? info.installation_district : null} onChange={(e) => { handleChangeAddress(e, 'installation_district') }}>
							{distric?.map((item) => (
								<Select.Option value={item.item_code}>{item?.item_name}</Select.Option>
							))}
						</Select>
					</Form.Item>
				</Col>
			</Row>
			{/* {renderEmployeeEVN()} */}
			<Row>
				<Col span={12} className="l-row-left">
					<span style={{ color: '#B42E2E', marginRight: 5 }}>* </span> Mức lương
					</Col>
				<Col span={12} className="col-right">
					<span style={{ color: '#B42E2E', marginRight: 5,marginLeft:15 }}>* </span> Hình thức nhận lương
					</Col>
			</Row>
			{/* <Input defaultValue={loanDetail?.pay_forms || null} className="text-input-left" onChange={handleChangePayForm} /> */}
			{/* <Input defaultValue={loanDetail?.income || null} className="text-input-left" onChange={handleChangeIncome} /> */}
			<Row className="l-b-margin-20">
				<Col span={12} className="col-left">
					<Form.Item
						name="amount"
						rules={[{ required: true, message: 'Vui lòng nhập mức lương!' }]}
					>
						<NumberFormat
							customInput={Input}
							thousandSeparator={true}
							onValueChange={(_) => handleChangeIncome(_)}
							className="text-input-left"
							defaultValue={loanDetail?.income || null}
						/>
					</Form.Item>
					{errorIncome ? <span style={{ color: '#B42E2E' }}>{errorIncome}</span> : null}
				</Col>
				<Col span={12} className="col-right">
					<Form.Item
						name="payment"
						rules={[{ required: true, message: 'Vui lòng chọn hình thức nhận lương' }]}
					>
						<Select style={{ width: '100%' }} className="text-input-left" onChange={handleChangePayment} placeholder="Chọn hình thức nhận lương">
							{
								payForms?.map((item) => {
									return (
										<Option value={item.value} >{item.name}</Option>
									)
								})
							}
						</Select>
					</Form.Item>
					{/* {errorPayForm ? <span style={{ color: '#B42E2E' }}>{errorPayForm}</span> : null} */}
					{errorPayment ? <span style={{ color: '#B42E2E' }}>{errorPayment}</span> : null}
				</Col>
			</Row>
			<Row>
				<Col span={12} className="l-row-left ">
				<span style={{ color: '#B42E2E', marginRight: 5 }}></span> Thu nhập khác
				
					</Col>
				<Col span={12} className="l-row-right ">
					<span style={{ color: '#B42E2E', marginRight: 5,marginLeft:15 }}></span>Mô tả thu nhập khác
					</Col>
			</Row>
			<Row className="l-b-margin-20">
				<Col span={12} className="col-left">
					{/* <Input defaultValue={loanDetail?.other_income || null} className="text-input-left" onChange={handleChangeOtherIncome} /> */}
					<Form.Item
						name="amounts"
						
					>
						<NumberFormat
							customInput={Input}
							thousandSeparator={true}
							onValueChange={(_) => handleChangeOtherIncome(_)}
							className="text-input-left"
							defaultValue={loanDetail?.other_income || null}
						/>
					</Form.Item>
					
				
				</Col>
				<Col span={12} className="col-right">
					<Form.Item
					name="other_income_desc"
					>
					<Input defaultValue={loanDetail?.other_income_desc || null} className="text-input-left" onChange={handleChangeDescIncome} />
					</Form.Item>
					
				</Col>
			</Row>
			<Row>
				<Col span={12} className="l-row-left ">
					<span style={{ color: '#B42E2E', marginRight: 5}}>* </span> Nơi làm việc
					</Col>
				<Col span={12} className="l-row-right ">
					<span style={{ color: '#B42E2E', marginRight: 5,marginLeft:15 }}>* </span> Địa chỉ làm việc
					</Col>
			</Row>
			<Row className="l-b-margin-20">
				<Col span={12} className="col-left">
					<Form.Item
						name="working_address"
						rules={[{ required: true, message: 'Vui lòng điền nơi làm việc !' }]}
					>


						<Input defaultValue={loanDetail?.working_address || null} className="text-input-left" onChange={changeWorkingAddress} />
					</Form.Item>
					{/* {errorWorkingAddress ? <span style={{ color: '#B42E2E' }}>{errorWorkingAddress}</span> : null} */}
				</Col>
				<Col span={12} className="col-right">

					<Form.Item
						name="company_name"
						rules={[{ required: true, message: 'Vui lòng điền địa chỉ làm việc !' }]}
					>
						<Input defaultValue={loanDetail?.company_name || null} className="text-input-left" onChange={changeComapnyName} />
					</Form.Item>
					{/* {errorCompanyName ? <span style={{ color: '#B42E2E' }}>{errorCompanyName}</span> : null} */}

				</Col>
			</Row>
			<Row>
				<Col span={12} className="l-row-left ">
					<span style={{ color: '#B42E2E', marginRight: 5 }}>* </span> Loại hợp đồng
					</Col>
			</Row>
			<Row className="l-b-margin-20">
				<Col span={12} className="col-left">
					<Form.Item
						name="contractype"
						rules={[{ required: true, message: 'Vui lòng chọn loại hợp đồng !' }]}
					>
						<Select style={{ width: '100%' }} required className="text-input-left" placeholder='Chọn loại hợp đồng' bordered={true} onChange={(e) => { changeContractType(e) }}>
							<Select.Option value={0}>Ngắn hạn</Select.Option>
							<Select.Option value={1}>Dài hạn</Select.Option>
						</Select>
					</Form.Item>
					{/* {errorContractType ? <span style={{ color: '#B42E2E' }}>{errorContractType}</span> : null} */}
				</Col>
			</Row>
			{/* {errorOtherIncomeDesc ? <span style={{ color: '#B42E2E' }}>{errorOtherIncomeDesc}</span> : null} */}
			{/* {errorOtherIncome ? <span style={{ color: '#B42E2E' }}>{errorOtherIncome}</span> : null} */}
			{/* {errorOtherIncomeDesc ? <span style={{ color: '#B42E2E' }}>{errorOtherIncomeDesc}</span> : null} */}
			{/* {errorOtherIncome ? <span style={{ color: '#B42E2E' }}>{errorOtherIncome}</span> : null} */}
			<div className="info-title">Thông tin người thân</div>
			<RelativePerson loanDetail={loanDetail} staticData={staticData} info={info} setInfo={setInfo} form={form} />

			{/* <b>Địa chỉ liên lạc</b>
	<Address isDuplicateAddress={isDuplicateAddress} loanDetail={loanDetail} provinces={provinces} info={info} type='contact_address' setInfo={setInfo} getDistricts={getDistricts} districts={districts} communes={communes} getCommune={getCommune} form={form}/>
	<b>Địa chỉ thường trú</b>
	<Row><Checkbox checked={isDuplicateAddress} onClick={fnDuplicateAddress}>Trùng địa chỉ liên lạc</Checkbox></Row>
	<Address isDuplicateAddress={isDuplicateAddress} loanDetail={loanDetail} disabled={isDuplicateAddress} provinces={provinces} info={info} setInfo={setInfo} type='permanent_address' getDistricts={getDistricts} districts={districts} communes={communes} getCommune={getCommune} form={form}/> */}
		</>
	)
}


const mapStateToProps = (state) => ({
	loanDetail: state.loan.loanDetail,
})
export default connect(mapStateToProps, null)(PersonalInfo);