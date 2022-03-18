import { Col, Row, Select, Table, Popover, Upload, Popconfirm, Modal, Button } from "antd";
import Dragger from "antd/lib/upload/Dragger";
import { connect } from 'react-redux';
import React, { useEffect, useState } from "react";
import { CloseOutlined, CheckCircleOutlined, MoreOutlined, CloseCircleOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import update from 'immer';
import { EVN_TOKEN, BASE_URL } from "../../../utils/constants";
import download from '../../../asset/images/icon-download.png';
import detailFile from '../../../asset/images/icon-detailFile.png';
import upFile from '../../../asset/images/icon-upFile.png';
import http from '../../../apis/http';
import { NotificationError, NotificationSuccess } from "../../../common/components/Notification";
const TYPESVIEWER = {
	OFFICE: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'application/vnd.ms-excel'],
	GOOGLE: ['application/pdf'],
}
const baseURL = BASE_URL
const Attachments = (props) => {
	const { info, setInfo } = props;
	const [visibleModalDetail, setVisibleModalDetail] = useState(false);
	const [currentPage, setCurrentPage] = useState(0);
	const [row, setRow] = useState({});
	const [max, setCurrentMax] = useState(10);
	const [url, setUrl] = useState('');
	const [isDoc, setIsDoc] = useState(false)
	let token = sessionStorage.getItem(EVN_TOKEN);
	if (!token) {
		token = localStorage.getItem(EVN_TOKEN)
	}
	let access_token;
	if (token && token !== 'undefined') {
		let objToken = JSON.parse(token);
		access_token = objToken.token.access_token;
	}

	const [dataSource, setDataSource] = useState([
		{
			key: "1",
			name: "CMND/CCCD/Hộ chiếu người vay và vợ (chồng) của người đi vay (nếu đã kết hôn)",
			status: false,
			label: 1,
			files: [],
		},
		{
			key: "2",
			name: 'Hộ khẩu thường trú/ KT3 /Đăng ký kết hôn',
			status: false,
			label: 2,
			files: [],
		},
		{
			key: "3",
			name: 'HĐLĐ/Quyết định bổ nhiệm/chứng từ tương đương',
			status: false,
			label: 3,
			files: [],
		},
		{
			key: "4",
			name: 'Giấy tờ chứng minh thu nhập khác (hợp đồng mua bán nhà, Hợp đồng cho thuê xe)',
			status: false,
			label: 4,
			files: [],
		},
		{
			key: "5",
			name: 'Sao kê tài khoản lương 3 tháng gần nhất',
			status: false,
			label: 5,
			files: [],
		},
		{
			key: "6",
			name: 'Kết quả khảo sát nhu cầu lắp đặt trên EVNSolar',
			status: false,
			label: 6,
			files: [],
		},
		{
			key: "7",
			name: 'Ảnh chụp mái nhà ở 3- 5 góc chụp khác nhau',
			status: false,
			label: 7,
			files: [],
		},
		{
			key: "8",
			name: 'Hóa đơn tiền điện (Hóa đơn tiền điện hoặc báo cáo tiêu thụ điện từ cổng CSKH của điện lực trong 6 tháng gần nhất)',
			status: false,
			label: 8,
			files: [],
		},
		{
			key: "9",
			name: 'Xác nhận nhân viên',
			status: false,
			label: 9,
			files: [],
		}
	])


	const columns = [
		{
			title: 'Loại hồ sơ',
			dataIndex: 'name',
		},
		{
			title: "Số lượng file",
			dataIndex: "countFile",
			render: (text, record) => {
				console.log('record', record);

				return (
					<div>
						{record?.files?.length}
					</div>
				)
			}
		},
		{
			title: 'Trạng thái',
			width: 160,
			dataIndex: "action",
			render: (text, record, index) => {
				// record = localStorage.getItem("record") ? JSON.parse(localStorage.getItem("record")) : record;
				// console.log("record",record);

				return (
					<div>
						{
							record.files?.length ? <div className="attach-btn">
								<CheckCircleOutlined style={{ transform: 'rotate(0deg)' }} className="green" />
								<Popover
									content={<Row style={{ minWidth: 220 }}>
										<Col span={8} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '10px 0px', cursor: 'pointer' }}>
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

								</div>
						}
					</div>
				)
			}
		}
	]

	const handleDownloadFile = async (payload, label) => {
		// console.log('payload => ', payload, label)
		try {
			// const rs = await http.get(`web/loans/ftps/download?file_uuid=${payload}`);
			// console.log('rss', rs)
			// if (rs.status === 200) {
			// 	window.open(rs?.data?.data?.download_link, '_blank');
			// }
			let url = []
			const data = payload.forEach((item, index) => {
				url.push(item.file_uuid)
			})

			const URL = `${BASE_URL}document-service/v1/download/files?app_id=1&file_uuids=${url}&label=${label}`
			window.open(URL, '_blank');

		} catch (ex) {
			NotificationError("", ex.message);
		}
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

				console.log("rs?.data?.data", rs);

				let arr = info.attachment_files;
				arr.push(rs?.data?.data?.attachment_files[0]);

				// let dataFile = [];
				// dataFile.push(rs?.data?.data?.attachment_files[0])
				setInfo({
					...info,
					attachment_files: arr
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

	}

	const handleNextFile = () => {
		setCurrentPage(currentPage + 1);
		if (currentPage === 0) {
			handleViewAttach(row, currentPage + 1);
		}
		else handleViewAttach(row, currentPage);
	}
	const handleViewAttach = (record, pageIndex) => {
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
			setUrl(baseURL + `web/loans/ftps/view?file_uuid=${record?.files[pageIndex].file_uuid}`);
		}
	}

	const handleCancelModalDetail = () => {
		setVisibleModalDetail(false);
		setCurrentPage(1);
		setUrl('');
	}

	useEffect(() => {
		console.log("info.attachment_files", info.attachment_files)
		if (info.attachment_files.length) {
			info.attachment_files.map((item, index) => {
				const newDatasourceList = update(dataSource, draf => {
					const findIndex = draf.findIndex(i => i.label === item.label)
					if (findIndex !== -1) {
						draf[findIndex].files.push(item?.file_uuid);
						draf[findIndex].files.push(item?.original_file_name);
						// draf[findIndex].files.push(rs?.data?.data?.attachment_files[0]?.original_file_name);
					}
				})
				setDataSource(newDatasourceList);
			})

		}
		// handleChangeFileUpload(_file, record)
	}, [])
	// console.log("dataSource", dataSource);

	return (
		<>
			<div className="attach-title">Thông tin đính kèm</div>
			<Table
				scroll={scroll}
				className="attach-table"
				dataSource={dataSource}
				columns={columns}
				rowKey="key"
			/>
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
								: <img src={url} style={{ height: '100%', width: '100%' }} alt='Ảnh đính kèm' />}

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
const mapStateToProps = (state) => {

};
export default connect(null, mapDispatchToProps)(Attachments);