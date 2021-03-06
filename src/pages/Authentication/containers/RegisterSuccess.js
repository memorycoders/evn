import React, { Component } from "react";
import {
    Row,
    Col,
    Button
} from "antd";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { CheckCircleOutlined, ArrowRightOutlined  } from '@ant-design/icons';

import "./signup.scss";
import welcome from "../../../asset/images/evnfc.png";
import { signupResend, setInfoSignup } from "../../../store/authentication/action";
import { history } from '../../../utils/history';
import Loading from "../../../common/components/Loading"

class SignupSuccess extends Component {
    constructor(props) {
        super(props);
        this.state = {
            countdown: 60
        }
    }

    componentWillMount() {
        if (this.props?.infoSignup?.infoSignup?.personal_information.phone_number) {
            this.setState({
                phone: this.props?.infoSignup.infoSignup.personal_information.phone_number
            })
        } else {
            history.push('/signup')
        }
    }

    componentDidMount() {
        this.resendCountdown();
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

    handleResend = () => {
        if (this.state.countdown === 0) {
            this.props.signupResend(this.props.infoSignup.infoSignup);
            this.setState({
                countdown: 60,
            })
            this.resendCountdown()
        }
    }

    handleLogin = () => {
        this.props.setInfoSignup(null)
    }

    render() {
        const { countdown } = this.state;
        return (
            <div className="signup-page">
                <Row>
                    <Col xs={24} sm={8} className="image-background">
                        <img src={welcome} className="welcome-img" />
                    </Col>
                    <Col xs={24} sm={16} className="signup-side">
                        <div className="signup-success-form">
                            <h3>????ng k?? th??nh c??ng</h3>
                            <div className="success-icon"><CheckCircleOutlined /></div>
                            {/* <div>Vui l??ng ki???m tra {this.props.method === 2 ? "Email" : "Tin nh???n" } nh???n th??ng tin t??i kho???n ????ng nh???p!</div> */}
                            <div>Vui l??ng ki???m tra Tin nh???n/Email ????? nh???n th??ng tin t??i kho???n ????ng nh???p!</div>
                            <div>B???n kh??ng nh???n ???????c th??ng tin t??i kho???n?<br/> <span onClick={this.handleResend} style={{ color: '#1D4994', cursor: 'pointer' }}>G???i l???i {this.props.method === 2 ? "Email" : "Tin nh???n" } ({countdown}s)</span></div>
                            <div style={{display: 'flex', justifyContent: 'center', marginTop: 20}}>
                                <Button className="signup-btn">
                                    <Link onClick={this.handleLogin} to="/login">
                                        ????ng nh???p
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </Col>
                </Row>
                {this.props.isLoading ? <Loading /> : null}
            </div >
        );
    }

}

const mapDispatchToProps = {
    signupResend,
    setInfoSignup,
};

export default connect((state) => ({
    infoSignup: state.authentication.infoSignup,
    isLoading: state.authentication.isLoading,
    method: state.authentication.infoSignup?.infoSignup?.receive_account_information_method,
}), mapDispatchToProps)(SignupSuccess)
