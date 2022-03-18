import { CheckOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Modal, Row, Table, Pagination } from "antd";
import React, { useEffect, useState } from 'react';
import http from "../../../apis/http";
import { NotificationError, NotificationSuccess } from "../../../common/components/Notification";
import "../../../styles/digitalSignature.scss";
import "../../../styles/operate.scss";
import { TEMPLATES_TYPE_ID } from '../../../utils/constants';
function Sms(props) {
    let size = window.innerWidth;
    const [form] = Form.useForm();
    const [fields, setFields] = useState([]);
    const [isShowModal, setIsShowModal] = useState(false);
    const [currentFields, setCurrentFields] = useState("");
    const [totalItem, setTotalItem] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const columns = [
        {
            title: `Template`,
            dataIndex: 'templateName',
            key: 'templateName',
            render: templateName => {
                return (
                    <div>{templateName}</div>
                )
            },
        },
        {
            title: `Description`,
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
            render: description => {
                return (
                    <div>{description}</div>
                )
            }
        },
        {
            title: '',
            dataIndex: '',
            key: '',
            render: record => {
                return (
                    <div>
                        <Button onClick={() => handleEdit(record)} className='status-btn btn-border-radius' style={{ backgroundColor: '#1D4994' }}>
                            <span className="l-calendar-name">Sửa</span>
                        </Button>
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
                    <div>
                        <Button onClick={() => openModal(record)} className='status-btn btn-border-radius' style={{ backgroundColor: '#1D4994' }}>
                            <span className="l-calendar-name">Xóa</span>
                        </Button>

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
                    <div>
                        <CheckOutlined onClick={handleSuccess} style={{ color: "#4DB769", marginTop: '8px' }}></CheckOutlined>
                    </div>
                )
            }
        },
    ];
    const [dataSource, setDataSource] = useState([]);
 
    useEffect(() => {
        fetchData(0)
    }, [])
    const fetchData = async (pageIndex) => {
        //    console.log("pageIndex fetch",pageIndex);
        try {
            const rs = await http.get(`web/admin/templates?template_type_id=${TEMPLATES_TYPE_ID.SMS}&pageIndex=${pageIndex}&pageSize=5`);
            if (rs?.status === 200) {
                setTotalItem(rs?.data?.data?.total)
                setDataSource(rs?.data?.data?.data)
            }
        } catch (error) {
            console.log(error);
        }
    }


    const resetFields = () => {
        form.resetFields();
        setFields([])
    }
    const onFinish = async (values) => {
        try {
            let url = '';
            if (fields?.length > 0) {
                url = `web/admin/templates/${values.key}`
            } else {
                url = "web/admin/templates"
            }
            var request = {
                "description": values.description,
                "templateName": values.templateName,
                "templateTypeId": TEMPLATES_TYPE_ID.SMS

            }
            const rs = await http.post(url, request);
            if (rs?.status === 200) {
                if (fields?.length > 0) {
                    NotificationSuccess('', "Cập nhật thành công")
                } else {
                    NotificationSuccess('', "Thêm mới thành công")
                    if (dataSource?.length === 5) {
                        changePage(currentPage + 1, null);
                        form.resetFields();
                        setFields([])
                        return;
                    }
                    form.resetFields();
                    setFields([])
                };
                changePage(currentPage, null);
            }
        } catch (error) {
            console.log(error)
            return NotificationError('', `Có lỗi xảy ra " ${error.message} " Vui lòng thử lại`);
        }

    }
    const changePage = (page, pageSize) => {
        fetchData(page - 1);
        setCurrentPage(page);
    }
    const handleEdit = (record) => {
        setFields([
            {
                name: ['templateName'],
                value: record?.templateName,
            },
            {
                name: ['description'],
                value: record?.description
            },
            {
                name: ['key'],
                value: record?.id
            },

        ])
    }
    const handleSuccess = () => {
        NotificationSuccess("", "Xác nhận thành công")
    }

    const handleCloseModal = () => {
        setIsShowModal(false);
        form.resetFields();
        setFields([])
    }
    const openModal = (values) => {
        setCurrentFields(values)
        setIsShowModal(true)
    }
    const handleOk = async () => {
        const id = currentFields.id
        let url = `web/admin/templates/${id}`
        const rs = await http.get(url);
        if (rs?.status === 200) {
            NotificationSuccess('', "Xóa thành công")
        } else {
            NotificationSuccess('', "Xóa thất bại")
        };
        if (dataSource?.length === 1) {
            if (currentPage === 2 || currentPage === 1) {
                changePage(1, null);
                form.resetFields();
                setFields([])
                setIsShowModal(false)
                return;
            } else {
                changePage(currentPage - 1, null);
                form.resetFields();
                setFields([])
                setIsShowModal(false)
            }
            return;
        } else {
            changePage(currentPage, null);
            form.resetFields();
            setFields([])
            setIsShowModal(false)
        }
    }
    return (
        <div className="digital-signature operate-signature">
            <div style={{ marginTop: '20px', maxWidth: size > 1440 ? '100%' : '1440px' }} className="digital-signature operate-signature">
                <div className="loanlist-operate">
                    <h2 style={{ marginLeft: '5px' }}>SMS</h2>
                    <Table
                        style={{ marginTop: '-10px' }}
                        className="attach-table"
                        dataSource={dataSource}
                        columns={columns}
                        rowKey="key"
                        pagination={false}
                    // onRow={(record) => ({
                    //     onClick: () => handleEdit(record)
                    // })}
                    />
                        <Pagination className="pagination-custom" current={currentPage} defaultPageSize={5} total={totalItem} onChange={changePage}></Pagination>
                </div>
            </div>
            <div style={{ marginBottom: '-20px', maxWidth: size > 1440 ? '100%' : '1440px' }} className="digital-signature operate-signature">
                <div className="loanlist-operate">
                    <div className="product-btn">
                        <h2 style={{ marginLeft: '5px', marginBottom: '15px' }}>
                            {fields?.length > 0 ? 'Cập nhật Template' : "Thêm mới Template"}
                            <PlusCircleOutlined style={{ padding: '10px' }} onClick={resetFields} />
                        </h2>
                    </div>
                    <Form
                        form={form}
                        name="basic"
                        onFinish={onFinish}
                        layout="vertical"
                        fields={fields}
                        style={{ marginLeft: '5px' }}
                    >

                        <Row style={{ marginTop: 20 }}>
                            <Col span="8" className="product-input">
                                <Form.Item name="templateName" label="Template"
                                    rules={[
                                        () => ({
                                            validator(rule, value) {
                                                if (!value) return Promise.reject("Vui lòng template");
                                                return Promise.resolve();
                                            }
                                        })
                                    ]}>
                                    <Input
                                        bordered={false}
                                        style={{
                                            borderBottom: '1px dotted'
                                        }} />
                                </Form.Item>
                            </Col>
                            <Col span="2"></Col>
                            <Col span="8" className="product-input">
                                <Form.Item label="Description" name="description"
                                    rules={[
                                        () => ({
                                            validator(rule, value) {
                                                if (!value) return Promise.reject("Vui lòng nhập description");
                                                return Promise.resolve();
                                            }
                                        })
                                    ]}>
                                    <Input
                                        bordered={false}
                                        style={{
                                            borderBottom: '1px dotted'
                                        }}
                                    />
                                </Form.Item>

                            </Col>
                        </Row>
                        <Form.Item
                            style={{ display: 'none' }}
                            label="Số thứ tự"
                            name="key"
                        >
                            <Input />
                        </Form.Item>
                        <Button htmlType="submit" style={{ backgroundColor: '#1D4994', color: "#fff", margin: 'auto', display: 'block', borderRadius: 5, marginTop: "40px", marginBottom: "40px" }}>
                            <span className="l-calendar-name">{fields?.length > 0 ? 'Cập nhật' : "Thêm mới"}</span>
                        </Button>
                    </Form>

                </div>
            </div>
            <Modal
                className='career-type-popup  popup-custom'
                title={`Bạn có chắc chắn muốn xóa ${currentFields.templateName} không?`}
                visible={isShowModal}
                onCancel={handleCloseModal}
            >
                <div className="career-btn">
                    <Button onClick={() => handleCloseModal()} className="status-btn-default">
                        <span className="l-calendar-name">Không</span>
                    </Button>
                    <Button style={{ marginLeft: '20px' }} onClick={() => handleOk()} className="status-btn-default">
                        <span className="l-calendar-name">Có</span>
                    </Button>
                </div>
            </Modal>

        </div>
    );
}

export default Sms;