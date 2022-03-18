import React, { useEffect, useState } from "react";
import { Input, Form, Row, Col, Select, Button, DatePicker } from "antd";
import http from "../../../apis/http";
import { connect } from "react-redux";
import { NotificationError, NotificationSuccess } from '../../../common/components/Notification'
import moment from 'moment';
const CustomerInfo = (props) => {
  const [form] = Form.useForm();
  // const { user } = props;
  const data = JSON.parse(sessionStorage.getItem("evn-token"))
  console.log("data",data);
  
  return (
    <>
      <h2 style={{ color: '#fff', marginTop: 10 }}>Thông tin chủ hợp đồng</h2>
      <Form style={{ color: '#fff' }} form={form} layout="vertical" name="basic">
        <Row style={{ marginTop: 20 }}>
          <Col span="3">
            <Form.Item label={<label style={{ color: "#fff", fontWeight: 500 }}>Họ tên</label>} name="name"></Form.Item>
          </Col>
          <Col>
            <Input
              style={{ width: "115%", color: "#fff", padding: '0px 10px' }}
              bordered={false}
              value={data?.personal_information?.name ? data?.personal_information?.name : 'Chưa cập nhật'}
              readOnly
            />
          </Col>
          <Col span="3"></Col>
          <Col>
            <Form.Item label={<label style={{ color: "#fff", fontWeight: 500 }}>CMND/CCCD/Hộ chiếu</label>} name="passpost"></Form.Item>
          </Col>
          <Col>
            <Input
              style={{ width: "115%", color: "#fff", padding: '0px 10px' }}
              bordered={false}
              value={data?.personal_information?.card_number ? data?.personal_information?.card_number : 'Chưa cập nhật'}
              readOnly
            />
          </Col>
        </Row>
        <Row style={{ marginTop: '-30px' }}>
          <Col span="3">
            <Form.Item label={<label style={{ color: "#fff", fontWeight: 500 }}>Ngày sinh</label>} name="dob"></Form.Item>
          </Col>
          <Col>
            <Input
              style={{ width: "115%", color: "#fff", padding: '0px 10px' }}
              bordered={false}
              value={data?.personal_information?.birthday_value ? moment(data?.personal_information?.birthday_value).format('DD-MM-YYYY') : 'Chưa cập nhật'}
              readOnly
            />
          </Col>
          <Col span="3"></Col>
          <Col>
            <Form.Item label={<label style={{ color: "#fff", fontWeight: 500 }}>Số tài khoản</label>} name="account"></Form.Item>
          </Col>
          <Col>
            <Input
              style={{ width: "115%", color: "#fff", padding: '0px 10px' }}
              bordered={false}
              value={data?.personal_information?.card ? data?.personal_information?.card : 'Chưa cập nhật'}
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
              style={{ width: "120%", color: '#fff', padding: '0px 10px' }}
              bordered={false}
              defaultValue="Chưa cập nhật"
              value={data?.personal_information?.address ? data?.personal_information?.address : "Chưa cập nhật"}
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
    user: state?.authentication,
  };
};
export default connect(mapStateToProps)(CustomerInfo);
