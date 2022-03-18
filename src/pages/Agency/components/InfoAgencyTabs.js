import { Input, Tabs, Form, Row, Col, Select, Button, Upload, Modal } from 'antd';
import { connect } from "react-redux";
const { TabPane } = Tabs;
import {
	PlusCircleOutlined,
	UploadOutlined,
} from '@ant-design/icons';
import upFile from '../../../asset/images/icon-upFile.png';
import download from '../../../asset/images/icon-download.png';
import detailFile from '../../../asset/images/icon-detailFile.png';
import React, { useEffect, useState } from 'react';
import http from '../../../apis/http';
import { NotificationError, NotificationSuccess } from '../../../common/components/Notification';
import { BASE_URL } from "../../../utils/constants";

const InfoAgencyTabs = ({ currentAgent, setCurrentAgent, providers, regions, updateAgentEdited, fetchRegions, props, role_name }) => {
	const baseURL = BASE_URL
	const [agent, setAgent] = useState({})
	const [isAdd, setIsAdd] = useState(true);
	const [formRegion] = Form.useForm();
	const [formRegion2] = Form.useForm();
	const [businessLicense, setBusinessLicense] = useState({});
	const [collaboration, setCollaboration] = useState({});
	const [visibleModalDetail, setVisibleModalDetail] = useState(false);
	const [url, setUrl] = useState('');
	const [isDoc, setIsDoc] = useState(false)
	useEffect(() => {
		setAgent(currentAgent);
		if (currentAgent?.id) {
			setIsAdd(false)
		}
	}, [currentAgent])
	const tabInfoAgent = () => {
		return (
			<div>Thông tin đại lý   <PlusCircleOutlined style={{ marginLeft: "10px" }} onClick={addAgent} /></div>
		)
	}
	const addAgent = () => {
		setCurrentAgent({})
		setIsAdd(true);
	}

	const updateTextField = (field, _) => {
		setAgent({
			...agent,
			[field]: _.target.value
		})
	}
	const handleChangeRegion = (_) => {
		setAgent({
			...agent,
			'region_id': _,
			'regionId': _
		})
	}

	const handleChangeStatus = (_) => {
		setAgent({
			...agent,
			status: _
		})
	}

	const handleAddRegion = () => {
		formRegion.validateFields()
			.then((values) => {
				addRegion(values);
				formRegion.resetFields();
				// setBusinessLicense({});
				// setCollaboration({});

			}).catch((info) => {
				console.log('Validate Failed:', info);
			});
	}

	const handleViewAttach = (record) => {
		console.log('record =>', record);
		setUrl('');
		setVisibleModalDetail(true);
		if (record?.file_name?.includes('pdf') || record?.file_name?.includes('doc')) {
			setIsDoc(true);
			let new_url = baseURL + `web/loans/ftps/view?file_uuid=${record?.file_uuid}`;
			setUrl(`https://docs.google.com/viewer?url=${new_url}&embedded=true`);
		} else {
			setIsDoc(false);
			console.log('File type is image');
			setUrl(baseURL + `web/loans/ftps/view?file_uuid=${record?.file_uuid}`);
		}
	}

	const handleDownloadFile = async (payload) => {
		try {
			const rs = await http.get(`web/loans/ftps/download?file_uuid=${payload.file_uuid}`);
			if (rs.status === 200) {
				window.open(rs?.data?.data?.download_link, '_blank');
			}
		} catch (ex) {
			NotificationError("", ex.message);
		}
	}

	const handleCancelModalDetail = () => {
		setVisibleModalDetail(false);
		setUrl('');
	}


	// console.log("agent",agent)
	const updateAgent = async () => {
		try {
			let url = `web/providers/agents`;
			if (!isAdd) {
				url += `/${agent?.id}`
			}
			if (!agent?.regionId) {
				agent["regionId"] = "";
			}
			if (!agent?.providerId) {
				agent.providerId = "1"
			}
			const _rs = await http.post(url, agent)
			if (_rs?.status === 200) {
				updateAgentEdited(_rs?.data?.data, isAdd)
				NotificationSuccess('', "Thêm mới thành công")
				formRegion2.resetFields();
				setBusinessLicense({});
				setCollaboration({});
				addAgent();
			}
		} catch (ex) { }
	}

	const addRegion = async (values) => {
		if (!values.providers) {
			values.providers = []
		}
		try {
			await http.post('/web/regions', values);
			fetchRegions();
		} catch (ex) { }
	}

	const handleChangeFileUpload = async (_file, field) => {
		try {
			let fd = new FormData();
			fd.append('file', _file)
			const rs = await http.post(`web/ftps/upload`, fd);
			if (rs?.status === 200) {
				console.log('rs', rs);
				NotificationSuccess('', 'Tải lên thành công');
				if (field === 'businessLicense') {
					setBusinessLicense(rs?.data?.data)
				} else if (field === 'collaboration') {
					setCollaboration(rs?.data?.data)
				}
			}
		} catch (ex) {
			NotificationError('', ex.message)
		}
	}

	return (
		<div>
			<Tabs style={role_name === 'Provider2' || role_name === 'Provider3' ? { display: 'none' } : {}} defaultActiveKey="1" type="card" >
				<TabPane tab={tabInfoAgent()} key="1">
					<Form
						layout="vertical"
						form={formRegion2}
					>
						<Row>
							<Col span="10">
								<Form.Item label="Mã đại lý">
									<Input disabled={!isAdd} bordered={false} placeholder="Mã đại lý" defaultValue={agent?.agentCode} value={agent?.agentCode} onChange={(_) => { updateTextField('agentCode', _) }} />
								</Form.Item>
							</Col>
							<Col span="4"></Col>
							<Col span="10">
								<Form.Item label="Vùng"  >
									<Select bordered={false} defaultValue={agent?.region_id} value={agent?.region_id} onSelect={handleChangeRegion}>
										{regions?.map((item) => {
											return (
												<Select.Option value={item.id}>{item.region_name}</Select.Option>
											)
										})}
									</Select>
								</Form.Item>
							</Col>
						</Row>

						<Row>
							<Col span="10">
								<Form.Item label="Tên đại lý (Công ty)" >
									<Input bordered={false} placeholder="Tên đại lý" defaultValue={agent?.agentName} value={agent?.agentName} onChange={(_) => { updateTextField('agentName', _) }} />
								</Form.Item>
							</Col>
							<Col span="4"></Col>
							<Col span="10">
								<Form.Item label="Địa chỉ">
									<Input bordered={false} placeholder="Địa chỉ" defaultValue={agent?.address} value={agent?.address} onChange={(_) => { updateTextField('address', _) }} />
								</Form.Item>
							</Col>
						</Row>

						<Row>
							<Col span="10">
								<Form.Item label="Số điện thoại">
									<Input bordered={false} placeholder="Số điện thoại" defaultValue={agent?.phone} value={agent?.phone} onChange={(_) => { updateTextField('phone', _) }} />
								</Form.Item>
							</Col>
							<Col span="4"></Col>
							<Col span="10">
								<Form.Item label="Mã số doanh nghiệp">
									<Input bordered={false} placeholder="Mã số doanh nghiệp" defaultValue={agent?.taxNumber} value={agent?.taxNumber} onChange={(_) => { updateTextField('taxNumber', _) }} />
								</Form.Item>
							</Col>
						</Row>

						<Row>
							<Col span="10">
								<Form.Item label="Loại hình công ty">
									<Input bordered={false} placeholder="" defaultValue={agent?.agentType} value={agent?.agentType} onChange={(_) => { updateTextField('agentType', _) }} />
								</Form.Item>
							</Col>
							<Col span="4"></Col>
							<Col span="10">
								<Form.Item label="Người đại diện pháp luật">
									<Input bordered={false} placeholder="" defaultValue={agent?.legalRepresentative} value={agent?.legalRepresentative} onChange={(_) => { updateTextField('legalRepresentative', _) }} />
								</Form.Item>
							</Col>
						</Row>

						<Row>
							<Col span="10">
								<Form.Item label="Giấp phép kinh doanh">
									{businessLicense.file_uuid ? <div className="attach-btn">
										<Row style={{ minWidth: 220 }}>
											<Col span={8} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '10px 0px', cursor: 'pointer' }}>
												<img onClick={() => handleDownloadFile(businessLicense)} className="attach-icon" src={download} />
												Tải xuống
									</Col>
											<Col span={8}>
												<div onClick={() => handleViewAttach(businessLicense)}
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
										</Row>
									</div>
										: <div className="attach-btn">
											<Upload beforeUpload={(info) => handleChangeFileUpload(info, "businessLicense")}>
												<Button icon={<UploadOutlined />}>Upload</Button>
											</Upload>
										</div>}
								</Form.Item>
							</Col>
							<Col span="4"></Col>
							<Col span="10">
								<Form.Item label="Chức danh">
									<Input bordered={false} placeholder="" defaultValue={agent?.position} value={agent?.position} onChange={(_) => { updateTextField('position', _) }} />
								</Form.Item>
							</Col>
						</Row>

						<Row>
							<Col span="10">
								<Form.Item label="Thoả thuận hợp tác">
									{collaboration.file_uuid ? <div className="attach-btn">
										<Row style={{ minWidth: 220 }}>
											<Col span={8} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '10px 0px', cursor: 'pointer' }}>
												<img onClick={() => handleDownloadFile(collaboration)} className="attach-icon" src={download} />
												Tải xuống
									</Col>
											<Col span={8}>
												<div onClick={() => handleViewAttach(collaboration)}
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
										</Row>
									</div>
										: <div className="attach-btn">
											<Upload beforeUpload={(info) => handleChangeFileUpload(info, "collaboration")}>
												<Button icon={<UploadOutlined />}>Upload</Button>
											</Upload>
										</div>}
								</Form.Item>
							</Col>
							<Col span="4"></Col>
							<Col span="10">
								<Form.Item label="Trạng thái"  >
									<Select bordered={false} defaultValue={agent?.status} value={agent?.status} onSelect={handleChangeStatus}>
										<Select.Option value={true}>Hợp tác</Select.Option>
										<Select.Option value={false}>Dừng hợp tác</Select.Option>
									</Select>
								</Form.Item>
							</Col>
						</Row>
					</Form>
					<div className="content-center"><Button onClick={updateAgent}> {isAdd ? 'Thêm' : 'Cập nhật'} </Button></div>
				</TabPane>



				<TabPane tab="Thông tin vùng" key="2">
					<Form
						layout="vertical"
						form={formRegion}
					>
						<Row>
							<Col span="10">
								<Form.Item label="Mã ID vùng"
									name="regionCode"
									rules={[{ required: true, message: 'Vui lòng nhập mã vùng!' }]}
								>
									<Input bordered={false} placeholder="Mã ID vùng" />
								</Form.Item>
							</Col>
							<Col span="4"></Col>
							<Col span="10">
								<Form.Item label="Tên vùng"
									name="regionName"
									rules={[{ required: true, message: 'Vui lòng nhập tên vùng!' }]}
								>
									<Input bordered={false} placeholder="Tên vùng" />
								</Form.Item>
							</Col>
						</Row>

						<Row>
							<Col span="10">
								<Form.Item label="Các tỉnh thuộc vùng" name="provinces" >
									<Select bordered={false} placeholder="Chọn các tỉnh thuộc vùng" mode="multiple" >
										{providers?.map((item) => (
											<Select.Option key={item.id} value={item.id}>{item.item_name}</Select.Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col span="4"></Col>
						</Row>
						<div className="content-center"><Button onClick={handleAddRegion}> Thêm </Button></div>
					</Form>
				</TabPane>
			</Tabs>
			<Modal
				className="modal-view-attachment"
				title="Chi tiết tệp đính kèm"
				visible={visibleModalDetail}
				onCancel={handleCancelModalDetail}
			>
				<div className="detail-content">
					{/* <div className="left-btn">
						<Button disabled={currentPage === 1 ? true : false}><LeftOutlined onClick={handlePreFile} /></Button>
					</div> */}
					<div className="center-content">
						{
							isDoc ? <iframe src={url} frameBorder="0" style={{ width: '100%', height: '100%' }}></iframe>
								: <img src={url} style={{ height: '100%', width: '100%' }} />
						}

					</div>
					{/* <div className="right-btn">
						<Button disabled={currentPage === dataModal?.files?.length}><RightOutlined onClick={handleNextFile} /></Button>
					</div> */}
				</div>
			</Modal>
		</div>

	)
}
const mapStateToProps = (state) => {
	return {
		role_name: state?.authentication?.user?.role?.code,
	};
};

export default connect(mapStateToProps)(InfoAgencyTabs);