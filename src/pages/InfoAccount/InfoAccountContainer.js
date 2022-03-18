import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Input, DatePicker, Button, Upload, Modal } from "antd";
import { ArrowRightOutlined, DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import ImgCrop from 'antd-img-crop';
import moment from 'moment';
import { connect } from "react-redux";

import { NotificationSuccess } from '../../common/components/Notification';

import "./infoAccountContainer.scss";
import { getUserInfo, updateUserInfo, setEditUser } from '../../store/infoAccount/action';
import { EVN_TOKEN } from '../../utils/constants'
import {
	BrowserRouter as Router,
	useParams,
	useRouteMatch,
} from "react-router-dom";
function InfoAccountContainer(props) {
	const [openCancelEditModal, setCancelEditModal] = useState(false)
	const [userInfo, setUserInfo] = useState({});
	const [oldInfo, setOldInfo] = useState({});
	const [form] = Form.useForm();
	const [ava, setAva] = useState();
	const [imageType, setImageType] = useState('png');
	const disabledDate = (currentDate) => {
		const currentTimes = currentDate?.valueOf();
		const nowTimes = moment().subtract(1, 'days').endOf("day").valueOf();
		return currentTimes >= nowTimes;
	}
	const GENDERS = {
		M: 0,
		F: 1,
	}
	const dateFormat = ['YYYY-MM-DD', 'YYYY/MM/DD'];

	const dataDate = ['DD-MM-YYYY', 'DD/MM/YYYY'];
	const changeGender = (value) => {
		setUserInfo({
			...userInfo,
			// personal_information: {
			// 	...userInfo.personal_information,
			gender: value
			// }
		});
		form.setFieldsValue({ gender: value });
	}

	const handleInputPersonalInfo = (e, type) => {
		setUserInfo({
			...userInfo,
			// personal_information: {
			// 	...userInfo.personal_information,
			[type]: e.target.value
			// }
		})
	}
	const handleSelectBirthday = (e, value) => {
		const format = moment(e).format('YYYY-MM-DD');
		setUserInfo({
			...userInfo,
			// personal_information: {
			// 	...userInfo.personal_information,
			birthday: format
			// birthday: moment(value, dataDate),
			// }
		})
	}
	const layout = {
		labelCol: { span: 8 },
		wrapperCol: { span: 16 },
	};

	useEffect(() => {
		// props.getUserInfo();
		setFieldValue(props.userInfo);
		setOldInfo(props.userInfo)
	}, [])

	useEffect(() => {
		// setUserInfo(props.userInfo)
		setUserInfo({
			...props.userInfo,

		})
	}, [props.userInfo])


	let { path } = useRouteMatch();

	useEffect(() => {
		if (path !== "info-account") {
			props.setEditUser(false);
		}
	}, [path])



	// console.log("userInfo", userInfo);

	const setFieldValue = (data) => {
		form.setFieldsValue({
			name: data?.name,
			// birthday: data?.birthday ? moment(props.userInfo?.birthday, dateFormat) : null,
			birthday: data?.birthday ? moment(props.userInfo?.birthday_value) : null,
			address: data?.address,
			email: data?.email,
			phone_number: data?.phone_number,
			card_number: data?.card_number,
			gender: data?.gender
		});
		data?.additional_phone_numbers_list.map((item, index) => {
			form.setFieldsValue({
				[`phone_number_${index}`]: item,
			})
		});
		data?.additional_emails_list.map((item, index) => {
			form.setFieldsValue({
				[`email_${index}`]: item,
			})
		});
		if (data?.avatar) {
			setFileList([
				{
					status: 'done',
					thumbUrl: "data:image/png;base64," + data.user.avatar,
					uid: 1,
					size: 1,
					name: '',
				}
			])
			setAva(data?.avatar)
		}

	}

	const handleEditInfo = () => {
		props.setEditUser(true);
	}

	const onFinish = async (values) => {

		console.log("values", values)
		try {
			let payload = {
				address: userInfo.address,
				avatar: ava || null,
				personal_information: {
					...userInfo,
					// birthday: userInfo?.birthday._i,
					birthday: userInfo?.birthday,
					expiration_date: "2021-03-17",
					id_card_issued_date: "2021-03-17",
					issued_by: "string",
					marital_status: 0,
					passport: "string",
				}
			}
			setAva(ava)
			props.updateUserInfo(payload);
		} catch (error) {
		}
	};



	const onFinishFailed = (errorInfo) => {
		console.log("Failed:", errorInfo);
	};

	const [fileList, setFileList] = useState([]);
	const onChangeImage = ({ fileList: newFileList }) => {
		if (newFileList.length > 0) {
			getBase64(newFileList[newFileList.length - 1].originFileObj, (result) => {
				let type = newFileList[newFileList.length - 1].type.split('/')[1]
				setImageType(type);
				result = result.replace(`data:image/${type};base64,`, '');
				setUserInfo({
					...userInfo,
					avatar: result,
				})
				setAva(result)
			})
		}
		setFileList(newFileList);
	};

	useEffect(() => {
		if ((ava !== props.avat) && ava) {
			NotificationSuccess("", "Thêm ảnh đại diện thành công.")
		}
	}, [ava])

	const getBase64 = (file, cb) => {
		let reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = function () {
			cb(reader.result)
		};
		reader.onerror = function (error) {
			console.log('Error: ', error);
		};
	}

	const handleCancelEdit = () => {
		setCancelEditModal(true)
	}

	const handleInputRelativeInfo = (e, type, i) => {
		let additional_list = userInfo?.[`additional_${type}s_list`];
		additional_list[i] = {
			...userInfo?.[`additional_${type}s_list`][i],
			[type]: e.target.value
		}
		setUserInfo({
			...userInfo,
			// personal_information: {
			// 	...userInfo.personal_information,
			[`additional_${type}s_list`]: additional_list
			// }

		})
	}

	const addPhoneNumber = () => {
		let additional_phone_numbers_list = userInfo?.additional_phone_numbers_list?.map(item => {
			if (item.hasOwnProperty('phone_number')) {
				return item
			} else {
				return { phone_number: item }
			}
		});
		additional_phone_numbers_list.push({
			"phone_number": "",
		})
		additional_phone_numbers_list.map((item, index) => {
			form.setFieldsValue({
				[`phone_number_${index}`]: item.phone_number,
			})
		})
		setUserInfo({
			...userInfo,
			// personal_information: {
			// 	...userInfo.personal_information,
			additional_phone_numbers_list: additional_phone_numbers_list
			// }

		})
	}

	const addEmail = () => {
		let additional_emails_list = userInfo?.additional_emails_list?.map(item => {
			if (item.hasOwnProperty('email')) {
				return item
			} else {
				return { email: item }
			}
		});
		additional_emails_list.push({
			"email": "",
		})

		additional_emails_list.map((item, index) => {
			form.setFieldsValue({
				[`email_${index}`]: item.email,
			})
		})
		setUserInfo({
			...userInfo,
			// personal_information: {
			// 	...userInfo.personal_information,
			additional_emails_list: additional_emails_list
			// }

		})
	}

	const handleDeleteRelatedInfo = (type, index) => {
		if (type === 'phone_number') {
			if (userInfo.additional_phone_numbers_list.length > 0) {
				let additional_phone_numbers_list = userInfo.additional_phone_numbers_list.filter((item, i) => {
					return index !== i
				})
				setUserInfo({
					...userInfo,
					// personal_information: {
					// 	...userInfo.personal_information,
					additional_phone_numbers_list: additional_phone_numbers_list
					// }
				})
				additional_phone_numbers_list.map((item, index) => {
					if (item.hasOwnProperty('phone_number')) {
						form.setFieldsValue({
							[`phone_number_${index}`]: item.phone_number,
						})
					} else {
						form.setFieldsValue({
							[`phone_number_${index}`]: item,
						})
					}
				})
			}
		} else {
			if (userInfo.additional_emails_list.length > 0) {
				let additional_emails_list = userInfo.additional_emails_list.filter((item, i) => index !== i);
				setUserInfo({
					...userInfo,
					// personal_information: {
					// 	...userInfo.personal_information,
					additional_emails_list: additional_emails_list
					// }
				})
				additional_emails_list.map((item, index) => {
					if (item.hasOwnProperty('email')) {
						form.setFieldsValue({
							[`email_${index}`]: item.email,
						})
					} else {
						form.setFieldsValue({
							[`email_${index}`]: item,
						})
					}
				})
			}
		}
	}



	const handleCancel = () => {
		setCancelEditModal(false)
	};

	const handleOk = () => {
		setCancelEditModal(false)
		form.resetFields()
		props.setEditUser(false);
		setFieldValue(props.userInfo)
		setAva(props.avat)

		// window.location.reload()
	};
	return (
		<div className="info-account">
			<h3>Thông tin cá nhân</h3>
			<Form
				{...layout}
				form={form}
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
			>
				<ImgCrop>
					<Upload rotate disabled={!props.editable}
						className="avaUpload"
						action=""
						listType="picture-card"
						fileList={fileList}
						onChange={onChangeImage}
					>
						{ava ? <img src={`data:image/${imageType};base64,` + ava} alt="avatar" style={{ width: '100%', borderRadius: '50%' }} /> : null}
						{!ava && props.avat ? <img src={`data:image/${imageType};base64,` + props.avat} alt="avatar" style={{ width: '100%', borderRadius: '50%' }} /> : null}
						{fileList.length === 0 && !ava && !props.avat ? 'Thêm ảnh đại diện' : null}
					</Upload>
				</ImgCrop>
				<Row>
					<Col xs={24} sm={12}>
						<Row>
							<Col xs={22} >
								<Form.Item label="Tên khách hàng"
									className={props.editable ? "require-style" : ""}
									name="name"
									rules={[
										() => ({
											validator(rule, value) {
												if (!value) return Promise.reject("Vui lòng nhập Tên khách hàng!");
												if (value && value.trim() === '') return Promise.reject("Vui lòng nhập Tên khách hàng!");
												const regExp = /\`|\~|\-|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\+|\=|\[|\{|\]|\}|\||\\|\'|\<|\,|\.|\>|\?|\/|\""|\;|\:|\_|\d/;
												if (regExp.test(value)) return Promise.reject("Tên khách hàng sai định dạng")
												if (value.length > 255) return Promise.reject("Tên khách hàng không được lớn hơn 255 ký tự");
												return Promise.resolve();
											}
										})
									]}>
									<Input
										disabled={!props.editable}
										value={userInfo?.name}
										onChange={(e) => { handleInputPersonalInfo(e, 'name') }} />
								</Form.Item>
							</Col>
							<Col xs={2}>

							</Col>
						</Row>
						<Row className="row-email">
							<Col xs={22} >
								<Form.Item label="Số điện thoại"
									className={props.editable ? "require-style" : ""}
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
													'83', '89', '90', '93', '70', '79', '77', '76', '78', '92', '56', '58', '99', '59']
												if (value.startsWith('0') && !phoneHeader.includes(value.substring(1, 3))
													|| value.startsWith('84') && !phoneHeader.includes(value.substring(2, 4))) {
													return Promise.reject("Số điện thoại không tồn tại");
												}
												return Promise.resolve();
											}
										})
									]}>
									<Input
										disabled={true}
										defaultValue={userInfo?.phone_number}
										onChange={(e) => { handleInputPersonalInfo(e, 'phone_number') }}
									/>
								</Form.Item>
							</Col>
							<Col xs={2}>
								<Button className={!props.editable && "hide-btn"} disabled={!props.editable} type="primary" onClick={addPhoneNumber}><PlusCircleOutlined /></Button>
							</Col>
						</Row>
						{userInfo?.additional_phone_numbers_list?.length > 0 ?
							userInfo?.additional_phone_numbers_list.map((item, index) => <Row className="row-email" key={index}>
								<Col xs={22}>
									<Form.Item
										label=" "
										name={`phone_number_${index}`}
										className="non-require"
										rules={[
											() => ({
												validator(rule, value) {
													if (value && value.trim() === '') return Promise.resolve();
													const regExp = /^[0-9]*$/;
													// if (!regExp.test(value.replace('+', ''))) return Promise.reject("Số điện thoại không đúng định dạng");
													if (value.startsWith('0') && value.length !== 10) return Promise.reject("Số điện thoại không đúng định dạng");
													if (value.startsWith('84') && value.length !== 11) return Promise.reject("Số điện thoại không đúng định dạng");
													if (!(value.startsWith('0') || value.startsWith('84'))) return Promise.reject("Số điện thoại không đúng định dạng");
													const phoneHeader = ['86', '96', '97', '98', '32', '33', '34', '35', '36', '37', '38', '39', '88', '91', '94', '93', '84', '85', '81', '82',
														'83', '89', '90', '93', '70', '79', '77', '76', '78', '92', '56', '58', '99', '59']
													if (value.startsWith('0') && !phoneHeader.includes(value.substring(1, 3))
														|| value.startsWith('84') && !phoneHeader.includes(value.substring(2, 4))) {
														return Promise.reject("Số điện thoại không tồn tại");
													}
													if (value === form.getFieldValue('phone_number')) {
														return Promise.reject("Số điện thoại đã có trong danh sách!");
													}
													const findIndex = userInfo.additional_phone_numbers_list.findIndex(item => item.phone_number === (value + ''))
													if (findIndex !== -1) {
														return Promise.reject("Số điện thoại đã có trong danh sách!");
													}
													return Promise.resolve();
												}
											})
										]}>
										<Input
											disabled={!props.editable}
											value={item}
											onChange={(e) => { handleInputRelativeInfo(e, 'phone_number', index) }}
										/>
									</Form.Item>
								</Col>
								<Col xs={2}>
									<Button className={!props.editable ? "hide-btn icon-btn" : "icon-btn"} disabled={!props.editable} >
										<DeleteOutlined onClick={() => handleDeleteRelatedInfo('phone_number', index)} style={{ cursor: 'pointer' }} />
									</Button>
								</Col>
							</Row>) : null}
						<Row className="row-email">
							<Col xs={22}>
								<Form.Item
									className={props.editable ? "require-style" : ""}
									label="Email"
									name="email"
									rules={[
										({ getFieldValue }) => ({
											validator(rule, value) {
												const validation = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
												if (value) {
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
													}
													return Promise.reject(
														"Email không đúng định dạng!"
													);
												} else {
													return Promise.reject(`Vui lòng nhập Email!`);
												}
											},
										}),
									]}
								>
									<Input disabled={true} placeholder="Example@gmail.com" defaultValue={userInfo?.email} />
								</Form.Item>
							</Col>
							<Col xs={2}>
								<Button className={!props.editable && "hide-btn"} disabled={!props.editable} type="primary" onClick={addEmail}><PlusCircleOutlined /></Button>
							</Col>
						</Row>
						{userInfo?.additional_emails_list?.length > 0 ?
							userInfo?.additional_emails_list.map((item, index) => <Row className="row-email" key={index}>
								<Col xs={22}>
									<Form.Item
										label=" "
										name={`email_${index}`}
										className="non-require"
										rules={[
											({ getFieldValue }) => ({
												validator(rule, value) {
													const validation = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
													if (value) {
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
															if (value === form.getFieldValue('email')) {
																return Promise.reject("Email đã có trong danh sách!");
															}
															const findIndex = userInfo.additional_emails_list.findIndex(item => item.email === value)
															if (findIndex !== -1) {
																return Promise.reject("Email đã có trong danh sách!");
															}
															return Promise.resolve();
														}
														return Promise.reject(
															"Email không đúng định dạng!"
														);
													} else {
														return Promise.reject(`Vui lòng nhập Email!`);
													}
												},
											}),
										]}>
										<Input
											disabled={!props.editable}
											value={item}
											onChange={(e) => { handleInputRelativeInfo(e, 'email', index) }}
										/>
									</Form.Item>
								</Col>
								<Col xs={2}>
									<Button className={!props.editable ? "hide-btn icon-btn" : "icon-btn"} disabled={!props.editable} >
										<DeleteOutlined disabled={!props.editable} onClick={() => handleDeleteRelatedInfo('email', index)} style={{ cursor: 'pointer' }} />
									</Button>
								</Col>
							</Row>) : null}
					</Col>
					<Col xs={24} sm={12}>
						<Form.Item label="Số CMND / CCCD / Hộ chiếu"
							className={props.editable ? "require-style special-width card_id" : "special-width card_id"}
							name="card_number"
							rules={[
								() => ({
									validator(rule, value) {
										if (!value) return Promise.reject("Vui lòng nhập Số CMND/CCCD/Hộ chiếu!");
										if (value && value.trim() === '') return Promise.reject("Vui lòng nhập Số CMND/CCCD/Hộ chiếu!");
										const regExp = /^[A-Za-z0-9]*$/;
										const char = /^[A-Za-z]*$/;
										const int = /^[0-9]*$/;
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
							]}
						>
							<Input
								disabled={true}
								defaultValue={userInfo?.card_number}
								onChange={(e) => { handleInputPersonalInfo(e, 'card_number') }} />
						</Form.Item>
						<Form.Item
							className={props.editable ? "require-style special-width" : "special-width"}
							label="Ngày sinh"
							name="birthday"

							rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
						>
							<DatePicker style={{ width: '100%' }} placeholder="Chọn ngày"
								// format={dateFormat}
								format={dataDate}
								onChange={handleSelectBirthday}
								disabledDate={disabledDate} disabled={!props.editable}
							/>

						</Form.Item>
						<Form.Item label="Địa chỉ"
							className={props.editable ? "require-style special-width" : "special-width"}
							name="address"
							rules={[
								({ getFieldValue }) => ({
									validator(rule, value) {
										if (value) {
											const listCheck = value.split("@");
											if (value.length > 255) {
												return Promise.reject(
													"Địa chỉ vượt quá 255 ký tự!"
												);
											} else {
												return Promise.resolve();
											}
										} else {
											return Promise.reject("Vui lòng nhập Địa chỉ!");
										}
									},
								}),
							]}
						>
							<Input value={userInfo?.address}
								disabled={!props.editable} onChange={(e) => handleInputPersonalInfo(e, 'address')} />
						</Form.Item>
						<Form.Item
							className={props.editable ? "require-style special-width" : "special-width"}
							label="Giới tính" name="gender"
							rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
						>
							<div className="l-list-button">
								<Button type="primary"
									disabled={!props.editable}
									className={`${userInfo?.gender === GENDERS.M ? 'active' : ''}`}
									shape="round" size="default" onClick={() => { changeGender(GENDERS.M) }}>Nam</Button>
								<Button type="primary"
									style={{ marginLeft: 10 }}
									disabled={!props.editable}
									className={`${userInfo?.gender === GENDERS.F ? 'active' : ''}`}
									shape="round" size="default" onClick={() => { changeGender(GENDERS.F) }}
								>Nữ</Button>
							</div>
						</Form.Item>
					</Col>
				</Row>
				{props.editable ?
					<div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
						<Button type="primary" className="btn-close" style={{ marginRight: 10 }} onClick={handleCancelEdit}>Hủy</Button>
						<Button type="primary" className="btn-update active" htmlType="submit">Cập nhật <ArrowRightOutlined /></Button>
					</div>
					: <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}><Button type="primary" className="active" onClick={handleEditInfo}>Chỉnh sửa</Button></div>
				}
			</Form>
			<Modal
				title="Hủy chỉnh sửa"
				className="cancel-edit-modal"
				visible={openCancelEditModal}
				onOk={handleOk}
				onCancel={handleCancel}
				okText={"Có"}
				cancelText={"Không"}
				closable={false}
			>
				<p style={{ textAlign: "center" }}>
					Bạn có chắc muốn hủy chỉnh sửa không?
              	</p>
			</Modal>
		</div>
	)
}
const mapDispatchToProps = (dispatch) => ({
	getUserInfo: () => dispatch(getUserInfo()),
	updateUserInfo: (payload) => dispatch(updateUserInfo(payload)),
	setEditUser: (param) => dispatch(setEditUser(param)),
});

export default connect((state) => ({
	userInfo: state.user.userData,
	editable: state.user.editable,
	avat: state.user?.ava
}), mapDispatchToProps)(InfoAccountContainer);