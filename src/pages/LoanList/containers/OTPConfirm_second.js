import React, { Component } from 'react';
import { Row, Col, Button, } from 'antd';
import { InfoCircleOutlined, ArrowLeftOutlined, ArrowRightOutlined, CheckCircleOutlined } from '@ant-design/icons';
import OtpInput from 'react-otp-input';
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { debounce } from "lodash";

import { NotificationError, NotificationSuccess } from '../../../common/components/Notification'
import '../../Authentication/containers/otpConfirmation.scss';
import welcome from '../../../asset/images/evnfc.png';
import { signupConfirmation, signup, resetReaminTime } from '../../../store/authentication/action';
import { history } from '../../../utils/history';
import Sign from './Sign';
import http from "../../../apis/http";

class OTPConfirm_second extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            countdown: 60,
            otp: '',
            remainedTimeResend: 3,
            step: 2,
            last_time: 3,
        }
    }
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

    handleSubmit = async () => {
        if(this.state.last_time <= 0) {
            NotificationError("", "Giao d???ch bi?? h???y b???.")
            setTimeout(() => {
                history.push('/sign');
            }, 1200);
        }
        if (this.state.otp) {
                console.log('agreementId', this.props.agreementId)
                try {
                    const request = {
                            "agreement_id": this.props.agreementId,
                            // "enc_data": "string",
                            // "enc_key": "string",
                            "otp": this.state.otp
                          
                    }
                    const rs = await http.put('web/agreements/authorize-sign-cloud', request);
                    if(rs?.status === 200) {
                        console.log('message => ', rs)
                        
                        history.push('/success');
                    } else {
                    }
                }catch(ex){
                    NotificationError("", "Ma?? OTP sai. Vui lo??ng th???? la??i");
                    this.setState({
                        countdown: 60,
                        last_time: this.state.last_time - 1
                    })

                }
            
                if(this.state.last_time < 0) {
                    NotificationError("", "Giao d???ch bi?? h???y b???.")
                    setTimeout(() => {
                        history.push('/sign');
                    }, 1200);
                }
             
            
        } else {
            NotificationError("", "H??y nh???p m?? OTP c???a b???n")
        }
    }

    handleChangeOTP = otp => {
        this.setState({ otp });
    }

    handleResendOTP = async () => {
        if (this.state.countdown > 0 && this.state.last_time > 0) {
            try {
            const rs = await http.get('web/agreements/resend-otp-sign-cloud?agreement_id=' + this.props.agreementId);
            if(rs?.status) {
                console.log('??a?? g????i la??i OTP')
                this.setState({
                    countdown: 60,
                })
            }
            } catch (er) {
                NotificationError("", "Co?? l????i xa??y ra. Vui lo??ng th???? la??i")
            }
        } else {
            if (this.state.last_time === 0) {
                NotificationError("", "??a?? h????t ha??n OTP, h????p ??????ng se?? bi?? hu??y.");
                history.push('/signup')
                this.props.resetReaminTime()
            }
        }
    }

    render() {
        const { countdown, step, last_time } = this.state;
        const { phone, signTime, second_phone } = this.props
        return (
            <div className="loan-wrapper">
        <div className="l-loan-container">
            <div className="step-by-step">
					<div className={step === 0 ? "l-register active-step" : "l-register"}>
						<div className="l-register-inner">
							<span>????ng k?? kho???n vay</span>
							<CheckCircleOutlined />
						</div>
					</div>
					<div className={step === 1 ? "l-approval active-step" : "l-approval"}>
						<div className="l-approval-inner">
							<div className="inner2">
								<div>Ph?? duy???t</div>
							</div>
							<CheckCircleOutlined />
						</div>
					</div>
					<div className={step === 2 ? "l-sign active-step" : "l-sign"}>
						<div className="l-sign-inner">
							<div>K?? h???p ?????ng</div>
						</div>
						<CheckCircleOutlined />
					</div>
				</div>
            <div className="otp-page">
                        <div style={{ position: 'static', transform:' translate(85%, 15%)' }} className="otp-form">
                            <h3>X??c nh???n OTP l????n 2</h3>
                            <div style={{ width: '100%', background: '#1D4994', color: '#fff', padding: 8, borderRadius: 4, marginBottom: 15 }}>
                                <InfoCircleOutlined style={{ marginRight: 5 }} /> M?? x??c th???c s??? ???????c g???i t???i {second_phone}
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
                                    L??u ??: </span>Vi????c ky?? h????p ??????ng s??? b??? h???y b??? n???u b???n nh???p sai OTP qu?? 3 l???n <span style={{ color: 'red' }}>(c??n l???i {last_time} l???n)
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Button className="back-btn"><Link to='/sign'><ArrowLeftOutlined /> Tr??? l???i</Link></Button>
                                <Button className="otp-btn" onClick={this.d}>X??c nh???n <ArrowRightOutlined /></Button>
                            </div>
                        </div>
            </div>
           </div>
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
    agreementId: state.loan?.agreementId,
    phone: state.loan?.phone,
    second_phone: state.loan?.second_phone,
    signTime: state.loan?.signTime,
    loanCode: state.loan?.loanCode
}), mapDispatchToProps)(OTPConfirm_second);