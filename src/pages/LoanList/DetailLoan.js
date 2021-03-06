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
				return NotificationError("", "Co?? l????i xa??y ra. Vui lo??ng th???? la??i");
			}
		} catch (ex) {
		}
	}
	useEffect(() => {
		const temp2 = (dataDetail.repayment_method >>> 0).toString(2).split('');
		if (dataDetail.id) {
			let tempPaymentMethod = [];
			if (temp2[0] && temp2[0] === "1") {
				tempPaymentMethod.push("L????ng")
			}
			if (temp2[1] && temp2[1] === "1") {
				tempPaymentMethod.push("B??n ??i???n")
			}
			if (temp2[2] && temp2[2] === "1") {
				tempPaymentMethod.push("Kh??c")
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
			name: "CMND/CCCD/H??? chi???u",
			status: false,
			label: 1,
			files: [],
		},
		{
			key: "91",
			name: 'CMND/CCCD/H??? chi???u ( v???/ ch???ng)',
			status: false,
			label: 91,
			files: [],
		},
		{
			key: "2",
			name: 'S??? h??? kh???u',
			status: false,
			label: 2,
			files: [],
		},
		{
			key: "92",
			name: 'Gi???y ????ng k?? k???t h??n ( N???u c??)',
			status: false,
			label: 92,
			files: [],
		},
		{
			key: "3",
			name: 'H???p ?????ng lao ?????ng',
			status: false,
			label: 3,
			files: [],
		},
		{
			key: "93",
			name: 'H???p ?????ng lao ?????ng ( v???/ ch???ng)',
			status: false,
			label: 93,
			files: [],
		},
		{
			key: "9",
			name: 'X??c nh???n nh??n vi??n',
			status: false,
			label: 9,
			files: [],
		},
		{
			key: "94",
			name: 'X??c nh???n nh??n vi??n ( v???/ ch???ng) ',
			status: false,
			label: 94,
			files: [],
		},
		{
			key: "95",
			name: 'Ch???ng minh thu nh???p',
			status: false,
			label: 95,
			files: [],
		},
		{
			key: "96",
			name: 'Ch???ng minh thu nh???p ( v??? ch???ng)',
			status: false,
			label: 96,
			files: [],
		}
	]);
	const columns = [
		{
			title: 'Lo???i h??? s??',
			dataIndex: 'name',
		},
		{
			title: 'Tr???ng th??i',
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
										T???i xu???ng
									</Col>
									<Col span={8}>
										{/* <Popconfirm
											title="B???n c?? ch???c mu???n x??a file n??y?"
											onConfirm={() => confirmDel(record)}
											okText="C??" cancelText="Kh??ng"
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
			title: 'Th???i gian',
			dataIndex: 'time',
		},
		{
			title: 'M?? t???',
			dataIndex: 'description',
		},
		{
			title: 'S??? ti???n',
			dataIndex: 'value',
		},
	]

	const [templateList, setTemplateList] = useState([
		{
			key: "1",
			name: "?????? nghi?? vay v????n ki??m h????p ??????ng cho vay va?? th???? ch????p ta??i sa??n",
		},
		{
			key: "2",
			name: 'Bi??n b???n nghi???m thu',
		},
		{
			key: "3",
			name: 'Kh??? ?????c nh???n n???',
		},
		{
			key: "4",
			name: 'Phi????u y??u c????u giao di??ch ??a??m ba??o',
		},
	]);
	const columnTemplate = [
		{
			title: 'Bi???u m???u',
			dataIndex: 'name',
			width: '80%'
		},
		{
			title: 'Thao t??c',
			dataIndex: 'key',
			render: (key, record) => {
				return (
					<Popover content={
						<Row style={{ maxWidth: 220, display: 'flex', justifyContent: 'space-around' }}>
							<Col span={8} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '10px 0px', cursor: 'pointer' }}>
								<img className="attach-icon" src={download} />
								T???i xu???ng
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
				NotificationSuccess("", "Ta??i l??n tha??nh c??ng");
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
				<span onClick={() => close()}>{user === 'Kh??ch h??ng vay ti??u d??ng' ? 'Theo do??i khoa??n vay' : 'Xe??t duy????t'}</span> <RightOutlined /> <span style={{ color: '#1D4994' }}>Kho???n vay {detail?.loan_code}</span>
			</div>
			<div className="detail-content">
				<Form
					// {...layout}
					className="info-customer"
					form={form}
					name="basic"
				// initialValues={{ ...infoCustomer }}

				>
					<p><b>I. TH??NG TIN CA?? NH??N</b></p>
					<Row>
						<Col span={SPAN_ONE_FIELD}>

							<Form.Item
								{...tailLayout}
								labelAlign={"left"}
								label={`H??? v?? T??n`}
								// name="name"
								rules={[{ required: true, message: 'Vui l??ng nh???p h??? t??n kh??ch h??ng!' }]}
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
								label="Gi???i t??nh"
								// name="c_gender"
								rules={[{ required: true, message: 'Vui l??ng ch???n gi???i t??nh!' }]}
							>
								<Radio.Group value={detail?.customer?.gender}>
									<Radio value={0}>Nam</Radio>
									<Radio value={1}>N???</Radio>
								</Radio.Group>
							</Form.Item>
						</Col>
						<Col span={2}></Col>
						<Col span={SPAN_TWO_FIELD}>
							<Form.Item
								{...tailLayout}
								labelAlign={"left"}
								label="Ng??y sinh"
								// name="birthday_customer"
								rules={[{ required: true, message: 'Vui l??ng ch???n ng??y sinh!' }]}
							>
								<DatePicker
									format={FORMAT_DATE} bordered={false} placeholder="Ng??y sinh" format={FORMAT_DATE} />
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={7}>
							<Form.Item
								label="CMND/H??? chi???u/CCCD"
								// name="c_card_number"
								rules={[
									() => ({
										required: true,
										validator(rule, value) {
											if (!value) return Promise.reject("Vui l??ng nh???p S??? CMND/CCCD/H??? chi???u!");
											if (value && value.trim() === '') return Promise.reject("Vui l??ng nh???p S??? CMND/CCCD/H??? chi???u!");
											const regExp = /^[A-Za-z0-9]*$/;
											const char = /^[A-Za-z]*$/;
											const int = /^[0-9]*$/;
											if (!char.test(value.charAt(0))) {
												if (!int.test(value)) return Promise.reject("S??? CMND/CCCD/H??? chi???u sai ?????nh d???ng");
											} else {
												if (!int.test(value.substring(1))) {
													if (!int.test(value)) return Promise.reject("S??? CMND/CCCD/H??? chi???u sai ?????nh d???ng");
												}
											}
											if (value.length !== 12 && value.length !== 9) return Promise.reject("S??? CMND/CCCD/H??? chi???u kh??ng ???????c l???n h??n 12 k?? t??? ho????c i??t h??n 9 ky?? t????");
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
								label="N??i c???p"
								// name="c_issue_address"
								rules={[{ required: true, message: 'Vui l??ng nh???p n??i c???p!' }]}
							>
								<Input bordered={IS_BORDER_INPUT} value={detail?.customer?.issued_by} defaultValue={detail?.customer?.issued_by} />
							</Form.Item>
						</Col>
						<Col span={1}></Col>
						<Col span={7}>
							<Form.Item
								label="Ng??y c???p"
								// name="user_date"
								rules={[{ required: true, message: 'Vui l??ng nh???p ng??y c???p!' }]}
							>
								<DatePicker
									defaultValue={detail?.customer?.date_of_issue ? moment(detail?.customer?.date_of_issue, FORMAT_DATE) : null}
									value={detail?.customer?.date_of_issue ? moment(detail?.customer?.date_of_issue, FORMAT_DATE) : null}
									format={FORMAT_DATE} bordered={false} placeholder="Ng??y c???p" />
							</Form.Item>
						</Col>
					</Row>

					<Row>
						<Col span={SPAN_ONE_FIELD}>
							<Form.Item
								{...tailLayout}
								labelAlign={"left"}
								label="S???? nha??/ph????"
								// name="c_permanent_address"
								rules={[{ required: true, message: 'Vui l??ng nh???p ?????a ch???!' }]}
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
								label="Ti??nh tha??nh"
								// name="tinh"
								rules={[{ required: true, message: 'Vui l??ng nh???p ti??nh tha??nh!' }]}
							>

								<Select style={{ width: '100%' }}
									bordered={IS_BORDER_INPUT}
									placeholder='Cho??n ti??nh tha??nh' bordered={true} className="text-input-left"
									defaultValue={detail?.customer?.installation_city} value={detail?.customer?.installation_city}
								>
									{city?.map((item) => (
										<Select.Option value={item.item_code}>{item?.item_name}</Select.Option>
									)
									)}
								</Select>

								{/* <Select placeholder='Cho??n ti??nh tha??nh' bordered={true} onChange={(_) => {
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
								label="Qu????n(Huy????n)"
								// name="quan"
								rules={[{ required: true, message: 'Vui l??ng nh???p qu????n(huy????n)!' }]}
							>
								<Select
									bordered={IS_BORDER_INPUT}
									placeholder='Cho??n qu????n/huy????n' bordered={true} defaultValue={detail?.customer?.installation_district} value={detail?.customer?.installation_district} >
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
								label="S??? ??i???n tho???i"
								// name="c_phone"
								rules={
									[
										() => ({
											required: true,
											validator(rule, value) {
												if (!value) return Promise.reject("Vui l??ng nh???p S??? ??i???n tho???i!");
												if (value && value.trim() === '') return Promise.reject("Vui l??ng nh???p S??? ??i???n tho???i!");
												const regExp = /^[0-9]*$/;
												// if (!regExp.test(value.replace('+', ''))) return Promise.reject("S??? ??i???n tho???i kh??ng ????ng ?????nh d???ng");
												if (value.startsWith('0') && value.length !== 10) return Promise.reject("S??? ??i???n tho???i kh??ng ????ng ?????nh d???ng");
												if (value.startsWith('84') && value.length !== 11) return Promise.reject("S??? ??i???n tho???i kh??ng ????ng ?????nh d???ng");
												if (!(value.startsWith('0') || value.startsWith('84'))) return Promise.reject("S??? ??i???n tho???i kh??ng ????ng ?????nh d???ng");
												const phoneHeader = ['86', '96', '97', '98', '32', '33', '34', '35', '36', '37', '38', '39', '88', '91', '94', '93', '84', '85', '81', '82',
													'89', '90', '93', '70', '79', '77', '76', '78', '92', '56', '58', '99', '59']
												if (value.startsWith('0') && !phoneHeader.includes(value.substring(1, 3))
													|| value.startsWith('84') && !phoneHeader.includes(value.substring(2, 4))) {
													return Promise.reject("S??? ??i???n tho???i kh??ng t???n t???i");
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
								rules={[{ required: true, message: 'Vui l??ng nh???p email!' }]}
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
								label="S???? ti????n vay"
								// name="amount"
								rules={[{ required: true, message: 'Vui l??ng nh???p s???? ti????n vay!' }]}
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
					<p><b>II. TH??NG TIN V???/CH???NG (n???u c??)</b></p>
					<Row>
						<Col span={SPAN_ONE_FIELD}>
							<Form.Item
								{...tailLayout}
								labelAlign={"left"}
								label="H??? v?? T??n"

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
								label="Gi???i t??nh"
							>
								<Radio.Group>
									<Radio value={0}>Nam</Radio>
									<Radio value={1}>N???</Radio>
								</Radio.Group>
							</Form.Item>
						</Col>
						<Col span={2}></Col>
						<Col span={SPAN_TWO_FIELD}>
							<Form.Item
								{...tailLayout}
								labelAlign={"left"}
								label="Ng??y sinh"
							>
								<DatePicker format={FORMAT_DATE} bordered={false} placeholder="Ng??y sinh" />
							</Form.Item>
						</Col>
					</Row>

					<Row>
						<Col span={7}>
							<Form.Item
								label="CMND/H??? chi???u/CCCD"
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
													if (!int.test(value)) return Promise.reject("S??? CMND/CCCD/H??? chi???u sai ?????nh d???ng");
												} else {
													if (!int.test(value.substring(1))) {
														if (!int.test(value)) return Promise.reject("S??? CMND/CCCD/H??? chi???u sai ?????nh d???ng");
													}
												}
												if (value.length !== 12 && value.length !== 9) return Promise.reject("S??? CMND/CCCD/H??? chi???u kh??ng ???????c l???n h??n 12 k?? t??? ho????c i??t h??n 9 ky?? t????");
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
								label="N??i c???p"
								name='c_family_address_card'
							>
								<Input bordered={IS_BORDER_INPUT} />
							</Form.Item>
						</Col>
						<Col span={1}></Col>
						<Col span={7}>
							<Form.Item
								label="Ng??y c???p"
								name='c_family_date_card'
							>
								<DatePicker format={FORMAT_DATE} placeholder="Ng??y c???p" bordered={false} />
							</Form.Item>
						</Col>
					</Row>

					<Row>
						<Col span={SPAN_ONE_FIELD}>
							<Form.Item
								{...tailLayout}
								labelAlign={"left"}
								label="S???? nha??/ph????"
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
								label="Ti??nh tha??nh"
							// name="c_family_tinh"
							>
								<Select style={{ width: '100%' }}

									placeholder='Cho??n ti??nh tha??nh' bordered={true} className="text-input-left"
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
								label="Qu????n(Huy????n)"
								name="c_family_quan">
								<Select placeholder='Cho??n qu????n/huy????n' bordered={true}
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
								label="S??? ??i???n tho???i"
								rules={
									[
										() => ({
											validator(rule, value) {
												const regExp = /^[0-9]*$/;
												// if (!regExp.test(value.replace('+', ''))) return Promise.reject("S??? ??i???n tho???i kh??ng ????ng ?????nh d???ng");
												if (value.startsWith('0') && value.length !== 10) return Promise.reject("S??? ??i???n tho???i kh??ng ????ng ?????nh d???ng");
												if (value.startsWith('84') && value.length !== 11) return Promise.reject("S??? ??i???n tho???i kh??ng ????ng ?????nh d???ng");
												if (!(value.startsWith('0') || value.startsWith('84'))) return Promise.reject("S??? ??i???n tho???i kh??ng ????ng ?????nh d???ng");
												const phoneHeader = ['86', '96', '97', '98', '32', '33', '34', '35', '36', '37', '38', '39', '88', '91', '94', '93', '84', '85', '81', '82',
													'89', '90', '93', '70', '79', '77', '76', '78', '92', '56', '58', '99', '59']
												if (value.startsWith('0') && !phoneHeader.includes(value.substring(1, 3))
													|| value.startsWith('84') && !phoneHeader.includes(value.substring(2, 4))) {
													return Promise.reject("S??? ??i???n tho???i kh??ng t???n t???i");
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
					<p><b>III. TH??NG TIN T??I CH??NH</b></p>
					<Row>
						<Col span={10}>
							<Form.Item
								labelAlign={"left"}
								label="N??i la??m vi????c"
								// name="c_work_address"
								rules={[{ required: true, message: 'Vui l??ng nh???p n??i la??m vi????c!' }]}
							>
								<Input bordered={IS_BORDER_INPUT} value={detail?.workplace?.address} />
							</Form.Item>
						</Col>
						<Col span={2} />
						<Col span={10}>
							<Form.Item
								labelAlign={"left"}
								label="Thu nh????p c???? ??i??nh"
								// name="cost_live"
								// name="fixed_income"
								rules={[{ required: true, message: 'Vui l??ng nh???p thu nh????p c???? ??i??nh!' }]}
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
								label="H????p ??????ng lao ??????ng"
								rules={[{ required: true, message: 'Vui l??ng nh???p h????p ??????ng lao ??????ng!' }]}
							// name="income_difference"
							>
								<Select placeholder='Cho??n loa??i h????p ??????ng'
									defaultValue={detail?.contract_type}
									value={detail?.contract_type} bordered={true}   >
									<Select.Option value={0}>Ng????n ha??n</Select.Option>
									<Select.Option value={1}>Da??i ha??n</Select.Option>
								</Select>
								{/* <Input  bordered={IS_BORDER_INPUT} onChange={(_) => { handleInputWorkInfo(_, 'other_income_desc') }}/> */}
							</Form.Item>
						</Col>
						<Col span={2} />
						<Col span={10}>
							<Form.Item
								labelAlign={"left"}
								label="??i??a chi?? la??m vi????c"
								rules={[{ required: true, message: 'Vui l??ng nh???p ??i??a chi?? la??m vi????c' }]}
							// name="add_work"
							>
								<Input bordered={IS_BORDER_INPUT} value={detail?.workplace?.company_name} />
							</Form.Item>
						</Col>
					</Row>
					<p><b>IV. TH??NG TIN T??I CH??NH V???/CH???NG (n???u c??)</b></p>
					<Row>
						<Col span={10}>
							<Form.Item
								labelAlign={"left"}
								label="N??i la??m vi????c"
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
								label="Thu nh????p c???? ??i??nh"
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
								label="H????p ??????ng lao ??????ng"
								name="income_difference_family">
								<Select placeholder='Cho??n loa??i h????p ??????ng'
								>
									<Select.Option value={0}>Ng????n ha??n</Select.Option>
									<Select.Option value={1}>Da??i ha??n</Select.Option>
								</Select>
							</Form.Item>
						</Col>
						<Col span={2} />
						<Col span={10}>
							<Form.Item
								labelAlign={"left"}
								label="??i??a chi?? la??m vi????c"
								name="add_work_family"
							>
								<Input bordered={IS_BORDER_INPUT} />
							</Form.Item>
						</Col>
					</Row>
					<p><b>V. TH??NG TIN ??I??NH KE??M</b></p>
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
                    <TabPane tab="Th??ng tin kho???n vay" key="1">
                        <Row>
                            <Col xs={24} sm={12}>
                                <h4>M?? kho???n vay</h4>
                                <h2>{detail?.loan_code}</h2>
                                <h4>S??? ti???n vay</h4>
                                <h2 className="loan_number">{detail?.loan?.register_amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VN??</h2>
                                {repayment.length > 0 ? <h4>H??nh th???c tr??? n???</h4> : null}
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
                    <TabPane tab="Th??ng tin ?????u t??" key="2">
                        <Row>
                            <Col xs={24} sm={12}>
                                <h4>?????a ch??? l???p ?????t</h4>
                                <h2>{detail?.installation_address}</h2>
                                <h4>C??ng su???t l???p ?????t</h4>
                                <h2 className="loan_number">{detail?.power_capacity?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} kWp</h2>
                                <h4>S??? ti???n ?????u t??</h4>
                                <h2 className="loan_number">{detail?.loan?.received_amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VN??</h2>
                            </Col>
                            <Col xs={24} sm={12}>
                                <img className="img-loan-info" src={investInfo} />
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tab="M???u bi???u" key="3"><Table
                        scroll={scroll}
                        className="attach-table template-table"
                        dataSource={templateList}
                        columns={columnTemplate}
                        rowKey="key"
                    />
                    </TabPane>
                </Tabs>
                <div className="attach-title">Th??ng tin ????nh k??m</div>
                <Table
                    scroll={scroll}
                    className="attach-table"
                    dataSource={dataSource}
                    columns={columns}
                    rowKey="key"
                />
                <div className="attach-title">L???ch s??? giao d???ch</div>
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
				title="Chi ti???t t???p ????nh k??m"
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
				title="Chi ti???t bi????u m????u"
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