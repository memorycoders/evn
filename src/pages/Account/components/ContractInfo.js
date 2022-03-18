import React, { useEffect, useState } from "react";
import { Input, Form, Row, Col, Select, Button, DatePicker } from 'antd';
import http from "../../../apis/http";
import { NotificationError, NotificationSuccess } from '../../../common/components/Notification'
import moment from "moment";

const ContractInfo = (props) => {
    const [form] = Form.useForm();
	const [listContract, setContractList] = useState([]);
	const [listData, setListData] = useState([]);
	const { setId, setTransfer } = props
	const getListContract = async () => {
		try {
			const rs = await http.get(`web/deposits_info/contract?card_number=${props?.user ? props?.user : '111111'}`);
			if(rs?.status === 200) {
				// console.log("rs?.data?.data?.data",rs?.data?.data?.data);
				
				setContractList(rs?.data?.data?.data);
				onFinish(rs?.data?.data?.data[0]?.id)
				setId(rs?.data?.data?.data[0]?.id)
			} else {
				return NotificationError("", "Có lỗi xảy ra. Vui lòng thử lại");
			}
		}catch(ex){
			console.log(ex)
            // return NotificationError("", "Có lỗi xảy ra. Vui lòng thử lại");
        }
	}
	const getTransferHistory = async () => {
		try {
			const rs = await http.get(`web/deposits_info?card_number=${props?.user ? props?.user : '111111'}`);
			if(rs?.status === 200) {
				// console.log('???', rs)
				setTransfer(rs?.data?.data?.transactionList)
			} else {
				return NotificationError("", "Có lỗi xảy ra. Vui lòng thử lại");
			}
		}catch(ex){
            return NotificationError("", "Có lỗi xảy ra. Vui lòng thử lại");
        }
	}
	const onFinish = async (value) => {
		try {
			const rs = await http.get(`web/deposits_info/${value}`);
			if(rs?.status === 200) {
				console.log("rs3",rs);
				setListData(rs?.data?.data);
			} else {
				return NotificationError("", "Có lỗi xảy ra. Vui lòng thử lại");
			}
		}catch(ex){
            return NotificationError("", "Có lỗi xảy ra. Vui lòng thử lại");
        }
	}
	useEffect(() => {
        getListContract();
    },[props?.user])
	useEffect(() => {
		getTransferHistory();
    },[])
	return (
		<>
		  <h2 style={{ color: '#000', marginTop: 10 }}>Thông tin khác</h2>
		  <Form style={{ color: '#000' }} form={form} layout="vertical" name="basic">
          <Row style={{ marginTop: 20 }}>
			  <Col span="3">
				<Form.Item label={<label style={{ color: "#000", fontWeight: 500 }}>Số hợp đồng</label>} name="name"></Form.Item>
			  </Col>
			  <Col>
				<Select
				  style={{ color: "#000", width: '120px', marginLeft: 19 }}
                  value={listContract?.[0]?.depositsCode}
				  onChange={(value) => onFinish(value)}
				>
                    {
							listContract?.map((item) => {
								return (
									<Option value={item?.id}>{item?.depositsCode}</Option>
								)
							})
						}
                </Select>
			  </Col>
			</Row>
			<Row style={{ marginTop: '-30px' }}>
			  <Col span="3">
				<Form.Item label={<label style={{ color: "#000", fontWeight: 500 }}>Tên sản phẩm</label>} name="name"></Form.Item>
			  </Col>
			  <Col>
				<Input
				  style={{ width: "115%", color: "#000", padding: '0px 20px' }}
				  bordered={false}
				  value={listData?.productName ? listData?.productName : "Chưa cập nhật"}
				  readOnly
				/>
			  </Col>
			  <Col span="3"></Col>
			  <Col>
				<Form.Item label={<label style={{ color: "#000", fontWeight: 500 }}>Dư nợ hiện tại</label>} name="passpost"></Form.Item>
			  </Col>
			  <Col>
				<Input
				  style={{ width: "115%", color: "#000", padding: '0px 20px' }}
				  bordered={false}
				  value={listData?.depositsAmount ? listData?.depositsAmount   + ' VNĐ' : "Chưa cập nhật" }
				  readOnly
				/>
			  </Col>
			</Row>
			<Row style={{ marginTop: '-30px' }}>
			  <Col span="3">
				<Form.Item label={<label style={{ color: "#000", fontWeight: 500 }}>Thời hạn vay còn lại</label>} name="dob"></Form.Item>
			  </Col>
			  <Col>
				<Input
				  style={{ width: "115%", color: "#000", padding: '0px 20px' }}
				  bordered={false}
				  value={listData?.depositsTerm ? listData?.depositsTerm  + 'tháng' :"Chưa cập nhật" }
				  readOnly
				/>
			  </Col>
			  <Col span="3"></Col>
			  <Col>
				<Form.Item label={<label style={{ color: "#000", fontWeight: 500 }}>Ngày đến hạn tiếp theo</label>} name="account"></Form.Item>
			  </Col>
			  <Col>
				<Input
				  style={{ width: "115%", color: "#000", padding: '0px 20px' }}
				  bordered={false}
				  value={moment(listData?.dueDate).format('DD/MM/YYYY')}
				  readOnly
				/>
			  </Col>
			</Row>
			<Row style={{ marginTop: '-30px' }}>
			  <Col span="3">
				<Form.Item label={<label style={{ color: "#000", fontWeight: 500, minWidth: '180px' }}>Số tiền thanh toán tiếp theo</label>} name="address"></Form.Item>
			  </Col>
			  <Col>
				<Input
				  style={{ width: "120%", color: '#000', padding: '0px 20px' }}
				  bordered={false}
				  value={listData?.depositsAmount ? listData?.depositsAmount + ' VNĐ' : "Chưa cập nhật" }
				  readOnly
				/>
			  </Col>
			  <Col span="3"></Col>
			  <Col>
				<Form.Item label={<label style={{ color: "#000", fontWeight: 500 }}>Lãi suất</label>} name="account"></Form.Item>
			  </Col>
			  <Col>
				<Input
				  style={{ width: "115%", color: "#000", padding: '0px 20px' }}
				  bordered={false}
				  value={listData?.interestRate ? listData?.interestRate + '%' : "Chưa cập nhật" }
				  readOnly
				/>
			  </Col>
			</Row>
		  </Form>
		</>
	  );
}

export default ContractInfo;