import { ArrowRightOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, Form, Input, Modal, Row, Select } from "antd";
import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import welcome from "../../../asset/images/evnfc.png";
import Loading from "../../../common/components/Loading";
import { NotificationError } from "../../../common/components/Notification";
import { signup } from "../../../store/authentication/action";
import "./signup.scss";
import http from '../../../apis/http';
import { history } from '../../../utils/history';
import CustomerInfo from './CustomerInfo';

function Signup(props) {
    const [gender, setGender] = useState(null);
    const [method, setMethod] = useState(2);
    const [isConfirmTerm, setConfirmTerm] = useState(false);
    // const [pass, setPass] = useState("");
    // const [repeatPass, setRepeatPass] = useState("");
    // const [errorMess, setErrorMess] = useState(false);
    const infoSignup = useSelector((state) => state.authentication.infoSignup);
    const [visibleModal, setVisibleModal] = useState(false)
    const [city, setCity] = useState([]);
    const [distric, setDistric] = useState([]);
    const [form] = Form.useForm();
    const [modalCareerType, setOpenModalCareerType] = useState(true);
    const [isShowInfoCustomer, showInfoCustomer] = useState(false);
    const onChangeBirthday = (date, dateString) => {
    };

    const onChangeGender = (e) => {
        setGender(e.target.value);
    };

    const SolarOption = () => {
        handleCloseModal2();
        history.push("/signup");
    };

    const toLogin = () => {
        handleCloseModal2();
        history.push("/login");
    };


    const handleCloseModal2 = () => {
        setOpenModalCareerType(false);
    }

    const onChangeMethod = (e) => {
        setMethod(e.target.value);
    };

    const getCity = async () => {
        const rs = await http.get(`web/dict_item/items?item_type=TinhThanh`);
        if (rs?.status === 200) {
            setCity(rs?.data?.data?.data);
        }
    }
    const getDistric = async (item) => {
        const rs = await http.get(`web/dict_item/items?item_type=TinhThanh&parent_id=${item}`);
        if (rs?.status === 200) {
            setDistric(rs?.data?.data?.data);
        }
    }
    useEffect(() => {
        getCity();
        // getDistric();
    }, [])
    useEffect(() => {
        if (!!infoSignup && Object.keys(infoSignup).length > 0) {
            form.setFieldsValue({
                address: infoSignup.infoSignup.installation_address,
                // password: infoSignup.infoSignup.password,
                // repeat_password: infoSignup.infoSignup.password,
                // birthday: infoSignup.infoSignup.personal_information.birthday
                //     ? moment(infoSignup.infoSignup.personal_information.birthday)
                //     : '',
                card_number: infoSignup.infoSignup.personal_information.card_number,
                email: infoSignup.infoSignup.personal_information.email,
                // gender: infoSignup.infoSignup.personal_information.gender === 0 ? 2 : (infoSignup.infoSignup.personal_information.gender ? 1 : ''),
                name: infoSignup.infoSignup.personal_information.name,
                phone: infoSignup.infoSignup.personal_information.phone_number,
                // method: infoSignup.infoSignup.receive_account_information_method,
            });
        }
    }, [infoSignup]);

    const onFinish = (values) => {
        // console.log('values Signup => ', values)
        // console.log("tinh thanh ", inputSignUp);

        // setErrorMess(false);
        // if (values.password !== values.repeat_password) {
        //     return NotificationError("", "Nhập lại mật khẩu không đúng!");
        // }
        if (isConfirmTerm) {
            const payload = {
                installation_address: values.address || null,
                // password: values.password,
                // receive_account_information_method: values.method || 2,
                personal_information: {
                    // birthday: values.birthday
                    //     ? moment(values.birthday).format("YYYY-MM-DD")
                    //     : null,
                    card_number: values.card_number,
                    email: values.email,
                    // gender: values.gender ? (values.gender === 1 ? 1 : 0) : null,
                    name: values.name,
                    phone_number: values.phone,
                },
            };
            props.signup(payload);
        } else {
            return NotificationError(
                "",
                "Bạn cần đồng ý các điều kiện và điều khoản!"
            )
        }
    };

    // const [inputSignUp, setInputSignUp] = useState({
    //     district: "",
    //     district_name: "",
    //     province: "",
    //     province_name: ""
    // });

    // const handleChangeDropDownPersonProvince = (code, name) => {
    //     console.log("code", code, "name", name);
    //     setInputSignUp({
    //         ...inputSignUp,
    //         province: code,
    //         province_name: name
    //     })
    // }
    // const handleChangeDropDownPersonDistrict = (code, name) => {
    //     console.log("code", code, "name", name);
    //     setInputSignUp({
    //         ...inputSignUp,
    //         district: code,
    //         district_name: name
    //     })
    // }

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    const handleConfirmTerm = (e) => {
        setConfirmTerm(e.target.checked);
    };
    const layout = {
        labelCol: { span: 24 },
        wrapperCol: { span: 24 },
    };

    // const onChangePass = (e) => {
    //     setPass(e.target.value);
    //     if (repeatPass && e.target.value && e.target.value !== repeatPass) {
    //         setErrorMess(true);
    //     } else {
    //         setErrorMess(false);
    //     }
    // };

    // const onChangeRepeatPass = (e) => {
    //     setRepeatPass(e.target.value);
    //     if (e.target.value && pass && e.target.value !== pass) {
    //         setErrorMess(true);
    //     } else {
    //         setErrorMess(false);
    //     }
    // };

    const handleDetailTermNCondition = () => {
        setVisibleModal(true)
    }

    const handleCloseModal = () => {
        setVisibleModal(false)
    }

    return (
        <div className="signup-page">
            <Row>
                <Col xs={24} sm={8} className="image-background">
                    <img src={welcome} className="welcome-img" />
                </Col>
                <Col xs={24} sm={16} className="signup-side">
                    <div className="signup-form">
                        <h3>Đăng ký</h3>
                        <Form
                            style={{ padding: "0px 10px" }}
                            scrollToFirstError
                            {...layout}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            form={form}
                        >

                            <Form.Item
                                className="require-style"
                                label="Tên khách hàng"
                                name="name"
                                rules={[
                                    () => ({
                                        validator(rule, value) {
                                            if (!value) return Promise.reject("Vui lòng nhập Tên khách hàng!");
                                            if (value && value.trim() === '') return Promise.reject("Vui lòng nhập Tên khách hàng!");
                                            const regExp = /\`|\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\+|\=|\[|\{|\]|\}|\||\\|\'|\<|\,|\.|\>|\?|\/|\""|\;|\:|\_|\d/;
                                            if (regExp.test(value)) return Promise.reject("Tên khách hàng sai định dạng")
                                            if (value.length > 255) return Promise.reject("Tên khách hàng không được lớn hơn 255 ký tự");
                                            return Promise.resolve();
                                        }
                                    })
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                className="require-style"
                                label="Số CMND/CCCD/Hộ chiếu"
                                name="card_number"
                                rules={[
                                    () => ({
                                        validator(rule, value) {
                                            if (!value) return Promise.reject("Vui lòng nhập Số CMND/CCCD/Hộ chiếu!");
                                            if (value && value.trim() === '') return Promise.reject("Vui lòng nhập Số CMND/CCCD/Hộ chiếu!");
                                            const regExp = /^[A-Za-z0-9]*$/;
                                            const char = /^[A-Za-z]*$/;
                                            const int = /^[0-9]*$/;
                                            // if (!regExp.test(value)) return Promise.reject("Số CMND/CCCD/Hộ chiếu sai định dạng");
                                            if (!char.test(value.charAt(0))) {
                                                if (!int.test(value)) return Promise.reject("Số CMND/CCCD/Hộ chiếu sai định dạng");
                                            } else {
                                                if (!int.test(value.substring(1))) {
                                                    if (!int.test(value)) return Promise.reject("Số CMND/CCCD/Hộ chiếu sai định dạng");
                                                }
                                            }
                                            if (value.length > 12) return Promise.reject("Số CMND/CCCD/Hộ chiếu không được lớn hơn 12 ký tự");
                                            return Promise.resolve();
                                        }
                                    })

                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                className="require-style"
                                label="Số điện thoại"
                                name="phone"
                                rules={[
                                    () => ({
                                        validator(rule, value) {
                                            if (!value) return Promise.reject("Vui lòng nhập Số điện thoại!");
                                            if (value && value.trim() === '') return Promise.reject("Vui lòng nhập Số điện thoại!");
                                            const regExp = /^[0-9]*$/;
                                            // if (!regExp.test(value.replace('+', ''))) return Promise.reject("Số điện thoại không đúng định dạng");
                                            if (value.startsWith('0') && value.length !== 10) return Promise.reject("Số điện thoại không đúng định dạng");
                                            if (value.startsWith('84') && value.length !== 11) return Promise.reject("Số điện thoại không đúng định dạng");
                                            if (!(value.startsWith('0') || value.startsWith('84'))) return Promise.reject("Số điện thoại không đúng định dạng");
                                            const phoneHeader = ['86', '96', '97', '98', '32', '33', '34', '35', '36', '37', '38', '39', '88', '91', '94', '93', '84', '85', '81', '82',
                                                '83', '89', '90', '93', '70', '79', '77', '76', '78', '92', '56', '58', '99', '59']
                                            if (value.startsWith('0') && !phoneHeader.includes(value.substring(1, 3))
                                                || value.startsWith('84') && !phoneHeader.includes(value.substring(2, 4))) {
                                                return Promise.reject("Số điện thoại không tồn tại");
                                            }
                                            return Promise.resolve();
                                        }
                                    })
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                className="require-style"
                                label="Email"
                                name="email"
                                rules={[
                                    ({ getFieldValue }) => ({
                                        validator(rule, value) {
                                            if (!value) return Promise.reject("Vui lòng nhập Email!");
                                            const validation = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
                                            if (value) {
                                                const listCheck = value.split("@");

                                                if (
                                                    value.includes("..") ||
                                                    listCheck[0].startsWith(".") ||
                                                    listCheck[0].endsWith(".") ||
                                                    (listCheck.length > 1 &&
                                                        listCheck[1].startsWith(".")) ||
                                                    (listCheck.length > 1 &&
                                                        listCheck[1].endsWith("."))
                                                ) {
                                                    return Promise.reject(
                                                        "Email không đúng định dạng!"
                                                    );
                                                }
                                                if (value.length > 255) {
                                                    return Promise.reject(
                                                        "Email vượt quá 255 ký tự!"
                                                    );
                                                }
                                                if (validation.test(value)) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(
                                                    "Email không đúng định dạng!"
                                                );
                                            } else {
                                                return Promise.resolve();
                                            }
                                        },
                                    }),
                                ]}
                            >
                                <Input placeholder="Example@gmail.com" />
                            </Form.Item>


                            {/* <Form.Item
                                label="Ngày sinh"
                                name="birthday"
                            // rules={[{ required: true, message: 'Vui lòng nhập Ngày sinh!' }]}
                            >
                                <DatePicker
                                    // inputReadOnly
                                    placeholder="Chọn ngày"
                                    format={"DD/MM/YYYY"}
                                    onChange={onChangeBirthday}
                                    disabledDate={(currentDate) => {
                                        const currentTimes = currentDate?.valueOf();
                                        const nowTimes = moment().endOf("day").valueOf();
                                        return currentTimes >= nowTimes;
                                    }}
                                />
                            </Form.Item> */}
                            <Form.Item
                                label="Địa chỉ lắp đặt"
                                name="address"
                                rules={[
                                    ({ getFieldValue }) => ({
                                        validator(rule, value) {
                                            if (value) {
                                                const listCheck = value.split("@");
                                                if (value.length > 255) {
                                                    return Promise.reject(
                                                        "Địa chỉ lắp đặt vượt quá 255 ký tự!"
                                                    );
                                                } else {
                                                    return Promise.resolve();
                                                }
                                            } else {
                                                return Promise.resolve();
                                            }
                                        },
                                    }),
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            {/* <Form.Item
                                label="Số nhà/phố"
                                name="address"
                                rules={[
                                    ({ getFieldValue }) => ({
                                        validator(rule, value) {
                                            if (value) {
                                                const listCheck = value.split("@");
                                                if (value.length > 255) {
                                                    return Promise.reject(
                                                        "Số nhà/phố vượt quá 255 ký tự!"
                                                    );
                                                } else {
                                                    return Promise.resolve();
                                                }
                                            } else {
                                                return Promise.resolve();
                                            }
                                        },
                                    }),
                                ]}
                            >
                                <Input />
                            </Form.Item> */}
                            {/* <Row >
                                <Col span={10}>

                                    <Form.Item
                                        label="Tỉnh thành"
                                        name="tinh"
                                        rules={[{ required: true, message: 'Vui lòng nhập tỉnh thành!' }]}
                                    >
                                        <Select placeholder='Chọn tỉnh thành' bordered={true} onChange={(_) => {
                                            let a = city?.filter(e => e.id === _);
                                            // handleChangeDropDownPersonProvince(_, a[0].item_name)
                                            getDistric(_);
                                        }}>
                                            {city?.map((item) => (
                                                <Select.Option value={item.id}>{item?.item_name}</Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={2}></Col>
                                <Col span={12}>
                                    <Form.Item
                                        labelAlign={"left"}
                                        label="Quận(Huyện)"
                                        name="quan"
                                        rules={[{ required: true, message: 'Vui lòng nhập quận(huyện)!' }]}
                                    >
                                        <Select placeholder='Chọn quận/huyện' bordered={true} onChange={async (_) => {
                                            let a = distric?.filter(e => e.id === _);
                                            // handleChangeDropDownPersonDistrict(_, a[0].item_name)
                                        }}>
                                            {distric?.map((item) => (
                                                <Select.Option value={item.id}>{item?.item_name}</Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>

                                </Col>
                            </Row> */}


                            {/* <Form.Item label="Giới tính" name="gender">
                                <Radio.Group
                                    onChange={onChangeGender}
                                    value={gender}
                                >
                                    <Radio value={1}>Nam</Radio>
                                    <Radio value={2}>Nữ</Radio>
                                </Radio.Group>
                            </Form.Item> */}
                            {/* <Form.Item
                                label="Phương thức nhận thông tin tài khoản"
                                name="method"
                                className="require-style"
                            >
                                <Radio.Group
                                    onChange={onChangeMethod}
                                    value={method}
                                    defaultValue={method}
                                >
                                    <Radio value={2}>Email</Radio>
                                    <Radio value={1}>Số Điện Thoại</Radio>
                                </Radio.Group>
                            </Form.Item> */}
                            <Checkbox
                                onChange={handleConfirmTerm}
                                style={{ marginBottom: 10 }}
                            >
                                Tôi đã đọc và đồng ý với{" "}
                                <span onClick={handleDetailTermNCondition} style={{ color: "#1D4994", cursor: "pointer" }}>
                                    các điều kiện và điều khoản
                      </span>
                            </Checkbox>

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Button
                                    className="signup-btn"
                                    type="primary"
                                    htmlType="submit"
                                >
                                    Đăng ký <ArrowRightOutlined />
                                </Button>
                            </div>
                            <div style={{ marginBottom: 20 }}>
                                Bạn đã có tài khoản?{" "}
                                <Link to="/login" style={{ color: "#1D4994" }}>
                                    Đăng nhập ngay
                                    </Link>
                            </div>
                        </Form>
                    </div>
                </Col>
            </Row>
            <Modal
                title="Các điều kiện và điều khoản"
                visible={visibleModal}
                onCancel={handleCloseModal}
                width="80%"
                className="term-n-condition"
                footer={null}
            >
                <p style={{ fontWeight: 600 }}>Bằng việc sử dụng hoặc duyệt trang web này ("Trang web") hay bất kỳ trang web nào khác ("Trang web của EVNFinance") của EVNFinance, bạn xác nhận rằng mình đã đọc, hiểu và đồng ý chịu sự ràng buộc của các Điều khoản và điều kiện này cũng như tất cả các điều luật và quy định hiện hành. Nếu không đồng ý bị ràng buộc bởi các Điều khoản và điều kiện này thì bạn không được sử dụng Trang web này. Chúng tôi có thể thay đổi các Điều khoản và điều kiện này bất kỳ lúc nào mà không cần thông báo cho bạn. Vì vậy, bạn nên truy cập định kỳ vào trang này để xem lại các Điều khoản và điều kiện này. Bằng việc sử dụng Trang web này sau khi chúng tôi đăng bất kỳ thay đổi nào, bạn đồng ý chấp nhận những thay đổi đó, cho dù thực tế bạn đã xem xét những thay đổi đó hay chưa.</p>
                <h3>NỘI DUNG TRANG WEB</h3>
                <p>Tất cả các tài liệu, kể cả hình ảnh, chi tiết, dữ liệu, hình minh họa, thiết kế, biểu tượng, hình chụp, đoạn video, văn bản, phần mềm, đồ họa, tập lệnh, logo và các tài liệu khác thuộc Trang web này (gọi chung là “Nội dung”) hoàn toàn thuộc quyền sở hữu (trực tiếp hoặc gián tiếp) của EVNFinance và/hoặc các nhà cung cấp nội dung của EVNFinance. Nội dung được bảo vệ bởi bản quyền, nhãn hiệu, nhãn hiệu dịch vụ, hình thức thương mại và các quyền sở hữu trí tuệ hoặc sở hữu của EVNFinance. Bất kỳ quyền nào không được cho phép rõ ràng trong các Điều khoản và điều kiện đều thuộc sở hữu của EVNFinance.</p>
                <p>Mọi nhãn hiệu, logo và thiết kế của EVNFinance xuất hiện trên bất kỳ Trang web nào của EVNFinance đều là nhãn hiệu và nhãn hiệu dịch vụ độc quyền (trực triếp hay gián tiếp) của EVNFinance. Bạn không được cấp bất kỳ giấy phép hoặc quyền nào trong bất kỳ nhãn hiệu, logo và thiết kế nào nêu trên cũng như các quyền sở hữu khác của EVNFinance.</p>
                <p>Tất cả các nhãn hiệu và nhãn hiệu dịch vụ khác xuất hiện trên bất kỳ Trang web nào của EVNFinance không thuộc sở hữu của EVNFinance là tài sản của các chủ sở hữu tương ứng.</p>
                <h3>ỨNG XỬ TRỰC TUYẾN</h3>
                <p>Bạn đồng ý chỉ sử dụng Trang web cho các mục đích hợp pháp. Bạn không được đăng bài hoặc truyền tải đến hoặc thông qua Trang web các tài liệu bất hợp pháp, có hại, có tính chất đe dọa, lạm dụng, xúc phạm, lăng mạ, nói xấu, tục tĩu, khiêu dâm, hận thù hoặc bất kỳ tài liệu nào khác có thể phát sinh trách nhiệm dân sự hoặc hình sự theo pháp luật. Chúng tôi có thể tiết lộ các nội dung hoặc thông tin liên lạc điện tử dưới mọi hình thức (bao gồm cả hồ sơ, địa chỉ email và thông tin khác của bạn) (1) để đáp ứng bất kỳ điều luật, quy định hoặc yêu cầu nào của chính phủ; (2) nếu việc tiết lộ là cần thiết hoặc thích hợp để vận hành Trang web; hoặc (3) để bảo vệ quyền hoặc tài sản của EVNFinance, các công ty liên kết của EVNFinance và của bạn.</p>
                <h3>TÍNH CHÍNH XÁC CỦA THÔNG TIN</h3>
                <p>EVNFinance sẽ nỗ lực trong phạm vi hợp lý để cung cấp thông tin chính xác và cập nhật nhưng chúng tôi không đảm bảo mọi thông tin có trên Trang web này đều chính xác, hoàn chỉnh, đáng tin cậy, cập nhật hoặc không có lỗi. Đồng thời, chúng tôi cũng không đảm bảo rằng Trang web sẽ không có vi-rút. Chúng tôi không chịu trách nhiệm về bất kỳ lỗi hoặc thiếu sót nào trên Trang web này. Mặc dù chúng tôi có thể sửa đổi Nội dung, cải tiến Trang web hoặc sửa bất kỳ lỗi hay thiếu sót nào bất cứ lúc nào mà không cần thông báo cho bạn, nhưng chúng tôi không có nghĩa vụ phải làm như vậy. Chúng tôi sẽ cố gắng cập nhật thông tin kịp thời nhưng sẽ không chịu trách nhiệm nếu có bất kỳ thông tin nào không chính xác. Bạn tự chịu mọi rủi ro khi sử dụng thông tin được cung cấp trên Trang web này và EVNFinance sẽ không chịu trách nhiệm trong trường hợp bạn bị mất dữ liệu, mất lợi nhuận hoặc bất kỳ thiệt hại hoặc tổn thất nào khác xuất phát từ việc bạn sử dụng Trang web này.</p>
                <h3>CÁC LIÊN KẾT TỚI TRANG WEB CỦA BÊN THỨ BA</h3>
                <p>Các liên kết trên Trang web này có thể chuyển tới các dịch vụ hoặc trang web không do EVNFinance kiểm soát hay vận hành. Chúng tôi cung cấp các liên kết này để bạn tiện dùng và tìm thông tin. Chúng tôi không xác thực trang web hoặc dịch vụ nào thông qua liên kết này. Chúng tôi không nhận trách nhiệm hoặc trách nhiệm pháp lý về các trang web hay dịch vụ khác. Bạn tự chịu mọi rủi ro khi sử dụng mọi trang web hoặc dịch vụ được liên kết qua Trang web này.</p>
                <h3>BỒI THƯỜNG</h3>
                <p>Bạn đồng ý bồi thường và bảo vệ EVNFinance trước bất kỳ khiếu nại, quyền khởi kiện, đòi hỏi, tổn thất hoặc thiệt hại của bất kỳ bên thứ ba nào (kể cả lệ phí và chi phí thuê luật sư) phát sinh từ hoặc liên quan đến việc bạn vi phạm các Điều khoản và điều kiện này, việc bạn sử dụng Trang web hoặc vi phạm bất kỳ quyền nào của bên thứ ba.</p>
                <h3>KHẮC PHỤC VI PHẠM</h3>
                <p>EVNFinance bảo lưu quyền tìm kiếm mọi biện pháp khắc phục có thể theo luật pháp và luật công bình đối với những hành vi vi phạm các Điều khoản và điều kiện này, bao gồm nhưng không giới hạn ở quyền chặn truy cập từ một địa chỉ IP cụ thể.</p>
                <h3>PHẢN HỒI VÀ NHỮNG ĐỀ XUẤT KHÁC</h3>
                <p>Tất cả các phản hồi, ý kiến và những đề xuất khác mà bạn gửi thông qua Trang web này sẽ được coi là không bảo mật và không độc quyền và có thể được EVNFinance sử dụng cho mọi mục đích mà không có nghĩa vụ trả thù lao cho bạn. Tất cả dữ liệu cá nhân mà bạn cung cấp cho EVNFinance sẽ được xử lý theo Chính sách về quyền riêng tư của chúng tôi.</p>
            </Modal>
            {props.isLoading ? <Loading /> : null}

            <Modal
                className='career-type-popup'
                title="Chọn khoản vay"
                visible={modalCareerType}
            // onCancel={handleCloseModal}
            >
                <div className="career-btn">
                    <Button onClick={() => showInfoCustomer(true)} className="status-btn-default">
                        <span className="l-calendar-name">Đăng ký vay tiêu dùng</span>
                    </Button>
                    <Button style={{ marginLeft: '20px' }} onClick={() => SolarOption()} className="status-btn-default">
                        <span className="l-calendar-name">Lắp đặt điện mặt trời</span>
                    </Button>
                </div>
                <div onClick={() => toLogin()} style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', cursor: 'pointer' }}>
                    <h3 style={{ color: "#1D4994" }}>Đăng nhập ngay</h3>
                </div>
            </Modal>
            <CustomerInfo showInfoCustomer={showInfoCustomer} isShowInfoCustomer={isShowInfoCustomer} />
        </div>
    );

}

const mapDispatchToProps = {
    signup,
};

export default connect((state) => ({
    isLoading: state.authentication.isLoading,
}), mapDispatchToProps)(Signup);
