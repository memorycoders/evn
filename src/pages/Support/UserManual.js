import React from 'react';
import "../../styles/support.scss";
import { Col ,Row} from "antd";
import { SendOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import imgSignup from "../../asset/images/huongdandangky.png";
import imgLogin from "../../asset/images/huongdandangnhap.png";
import imgLoan1 from "../../asset/images/loan1.png";
import imgLoan2 from "../../asset/images/loan2.png";
import imgLoan3 from "../../asset/images/loan3.png";
import imgLoan4 from "../../asset/images/loan4.png";
import imgLoan5 from "../../asset/images/loan5.png";
import imgLoan6 from "../../asset/images/loan6.png";
import imgLoan7 from "../../asset/images/loan7.png";
import imgLoan8 from "../../asset/images/loan8.png";
import imgLoan9 from "../../asset/images/loan9.png";
import imgLoan10 from "../../asset/images/loan10.png";
import changePass from "../../asset/images/changePass.png";
import changePass2 from "../../asset/images/changePass2.png";


function UserManual(props) {
    return (
        <div className="support">
            <div className="support-container">
                <h2 className="support-title">Hướng dẫn sử dụng </h2>
                <Row span="24" className="support-item">
                    <Col span="16" className="support-item-img">
                        <h3>1. Đăng ký tài khoản</h3>
                        <p><SendOutlined />Truy cập vào trang web <Link to="http://evnfc-portal.twendeesoft.com/signup">http://evnfc-portal.twendeesoft.com/signup</Link> để đăng ký tài khoản</p>
                        <img src={imgSignup} alt="*"></img>
                        <p><SendOutlined />Nhập đầy đủ thông tin cá nhân ( bắt buộc) bao gồm : Tên khách hàng, Số CMND/CCCD/Hộ chiếu , Số điện thoại, Email, Địa chỉ lắp đặt. Tích chọn vào ô “ Tôi đã đọc và đồng ý với các điều kiện và điểu khoản”</p>
                        <p><SendOutlined />Click “Đăng ký”</p>
                    </Col>
                </Row>
                <Row span="24" className="support-item">
                    <Col span="16" className="support-item-img">
                        <h3>2.Đăng nhập</h3>
                        <p><SendOutlined />Truy cập vào trang web <Link to="http://evnfc-portal.twendeesoft.com/login"> http://evnfc-portal.twendeesoft.com/login</Link> để đăng nhập tài khoản</p>
                        <img src={imgLogin} alt="*"></img>
                        <p><SendOutlined />Nhập Số điện thoại và mật khẩu</p>
                        <p><SendOutlined />Có thể click checkbox “Duy trì đăng nhập” </p>
                        <p><SendOutlined />Click “ Đăng nhập”</p>
                    </Col>
                </Row>
                <Row span="24" className="support-item">
                    <Col span="16" className="support-item-img">
                        <h3>3.Đăng ký khoản vay</h3>
                        <p><SendOutlined />Truy cập vào trang web  portal </p>
                        <p><SendOutlined />Đăng nhập tài khoản thành công </p>
                        <div className="img-loan">
                            <img src={imgLoan1} alt="*"></img>
                        </div>
                        <p><SendOutlined />Click “ Đăng ký ”</p>
                        <img src={imgLoan2} alt="*"></img>
                        <img src={imgLoan3} alt="*"></img>
                        <img src={imgLoan4} alt="*"></img>
                        <img src={imgLoan5} alt="*"></img>
                        <img src={imgLoan6} alt="*"></img>
                        <p><SendOutlined />Click đăng ký vay, chuyển màn hình phê duyệt </p>
                        <img src={imgLoan7} alt="*"></img>
                        <img src={imgLoan8} alt="*"></img>
                        <img src={imgLoan9} alt="*"></img>
                        <img src={imgLoan10} alt="*"></img>
                    </Col>
                </Row>
                <Row span="24" className="support-item">
                    <Col span="16" className="support-item-img">
                        <h3>4.Đổi mật khẩu</h3>
                        <p><SendOutlined />Truy cập vào trang web <Link to="http://evnfc-portal.twendeesoft.com/"> http://evnfc-portal.twendeesoft.com/</Link></p>
                        <p><SendOutlined />Sau khi login thành công</p>
                   
                            <img src={changePass} alt="*"></img>
                        <p><SendOutlined />Click “ Đổi mật khẩu” </p>
                        <div className="img-changepass">
                            <img src={changePass2} alt="*"></img>
                        </div>
                        <p><SendOutlined />Nhập mật khẩu hiện tại</p>
                        <p><SendOutlined />Nhập mật khẩu mới và xác nhận mật khẩu mới</p>
                        <p><SendOutlined />Click “ Đổi mật khẩu”</p>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default UserManual;