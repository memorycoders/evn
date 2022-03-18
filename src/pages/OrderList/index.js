import { Button, Table, Modal } from "antd";
import React, { useState, useEffect } from 'react';
import viewFile from "../../asset/images/icon-detailFile.png";
import dowloadFile from "../../asset/images/icon-download.png";
import "../../styles/digitalSignature.scss";
import "../../styles/operate.scss";
import http from "../../apis/http";
import { BASE_URL } from "../../utils/constants";
import { NotificationError } from "../../common/components/Notification";
import { RightOutlined, LeftOutlined } from '@ant-design/icons';
import { runSaga } from "@redux-saga/core";
import FileSaver from 'file-saver';

function OrderList(props) {
    let size = window.innerWidth;
    const [totalItem, setTotalItem] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [url, setUrl] = useState('');
    const [visibleModalDetail, setVisibleModalDetail] = useState(false);
    const [isDoc, setIsDoc] = useState(false)
    const [dataSource, setDataSource] = useState([]);
    const [max, setCurrentMax] = useState(1);
    const handleCancelModalDetail = () => {
        setVisibleModalDetail(false);
        setUrl('');
        setIndexData(0)
    }

    const [indexData, setIndexData] = useState(0)
    const [row, setRow] = useState({})


    const baseURL = BASE_URL
    const columns = [
        {
            title: `Mã giao dịch `,
            dataIndex: 'loan_code',
            key: 'loan_code',
            render: loan_code => {
                return (
                    <div>{loan_code}</div>
                )
            },
        },
        {
            title: `Khách hàng `,
            dataIndex: 'name',
            key: 'name',
            render: name => {
                return (
                    <div>{name}</div>
                )
            }
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'contact_phone',
            key: 'contact_phone',
            render: contact_phone => {
                return (
                    <div>
                        {contact_phone}
                    </div>
                )
            }
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'installation_address',
            key: 'installation_address',
            render: installation_address => {
                return (
                    <div>
                        {installation_address}
                    </div>
                )
            }
        },
        {
            title: 'Thông tin đính kèm',
            dataIndex: 'attachInfo',
            key: 'attachInfo',
            render: (record, attachInfo, index) => {
                // console.log("attachInfo", attachInfo);

                return (
                    <div style={{ display: "flex", justifyContent: "flex-start" }}>
                        <div className="btn-actionfile" onClick={() => downloadTemplate(attachInfo)}>
                            <img src={dowloadFile} alt="" className="attach-icon"></img>
                            <p style={{ margin: "0" }}>Tải về</p>
                        </div>
                        <div className="btn-actionfile" onClick={() => {
                            handleViewAttach(attachInfo, indexData)
                            setRow(attachInfo)
                        }} style={{ marginLeft: "30px" }}>
                            <img src={viewFile} alt="" className="attach-icon"></img>
                            <p style={{ margin: "0" }}>Xem file</p>
                        </div>
                        {/* <div className="btn-actionfile" onClick={() => handleViewAttach(attachInfo)} style={{ marginLeft: "30px" }}>
                            <img src={viewFile} alt="" className="attach-icon"></img>
                            <p style={{ margin: "0" }}>Xem file</p>
                        </div> */}
                    </div>
                )
            }
        },
        {
            title: 'Trạng thái',
            dataIndex: '',
            key: '',
            render: record => {
                return (
                    <div>
                        {
                            record.status === "APPROVED_LOAN" ? <Button className='status-btn' style={{ backgroundColor: '#1D4994' }}>
                                <span className="l-calendar-name">Đã phê duyệt</span>
                            </Button> : <Button className='status-btn' style={{ backgroundColor: '#1D4994' }}>
                                    <span className="l-calendar-name">Đang chờ xử lý</span>
                                </Button>
                        }

                    </div>
                )
            }
        },

    ];


    const fetchData = async (pageIndex) => {
        try {
            const rs = await http.get(`web/loan-los?pageIndex=${pageIndex}&pageSize=5`)
            if (rs?.status === 200) {

                const data = rs?.data?.data?.content.map((item, index) => {
                    let a = {
                        ...item,
                    };
                    if (item.attachment_files !== null) {
                        a.attachment_files = item.attachment_files.filter(i => i.file_uuid != null)
                    } else {
                        a.attachment_files = null
                    }
                    return a
                });
                setDataSource(data)
                setTotalItem(rs?.data?.data?.total_elements)
            }
        } catch (error) {
            console.log("error", error);
        }
    }

    const changePage = (page, pageSize) => {
        fetchData(page - 1, page - 1);
        setCurrentPage(page);
    }

    useEffect(() => {
        fetchData(0)
    }, [])

    const handlePreFile = (index) => {
        // console.log(index);
        if (index == 0) {
            setIndexData(row.attachment_files.length - 1)
        } else {
            setIndexData(prev => prev - 1)
        }
        handleViewAttach(row, index)
    }
    const handleNextFile = (index) => {
        if (index == row.attachment_files.length - 1) {
            setIndexData(0)
        } else {
            setIndexData(prev => prev + 1)
        }
        handleViewAttach(row, indexData)
        // console.log("indexData => ", indexData);
    }

    const handleViewAttach = (record, indexData) => {
        console.log("record", record)
        if (record.attachment_files !== null) {
            setUrl('');
            setVisibleModalDetail(true);

            if (record.attachment_files[indexData].original_file_name.includes('pdf') || record.attachment_files[indexData].original_file_name.includes('doc')) {
                setIsDoc(true);
                let new_url = baseURL + `web/loans/ftps/view?file_uuid=${record.attachment_files[indexData]?.file_uuid}`;
                setUrl(`https://docs.google.com/viewer?url=${new_url}&embedded=true`);
            } else {
                setIsDoc(false);
                setUrl(baseURL + `web/loans/ftps/view?file_uuid=${record.attachment_files[indexData]?.file_uuid}`);
            }

        } else {
            NotificationError("", "Chưa có File")
            return;
        }
    }
    // console.log("url", url)
    const downloadTemplate = async (record, label) => {
        // console.log("rs?.data?.data", record,label);
        // try {
        //     let url = []
        //     const data = record?.forEach((item, index) => {
        //         url.push(item.file_uuid)
        //     })

        //     const URL = `${BASE_URL}document-service/v1/download/files?app_id=1&file_uuids=${url}&label=${label}`
        //     window.open(URL, '_blank');

        // } catch (ex) {
        //     NotificationError("", ex.message);
        // }
        try {
            const rs = await http.get(`web/loans/${record?.loan_code}/downloads`);
            const myBlob = new Blob([rs], {
                encoding: "UTF-8",
                type: 'application/octet-stream',
            })
            FileSaver.saveAs(myBlob, record.name + ' download_file')
        } catch (err) {
            NotificationError('', 'Có lỗi xảy ra. Vui lòng thử lại.')
        }

    }
    // console.log("url",url);

    return (
        <div className="digital-signature operate-signature">
            <div style={{ marginTop: '20px', maxWidth: size > 1440 ? '100%' : '1440px' }} className="digital-signature operate-signature">
                <div className="loanlist-operate">
                    <h2 style={{ marginLeft: '5px' }}>Các đơn hàng</h2>
                    <Table
                        style={{ marginTop: '-10px' }}
                        className="attach-table"
                        dataSource={dataSource}
                        columns={columns}
                        rowKey="key"
                        pagination={{ defaultPageSize: 5, total: totalItem, onChange: changePage }}

                    />
                    <Modal
                        className="modal-view-attachment"
                        title="Chi tiết tệp đính kèm"
                        visible={visibleModalDetail}
                        onCancel={handleCancelModalDetail}
                    >
                        <div className="detail-content">
                            <div className="left-btn">
                                <Button onClick={() => handlePreFile(indexData)}><LeftOutlined /></Button>
                                {/* <Button disabled={currentPage === 0 ? true : false}><LeftOutlined onClick={(record) => handlePreFile(record)} /></Button> */}
                            </div>
                            <div className="center-content">
                                {
                                    isDoc ? <iframe src={url} frameBorder="0" style={{ width: '100%', height: '100%' }}></iframe>
                                        : <img src={url} style={{ height: '100%', width: '100%' }} />
                                }

                            </div>
                            <div className="right-btn">
                                <Button onClick={() => handleNextFile(indexData)}><RightOutlined /></Button>
                                {/* <Button disabled={currentPage === row?.attachment_files?.length - 1}><RightOutlined onClick={(record) => handleNextFile(record)} /></Button> */}
                            </div>
                        </div>
                    </Modal>
                </div>
            </div>
        </div>
    );
}

export default OrderList;