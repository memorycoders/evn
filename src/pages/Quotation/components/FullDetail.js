import React, { useEffect, useState } from "react";
import { Input, Form, Row, Col, Select, Button, DatePicker } from 'antd';
const { RangePicker } = DatePicker;
import { NotificationError, NotificationSuccess } from '../../../common/components/Notification'
import {
	PlusCircleOutlined,
  } from '@ant-design/icons';
import http from "../../../apis/http";
const FullDetail = (props) => {
    const { setData, fields, setFields } = props
    const [list, setList] = useState([]);
    const [provider, setProvider] = useState([]);
    const getList = async () => {
		try {
			// const rs = await http.get('web/quotation/equipment?pageIndex=0&pageSize=5')
			const rs = await http.get('web/quotation/equipment')
            if(rs?.status === 200) {
                setList(rs?.data?.data?.content)
                } else {
                    return NotificationError("", "Có lỗi xảy ra. Vui lòng thử lại");
                }

		}catch(ex){}
	}
    const fetchData = async (tab, pageIndex) => {
		try {
			const rs = await http.get(`web/quotation/package?pageIndex=0&pageSize=5`);
			if(rs?.status === 200) {
                setData(rs?.data?.data?.content)
			} else {
				return NotificationError("", "Có lỗi xảy ra. Vui lòng thử lại");
			}
		}catch(ex){}
	}
    const getProviderId = async () => {
		try {
			const rs = await http.get('web/providers?pageIndex=0&pageSize=5')
            if(rs?.status === 200) {
                setProvider(rs?.data?.data?.content)
                } else {
                    return NotificationError("", "Có lỗi xảy ra. Vui lòng thử lại");
                }

		}catch(ex){}
	}
    const onFinish = async (values) => {
    
        const request = 
        {
            "customerType": values?.customer,
            "endDate": values?.dateTime?.[1].valueOf(),
            "equipmentList": [
              values?.item
            ],
            "packageName": values?.name,
            "providerId": values?.name_ncc,
            "roofType": values?.roof,
            "startDate": values?.dateTime?.[0].valueOf(),
            "systemType": values.system,
            "voltage": values.electric
        }
        let url = ''
        if(fields?.length > 0){
            url = `web/quotation/package/${values?.id}`
        } else url = `web/quotation/package`;
        try { 
            const rs = await http.post(url, request);
            if (rs?.status === 200) {
                NotificationSuccess("", "Cập nhật thành công");
                fetchData();
                form.resetFields();
                setFields([]);
            }
        }
        catch (ex) {
            console.log('1', ex);
            if(ex.message === 'Tên gói đã tồn tại') {
                NotificationError("", "Gói đã tồn tại. Vui lòng thử lại");
            }
            else NotificationError("", "Có lỗi xảy ra. Vui lòng thử lại");
        }  
    }
    
    useEffect(() => {
        getList();
        getProviderId();
	}, []);
    const [form] = Form.useForm();
	const addEquipment = () => {
		form.resetFields();
        setFields([]);
	}
    return (
        <>
            <h3>Chi tiết giá trọn gói <PlusCircleOutlined onClick={addEquipment}/></h3>
            <Form
                form={form}
                    onFinish={onFinish}
					layout="vertical"
                    name="basic"
                    fields={fields}

				>
				<Row>
					<Col span="7">
						<Form.Item label="Tên gói" name="name"
                        rules={[
                            () => ({
                                validator(rule, value) {
                                    if (!value) return Promise.reject("Vui lòng nhập tên gói");
                                    return Promise.resolve();
                                }
                            })
                        ]}>
							<Input  bordered={false}  placeholder="Nhập tên gói" />
						</Form.Item>
					</Col>
					<Col span="4"></Col>
					<Col span="7">
                        <Form.Item label="Nhà cung cấp" name="name_ncc"
                        rules={[
                            () => ({
                                validator(rule, value) {
                                    if (!value) return Promise.reject("Vui lòng chọn nhà cung cấp");
                                    return Promise.resolve();
                                }
                            })
                        ]}>
                        <Select  bordered={false}  placeholder="Chọn nhà cung cấp">
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
					<Col span="7">
						<Form.Item label="Đối tượng khách hàng" name="customer"
                        rules={[
                            () => ({
                                validator(rule, value) {
                                    if (!value) return Promise.reject("Vui lòng chọn đối tượng");
                                    return Promise.resolve();
                                }
                            })
                        ]}>
                        <Select  bordered={false}  placeholder="Chọn đối tượng">
                                <Select.Option value="ELECTRICAL">Ngành điện</Select.Option>
                                <Select.Option value="NON_ELECTRICAL">Ngoài ngành điện</Select.Option>
                            </Select>
						</Form.Item>
					</Col>
					<Col span="4"></Col>
					<Col span="7">
                        <Form.Item label="Điện áp" name='electric'
                        rules={[
                            () => ({
                                validator(rule, value) {
                                    if (!value) return Promise.reject("Vui lòng nhập điện áp");
                                    return Promise.resolve();
                                }
                            })
                        ]}>
							<Input  bordered={false}  placeholder="" />
						</Form.Item>
					</Col>
				</Row>
                <Row>
					<Col span="7">
						<Form.Item label="Loại mái" name='roof'
                        rules={[
                            () => ({
                                validator(rule, value) {
                                    if (!value) return Promise.reject("Vui lòng chọn mái");
                                    return Promise.resolve();
                                }
                            })
                        ]}>
							<Select  bordered={false}  placeholder="Chọn loại mái">
                                <Select.Option value="METAL">Mái tôn</Select.Option>
                                <Select.Option value="CONCRETE">Mái bằng</Select.Option>
                            </Select>
						</Form.Item>
					</Col>
					<Col span="4"></Col>
					<Col span="7">
                        <Form.Item label="Hệ" name='system'
                        rules={[
                            () => ({
                                validator(rule, value) {
                                    if (!value) return Promise.reject("Vui lòng chọn hệ");
                                    return Promise.resolve();
                                }
                            })
                        ]}>
                        <Select  bordered={false}  placeholder="Chọn hệ">
                                <Select.Option value="ONE_PHASE">1 pha</Select.Option>
                                <Select.Option value="TWO_PHASE">2 pha</Select.Option>
                                <Select.Option value="THREE_PHASE">3 pha</Select.Option>
                            </Select>
						</Form.Item>
					</Col>
				</Row>
                <Row>
					<Col span="7">
						<Form.Item label="Thời gian áp dụng" name='dateTime'
                                    rules={[
                                        () => ({
                                            validator(rule, value) {
                                                if (!value) return Promise.reject("Vui lòng chọn thời gian áp dụng");
                                                return Promise.resolve();
                                            }
                                        })
                                    ]}
                            >
							<RangePicker placeholder={['Từ ngày', 'Đến ngày']} format='DD/MM/YYYY' bordered={false} />
						</Form.Item>
					</Col>
					<Col span="4"></Col>
					<Col span="7">
                        <Form.Item label="Danh sách thiết bị" name='item'
                        rules={[
                            () => ({
                                validator(rule, value) {
                                    if (!value) return Promise.reject("Vui lòng chọn thiết bị");
                                    return Promise.resolve();
                                }
                            })
                        ]}>
                        <Select  bordered={false}  placeholder="Chọn thiết bị">
                        {
							list?.map((item) => {
								return (
									<Option value={item.id}>{item.equipmentName}</Option>
								)
							})
						}
                            </Select>
						</Form.Item>
					</Col>
				</Row>
                <Row>
                    <Col span="7">
                        <Button
                        style={{ backgroundColor: '#1890ff', minWidth: 120, display: 'block', color: '#fff' }} className="status-btn"
                        type="primary" htmlType="submit">
                            {fields?.length > 0 ? 'Cập nhật' : 'Tạo mới'}
                    </Button>
                    </Col>
                    <Col style={{ display: 'none'}} span="7">
                    <Form.Item label="id" name='id'>
                        <Input>
                            </Input>
						</Form.Item>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

export default FullDetail;