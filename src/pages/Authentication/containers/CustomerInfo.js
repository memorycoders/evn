import React, { useEffect, useState, useRef } from 'react';
import { Upload, Col, DatePicker, Form, Input, Radio, Row, Popover, Select, Table, InputNumber, Button } from 'antd';
import '../../../styles/survey.scss';
import Modal from 'antd/lib/modal/Modal';
import http from '../../../apis/http';
import upFile from '../../../asset/images/icon-upFile.png';
import download from '../../../asset/images/icon-download.png';
import detailFile from '../../../asset/images/icon-detailFile.png';
import update from 'immer';
import { downloadFile } from '../../../store/loans/action';
import { connect } from "react-redux";
import { history } from "../../../utils/history";
import moment from 'moment'
import NumberFormat from 'react-number-format';
import { BASE_URL } from "../../../utils/constants";
import {
	UploadOutlined,
	MoreOutlined,
	CheckCircleOutlined,
	CloseCircleOutlined,
	LeftOutlined,
	RightOutlined
} from '@ant-design/icons';
import { NotificationError, NotificationSuccess } from "../../../common/components/Notification";
const CustomerInfo = (props) => {
	const baseURL = BASE_URL
	const { isShowInfoCustomer, showInfoCustomer } = props;
	const [form] = Form.useForm();
	const [isEdit, setIsEdit] = useState(false);
	const [city, setCity] = useState([]);
	const [distric, setDistric] = useState([]);
	const FORMAT_DATE = ["DD-MM-YYYY", "DD/MM/YYYY"];
	const [visibleModalDetail, setVisibleModalDetail] = useState(false);
	const [url, setUrl] = useState('');
	const [isDoc, setIsDoc] = useState(false);
	const [max, setCurrentMax] = useState(10);
	const [currentPage, setCurrentPage] = useState(0);
	const [row, setRow] = useState({});
	const modalRef = useRef();
	const handleDownloadFile = async (payload, label) => {

		console.log("payload", payload);

		try {
			let url = []
			const data = payload.forEach((item, index) => {
				url.push(item.file_uuid)
			})
			// const rs = await http.get(`web/loans/ftps/download?file_uuid=${payload[0].file_uuid}`);
			// const rs = await http.get(`document-service/v1/download/files?app_id=1&file_uuids=${url}`);
			const URL = `${BASE_URL}document-service/v1/download/files?app_id=1&file_uuids=${url}&label=${label}`
			window.open(URL, '_blank');
		} catch (ex) {
			console.log("ex", ex);
			return NotificationError("", ex.message);
		}
	}
	// const [dataSource, setDataSource] = useState([
	// 	{
	// 		key: "1",
	// 		name: "CMND/CCCD/Hộ chiếu người vay và vợ (chồng) của người đi vay (nếu đã kết hôn)",
	// 		status: false,
	// 		label: 1,
	// 		files: [],
	// 	},
	// 	{
	// 		key: "2",
	// 		name: 'Hộ khẩu thường trú/ KT3 /Đăng ký kết hôn',
	// 		status: false,
	// 		label: 2,
	// 		files: [],
	// 	},
	// 	{
	// 		key: "3",
	// 		name: 'HĐLĐ/Quyết định bổ nhiệm/chứng từ tương đương',
	// 		status: false,
	// 		label: 3,
	// 		files: [],
	// 	},
	// 	{
	// 		key: "4",
	// 		name: 'Giấy tờ chứng minh thu nhập khác (hợp đồng mua bán nhà, Hợp đồng cho thuê xe)',
	// 		status: false,
	// 		label: 4,
	// 		files: [],
	// 	},
	// 	{
	// 		key: "5",
	// 		name: 'Sao kê tài khoản lương 3 tháng gần nhất',
	// 		status: false,
	// 		label: 5,
	// 		files: [],
	// 	},
	// 	{
	// 		key: "6",
	// 		name: 'Kết quả khảo sát nhu cầu lắp đặt trên EVNSolar',
	// 		status: false,
	// 		label: 6,
	// 		files: [],
	// 	},
	// 	{
	// 		key: "7",
	// 		name: 'Ảnh chụp mái nhà ở 3- 5 góc chụp khác nhau',
	// 		status: false,
	// 		label: 7,
	// 		files: [],
	// 	},
	// 	{
	// 		key: "8",
	// 		name: 'Hóa đơn tiền điện (Hóa đơn tiền điện hoặc báo cáo tiêu thụ điện từ cổng CSKH của điện lực trong 6 tháng gần nhất)',
	// 		status: false,
	// 		label: 8,
	// 		files: [],
	// 	},
	// 	{
	// 		key: "9",
	// 		name: 'Xác nhận nhân viên',
	// 		status: false,
	// 		label: 9,
	// 		files: [],
	// 	}
	// ]);
	const [dataSource, setDataSource] = useState([
		{
			key: "1",
			name: "CMND/CCCD/Hộ chiếu",
			status: false,
			label: 1,
			files: [],
		},
		{
			key: "91",
			name: 'CMND/CCCD/Hộ chiếu ( vợ/ chồng)',
			status: false,
			label: 91,
			files: [],
		},
		{
			key: "2",
			name: 'Sổ hộ khẩu',
			status: false,
			label: 2,
			files: [],
		},
		{
			key: "92",
			name: 'Giấy đăng ký kết hôn ( Nếu có)',
			status: false,
			label: 92,
			files: [],
		},
		{
			key: "3",
			name: 'Hợp đồng lao động',
			status: false,
			label: 3,
			files: [],
		},
		{
			key: "93",
			name: 'Hợp đồng lao động ( vợ/ chồng)',
			status: false,
			label: 93,
			files: [],
		},
		{
			key: "9",
			name: 'Xác nhận nhân viên',
			status: false,
			label: 9,
			files: [],
		},
		{
			key: "94",
			name: 'Xác nhận nhân viên ( vợ/ chồng) ',
			status: false,
			label: 94,
			files: [],
		},
		{
			key: "95",
			name: 'Chứng minh thu nhập',
			status: false,
			label: 95,
			files: [],
		},
		{
			key: "96",
			name: 'Chứng minh thu nhập ( vợ chồng)',
			status: false,
			label: 96,
			files: [],
		}
	]);
	const columns = [
		{
			title: 'Loại hồ sơ',
			dataIndex: 'name',
			render: (name) => {
				return (
					<div style={{ textAlign: 'left' }}>{name}</div>
				)
			}
		},
		{
			title: 'Trạng thái',
			width: 160,
			dataIndex: "action",
			render: (text, record) => {


				return (
					<div>
						{record.files?.length > 0 ? <div className="attach-btn">
							<CheckCircleOutlined className="green" />
							<Popover
								content={<Row style={{ minWidth: 220 }}>
									<Col span={8} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '10px 0px', cursor: 'pointer' }}>
										{/* <img onClick={() => handleDownloadFile(record.files[0])} className="attach-icon" src={download} /> */}
										<img onClick={() => handleDownloadFile(record.files, record.label)} className="attach-icon" src={download} />
										Tải xuống
									</Col>
									<Col span={8}>
										{/* <Popconfirm
											title="Bạn có chắc muốn xóa file này?"
											onConfirm={() => confirmDel(record)}
											okText="Có" cancelText="Không"
										> */}
										<div onClick={() => {
											handleViewAttach(record, 0)
											setRow(record)
										}}
											style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '10px 0px', cursor: 'pointer' }}>
											<img className="attach-icon" src={detailFile} />
											Xem File
											</div>

										{/* </Popconfirm> */}
									</Col>
									<Col span={8}>
										<Upload multiple={true} className='attach-upload' beforeUpload={(info) => handleChangeFileUpload(info, record)}>
											<img style={{ cursor: 'pointer' }} className="attach-icon" src={upFile} />
											<div style={{ cursor: 'pointer' }}></div>Upload
										</Upload>
									</Col>
								</Row>}
								trigger="click"
							// visible={visibleGreen}
							// onVisibleChange={handleVisibleChangeGreen}
							>
								<MoreOutlined className="attach-more" />
							</Popover>
						</div>
							: <div className="attach-btn">
								<CloseCircleOutlined className="red" />
								<Popover
									className="red-popover"
									content={<div
										style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '10px 0px' }}
									>
										<Upload multiple={true} className='attach-upload' beforeUpload={(info) => handleChangeFileUpload(info, record)}>
											<img style={{ cursor: 'pointer' }} className="attach-icon" src={upFile} />
											<div style={{ cursor: 'pointer' }}></div>Upload
										</Upload>
									</div>}
									trigger="click"
								>
									<MoreOutlined className="attach-more" />
								</Popover>
							</div>}
					</div>
				)
			}
		}
	]
	const [infoCustomer, setInfoCustomer] = useState(
		{
			"permanent_address": "",
			"attachment_files": [],
			"contract_code": "",
			"permanent_district": "",
			"permanent_city": "",
			"fixed_income": 0,
			"personal_information":
			{
				"additional_emails_list": [],
				"additional_phone_numbers_list": [],
				"address": 'Viet Nam',
				"birthday": "2021-03-01",
				"permanent_address": "",
				"card_number": "",
				"email": "",
				"expiration_date": "2021-03-01",
				"gender": 1,
				"id_card_issued_date": "2021-03-01",
				"issued_by": "",
				"marital_status": 1,
				"name": "",
				"passport": "44444",
				"phone_number": "",
			},
			"register_amount": 0,
			"relative_persons":
				[
					{
						"address": "",
						"birthday": "",
						"card_number": "",
						"permanent_district": "",
						"email": "",
						"gender": 1,
						"id": 0,
						"id_card_issued_date": "",
						"name": "",
						"permanent_address": "",
						"phone_number": "",
						"permanent_city": "",
						"relation": 1,
					}
				],
			"submitting": true,
			"working_information": {
				"company_id": null,
				"contract_code": "",
				"department": "",
				"employee_code": "",
				"income": 0,
				"other_income": 0,
				"other_income_desc": "",
				"pay_forms": null,
				"position": "",
				"working_duration": null,
				"company_name": '',
				'working_address': '',
				'contract_type': null
			}
		}
	);
	const changeWorkingAddress = (e) => {
		if (e.target.value) {
			setInfoCustomer({
				...infoCustomer,
				working_information: {
					...infoCustomer.working_information,
					working_address: e.target.value,
				}
			})
		}
	}

	const changeComapnyName = (e) => {
		if (e.target.value) {
			setInfoCustomer({
				...infoCustomer,
				working_information: {
					...infoCustomer.working_information,
					company_name: e.target.value,
				}
			})
		}
	}

	const changeContractType = (e) => {
		setInfoCustomer({
			...infoCustomer,
			working_information: {
				...infoCustomer.working_information,
				contract_type: e
			}
		})

	}

	const handleChangeFileUpload = async (_file, record) => {
		try {
			let arr = [];
			let fd = new FormData();
			fd.append('files', _file)
			fd.append('label', record?.label)
			arr.push(fd);
			const rs = await http.post(`web/attachment-files/upload-loan-files`, fd);
			if (rs?.status === 200) {
				let attachment_list = infoCustomer.attachment_files;
				attachment_list.push(rs?.data?.data?.attachment_files?.[0]);
				setInfoCustomer({
					...infoCustomer,
					attachment_files: attachment_list,
				})
				NotificationSuccess("", "Tải lên thành công");
				let newSource = [...dataSource];
				newSource.forEach(element => {
					if (element.label === record.label) {
						let objectFile = {
							file_uuid: rs?.data?.data?.attachment_files?.[0]?.file_uuid,
							original_file_name: rs?.data?.data?.attachment_files?.[0]?.original_file_name
						}
						element.files.push(objectFile);
					}
				})

				setDataSource(newSource);
			}
		} catch (ex) {
			console.log(ex);
			return NotificationError("", ex.message);
		}
	}
	const handlePreFile = () => {
		setCurrentPage(currentPage - 1);
		if (currentPage === (max - 1)) {
			handleViewAttach(row, currentPage - 1);
		}
		else handleViewAttach(row, currentPage);
		console.log("currentPage", currentPage)

	}

	const handleNextFile = () => {
		setCurrentPage(currentPage + 1);
		if (currentPage === 0) {
			handleViewAttach(row, currentPage + 1);
		}
		else handleViewAttach(row, currentPage);
		console.log("currentPage", currentPage)
	}
	const handleViewAttach = (record, pageIndex) => {
		console.log('record =>', record?.files[pageIndex]?.original_file_name);
		setCurrentMax(record?.files?.length);
		setUrl('');
		setVisibleModalDetail(true);
		if (record?.files[pageIndex]?.original_file_name?.includes('pdf') || record?.files[pageIndex]?.original_file_name?.includes('doc')) {
			setIsDoc(true);
			let new_url = baseURL + `web/loans/ftps/view?file_uuid=${record?.files[pageIndex].file_uuid}`;
			setUrl(`https://docs.google.com/viewer?url=${new_url}&embedded=true`);
		} else {
			setIsDoc(false);
			console.log('File type is image');
			console.log(record?.files)
			setUrl(baseURL + `web/loans/ftps/view?file_uuid=${record?.files[pageIndex].file_uuid}`);
		}
	}

	const handleCancelModalDetail = () => {
		setVisibleModalDetail(false);
		setUrl('');
	}
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
	const disabledDate = (current) => {
		// Can not select days after today and today
		const currentDate = new Date()
		const yesterday = currentDate.setDate(currentDate.getDate() - 1);
		return current.valueOf() >= yesterday;
	}
	const onOk = () => {
		// console.log("infoCustomer", infoCustomer)
		form.validateFields()
			.then((values) => {
				console.log('start upload')
				onFinish(values);
			}).catch((info) => {
				console.log('Validate Failed:', info);
			});
	};
	const onFinish = async (value) => {
		console.log("infoCustomer", infoCustomer)
		try {
			const rs = await http.post(`web/loan_consumer`, infoCustomer);
			if (rs?.status === 200) {
				console.log('rs', rs)
				NotificationSuccess('', 'Đăng ký vay tiêu dùng thành công');
				onClose();
				history.push('/login');
				form.resetFields();
			} else {
				NotificationError('', 'Có lỗi xảy ra. Vui lòng thử lại.');
			}
		} catch (err) {
			NotificationError('', err.message);

		}
	}

	const fetchInfoCustomer = async () => {
	}

	useEffect(() => {
		getCity();
		if (isShowInfoCustomer) {
			fetchInfoCustomer();
			document.querySelectorAll(".ant-modal-body")[1].scrollTop = 0;
		}

	}, [isShowInfoCustomer])

	const onClose = () => {
		showInfoCustomer(false)
		form.resetFields();
		setInfoCustomer({
			...infoCustomer,
			attachment_files: [],
		})
		let newSource = [...dataSource]
		newSource.forEach(i => {
			while (i.files.length > 0) {
				i.files.pop();
			}
		})
		setDataSource(newSource)
		setUrl('');
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
		if (field === 'fixed_income' || field === 'register_amount') {
			// Xử lý nhập 
			if (typingTimeoutRef.current) {
				clearTimeout(typingTimeoutRef.current)
			}
			typingTimeoutRef.current = setTimeout(() => {
				setInfoCustomer({
					...infoCustomer,
					[field]: _.floatValue
				})
			}, 300)
		} else if (field === 'permanent_address') {
			setInfoCustomer({
				...infoCustomer,
				[field]: _.target.value
			})
		} else {
			setInfoCustomer({
				...infoCustomer,
				[field]: _
			})
		}
	}

	const handleChangeDropDownPersonProvince = (code, name) => {
		setInfoCustomer({
			...infoCustomer,
			permanent_city: name,
			permanent_district: ''
		})
		form.setFieldsValue({ quan: null });
	}
	const handleChangeDropDownPersonDistrict = (code, name) => {
		setInfoCustomer({
			...infoCustomer,
			permanent_district: name,
		})
	}
	const handleInputRelativeInfoSelect = (e, type, filed) => {
		let relative_persons = infoCustomer.relative_persons;
		relative_persons[0] = {
			...infoCustomer.relative_persons[0],
			[type]: e
		}
		setInfoCustomer({
			...infoCustomer,
			relative_persons: relative_persons,
		})
		if (type === "permanent_city") {
			form.setFieldsValue({ c_family_quan: null });
		}
	}
	const handleInputPersonalInfo = (e, type) => {
		let personal_information = infoCustomer.personal_information;
		personal_information = {
			...infoCustomer.personal_information,
			[type]: e.target.value
		}
		if (type === 'permanent_address') {
			setInfoCustomer({
				...infoCustomer,
				permanent_address: e.target.value,
				personal_information: personal_information,
			})
		} else {
			setInfoCustomer({
				...infoCustomer,
				personal_information: personal_information,
			})
		}
	}

	const handleInputRelativeInfo = (e, type) => {
		let relative_persons = infoCustomer.relative_persons;
		relative_persons[0] = {
			...infoCustomer.relative_persons[0],
			[type]: e.target.value
		}
		setInfoCustomer({
			...infoCustomer,
			relative_persons: relative_persons,
		})
	}

	const handleInputWorkInfo = (e, type) => {
		let working_information = infoCustomer.working_information;
		working_information = {
			...infoCustomer.working_information,
			[type]: e
		}
		setInfoCustomer({
			...infoCustomer,
			working_information: working_information,
		})
	}

	const handleSelectDatePerson = (e, value) => {
		let personal_information = infoCustomer.personal_information;
		personal_information = {
			...infoCustomer.personal_information,
			birthday: moment(e).format('YYYY-DD-MM'),
		}
		setInfoCustomer({
			...infoCustomer,
			personal_information: personal_information,
		})
	}

	// console.log("url",url);


	const handleIssueDate = (e, value) => {
		let personal_information = infoCustomer.personal_information;
		personal_information = {
			...infoCustomer.personal_information,
			id_card_issued_date: moment(e).format('YYYY-DD-MM'),
		}
		setInfoCustomer({
			...infoCustomer,
			personal_information: personal_information,
		})
	}
	const handleOtherBirthDay = (e, value) => {
		let relative_persons = infoCustomer.relative_persons;
		relative_persons[0] = {
			...infoCustomer.relative_persons[0],
			birthday: moment(e).format('YYYY-DD-MM'),
		}
		setInfoCustomer({
			...infoCustomer,
			relative_persons: relative_persons,
		})
	}
	const handleOtherIssueDay = (e, value) => {
		let relative_persons = infoCustomer.relative_persons;
		relative_persons[0] = {
			...infoCustomer.relative_persons[0],
			id_card_issued_date: moment(e).format('YYYY-DD-MM'),
		}
		setInfoCustomer({
			...infoCustomer,
			relative_persons: relative_persons,
		})
	}

	// console.log("infoCustomer", infoCustomer)
	return (
		<>
			<Modal width="70%" title="Thông tin cá nhân khách hàng" ref={modalRef} visible={isShowInfoCustomer} maskClosable={false} onCancel={onClose} onOk={onOk}
				bodyStyle={{ height: "60vh", overflow: "auto" }}
				okText={isEdit ? 'Update' : 'OK'}
			>

				<Form
					// {...layout}
					className="info-customer"
					form={form}
					name="basic"
					initialValues={{ ...initialValues}}
				>
					<p><b>I. THÔNG TIN CÁ NHÂN</b></p>
					<Row>
						<Col span={SPAN_ONE_FIELD}>
							<Form.Item
								{...tailLayout}
								labelAlign={"left"}
								label="Họ và Tên"
								name="c_name"
								rules={[{ required: true, message: 'Vui lòng nhập họ tên khách hàng!' }]}
							>
								<Input value={infoCustomer.permanent_district} bordered={IS_BORDER_INPUT} onChange={(_) => { handleInputPersonalInfo(_, 'name') }} />
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
								<Radio.Group onChange={(e) => { handleInputPersonalInfo(e, 'gender') }}>
									<Radio value={0}>Nam</Radio>
									<Radio value={1}>Nữ</Radio>
								</Radio.Group>
							</Form.Item>
						</Col>
						<Col span={2}></Col>
						<Col span={SPAN_TWO_FIELD}>
							<Form.Item
								{...tailLayout}
								labelAlign={"left"}
								label="Ngày sinh"
								name="birthday_customer"
								rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
							>
								<DatePicker disabledDate={disabledDate} format={FORMAT_DATE} bordered={false} placeholder="Ngày sinh" format={FORMAT_DATE} onChange={handleSelectDatePerson} />
							</Form.Item>
						</Col>
					</Row>

					<Row>
						<Col span={7}>
							<Form.Item
								label="CMND/Hộ chiếu/CCCD"
								name="c_card_number"
								rules={[
									() => ({
										required: true,
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
											if (value.length !== 12 && value.length !== 9) return Promise.reject("Số CMND/CCCD/Hộ chiếu không được lớn hơn 12 ký tự hoặc ít hơn 9 ký tự");
											return Promise.resolve();
										}
									})
								]}
							>
								<Input bordered={IS_BORDER_INPUT} onChange={(_) => { handleInputPersonalInfo(_, 'card_number') }} />
							</Form.Item>
						</Col>
						<Col span={1}></Col>
						<Col span={7}>
							<Form.Item
								label="Nơi cấp"
								name="c_issue_address"
								rules={[{ required: true, message: 'Vui lòng nhập nơi cấp!' }]}
							>
								<Input bordered={IS_BORDER_INPUT} onChange={(_) => { handleInputPersonalInfo(_, 'issued_by') }} />
							</Form.Item>
						</Col>
						<Col span={1}></Col>
						<Col span={7}>
							<Form.Item
								label="Ngày cấp"
								name="user_date"
								rules={[{ required: true, message: 'Vui lòng nhập ngày cấp!' }]}
							>
								<DatePicker disabledDate={disabledDate} format={FORMAT_DATE} bordered={false} placeholder="Ngày cấp" format={FORMAT_DATE} onChange={handleIssueDate} />
							</Form.Item>
						</Col>
					</Row>

					<Row>
						<Col span={SPAN_ONE_FIELD}>
							<Form.Item
								{...tailLayout}
								labelAlign={"left"}
								label="Số nhà/phố"
								name="c_permanent_address"
								rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
							>
								<Input bordered={IS_BORDER_INPUT} onChange={(_) => {
									handleInputPersonalInfo(_, 'permanent_address')
								}} />
							</Form.Item>
						</Col>
					</Row>

					<Row>
						<Col span={8}>
							<Form.Item
								labelAlign={"left"}
								label="Tỉnh thành"
								name="tinh"
								rules={[{ required: true, message: 'Vui lòng nhập tỉnh thành!' }]}
							>

								<Select placeholder='Chọn tỉnh thành' bordered={true} onChange={(_) => {
									let a = city?.filter(e => e.id === _);
									handleChangeDropDownPersonProvince(_, a[0].item_code);
									getDistric(_);
								}}>
									{city?.map((item) => (
										<Select.Option value={item.id}>{item?.item_name}</Select.Option>
									))}
								</Select>
							</Form.Item>
						</Col>
						<Col span={2}></Col>
						<Col span={8}>
							<Form.Item
								labelAlign={"left"}
								label="Quận(Huyện)"
								name="quan"
								rules={[{ required: true, message: 'Vui lòng nhập quận(huyện)!' }]}
							>
								<Select placeholder='Chọn quận/huyện' bordered={true} onChange={(_) => {
									let a = distric?.filter(e => e.id === _);
									handleChangeDropDownPersonDistrict(_, a[0].item_code)
								}}>
									{distric?.map((item) => (
										<Option value={item.id}>{item?.item_name}</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
					</Row>

					<Row>
						<Col span={8}>
							<Form.Item
								labelAlign={"left"}
								label="Số điện thoại"
								name="c_phone"
								rules={
									[
										() => ({
											required: true,
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

									]}
							>
								<Input bordered={IS_BORDER_INPUT} onChange={(_) => { handleInputPersonalInfo(_, 'phone_number') }} />
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
								<Input bordered={IS_BORDER_INPUT} onChange={(_) => { handleInputPersonalInfo(_, 'email') }} />
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={8}>
							<Form.Item
								{...tailLayout}
								labelAlign={"left"}
								label="Số tiền vay"
								name="amount"
								rules={[{ required: true, message: 'Vui lòng nhập số tiền vay!' }]}
							>
								{/* <Input bordered={IS_BORDER_INPUT}
									onChange={(_) => { updateTextField(_, 'register_amount') }}
									suffix="VND"
								/> */}

								<span class="ant-input-affix-wrapper ant-input-affix-wrapper-borderless">
									<NumberFormat
										customInput={Input}
										thousandSeparator={true}
										onValueChange={(_) => updateTextField(_, 'register_amount')}
									/>
									<span class="ant-input-suffix">VND</span>
								</span>
							</Form.Item>
						</Col>
					</Row>

					<p><b>II. THÔNG TIN VỢ/CHỒNG (nếu có)</b></p>
					<Row>
						<Col span={SPAN_ONE_FIELD}>
							<Form.Item
								{...tailLayout}
								labelAlign={"left"}
								label="Họ và Tên"
							>
								<Input bordered={IS_BORDER_INPUT} onChange={(_) => { handleInputRelativeInfo(_, 'name') }} />
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
								<Radio.Group onChange={(_) => { handleInputRelativeInfo(_, 'gender') }}>
									<Radio value={0}>Nam</Radio>
									<Radio value={1}>Nữ</Radio>
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
								<DatePicker disabledDate={disabledDate} format={FORMAT_DATE} bordered={false} placeholder="Ngày sinh" onChange={handleOtherBirthDay} />
							</Form.Item>
						</Col>
					</Row>

					<Row>
						<Col span={7}>
							<Form.Item
								label="CMND/Hộ chiếu/CCCD"
								name="another_card"
								required={false}
								rules={[
									() => ({
										validator(rule, value) {
											const regExp = /^[A-Za-z0-9]*$/;
											const char = /^[A-Za-z]*$/;
											const int = /^[0-9]*$/;
											if (value) {
												if (!char.test(value.charAt(0))) {
													if (!int.test(value)) return Promise.reject("Số CMND/CCCD/Hộ chiếu sai định dạng");
												} else {
													if (!int.test(value.substring(1))) {
														if (!int.test(value)) return Promise.reject("Số CMND/CCCD/Hộ chiếu sai định dạng");
													}
												}
												if (value.length !== 12 && value.length !== 9) return Promise.reject("Số CMND/CCCD/Hộ chiếu không được lớn hơn 12 ký tự hoặc ít hơn 9 ký tự");
											}
											return Promise.resolve();
										}
									})
								]}
							>
								<Input bordered={IS_BORDER_INPUT} onChange={(_) => { handleInputRelativeInfo(_, 'card_number') }} />
							</Form.Item>
						</Col>
						<Col span={1}></Col>
						<Col span={7}>
							<Form.Item
								label="Nơi cấp"
								name='c_family_address_card'
							>
								<Input bordered={IS_BORDER_INPUT} onChange={(_) => { handleInputRelativeInfo(_, 'permanent_address') }} />
							</Form.Item>
						</Col>
						<Col span={1}></Col>
						<Col span={7}>
							<Form.Item
								label="Ngày cấp"
								name='c_family_date_card'
							>
								<DatePicker disabledDate={disabledDate} format={FORMAT_DATE} placeholder="Ngày cấp" bordered={false} onChange={handleOtherIssueDay} />
							</Form.Item>
						</Col>
					</Row>

					<Row>
						<Col span={SPAN_ONE_FIELD}>
							<Form.Item
								{...tailLayout}
								labelAlign={"left"}
								label="Số nhà/phố"
								name='c_family_address'
							>
								<Input bordered={IS_BORDER_INPUT} onChange={(_) => { handleInputRelativeInfo(_, 'permanent_address') }} />
							</Form.Item>
						</Col>
					</Row>

					<Row>
						<Col span={SPAN_TWO_FIELD}>
							<Form.Item
								labelAlign={"left"}
								label="Tỉnh thành"
								name="c_family_tinh"
							>
								<Select placeholder='Chọn tỉnh thành' bordered={true} onChange={(_) => {
									let a = city?.filter(e => e.id === _);
									handleInputRelativeInfoSelect(a[0].item_code, 'permanent_city', 'relative_persons');
									getDistric(_);
								}}>
									{city?.map((item) => (
										<Select.Option value={item.id}>{item?.item_name}</Select.Option>
									))}
								</Select>
							</Form.Item>
						</Col>
						<Col span={2}></Col>
						<Col span={SPAN_TWO_FIELD}>
							<Form.Item
								labelAlign={"left"}
								label="Quận(Huyện)"
								name="c_family_quan">
								<Select placeholder='Chọn quận/huyện' bordered={true} onChange={(_) => {
									let a = distric?.filter(e => e.id === _);
									handleInputRelativeInfoSelect(a[0].item_code, 'permanent_district', 'relative_persons');
								}}>
									{distric?.map((item) => (
										<Select.Option value={item.id}>{item?.item_name}</Select.Option>
									))}
								</Select>
							</Form.Item>
						</Col>
					</Row>

					<Row>
						<Col span={SPAN_TWO_FIELD}>
							<Form.Item
								labelAlign={"left"}
								label="Số điện thoại"
								rules={
									[
										() => ({
											validator(rule, value) {
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
									]
								}
							>
								<Input bordered={IS_BORDER_INPUT} onChange={(_) => { handleInputRelativeInfo(_, 'phone_number') }} />
							</Form.Item>
						</Col>
						<Col span={2}></Col>
						<Col span={SPAN_TWO_FIELD}>
							<Form.Item
								labelAlign={"left"}
								label="Email"
							>
								<Input bordered={IS_BORDER_INPUT} onChange={(_) => { handleInputRelativeInfo(_, 'email') }} />
							</Form.Item>
						</Col>
					</Row>

					<p><b>III. THÔNG TIN TÀI CHÍNH</b></p>
					<Row>
						<Col span={10}>
							<Form.Item
								labelAlign={"left"}
								label="Nơi làm việc"
								name="c_work_address"
								rules={[{ required: true, message: 'Vui lòng nhập nơi làm việc!' }]}
							>
								<Input bordered={IS_BORDER_INPUT} onChange={changeWorkingAddress} />
							</Form.Item>
						</Col>
						<Col span={2} />
						<Col span={10}>
							<Form.Item
								labelAlign={"left"}
								label="Thu nhập cố định"
								name="cost_live"
								// name="fixed_income"
								rules={[{ required: true, message: 'Vui lòng nhập thu nhập cố định!' }]}
							>

								<span class="ant-input-affix-wrapper ant-input-affix-wrapper-borderless">
									<NumberFormat
										customInput={Input}
										thousandSeparator={true}
										onValueChange={(_) => updateTextField(_, 'fixed_income')}
									/>
									<span class="ant-input-suffix">VND</span>
								</span>
								{/* <Input bordered={IS_BORDER_INPUT} onChange={(_) => { updateTextField(_, 'fixed_income') }} suffix="VND" /> */}
							</Form.Item>
						</Col>
					</Row>

					<Row>
						<Col span={10}>
							<Form.Item
								labelAlign={"left"}
								label="Hợp đồng lao động"
								rules={[{ required: true, message: 'Vui lòng nhập hợp đồng lao động!' }]}
								name="income_difference"
							>
								<Select placeholder='Chọn loại hợp đồng' bordered={true} onChange={(e) => { changeContractType(e) }}  >
									<Select.Option value={0}>Ngắn hạn</Select.Option>
									<Select.Option value={1}>Dài hạn</Select.Option>
								</Select>
								{/* <Input  bordered={IS_BORDER_INPUT} onChange={(_) => { handleInputWorkInfo(_, 'other_income_desc') }}/> */}
							</Form.Item>
						</Col>
						<Col span={2} />
						<Col span={10}>
							<Form.Item
								labelAlign={"left"}
								label="Địa chỉ làm việc"
								rules={[{ required: true, message: 'Vui lòng nhập địa chỉ làm việc' }]}
								name="add_work"
							>
								<Input bordered={IS_BORDER_INPUT} onChange={changeComapnyName} />
							</Form.Item>
						</Col>
					</Row>

					<p><b>IV. THÔNG TIN TÀI CHÍNH VỢ/CHỒNG (nếu có)</b></p>
					<Row>
						<Col span={10}>
							<Form.Item
								labelAlign={"left"}
								label="Nơi làm việc"
								name="c_family_work_address"
							>
								<Input bordered={IS_BORDER_INPUT}
								// onChange={(_) => { updateTextField(_, 'c_family_work_address') }}
								/>
							</Form.Item>
						</Col>
						<Col span={2} />
						<Col span={10}>
							<Form.Item
								labelAlign={"left"}
								label="Thu nhập cố định"
								name="cost_family_live2"
							>

								<span class="ant-input-affix-wrapper ant-input-affix-wrapper-borderless">
									<NumberFormat
										customInput={Input}
										thousandSeparator={true}
										onValueChange={(_) => updateTextField(_, 'cost_family_live2')}
									/>
									<span class="ant-input-suffix">VND</span>
								</span>
								{/* <Input bordered={IS_BORDER_INPUT}
									// onChange={(_) => { updateTextField(_, 'cost_family_live') }} 
									suffix="VND" /> */}
							</Form.Item>
						</Col>
					</Row>

					<Row>
						<Col span={10}>
							<Form.Item
								labelAlign={"left"}
								label="Hợp đồng lao động"
								name="income_difference_family">
								<Select placeholder='Chọn loại hợp đồng' bordered={true}>
									<Select.Option value={0}>Ngắn hạn</Select.Option>
									<Select.Option value={1}>Dài hạn</Select.Option>
								</Select>
							</Form.Item>
						</Col>
						<Col span={2} />
						<Col span={10}>
							<Form.Item
								labelAlign={"left"}
								label="Địa chỉ làm việc"
								name="add_work_family"
							>
								<Input bordered={IS_BORDER_INPUT} />
							</Form.Item>
						</Col>
					</Row>
					<p><b>V. THÔNG TIN ĐÍNH KÈM</b></p>
					<Table
						scroll={scroll}
						className="attach-table"
						dataSource={dataSource}
						columns={columns}
						rowKey="key"
						pagination={false}
					/>
				</Form>
			</Modal>
			<Modal
				className="modal-view-attachment"
				title="Chi tiết tệp đính kèm"
				visible={visibleModalDetail}
				onCancel={handleCancelModalDetail}
			>
				<div className="detail-content">
					<div className="left-btn">
						<Button disabled={currentPage === 0 ? true : false}><LeftOutlined onClick={(record) => handlePreFile(record)} /></Button>
					</div>
					<div className="center-content">
						{
							isDoc ? <iframe src={url} frameBorder="0" style={{ width: '100%', height: '100%' }}></iframe>
								: <img src={url} style={{ height: '100%', width: '100%' }} />}

					</div>
					<div className="right-btn">
						<Button disabled={currentPage === (max - 1)}><RightOutlined onClick={(record) => handleNextFile(record)} /></Button>
					</div>
				</div>
			</Modal>
		</>
	)
}
function mapDispatchToProps(dispatch) {
	return {
		downloadFile: (payload) => dispatch(downloadFile(payload)),
	}
}
export default connect(mapDispatchToProps)(CustomerInfo);