import React from "react";
import { Input, Form, Row, Col, Select, Button, DatePicker } from 'antd';
const { RangePicker } = DatePicker;
import moment from "moment";
import {
	PlusCircleOutlined,
} from '@ant-design/icons';
import http from "../../../../apis/http";
import { NotificationError, NotificationSuccess } from '../../../../common/components/Notification'

import { CALCULATION_UNIT, FORMAT_DATE } from "../../../../utils/constants";
const DeviceDetail = ({ equipment, setEquipment, providers, updateDataSource }) => {
	const [form] = Form.useForm();
	const handleUpdateEquipment = async () => {
		let url = 'web/quotation/equipment'
		if (equipment?.id)
			url += `/${equipment?.id}`;
		try {
			let _data = { ...equipment }
			if (equipment?.provider?.id && !equipment?.providerId) {
				_data.providerId = equipment?.provider?.id
			}
			const rs = await http.post(url, _data);
			updateDataSource(rs?.data?.data, equipment?.id ? false : true);
			setEquipment({})
		} catch (ex) {
			if (ex.message === 'Tên thiết bị đã tồn tại') {
				NotificationError("", "Tên thiết bị đã tồn tại. Vui lòng thử lại");
			}
			else NotificationError("", "Có lỗi xảy ra. Vui lòng thử lại");
		}
	}
	const updateTextField = (field, _) => {
		setEquipment({
			...equipment,
			[field]: _.target.value
		})
	}

	const updateSelectField = (field, value) => {
		setEquipment({
			...equipment,
			[field]: value
		})
	}
	const addEquipment = () => {
		setEquipment({})
	}
	const handleChangeDate = (_moment, _string) => {
		setEquipment({
			...equipment,
			startDate: _moment[0].valueOf(),
			endDate: _moment[1].valueOf()
		})
	}
	return (
		<>
			<h3>Chi tiết thiết bị <PlusCircleOutlined onClick={addEquipment} /></h3>
			<Form
				form={form}
				layout="vertical"
			>
				<Row>
					<Col span="10">
						<Form.Item label="Thiết bị">
							<Input bordered={false} placeholder="Thiết bị" defaultValue={equipment?.equipmentName} value={equipment?.equipmentName} onChange={(_) => { updateTextField('equipmentName', _) }} />
						</Form.Item>
					</Col>
					<Col span="4"></Col>
					<Col span="10">
						<Form.Item label="Nhà sản xuất" >
							<Input bordered={false} placeholder="Nhà sản xuất" defaultValue={equipment?.manufacturer} value={equipment?.manufacturer} onChange={(_) => { updateTextField('manufacturer', _) }} />
						</Form.Item>
					</Col>
				</Row>
				<Row>
					<Col span="10">
						<Form.Item label="Nhà cung cấp" >
							<Select bordered={false} placeholder="Nhà cung cấp" defaultValue={equipment?.providerId ? equipment?.providerId : equipment?.provider?.id} value={equipment?.providerId ? equipment?.providerId : equipment?.provider?.id} onChange={(value) => { updateSelectField('providerId', value) }}>
								{providers?.map((item) => (
									<Select.Option value={item.id}>{item.providerName}</Select.Option>
								))}
							</Select>
						</Form.Item>
					</Col>
					<Col span="4"></Col>
					<Col span="10">
						<Form.Item label="Quy cách" >
							<Input bordered={false} placeholder="Quy cách" defaultValue={equipment?.regulations} value={equipment?.regulations} onChange={(_) => { updateTextField('regulations', _) }} />
						</Form.Item>
					</Col>
				</Row>
				<Row>
					<Col span="10">
						<Form.Item label="Đơn vị tính">
							{/* <Input bordered={false} placeholder="Đơn vị tính" defaultValue="0" defaultValue={equipment?.calculationUnit} value={equipment?.calculationUnit} onChange={(_) => {updateTextField('calculationUnit', _)}}></Input> */}
							<Select bordered={false} placeholder="Đơn vị tính" defaultValue="0" defaultValue={equipment?.calculationUnit} value={equipment?.calculationUnit} onChange={(value) => { updateSelectField('calculationUnit', value) }}>
								<Select.Option value={CALCULATION_UNIT.PLATE.key}>{CALCULATION_UNIT.PLATE.name}</Select.Option>
								<Select.Option value={CALCULATION_UNIT.SUITE.key}>{CALCULATION_UNIT.SUITE.name}</Select.Option>
								<Select.Option value={CALCULATION_UNIT.SYSTEM.key}>{CALCULATION_UNIT.SYSTEM.name}</Select.Option>
							</Select>
						</Form.Item>
					</Col>
					<Col span="4"></Col>
					<Col span="10">
						<Form.Item label="Giá">
							<Input bordered={false} placeholder="Giá" defaultValue={equipment?.price} value={equipment?.price} onChange={(_) => { updateTextField('price', _) }} />
						</Form.Item>
					</Col>
				</Row>
				<Row>
					<Col span="10">
						<Form.Item label="Thời gian áp dụng" >
							<RangePicker format={FORMAT_DATE} defaultValue={[equipment?.startDate ? moment(equipment?.startDate) : null, equipment?.endDate ? moment(equipment?.endDate) : null]}
								value={[equipment?.startDate ? moment(equipment?.startDate) : null, equipment?.endDate ? moment(equipment?.endDate) : null]} onChange={handleChangeDate} />
						</Form.Item>
					</Col>
					<Col span="4"></Col>
					<Col span="10">
						<Button
							style={{ backgroundColor: '#1890ff', minWidth: 120, display: 'block', color: '#fff' }} className="status-btn"
							onClick={handleUpdateEquipment}>{equipment?.id ? "Cập nhật" : "Tạo mới"}</Button>
					</Col>
				</Row>
			</Form>
		</>
	)
}

export default DeviceDetail;