import React, { Component } from 'react';
import { Row, Col, Button, Input, Form } from 'antd';
import {
    EyeTwoTone, ArrowLeftOutlined, ArrowRightOutlined,
    EyeInvisibleOutlined,
} from '@ant-design/icons';
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import OtpInput from 'react-otp-input';

import { history } from '../../../utils/history'
import './otpConfirmation.scss'
import welcome from '../../../asset/images/evnfc.png';
import { forgotPasswordConfirmation, resetReaminTime, forgotPassword } from '../../../store/authentication/action';
import { NotificationError } from '../../../common/components/Notification'

class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            otp: '',
            errorMess: false,
            pass: '',
            repeatPass: '',
            countdown: 60,
        }
    }

    componentWillMount() {
        if (!this.props?.idForgotPass?.idForgotPass) {
            history.push('/login')
        }
    }

    componentDidMount() {
        this.resendCountdown();
    }

    componentDidUpdate() {
        if (Number(this.props.remainedTime) === 0) {
            history.push('/forgot-password')
            this.props.resetReaminTime()
        }
    }

    resendCountdown = () => {
        const countdownRemainedTime = setInterval(() => {
            if (this.state.countdown > 0) {
                this.setState({
                    countdown: this.state.countdown - 1
                })
            }
            else {
                clearInterval(countdownRemainedTime)
            }
        }, 1000)
    }

    handleResendOTP = () => {
        if (this.state.countdown === 0 && this.props.remainedTime !== 0) {
            this.props.forgotPassword(this.props.idForgotPass.userName);
            this.setState({
                countdown: 60,
                otp: '',
            })
            this.resendCountdown()
        } else {
            if (this.props.remainedTime === 0) {
                history.push('/forgot-password')
                this.props.resetReaminTime()
            }
        }
    }

    onKeyDown = (event) => {
        if (event.keyCode === 13) {
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
            if (this.state.otp) {
                const { new_password, repeat_new_password } = values;
                if (new_password !== repeat_new_password) {
                    return NotificationError("", "Nhập lại mật khẩu mới không đúng!");
                }
                const payload = {
                    new_password: values.new_password,
                    otp: {
                        id: this.props.idForgotPass.idForgotPass,
                        value: this.state.otp,
                    },
                    username: this.props.idForgotPass.userName
                }
                this.props.forgotPasswordConfirmation(payload);
            } else {
                NotificationError("", "Hãy nhập mã OTP của bạn")
            }
        } catch (error) {
            console.log(error);
        }
    };

    onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    handleChangeOTP = otp => {
        this.setState({ otp });
    }

    handleBack = () => {
        this.props.resetReaminTime()
    }

    render() {
        const { errorMess, countdown } = this.state;
        const layout = {
            labelCol: { span: 24 },
            wrapperCol: { span: 24 },
        };
        return (
            <div className="otp-page">
                <Row>
                    <Col xs={24} sm={8} className="image-background">
                        <img src={welcome} className="welcome-img" />
                    </Col>
                    <Col xs={24} sm={16} className="otp-side">
                        <div className="otp-form">
                            <h3>Đặt lại mật khẩu</h3>
                            <Form
                                style={{
                                    padding: "0px 10px", display: 'flex', flexDirection: 'column',
                                    alignItems: 'center'
                                }}
                                scrollToFirstError
                                {...layout}
                                onFinish={this.onFinish}
                                onFinishFailed={this.onFinishFailed}
                            >
                                <div style={{ fontWeight: 500, marginBottom: 15 }}>Vui lòng nhập mã xác thực OTP</div>
                                <OtpInput

                                    isInputNum={true}
                                    className="opt-input"
                                    value={this.state.otp}
                                    onChange={this.handleChangeOTP}
                                    numInputs={4}
                                    separator={<span>-</span>}
                                />
                                <Form.Item
                                    className="require-style"
                                    style={{ width: '100%' }}
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
                                    style={{ width: '100%' }}
                                    rules={[
                                        ({ getFieldValue }) => ({
                                            validator(rule, value) {
                                                const validation = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[~`!@#$%^&*()_\-:"'?/><.,|\\+= ]).{6,20}$/;
                                                if (value) {
                                                    if (validation.test(value)) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(
                                                        "Mật khẩu phải có ít nhất 6-20 ký tự"
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
                                {errorMess ? (
                                    <div style={{ color: "#ff4d4f", marginBottom: 7, width: '100%', textAlign: 'left' }}>
                                        Nhập lại mật khẩu không đúng
                                    </div>
                                ) : null}
                                <div style={{ marginBottom: 15 }}>Bạn không nhận được mã OTP? <span onClick={this.handleResendOTP} style={{ color: '#1D4994', cursor: 'pointer' }}> Gửi lại OTP ({countdown}s)</span></div>
                                <div style={{ marginBottom: 15 }}>
                                    <span style={{ color: 'red' }}>
                                        Lưu ý: </span>Đặt lại mật khẩu sẽ bị hủy bỏ nếu bạn nhập sai OTP quá 3 lần <span style={{ color: 'red' }}>(còn lại {this.props.remainedTime} lần)
                                </span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "center" }}>
                                    <Button style={{ borderColor: '#1D4994', color: '#1D4994', marginBottom: 20, marginRight: 20 }}><Link onClick={this.handleBack} to="/forgot-password"><ArrowLeftOutlined /> Trở lại</Link></Button>
                                    <Button className="reset-btn" type="primary" htmlType="submit">
                                        Đổi mật khẩu <ArrowRightOutlined />
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

const mapDispatchToProps = {
    forgotPasswordConfirmation,
    forgotPassword,
    resetReaminTime
};
const mapStateToProps = (state) => ({
    idForgotPass: state.authentication.idForgotPass,
    isRemainedSendOTP: state.authentication.isRemainedSendOTP,
    remainedTime: state.authentication.remainedTime,
})
export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);