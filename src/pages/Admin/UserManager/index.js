import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Table, Button, Form, Input, Col, Row, Select, Modal, Checkbox } from "antd";
import moment from "moment";
import { NotificationError, NotificationSuccess } from '../../../common/components/Notification'
import {
    PlusCircleOutlined,
} from '@ant-design/icons';
import '../../../styles/digitalSignature.scss';
import '../../../styles/operate.scss';
import http from "../../../apis/http";

const UserManager = (props) => {
    let size = window.innerWidth;
    const [fields, setFields] = useState([]);
    const [modalCareerType, setOpenModalCareerType] = useState(false);
    const [user, setUser] = useState('');
    const [id, setId] = useState('');
    const [totalItem, setTotalItem] = useState(0);
    const [dataSource, setDataSource] = useState([]);
    const [provider, setProvider] = useState([]);
    const [role, setRole] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [roleId, setRoleId] = useState(0);
    let du = totalItem % 5;
    let thuong = Math.floor(totalItem / 5);
    let latest_page = du !== 0 ? (thuong + 1) : thuong;
    const onFinish = async (values) => {
        try {
            let url = '';
            if(!values.personalType) {
                if(fields?.length > 0) { 
                    url = `web/admin/user/${values.key}`
                    console.log('1', values)
                }
                else { url = `web/admin/user` };
                var request = {
                    "email": values.email,
                    "phone_number": values.phone,
                    "provider_id": values?.provider ? values.provider : null,
                    "roleList": [
                      values.role
                    ],
                    "username": values.username
                }
            } else {
                url = `web/admin/customer/${values.key}`;
                var request = {
                    "email": values.email,
                    "personal_type": values?.type,
                    "phone_number": values.phone,
                    "username": values.username
                  }
            }
            const rs = await http.post(url, request);
            if(rs?.status === 200) {
                if(fields?.length > 0 ) {
                    NotificationSuccess('', "Cập nhật thành công")
                    changePage(currentPage, null);
                } else { 
                    NotificationSuccess('', "Thêm mới thành công")
                    if(totalItem % 5 == 0){
                        changePage(latest_page+1, null);
                    } else changePage(latest_page, null)
                 };
                form.resetFields();
               
            }
        } catch(ex) {
            return NotificationError('', ex.message);
        }
    }

    const handleCheckRole = (values) => {
        setRoleId(values)
    }
    const onSearch = async (values) => {
        const rs = await http.get(`web/admin/user?pageIndex=0&pageSize=5&keywords=${values.search}`);
        if(rs?.status === 200){
            setDataSource(rs?.data?.data?.content)
        }
    }
    const onFinishFailed = (values) => {
        return NotificationError("", "Có lỗi xảy ra, vui lòng thử lại");
    }
    const openModal = (record) => {
        setOpenModalCareerType(true);
        setUser(record?.username);
        setId(record?.id)
    }
    const fetchData = async(pageIndex) => {
        const rs = await http.get(`web/admin/user?pageIndex=${pageIndex}&pageSize=5`);
        if(rs?.status === 200){
            setDataSource(rs?.data?.data?.content)
            setTotalItem(rs?.data?.data?.total_elements)
        }
    }
    const changePage = (page, pageSize) => {
		fetchData(page - 1, page - 1);
        setCurrentPage(page);
        console.log("page", page)
    }
    useEffect(() => {
        fetchData(currentPage - 1)
    }, [currentPage])
    const handleCloseModal = () => {
        setOpenModalCareerType(false);
    }
    const handleResetPassword = async (id) => {
        console.log("id",id)
        try {
            const rs = await http.post(`web/admin/password/reset/${id}`);
            if(rs?.status === 200) {
                handleCloseModal()
                NotificationSuccess("", "Cập nhật thành công");
            }
        }
        catch (ex) {
            NotificationError("", 'Có lỗi xảy ra. Vui lòng thử lại');
        }

    }
    const handleEdit = (record) => {
        setFields([
            {
                name: ['username'],
                value: record?.username,
            },
            {
                name: ['role'],
                value: record?.roleDTO.id
            },
            {
                name: ['key'],
                value: record?.id
            },
            {
                name: ['email'],
                value: record?.email
            },
            {
                name: ['type'],
                value: record?.personalType
            },
            { 
                name: ['phone'],
                value: record?.phoneNumber
            }
        ])
    }
    const fetchRole = async () => {
        const rs = await http.get('web/admin/role?permission=admin');
        if(rs.status === 200) {
            // console.log('4', rs)
            setRole(rs?.data?.data?.data);
        }
    };
    const addUser = () => {
        form.resetFields();
        setFields([]);
    }
    const fetchProvider = async (tab, pageIndex) => {
		try {
			const rs = await http.get(`web/providers?pageIndex=0&pageSize=5`);
			if(rs?.status === 200) {
                setProvider(rs?.data?.data?.content)
			} else {
				return NotificationError("", "Có lỗi xảy ra. Vui lòng thử lại");
			}
		}catch(ex){}
	}

    const [form] = Form.useForm();
    const [form_search] = Form.useForm();
    const columns = [
        {
            title: 'No.',
            dataIndex: 'id',
            key: 'id',
            render: id => {
                return (
                    <div>{id}</div>
                )
            }
        },
        {
            title: 'Tên người dùng',
            dataIndex: 'username',
            key: 'username',
            render: username => {
                return (
                    <div>{username}</div>
                )
            }
        },
        {
            title: 'Vai trò',
            dataIndex: 'roleDTO',
            key: 'roleDTO',
            render: roleDTO => {
                return (
                    <div>
                        {roleDTO?.code}
                    </div>
                )
            }
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: createdAt => {
                return (
                    <div>
                        <div>{moment(createdAt).format('DD/MM/YYYY')}</div>
                    </div>
                )
            }
        },
        {
            title: 'Action',
            dataIndex: '',
            key: '',
            render: record => {
                return (
                    <div>
                        <Button onClick={() => handleEdit(record)} className='status-btn' style={{ backgroundColor: '#0096D7' }}>
                            <span className="l-calendar-name">Cập nhật</span>
                        </Button>
                    </div>
                )
            }
        },
        {
            title: '',
            dataIndex: '',
            key: '',
            render: record => {
                return (
                    <div>
                        <Button onClick={() => openModal(record)} className='status-btn' style={{ backgroundColor: '#0096D7' }}>
                            <span className="l-calendar-name">Reset password</span>
                        </Button>
                    </div>
                )
            }
        },
        {
            title: '',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            render: record => {
                return (
                    <div>
                    </div>
                )
            }
        },
        {
            title: '',
            dataIndex: 'personalType',
            key: 'personalType',
            width: 10,
            render: record => {
                return (
                    <div>
                    </div>
                )
            }
        },
        {
            title: '',
            dataIndex: 'email',
            key: 'email',
            width: 10,
            render: record => {
                return (
                    <div>
                    </div>
                )
            }
        },
    ];
    useEffect(() => {
        fetchData(0);
        fetchRole();
        fetchProvider();
        //call api get data to fill table here !
    }, [])
    return (
        <div className="digital-signature operate-signature">
            <div style={{ marginBottom: '-20px', marginTop: '20px', maxWidth: size > 1440 ? '100%' : '1440px' }} className="digital-signature operate-signature">
                <div className="loanlist-operate">
                    <h2 style={{ marginLeft: '5px', display: 'flex', justifyContent: 'space-between' }}>Danh sách người dùng
                    <Form
                        form={form_search}
                        onFinish={onSearch}
				        layout="vertical"
                        name="search"
				        style={{ width: '20%' }}
			        >
					            <Form.Item name="search">
						            <Input.Search onSearch={() => form_search.submit()} placeholder='Tìm kiếm...' defaultValue="" />
					            </Form.Item>
				        <Button
                            style={{ display: 'none' }} 
                            type="primary" htmlType="submit">
                        </Button>
			        </Form></h2>
                    <Table scroll={scroll}
                        style={{ marginTop: '-10px' }}
                        className="attach-table"
                        dataSource={dataSource}
                        columns={columns}
                        rowKey="key"
                        pagination={{current: currentPage , defaultPageSize: 5, total: totalItem, onChange: changePage}}
                        onRow={(record) => ({
                            onClick: () => handleEdit(record)
                        })}
                    />
                </div>
            </div>
            <div style={{ marginBottom: '-20px', marginTop: '20px', maxWidth: size > 1440 ? '100%' : '1440px' }} className="digital-signature operate-signature">
                <div className="loanlist-operate">
                    <h2 style={{ marginLeft: '5px', marginBottom: '15px' }}>
                        {fields?.length > 0 ? 'Cập nhật người dùng' : 'Thêm mới người dùng'}
                        <PlusCircleOutlined style={{ padding: '10px' }} onClick={addUser} />
                    </h2>
                    <Form
                        form={form}
                        name="basic"
                        fields={fields}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        style={{ marginLeft: '5px' }}
                    >

                        <Row style={{ marginTop: 20 }}>
                            <Col>
                                <Form.Item label={<label>Tên người dùng</label>}
                                    rules={[
                                        () => ({
                                            validator(rule, value) {
                                                if (!value) return Promise.reject("Vui lòng nhập tên người dùng");
                                                return Promise.resolve();
                                            }
                                        })
                                    ]}>
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item name="username"
                                 rules={[
                                    () => ({
                                        validator(rule, value) {
                                            if (!value) return Promise.reject("Vui lòng nhập tên người dùng");
                                            return Promise.resolve();
                                        }
                                    })
                                ]}>
                                    <Input
                                        bordered={false}
                                        placeholder='Tên người dùng'
                                        style={{
                                            marginLeft: '10px',
                                            borderBottom: '1px solid',
                                            width: '200px'
                                        }}
                                    />
                                </Form.Item>

                            </Col>
                            <Col span="3"></Col>
                            <Col>
                                <Form.Item label="Vai trò"
                                    rules={[
                                        () => ({
                                            validator(rule, value) {
                                                if (!value) return Promise.reject("Vui lòng chọn vai trò");
                                                return Promise.resolve();
                                            }
                                        })
                                    ]}></Form.Item>
                            </Col>
                            <Col>
                                <Form.Item name="role"
                                rules={[
                                    () => ({
                                        validator(rule, value) {
                                            if (!value) return Promise.reject("Vui lòng chọn vai trò");
                                            return Promise.resolve();
                                        }
                                    })
                                ]}>
                                    <Select
                                        bordered={false}
                                        style={{
                                            marginLeft: '10px',
                                            borderBottom: '1px solid',
                                            width: '350px'
                                        }}
                                        placeholder="Chọn vai trò"
                                        onChange={(values) => handleCheckRole(values)}
                                    >
                                        {
                                            role?.map((item) => {
                                                return (
                                                    <Option value={item.id}>{item.name}</Option>
                                                )
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: 20 }}>
                            <Col>
                                <Form.Item label={<label>Số điện thoại</label>}
                                    rules={[
                                        () => ({
                                            validator(rule, value) {
                                                if (!value) return Promise.reject("Vui lòng nhập số điện thoại");
                                                return Promise.resolve();
                                            }
                                        })
                                    ]}>
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item name="phone"
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
                                ]}>
                                    <Input
                                        bordered={false}
                                        placeholder='Số điện thoại'
                                        style={{
                                            marginLeft: '23px',
                                            borderBottom: '1px solid',
                                            width: '200px'
                                        }}
                                    />
                                </Form.Item>

                            </Col>
                            <Col span="3"></Col>
                            <Col>
                                <Form.Item label="Email" style={{ marginLeft: '4px'}}
                                    rules={[
                                        () => ({
                                            validator(rule, value) {
                                                if (!value) return Promise.reject("Vui lòng nhập email");
                                                return Promise.resolve();
                                            }
                                        })
                                    ]}></Form.Item>
                            </Col>
                            <Col>
                                <Form.Item name="email"
                                rules={[
                                    () => ({
                                        validator(rule, value) {
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
                                                return Promise.reject(`Vui lòng nhập Email!`);
                                            }
                                        },
                                    }),
                                ]}
                                >
                                    <Input
                                        bordered={false}
                                        placeholder='Email'
                                        style={{
                                            marginLeft: '10px',
                                            borderBottom: '1px solid',
                                            width: '353px'
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                                    <Col>
                                        <Form.Item name="provider"
                                            style={roleId === 2 ? {display: 'block'} : {display: 'none'}}
                                            label="Nhà cung cấp/Đối tác"
                                            rules={[
                                                () => ({
                                                    validator(rule, value) {
                                                        if (!value && roleId === 2) return Promise.reject("Vui lòng chọn nhà cung cấp/Đối tác");
                                                        return Promise.resolve();
                                                    }
                                                })
                                            ]}
                                        >
                                             <Select placeholder="Chọn nhà cung cấp/đối tác">
                                                {
							                        provider?.map((item) => {
								                        return (
									                        <Option value={item.id}>{item.providerName}</Option>
							                        	)
						                        	})
						                        }
                                            </Select>
                                        </Form.Item>
                                    </Col>
                        </Row>
                        <Row>
                                    <Col>
                                        <Form.Item name="remember"
                                            valuePropName="checked"
                                            rules={[
                                                {
                                                    validator: (_, value) =>
                                                        value ? Promise.resolve() : Promise.reject(new Error('Vui lòng chấp nhận điều khoản')),
                                                },
                                            ]}
                                        >
                                            <Checkbox >Gửi thông tin đăng nhập qua số điện thoại / Email</Checkbox>
                                        </Form.Item>
                                    </Col>
                                </Row>
                        <Form.Item
                            style={{ display: 'none' }}
                            label="Số thứ tự"
                            name="key"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            style={{ display: 'none' }}
                            label="Loại tài khoản"
                            name="type"
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className='status-btn' style={{ backgroundColor: '#0096D7', margin: 'auto', display: 'block', marginTop: 15 }}>
                                <span className="l-calendar-name">{fields?.length > 0 ? 'Cập nhật' : 'Thêm mới'}</span>
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
            <Modal
                className='career-type-popup'
                title={"Bạn có chắc chắn muốn cập nhật mật khẩu của người dùng " + user + " không?"}
                visible={modalCareerType}
                onCancel={handleCloseModal}
            >
                <div className="career-btn">
                    <Button onClick={() => handleCloseModal()} className="status-btn-default">
                        <span className="l-calendar-name">Hủy bỏ</span>
                    </Button>
                    <Button style={{ marginLeft: '20px' }} onClick={() => handleResetPassword(id)} className="status-btn-default">
                        <span className="l-calendar-name">Cập nhật</span>
                    </Button>
                </div>
            </Modal>
        </div>

    )
}
function mapDispatchToProps(dispatch) {
    return {
        // signCloudFirstTime: (id) => dispatch(signCloudFirstTime(id)),
    }
}
const mapStateToProps = (state) => {

};
export default connect(mapStateToProps, mapDispatchToProps)(UserManager);