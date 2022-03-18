import React, { useEffect, useState } from "react";
import { Input, Form, Row, Col, Table, Button, DatePicker, Select, Checkbox } from 'antd';
const { RangePicker } = DatePicker;
import { connect } from "react-redux";
import { NotificationError, NotificationSuccess } from '../../../common/components/Notification'
import http from "../../../apis/http";
import update from 'immer';
import {
    PlusCircleOutlined,
    MinusCircleOutlined
} from '@ant-design/icons';
import { values } from "lodash";
const Role = (props) => {
    const [form] = Form.useForm();
    const [role, setRole] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [visible, setVisible] = useState('false');
    const [role_request, setRoleRequest] = useState({
        "permission_list": [],
    });
    const [roleId, setRoleId] = useState(0);
    const [roleDTO, setRoleDTO] = useState([]);
    const handleCheckboxUpdate = (values, e) => {
        // console.log('values', values, e.target.checked)

            // roleDTO?.map(i => {
                let new_data
                let new_rq
                const newDatasourceList = update(roleDTO, draf => {
					const findIndex = draf.findIndex(i => i?.permission?.id === values.id)
					if (findIndex !== -1) {
                        console.log('vào')
                        draf[findIndex].permission_update = e.target.checked,
                        draf[findIndex].permission_view = false
					} else if(findIndex === -1){
                        new_data = [{
                            // id: ,
                            permission: {
                                id: values.id,
                                description: values.description,
                                permissionName: values.permissionName,
                                permissionCode: values.permissionCode,
                            },
                            // permission_id: draf[findIndex].id,
                            permission_update : e.target.checked,
                            permission_view : false,
                            role_id: roleId,
                        }]
                    }
				});
                let new_source =  newDatasourceList.concat(new_data)
                setRoleDTO(new_source);
            // })
        
        // console.log('1', roleDTO, values, newDatasourceList)
        let arr = role_request.permission_list;
        const newRequestSource = update(arr, draf => {
            const findIndex = draf.findIndex(i => i?.permissionId === values.id)
            if (findIndex !== -1) {
                draf[findIndex].permission_update = e.target.checked,
                draf[findIndex].permission_view = false
            } else if(findIndex === -1){
                new_rq = [{
                    // id: ,
                    permissionId: values.id,
                    // permission_id: draf[findIndex].id,
                    permission_update : e.target.checked,
                    permission_view : false,
                }]
            }
        });
        let new_request =  newRequestSource.concat(new_rq)
		setRoleRequest({
			...role_request,
			permission_list: new_request
        })
    }
    const handleCheckboxView = (values, e) => {
        let new_data
        let new_rq
        const newDatasourceList = update(roleDTO, draf => {
            const findIndex = draf.findIndex(i => i?.permission?.id === values.id)
            if (findIndex !== -1) {
                draf[findIndex].permission_update = false,
                draf[findIndex].permission_view = e.target.checked
            } else if(findIndex === -1){
                new_data = [{
                    // id: ,
                    permission: {
                        id: values.id,
                        description: values.description,
                        permissionName: values.permissionName,
                        permissionCode: values.permissionCode,
                    },
                    // permission_id: draf[findIndex].id,
                    permission_update : false,
                    permission_view : e.target.checked,
                    role_id: roleId,
                }]
            }
        });
        let new_source =  newDatasourceList.concat(new_data)
        setRoleDTO(new_source);
        let arr = role_request.permission_list;
        const newRequestSource = update(arr, draf => {
            const findIndex = draf.findIndex(i => i?.permissionId === values.id)
            if (findIndex !== -1) {
                draf[findIndex].permission_update = false,
                draf[findIndex].permission_view = e.target.checked
            } else if(findIndex === -1){
                new_rq = [{
                    // id: ,
                    permissionId: values.id,
                    // permission_id: draf[findIndex].id,
                    permission_update : false,
                    permission_view : e.target.checked,
                }]
            }
        });
        let new_request =  newRequestSource.concat(new_rq)
		setRoleRequest({
			...role_request,
			permission_list: new_request
        })
    }
	const columns = [
        {
            title: 'Task',            
            dataIndex: 'permissionName',
			render:(permissionName) => {
				return (
					<div style={{ textAlign: 'left' }}>{permissionName}</div>
				)
			}
        },
        {
            title: 'Update',
            width: 160,
            dataIndex: "update",
            render: (update, record) => {
                return (
                    <div>
                       <Checkbox
                        checked={
                            roleDTO?.some(e => {
                                if(e?.permission?.id === record.id)
                                return e?.permission_update
                            })
                        }
                        onChange={(e) => handleCheckboxUpdate(record, e)}>

                        </Checkbox>
                    </div>
                )
            }
        },
        {
            title: 'View',
            width: 160,
            dataIndex: "view",
            render: (view, record) => {
                return (
                    <div>
                        <Checkbox 
                        checked={
                            roleDTO?.some(e => {
                                if(e?.permission?.id === record.id)
                                return e?.permission_view
                            })
                            
                        }
                        onChange={(e) => handleCheckboxView(record, e)}></Checkbox>
                    </div>
                )
            }
        },
        // {
        //     title: '',
        //     dataIndex: 'id',
		// 	render:(id) => {
		// 		return (
		// 			<div></div>
		// 		)
		// 	}
        // }
    ];
    const fetchRole = async () => {
        const rs = await http.get('web/admin/role');
        if(rs.status === 200) {
            setRole(rs?.data?.data?.data);
        }
    };

    const getPermisstion = async (item) => {
        setRoleId(item);
        const rs = await http.get(`web/admin/role/${item}/permission`);
        if(rs?.status === 200) {
            setRoleDTO(rs?.data?.data?.rolePermissionDTO)
            setRoleRequest(
                {
                    "permission_list": [],
                }
            );
        }
    }

    const fetchPermission = async () => {
        const rs = await http.get('web/admin/permission');
        if(rs.status === 200) {
            setDataSource(rs?.data?.data?.permissionList);
        }
    };

    const onFinish = async (values) => {
        try {
            const request = {
                ...role_request,
                "roleId": values.role,
            }
            const rs = await http.post('web/admin/permission', request);
            if(rs?.status === 200) {
                NotificationSuccess('', "Cập nhật thành công");
                setRoleRequest(
                    {
                        "permission_list": [],
                    }
                );
            }
        } catch(ex) {
            return NotificationError('', 'Có lỗi xảy ra. Vui lòng thử lại');
        }
    }

    const addRole = async (values) => {
        try {
            const request = {
                "name": values.name_role,
                "code": values.description,
            }
            const rs = await http.post('web/admin/role', request);
            if(rs?.status === 200) {
                NotificationSuccess('', "Thêm mới thành công");
                fetchRole();
            }
        } catch(ex) {
            return NotificationError('', 'Có lỗi xảy ra. Vui lòng thử lại');
        }
    }

    const show = () => {
        setVisible('true')
    }

    const hide = () => {
        setVisible('false')
    }
    useEffect(() => {
        fetchRole();
        fetchPermission();
    },[])
    return (
        <>
        <Form
            form={form}
            onFinish={onFinish}
            name='roleId'
        >
        <h3 style={{ color: '#0096D7', marginLeft: 20, marginTop: 20}}>
            Phân quyền 
            <PlusCircleOutlined className={visible === 'false' ? 'show-circle': 'hidden'} style={{ padding: '10px' }} onClick={show} />
            <MinusCircleOutlined className={visible === 'true' ? 'show-circle': 'hidden'} style={{ padding: '10px' }} onClick={hide} />
        </h3>
        
        <div style={{ display: 'flex', marginLeft: 20 }} className="loanlist-operate">
            
            <Form.Item name="role">
                <Select
                    bordered={false}
                    style={{
                         borderBottom: '1px solid',
                         width: '400px'
                    }}
                    placeholder="Chọn vai trò"
                    onChange={(e)=>getPermisstion(e)}
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
        </div>
        <div className="loanlist-operate">
            <div style={{ marginLeft: 20 }} className={"loanlist-operate" + ((visible === 'true') ? ' show' : ' hidden')}>
                <h3 style={{ color: '#0096D7', marginTop: 20}}>Thêm mới vai trò</h3>
                <Form 
                    name='add_role'
                    onFinish={addRole} 
                    >
                    <Form.Item name="name_role">
                        <Input style={{
                         borderBottom: '1px solid',
                         width: '400px'
                        }}
                         placeholder='Nhập tên vai trò' bordered={false}/>  
                    </Form.Item>   
                    <Form.Item name="description">
                        <Input style={{
                         borderBottom: '1px solid',
                         width: '400px'
                        }} placeholder='Mô tả' bordered={false}/>  
                    </Form.Item> 
                    <Button type="primary" htmlType="submit"
                        className='status-btn' style={{ backgroundColor: '#0096D7', marginTop: 15 }}>
                        <span className="l-calendar-name">Thêm mới</span>
                    </Button>   
                </Form>
            </div>   
                <Table style={{ marginTop: 20, padding: '0px 20px' }}
                    scroll={{ y: 1000 }}
                    className="attach-table"
                    dataSource={dataSource}
                    columns={columns}
                    rowKey="key"
                    pagination={false}/> 
                <Button type="primary" htmlType="submit"
                 className='status-btn' style={{ backgroundColor: '#0096D7', margin: 'auto', display: 'block', marginTop: 30, bottom: 15 }}>
                    <span className="l-calendar-name">Cập nhật</span>
                </Button> 
                
         </div>
         </Form>
        </>
    )
}
const mapStateToProps = (state) => {
    return {
        role_info: state?.authentication?.role_info,
    };
  };
  export default connect(mapStateToProps)(Role);