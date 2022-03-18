import React, { useState, useEffect } from 'react';
import "../../styles/digitalSignature.scss";
import "../../styles/operate.scss";
import {
    PlusCircleOutlined
} from '@ant-design/icons';
import { Table, Button, Form, Input, Col, Row, Select, Modal, Pagination } from "antd";
import http from "../../apis/http";
import { NotificationError, NotificationSuccess } from '../../common/components/Notification';

function ProductManager(props) {
    let size = window.innerWidth;
    const [form] = Form.useForm();
    const [fields, setFields] = useState([]);
    const [isShowModal, setIsShowModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState("")
    const [totalItem, setTotalItem] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [provider, setProvider] = useState([])

    const fetchProvider = async () => {
        const rs = await http.get('web/admin/providers');
        if (rs.status === 200) {
            setProvider(rs?.data?.data?.content);
        }
    }
    useEffect(() => {
        fetchData(0)
        fetchProvider()
    }, [])
    const [dataSource, setDataSource] = useState([]);


    const fetchData = async (pageIndex) => {
        try {
            const rs = await http.get(`web/admin/product?pageIndex=${pageIndex}&pageSize=5`);
            // const rs = await http.get(`web/admin/product?pageIndex=&pageSize=5`);
            if (rs?.status === 200) {
                setDataSource(rs?.data?.data?.productList)
                setTotalItem(rs?.data?.data?.total)
            }
        } catch (error) {
            console.log(error);

        }

    }
    const columns = [
        {
            title: `Mã sản phẩm `,
            dataIndex: 'productCode',
            key: 'productCode',
            render: productCode => {
                return (
                    <div>{productCode}</div>
                )
            },
        },
        {
            title: `Sản phẩm `,
            dataIndex: 'productName',
            key: 'productName',
            render: productName => {
                return (
                    <div>{productName}</div>
                )
            }
        },
        {
            title: 'Nhà cung cấp',
            dataIndex: 'providerDTO',
            key: 'providerDTO',
            render: providerDTO => {
                return (
                    <div>
                        {providerDTO?.providerName}
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

    const resetFields = () => {
        form.resetFields();
        setFields([])
    }
    const onFinish = async (values) => {
        // console.log("values", values);

        try {
            let url = '';
            if (fields?.length > 0) {
                url = `web/admin/product/${values.key}`
            } else {
                url = "web/admin/product"
            }
            var request = {
                "productCode": values.productCode,
                "productName": values.productName,
                "providerId": values.providerDTO
            }
            const rs = await http.post(url, request);
            if (rs?.status === 200) {
                const _rs = await http.get(`web/admin/product?pageIndex=${0}&pageSize=5`);
                let du = _rs?.data?.data?.total % 5;
                let thuong = Math.floor(_rs?.data?.data?.total / 5);
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
                };
                // changePage(currentPage, null);
            }
        } catch (error) {
            console.log(error)
            return NotificationError('', `Có lỗi xảy ra " ${error.message} " Vui lòng thử lại`);
        }
    }


    const handleEdit = (record) => {
        setFields([
            {
                name: ['productCode'],
                value: record?.productCode,
            },
            {
                name: ['productName'],
                value: record?.productName
            },
            {
                name: ['providerDTO'],
                value: record?.providerDTO?.id
            },
            {
                name: ['key'],
                value: record?.id
            },

        ])
    }
    const changePage = (page, pageSize) => {
        fetchData(page - 1);
        setCurrentPage(page);
    }
    const handleCloseModal = () => {
        setIsShowModal(false);
        form.resetFields();
        setFields([])
    }
    const openModal = (values) => {
        setCurrentProduct(values)
        setIsShowModal(true)
    }
    const handleOk = async () => {
        const id = currentProduct.id
        let url = `web/admin/product/${id}`
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
    const onFinishFailed = (values) => {
        NotificationError("", "Có lỗi xảy ra, vui lòng thử lại");
    }

    return (
        <div className="digital-signature operate-signature">
            <div style={{ marginTop: '20px', maxWidth: size > 1440 ? '100%' : '1440px' }} className="digital-signature operate-signature">
                <div className="loanlist-operate">
                    <h2 style={{ marginLeft: '5px' }}>Danh sách sản phẩm</h2>
                    <Table
                        scroll={scroll}
                        style={{ marginTop: '-10px' }}
                        className="attach-table"
                        dataSource={dataSource}
                        columns={columns}
                        rowKey="code"
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
                            {fields?.length > 0 ? 'Cập nhật sản phẩm' : "Thêm mới sản phẩm"}
                            <PlusCircleOutlined style={{ padding: '10px' }} onClick={resetFields} />
                        </h2>
                    </div>
                    <Form
                        form={form}
                        name="basic"
                        onFinish={onFinish}
                        layout="vertical"
                        fields={fields}
                        onFinishFailed={onFinishFailed}
                        style={{ marginLeft: '5px' }}
                    >

                        <Row style={{ marginTop: 20 }}>
                            <Col span="8" className="product-input">
                                <Form.Item name="productCode" label="Mã sản phẩm "
                                    rules={[
                                        () => ({
                                            validator(rule, value) {
                                                if (!value) return Promise.reject("Vui lòng nhập mã sản phẩm");
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
                                <Form.Item label="Sản phẩm" name="productName"
                                    rules={[
                                        () => ({
                                            validator(rule, value) {
                                                if (!value) return Promise.reject("Vui lòng nhập sản phẩm");
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
                                    name="providerDTO"
                                    label="Nhà cung cấp"
                                    rules={[
                                        () => ({
                                            validator(rule, value) {
                                                if (!value) return Promise.reject("Vui lòng nhập nhà cung cấp");
                                                return Promise.resolve();
                                            }
                                        })
                                    ]}>
                                    <Select
                                        bordered={false}
                                        style={{
                                            borderBottom: '1px dotted'
                                        }}
                                        placeholder="Chọn nhà cung cấp">
                                        {
                                            provider?.map((item) => {
                                                return (
                                                    <Option value={item.id}>{item.providerName}</Option>
                                                )
                                            })
                                        }
                                    </Select>
                                    {/* <Input
                                        bordered={false}
                                        style={{
                                            borderBottom: '1px dotted'
                                        }}
                                    /> */}
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
                title={"Bạn có chắc chắn muốn xóa sản phẩm " + currentProduct.productName + " không?"}
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

export default ProductManager;