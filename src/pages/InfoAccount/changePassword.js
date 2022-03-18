import React, { Component } from "react";
import { Row, Col, Form, Input, Checkbox, Button, Icon } from "antd";
import {
    ArrowRightOutlined,
    EyeInvisibleOutlined,
    EyeTwoTone,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import "./changePassword.scss";
import { changePassword } from "../../store/authentication/action";
import { NotificationError } from '../../common/components/Notification'
import { EVN_TOKEN } from "../../utils/constants";

class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMess: false,
            pass: '',
            repeatPass: '',
        };
    }

    onKeyDown = (event) => {
        if (event.keyCode === 13) {
            this.onFinish();
            event.preventDefault();
        }
    };

    onChangePass = (e) => {
        this.setState({ pass: e.target.value });
        if (this.state.repeatPass && e.target.value && e.target.value !== this.state.repeatPass) {
            this.setState({
                errorMess: true,
            })
        } else {
            this.setState({
                errorMess: false,
            })
        }
    };

    onChangeRepeatPass = (e) => {
        this.setState({ repeatPass: e.target.value });
        if (e.target.value && this.state.pass && e.target.value !== this.state.pass) {
            this.setState({
                errorMess: true,
            })
        } else {
            this.setState({
                errorMess: false,
            })
        }
    };

    onFinish = async (values) => {
        try {
            const { old_password, new_password, repeat_new_password } = values;
            if (new_password !== repeat_new_password) {
                return NotificationError("", "Nhập lại mật khẩu mới không đúng!");
            }

            if (old_password === repeat_new_password) {
                return NotificationError("", "Mật khẩu mới không được trùng với mật khẩu cũ!");
            }

            this.props.changePassword({
                ...values,
                username: sessionStorage.getItem(EVN_TOKEN) ? JSON.parse(sessionStorage.getItem(EVN_TOKEN)).user.username : JSON.parse(localStorage.getItem(EVN_TOKEN)).user.username,
            });
        } catch (error) {
            console.log(error);
        }
    };

    onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    render() {
        const layout = {
            labelCol: { span: 24 },
            wrapperCol: { span: 24 },
        };
        return (
            <div className="changepass-page">
                <div className="changepass-form">
                    <h3>Đổi mật khẩu</h3>
                    <Form
                        style={{ padding: "0px 10px" }}
                        scrollToFirstError
                        {...layout}
                        onFinish={this.onFinish}
                        onFinishFailed={this.onFinishFailed}
                    >
                        <Form.Item
                            label="Mật khẩu hiện tại"
                            name="old_password"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập Mật khẩu hiện tại!",
                                },
                            ]}
                        >
                            <Input.Password
                                autoComplete="new-password"
                                iconRender={(visible) =>
                                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                                }
                            />
                        </Form.Item>
                        <Form.Item
							className="require-style"
                            label="Mật khẩu mới"
                            name="new_password"
                            rules={[
                                ({ getFieldValue }) => ({
                                    validator(rule, value) {
                                        const validation = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[~`!@#$%^&*()_\-:"'?/><.,|\\+= ]).{6,20}$/;
                                        if (value) {
                                            if (validation.test(value)) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(
                                                "Mật khẩu không đúng định dạng! Mật khẩu phải có ít nhất 6-20 ký tự, bao gồm ít nhất 1 ký tự viết hoa, 1 ký tự đặc biệt, 1 ký tự số!"
                                            );
                                        } else {
                                            return Promise.reject(`Vui lòng nhập Mật khẩu!`);
                                        }
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                            onChange={this.onChangePass}
                                autoComplete="new-password"
                                iconRender={(visible) =>
                                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                                }
                            />
                        </Form.Item>
                        <Form.Item
							className="require-style"
                            label="Nhập lại mật khẩu mới"
                            name="repeat_new_password"
                            rules={[
                                ({ getFieldValue }) => ({
                                    validator(rule, value) {
                                        const validation = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[~`!@#$%^&*()_\-:"'?/><.,|\\+= ]).{6,20}$/;
                                        if (value) {
                                            if (validation.test(value)) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(
                                                "Mật khẩu không đúng định dạng! Mật khẩu phải có ít nhất 6-20 ký tự, bao gồm ít nhất 1 ký tự viết hoa, 1 ký tự đặc biệt, 1 ký tự số!"
                                            );
                                        } else {
                                            return Promise.reject(`Vui lòng nhập Mật khẩu!`);
                                        }
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                            onChange={this.onChangeRepeatPass}
                                autoComplete="new-password"
                                onKeyDown={this.onKeyDown}
                                iconRender={(visible) =>
                                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                                }
                            />
                        </Form.Item>
                        {this.state.errorMess ? (
                            <div style={{ color: "#ff4d4f", marginBottom: 7, width: '100%', textAlign: 'left' }}>
                                Nhập lại mật khẩu không đúng
                            </div>
                        ) : null}
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <Button className="signup-btn" type="primary" htmlType="submit">
                                Đổi mật khẩu <ArrowRightOutlined />
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        );
    }
}

export default connect(null, { changePassword })(ChangePassword);
