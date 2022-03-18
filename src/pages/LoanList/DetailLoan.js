import React, { useState, useEffect } from 'react';
import { Tabs, Row, Col, Table, Radio, Popover, Upload, DatePicker, Button, Select, Badge, Input, Modal, Form } from 'antd';
import { CloseCircleOutlined, MoreOutlined, LeftOutlined, RightOutlined, CheckCircleOutlined } from '@ant-design/icons';
import '../../styles/loanList.scss';
import loanInfo from '../../asset/images/loanInfo.png';
import investInfo from '../../asset/images/investInfo.png';
import { EVN_TOKEN, BASE_URL } from "../../utils/constants";
import upFile from '../../asset/images/icon-upFile.png';
import download from '../../asset/images/icon-download.png';
import detailFile from '../../asset/images/icon-detailFile.png';
import chatIcon from '../../asset/images/chat-icon.png';
import { connectSocket } from './socket'
import { setLoanDetail } from '../../store/loans/action';
import http from "../../apis/http";
import { NotificationError, NotificationSuccess } from "../../common/components/Notification";
import update from 'immer';
import { suppressDeprecationWarnings } from 'moment';
import NumberFormat from 'react-number-format';
import moment from "moment";

const { TabPane } = Tabs;

export function DetailLoan(props) {
	const baseURL = BASE_URL
	const { dataDetail, close, loanCode, user } = props;
	const size = { size: 'small' }
	const [repayment, setRepayment] = useState([]);
	const [messageCount, setMessageCount] = useState(1);
	const [isOpenChatBox, setOpenChatBox] = useState(false);
	const [detail, setDetail] = useState({});
	const [currentPage, setCurrentPage] = useState(0);
	const [visibleModalDetail, setVisibleModalDetail] = useState(false);
	const [visibleModalTemplate, setVisibleModalTemplate] = useState(false);
	const [isDoc, setIsDoc] = useState(false)
	const [url, setUrl] = useState('');
	const [urlTemp, setUrlTemp] = useState('');
	const [max, setCurrentMax] = useState(1);
	const [row, setRow] = useState({})
	let token = sessionStorage.getItem(EVN_TOKEN);
	if (!token) {
		token = localStorage.getItem(EVN_TOKEN)
	}
	let access_token;
	if (token && token !== 'undefined') {
		let objToken = JSON.parse(token);
		access_token = objToken.token.access_token;
	}
	const getDetail = async () => {
		try {
			let url = `web/loan-los/${loanCode}`;
			const rs = await http.get(url);
			if (rs?.status === 200) {
				// console.log('rs =>', rs.data.data)

				let data = rs?.data?.data;
				const _data = {
					...rs?.data?.data,
					customer: {
						...rs?.data?.data.customer,
						date_of_issue: rs?.data?.data?.customer?.date_of_issue ? moment.utc(rs?.data?.data?.customer?.date_of_issue).format('DD/MM/YYYY') : null,
						dob: rs?.data?.data?.customer?.dob ? moment.utc(rs?.data?.data?.customer?.dob).format('DD/MM/YYYY') : null,
						expiration_date: rs?.data?.data?.customer?.expiration_date ? moment.utc(rs?.data?.data?.customer?.expiration_date).format('DD/MM/YYYY') : null,
						// passport: 122311492
					},
					// expectedTotalInvestment: 1,
					// investmentAmount: 1,
					// interestRate: 1,
					// term: "2",
					// mortgageStatus: 1,
					// ppaType: 1,
					// contract_type: 0,
					// fixed_income: 200,

				}
				setDetail(_data);
				getCity()
				getDistric(data?.customer?.installation_city)
				let attachment_list = rs?.data?.data?.customer?.attachment_files.filter(e => (e.label < 10 && e.file_uuid != null));
				attachment_list?.map((item) => {
					const newDatasourceList = update(dataSource, draf => {
						const findIndex = draf.findIndex(i => i.label === item.label)
						if (findIndex !== -1) {
							// console.log('1', rs?.data?.data?.attachment_files, rs?.data?.data?.attachment_files[0])
							draf[findIndex].files.push(rs?.data?.data?.customer?.attachment_files.filter(i => (i.label === item.label && i.file_uuid != null)));
							setCurrentMax(rs?.data?.data?.customer?.attachment_files.filter(i => (i.label === item.label && i.file_uuid != null)));
						}
					})
					setDataSource(newDatasourceList);
				})
			} else {
				return NotificationError("", "Có lỗi xảy ra. Vui lòng thử lại");
			}
		} catch (ex) {
		}
	}
	useEffect(() => {
		const temp2 = (dataDetail.repayment_method >>> 0).toString(2).split('');
		if (dataDetail.id) {
			let tempPaymentMethod = [];
			if (temp2[0] && temp2[0] === "1") {
				tempPaymentMethod.push("Lương")
			}
			if (temp2[1] && temp2[1] === "1") {
				tempPaymentMethod.push("Bán điện")
			}
			if (temp2[2] && temp2[2] === "1") {
				tempPaymentMethod.push("Khác")
			}
			setRepayment(tempPaymentMethod);
		}
	}, [dataDetail]);

	const handleViewTemplate = async (key) => {
		if (key === '2' || key === '3') {
			const rs = await http.get('web/agreements/sign-cloud-second-time/preview?loan_code=' + detail?.loan_code);
			if (rs?.status === 200) {
				setUrlTemp('');
				setVisibleModalTemplate(true);
				if (key === '3') {
					let x = rs?.data?.data?.files[0]?.data;
					let file_url;
					file_url = encodeURI(x);
					setUrlTemp(`data:application/pdf;base64, ${file_url}`)
				} else if (key === '2') {
					let x = rs?.data?.data?.files[0]?.data;
					let file_url;
					file_url = encodeURI(x);
					setUrlTemp(`data:application/pdf;base64, ${file_url}`)
				}
			}
		} else if (key === '1' || key === '4') {
			const rs = await http.get('web/agreements/sign-cloud-first-time/preview?loan_code=' + detail?.loan_code);
			if (rs?.status === 200) {
				setUrlTemp('');
				setVisibleModalTemplate(true);
				if (key === '1') {
					let x = rs?.data?.data?.files[0]?.data;
					let file_url;
					file_url = encodeURI(x);
					setUrlTemp(`data:application/pdf;base64, ${file_url}`)
				} else if (key === '4') {
					let x = rs?.data?.data?.files[1]?.data;
					let file_url;
					file_url = encodeURI(x);
					setUrlTemp(`data:application/pdf;base64, ${file_url}`)
				}
			}
		}
	}

	const handleCancelModalTemplate = () => {
		setVisibleModalTemplate(false);
		setUrlTemp('');
	}


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
		},
		{
			title: 'Trạng thái',
			width: 160,
			dataIndex: "action",
			render: (text, record) => {
				return (
					<div>
						{record.files?.length ? <div className="attach-btn">
							<CheckCircleOutlined style={{ transform: 'rotate(0deg)' }} className="green" />
							<Popover
								content={<Row style={{ minWidth: 220 }}>
									<Col span={8} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '10px 0px', cursor: 'pointer' }}>
										<img onClick={() => handleDownloadFile(record.files[0])} className="attach-icon" src={download} />
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
										<Upload multiple={true} className='attach-upload' beforeUpload={(info) => { handleChangeFileUpload(info, record) }}>
											<img style={{ cursor: 'pointer' }} className="attach-icon" src={upFile} />
											<div style={{ cursor: 'pointer' }}></div>Upload
										</Upload>
									</div>}
									trigger="click"
								// visible={visibleRed}
								// onVisibleChange={handleVisibleChangeRed}
								>
									<MoreOutlined className="attach-more" />
								</Popover>

							</div>}
					</div>
				)
			}
		}
	]

	const [transactionHistory, setTransactionHistory] = useState([]);
	const columnHistory = [
		{
			title: 'Thời gian',
			dataIndex: 'time',
		},
		{
			title: 'Mô tả',
			dataIndex: 'description',
		},
		{
			title: 'Số tiền',
			dataIndex: 'value',
		},
	]

	const [templateList, setTemplateList] = useState([
		{
			key: "1",
			name: "Đề nghị vay vốn kiêm hợp đồng cho vay và thế chấp tài sản",
		},
		{
			key: "2",
			name: 'Biên bản nghiệm thu',
		},
		{
			key: "3",
			name: 'Khế ước nhận nợ',
		},
		{
			key: "4",
			name: 'Phiếu yêu cầu giao dịch đảm bảo',
		},
	]);
	const columnTemplate = [
		{
			title: 'Biểu mẫu',
			dataIndex: 'name',
			width: '80%'
		},
		{
			title: 'Thao tác',
			dataIndex: 'key',
			render: (key, record) => {
				return (
					<Popover content={
						<Row style={{ maxWidth: 220, display: 'flex', justifyContent: 'space-around' }}>
							<Col span={8} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '10px 0px', cursor: 'pointer' }}>
								<img className="attach-icon" src={download} />
								Tải xuống
                            </Col>
							<Col span={8}>
								<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '10px 0px', cursor: 'pointer' }}>
									<img className="attach-icon" src={detailFile} onClick={() => handleViewTemplate(key)} />
									Xem File
                                </div>
							</Col>
						</Row>}>
						<MoreOutlined className="attach-more" />
					</Popover>
				)
			}
		},
	]

	const handleChangeFileUpload = async (_file, record) => {
		try {
			let arr = [];
			let fd = new FormData();
			fd.append('files', _file)
			fd.append('label', record?.label)
			arr.push(fd);
			const rs = await http.post(`web/attachment-files/upload-loan-files`, fd);
			if (rs?.status === 200) {
				console.log('rs', rs)
				NotificationSuccess("", "Tải lên thành công");
				const newDatasourceList = update(dataSource, draf => {
					const findIndex = draf.findIndex(i => i.label === record.label)
					if (findIndex !== -1) {
						draf[findIndex].files.push(rs?.data?.data?.attachment_files[0]?.file_uuid);
						draf[findIndex].files.push(rs?.data?.data?.attachment_files[0]?.original_file_name);
					}
				})
				setDataSource(newDatasourceList);
			}
		} catch (ex) {
			NotificationError("", ex.message);
		}
	}

	const handleViewAttach = (record, pageIndex) => {
		console.log('record =>', record);
		setUrl('');
		setVisibleModalDetail(true);
		if (record?.files[0]?.[pageIndex]?.original_file_name.includes('pdf') || record?.files[0]?.[pageIndex]?.original_file_name.includes('doc')
			|| record?.files[0]?.[pageIndex]?.original_file_name.includes('docx')) {
			setIsDoc(true);
			let new_url = baseURL + `web/loans/ftps/view?file_uuid=${record?.files[0]?.[pageIndex]?.file_uuid}`;
			setUrl(`https://docs.google.com/viewer?url=${new_url}&embedded=true`);
		} else {
			setIsDoc(false);
			console.log('File type is image');
			setUrl(baseURL + `web/loans/ftps/view?file_uuid=${record?.files[0]?.[pageIndex]?.file_uuid}`);
		}
	}

	const handlePreFile = () => {
		setCurrentPage(currentPage - 1);
		handleViewAttach(row, currentPage);
	}

	const handleNextFile = () => {
		setCurrentPage(currentPage + 1);
		handleViewAttach(row, currentPage);
	}

	const handleCancelModalDetail = () => {
		setVisibleModalDetail(false);
		setUrl('');
	}

	const handleDownloadFile = async (payload) => {
		console.log('payload => ', payload)
		try {
			const rs = await http.get(`web/loans/ftps/download?file_uuid=${payload}`);
			console.log('rss', rs)
			if (rs.status === 200) {
				window.open(rs?.data?.data?.download_link, '_blank');
			}
		} catch (ex) {
			NotificationError("", ex.message);
		}
	}
	const handleOpenChat = () => {
		setOpenChatBox(true)
	}

	const handleCloseChat = () => {
		setOpenChatBox(false)
	}

	useEffect(() => {
		connectSocket();
		getDetail();
	}, [])

	const [city, setCity] = useState([]);
	const [distric, setDistric] = useState([]);
	const getCity = async () => {
		const rs = await http.get(`web/dict_item/items?item_type=TinhThanh`);
		if (rs?.status === 200) {
			setCity(rs?.data?.data?.data);
			// getConvertCity(rs?.data?.data?.data)
		}
	}
	const getDistric = async (item) => {
		// console.log("item", item);
		const rs = await http.get(`web/dict_item/items?item_type=TinhThanh&parent_id=${item}`);
		if (rs?.status === 200) {
			setDistric(rs?.data?.data?.data);
		}
	}

	const [form] = Form.useForm();
	const IS_BORDER_INPUT = false;
	const SPAN_ONE_FIELD = 24;
	const SPAN_TWO_FIELD = 10;
	const tailLayout = {
		labelCol: { span: 6 },
		// wrapperCol: { offset: 1, span: 12 },
	};
	// const FORMAT_DATE = ["DD-MM-YYYY", "DD/MM/YYYY"];
	const FORMAT_DATE = 'DD/MM/YYYY';


	console.log("detail", detail)
	return (
		<div className="loan-detail custom-loandetail ">
			<div className="breadcrumb">
				<span onClick={() => close()}>{user === 'Khách hàng vay tiêu dùng' ? 'Theo dõi khoản vay' : 'Xét duyệt'}</span> <RightOutlined /> <span style={{ color: '#1D4994' }}>Khoản vay {detail?.loan_code}</span>
			</div>
			<div className="detail-content">
				<Form
					// {...layout}
					className="info-customer"
					form={form}
					name="basic"
				// initialValues={{ ...infoCustomer }}

				>
					<p><b>I. THÔNG TIN CÁ NHÂN</b></p>
					<Row>
						<Col span={SPAN_ONE_FIELD}>

							<Form.Item
								{...tailLayout}
								labelAlign={"left"}
								label={`Họ và Tên`}
								// name="name"
								rules={[{ required: true, message: 'Vui lòng nhập họ tên khách hàng!' }]}
							>

								<Input bordered={IS_BORDER_INPUT}
									value={detail?.customer?.name || null}
									defaultValue={detail?.customer?.name || null} />
							</Form.Item>
						</Col>
					</Row>

					<Row>
						<Col span={SPAN_TWO_FIELD}>
							<Form.Item
								{...tailLayout}
								labelAlign={"left"}
								label="Giới tính"
								// name="c_gender"
								rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
							>
								<Radio.Group value={detail?.customer?.gender}>
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
								// name="birthday_customer"
								rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
							>
								<DatePicker
									format={FORMAT_DATE} bordered={false} placeholder="Ngày sinh" format={FORMAT_DATE} />
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={7}>
							<Form.Item
								label="CMND/Hộ chiếu/CCCD"
								// name="c_card_number"
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
								<Input bordered={IS_BORDER_INPUT} value={detail?.customer?.identity_card_id} defaultValue={detail?.customer?.identity_card_id} />
							</Form.Item>
						</Col>
						<Col span={1}></Col>
						<Col span={7}>
							<Form.Item
								label="Nơi cấp"
								// name="c_issue_address"
								rules={[{ required: true, message: 'Vui lòng nhập nơi cấp!' }]}
							>
								<Input bordered={IS_BORDER_INPUT} value={detail?.customer?.issued_by} defaultValue={detail?.customer?.issued_by} />
							</Form.Item>
						</Col>
						<Col span={1}></Col>
						<Col span={7}>
							<Form.Item
								label="Ngày cấp"
								// name="user_date"
								rules={[{ required: true, message: 'Vui lòng nhập ngày cấp!' }]}
							>
								<DatePicker
									defaultValue={detail?.customer?.date_of_issue ? moment(detail?.customer?.date_of_issue, FORMAT_DATE) : null}
									value={detail?.customer?.date_of_issue ? moment(detail?.customer?.date_of_issue, FORMAT_DATE) : null}
									format={FORMAT_DATE} bordered={false} placeholder="Ngày cấp" />
							</Form.Item>
						</Col>
					</Row>

					<Row>
						<Col span={SPAN_ONE_FIELD}>
							<Form.Item
								{...tailLayout}
								labelAlign={"left"}
								label="Số nhà/phố"
								// name="c_permanent_address"
								rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
							>
								<Input bordered={IS_BORDER_INPUT}
									value={detail?.installation_address}
									defaultValue={detail?.installation_address}
								/>
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={8}>
							<Form.Item
								labelAlign={"left"}
								label="Tỉnh thành"
								// name="tinh"
								rules={[{ required: true, message: 'Vui lòng nhập tỉnh thành!' }]}
							>

								<Select style={{ width: '100%' }}
									bordered={IS_BORDER_INPUT}
									placeholder='Chọn tỉnh thành' bordered={true} className="text-input-left"
									defaultValue={detail?.customer?.installation_city} value={detail?.customer?.installation_city}
								>
									{city?.map((item) => (
										<Select.Option value={item.item_code}>{item?.item_name}</Select.Option>
									)
									)}
								</Select>

								{/* <Select placeholder='Chọn tỉnh thành' bordered={true} onChange={(_) => {
									let a = city?.filter(e => e.id === _);
									handleChangeDropDownPersonProvince(_, a[0].item_code);
									getDistric(_);
								}}>
									{city?.map((item) => (
										<Select.Option value={item.id}>{item?.item_name}</Select.Option>
									))}
								</Select> */}
							</Form.Item>
						</Col>
						<Col span={2}></Col>
						<Col span={8}>
							<Form.Item
								labelAlign={"left"}
								label="Quận(Huyện)"
								// name="quan"
								rules={[{ required: true, message: 'Vui lòng nhập quận(huyện)!' }]}
							>
								<Select
									bordered={IS_BORDER_INPUT}
									placeholder='Chọn quận/huyện' bordered={true} defaultValue={detail?.customer?.installation_district} value={detail?.customer?.installation_district} >
									{distric?.map((item) => (
										<Option value={item.item_code}>{item?.item_name}</Option>
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
								// name="c_phone"
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
								<Input bordered={IS_BORDER_INPUT} value={detail?.customer?.contact_phone} />
							</Form.Item>
						</Col>
						<Col span={2}></Col>
						<Col span={8}>
							<Form.Item
								labelAlign={"left"}
								label="Email"
								// name="c_email"
								rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
							>
								<Input bordered={IS_BORDER_INPUT} value={detail?.customer?.contact_email} />
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={8}>
							<Form.Item
								{...tailLayout}
								labelAlign={"left"}
								label="Số tiền vay"
								// name="amount"
								rules={[{ required: true, message: 'Vui lòng nhập số tiền vay!' }]}
							>
								{/* <Input bordered={IS_BORDER_INPUT}
									onChange={(_) => { updateTextField(_, 'register_amount') }}
									suffix="VND"
								/> */}

								<span class="ant-input-affix-wrapper ant-input-affix-wrapper-borderless">
									<NumberFormat
										bordered={IS_BORDER_INPUT}
										customInput={Input}
										thousandSeparator={true}
										value={detail?.loan?.register_amount || null}
									// onValueChange={(_) => updateTextField(_, 'register_amount')}
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
								<Input bordered={IS_BORDER_INPUT} />
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
								<Radio.Group>
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
								<DatePicker format={FORMAT_DATE} bordered={false} placeholder="Ngày sinh" />
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
								<Input bordered={IS_BORDER_INPUT} />
							</Form.Item>
						</Col>
						<Col span={1}></Col>
						<Col span={7}>
							<Form.Item
								label="Nơi cấp"
								name='c_family_address_card'
							>
								<Input bordered={IS_BORDER_INPUT} />
							</Form.Item>
						</Col>
						<Col span={1}></Col>
						<Col span={7}>
							<Form.Item
								label="Ngày cấp"
								name='c_family_date_card'
							>
								<DatePicker format={FORMAT_DATE} placeholder="Ngày cấp" bordered={false} />
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
								<Input bordered={IS_BORDER_INPUT} />
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={SPAN_TWO_FIELD}>
							<Form.Item
								labelAlign={"left"}
								label="Tỉnh thành"
							// name="c_family_tinh"
							>
								<Select style={{ width: '100%' }}

									placeholder='Chọn tỉnh thành' bordered={true} className="text-input-left"
								// defaultValue={detail?.customer?.installation_city} value={detail?.customer?.installation_city}
								>
									{city?.map((item) => (
										<Select.Option value={item.item_code}>{item?.item_name}</Select.Option>
									)
									)}
								</Select>

							</Form.Item>
						</Col>
						<Col span={2}></Col>
						<Col span={SPAN_TWO_FIELD}>
							<Form.Item
								labelAlign={"left"}
								label="Quận(Huyện)"
								name="c_family_quan">
								<Select placeholder='Chọn quận/huyện' bordered={true}
								>
									{distric?.map((item) => (
										<Select.Option value={item.item_code}>{item?.item_name}</Select.Option>
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
								<Input bordered={IS_BORDER_INPUT} />
							</Form.Item>
						</Col>
						<Col span={2}></Col>
						<Col span={SPAN_TWO_FIELD}>
							<Form.Item
								labelAlign={"left"}
								label="Email"
							>
								<Input bordered={IS_BORDER_INPUT} />
							</Form.Item>
						</Col>
					</Row>
					<p><b>III. THÔNG TIN TÀI CHÍNH</b></p>
					<Row>
						<Col span={10}>
							<Form.Item
								labelAlign={"left"}
								label="Nơi làm việc"
								// name="c_work_address"
								rules={[{ required: true, message: 'Vui lòng nhập nơi làm việc!' }]}
							>
								<Input bordered={IS_BORDER_INPUT} value={detail?.workplace?.address} />
							</Form.Item>
						</Col>
						<Col span={2} />
						<Col span={10}>
							<Form.Item
								labelAlign={"left"}
								label="Thu nhập cố định"
								// name="cost_live"
								// name="fixed_income"
								rules={[{ required: true, message: 'Vui lòng nhập thu nhập cố định!' }]}
							>

								<span class="ant-input-affix-wrapper ant-input-affix-wrapper-borderless">
									<NumberFormat
										bordered={IS_BORDER_INPUT}
										customInput={Input}
										thousandSeparator={true}
										value={detail?.fixed_income || null}
									// onValueChange={(_) => updateTextField(_, 'fixed_income')}
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
							// name="income_difference"
							>
								<Select placeholder='Chọn loại hợp đồng'
									defaultValue={detail?.contract_type}
									value={detail?.contract_type} bordered={true}   >
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
							// name="add_work"
							>
								<Input bordered={IS_BORDER_INPUT} value={detail?.workplace?.company_name} />
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
										bordered={IS_BORDER_INPUT}
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
								<Select placeholder='Chọn loại hợp đồng'
								>
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
				{/* <Tabs defaultActiveKey="1" type="card" size={size}>
                    <TabPane tab="Thông tin khoản vay" key="1">
                        <Row>
                            <Col xs={24} sm={12}>
                                <h4>Mã khoản vay</h4>
                                <h2>{detail?.loan_code}</h2>
                                <h4>Số tiền vay</h4>
                                <h2 className="loan_number">{detail?.loan?.register_amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VNĐ</h2>
                                {repayment.length > 0 ? <h4>Hình thức trả nợ</h4> : null}
                                <h2>{repayment.length > 0 ? repayment.map((item, index) => {
                                    if (index < repayment.length - 1) {
                                        return <span>{item},</span>
                                    } else {
                                        return <span>{item}</span>
                                    }
                                }) : null}</h2>
                            </Col>
                            <Col xs={24} sm={12}>
                                <img className="img-loan-info" src={loanInfo} />
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tab="Thông tin đầu tư" key="2">
                        <Row>
                            <Col xs={24} sm={12}>
                                <h4>Địa chỉ lắp đặt</h4>
                                <h2>{detail?.installation_address}</h2>
                                <h4>Công suất lắp đặt</h4>
                                <h2 className="loan_number">{detail?.power_capacity?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} kWp</h2>
                                <h4>Số tiền đầu tư</h4>
                                <h2 className="loan_number">{detail?.loan?.received_amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VNĐ</h2>
                            </Col>
                            <Col xs={24} sm={12}>
                                <img className="img-loan-info" src={investInfo} />
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tab="Mẫu biểu" key="3"><Table
                        scroll={scroll}
                        className="attach-table template-table"
                        dataSource={templateList}
                        columns={columnTemplate}
                        rowKey="key"
                    />
                    </TabPane>
                </Tabs>
                <div className="attach-title">Thông tin đính kèm</div>
                <Table
                    scroll={scroll}
                    className="attach-table"
                    dataSource={dataSource}
                    columns={columns}
                    rowKey="key"
                />
                <div className="attach-title">Lịch sử giao dịch</div>
                <Table
                    scroll={scroll}
                    className="attach-table"
                    dataSource={transactionHistory}
                    columns={columnHistory}
                    rowKey="key"
                />
            </div>
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
							isDoc ? <iframe src={url} frameBorder="0" style={{ width: '100%', height:'100%'}}></iframe>
							: <img src={url} style={{height: '100%', width: '100%'}}/>						}
							
					</div>
					<div className="right-btn">
						<Button disabled={currentPage === max?.length}><RightOutlined onClick={(record) => handleNextFile(record)} /></Button>
					</div>
				</div>
			</Modal>
            <Modal
				className="modal-view-attachment"
				title="Chi tiết biểu mẫu"
				visible={visibleModalTemplate}
				onCancel={handleCancelModalTemplate}
			>
				<div className="detail-content">
					<div className="center-content">
						{
							<iframe src={urlTemp}  frameborder="0" scrolling="no" width="100%" height="100%"></iframe>
						}
							
					</div>
				</div>
			</Modal> */}
			</div>
		</div>
	)
}