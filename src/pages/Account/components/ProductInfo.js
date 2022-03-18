import React, { useEffect, useState } from "react";
import { Input, Form, Row, Col, Select, Button, DatePicker } from 'antd';
import http from "../../../apis/http";
import { connect } from "react-redux";
import moment from "moment";
import { NotificationError, NotificationSuccess } from '../../../common/components/Notification'

const ProductInfo = (props) => {
	const { setId, setTransfer } = props
	const [form] = Form.useForm();
	const [data, setData] = useState([]);

	// console.log("propsUser",props.user);
	
	const fetchData = async () => {
		try {
			const rs = await http.get(`web/loan_info?card_number=${props?.user}`);
			if (rs?.status === 200) {
				console.log('rsProductInfo', rs)
				setData(rs?.data?.data)
				setId(rs?.data?.data?.id)
				setTransfer(rs?.data?.data?.transaction_history)
			} else {
				return NotificationError("", "Có lỗi xảy ra. Vui lòng thử lại");
			}
		} catch (ex) { }
	}
	useEffect(() => {
		fetchData();
	}, [props?.user]);
	
	return (
		<>
			<h2 style={{ color: '#000', marginTop: 10 }}>Thông tin khác</h2>
			<Form style={{ color: '#000' }} form={form} layout="vertical" name="basic">
				<Row style={{ marginTop: 20 }}>
					<Col span="6">
						<Form.Item label={<label style={{ color: "#000", fontWeight: 500 }}>Tên sản phẩm</label>} name="name"></Form.Item>
					</Col>
					<Col>
						<Input
							style={{ width: "115%", color: "#000", padding: '0px 20px' }}
							bordered={false}
							value={data?.product_name ? data?.product_name : "Chưa cập nhật"}
							readOnly
						/>
					</Col>
					<Col span="2"></Col>
					<Col>
						<Form.Item label={<label style={{ color: "#000", fontWeight: 500 }}>Dư nợ hiện tại</label>} name="passpost"></Form.Item>
					</Col>
					<Col>
						<Input
							style={{ width: "115%", color: "#000", padding: '0px 20px' }}
							bordered={false}
							value={data?.current_debit ? data?.current_debit : "Chưa cập nhật"}
							readOnly
						/>
					</Col>
				</Row>
				<Row style={{ marginTop: '-30px' }}>
					<Col span="6">
						<Form.Item label={<label style={{ color: "#000", fontWeight: 500 }}>Thời hạn vay còn lại</label>} name="dob"></Form.Item>
					</Col>
					<Col>
						<Input
							style={{ width: "115%", color: "#000", padding: '0px 20px' }}
							bordered={false}
							value={data?.remaining_term ? data?.remaining_term : "Chưa cập nhật" + ' tháng'}
							readOnly
						/>
					</Col>
					<Col span="2"></Col>
					<Col>
						<Form.Item label={<label style={{ color: "#000", fontWeight: 500 }}>Ngày đến hạn tiếp theo</label>} name="account"></Form.Item>
					</Col>
					<Col>
						<Input
							style={{ width: "115%", color: "#000", padding: '0px 20px' }}
							bordered={false}
							value={moment(data?.next_due_date).format('DD/MM/YYYY')}
							readOnly
						/>
					</Col>
				</Row>
				<Row style={{ marginTop: '-30px' }}>
					<Col span="6">
						<Form.Item label={<label style={{ color: "#000", fontWeight: 500, minWidth: '180px' }}>Số tiền thanh toán tiếp theo</label>} name="address"></Form.Item>
					</Col>
					<Col>
						<Input
							style={{ width: "120%", color: '#000', padding: '0px 20px' }}
							bordered={false}
							value={data?.next_payment_amount ? data?.next_payment_amount + ' VNĐ' : "Chưa cập nhật" }
							readOnly
						/>
					</Col>
					<Col span="2"></Col>
					<Col>
						<Form.Item label={<label style={{ color: "#000", fontWeight: 500 }}>Lãi suất</label>} name="account"></Form.Item>
					</Col>
					<Col>
						<Input
							style={{ width: "115%", color: "#000", padding: '0px 20px' }}
							bordered={false}
							value={data?.interest_rate ? data?.interest_rate + '%': "Chưa cập nhật" }
							readOnly
						/>
					</Col>
				</Row>
			</Form>
		</>
	);
}

export default connect()(ProductInfo);