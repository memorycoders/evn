import React, { useEffect, useState } from "react";
import { Input, Form, Row, Col, Select, Button, DatePicker } from "antd";
import http from "../../../apis/http";
import { NotificationError, NotificationSuccess } from '../../../common/components/Notification'
import { connect } from "react-redux";
import moment from 'moment';
const CompanyInfo = (props) => {
    const [form] = Form.useForm();
    // const { user } = props;
    // console.log("userCompany", user);

    const data = JSON.parse(sessionStorage.getItem("evn-token"))
    
    
    return (
        <>
            <h2 style={{ color: '#fff', marginTop: 10 }}>Thông tin chủ hợp đồng</h2>
            <Form style={{ color: '#fff' }} form={form} layout="vertical" name="basic">
                <Row style={{ marginTop: 20 }}>
                    <Col span="3">
                        <Form.Item label={<label style={{ color: "#fff", fontWeight: 500 }}>Tên công ty</label>} name="name"></Form.Item>
                    </Col>
                    <Col>
                        <Input
                            style={{ width: "150%", color: "#fff", padding: '0px 20px' }}
                            bordered={false}
                            value={data?.personal_information?.name ? data?.personal_information?.name : 'Chưa cập nhật' }
                            readOnly
                        />
                    </Col>
                    <Col span="3"></Col>
                    <Col>
                        <Form.Item label={<label style={{ color: "#fff", fontWeight: 500, minWidth: '200px' }}>Người đại diện pháp luật</label>} name="passpost"></Form.Item>
                    </Col>
                    <Col>
                        <Input
                            style={{ width: "115%", color: "#fff", padding: '0px 20px' }}
                            bordered={false}
                            defaultValue="Chưa cập nhật"
                            readOnly
                        />
                    </Col>
                </Row>
                <Row style={{ marginTop: '-30px' }}>
                    <Col span="3">
                        <Form.Item label={<label style={{ color: "#fff", fontWeight: 500 }}>Ngày giấy cấp phép</label>} name="dob"></Form.Item>
                    </Col>
                    <Col>
                        <Input
                            style={{ width: "115%", color: "#fff", padding: '0px 20px' }}
                            bordered={false}
                            // defaultValue="17/12/2019"
                            value={data?.personal_information?.id_card_issued_date_value ?  moment(data?.personal_information?.id_card_issued_date_value).format('DD-MM-YYYY') : 'Chưa cập nhật' }
                            readOnly
                        />
                    </Col>
                    <Col span="3"></Col>
                    <Col>
                        <Form.Item label={<label style={{ color: "#fff", fontWeight: 500 }}>Mã số thuế</label>} name="account"></Form.Item>
                    </Col>
                    <Col>
                        <Input
                            style={{ width: "115%", color: "#fff", padding: '0px 20px' }}
                            bordered={false}
                            // defaultValue="012345678"
                            value={data?.personal_information?.card_number ? data?.personal_information?.card_number : 'Chưa cập nhật' }
                            readOnly
                        />
                    </Col>
                </Row>
                <Row style={{ marginTop: '-30px' }}>
                    <Col span="3">
                        <Form.Item label={<label style={{ color: "#fff", fontWeight: 500 }}>Địa chỉ</label>} name="address"></Form.Item>
                    </Col>
                    <Col>
                        <Input
                            style={{ width: "120%", color: '#fff', padding: '0px 20px' }}
                            bordered={false}
                            defaultValue={data?.personal_information?.address ? data?.personal_information?.address : "Chưa cập nhật"}
                            readOnly
                        />
                    </Col>
                </Row>
            </Form>
        </>
    );
};


const mapStateToProps = (state) => {
    return {
        // user: state?.authentication?.customer,
        user: state?.authentication,
    };
};
export default connect(mapStateToProps)(CompanyInfo);
