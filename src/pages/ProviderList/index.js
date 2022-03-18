import React, { useState, useEffect } from 'react';
import "../../styles/digitalSignature.scss";
import "../../styles/operate.scss";
import {
    PlusCircleOutlined
} from '@ant-design/icons';
import { Table, Button, Form, Input, Col, Row, Select, Modal, Pagination } from "antd";
import http from "../../apis/http";
import { NotificationError, NotificationSuccess } from '../../common/components/Notification';
function ProviderList(props) {


    let size = window.innerWidth;
    const [form] = Form.useForm();
    const [fields, setFields] = useState([]);
    const [isShowModal, setIsShowModal] = useState(false);
    const [currentProvider, setCurrentProvider] = useState("")
    const [totalItem, setTotalItem] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    useEffect(() => {
        fetchData(0)
    }, [])

    const fetchData = async (pageIndex) => {
        try {
            const rs = await http.get(`web/admin/providers?pageIndex=${pageIndex}&pageSize=5`)
            if (rs?.status === 200) {
                setDataSource(rs?.data?.data?.content)
                setTotalItem(rs?.data?.data?.total_elements)
            }
        } catch (error) {
            console.log("error", error);
        }
    }
    const columns = [
        {
            title: `Mã nhà CC `,
            dataIndex: 'providerCode',
            key: 'providerCode',
            render: providerCode => {
                return (
                    <div>{providerCode}</div>
                )
            },
        },
        {
            title: `Tên nhà CC `,
            dataIndex: 'providerName',
            key: 'providerName',
            render: providerName => {
                return (
                    <div>{providerName}</div>
                )
            }
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
            render: address => {
                return (
                    <div>
                        {address}
                    </div>
                )
            }
        },
        {
            title: 'Action',
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
                        <Button className='status-btn btn-border-radius' onClick={() => openModal(record)} style={{ backgroundColor: '#1D4994' }}>
                            <span className="l-calendar-name">Xóa</span>
                        </Button>
                    </div>
                )
            }
        },
    ];
    const [dataSource, setDataSource] = useState([]);

    const resetFields = () => {
        form.resetFields();
        setFields([])
    }
    const onFinish = async (values) => {
        console.log('values', values)
        try {
            let url = "";
            if (fields?.length > 0) {
                url = `web/admin/providers/${values.key}`
            } else {
                url = `web/admin/providers`
            }
            var request = {
                "address": values.address,
                "email": values.email,
                "phone_number": values.phoneNumber,
                "providerCode": values.providerCode,
                "providerName": values.providerName
            }
            const rs = await http.post(url, request);
            if (rs?.status === 200) {
                const _rs = await http.get(`web/admin/providers?pageIndex=${0}&pageSize=5`);
                let du = _rs?.data?.data?.total_elements % 5;
                let thuong = Math.floor(_rs?.data?.data?.total_elements / 5);
                let latest_page = du !== 0 ? (thuong + 1) : thuong;
                if (fields?.length > 0) {
                    NotificationSuccess('', "Cập nhật thành công")
                    changePage(latest_page, null);
                    form.resetFields();
                    setFields([])
                } else {
                    NotificationSuccess('', "Thêm mới thành công")
                    changePage(latest_page, null);
                    form.resetFields();
                    setFields([])
                }
                // changePage(currentPage, null);
            }
        } catch (error) {
            return NotificationError('', `Có lỗi xảy ra " ${error.message} " Vui lòng thử lại`);
        }
    }

    const changePage = (page, pageSize) => {
        fetchData(page - 1);
        setCurrentPage(page);
    }
    const handleEdit = (record) => {
        console.log('record', record);
        setFields([
            {
                name: ['providerCode'],
                value: record?.providerCode,
            },
            {
                name: ['providerName'],
                value: record?.providerName
            },
            {
                name: ['address'],
                value: record?.address
            },
            {
                name: ['email'],
                value: record?.email
            },
            {
                name: ['phoneNumber'],
                value: record?.phoneNumber
            },
            {
                name: ['key'],
                value: record?.id
            },

        ])
    }

    const handleCloseModal = () => {
        setIsShowModal(false);
        resetFields();
    }
    const openModal = (values) => {
        console.log(values);
        setCurrentProvider(values)
        setIsShowModal(true)
    }
    const handleOk = async () => {
        let id = currentProvider.id;
        let url = `web/admin/providers/${id}`
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
        setIsShowModal(false)
        resetFields();
    }

    return (
        <div className="digital-signature operate-signature">
            <div style={{ marginTop: '20px', maxWidth: size > 1440 ? '100%' : '1440px' }} className="digital-signature operate-signature">
                <div className="loanlist-operate">
                    <h2 style={{ marginLeft: '5px' }}>Danh sách nhà cung cấp</h2>
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
                            {fields?.length > 0 ? 'Cập nhật Nhà cung cấp' : "Thêm mới nhà cung cấp"}
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
                                <Form.Item name="providerCode" label="Mã nhà cung cấp "
                                    rules={[
                                        () => ({
                                            validator(rule, value) {
                                                if (!value) return Promise.reject("Vui lòng nhập mã nhà cung cấp");
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
                                <Form.Item label="Địa chỉ" name="address"
                                    rules={[
                                        () => ({
                                            validator(rule, value) {
                                                if (!value) return Promise.reject("Vui lòng nhập địa chỉ");
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
                        <Row style={{ marginTop: 20 }}>
                            <Col span="8" className="product-input">
                                <Form.Item
                                    name="providerName"
                                    label="Nhà cung cấp"
                                    rules={[
                                        () => ({
                                            validator(rule, value) {
                                                if (!value) return Promise.reject("Vui lòng nhập nhà cung cấp");
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
                            <Col span="2"></Col>
                            <Col span="8" className="product-input">
                                <Form.Item label="Email" name="email"
                                    rules={[
                                        ({ getFieldValue }) => ({
                                            validator(rule, value) {
                                                const validation = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
                                                if (value) {
                                                    const listCheck = value.split("@");
                                                    if (
                                                        value.includes("..") ||
                                                        listCheck[0].startsWith(".") ||
                                                        listCheck[0].endsWith(".") ||
                                                        (listCheck.length > 1 &&
                                                            listCheck[1].startsWith(".")) ||
                                                        (listCheck.length > 1 &&
                                                            listCheck[1].endsWith("."))
                                                    ) {
                                                        return Promise.reject(
                                                            "Email không đúng định dạng!"
                                                        );
                                                    }

                                                    if (value.length > 255) {
                                                        return Promise.reject(
                                                            "Email vượt quá 255 ký tự!"
                                                        );
                                                    }
                                                    if (validation.test(value)) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(
                                                        "Email không đúng định dạng!"
                                                    );
                                                } else {
                                                    return Promise.reject("Vui lòng nhập Email");
                                                }
                                            },
                                        }),
                                    ]}
                                >
                                    <Input
                                        bordered={false}
                                        style={{
                                            borderBottom: '1px dotted'
                                        }}
                                    />
                                </Form.Item>

                            </Col>
                        </Row>
                        <Row style={{ marginTop: 20 }}>
                            <Col span="8" className="product-input">
                                <Form.Item
                                    name="phoneNumber"
                                    label="Số điện thoại"
                                    rules={
                                        [
                                            () => ({
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
                                        ]
                                    }

                                >
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
                className='career-type-popup'
                title={`Bạn có chắc chắn muốn xóa sản phẩm ${currentProvider.providerName} không?`}
                visible={isShowModal}
                onCancel={handleCloseModal}
            >
                <div className="career-btn">
                    <Button onClick={() => handleCloseModal()} className="status-btn-default">
                        <span className="l-calendar-name">Không</span>
                    </Button>
                    <Button style={{ marginLeft: '20px' }} onClick={(record) => handleOk(record)} className="status-btn-default">
                        <span className="l-calendar-name">Có</span>
                    </Button>
                </div>
            </Modal>
        </div>
    );
}

export default ProviderList;