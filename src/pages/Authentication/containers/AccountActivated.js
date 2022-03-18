import React, { useState, useEffect } from "react";
import {
    Row,
    Col,
    Button
} from "antd";
import { Link } from "react-router-dom";

import { CheckCircleOutlined, ArrowRightOutlined  } from '@ant-design/icons';

import "./signup.scss";
import welcome from "../../../asset/images/evnfc.png";

function AccountActivated() {

    return (
        <div className="signup-page">
            <Row>
                <Col xs={24} sm={8} className="image-background">
                    <img src={welcome} className="welcome-img" />
                </Col>
                <Col xs={24} sm={16} className="signup-side">
                    <div className="signup-success-form">
                        <div className="success-icon"><CheckCircleOutlined /></div>
                        <div>Bạn đã kích hoạt tài khoản thành công </div>
                        <div style={{display: 'flex', justifyContent: 'center', marginTop: 20}}>
                            <Button className="signup-btn">
                                <Link to="/login">
                                    Đăng nhập
                                </Link>
                            </Button>
                        </div>
                    </div>
                </Col>
            </Row>
        </div >
    );

}

export default AccountActivated;
