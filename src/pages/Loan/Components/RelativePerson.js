import { Col, Row, Form, Select, Input, Button, DatePicker } from "antd";
import React, { useEffect } from "react";
import { PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment'
import { NotificationError } from "../../../common/components/Notification";

const RelativePerson = (props) => {
	const { loanDetail, staticData, info, setInfo, form } = props;
	const dateFormat = 'YYYY-MM-DD';
	// console.log("loan",loanDetail);

	const relationship = (staticData?.relative_person_relations?.length > 0 && staticData?.relative_person_relations[0].id !== 0) ? staticData?.relative_person_relations?.unshift({
		id: 0,
		name: 'Chọn quan hệ',
		code: 'NONE'
	}) : staticData?.relative_person_relations;

	const handelSelectReleativePersons = (index, value) => {
		let relative_persons = info.relative_persons;
		if (!info.relative_persons[index].relation) {
			relative_persons[index] = {
				...info.relative_persons[index],
				relation: value,
			}
		} else {
			form.setFieldsValue({
				[`releative_phone_${index}`]: '',
				[`releative_name_${index}`]: '',
				[`card_number_${index}`]: '',
				[`birthday_${index}`]: "",
				[`address_${index}`]: '',
				[`permanent_address_${index}`]: '',
				[`id_card_issued_date_${index}`]: "",
				[`email_${index}`]: '',
			})
			relative_persons[index] = {
				...info.relative_persons[index],
				relation: value,
				"name": "",
				"phone_number": "",
				"card_number": "",
				"permanent_address": "",
				"birthday": "",
				"id_card_issued_date": "",
				"email": "",
				"address": ""
			}
		}

		setInfo({
			...info,
			relative_persons: relative_persons,
		})
	}

	const handleInputRelativeInfo = (e, type, index) => {
		// console.log('e => ', e)
		let relative_persons = info.relative_persons;
		if (type === "birthday" || type === "id_card_issued_date") {
			relative_persons[index] = {
				...info.relative_persons[index],
				[type]: moment(e).format('YYYY-MM-DD')
			}
		} else {
			relative_persons[index] = {
				...info.relative_persons[index],
				[type]: e.target.value
			}
		}

		setInfo({
			...info,
			relative_persons: relative_persons
		})
	}

	const addRelativePersion = () => {
		if (info.relative_persons?.length === 5) return;
		if (!info.relative_persons[info.relative_persons?.length - 1]?.relation &&
			!info.relative_persons[info.relative_persons?.length - 1]?.name &&
			!info.relative_persons[info.relative_persons?.length - 1]?.phone_number) {
			return NotificationError("", "Vui lòng nhập đầy đủ thông tin người thân!")
		}
		if (info.relative_persons[info.relative_persons?.length - 1]?.relation === 2) {
			form.validateFields([`releative_phone_${info.relative_persons?.length - 1}`,
			`releative_name_${info.relative_persons?.length - 1}`,
			`card_number_${info.relative_persons?.length - 1}`,
			`permanent_address_${info.relative_persons?.length - 1}`,
			`birthday_${info.relative_persons?.length - 1}`,
			`id_card_issued_date_${info.relative_persons?.length - 1}`,
			`address_${info.relative_persons?.length - 1}`,
			`email_${info.relative_persons?.length - 1}`
			]).then(value => {
				let relative_person = info.relative_persons;
				relative_person.push({
					"name": "",
					"phone_number": "",
					"relation": null,
					"card_number": "",
					"permanent_address": "",
					"birthday": "",
					"id_card_issued_date": "",
					"email": "",
					"address": ""
				})
				setInfo({
					...info,
					relative_persons: relative_person
				})
				relative_person?.map((item, index) => {
					form.setFieldsValue({
						[`releative_persion_relations_${index}`]: item.relation,
						[`releative_phone_${index}`]: item.phone_number,
						[`releative_name_${index}`]: item.name,
						[`card_number_${index}`]: item.card_number,
						[`birthday_${index}`]: item?.birthday ? moment(item.birthday, dateFormat) : "",
						[`address_${index}`]: item?.address,
						[`permanent_address_${index}`]: item?.permanent_address,
						[`id_card_issued_date_${index}`]: item?.id_card_issued_date ? moment(item.id_card_issued_date, dateFormat) : "",
						[`email_${index}`]: item?.email,
					})
				})
			}).catch(err => {
				NotificationError("", "Vui lòng nhập đầy đủ thông tin người thân!")
			})
		} else {
			form.validateFields([`releative_phone_${info.relative_persons?.length - 1}`,
			`releative_name_${info.relative_persons?.length - 1}`]).then(value => {
				let relative_person = info.relative_persons;
				relative_person.push({
					"name": "",
					"phone_number": "",
					"relation": null,
					"card_number": "",
					"permanent_address": "",
					"birthday": "",
					"id_card_issued_date": "",
					"email": "",
					"address": ""
				})
				setInfo({
					...info,
					relative_persons: relative_person
				})
				relative_person?.map((item, index) => {
					form.setFieldsValue({
						[`releative_persion_relations_${index}`]: item.relation,
						[`releative_phone_${index}`]: item.phone_number,
						[`releative_name_${index}`]: item.name,
						[`card_number_${index}`]: item.card_number,
						[`birthday_${index}`]: item?.birthday ? moment(item.birthday, dateFormat) : "",
						[`address_${index}`]: item?.address,
						[`permanent_address_${index}`]: item?.permanent_address,
						[`id_card_issued_date_${index}`]: item?.id_card_issued_date ? moment(item.id_card_issued_date, dateFormat) : "",
						[`email_${index}`]: item?.email,
					})
				})
			}).catch(err => {
				NotificationError("", "Vui lòng nhập đầy đủ thông tin người thân!")
			})
		}

	}

	useEffect(() => {
		if (loanDetail.id) {
			let relative_person = loanDetail?.relative_persons?.length > 0 ? loanDetail?.relative_persons : (info.relative_persons?.length > 0 ? info.relative_persons : {
				"name": "",
				"phone_number": "",
				"relation": 0,
				"card_number": "",
				"birthday": "",
				"id_card_issued_date": "",
				"address": "",
				"permanent_address": "",
				"email": "",
			});
			setInfo({ ...info, relative_persons: relative_person })
			relative_person?.map((item, index) => {
				form.setFieldsValue({
					[`releative_persion_relations_${index}`]: item.relation,
					[`releative_phone_${index}`]: item.phone_number,
					[`releative_name_${index}`]: item.name,
					[`card_number_${index}`]: item.card_number,
					[`birthday_${index}`]: item?.birthday ? moment(item.birthday, dateFormat) : "",
					[`address_${index}`]: item?.address,
					[`permanent_address_${index}`]: item?.permanent_address,
					[`id_card_issued_date_${index}`]: item?.id_card_issued_date ? moment(item.id_card_issued_date, dateFormat) : "",
					[`email_${index}`]: item?.email,
				})
			})
		}
	}, [loanDetail])

	const handleDeleteRelatedPerson = (index) => {
		if (info.relative_persons?.length > 1) {
			let relative_person = info.relative_persons.filter((item, i) => index !== i);
			setInfo({ ...info, relative_persons: relative_person })
			relative_person?.map((item, index) => {
				form.setFieldsValue({
					[`releative_persion_relations_${index}`]: item.relation,
					[`releative_phone_${index}`]: item.phone_number,
					[`releative_name_${index}`]: item.name,
					[`card_number_${index}`]: item.card_number,
					[`birthday_${index}`]: item?.birthday ? moment(item.birthday, dateFormat) : null,
					[`address_${index}`]: item?.address || null,
					[`permanent_address_${index}`]: item?.permanent_address || null,
					[`id_card_issued_date_${index}`]: item?.id_card_issued_date ? moment(item.id_card_issued_date, dateFormat) : null,
					[`email_${index}`]: item?.email || null,

				})
			})
		} else {
			let emptyRelative = {
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
			setInfo({ ...info, relative_persons: [emptyRelative] })
			form.setFieldsValue({
				[`releative_persion_relations_${index}`]: null,
				[`releative_phone_${index}`]: '',
				[`releative_name_${index}`]: '',
				[`card_number_${index}`]: '',
				[`birthday_${index}`]: "",
				[`address_${index}`]: '',
				[`permanent_address_${index}`]: '',
				[`id_card_issued_date_${index}`]: "",
				[`email_${index}`]: '',
			})
		}
	}
	return (
		<div>
			{info?.relative_persons?.map((item, index) => {
				return (
					<div key={index}>
						<Row className="related-person">
							<Col span={23}>
								<Row className="related-person">
									<Col span={6}>
										<Form.Item label={`Người thân ${index + 1}`}
											rules={[{ required: true, message: 'Vui lòng chọn người thân!' }]}
											name={`releative_persion_relations_${index}`}>
											<Select defaultValue={item.value} value={item.relation} onChange={(value) => { handelSelectReleativePersons(index, value) }}>
												{relationship && relationship?.length > 0 && relationship?.map((i) => {
													return (
														<Select.Option key={i.id} value={i.id}>{i.name}</Select.Option>
													)
												})}
											</Select>
										</Form.Item>
									</Col>
									<Col span={6}>
										<Form.Item label="Số điện thoại" name={`releative_phone_${index}`}
											className={item.relation ? "required-field" : ''}
											rules={[
												() => ({
													validator(rule, value) {
														if (!value && item.relation) return Promise.reject("Vui lòng nhập Số điện thoại!")
														if (!value && !item.relation) return Promise.resolve();
														if (value && value.trim() === '') return Promise.reject("Vui lòng nhập Số điện thoại!");
														const regExp = /^[0-9]*$/;
														// if (!regExp.test(value.replace('+', ''))) return Promise.reject("Số điện thoại không đúng định dạng");
														if (value.startsWith('0') && value?.length !== 10) return Promise.reject("Số điện thoại không đúng định dạng");
														if (value.startsWith('84') && value?.length !== 11) return Promise.reject("Số điện thoại không đúng định dạng");
														if (!(value.startsWith('0') || value.startsWith('84'))) return Promise.reject("Số điện thoại không đúng định dạng");
														const phoneHeader = ['86', '96', '97', '98', '32', '33', '34', '35', '36', '37', '38', '39', '88', '91', '94', '93', '84', '85', '81', '82',
															'83', '89', '90', '93', '70', '79', '77', '76', '78', '92', '56', '58', '99', '59']
														if (value.startsWith('0') && !phoneHeader.includes(value.substring(1, 3))
															|| value.startsWith('84') && !phoneHeader.includes(value.substring(2, 4))) {
															return Promise.reject("Số điện thoại không tồn tại");
														}
														return Promise.resolve();
													}
												})
											]}
										>
											<Input className="text-input-left" value={item.phone_number} onChange={(e) => { handleInputRelativeInfo(e, 'phone_number', index) }} />
										</Form.Item>
									</Col>
									<Col span={6}>
										<Form.Item label="Tên người thân" name={`releative_name_${index}`}
											className={item.relation ? "required-field" : ''}
											rules={[
												() => ({
													validator(rule, value) {
														// if (!value) return Promise.reject("Vui lòng nhập Tên khách hàng!");
														if (!value && item.relation) return Promise.reject("Vui lòng nhập Tên người thân!")
														if (!value && !item.relation) return Promise.resolve();
														if (value && value.trim() === '') return Promise.reject("Vui lòng nhập Tên người thân!");
														const regExp = /\`|\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\+|\=|\[|\{|\]|\}|\||\\|\'|\<|\,|\.|\>|\?|\/|\""|\;|\:|\_|\d/;
														if (regExp.test(value)) return Promise.reject("Tên người thân sai định dạng")
														if (value?.length > 255) return Promise.reject("Tên người thân không được lớn hơn 255 ký tự");
														return Promise.resolve();
													}
												})
											]}
										>
											<Input className="text-input-left" value={item.name} onChange={(e) => { handleInputRelativeInfo(e, 'name', index) }} />
										</Form.Item>
									</Col>
									<Col span={6}>
										<Form.Item label="Số CMND/CCCD/Hộ chiếu" name={`card_number_${index}`}
											className={item.relation === 2 ? "required-field" : ''}
											rules={[
												() => ({
													validator(rule, value) {
														// if (!value && item.relation === 2) return Promise.reject("Vui lòng nhập Số CMND/CCCD/Hộ chiếu!")
														if (!value && item.relation) return Promise.reject("Vui lòng nhập Số CMND/CCCD/Hộ chiếu!")
														if (!value && item.relation !== 2) return Promise.resolve();
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
														if (value?.length < 8) return Promise.reject("Số CMND/CCCD/Hộ chiếu sai định dạng");
														if (value?.length > 12) return Promise.reject("Số CMND/CCCD/Hộ chiếu không được lớn hơn 12 ký tự");
														return Promise.resolve();
													}
												})
											]}
										>
											<Input className="text-input-left" value={item.name} onChange={(e) => { handleInputRelativeInfo(e, 'card_number', index) }} />
										</Form.Item>
									</Col>
									{item.relation === 2 ? <Col span={6}>
										<Form.Item
											label="Ngày sinh"
											name={`birthday_${index}`}
											rules={[{ required: true, message: 'Vui lòng nhập Ngày sinh!' }]}
										>
											<DatePicker
												// inputReadOnly
												placeholder="Chọn ngày"
												format={"DD/MM/YYYY"}
												onChange={(e) => handleInputRelativeInfo(e, "birthday", index)}
												disabledDate={(currentDate) => {
													const currentTimes = currentDate?.valueOf();
													const nowTimes = moment().endOf("day").valueOf();
													return currentTimes >= nowTimes;
												}}
											/>
										</Form.Item>
									</Col> : null}
									{item.relation === 2 ? <Col span={6}>
										<Form.Item className="required-field" label="Nơi cư trú hiện tại" name={`address_${index}`}
											rules={[
												() => ({
													validator(rule, value) {
														if (!value && item.relation) return Promise.reject("Vui lòng nhập Nơi cư trú!")
														if (!value && !item.relation) return Promise.resolve();
														if (!value) return Promise.resolve();
														if (value && value.trim() === '') return Promise.reject("Vui lòng nhập Nơi cư trú!");
														if (value?.length > 255) return Promise.reject("Nơi cư trú không được lớn hơn 255 ký tự");
														return Promise.resolve();
													}
												})
											]}
										>
											<Input className="text-input-left" value={item.name} onChange={(e) => { handleInputRelativeInfo(e, 'address', index) }} />
										</Form.Item>
									</Col> : null}
									{item.relation === 2 ? <Col span={6}>
										<Form.Item className="required-field" label="Hộ khẩu thường trú" name={`permanent_address_${index}`}
											rules={[
												() => ({
													validator(rule, value) {
														if (!value && item.relation) return Promise.reject("Vui lòng nhập Hộ khẩu thường trú!")
														if (!value && !item.relation) return Promise.resolve();// if (!value) return Promise.reject("Vui lòng nhập Tên khách hàng!");
														if (!value) return Promise.resolve();
														if (value && value.trim() === '') return Promise.reject("Vui lòng nhập Nơi cư trú!");
														if (value?.length > 255) return Promise.reject("Nơi cư trú không được lớn hơn 255 ký tự");
														return Promise.resolve();
													}
												})
											]}
										>
											<Input className="text-input-left" value={item.name} onChange={(e) => { handleInputRelativeInfo(e, 'permanent_address', index) }} />
										</Form.Item>
									</Col> : null}
									{item.relation === 2 ? <Col span={6}>
										<Form.Item label="Ngày cấp"
											name={`id_card_issued_date_${index}`}
											rules={[{ required: true, message: 'Vui lòng chọn ngày cấp CMND/CCCD/Hộ chiếu' }]}>
											<DatePicker placeholder="Chọn ngày"
												format={"DD/MM/YYYY"}
												onChange={(e) => handleInputRelativeInfo(e, "id_card_issued_date", index)}
												disabledDate={(currentDate) => {
													const currentTimes = currentDate?.valueOf();
													const nowTimes = moment().endOf("day").valueOf();
													return currentTimes >= nowTimes;
												}}
												value={info.personal_information.id_card_issued_date ? moment(info.personal_information.id_card_issued_date, dateFormat) : null} />
										</Form.Item>
									</Col> : null}
									{item.relation === 2 ? <Col span={6}>
										<Form.Item className="required-field" label="Email"
											name={`email_${index}`}
											rules={[({ getFieldValue }) => ({
												validator(rule, value) {
													const validation = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
													if (value) {
														const listCheck = value.split("@");

														if (
															value.includes("..") ||
															listCheck[0].startsWith(".") ||
															listCheck[0].endsWith(".") ||
															(listCheck?.length > 1 &&
																listCheck[1].startsWith(".")) ||
															(listCheck?.length > 1 &&
																listCheck[1].endsWith("."))
														) {
															return Promise.reject(
																"Email không đúng định dạng!"
															);
														}
														if (value?.length > 255) {
															return Promise.reject(
																"Email vượt quá 255 ký tự!"
															);
														}
														if (validation.test(value)) {
															return Promise.resolve();
														}
														return Promise.reject(
															"Email không đúng định dạng!"
														);
													} else {
														if (item.relation) {
															return Promise.reject("Vui lòng nhập Emai!");
														}
														return Promise.resolve();
													}
												},
											}),]}>
											<Input className="text-input-left" onChange={(e) => handleInputRelativeInfo(e, "email", index)} placeholder="Example@gmail.com" value={info.personal_information.email} />
										</Form.Item>
									</Col> : null}
								</Row>
							</Col>
							<Col span={1} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
								<DeleteOutlined onClick={() => handleDeleteRelatedPerson(index)} style={{ cursor: 'pointer' }} />
							</Col>
						</Row>
					</div>
				)
			})}
			{info.relative_persons?.length < 5 ? <div className="loan-btn-add-relative-persion">
				<Button type="primary" onClick={addRelativePersion}>Thêm <PlusCircleOutlined /></Button>
			</div> : null}
		</div>
	)
}
export default RelativePerson;