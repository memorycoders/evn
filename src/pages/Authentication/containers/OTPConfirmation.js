import React, { Component } from 'react';
import { Row, Col, Button, } from 'antd';
import { InfoCircleOutlined, ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import OtpInput from 'react-otp-input';
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { debounce } from "lodash";

import { NotificationError, NotificationSuccess } from '../../../common/components/Notification'
import './otpConfirmation.scss'
import welcome from '../../../asset/images/evnfc.png';
import { signupConfirmation, signup, resetReaminTime } from '../../../store/authentication/action';
import { history } from '../../../utils/history';

class OTPConfirmation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            countdown: 60,
            otp: '',
            remainedTimeResend: 3,
        }
    }

    // componentWillMount() {
    //     if (this.props?.infoSignup?.infoSignup?.password) {
    //         this.setState({
    //             phone: this.props?.infoSignup.infoSignup.personal_information.phone_number
    //         })
    //     } else {
    //         history.push('/signup')
    //     }
    // }

    componentDidMount() {
        this.resendCountdown();
    }

    componentDidUpdate() {
        if (Number(this.props.remainedTime) === 0) {
            history.push('/signup')
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
                // this.props.signup(this.props.infoSignup.infoSignup);
                // this.setState({
                //     countdown: 60
                // })
                clearInterval(countdownRemainedTime)
            }
        }, 1000)
    }

    onKeyDown = (event) => {
        if (event.keyCode === 13) {
            event.preventDefault();
        }
    };

    d = debounce(() => this.handleSubmit(), 1000);

    handleSubmit = () => {
        if (this.state.otp) {
            this.props.signupConfirmation({
                ...this.props.infoSignup.infoSignup,
                otp: {
                    id: this.props?.infoSignup?.otp?.id,
                    value: this.state.otp
                }
            })
        } else {
            NotificationError("", "H??y nh???p m?? OTP c???a b???n")
        }
    }

    handleChangeOTP = otp => {
        this.setState({ otp });
    }

    handleResendOTP = async () => {
        if (this.state.countdown === 0 && this.state.remainedTimeResend !== 0) {
            this.props.signup(this.props.infoSignup.infoSignup);
            this.setState({
                remainedTimeResend: this.state.remainedTimeResend - 1,
                countdown: 60,
            })
            this.resendCountdown()
        } else {
            if (this.state.remainedTimeResend === 0) {
                history.push('/signup')
                this.props.resetReaminTime()
            }
        }
    }

    render() {
        const { phone, countdown } = this.state;
        return (
            <div className="otp-page">
                <Row>
                    <Col xs={24} sm={8} className="image-background">
                        <img src={welcome} className="welcome-img" />
                    </Col>
                    <Col xs={24} sm={16} className="otp-side">
                        <div className="otp-form">
                            <h3>X??c nh???n OTP</h3>
                            <div style={{ width: '100%', background: '#1D4994', color: '#fff', padding: 8, borderRadius: 4, marginBottom: 15 }}>
                                <InfoCircleOutlined style={{ marginRight: 5 }} /> M?? x??c th???c s??? ???????c g???i t???i {phone}
                            </div>
                            <div style={{ fontWeight: 500, marginBottom: 15 }}>Vui l??ng nh???p m?? x??c th???c OTP</div>
                            <OtpInput
                                isInputNum={true}
                                className="opt-input"
                                value={this.state.otp}
                                onChange={this.handleChangeOTP}
                                numInputs={4}
                                separator={<span>-</span>}
                            />
                            <div style={{ marginTop: 15 }}>B???n kh??ng nh???n ???????c m?? OTP? <span onClick={this.handleResendOTP} style={{ color: '#1D4994', cursor: 'pointer' }}> G???i l???i OTP ({countdown}s)</span></div>
                            <div style={{ marginTop: 15 }}>
                                <span style={{ color: 'red' }}>
                                    L??u ??: </span>????ng k?? s??? b??? h???y b??? n???u b???n nh???p sai OTP qu?? 3 l???n <span style={{ color: 'red' }}>(c??n l???i {this.props.remainedTime} l???n)
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Button className="back-btn"><Link to="/signup"><ArrowLeftOutlined /> Tr??? l???i</Link></Button>
                                <Button className="otp-btn" onClick={this.d}>X??c nh???n <ArrowRightOutlined /></Button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

const mapDispatchToProps = {
    signupConfirmation,
    signup,
    resetReaminTime
};

export default connect((state) => ({
    infoSignup: state.authentication.infoSignup,
    isRemainedSendOTP: state.authentication.isRemainedSendOTP,
    remainedTime: state.authentication.remainedTime,
}), mapDispatchToProps)(OTPConfirmation);