import React from 'react';
import { Col, Row, } from "antd";
import img from "../../asset/images/huongdangdtien.png";
import img2 from "../../asset/images/huongdangdtien2.png";
function MoneyTransferInstrusction(props) {
    return (
        <div className="support ">
            <div className="support-container">
                <h2 className="support-title">Hướng dẫn giao dịch chuyển tiền </h2>
                <Row span="24" className="support-item support-center">
                    <Col span="10" className="support-item-img">
                            <img src={img} alt=""></img>
                    </Col>
                </Row>
                <Row span="24" className="support-item support-center">
                    <Col span="20" className="support-item-img">
                        <img src={img2} alt=""></img>
                    </Col>  
                </Row>
                
            </div>
        </div>
    );
}

export default MoneyTransferInstrusction;