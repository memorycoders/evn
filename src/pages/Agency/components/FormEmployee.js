import React, { useEffect, useState } from "react";
import { Input, Form, Row, Col, Select, Button, DatePicker, Upload } from 'antd';
const { RangePicker } = DatePicker;
import { NotificationError, NotificationSuccess } from '../../../common/components/Notification'
import {
    PlusCircleOutlined,
    UploadOutlined
} from '@ant-design/icons';
import http from "../../../apis/http";
import { connect } from "react-redux";
import { EVN_TOKEN } from "../../../utils/constants";
const FormEmployee = (props) => {
    const { setData, fields, setFields, form, currentAgentPage, handleChangePage, setTotalItem } = props
    const [agents, setAgents] = useState([]);
    const [region, setRegion] = useState([]);
    const [uuid, setUUID] = useState('');
    const status = [
        {
            id: 2,
            name: 'Dừng hoạt động'
        },
        {
            id: 1,
            name: 'Đang hoạt động'
        }
    ]
    const fetchData = async (tab, pageIndex) => {
        try {
            const agentId = JSON.parse(sessionStorage.getItem(EVN_TOKEN)).agent_id
            // const rs = await http.get(`web/providers/employees?agentId=${agentId}&pageIndex=0&pageSize=5`);
            const rs = await http.get(`web/providers/employees?pageIndex=0&pageSize=5`);
            if (rs?.status === 200) {
                setData(rs?.data?.data?.content)
                setTotalItem(rs?.data?.data?.total_elements)

            } else {
                return NotificationError("", "Có lỗi xảy ra. Vui lòng thử lại");
            }
        } catch (ex) { }
    }
    const getAgents = async () => {
        try {
            const rs = await http.get('web/providers/agents')
            if (rs?.status === 200) {
                let id = JSON.parse(sessionStorage.getItem(EVN_TOKEN)).agent_id;
                let role_name = JSON.parse(sessionStorage.getItem(EVN_TOKEN)).user.role.code;
                let obj;
                if (role_name === "Administrator") {
                    obj = rs?.data?.data?.content
                } else {
                    obj = rs?.data?.data?.content?.filter(item => item.id === id)
                }
                setAgents(obj)
                // setAgents(rs?.data?.data?.content)
            } else {
                return NotificationError("", "Có lỗi xảy ra. Vui lòng thử lại");
            }

        } catch (ex) { }
    }
    const getRegion = async (values) => {
        try {
            const rs = await http.get('/web/regions', values);
            if (rs?.status === 200) {
                setRegion(rs?.data?.data?.data)
            } else {
                return NotificationError("", "Có lỗi xảy ra. Vui lòng thử lại");
            }
        } catch (ex) { }
    }
    const handleChangeFileUpload = async (_file) => {
        try {
            let fd = new FormData();
            fd.append('file', _file)
            const rs = await http.post(`web/ftps/upload`, fd);
            if (rs?.status === 200) {
                console.log('rs', rs)
                setUUID(rs?.data?.data?.file_uuid)

                NotificationSuccess("", "Tải ảnh thành công");
            }
        } catch (ex) { }
    }
    const onFinish = async (values) => {
        console.log('value vla', values)
        const employeeDTO =
        {
            "address": values?.address,
            "agent_id": values?.agencyCode,
            "code": values?.employeeId,
            "file_uuid": uuid,
            "id": values.id ? values.id : null,
            "name": values?.name,
            "personal_information": {
                "additional_emails_list": [
                    values?.email
                ],
                "additional_phone_numbers_list": [
                    values?.phone
                ],
                "birthday": "2021-02-18",
                "birthday_value": 0,
                "card_number": values?.cmnd,
                "email": values?.email,
                "gender": 0,
                //   "id": 0,
                "id_card_issued_date": "2021-02-18",
                "id_card_issued_date_value": 0,
                "name": values?.name,
                "phone_number": values?.phone
            },
            "position": values.position,
            // "provider_id": 1,
            "region_id": values?.area,
            "status": values?.status,
            // "user_id": 0
        }
        let url = ''
        if (fields?.length > 0) {
            url = `web/providers/update-employee/${values?.id}`
        } else url = 'web/providers/add-employee'
        const rs = await http.post(url, employeeDTO);
        if (rs?.status === 200) {
            if (fields?.length > 0) {
                NotificationSuccess("", "Cập nhật thành công");
                // fetchData();
                handleChangePage(currentAgentPage)
                form.resetFields();
                setFields([]);

            } else {
                NotificationSuccess("", "Thêm mới thành công");
                const agentId = JSON.parse(sessionStorage.getItem(EVN_TOKEN)).agent_id;
                let role_name = JSON.parse(sessionStorage.getItem(EVN_TOKEN)).user.role.code;
                let _rs;
                if (role_name === "Administrator") {
                    _rs = await http.get(`web/providers/employees?pageIndex=0&pageSize=5`);
                } else {
                    _rs = await http.get(`web/providers/employees?agentId=${agentId}&pageIndex=0&pageSize=5`);
                }
                // const _rs = await http.get(`web/providers/employees?agentId=${agentId}&pageIndex=0&pageSize=5`);
                if (_rs?.status === 200) {
                    let du = _rs?.data?.data?.total_elements % 5;
                    let thuong = Math.floor(_rs?.data?.data?.total_elements / 5);
                    let latest_page = du !== 0 ? (thuong + 1) : thuong;
                    handleChangePage(latest_page)
                    form.resetFields();
                    setFields([]);
                }

                // fetchData();

            }
        }
    }

    useEffect(() => {
        getAgents();
        getRegion();
    }, []);
    // const [form] = Form.useForm();
    const addEquipment = () => {
        form.resetFields();
        setFields([])
    }
    return (
        <>
            <h2>Chi tiết nhân viên <PlusCircleOutlined onClick={addEquipment} /></h2>
            <Form
                form={form}
                onFinish={onFinish}
                layout="vertical"
                name="basic"
                fields={fields}
            >
                <Row>
                    <Col span="7">
                        <Form.Item label="Mã đại lý" name="agencyCode"
                            rules={[
                                () => ({
                                    validator(rule, value) {
                                        if (!value) return Promise.reject("Vui lòng mã đại lý");
                                        return Promise.resolve();
                                    }
                                })
                            ]}>
                            <Select bordered={false} placeholder="Nhập mã đại lý">
                                {
                                    agents?.map((item) => {
                                        return (
                                            <Option value={item.id}>{item.agent_name}</Option>
                                        )
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span="4"></Col>
                    <Col span="7">
                        <Form.Item label="Số điện thoại" name="phone"
                            rules={[
                                () => ({
                                    validator(rule, value) {
                                        if (!value) return Promise.reject("Vui lòng nhập số điện thoại");
                                        return Promise.resolve();
                                    }
                                })
                            ]}>
                            <Input bordered={false} placeholder="Nhập số điện thoại" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span="7">
                        <Form.Item label="Họ tên" name="name"
                            rules={[
                                () => ({
                                    validator(rule, value) {
                                        if (!value) return Promise.reject("Vui lòng họ tên");
                                        return Promise.resolve();
                                    }
                                })
                            ]}>
                            <Input bordered={false} placeholder="Nhập họ tên" />
                        </Form.Item>
                    </Col>
                    <Col span="4"></Col>
                    <Col span="7">
                        <Form.Item label="Mã nhân viên" name='employeeId'
                            rules={[
                                () => ({
                                    validator(rule, value) {
                                        if (!value) return Promise.reject("Vui lòng nhập mã nhân viên");
                                        return Promise.resolve();
                                    }
                                })
                            ]}>
                            <Input bordered={false} placeholder="Nhập mã nhân viên" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span="7">
                        <Form.Item label="Email" name='email'
                            rules={[
                                () => ({
                                    validator(rule, value) {
                                        if (!value) return Promise.reject("Vui lòng nhập email");
                                        return Promise.resolve();
                                    }
                                })
                            ]}>
                            <Input bordered={false} placeholder="Nhập email" />
                        </Form.Item>
                    </Col>
                    <Col span="4"></Col>
                    <Col span="7">
                        <Form.Item label="Vùng phụ trách" name='area'
                            rules={[
                                () => ({
                                    validator(rule, value) {
                                        if (!value) return Promise.reject("Vui lòng nhập vùng phụ trách");
                                        return Promise.resolve();
                                    }
                                })
                            ]}>
                            <Select bordered={false} placeholder="Chọn vùng">
                                {
                                    region?.map((item) => {
                                        return (
                                            <Option value={item.id}>{item.region_name}</Option>
                                        )
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span="7">
                        <Form.Item label="CMND/Hộ chiếu/CCCD" name='cmnd'
                            rules={[
                                () => ({
                                    validator(rule, value) {
                                        if (!value) return Promise.reject("Vui lòng nhập CMND/Hộ chiếu/CCCD");
                                        return Promise.resolve();
                                    }
                                })
                            ]}>
                            <Input bordered={false} placeholder="Nhập CMND/Hộ chiếu/CCCD" />
                        </Form.Item>
                    </Col>
                    <Col span="4"></Col>
                    <Col span="7">
                        <Form.Item label="Địa chỉ thường trú" name='address'
                            rules={[
                                () => ({
                                    validator(rule, value) {
                                        if (!value) return Promise.reject("Vui lòng nhập địa chỉ thường trú");
                                        return Promise.resolve();
                                    }
                                })
                            ]}>
                            <Input bordered={false} placeholder="Nhập địa chỉ thường trú" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span="7">
                        <Form.Item label="Chức vụ" name='position'
                            rules={[
                                () => ({
                                    validator(rule, value) {
                                        if (!value) return Promise.reject("Vui lòng nhập chức vụ");
                                        return Promise.resolve();
                                    }
                                })
                            ]}>
                            <Input bordered={false} placeholder="Nhập chức vụ" />
                        </Form.Item>
                    </Col>
                    <Col span="4"></Col>
                    <Col span="7">
                        <Form.Item label="Ảnh thực tế" name='file_uuid'
                            rules={[
                                () => ({
                                    validator(rule, value) {
                                        if (!value) return Promise.reject("Vui lòng chọn ảnh");
                                        return Promise.resolve();
                                    }
                                })
                            ]}>
                            <Upload beforeUpload={(info) => handleChangeFileUpload(info)}>
                                <Button icon={<UploadOutlined />}>Upload</Button>
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span="7">
                        <Form.Item label="Trạng thái" name="status"
                            rules={[
                                () => ({
                                    validator(rule, value) {
                                        if (!value) return Promise.reject("Vui lòng chọn trạng thái");
                                        return Promise.resolve();
                                    }
                                })
                            ]}>
                            <Select bordered={false} placeholder="Chọn trạng thái">
                                {
                                    status?.map((item) => {
                                        return (
                                            <Option value={item.id}>{item.name}</Option>
                                        )
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span="4"></Col>
                    <Col span="7">
                        <Button
                            style={{ backgroundColor: '#1890ff', minWidth: 120, display: 'block', color: '#fff', cursor: "pointer" }} className="status-btn"
                            type="primary" htmlType="submit">
                            {fields?.length > 0 ? 'Cập nhật' : 'Tạo mới'}
                        </Button>
                    </Col>
                    <Col style={{ display: 'none' }} span="7">
                        <Form.Item label="id" name='id'>
                            <Input>
                            </Input>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </>
    )
}
const mapStateToProps = (state) => {
    return {
        agentId: state?.authentication?.agent_id,
    };
};

export default connect(mapStateToProps, null)(FormEmployee);