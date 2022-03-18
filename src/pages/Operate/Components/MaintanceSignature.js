import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Button, DatePicker, Popconfirm, Select, Table, Input, Upload, Modal } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import update from 'immer';
import '../../../styles/digitalSignature.scss';
import { EVN_TOKEN, BASE_URL } from "../../../utils/constants";
import download from '../../../asset/images/icon-download.png';
import detailFile from '../../../asset/images/icon-detailFile.png';
import upFile from '../../../asset/images/icon-upFile.png';
import { downloadFile } from '../../../store/loans/action';
import http from "../../../apis/http";
import moment from 'moment';
import { NotificationError, NotificationSuccess } from "../../../common/components/Notification";
const TYPESVIEWER = {
	OFFICE: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'application/vnd.ms-excel'],
	GOOGLE: ['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'],
}
const MaintanceSignature = (props) => {
	const baseURL = BASE_URL
	const {showInfoCustomer, currentStaff, data, setLoanCalendar} = props;
	let list_process = data?.loan_code  ? data?.loan_process_list ? data?.loan_process_list : [] : null;
	let currentRow = list_process && list_process.filter(item => item?.loan_processing_type === props.index);
	let _id = '';
	if (currentRow?.length > 0) {
		currentRow?.map(el => {
			 _id = el.id
		})
	} else _id = '0';
	const [info, setInfo] = useState({
		attachment_files: []
	 });
	const [emp, setListEmployee] = useState([]);
	const [visibleModalDetail, setVisibleModalDetail] = useState(false);
	const [dataModal, setDataModal] = useState({});
	const [currentPage, setCurrentPage] = useState(1);
	const [currentFile, setCurrentFile] = useState({});
	const [url, setUrl] = useState('');
	const [uuid, setUuid] = useState('');
	const [attachmentList, setAttachment] = useState([]);
	const [isDoc, setIsDoc] = useState(true)

	const [fileType, setFileType] = useState('');
	const [propsUpload, setPropsUpload] = useState(
		{
			action: `http://10.31.150.22/api/web/loans/ftps/upload`,
			showUploadList: false,
			headers: {
				Authorization: ''
			},
			// name: 'files',
			accept: "image/*, application/pdf, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
		}
	)
    const FORMAT_DATE = "DD/MM/YYYY"
	let token = sessionStorage.getItem(EVN_TOKEN);
	if (!token) {
		token = localStorage.getItem(EVN_TOKEN)
	}
	let access_token;
	if (token && token !== 'undefined') {
		let objToken = JSON.parse(token);
		access_token = objToken.token.access_token;
	}
	var size = window.innerWidth;
	const fetchDataByLoanCode = async (data) => {
		try {
			const rs = await http.get('web/loans/' + data +'/operator');
            setLoanCalendar(rs?.data?.data)
		}catch(ex){
		}
	}
	const getEmployee = async () => {
		try {
			const rs = await http.get('web/providers/employees')
			if(rs?.status === 200) {
				setListEmployee(rs.data?.data?.content)
			}
		}catch(ex){
		}
	}

	const updateLoanProcessStatus = async (value) => {
		try {
			let fd = new FormData();
			fd.append('status', value)
			fd.append('loan_process_id', _id)
			fd.append('loan_process_type', props.index)
			const rs = await http.post(`web/loans/${data.loan_code}/operator`, fd);
			if(rs?.status === 200) {
				fetchDataByLoanCode(data.loan_code)
				NotificationSuccess("", "Cập nhật thành công.");
			} else {
			}
		}catch(ex){
			return NotificationError("", "Có lỗi xảy ra. Vui lòng thử lại");
		}
	}

	const updateLoanProcessType = async (value) => {
		try {
			let fd = new FormData();
			fd.append('incident_type', value)
			fd.append('loan_process_id', _id)
			fd.append('loan_process_type', props.index)
			const rs = await http.post(`web/loans/${data.loan_code}/operator`, fd);
			if(rs?.status === 200) {
				fetchDataByLoanCode(data.loan_code)
				NotificationSuccess("", "Cập nhật thành công.");
			} else {
			}
		}catch(ex){
			return NotificationError("", "Có lỗi xảy ra. Vui lòng thử lại");
		}
	}

	const updateEmployee = async (value) => {
		try {
			let fd = new FormData();
			fd.append('employee_id', value)
			fd.append('loan_process_id', _id)
			fd.append('loan_process_type', props.index)
			const rs = await http.post(`web/loans/${data.loan_code}/operator`, fd);
			if(rs?.status === 200) {
				fetchDataByLoanCode(data.loan_code)
				NotificationSuccess("", "Cập nhật thành công.");
			} else {
			}
		}catch(ex){
			return NotificationError("", "Có lỗi xảy ra. Vui lòng thử lại");
		}
	}

	const updateLoanProcessDate = async (value) => {
		let date = moment(value).format('DD/MM/YYYY')
		if(!value) {
			date = '';
		}
		try {
			let fd = new FormData();
			fd.append('excution_at', date)
			fd.append('loan_process_id', _id)
			fd.append('loan_process_type', props.index)
			const rs = await http.post(`web/loans/${data.loan_code}/operator`, fd);
			if(rs?.status === 200) {
				fetchDataByLoanCode(data.loan_code)
				NotificationSuccess("", "Cập nhật thành công.");
			} else {
			}
		}catch(ex){
			return NotificationError("", "Có lỗi xảy ra. Vui lòng thử lại");
		}
	}

	const handleViewAttach = (record, name) => {
		setVisibleModalDetail(true);
		setUrl('');
		console.log('1', record, name);
		if(name?.includes('pdf') || name?.includes('doc')){
			setIsDoc(true);
			let new_url = baseURL + `web/loans/ftps/view?file_uuid=${record}`;
			setUrl(`https://docs.google.com/viewer?url=${new_url}&embedded=true`);
		} else {
			setIsDoc(false);
			console.log('File type is image');
			setUrl(baseURL + `web/loans/ftps/view?file_uuid=${record}`);
		}

	}

	const handleCancelModalDetail = () => {
		setVisibleModalDetail(false);
		setUrl('');
    }
    const confirmDel = () => {

		const _dataSource = dataSource.map(i => {
			if (i.key === currentFile.key) {
				return {
					...i,
					files: i.files.filter(j => j.response.data.attachment_files?.[0] !== currentFile.id)
				}
			} else {
				return { ...i }
			}
		})
		setDataSource(_dataSource);

	}
	const handlePreFile = () => {
		let temp = currentPage - 1;
		setCurrentPage(temp)
		if (dataModal.files[0].originFileObj.type.includes('image')) {
			setCurrentFile({key: dataModal.key, id: dataModal.files[temp - 1].response.data.attachment_files[0]})
		}
	}

	const handleNextFile = () => {
		let temp = currentPage + 1;
		setCurrentPage(temp);
		if (dataModal.files[0].originFileObj.type.includes('image')) {
			setCurrentFile({key: dataModal.key, id: dataModal.files[temp - 1].response.data.attachment_files[0]})
		}
	}
	const handleChangeFileUpload = async (_file, record) => {
		try {
			let fd = new FormData();
			fd.append('file', _file)
			fd.append('loan_process_id', _id)
			fd.append('loan_process_type', props.index)
			const rs = await http.post(`web/loans/${data.loan_code}/operator`, fd);
			if (rs?.status === 200) {
				NotificationSuccess("", "Tải lên thành công.");
				setUuid(rs?.data?.data?.file_uuid)		
				fetchDataByLoanCode(data.loan_code)

				// const newDatasourceList = update(dataSource, draf => {
				// 	const findIndex = draf.findIndex(i => i.key === record.key)
				// 	if (findIndex !== -1) {
				// 		_file['file_uuid'] = rs?.data?.data?.file_uuid;
				// 		console.log("🚀 ~ file: MaintanceSignature.js ~ line 236 ~ handleChangeFileUpload ~ _file", _file)
				// 		if(draf && draf[findIndex]) {
				// 			draf[findIndex].files = [_file];
				// 		}
				// 	}
				// })
				// setDataSource(newDatasourceList);
			} else if (!rs) {
				return NotificationError("", "Có lỗi xảy ra. Vui lòng thử lại");
			}
		}catch(ex){
			return NotificationError("", "Có lỗi xảy ra. Vui lòng thử lại");
		}

	}

	useEffect(() => {
		getEmployee();
	}, [])
	const handleDownloadFile = (dataModal) => {
		props.downloadFile(dataModal)
	}
    const columns = [
        {
            title: 'Mã giao dịch',
            dataIndex: 'code',
			key: 'code',
			width: 150,
            render: code => {
                return (
                    <div>{data?.loan_code}</div>
                )
            }
        },
        {
            title: 'Tên khách hàng',
            dataIndex: 'name',
            key: 'name',
            render: name => {
                return (
                    <div>{data?.customer_name}</div>
                )
            }
        },
        // {
		// 			title: 'Số điện thoại',
		// 			dataIndex: 'number',
		// 			key: 'number',
		// 			width: 140,
		// 			render: number => {
		// 				return (
		// 					<div>{data?.phone_number}</div>
		// 				)
		// 			}
        // },
        // {
        //     title: 'Địa chỉ lắp đặt',
        //     dataIndex: 'address',
        //     key: 'address',
        //     render: address => {
        //         return (
        //             <div>{data?.installation_address}</div>
        //         )
        //     }
        // },
        {
					title: 'Tình trạng thực hiện',
					dataIndex: 'status',
					key: 'status',
					// width: 170,
					render: (data) => {
						if(list_process) {
							let a = list_process?.filter(e => e.loan_processing_type === props.index);
							let x = a?.length > 0 ? a[0]?.status: null ;
	
							return <Select onChange={updateLoanProcessStatus} 
								value={x} placeholder="Chọn tình trạng" style={{ minWidth: 180, height: size > 1440 ? '35px' : '25px' }} bordered={true} >
								<Option value='CONTACTED'>Đã liên lạc</Option>
								<Option value='BOOKED'>KH đã chốt lịch</Option>
								<Option value='PROCESSING'>Đang thực hiện</Option>
								<Option value='DONE'>Đã thực hiện</Option>
							</Select>
						}
						return null;
					},
        },
        {
					title: (props.index == 'SURVER' || props.index == 'SET_UP') ? '' : 'Loại sự cố',
					dataIndex: 'type',
					key: 'type',
					width: (props.index == 'SURVER' || props.index == 'SET_UP') ? 0 : 120,
					render: (data) => {
						if(list_process) {
							let a = list_process?.filter(e => e.loan_processing_type === props.index);
							let x = a?.length > 0 ? a[0]?.incident_type: null ;
						return	<div className={(props.index == 'SURVER' || props.index == 'SET_UP') ? 'hidden' : 'show'}>
							<Select onChange={updateLoanProcessType} value={x}
							placeholder="Chọn sự cố" style={{ minWidth: 100, height: size > 1440 ? '35px' : '25px'  }} bordered={true} >
								<Option value='REPAIR'>Sửa chữa</Option>
								<Option value='WARRANTY'>Bảo hành</Option>
								<Option value='INSURANCE'>Bảo hiểm</Option>
							</Select>
						</div>
						}
						return null;
					},
		},
        {
					title: 'Ngày thực hiện',
					dataIndex: 'dateTime',
					key: 'dateTime',
					render: () => {
						if(list_process) {
							let a = list_process?.filter(e => e.loan_processing_type === props.index);
							let x = a?.length > 0 ? a[0]?.excution_at: null ;
							
								return <DatePicker onChange={updateLoanProcessDate}
								value={x ? moment(x.replace('-', '/'), 'YYYY/MM/DD') : null}
								format={FORMAT_DATE} placeholder='Ngày thực hiện'
								bordered={true} /> 
						}
						return null;
					}
		},
		{
					title: 'Nhân sự thực hiện',
					dataIndex: 'employee',
					key: 'employee',
					// width: 170,
					render: () => {
						if(list_process) {
							let x =''
							let a = list_process?.filter(e => e.loan_processing_type === props.index);
							if(a?.length > 0){
								x = a[0]?.employee_id ? a[0]?.employee_id : null
							}
						return <>
						<Input placeholder="Chọn nhân viên" onChange={updateEmployee} className={(props.index == 'SURVER' || props.index == 'SET_UP') ? 'show' : 'hidden'} readOnly value={currentStaff} />
						
						<Select onChange={updateEmployee} className={(props.index == 'SURVER' || props.index == 'SET_UP') ? 'hidden' : 'show'} value={x}
						placeholder="Chọn nhân viên" style={{ minWidth: 100, height: size > 1440 ? '35px' : '25px'  }} bordered={true} >
							{
								
								emp && emp.map((item) => {
									return (
									<Option value={item.id}>{item.name}</Option>
								)}
							)}		
						</Select>
						</>
						}
						
					}
        },
        {
					title: 'Kết quả thực hiện',
					dataIndex: 'files',
					key: 'result',
					
					render: (text, record, files) => {
						if(list_process) {
							let x =''
							let name = '';
							let a = list_process?.filter(e => e.loan_processing_type === props.index);
							if(a?.length > 0){
								x = a?.[0]?.attachment_files?.[0].file_uuid ? a?.[0].attachment_files?.[0]?.file_uuid : null;
								name = a?.[0].attachment_files?.[0].original_file_name ? a?.[0].attachment_files?.[0].original_file_name : null;
							}
						return (
							<>
								{x ? 
								<div className="attach-btn" style={{ justifyContent: 'space-between'}}>
										<Button 
											style={{ margin: '0px 15px 0px 0px' }}
											onClick={() => {showInfoCustomer(true)}} 
											className={"otp-btn" + ((props.index == 'SURVER') ? ' show' : ' hidden')}
										>Kết quả</Button>
									<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '10px 0px', cursor: 'pointer' }}
										onClick={() => handleDownloadFile(x)}>
											<img className="attach-icon" src={download} />
											Tải xuống
									</div>

									<div onClick={() => handleViewAttach(x, name)}
										style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '10px 0px', cursor: 'pointer' }}>
											<img className="attach-icon" src={detailFile} />
											Xem File
									</div>

									<Upload fileList={record?.files} multiple={false} className='attach-upload' beforeUpload={(info) => handleChangeFileUpload(info, record)}>
											<img style={{ cursor: 'pointer' }} className="attach-icon" src={upFile} />
											<div style={{ cursor: 'pointer' }}></div>Upload
									</Upload>
								</div>
									: <div className="attach-btn">
										<Button 
											style={{ margin: '0px 15px 0px 0px' }}
											onClick={() => {
												showInfoCustomer(true)
											}} 
											className={"otp-btn" + ((props.index == 'SURVER') ? ' show' : ' hidden')}
										>Kết quả</Button>
										<Upload fileList={record?.files} multiple={false} className='attach-upload' beforeUpload={(info) => handleChangeFileUpload(info, record)}>
											<img style={{ cursor: 'pointer' }} className="attach-icon" src={upFile} />
											<div style={{ cursor: 'pointer', userSelect: 'none' }}></div>Upload
										</Upload>
									</div>}
							</>
						)
						}
					}
        },

    ]
	const [dataSource, setDataSource] = useState([
        {
			code: data?.loan_code,
			name: data?.customer_name,
			number: data?.phone_number,
			address: data?.installation_address,
			files: [],
        },
      ]);

    return (
		<>
        <div style={{ padding: '0px', maxWidth: size > 1440 ? '100%' : '1440px' }} className="digital-signature operate-signature">
            <div className="loanlist-operate">
                <Table scroll={{ x: 1300 }}
                    className="attach-table"
                    dataSource={dataSource}
                    columns={columns}
                    rowKey="key"
                    pagination={false}
                    // size={size > 1440 ? 'default' : 'small'} 
					/>
            </div>

        </div>
		<Modal
				className="modal-view-attachment"
				title="Chi tiết tệp đính kèm"
				visible={visibleModalDetail}
				onCancel={handleCancelModalDetail}
			>
				<h4>{dataModal?.files?.name}</h4>
				<div className="detail-content">
					<div className="left-btn">
						<Button disabled={currentPage === 1 ? true : false}><LeftOutlined onClick={handlePreFile} /></Button>
					</div>
					<div className="center-content">
						{
							isDoc ? <iframe src={url} frameBorder="0" style={{ width: '100%', height:'100%'}}></iframe>
							: <img src={url} style={{height: '100%', width: '100%'}}/>			
						}
							
					</div>
					<div className="right-btn">
						<Button disabled={currentPage === dataModal?.files?.length}><RightOutlined onClick={handleNextFile} /></Button>
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
    return {
        loansData: state.loan.loansData,
        customer: state.authentication.customer,
        loanDetail: state.loan.loanDetail,
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(MaintanceSignature);