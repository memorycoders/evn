import React, { useEffect, useState } from "react";
import { Input, Form, Row, Col, Select, Button, DatePicker } from 'antd';
const { RangePicker } = DatePicker;
import {
	PlusCircleOutlined,
} from '@ant-design/icons';
import http from "../../../../apis/http";
import { FORMAT_DATE } from "../../../../utils/constants";
import moment from "moment";
import { NotificationError, NotificationSuccess } from '../../../../common/components/Notification'

const Detail = ({afterSaleItem, setAfterSaleItem, updateDataSource}) => {
		
	const [listPackage, setListPackage] = useState([])
		const [form] = Form.useForm();
		const getListPackage = async () => {
			try {
				const rs = await http.get('web/quotation/package');
				setListPackage(rs?.data?.data?.content ? rs?.data?.data?.content : [])
			}catch(ex){}
		}

		const handleChangeDate = (_moment, _string) => {
			setAfterSaleItem({
				...afterSaleItem,
				startDate: _moment[0].valueOf(),
				endDate: _moment[1].valueOf()
			})
		}
		const handleSelectDevice = (value) => {
			let _data = {
				...afterSaleItem,
				packageId: value
			}	
			setAfterSaleItem(_data)
		}
		const handelChangeDiscount = (_) => {
			setAfterSaleItem({
				...afterSaleItem,
				discount: _.target.value
			})
		}

		const handleUpdateAfterSale = async () => {
			let _data = afterSaleItem;
			setAfterSaleItem({})
			let url = 'web/quotation/afterSales'
			if(_data?.id)
				url += `/${_data?.id}`;
	
			try {
				if(_data?.packagePriceDTO?.id && !_data?.packageId) {
					_data.packageId = afterSaleItem?.packagePriceDTO?.id
				}
				const rs = await http.post(url, _data);
				updateDataSource(rs?.data?.data, _data?.id ? false : true)

			}
			catch (ex) {
				console.log('1', ex);
				if(ex.message === 'Hậu mãi đã tồn tại') {
					NotificationError("", "Tên hậu mãi đã tồn tại. Vui lòng thử lại");
				}
				else NotificationError("", "Có lỗi xảy ra. Vui lòng thử lại");
			} 
		}

		const submit = () => {
			form.validateFields()
			.then(() => {
				handleUpdateAfterSale()
				form.resetFields();
			}).catch((info) => {
				console.log('Validate Failed:', info);
			});
		}

		useEffect(() => {
			getListPackage()
		},[])

		useEffect(() => {
			form.setFieldsValue({
				...afterSaleItem,
				packageId: afterSaleItem?.packageId ? afterSaleItem?.packageId : afterSaleItem?.packagePriceDTO?.id
			})
		}, [afterSaleItem])

    return (
        <>
        <h3>Chi tiết hậu mãi <PlusCircleOutlined onClick={() => {setAfterSaleItem({})}} /></h3>
            <Form
				form={form}
				layout="vertical"
				>
				<Row>
					<Col span="10">
						<Form.Item label="Tên hậu mãi" required
							name="packageId"
							rules={[{ required: true, message: 'Vui lòng chọn thiết bị!' }]}>
							<Select placeholder="Chọn thiết bị" bordered={false} defaultValue={afterSaleItem?.packageId ? afterSaleItem?.packageId : afterSaleItem?.packagePriceDTO?.id} value={afterSaleItem?.packageId ? afterSaleItem?.packageId : afterSaleItem?.packagePriceDTO?.id}
							onChange={handleSelectDevice}>
									{
										listPackage?.map((item) => (
											<Select.Option value={item.id}>{item.packageName}</Select.Option>
										))
									}
							</Select>
						</Form.Item>
					</Col>
					<Col span="4"></Col>
					<Col span="10">
              <Form.Item label="Chiết khấu"
							required
							name="discount"
							rules={[{ required: true, message: 'Vui lòng nhập chiết khấu!' }]}>
							<Input  bordered={false}  placeholder="Chiết khấu" defaultValue={afterSaleItem?.discount} value={afterSaleItem?.discount} 
							onChange={handelChangeDiscount}/>
						</Form.Item>
					</Col>
				</Row>
				<Row>
					<Col span="10">
						<Form.Item label="Thời gian áp dụng"
							required
							name="time"
							rules={[{ required: true, message: 'Vui lòng chọn thời gian áp dụng!' }]}>
							<RangePicker format={FORMAT_DATE} defaultValue={[ afterSaleItem?.startDate ? moment(afterSaleItem?.startDate) : null, afterSaleItem?.endDate ? moment(afterSaleItem?.endDate) : null]}
							value={[ afterSaleItem?.startDate ? moment(afterSaleItem?.startDate) : null, afterSaleItem?.endDate ? moment(afterSaleItem?.endDate) : null]} onChange={handleChangeDate}/>
						</Form.Item>
					</Col>
					<Col span="4"></Col>
					<Col span="10">
            <Button onClick={submit}>Cập nhật</Button>
					</Col>
				</Row>
        </Form>
        </>
    )
}

export default Detail;