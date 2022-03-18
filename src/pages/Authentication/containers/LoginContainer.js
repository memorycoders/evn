import React, { useState, useEffect } from "react";
import { Row, Col, Form, Input, Checkbox, Button, Modal } from "antd";
import {
  ArrowRightOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import ReCAPTCHA from "react-google-recaptcha";

import "./login.scss";
import { EVN_TOKEN } from '../../../utils/constants'
import welcome from "../../../asset/images/evnfc.png";
import {
  login,
} from "../../../store/authentication/action";
import { history } from '../../../utils/history';
import { NotificationError } from '../../../common/components/Notification'
function Login(props) {
  const [isRememberme, setRemember] = useState(false);
  const [disableLogin, setDisableLogin] = useState(false);
  // const [isCaptcha, setCaptcha] = useState(true);
  // const [captchaValue, setCaptchaValue] = useState('');
  const [form] = Form.useForm();
	const [modalCareerType, setOpenModalCareerType] = useState(true);
	const [isShowInfoCustomer, showInfoCustomer] = useState(false);

  const onKeyDown = (event) => {
    if (event.keyCode === 13) {
      let values = {
        phone: form.getFieldValue('phone'),
        password: form.getFieldValue('password'),
      }
      onFinish(values)
      event.preventDefault();
    }
  };

  const onChange = (e) => {
    setRemember(e.target.checked);
  };

  const onFinish = async (values) => {
    try {
      // if (isCaptcha) {
        props.login({ username: values.phone, password: values.password, keep_login: isRememberme, 
          // recaptcha_response: captchaValue
        });
        // grecaptcha.reset();
      // } else {
      //   NotificationError("", "Hãy nhập mã Captcha")
      // }
    } catch (error) {
      console.log(error);
      setDisableLogin(false);
    }
  };

  // useEffect(() => {
  // if (localStorage.getItem(EVN_TOKEN) || sessionStorage.getItem(EVN_TOKEN)) {
  //     history.push('/loan/register')
  //   }
  // })

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  // const onChangeCaptcha = (value) => {
  //   console.log('value => ', value)
  //   if (value) {
  //     setCaptcha(true);
  //     setCaptchaValue(value)
  //   } else {
  //     setCaptcha(false)
  //   }
  // }

  const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };
  return (
    <div className="login-page">
      <Row>
        <Col xs={24} sm={8} className="image-background">
          <img src={welcome} className="welcome-img" />
        </Col>
        <Col xs={24} sm={16} className="">
          <div className="login-form">
            <h3>Đăng nhập</h3>
            <Form
              form={form}
              style={{ padding: "0px 10px" }}
              scrollToFirstError
              {...layout}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              <Form.Item
                label="Tên đăng nhập"
                name="phone"
                rules={[
                  () => ({
                    validator(rule, value) {
                      if (!value) return Promise.reject("Vui lòng nhập Số điện thoại/Email!");
                      if (value && value.trim() === '') return Promise.reject("Vui lòng nhập Số điện thoại/Email!");
                      const regExp = /^[0-9]*$/;
                      const emailValidation = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
                      if(regExp.test(value.replace('+', ''))){
                        if (value.startsWith('0') && value.length !== 10) return Promise.reject("Số điện thoại không đúng định dạng");
                        if (value.startsWith('84') && value.length !== 11) return Promise.reject("Số điện thoại không đúng định dạng");
                        if (!(value.startsWith('0') || value.startsWith('84'))) return Promise.reject("Số điện thoại không đúng định dạng");
                        const phoneHeader = ['86', '96', '97', '98', '32', '33', '34', '35', '36', '37', '38', '39', '88', '91', '94', '93', '84', '85', '81', '82',
                          '89', '90', '93', '70', '79', '77', '76', '78', '92', '56', '58', '99', '59']
                        if (value.startsWith('0') && !phoneHeader.includes(value.substring(1, 3))
                          || value.startsWith('84') && !phoneHeader.includes(value.substring(2, 4))) {
                          return Promise.reject("Số điện thoại không tồn tại");
                        }
                        // return Promise.resolve();
                      } else {
												const listCheck = value.split("@");
                        if(value.includes('..')  ||
                          listCheck[0].startsWith(".") ||
                          listCheck[0].endsWith(".") ||
                          (listCheck.length > 1 && listCheck[1].startsWith(".")) ||
                          (listCheck.length > 1 && listCheck[1].endsWith("."))) 
                          return Promise.reject('Email không đúng định dạng!');
                        if (value.length > 255) return Promise.reject("Email vượt quá 255 ký tự!");
                        if (emailValidation.test(value)) return Promise.resolve();
                        return Promise.reject("Email không đúng định dạng!")
                      }
                      return Promise.resolve();
                    }
                  })
                ]}
              >
                <Input placeholder='Nhập số điện thoại hoặc email'/>
              </Form.Item>
              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập Mật khẩu!",
                  },
                ]}
              >
                <Input.Password
                  autoComplete="new-password"
                  onKeyDown={onKeyDown}
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>
              {/* <ReCAPTCHA
                className="captcha-input"
                sitekey="6LdITdwZAAAAABJ8cUilD_ECUn77gZExN45mEpdq"
                onChange={onChangeCaptcha}
              /> */}
              <Checkbox onChange={onChange}>Duy trì đăng nhập</Checkbox>
              <Row className="login-btn">
                <Col xs={12}>
                  <Link style={{ color: "#1D4994" }} to="/forgot-password">
                    Quên mật khẩu?
                    </Link>
                </Col>
                <Col xs={12}>
                  <Button disabled={disableLogin} htmlType="submit">
                    Đăng nhập <ArrowRightOutlined />
                  </Button>
                </Col>
              </Row>
              <div>
                Bạn chưa có tài khoản?{" "}
                <Link to="/signup" style={{ color: "#1D4994" }}>
                  Đăng ký ngay
                  </Link>
              </div>
            </Form>
          </div>
        </Col>
      </Row>

    </div>
  );
}

const mapDispatchToProps = (dispatch) => ({
  login: (param) => dispatch(login(param)),
  getLoans: (id) => dispatch(getLoans(id)),
  dispatch,
});

export default connect(
  (state) => ({
    customer: state.authentication.customer,
    user: state.authentication.user,
    token: state.authentication.token,
    hasWaitingStatus: state.loan.hasWaitingStatus,
    isLogin: state.authentication.isLogin,
  }),
  mapDispatchToProps,
)(Login);
