import React, { useState, useEffect } from 'react';
import { Checkbox, Button, Form, Input, Col, Row, Radio, Tabs, Select } from "antd";
import http from "../../../apis/http";
import { NotificationError, NotificationSuccess } from '../../../common/components/Notification'

const { TabPane } = Tabs;
function AddAccount(props) {

    let size = window.innerWidth;
    const [key, setKey] = useState("1")
    const [provider, setProvider] = useState([]);
    const onHanleChange = (e) => {
        setKey(e.target.value)
    }
    const [formRegion] = Form.useForm();
    const [formRegion2] = Form.useForm();

    const onFinishs = async (value) => {
        try {
            const request =
            {
                "cardNumber": key === '1' ? value?.card_number : value?.taxCode,
                "email": value?.email,
                "personal_type": key === '1' ? 'CITIZEN' : 'BUSINESS',
                "phone_number": value?.phone,
                "username": value?.username
            }
            const rs = await http.post('web/admin/customer', request);
            if (rs?.status === 200) {
                formRegion.resetFields();
                formRegion2.resetFields();
                return NotificationSuccess('', 'Thêm mới thành công.');
            }
        } catch (ex) {
            return NotificationError('', ex.message)
        }
    }
    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };
    return (
        <div className="digital-signature operate-signature">
            <div style={{ marginTop: '20px', maxWidth: size > 1440 ? '100%' : '1440px' }} className="digital-signature operate-signature">
                <div className="loanlist-operate">
                    <h2 >Thêm mới tài khoản khách hàng</h2>
                    <Radio.Group onChange={onHanleChange} value={key} className="ant-radio-custom" style={{ marginBottom: 25, paddingLeft: 5, marginTop: 20 }}>
                        <Radio value="1">Khách hàng cá nhân</Radio>
                        <Radio value="2">Khách hàng doanh nghiệp</Radio>
                    </Radio.Group>
                    <Tabs defaultActiveKey={key} activeKey={key} className="ant-tab-account" >
                        <TabPane key="1">
                            <Form
                                form={formRegion}
                                layout="vertical"
                                name="normal_login"
                                initialValues={{
                                    remember: false,
                                }}
                                onFinish={onFinishs}
                                onFinishFailed={onFinishFailed}
                            >
                                <Row>
                                    <Col span="8">
                                        <Form.Item name="username" label="Tên Khách Hàng "
                                            rules={[
                                                () => ({
                                                    validator(rule, value) {
                                                        if (!value) return Promise.reject("Vui lòng nhập Tên Khách Hàng!");
                                                        if (value && value.trim() === '') return Promise.reject("Vui lòng nhập Tên Khách Hàng!");
                                                        const regExp = /\`|\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\+|\=|\[|\{|\]|\}|\||\\|\'|\<|\,|\.|\>|\?|\/|\""|\;|\:|\_|\d/;
                                                        if (regExp.test(value)) return Promise.reject("Tên Khách Hàng sai định dạng")
                                                        if (value.length > 255) return Promise.reject("Tên Khách Hàng không được lớn hơn 255 ký tự");
                                                        if (value.length < 3) return Promise.reject("Tên Khách Hàng không được ít hơn 3 ký tự");
                                                        return Promise.resolve();
                                                    }
                                                })
                                            ]}
                                        >
                                            <Input bordered={false} />
                                        </Form.Item>
                                    </Col>
                                    <Col span="2"></Col>
                                    <Col span="8">
                                        <Form.Item name="email"
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
                                            label="Email">
                                            <Input bordered={false} />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col span="8">
                                        <Form.Item name="phone"
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
                                            label="Điện thoại" >
                                            <Input bordered={false} />
                                        </Form.Item>
                                    </Col>
                                    <Col span="2"></Col>
                                    <Col span="8">
                                        <Form.Item name="card_number"
                                            label="CMND/Hộ chiếu/Căn cước"
                                            rules={[
                                                () => ({
                                                    validator(rule, value) {
                                                        if (!value) return Promise.reject("Vui lòng nhập Số CMND/CCCD/Hộ chiếu!");
                                                        if (value && value.trim() === '') return Promise.reject("Vui lòng nhập Số CMND/CCCD/Hộ chiếu!");
                                                        const regExp = /^[A-Za-z0-9]*$/;
                                                        const char = /^[A-Za-z]*$/;
                                                        const int = /^[0-9]*$/;
                                                        if (!char.test(value.charAt(0))) {
                                                            if (!int.test(value)) return Promise.reject("Số CMND/CCCD/Hộ chiếu sai định dạng");
                                                        } else {
                                                            if (!int.test(value.substring(1))) {
                                                                if (!int.test(value)) return Promise.reject("Số CMND/CCCD/Hộ chiếu sai định dạng");
                                                            }
                                                        }
                                                        if (value.length < 8) return Promise.reject("Số CMND/CCCD/Hộ chiếu sai định dạng");
                                                        if (value.length > 12) return Promise.reject("Số CMND/CCCD/Hộ chiếu không được lớn hơn 12 ký tự");
                                                        return Promise.resolve();
                                                    }
                                                })
                                            ]}
                                        >
                                            <Input bordered={false} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>

                                        <Form.Item name="remember"
                                            valuePropName="checked"
                                            rules={[
                                                {
                                                    validator: (_, value) =>
                                                        value ? Promise.resolve() : Promise.reject(new Error('Vui lòng xác nhận gửi thông tin đăng nhập qua số điện thoại / Email')),
                                                },
                                            ]}

                                        >
                                            <Checkbox >Gửi thông tin đăng nhập qua số điện thoại / Email</Checkbox>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <div className="content-center"><Button type="primary" htmlType="submit" style={{ marginTop: 10 }}> Thêm mới</Button></div>
                            </Form>
                        </TabPane>
                        <TabPane key="2">
                            <Form
                                form={formRegion2}
                                layout="vertical"
                                name="normal_login"
                                initialValues={{
                                    remember: false,
                                }}
                                onFinish={onFinishs}
                                onFinishFailed={onFinishFailed}
                            >
                                <Row>
                                    <Col span="8">
                                        <Form.Item label="Tên Khách Hàng"
                                            name="username"
                                            rules={[
                                                () => ({
                                                    validator(rule, value) {
                                                        if (!value) return Promise.reject("Vui lòng nhập Tên Khách Hàng!");
                                                        if (value && value.trim() === '') return Promise.reject("Vui lòng nhập Tên Khách Hàng!");
                                                        const regExp = /\`|\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\+|\=|\[|\{|\]|\}|\||\\|\'|\<|\,|\.|\>|\?|\/|\""|\;|\:|\_|\d/;
                                                        if (regExp.test(value)) return Promise.reject("Tên Khách Hàng sai định dạng")
                                                        if (value.length > 255) return Promise.reject("Tên Khách Hàng không được lớn hơn 255 ký tự");
                                                        if (value.length < 3) return Promise.reject("Tên Khách Hàng không được ít hơn 3 ký tự");
                                                        return Promise.resolve();
                                                    }
                                                })
                                            ]}
                                        >
                                            <Input bordered={false} />
                                        </Form.Item>
                                    </Col>
                                    <Col span="2"></Col>
                                    <Col span="8">
                                        <Form.Item label="Email"
                                            name="email"
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
                                            <Input bordered={false} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="8">
                                        <Form.Item label="Điện thoại"
                                            name="phone"
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
                                            <Input bordered={false} />
                                        </Form.Item>
                                    </Col>
                                    <Col span="2"></Col>
                                    <Col span="8">
                                        <Form.Item label="Mã số thuế"
                                            name="taxCode"
                                            rules={[
                                                () => ({
                                                    validator(rule, value) {
                                                        if (!value) return Promise.reject("Vui lòng nhập Mã số thuế");

                                                        return Promise.resolve();
                                                    }
                                                })
                                            ]}
                                        >
                                            <Input bordered={false} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Item name="remember"
                                            valuePropName="checked"
                                            rules={[
                                                {
                                                    validator: (_, value) =>
                                                        value ? Promise.resolve() : Promise.reject(new Error('Vui lòng chấp nhận điều khoản')),
                                                },
                                            ]}
                                        >
                                            <Checkbox >Gửi thông tin đăng nhập qua số điện thoại / Email</Checkbox>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <div className="content-center"><Button type="primary" htmlType="submit" style={{ marginTop: 10 }}> Thêm mới </Button></div>
                            </Form>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}

export default AddAccount;