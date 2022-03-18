import React, { useEffect, useState, Fragment, useRef } from 'react';
import { Checkbox, Col, DatePicker, Form, Input, Radio, Row } from 'antd';
import '../../../styles/survey.scss';
import Modal from 'antd/lib/modal/Modal';
import picture1 from '../../../asset/images/Picture1.png'
import picture2 from '../../../asset/images/Picture2.png'
import picture3 from '../../../asset/images/Picture3.png'
import picture4 from '../../../asset/images/Picture4.png'
import http from '../../../apis/http';
import moment from "moment";
import { STATUS_CODE } from '../../../utils/constants';
import { forEach } from 'lodash';
import NumberFormat from 'react-number-format';
import { NotificationError, NotificationSuccess } from '../../../common/components/Notification';
const InfoCustomer = (props) => {
	const { isShowInfoCustomer, showInfoCustomer, infoCustomer, setInfoCustomer, currentLoanCode, initDataCustomer } = props;
	const [form] = Form.useForm();
	const [isEdit, setIsEdit] = useState(false)
	const [listDateType, setListDateType] = useState([])
	const FORMAT_DATE = "DD/MM/YYYY";

	const [dataFill, setDataFill] = useState({})

	
	useEffect(() => {
		setDataFill({
			...infoCustomer
		})
		return () => {
		}
	}, [infoCustomer])

	// console.log("dataFill",dataFill);

	const onOk = () => {
		form.validateFields()
			.then((values) => {
				// console.log('start upload')
				// console.log("values",values)
				onFinish(values);
				form.resetFields();

			}).catch((info) => {
				NotificationError("", "Bạn chưa nhập đủ trường")
				console.log('Validate Failed:', info);
			});
	};
	const onFinish = async (value) => {
		// console.log("value", value);
		try {
			console.log('in process')
			let _data = { ...infoCustomer };
			// console.log("data", _data);
			forEach(listDateType, (key) => {
				_data[key] = infoCustomer[key].format(FORMAT_DATE)
			})
			const rs = await http.post(`web/loans/${currentLoanCode}/customer/result`, _data)
			// const rs = await http.post(`web/loans/${currentLoanCode}/customer/result`, value)
			console.log("ResUpdate", rs);
			if (rs?.status === 200) {
				NotificationSuccess("", "Cập nhật thành công");
				setDataFill([])
			}
			showInfoCustomer(false)
		} catch (ex) {
			console.log("ex", ex);

			NotificationError("", "Cập nhật thất bại")
			// showInfoCustomer(false)
		}
	}



	const fetchInfoCustomer = async () => {
		try {
			const rs = await http.get(`web/loans/${currentLoanCode}/customer/result`)
			if (rs?.status === STATUS_CODE.SUCCESS) {
				console.log("Data", rs?.data?.data);
				let _data = {
					...rs?.data?.data,
					// e_issue_date: rs?.data?.data?.e_issue_date?.length > 0 ? moment(rs?.data?.data?.e_issue_date, FORMAT_DATE) : moment(),
					e_issue_date: rs?.data?.data?.e_issue_date?.length > 0 ? moment(rs?.data?.data?.e_issue_date, FORMAT_DATE) : null,
					// birthday_customer: rs?.data?.data?.birthday_customer?.length > 0 ? moment(rs?.data?.data?.birthday_customer, FORMAT_DATE) : moment(),
					c_birth_date: rs?.data?.data?.c_birth_date?.length > 0 ? moment(rs?.data?.data?.c_birth_date, FORMAT_DATE) : null,
					// user_date: rs?.data?.data?.user_date?.length > 0 ? moment(rs?.data?.data?.user_date, FORMAT_DATE) : moment(),
					c_issue_date: rs?.data?.data?.c_issue_date?.length > 0 ? moment(rs?.data?.data?.c_issue_date, FORMAT_DATE) : null,
					// contract_date_electricity: rs?.data?.data?.contract_date_electricity?.length > 0 ? moment(rs?.data?.data?.contract_date_electricity, FORMAT_DATE) : null,
					sign_date: rs?.data?.data?.sign_date?.length > 0 ? moment(rs?.data?.data?.sign_date, FORMAT_DATE) : null,
				}
				// setData(_data)
				setInfoCustomer(_data)
				setIsEdit(true)
				form.setFieldsValue(_data)
			}
		} catch (ex) {
			setIsEdit(false);
			setInfoCustomer(initDataCustomer)
			form.setFieldsValue(initDataCustomer)
		}
	}


	useEffect(() => {
		if (isShowInfoCustomer) {
			fetchInfoCustomer();
		}
	}, [isShowInfoCustomer])


	const onClose = () => {
		setDataFill([])
		showInfoCustomer(false);
		form.resetFields();
	}
	const SPAN_ONE_FIELD = 24;
	const SPAN_TWO_FIELD = 10;
	const IS_BORDER_INPUT = false;
	const layout = {
		labelCol: { span: 8 },
		wrapperCol: { span: 16 },
	};

	const tailLayout = {
		labelCol: { span: 6 },
		// wrapperCol: { offset: 1, span: 12 },
	};


	const typingTimeoutRef = useRef(null);
	const updateTextField = (_, field) => {
		switch (field) {
			case "income_average":
			case "total_cost":
			case "fixed_salary":
			case "cost_live":
			case "income_difference":
			case "cost_loan":
			case "cost_deference":
			case "income_average_family":
			case "fixed_salary_family":
			case "income_difference_family":
			case "income_accumulated":
			case "power_consume_half_year":
			case "percent_consum":
			case "roof_area":
			case "roof_panel_type":
			case "power_sold_average":
			case "power_save_average":
			case "power_sales_average":
			case "sales_save_average":
				if (typingTimeoutRef.current) {
					clearTimeout(typingTimeoutRef.current)
				}
				typingTimeoutRef.current = setTimeout(() => {
					setDataFill({
						...dataFill,
						[field]: _.floatValue
					})
					setInfoCustomer({
						...infoCustomer,
						[field]: _.floatValue
					})
				}, 300)
				break
			default:
				setInfoCustomer({
					...infoCustomer,
					[field]: _.target.value
				})
				break;
		}
	}




	const updateDateField = (_, field) => {
	
		// if (listDateType.indexOf(field) === -1) {
		// 	// console.log("field",field);
			
		// 	// setListDateType(...listDateType, [field])
	
		setListDateType([...listDateType,field])
		setInfoCustomer({
			...infoCustomer,
			[field]: _
		})
	
	}
	


	const updateCheckboxField = (_, field) => {
		setInfoCustomer({
			...infoCustomer,
			[field]: _.toString()
		})

	}


	useEffect(() => {
		if (isShowInfoCustomer) {
			document.querySelector(".ant-modal-body").scrollTop = 0
		}

	}, [isShowInfoCustomer])


	return (
		<Modal width="70%" title="Phiếu thu thập thông tin khách hàng" visible={isShowInfoCustomer} onCancel={onClose} onOk={onOk}
			bodyStyle={{ height: "60vh", overflow: "auto" }}
			okText={isEdit ? 'Update' : 'OK'}
			id="mod"
		>
			<Form

				// {...layout}
				id="modal-forms"
				className="info-customer"
				form={form}
				name="basic"
				initialValues={{ ...infoCustomer }}
			>
				<p><b>I. ĐƠN VỊ THU THẬP THÔNG TIN </b></p>
				<Row>
					<Col span={SPAN_ONE_FIELD}>
						<Form.Item {...tailLayout}
							labelAlign={"left"}
							label="Tên cán bộ thực hiện"
							name="e_name"
							rules={[{ required: true, message: 'Vui lòng nhập tên cán bộ thực hiện!' }]}
						>
							<Input bordered={IS_BORDER_INPUT} value={infoCustomer.e_name} onChange={(_) => { updateTextField(_, 'e_name') }} />
						</Form.Item>
					</Col>
				</Row>
				<Row>
					<Col span={7}>
						<Form.Item
							label="CMND/Hộ chiếu/CCCD"
							name="e_card_number"
							rules={[{ required: true, message: 'Vui lòng nhập CMND/Hộ chiếu/CCCD!' }]}
						>
							<Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.e_card_number} value={infoCustomer.e_card_number} onChange={(_) => { updateTextField(_, 'e_card_number') }} />
						</Form.Item>
					</Col>
					<Col span={1}></Col>
					<Col span={7}>
						<Form.Item
							label="Nơi cấp"
							name="e_issue_address"
							rules={[{ required: true, message: 'Vui lòng nhập nơi cấp!' }]}
						>

							<Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.e_issue_address} value={infoCustomer.e_issue_address} onChange={(_) => { updateTextField(_, 'e_issue_address') }} />
						</Form.Item>
					</Col>
					<Col span={1}></Col>
					<Col span={8}>
						<Form.Item
							label="Ngày cấp"
							name="e_issue_date"
							rules={[{ required: true, message: 'Vui lòng nhập ngày cấp!' }]}
						>
							<DatePicker bordered={false} placeholder="Ngày cấp" format={FORMAT_DATE} defaultValue={infoCustomer?.e_issue_date ? moment(infoCustomer?.e_issue_date, FORMAT_DATE) : null} value={moment(infoCustomer?.e_issue_date, FORMAT_DATE)} onChange={(_) => { updateDateField(_, 'e_issue_date') }} />
							{/* <DatePicker bordered={false} placeholder="Ngày cấp" format={DATE_FORMAT} defaultValue={infoCustomer?.e_issue_date ? moment(infoCustomer?.e_issue_date, DATE_FORMAT) : null} value={moment(infoCustomer?.e_issue_date, DATE_FORMAT)} onChange={(_) => { updateDateField(_, 'e_issue_date') }} /> */}
						</Form.Item>
					</Col>

				</Row>

				<Row>
					<Col span={SPAN_ONE_FIELD}>
						<Form.Item {...tailLayout}
							labelAlign={"left"}
							label="Số điện thoại"
							name="e_mobile"
							rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
						>
							<Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.e_mobile} value={infoCustomer.e_mobile} onChange={(_) => { updateTextField(_, 'e_mobile') }} />
						</Form.Item>
					</Col>
				</Row>

				<Row>
					<Col span={SPAN_ONE_FIELD}>
						<Form.Item
							{...tailLayout}
							labelAlign={"left"}
							label="Đơn vị công tác"
							name="e_company"
							rules={[{ required: true, message: 'Vui lòng nhập đơn vị công tác!' }]}
						>
							<Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.e_company} value={infoCustomer.e_company} onChange={(_) => { updateTextField(_, 'e_company') }} />
						</Form.Item>
					</Col>
				</Row>


				<Row>
					<Col span={SPAN_ONE_FIELD}>
						<Form.Item
							{...tailLayout}
							labelAlign={"left"}
							label="Địa chỉ đơn vị công tác"
							name="e_address"
							rules={[{ required: true, message: 'Vui lòng nhập địa chỉ đơn vị công tác!' }]}
						>
							<Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.e_address} value={infoCustomer.e_address} onChange={(_) => { updateTextField(_, 'e_address') }} />
						</Form.Item>
					</Col>
				</Row>


				<Row>
					<Col span={SPAN_ONE_FIELD}>
						<Form.Item
							{...tailLayout}
							labelAlign={"left"}
							label="Số điện thoại cơ quan"
							name="company_phone"
							rules={[{ required: true, message: 'Vui lòng nhập số điện thoại cơ quan!' }]}
						>
							<Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.company_phone} value={infoCustomer.company_phone} onChange={(_) => { updateTextField(_, 'company_phone') }} />
						</Form.Item>
					</Col>
				</Row>

				<Row>
					<Col span={SPAN_ONE_FIELD}>
						<Form.Item
							{...tailLayout}
							labelAlign={"left"}
							label="Địa điểm thu thập thông tin"
							name="collection_address"
							rules={[{ required: true, message: 'Vui lòng nhập địa điểm thu thập thông tin!' }]}
						>
							<Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.collection_address} value={infoCustomer.collection_address} onChange={(_) => { updateTextField(_, 'collection_address') }} />
						</Form.Item>
					</Col>
				</Row>
				<p><b>II. THÔNG TIN KHÁCH HÀNG</b></p>
				<Row>
					<Col span={SPAN_ONE_FIELD}>
						<Form.Item
							{...tailLayout}
							labelAlign={"left"}
							label="Họ và Tên"
							name="c_name"
							rules={[{ required: true, message: 'Vui lòng nhập họ tên khách hàng!' }]}
						>
							<Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.c_name} value={infoCustomer.c_name} onChange={(_) => { updateTextField(_, 'c_name') }} />
						</Form.Item>
					</Col>
				</Row>

				<Row>
					<Col span={SPAN_TWO_FIELD}>
						<Form.Item
							{...tailLayout}
							labelAlign={"left"}
							label="Giới tính"
							name="c_gender"
							rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
						>
							<Radio.Group defaultValue={infoCustomer?.c_gender} value={infoCustomer?.c_gender} onChange={(e) => { updateTextField(e, 'c_gender') }}>
								<Radio value={0}>Nam</Radio>
								<Radio value={1}>Nữ</Radio>
							</Radio.Group>
						</Form.Item>
					</Col>
					<Col span={2}></Col>
					{/* <Col span={SPAN_TWO_FIELD}>
						<Form.Item
							{...tailLayout}
							labelAlign={"left"}
							label="Ngày sinh"
							name="birthday_customer"
							rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
						>
							format={FORMAT_DATE}
							<DatePicker format={FORMAT_DATE} bordered={false} placeholder="Ngày sinh"  defaultValue={infoCustomer?.birthday_customer ? moment(infoCustomer.birthday_customer, FORMAT_DATE) : null} value={infoCustomer?.birthday_customer ? moment(infoCustomer.birthday_customer, FORMAT_DATE) : null} onChange={(_) => { updateDateField(_, 'birthday_customer') }} />
						</Form.Item>
					</Col> */}
					<Col span={SPAN_TWO_FIELD}>
						<Form.Item
							{...tailLayout}
							labelAlign={"left"}
							label="Ngày sinh"
							name="c_birth_date"

							rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
						>
							{/* format={FORMAT_DATE} */}
							{/* <DatePicker format={FORMAT_DATE} bordered={false} placeholder="Ngày sinh" defaultValue={infoCustomer?.c_birth_date ? moment(infoCustomer?.c_birth_date, FORMAT_DATE) : null} value={infoCustomer?.c_birth_date ? moment(infoCustomer?.c_birth_date, FORMAT_DATE) : null} onChange={(_) => { updateDateField(_, 'birthday_customer') }} /> */}
							<DatePicker format={FORMAT_DATE} bordered={false} placeholder="Ngày Sinh" format={FORMAT_DATE} defaultValue={infoCustomer?.c_birth_date ? moment(infoCustomer?.c_birth_date, FORMAT_DATE) : null} value={moment(infoCustomer?.c_birth_date, FORMAT_DATE)} onChange={(_) => { updateDateField(_, 'c_birth_date') }} />
						</Form.Item>
					</Col>
				</Row>

				<Row>
					<Col span={7}>
						<Form.Item
							label="CMND/Hộ chiếu/CCCD"
							name="c_card_number"
							rules={[{ required: true, message: 'Vui lòng nhập CMND/Hộ chiếu/CCCD!' }]}
						>
							<Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.c_card_number} value={infoCustomer.c_card_number} onChange={(_) => { updateTextField(_, 'c_card_number') }} />
						</Form.Item>
					</Col>
					<Col span={1}></Col>
					<Col span={7}>
						<Form.Item
							label="Nơi cấp"
							name="c_issue_address"
							rules={[{ required: true, message: 'Vui lòng nhập nơi cấp!' }]}
						>
							<Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.c_issue_address} value={infoCustomer.c_issue_address} onChange={(_) => { updateTextField(_, 'c_issue_address') }} />
						</Form.Item>
					</Col>
					<Col span={1}></Col>
					<Col span={7}>
						<Form.Item
							label="Ngày cấp"
							// name="user_date"
							name="c_issue_date"
							rules={[{ required: true, message: 'Vui lòng nhập ngày cấp!' }]}
						>
							{/* <DatePicker format={FORMAT_DATE} bordered={false} placeholder="Ngày cấp" format={FORMAT_DATE} defaultValue={infoCustomer?.user_date ? moment(infoCustomer?.user_date, FORMAT_DATE) : null} value={moment(infoCustomer.user_date, FORMAT_DATE)} onChange={(_) => { updateDateField(_, 'user_date') }} /> */}
							<DatePicker format={FORMAT_DATE} bordered={false} placeholder="Ngày cấp" format={FORMAT_DATE} defaultValue={infoCustomer?.c_issue_date ? moment(infoCustomer?.c_issue_date, FORMAT_DATE) : null} value={moment(infoCustomer?.c_issue_date, FORMAT_DATE)} onChange={(_) => { updateDateField(_, 'c_issue_date') }} />
							{/* <DatePicker format={DATE_FORMAT} bordered={false} placeholder="Ngày cấp" format={DATE_FORMAT} defaultValue={infoCustomer?.c_issue_date ? moment(infoCustomer?.c_issue_date, DATE_FORMAT) : null} value={moment(infoCustomer?.c_issue_date, DATE_FORMAT)} onChange={(_) => { updateDateField(_, 'c_issue_date') }} /> */}

						</Form.Item>
					</Col>
				</Row>

				<Row>
					<Col span={SPAN_ONE_FIELD}>
						<Form.Item
							{...tailLayout}
							labelAlign={"left"}
							label="Địa chỉ đăng ký hộ khẩu"
							name="c_permanent_address"
							rules={[{ required: true, message: 'Vui lòng nhập địa chỉ đăng ký hộ khẩu!' }]}
						>
							<Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.c_permanent_address} value={infoCustomer.c_permanent_address} onChange={(_) => { updateTextField(_, 'c_permanent_address') }} />
						</Form.Item>
					</Col>
				</Row>

				<Row>
					<Col span={SPAN_ONE_FIELD}>
						<Form.Item
							{...tailLayout}
							labelAlign={"left"}
							label="Địa chỉ liên lạc"
							name="c_address"
							rules={[{ required: true, message: 'Vui lòng nhập địa chỉ liên lạc!' }]}
						>
							<Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.c_address} value={infoCustomer.c_address} onChange={(_) => { updateTextField(_, 'c_address') }} />
						</Form.Item>
					</Col>
				</Row>

				<Row>
					<Col span={8}>
						<Form.Item
							labelAlign={"left"}
							label="Số điện thoại"
							name="c_phone"
							rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
						>
							<Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.c_phone} value={infoCustomer.c_phone} onChange={(_) => { updateTextField(_, 'c_phone') }} />
						</Form.Item>
					</Col>
					<Col span={2}></Col>
					<Col span={8}>
						<Form.Item
							labelAlign={"left"}
							label="Email"
							name="c_email"
							rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
						>
							<Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.c_email} value={infoCustomer.c_email} onChange={(_) => { updateTextField(_, 'c_email') }} />
						</Form.Item>
					</Col>
				</Row>

				<Row>
					<Col span={SPAN_ONE_FIELD}>
						<Form.Item
							{...tailLayout}
							labelAlign={"left"}
							label="Trình độ học vấn"
							name="c_literacy"
							rules={[{ required: true, message: 'Vui lòng chọn trình độ học vấn!' }]}
						>
							<Radio.Group value={infoCustomer.c_literacy} defaultValue={infoCustomer.c_literacy} onChange={(_) => { updateTextField(_, 'c_literacy') }}>
								<Radio value={1}>Trên Đại học </Radio>
								<Radio value={2}>Cao đẳng </Radio>
								<Radio value={3}>Trung cấp  </Radio>
								<Radio value={4}>Dưới trung cấp </Radio>
							</Radio.Group>
						</Form.Item>
					</Col>
				</Row>

				<Row>
					<Col span={SPAN_ONE_FIELD}>
						<Form.Item
							{...tailLayout}
							labelAlign={"left"}
							label="Tình trạng hôn nhân"
							name="c_marital_status"
							rules={[{ required: true, message: 'Vui lòng chọn tình trạng hôn nhân!' }]}
						>
							<Radio.Group value={infoCustomer.c_marital_status} defaultValue={infoCustomer.c_marital_status} onChange={(_) => { updateTextField(_, 'c_marital_status') }}>
								<Radio value={0}>Có gia đình </Radio>
								<Radio value={1}>Độc thân </Radio>
								<Radio value={2}>Ly dị/ Góa  </Radio>
							</Radio.Group>
						</Form.Item>
					</Col>
				</Row>

				<Row>
					<Col span={SPAN_ONE_FIELD}>
						<Form.Item
							{...tailLayout}
							labelAlign={"left"}
							label="Hồ sơ khách hàng cung cấp"
							name="c_profile_provided"
							rules={[{ required: true, message: 'Vui lòng chọn hồ sơ khách hàng cung cấp!' }]}
						>
							<Checkbox.Group value={infoCustomer.c_profile_provided?.split(",")} defaultValue={infoCustomer.c_profile_provided} onChange={(_) => { updateCheckboxField(_, 'c_profile_provided') }}>
								<Checkbox value={1}>CMND/CCCD/Hộ chiếu</Checkbox>
								<Checkbox value={2}>Sổ hộ khẩu</Checkbox>
								<Checkbox value={3}>Xác nhận của đ.vị đang công tác</Checkbox>
							</Checkbox.Group>
						</Form.Item>
					</Col>
				</Row>
				<p><b>III. THÔNG TIN NGHỀ NGHIỆP</b></p>
				<Row>
					<Col span={SPAN_ONE_FIELD}>
						<Form.Item {...tailLayout}
							labelAlign={"left"}
							label="Tên cơ quan công tác"
							name="c_company"
							rules={[{ required: true, message: 'Vui lòng nhập tên cơ quan công tác!' }]}
						>
							<Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.c_company} value={infoCustomer.c_company} onChange={(_) => { updateTextField(_, 'c_company') }} />
						</Form.Item>
					</Col>
				</Row>

				<Row>
					<Col span={SPAN_ONE_FIELD}>
						<Form.Item {...tailLayout}
							labelAlign={"left"}
							label="Địa chỉ"
							name="c_company_address"
							rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
						>
							<Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.c_company_address} value={infoCustomer.c_company_address} onChange={(_) => { updateTextField(_, 'c_company_address') }} />
						</Form.Item>
					</Col>
				</Row>

				<Row>
					<Col span={SPAN_ONE_FIELD}>
						<Form.Item {...tailLayout}
							labelAlign={"left"}
							label="Vị trí công tác"
							name="c_position"
							rules={[{ required: true, message: 'Vui lòng nhập vị trí công tác!' }]}
						>
							<Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.c_position} value={infoCustomer.c_position} onChange={(_) => { updateTextField(_, 'c_position') }} />
						</Form.Item>
					</Col>
				</Row>

				<Row>
					<Col span={SPAN_ONE_FIELD}>
						<Form.Item {...tailLayout}
							labelAlign={"left"}
							label="Thời gian công tác"
							name="c_time_work"
							rules={[{ required: true, message: 'Vui lòng nhập thời gian công tác!' }]}
						>
							<Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.c_time_work} value={infoCustomer.c_time_work} onChange={(_) => { updateTextField(_, 'c_time_work') }} />
						</Form.Item>
					</Col>
				</Row>

				<Row>
					<Col>
						<Form.Item span={SPAN_ONE_FIELD}
							// {...tailLayout}
							labelAlign={"left"}
							label="Hình thức nhận lương"
							name="c_form_payment"
							rules={[{ required: true, message: 'Vui lòng chọn hình thức nhận lương!' }]}
						>
							<Radio.Group defaultValue={infoCustomer.c_form_payment} value={infoCustomer.c_form_payment} onChange={(_) => { updateTextField(_, 'c_form_payment') }}>
								<Radio value={"1"}>Tiền mặt </Radio>
								<Radio value={"2"}>Tài khoản: <Input bordered={IS_BORDER_INPUT} style={{ "width": "200px" }} />  kỳ nhận lương <Input bordered={IS_BORDER_INPUT} style={{ "width": "100px" }} /></Radio>
							</Radio.Group>

						</Form.Item>
					</Col>
				</Row>

				<Row>
					<Col>
						<Form.Item span={SPAN_ONE_FIELD}
							// {...tailLayout}
							labelAlign={"left"}
							label="Loại hợp đồng lao động"
							name="c_contract_type"
							rules={[{ required: true, message: 'Vui lòng chọn loại hợp đồng lao động!' }]}
						>
							<Radio.Group defaultValue={infoCustomer.c_contract_type} value={infoCustomer.c_contract_type} onChange={(_) => { updateTextField(_, 'c_contract_type') }}>
								<Radio value={"1"}>Có thời hạn<Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.c_contract_time} value={infoCustomer.c_contract_time} onChange={(_) => { updateTextField(_, 'c_contract_time') }} style={{ "width": "100px" }} />tháng </Radio>
								<Radio value={"2"}>Không thời hạn</Radio>
								<Radio value={"3"}>Khác <Input bordered={IS_BORDER_INPUT} style={{ "width": "200px" }} /></Radio>
							</Radio.Group>
						</Form.Item>
					</Col>
				</Row>

				<p><b>IV. THÔNG TIN VỢ/CHỒNG (nếu có)</b></p>
				<Row>
					<Col span={SPAN_ONE_FIELD}>
						<Form.Item
							{...tailLayout}
							labelAlign={"left"}
							label="Họ và Tên"
						>
							<Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.c_family_name} value={infoCustomer.c_family_name} onChange={(_) => { updateTextField(_, 'c_family_name') }} />
						</Form.Item>
					</Col>
				</Row>

				<Row>
					<Col span={SPAN_TWO_FIELD}>
						<Form.Item
							{...tailLayout}
							labelAlign={"left"}
							label="Giới tính"
						>
							<Radio.Group defaultValue={infoCustomer.c_family_gender} value={infoCustomer.c_family_gender} onChange={(_) => { updateTextField(_, 'c_family_gender') }}>
								<Radio value={1}>Nam</Radio>
								<Radio value={2}>Nữ</Radio>
							</Radio.Group>
						</Form.Item>
					</Col>
					<Col span={2}></Col>
					<Col span={SPAN_TWO_FIELD}>
						<Form.Item
							{...tailLayout}
							labelAlign={"left"}
							label="Ngày sinh"
						>
							<DatePicker format={FORMAT_DATE} bordered={false} placeholder="Ngày sinh" />
						</Form.Item>
					</Col>
				</Row>

				<Row>
					<Col span={7}>
						<Form.Item
							label="CMND/Hộ chiếu/CCCD"
							name="c_family_card"
						>
							<Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.c_family_card} value={infoCustomer.c_family_card} onChange={(_) => { updateTextField(_, 'c_family_card') }} />
						</Form.Item>
					</Col>
					<Col span={1}></Col>
					<Col span={7}>
						<Form.Item
							label="Nơi cấp"
						>
							<Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.c_family_issue_address} value={infoCustomer.c_family_issue_address} onChange={(_) => { updateTextField(_, 'c_family_issue_address') }} />
						</Form.Item>
					</Col>
					<Col span={1}></Col>
					<Col span={7}>
						<Form.Item
							label="Ngày cấp"
						>
							{/* <DatePicker format={FORMAT_DATE} placeholder="Ngày cấp" bordered={false} /> */}
							<DatePicker placeholder="Ngày cấp" bordered={false} />
						</Form.Item>
					</Col>
				</Row>

				<Row>
					<Col span={SPAN_ONE_FIELD}>
						<Form.Item
							{...tailLayout}
							labelAlign={"left"}
							label="Địa chỉ liên lạc"
						>
							<Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.c_family_address} value={infoCustomer.c_family_address} onChange={(_) => { updateTextField(_, 'c_family_address') }} />
						</Form.Item>
					</Col>
				</Row>

				<Row>
					<Col span={SPAN_TWO_FIELD}>
						<Form.Item
							labelAlign={"left"}
							label="Số điện thoại"
						>
							<Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.c_family_phone} value={infoCustomer.c_family_phone} onChange={(_) => { updateTextField(_, 'c_family_phone') }} />
						</Form.Item>
					</Col>
					<Col span={2}></Col>
					<Col span={SPAN_TWO_FIELD}>
						<Form.Item
							labelAlign={"left"}
							label="Email"
						>
							<Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.c_family_email} value={infoCustomer.c_family_email} onChange={(_) => { updateTextField(_, 'c_family_email') }} />
						</Form.Item>
					</Col>
				</Row>
				<p><b>V. THÔNG TIN NGƯỜI THAM CHIẾU (nếu có)</b></p>
				<Row>
					<Col span={10} style={{ textAlign: 'center', fontWeight: 'bold' }}>Người liên hệ 1</Col>
					<Col span={2}></Col>
					<Col span={10} style={{ textAlign: 'center', fontWeight: 'bold' }}>Người liên hệ 2</Col>
				</Row>
				<Row>
					<Col span={10}>
						<Form.Item
							{...tailLayout}
							labelAlign={"left"}
							label="Họ và tên"
							name="c_ref_first_name"
						>
							<Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.c_ref_first_name} value={infoCustomer.c_ref_first_name} onChange={(_) => { updateTextField(_, 'c_ref_first_name') }} />
						</Form.Item>
					</Col>
					<Col span={2} />
					<Col span={10}>
						<Form.Item
							{...tailLayout}
							labelAlign={"left"}
							label="Họ và tên"
							name="c_ref_second_name"
						>
							<Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.c_ref_second_name} value={infoCustomer.c_ref_second_name} onChange={(_) => { updateTextField(_, 'c_ref_second_name') }} />
						</Form.Item>
					</Col>
				</Row>
				<Row>
					<Col span={10}>
						<Form.Item
							{...tailLayout}
							labelAlign={"left"}
							label="Quan hệ"
						>
							<Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.c_ref_first_relative} value={infoCustomer.c_ref_first_relative} onChange={(_) => { updateTextField(_, 'c_ref_first_relative') }} />
						</Form.Item>
					</Col>
					<Col span={2} />
					<Col span={10}>
						<Form.Item
							{...tailLayout}
							labelAlign={"left"}
							label="Quan hệ"
						>
							<Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.c_ref_second_relative} value={infoCustomer.c_ref_second_relative} onChange={(_) => { updateTextField(_, 'c_ref_second_relative') }} />
						</Form.Item>
					</Col>
				</Row>

				<Row>
					<Col span={10}>
						<Form.Item
							{...tailLayout}
							labelAlign={"left"}
							label="Địa chỉ liên lạc"
						>
							<Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.c_ref_first_address} value={infoCustomer.c_ref_first_address} onChange={(_) => { updateTextField(_, 'c_ref_first_address') }} />
						</Form.Item>
					</Col>
					<Col span={2} />
					<Col span={10}>
						<Form.Item
							{...tailLayout}
							labelAlign={"left"}
							label="Địa chỉ liên lạc"
						>
							<Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.c_ref_second_address} value={infoCustomer.c_ref_second_address} onChange={(_) => { updateTextField(_, 'c_ref_second_address') }} />
						</Form.Item>
					</Col>
				</Row>

				<Row>
					<Col span={10}>
						<Form.Item
							{...tailLayout}
							labelAlign={"left"}
							label="Điện thoại"
						>
							<Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.c_ref_first_phone} value={infoCustomer.c_ref_first_phone} onChange={(_) => { updateTextField(_, 'c_ref_first_phone') }} />
						</Form.Item>
					</Col>
					<Col span={2} />
					<Col span={10}>
						<Form.Item
							{...tailLayout}
							labelAlign={"left"}
							label="Điện thoại"
						>
							<Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.c_ref_second_phone} value={infoCustomer.c_ref_second_phone} onChange={(_) => { updateTextField(_, 'c_ref_second_phone') }} />
						</Form.Item>
					</Col>
				</Row>


				<Row>
					<Col span={10}>
						<Form.Item
							{...tailLayout}
							labelAlign={"left"}
							label="Đơn vị công tác"
						>
							<Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.c_ref_first_work} value={infoCustomer.c_ref_first_work} onChange={(_) => { updateTextField(_, 'c_ref_first_work') }} />
						</Form.Item>
					</Col>
					<Col span={2} />
					<Col span={10}>
						<Form.Item
							{...tailLayout}
							labelAlign={"left"}
							label="Đơn vị công tác"
						>
							<Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.c_ref_second_work} value={infoCustomer.c_ref_second_work} onChange={(_) => { updateTextField(_, 'c_ref_second_work') }} />
						</Form.Item>
					</Col>
				</Row>

				<p><b>VI. THÔNG TIN TÀI CHÍNH VÀ NGUỒN TRẢ NỢ</b></p>
				<Row>
					<Col span={10}>
						<Form.Item
							labelAlign={"left"}
							name="income_average"
							// name="income_validate"
							label={<b>1.Thu nhập bq tháng của KH</b>}
							rules={[{ required: true, message: 'Vui lòng nhập thu nhập bq tháng của KH!' }]}
						>
							<span class="ant-input-affix-wrapper ant-input-affix-wrapper-borderless">
								<NumberFormat
									customInput={Input}
									thousandSeparator={true}
									value={dataFill?.income_average || null}
									onValueChange={(_) => updateTextField(_, 'income_average')}
								/>
								<span class="ant-input-suffix">VND</span>
							</span>
							{/* <Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.income_average} value={infoCustomer.income_average} onChange={(_) => { updateTextField(_, 'income_average') }} suffix="VND" /> */}

						</Form.Item>
					</Col>
					<Col span={2} />
					<Col span={10}>
						<Form.Item
							labelAlign={"left"}
							label={<b>3.Tổng chi phí hàng tháng</b>}
							// name="total_validate"
							name="total_cost"
							rules={[{ required: true, message: 'Vui lòng nhập tổng chi phí hàng tháng!' }]}
						>

							<span class="ant-input-affix-wrapper ant-input-affix-wrapper-borderless">
								<NumberFormat
									customInput={Input}
									thousandSeparator={true}
									value={dataFill?.total_cost || null}
									// defaultValue={dataFill.total_cost || 0}
									onValueChange={(_) => updateTextField(_, 'total_cost')}
								/>
								<span class="ant-input-suffix">VND</span>
							</span>
							{/* <Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.total_cost} value={infoCustomer.total_cost} onChange={(_) => { updateTextField(_, 'total_cost') }} suffix="VND" /> */}
						</Form.Item>
					</Col>
				</Row>

				<Row>
					<Col span={10}>
						<Form.Item
							labelAlign={"left"}
							label="Lương cố định"
							name="fixed_salary"
							rules={[{ required: true, message: 'Vui lòng nhập lương cố định!' }]}
						>
							<span class="ant-input-affix-wrapper ant-input-affix-wrapper-borderless">
								<NumberFormat
									customInput={Input}
									thousandSeparator={true}
									value={dataFill?.fixed_salary || null}
									// defaultValue={dataFill.total_cost || 0}
									onValueChange={(_) => updateTextField(_, 'fixed_salary')}
								/>
								<span class="ant-input-suffix">VND</span>
							</span>
							{/* <Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.fixed_salary} value={infoCustomer.fixed_salary} onChange={(_) => { updateTextField(_, 'fixed_salary') }} suffix="VND" /> */}
						</Form.Item>
					</Col>
					<Col span={2} />
					<Col span={10}>
						<Form.Item
							labelAlign={"left"}
							label="Chi phí sinh hoạt"
							name="cost_live"
							rules={[{ required: true, message: 'Vui lòng nhập chi phí sinh hoạt!' }]}
						>
							<span class="ant-input-affix-wrapper ant-input-affix-wrapper-borderless">
								<NumberFormat
									customInput={Input}
									thousandSeparator={true}
									value={dataFill?.cost_live || null}
									// defaultValue={dataFill.total_cost || 0}
									onValueChange={(_) => updateTextField(_, 'cost_live')}
								/>
								<span class="ant-input-suffix">VND</span>
							</span>
							{/* <Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.cost_live} value={infoCustomer.cost_live} onChange={(_) => { updateTextField(_, 'cost_live') }} suffix="VND" /> */}
						</Form.Item>
					</Col>
				</Row>

				<Row>
					<Col span={10}>
						<Form.Item
							labelAlign={"left"}
							label="Thu nhập khác"
							name="income_difference"
							rules={[{ required: true, message: 'Vui lòng nhập thu nhập khác!' }]}
						>
							<span class="ant-input-affix-wrapper ant-input-affix-wrapper-borderless">
								<NumberFormat
									customInput={Input}
									thousandSeparator={true}
									value={dataFill?.income_difference || null}
									// defaultValue={dataFill.total_cost || 0}
									onValueChange={(_) => updateTextField(_, 'income_difference')}
								/>
								<span class="ant-input-suffix">VND</span>
							</span>
							{/* <Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.income_difference} value={infoCustomer.income_difference} onChange={(_) => { updateTextField(_, 'income_difference') }} suffix="VND" /> */}
						</Form.Item>
					</Col>
					<Col span={2} />
					<Col span={10}>
						<Form.Item
							labelAlign={"left"}
							label="Chi phí trả nợ khoản vay hiện hữu"
							name="cost_loan"
						>
							<span class="ant-input-affix-wrapper ant-input-affix-wrapper-borderless">
								<NumberFormat
									customInput={Input}
									thousandSeparator={true}
									value={dataFill?.cost_loan || null}
									// defaultValue={dataFill.total_cost || 0}
									onValueChange={(_) => updateTextField(_, 'cost_loan')}
								/>
								<span class="ant-input-suffix">VND</span>
							</span>
							{/* <Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.cost_loan} value={infoCustomer.cost_loan} onChange={(_) => { updateTextField(_, 'cost_loan') }} suffix="VND" /> */}
						</Form.Item>
					</Col>
				</Row>

				<Row>
					<Col span={10}>
						<Form.Item
							labelAlign={"left"}
							label={<b>2.Thu nhập bq tháng của vợ/chồng</b>}
							name="income_average_family"
						>
							<span class="ant-input-affix-wrapper ant-input-affix-wrapper-borderless">
								<NumberFormat
									customInput={Input}
									thousandSeparator={true}
									value={dataFill?.income_average_family || null}
									// defaultValue={dataFill.total_cost || 0}
									onValueChange={(_) => updateTextField(_, 'income_average_family')}
								/>
								<span class="ant-input-suffix">VND</span>
							</span>
							{/* <Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.income_average_family} value={infoCustomer.income_average_family} onChange={(_) => { updateTextField(_, 'income_average_family') }} suffix="VND" /> */}
						</Form.Item>
					</Col>
					<Col span={2} />
					<Col span={10}>
						<Form.Item
							labelAlign={"left"}
							label="Chi phí khác"
							name="cost_deference"
						>
							<span class="ant-input-affix-wrapper ant-input-affix-wrapper-borderless">
								<NumberFormat
									customInput={Input}
									thousandSeparator={true}
									value={dataFill?.cost_deference || null}
									// defaultValue={dataFill.total_cost || 0}
									onValueChange={(_) => updateTextField(_, 'cost_deference')}
								/>
								<span class="ant-input-suffix">VND</span>
							</span>
							{/* <Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.cost_deference} value={infoCustomer.cost_deference} onChange={(_) => { updateTextField(_, 'cost_deference') }} suffix="VND" /> */}
						</Form.Item>
					</Col>
				</Row>

				<Row>
					<Col span={10}>
						<Form.Item
							labelAlign={"left"}
							label="Lương cố định"
							name="fixed_salary_family"
						>
							<span class="ant-input-affix-wrapper ant-input-affix-wrapper-borderless">
								<NumberFormat
									customInput={Input}
									thousandSeparator={true}
									value={dataFill?.fixed_salary_family || null}
									// defaultValue={dataFill.total_cost || 0}
									onValueChange={(_) => updateTextField(_, 'fixed_salary_family')}
								/>
								<span class="ant-input-suffix">VND</span>
							</span>
							{/* <Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.fixed_salary_family} value={infoCustomer.fixed_salary_family} onChange={(_) => { updateTextField(_, 'fixed_salary_family') }} suffix="VND" /> */}
						</Form.Item>
					</Col>
					<Col span={2} />
				</Row>
				<Row>
					<Col span={10}>
						<Form.Item
							labelAlign={"left"}
							label="Thu nhập khác"
							name="income_difference_family"
						>
							<span class="ant-input-affix-wrapper ant-input-affix-wrapper-borderless">
								<NumberFormat
									customInput={Input}
									thousandSeparator={true}
									value={dataFill?.income_difference_family || null}
									// defaultValue={dataFill.total_cost || 0}
									onValueChange={(_) => updateTextField(_, 'income_difference_family')}
								/>
								<span class="ant-input-suffix">VND</span>
							</span>
							{/* <Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.income_difference_family} value={infoCustomer.income_difference_family} onChange={(_) => { updateTextField(_, 'income_difference_family') }} suffix="VND" /> */}
						</Form.Item>
					</Col>
					<Col span={2} />
				</Row>

				<Row>
					<Col span="7"></Col>
					<Col span="10">
						<Form.Item
							label="Thu nhập tích lũy hàng tháng (1+2 - 3)"
							name="income_accumulated"
						>
							<span class="ant-input-affix-wrapper ant-input-affix-wrapper-borderless">
								<NumberFormat
									customInput={Input}
									thousandSeparator={true}
									value={dataFill?.income_accumulated || null}
									// defaultValue={dataFill.total_cost || 0}
									onValueChange={(_) => updateTextField(_, 'income_accumulated')}
								/>
								<span class="ant-input-suffix">VND</span>
							</span>
							{/* <Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.income_accumulated} value={infoCustomer.income_accumulated} onChange={(_) => { updateTextField(_, 'income_accumulated') }} width="100px" suffix="VND" /> */}
						</Form.Item>
					</Col>
					<Col span="7"></Col>
				</Row>
				<p><b>VI. THÔNG TIN NƠI LẮP ĐẶT HỆ THỐNG NĂNG LƯỢNG MẶT TRỜI</b></p>
				<b>Thông tin chung nơi lắp đặt:</b>
				<Row>
					<Col span={24}>
						<Form.Item
							labelAlign={"left"}
							label="Hình thức sở hữu"
							name="solar_ownership"
							rules={[{ required: true, message: 'Vui lòng chọn hình thức sở hữu!' }]}
						>
							<Radio.Group defaultValue={infoCustomer.solar_ownership} value={infoCustomer.solar_ownership} onChange={(_) => { updateTextField(_, 'solar_ownership') }}>
								<Radio value={1}>Chính chủ</Radio>
								<Radio value={2}>Đồng sở hữu</Radio>
								<Radio value={3}>Bảo lãnh bên thứ 3</Radio>
								<Radio value={4}>Thuê sử dụng</Radio>
							</Radio.Group>
						</Form.Item>
					</Col>
				</Row>

				<Row>
					<Col span={24}>
						<Form.Item
							labelAlign={"left"}
							label="Vị trí"
							name="solar_address"
							rules={[{ required: true, message: 'Vui lòng chọn vị trí!' }]}
						>
							<Radio.Group defaultValue={infoCustomer.solar_address} value={infoCustomer.solar_address} onChange={(_) => { updateTextField(_, 'solar_address') }}>
								<Radio value={1}> Khu dân cư </Radio>
								<Radio value={2}>Khu công nghiệp</Radio>
								<Radio value={3}>Khu đô thị</Radio>
							</Radio.Group>
						</Form.Item>
					</Col>
				</Row>
				<b>Thông tin tiêu thụ điện:</b>

				<Row>
					<Col span={24}>
						<Form.Item
							labelAlign={"left"}
							label="Hình thực sử dụng điện"
							name="form_power"
							rules={[{ required: true, message: 'Vui lòng chọn hình thực sử dụng điện!' }]}
						>
							<Radio.Group defaultValue={infoCustomer.form_power} value={infoCustomer.form_power} onChange={(_) => { updateTextField(_, 'form_power') }}>
								<Radio value={1}>Sinh hoạt  </Radio>
								<Radio value={2}>Kinh doanh</Radio>
								<Radio value={3}>Sản xuất</Radio>
							</Radio.Group>
						</Form.Item>
					</Col>
				</Row>
				<Row>
					<Col span={SPAN_ONE_FIELD}>
						<Form.Item {...tailLayout}
							labelAlign={"left"}
							label="Mã khách hàng điện lực"
							name="c_power_code"
							rules={[{ required: true, message: 'Vui lòng nhập mã khách hàng điện lực!' }]}
						>
							<Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.c_power_code} value={infoCustomer.c_power_code} onChange={(_) => { updateTextField(_, 'c_power_code') }} />
						</Form.Item>
					</Col>
				</Row>

				<Row>
					<Col span={SPAN_ONE_FIELD}>
						<Form.Item {...tailLayout}
							labelAlign={"left"}
							label="Hợp đồng mua điện"
							name="power_agreement"
							rules={[{ required: true, message: 'Vui lòng nhập hợp đồng mua điện!' }]}
						>
							<Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.power_agreement} value={infoCustomer.power_agreement} onChange={(_) => { updateTextField(_, 'power_agreement') }} />
						</Form.Item>
					</Col>
					<Col span={6}>
						<Form.Item {...tailLayout}
							labelAlign={"left"}
							label="Ngày ký"
							// name="contract_date_electricity"
							name="sign_date"
							rules={[{ required: true, message: 'Vui lòng chọn ngày ký!' }]}
						>
							{/* <DatePicker format={FORMAT_DATE} bordered={false} placeholder="Ngày ký" format={FORMAT_DATE} defaultValue={moment(infoCustomer.contract_date_electricity, FORMAT_DATE)} value={moment(infoCustomer.contract_date_electricity, FORMAT_DATE)} onChange={(_) => { updateDateField(_, 'contract_date_electricity') }} /> */}
							<DatePicker format={FORMAT_DATE} bordered={false} placeholder="Ngày ký" format={FORMAT_DATE} defaultValue={moment(infoCustomer?.sign_date, FORMAT_DATE)} value={moment(infoCustomer?.sign_date, FORMAT_DATE)} onChange={(_) => { updateDateField(_, 'sign_date') }} />
						</Form.Item>
					</Col>
				</Row>

				<Row>
					<Col span={SPAN_ONE_FIELD}>
						<Form.Item
							labelAlign={"left"}
							label="Đơn vị Điện lực ký hợp đồng bán điện"
							name="power_unit_sign_contract"
							rules={[{ required: true, message: 'Vui lòng nhập đơn vị Điện lực ký hợp đồng bán điện!' }]}
						>
							<Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.power_unit_sign_contract} value={infoCustomer.power_unit_sign_contract} onChange={(_) => { updateTextField(_, 'power_unit_sign_contract') }} />
						</Form.Item>
					</Col>
				</Row>

				<Row>
					<Col span={SPAN_ONE_FIELD}>
						<Form.Item
							labelAlign={"left"}
							label="Điện lượng tiêu thụ bq 06 tháng"
							name="power_consume_half_year"
							rules={[{ required: true, message: 'Vui lòng nhập điện lượng tiêu thụ bq 06 tháng!' }]}
						>

							<span className="ant-input-affix-wrapper ant-input-affix-wrapper-borderless">
								<NumberFormat
									customInput={Input}
									thousandSeparator={true}
									value={dataFill?.power_consume_half_year || null}
									// defaultValue={dataFill.total_cost || 0}
									onValueChange={(_) => updateTextField(_, 'power_consume_half_year')}
								/>
								<span className="ant-input-suffix">kWh</span>
							</span>

							{/* <Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.power_consume_half_year} value={infoCustomer.power_consume_half_year} onChange={(_) => { updateTextField(_, 'power_consume_half_year') }} suffix="kWh" /> */}
						</Form.Item>
					</Col>
				</Row>

				<Row>
					<Col span={SPAN_ONE_FIELD}>
						<Form.Item
							labelAlign={"left"}
							label="Thời gian tiêu thu điện chủ yếu"
							name="start_hour_consume"
							rules={[{ required: false, message: 'Vui lòng nhập thời gian tiêu thu điện chủ yếu!' }]}
						>
							Từ <Input defaultValue={infoCustomer.start_hour_consume} value={infoCustomer.start_hour_consume} onChange={(_) => { updateTextField(_, 'start_hour_consume') }} bordered={IS_BORDER_INPUT} style={{ "width": "100px" }} /> giờ đến <Input defaultValue={infoCustomer.end_hour_consume} value={infoCustomer.end_hour_consume} onChange={(_) => { updateTextField(_, 'end_hour_consume') }} bordered={IS_BORDER_INPUT} style={{ "width": "100px" }} /> giờ
					</Form.Item>
					</Col>
				</Row>


				<Row>
					<Col span={SPAN_ONE_FIELD}>
						<Form.Item
							labelAlign={"left"}
							label="Công suất tiêu thụ bq ban ngày"
							name="percent_consum"
							rules={[{ required: true, message: 'Vui lòng nhập suất tiêu thụ bq ban ngày!' }]}
						>
							<span className="ant-input-affix-wrapper ant-input-affix-wrapper-borderless">
								<NumberFormat
									customInput={Input}
									thousandSeparator={true}
									value={dataFill?.percent_consum || null}
									// defaultValue={dataFill.total_cost || 0}
									onValueChange={(_) => updateTextField(_, 'percent_consum')}
								/>
								<span className="ant-input-suffix">%/cả ngày</span>
							</span>
							{/* <Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.percent_consum} value={infoCustomer.percent_consum} onChange={(_) => { updateTextField(_, 'percent_consum') }} suffix="%/cả ngày" /> */}
						</Form.Item>
					</Col>
				</Row>

				<p><b>VI. PHƯƠNG ÁN ĐẦU TƯ</b></p>
				<b>1. Khả năng lắp tấm pin</b> <i>(tham khảo kết quả khảo sát của tư vấn)</i>

				<Row>
					<Col span={24}>
						<Form.Item
							labelAlign={"left"}
							label="Loại nhà ở"
							name="house_type"
							rules={[{ required: true, message: 'Vui lòng chọn loại nhà ở!' }]}
						>
							<Radio.Group defaultValue={infoCustomer.house_type} value={infoCustomer.house_type} onChange={(_) => { updateTextField(_, 'house_type') }}>
								<Radio value={1}>Biệt thự   </Radio>
								<Radio value={2}>Nhà phân lô </Radio>
								<Radio value={3}>Nhà 5 – 7 tầng</Radio>
								<Radio value={4}>Nhà cấp 4 </Radio>
								<Radio value={5}>Chung cư</Radio>
							</Radio.Group>
						</Form.Item>
					</Col>
				</Row>

				<Row>
					<Col span={24}>
						<Form.Item
							labelAlign={"left"}
							label="Kiểu cách mái lắp đặt tấm pin"
							name="roof_panel_style"
							rules={[{ required: true, message: 'Vui lòng chọn kiểu cách mái lắp đặt tấm pin!' }]}
						>
							<Radio.Group defaultValue={infoCustomer.roof_panel_style} value={infoCustomer.roof_panel_style} onChange={(_) => { updateTextField(_, 'roof_panel_style') }}>
								<Radio value={1}>Mái tôn   </Radio>
								<Radio value={2}>Mái bằng </Radio>
								<Radio value={3}>Mái ngói</Radio>
							</Radio.Group>
						</Form.Item>
					</Col>
				</Row>

				<Row>
					<Col span={6}>
						<Form.Item
							labelAlign={"left"}
							label="Diện tích mái"
							name="roof_area"
							rules={[{ required: true, message: 'Vui lòng nhập diện tích mái!' }]}
						>
							<span className="ant-input-affix-wrapper ant-input-affix-wrapper-borderless">
								<NumberFormat
									customInput={Input}
									thousandSeparator={true}
									value={dataFill?.roof_area || null}
									// defaultValue={dataFill.total_cost || 0}
									onValueChange={(_) => updateTextField(_, 'roof_area')}
								/>
							</span>
							{/* <Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.roof_area} value={infoCustomer.roof_area} onChange={(_) => { updateTextField(_, 'roof_area') }} /> */}
						</Form.Item>
					</Col>
					<Col span={1}></Col>
					<Col span={6}>
						<Form.Item
							labelAlign={"left"}
							label="Diện tích lắp đặt tấm pin"
							name="roof_panel_type"
							rules={[{ required: true, message: 'Vui lòng nhập diện tích lắp đặt tấm pin!' }]}
						>
							<span className="ant-input-affix-wrapper ant-input-affix-wrapper-borderless">
								<NumberFormat
									customInput={Input}
									thousandSeparator={true}
									value={dataFill?.roof_panel_type || null}
									// defaultValue={dataFill.total_cost || 0}
									onValueChange={(_) => updateTextField(_, 'roof_panel_type')}
								/>
							</span>
							{/* <Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.roof_panel_type} value={infoCustomer.roof_panel_type} onChange={(_) => { updateTextField(_, 'roof_panel_type') }} /> */}
						</Form.Item>
					</Col>
					<Col span={1}></Col>
					<Col span={7}>
						<Form.Item
							labelAlign={"left"}
							label="Số năm đã qua sử dụng của mái"
							name="roof_year_use"
							rules={[{ required: true, message: 'Vui lòng nhập số năm đã qua sử dụng của mái!' }]}
						>
							<Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.roof_year_use} value={infoCustomer.roof_year_use} onChange={(_) => { updateTextField(_, 'roof_year_use') }} />
						</Form.Item>
					</Col>
				</Row>

				<Row>
					<Col span={SPAN_TWO_FIELD}>
						<Form.Item
							labelAlign={"left"}
							label="Mật độ bóng râm che phủ"
							name="shade_density"
							rules={[{ required: true, message: 'Vui lòng nhập mật độ bóng râm che phủ!' }]}
						>
							<Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.shade_density} value={infoCustomer.shade_density} onChange={(_) => { updateTextField(_, 'shade_density') }} />
						</Form.Item>
					</Col>
					<Col span={2}></Col>
					<Col span={SPAN_TWO_FIELD}>
						<Form.Item
							labelAlign={"left"}
							label="Khoảng cách pin-inverter"
							name="range_pin_inverter"
							rules={[{ required: true, message: 'Vui lòng nhập khoảng cách pin-inverter!' }]}
						>
							<Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.range_pin_inverter} value={infoCustomer.range_pin_inverter} onChange={(_) => { updateTextField(_, 'range_pin_inverter') }} />
						</Form.Item>
					</Col>
				</Row>

				<Row>
					<Col span={SPAN_TWO_FIELD}>
						<Form.Item
							labelAlign={"left"}
							label="An toàn phòng cháy"
							name="fire_safety"
							rules={[{ required: true, message: 'Vui lòng chọn an toàn phòng cháy!' }]}
						>
							<Radio.Group defaultValue={infoCustomer.fire_safety} value={infoCustomer.fire_safety} onChange={(_) => { updateTextField(_, 'fire_safety') }}>
								<Radio value={true}>Đạt   </Radio>
								<Radio value={false}>Không </Radio>
							</Radio.Group>
						</Form.Item>
					</Col>
					<Col span={2}></Col>
					<Col span={SPAN_TWO_FIELD}>
						<Form.Item
							labelAlign={"left"}
							label="An ninh khu vực"
							name="regional_security"
							rules={[{ required: true, message: 'Vui lòng chọn an ninh khu vực!' }]}
						>
							<Radio.Group defaultValue={infoCustomer.regional_security} value={infoCustomer.regional_security} onChange={(_) => { updateTextField(_, 'regional_security') }}>
								<Radio value={true}>Đạt   </Radio>
								<Radio value={false}>Không </Radio>
							</Radio.Group>
						</Form.Item>
					</Col>
				</Row>

				<Row>
					<Col>
						<Form.Item
							labelAlign={"left"}
							label="Khả năng lắp đặt ĐMTMN"
							name="installability"
							rules={[{ required: true, message: 'Vui lòng chọn khả năng lắp đặt ĐMTMN!' }]}
						>
							<Radio.Group defaultValue={infoCustomer.installability} value={infoCustomer.installability} onChange={(_) => { updateTextField(_, 'installability') }}>
								<Radio value={true}>Có   </Radio>
								<Radio value={false}>Không </Radio>
							</Radio.Group>
						</Form.Item>
					</Col>
				</Row>

				<b>2.Hiệu quả đầu tư</b> <i>(tham khảo kết quả khảo sát của tư vấn và dựng lại mô hình)</i>
				<div><b>Bức xạ mặt trời</b></div>

				<Row>
					<Col span={SPAN_TWO_FIELD}>
						<Form.Item
							labelAlign={"left"}
							label="Vùng bức xạ"
							name="radiation_zone"
							rules={[{ required: true, message: 'Vui lòng chọn vùng bức xạ!' }]}
						>
							<Radio.Group defaultValue={infoCustomer.radiation_zone} value={infoCustomer.radiation_zone} onChange={(_) => { updateTextField(_, 'radiation_zone') }}>
								<Radio value={1}>Tốt</Radio>
								<Radio value={2}>Trung bình </Radio>
								<Radio value={3}>Thấp </Radio>
							</Radio.Group>
						</Form.Item>
					</Col>
					<Col span={2}></Col>
					<Col span={SPAN_TWO_FIELD}>
						<Form.Item
							labelAlign={"left"}
							label="Cường độ bức xạ"
							name="radiation_intensity"
							rules={[{ required: true, message: 'Vui lòng nhập cường độ bức xạ!' }]}
						>
							<Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.radiation_intensity} value={infoCustomer.radiation_intensity} onChange={(_) => { updateTextField(_, 'radiation_intensity') }} />
						</Form.Item>
					</Col>
				</Row>
				<div><b>Thiết bị đầu tư</b></div>


				<Row>
					<Col span={SPAN_TWO_FIELD}>
						<Form.Item
							labelAlign={"left"}
							label="Công suất đầu tư"
							name="investment_capacity"
							rules={[{ required: true, message: 'Vui lòng nhập công suất đầu tư!' }]}
						>
							<Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.investment_capacity} value={infoCustomer.investment_capacity} onChange={(_) => { updateTextField(_, 'investment_capacity') }} />
						</Form.Item>
					</Col>
					<Col span={2}></Col>
					<Col span={SPAN_TWO_FIELD}>
						<Form.Item
							labelAlign={"left"}
							label="Loại Pin"
							name="battery_type"
							rules={[{ required: true, message: 'Vui lòng nhập loại pin!' }]}
						>
							<Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.battery_type} value={infoCustomer.battery_type} onChange={(_) => { updateTextField(_, 'battery_type') }} />
						</Form.Item>
					</Col>
				</Row>


				<Row>
					<Col span={SPAN_TWO_FIELD}>
						<Form.Item
							labelAlign={"left"}
							label="Chi phí đầu tư"
							name="investment_cost"
							rules={[{ required: true, message: 'Vui lòng nhập chi phí đầu tư!' }]}
						>
							<Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.investment_cost} value={infoCustomer.investment_cost} onChange={(_) => { updateTextField(_, 'investment_cost') }} />
						</Form.Item>
					</Col>
					<Col span={2}></Col>
					<Col span={SPAN_TWO_FIELD}>
						<Form.Item
							labelAlign={"left"}
							label="Loại Inverter"
							name="inverter_type"
							rules={[{ required: true, message: 'Vui lòng nhập loại Inverter!' }]}
						>
							<Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.inverter_type} value={infoCustomer.inverter_type} onChange={(_) => { updateTextField(_, 'inverter_type') }} />
						</Form.Item>
					</Col>
				</Row>
				<b>Điện lượng tiêu thụ sau khi lắp đặt ĐMTMN</b>

				<Row>
					<Col span={SPAN_TWO_FIELD}>
						<Form.Item
							labelAlign={"left"}
							label="Điện lượng bán bq hàng tháng"
							name="power_sold_average"
							rules={[{ required: true, message: 'Vui lòng nhập điện lượng bán bq hàng tháng!' }]}
						>
							<span class="ant-input-affix-wrapper ant-input-affix-wrapper-borderless">
								<NumberFormat
									customInput={Input}
									thousandSeparator={true}
									value={dataFill?.power_sold_average || null}
									// defaultValue={dataFill.total_cost || 0}
									onValueChange={(_) => updateTextField(_, 'power_sold_average')}
								/>
								<span class="ant-input-suffix">kWh</span>
							</span>
							{/* <Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.power_sold_average} value={infoCustomer.power_sold_average} onChange={(_) => { updateTextField(_, 'power_sold_average') }} suffix="kWh" /> */}
						</Form.Item>
					</Col>
					<Col span={2}></Col>
					<Col span={SPAN_TWO_FIELD}>
						<Form.Item
							labelAlign={"left"}
							label="Điện lượng tiết kiệm bq hàng tháng"
							name="power_save_average"
							rules={[{ required: true, message: 'Vui lòng nhập điện lượng tiết kiệm bq hàng tháng!' }]}
						>
							<span class="ant-input-affix-wrapper ant-input-affix-wrapper-borderless">
								<NumberFormat
									customInput={Input}
									thousandSeparator={true}
									value={dataFill?.power_save_average || null}
									// defaultValue={dataFill.total_cost || 0}
									onValueChange={(_) => updateTextField(_, 'power_save_average')}
								/>
								<span class="ant-input-suffix">kWh</span>
							</span>
							{/* <Input bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.power_save_average} value={infoCustomer.power_save_average} onChange={(_) => { updateTextField(_, 'power_save_average') }} suffix="kWh" /> */}
						</Form.Item>
					</Col>
				</Row>

				<Row>
					<Col span={SPAN_TWO_FIELD}>
						<Form.Item
							labelAlign={"left"}
							label="Doanh số bán điện bq hàng tháng"
							name="power_sales_average"
							rules={[{ required: true, message: 'Vui lòng nhập doanh số bán điện bq hàng tháng!' }]}
						>
							<span class="ant-input-affix-wrapper ant-input-affix-wrapper-borderless">
								<NumberFormat
									customInput={Input}
									thousandSeparator={true}
									value={dataFill?.power_sales_average || null}
									// defaultValue={dataFill.total_cost || 0}
									onValueChange={(_) => updateTextField(_, 'power_sales_average')}
								/>
								<span class="ant-input-suffix">VNĐ</span>
							</span>
							{/* <Input suffix="VNĐ" bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.power_sales_average} value={infoCustomer.power_sales_average} onChange={(_) => { updateTextField(_, 'power_sales_average') }} /> */}
						</Form.Item>
					</Col>
					<Col span={2}></Col>
					<Col span={SPAN_TWO_FIELD}>
						<Form.Item
							labelAlign={"left"}
							label="Doanh số tích kiệm bq hàng tháng"
							name="sales_save_average"
							rules={[{ required: true, message: 'Vui lòng nhập doanh số tích kiệm bq hàng tháng!' }]}
						>
							<span class="ant-input-affix-wrapper ant-input-affix-wrapper-borderless">
								<NumberFormat
									customInput={Input}
									thousandSeparator={true}
									value={dataFill?.sales_save_average || null}
									// defaultValue={dataFill.total_cost || 0}
									onValueChange={(_) => updateTextField(_, 'sales_save_average')}
								/>
								<span class="ant-input-suffix">kWh</span>
							</span>
							{/* <Input suffix="kWh" bordered={IS_BORDER_INPUT} defaultValue={infoCustomer.sales_save_average} value={infoCustomer.sales_save_average} onChange={(_) => { updateTextField(_, 'sales_save_average') }} /> */}
						</Form.Item>
					</Col>
				</Row>
				<b>Mô phỏng hiệu quả điện lượng</b>
				<Form.Item
					name="simulate_efficiency"
					rules={[{ required: true, message: 'Vui lòng chọn mô phỏng hiệu quả điện lượng!' }]}
				>
					<Radio.Group defaultValue={infoCustomer.simulate_efficiency} value={infoCustomer.simulate_efficiency} onChange={(_) => { updateTextField(_, 'simulate_efficiency') }}>
						<Row>

							<Col span={SPAN_TWO_FIELD}>
								<Radio value={1}>Chỉ bán, không dùng (ít xảy ra)</Radio>

								<div>
									<img width="100%" height="100%" src={picture1} />
								</div>
							</Col>

							<Col span={2}></Col>
							<Col span={SPAN_TWO_FIELD}>
								<Radio value={2}>Chỉ dùng, không bán (phổ biến)</Radio>
								<div><img width="100%" height="100%" src={picture2} /></div>
							</Col>
						</Row>
						<Row>
							<Col span={SPAN_TWO_FIELD}>
								<Radio value={3}>Bán nhiều, dùng ít (hộ nhỏ)</Radio>
								<div><img width="100%" height="100%" src={picture3} /></div>
							</Col>

							<Col span={2}></Col>
							<Col span={SPAN_TWO_FIELD}>
								<Radio value={4}>Bán ít, dùng nhiều (hộ lớn)</Radio>
								<div><img width="100%" height="100%" src={picture4} /></div>
							</Col>
						</Row>
					</Radio.Group>
				</Form.Item>
				<p><b>VII. XÁC NHẬN</b></p>
				<div>Chúng tôi cam kết rằng các thông tin trên là đúng sự thật và hoàn toàn chịu trách nhiệm trước pháp luật đối với các thông tin đã cung cấp. </div>
			</Form>
		</Modal>
	)
}

export default InfoCustomer;