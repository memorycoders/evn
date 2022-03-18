import React, { useState, useEffect } from 'react';
import "../../../styles/digitalSignature.scss";
import "../../../styles/operate.scss";
import { Table, Button, Form, Upload, Modal, Popover } from "antd";
import { NotificationSuccess, NotificationError } from '../../../common/components/Notification';
import http from '../../../apis/http';
import {
    PlusCircleOutlined,
} from '@ant-design/icons';
import upFile from '../../../asset/images/icon-upFile.png';
import download from '../../../asset/images/icon-download.png';
import detailFile from '../../../asset/images/icon-detailFile.png';
import delFile from '../../../asset/images/icon-delete.png';
import { BASE_URL } from "../../../utils/constants";

function Template(props) {
    const baseURL = BASE_URL
    let size = window.innerWidth;
    const [form] = Form.useForm();
    const [totalItem, setTotalItem] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [dataSource, setDataSource] = useState([]);
    const [visibleModalDetail, setVisibleModalDetail] = useState(false);
	const [url, setUrl] = useState('');
	const [isDoc, setIsDoc] = useState(false)

    const handleChangeFileUpload = async (file) => {
        let fd = new FormData();
		fd.append('file', file);
        try{
            const rs = await http.post(`web/admin/template_forms`, fd);
            if(rs?.status === 200){
                NotificationSuccess("", "Tải lên thành công")
                let new_data = dataSource.concat(rs?.data?.data);
                setDataSource(new_data)
            }
        } catch(err){
            NotificationError('', 'Có lỗi xảy ra. Vui lòng thử lại.')
        }
    }
    const deleteTemplate = async (record) => {
        try{
            const rs = await http.get(`web/admin/template_forms/${record?.id}/delete`);
            if(rs?.status === 200){
                NotificationSuccess("", "Cập nhật thành công")
                fetchData(currentPage - 1);
            }
        } catch(err){
            NotificationError('', 'Có lỗi xảy ra. Vui lòng thử lại.')
        }
    }
    const handleViewAttach = (record) => {
        console.log("record",record);
        
		setUrl('');
		setVisibleModalDetail(true);
		if(record?.fileName?.includes('pdf') || record?.fileName?.includes('doc')){
			setIsDoc(true);
			let new_url = baseURL + `web/loans/ftps/view?file_uuid=${record?.fileUuid}`;
			setUrl(`https://docs.google.com/viewer?url=${new_url}&embedded=true`);
		} else {
			setIsDoc(false);
			console.log('File type is image');
			setUrl(baseURL + `web/loans/ftps/view?file_uuid=${record?.fileUuid}`);
		}
	}
    
	const handleCancelModalDetail = () => {
		setVisibleModalDetail(false);
		setUrl('');
	}
    const downloadTemplate = async (record) => { 
        try{
            const rs = await http.get(`web/admin/template_forms/download?file_uuid=${record?.fileUuid}`);
            if(rs?.status === 200){
                console.log("rs?.data?.data",rs?.data?.data);
                
                window.open(rs?.data?.data?.download_link, '_blank');
                // let new_data = dataSource.concat(rs?.data?.data);
                // setDataSource(new_data)
            }
        } catch(err){
            NotificationError('', 'Có lỗi xảy ra. Vui lòng thử lại.')
        }
    }
    const fetchData = async(pageIndex) => {
        const rs = await http.get(`web/admin/template_forms?pageIndex=${pageIndex}&pageSize=5`);
        if(rs?.status === 200){
            setDataSource(rs?.data?.data?.content)
            setTotalItem(rs?.data?.data?.total_elements)
        }
    }
    const changePage = (page, pageSize) => {
		fetchData(page - 1, page - 1);
        setCurrentPage(page);
    }
    
    const columns = [
        {
            title: 'Tên biểu mẫu',
            dataIndex: 'templateName',
            key: 'templateName',
            render: templateName => {
                return (
                    <div>{templateName}</div>
                )
            }
        },
        {
            title: '',
            dataIndex: 'fileName',
            key: 'fileName',
            render: fileName => {
                return (
                    <div></div>
                )
            }
        },
        {
            title: '',
            dataIndex: 'fileUuid',
            key: 'fileUuid',
            render: fileUuid => {
                return (
                    <div></div>
                )
            }
        },
        {
            title: '',
            dataIndex: 'id',
            key: 'id',
            render: id => {
                return (
                    <div></div>
                )
            }
        },
        {
            title: '',
            dataIndex: '',
            key: '',
            render: record => {
                return (
                    <div
						style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '10px 0px', cursor: 'pointer' }}>
					    <img className="attach-icon" src={download} onClick={() => downloadTemplate(record)}/>
						Tải về
					</div>
                )
            }
        },
        {
            title: '',
            dataIndex: '',
            key: '',
            render: record => {
                return (
                    <div
						style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '10px 0px', cursor: 'pointer' }}>
					    <img className="attach-icon" src={detailFile} onClick={() => handleViewAttach(record)}/>
						Xem File
					</div>
                )
            }
        },
        {
            title: '',
            dataIndex: '',
            key: '',
            render: record => {
                return (
                    <div
                         style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '10px 0px', cursor: 'pointer' }}>
                        <img className="attach-icon" src={delFile} onClick={() => deleteTemplate(record)}/>
                            Xóa File
                    </div>
                )
            }
        },
    ];
    useEffect(() => {
        fetchData(0);
        //call api get data to fill table here !
    }, [])
    return (
        <div className="digital-signature operate-signature">
            <div style={{ marginTop: '20px', maxWidth: size > 1440 ? '100%' : '1440px' }} className="digital-signature operate-signature">
                <div className="loanlist-operate">
                    <h2 style={{ marginLeft: '5px' }}>Biểu mẫu
                    <Upload beforeUpload={(info) => handleChangeFileUpload(info)}>
                        <PlusCircleOutlined style={{ padding: '10px', cursor: 'pointer' }} />
					</Upload>
                    </h2>

                    <Table scroll={scroll}
                        style={{ marginTop: '10px' }}
                        className="attach-table"
                        dataSource={dataSource}
                        columns={columns}
                        rowKey="key"
                        pagination={{defaultPageSize: 5, total: totalItem, onChange: changePage}}
                    />
                </div>
            </div>

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
							isDoc ? <iframe src={url} frameBorder="0" style={{ width: '100%', height:'100%'}}></iframe>
							: <img src={url} style={{height: '100%', width: '100%'}}/>	
						}

					</div>
					{/* <div className="right-btn">
						<Button disabled={currentPage === dataModal?.files?.length}><RightOutlined onClick={handleNextFile} /></Button>
					</div> */}
				</div>
			</Modal>
        </div>
    );
}

export default Template;

