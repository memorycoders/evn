import React, { Component } from 'react';
import { Row, Col, Button, Input } from 'antd';
import { InfoCircleOutlined, ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import './otpConfirmation.scss'
import welcome from '../../../asset/images/evnfc.png';
import { forgotPassword } from '../../../store/authentication/action';
import Loading from "../../../common/components/Loading";

class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            errMess: '',
        }
    }

    onKeyDown = (event) => {
        if (event.keyCode === 13) {
            event.preventDefault();
        }
    };

    handChangePhone = e => {
        if(e.target.value.length  > 255) {
            this.setState({
                errMess: "Số điện thoại/Email vượt quá 255 ký tự!"
            })
        } else {
            this.setState({
                errMess: ""
            })
        }
        this.setState({ phone: e.target.value });
    }

    handleSendPhone = () => {
        if (this.state.phone) {
            this.props.forgotPassword(this.state.phone)
        } else {
            this.setState({
                errMess: "Vui lòng nhập Số điện thoại/Email!"
            })
        }
    }

    render() {
        const { errMess } = this.state;
        return (
            <div className="otp-page">
                <Row>
                    <Col xs={24} sm={8} className="image-background">
                        <img src={welcome} className="welcome-img" />
                    </Col>
                    <Col xs={24} sm={16} className="otp-side">
                        <div className="otp-form">
                            <h3>Quên mật khẩu</h3>
                            <div style={{ width: '100%', background: '#1D4994', color: '#fff', padding: 8, borderRadius: 4, marginBottom: 15 }}>
                                <InfoCircleOutlined style={{ marginRight: 5 }} /> Nhập số điện thoại/Email đã đăng ký để lấy lại mật khẩu
                            </div>
                            <div style={{ width: '100%', textAlign: 'left', marginBottom: 10 }}>Số điện thoại/Email</div>
                            <Input onChange={this.handChangePhone}/>
                            {errMess ? <div style={{color: 'red', display: 'flex', alignItems: 'flex-start', width: '100%'}}>{errMess}</div> : null}
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <Button className="back-btn"><Link to="/login"><ArrowLeftOutlined /> Trở lại</Link></Button>
                                <Button className="otp-btn" onClick={this.handleSendPhone}>Xác nhận <ArrowRightOutlined /></Button>
                            </div>
                        </div>
                    </Col>
                </Row>
                {this.props.isLoading ? <Loading /> : null}
            </div>
        )
    }
}

const mapDispatchToProps = {
    forgotPassword,
};

export default connect((state) => ({
    isLoading: state.authentication.isLoading,
}), mapDispatchToProps)(ForgotPassword);