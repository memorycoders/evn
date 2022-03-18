import { Table, Tabs, Typography } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import React, { useEffect, useState } from 'react';
import moment from "moment";
const { TabPane } = Tabs;
const DetailLoanRepayment = (props) => {
	const { visible, showPopup, repaymentPlan} = props;
	const date = new Date();
	const [plans, setPlans] = useState([]);
	const hidePopup = () => {
		showPopup(false)
	}
	useEffect(() => {
		if(repaymentPlan && repaymentPlan.monthly_plan) {
			let plans = repaymentPlan.monthly_plan;
			plans.forEach((element, index) => {
				element['index'] = index;
				element['date'] = moment(date).add(index + 1, 'month').format("DD/MM/YYYY");
			});
			setPlans(plans);
		}
	}, [repaymentPlan])
	const formatVND = (value) => {
		return value.toLocaleString('vi-VI', {
			style: 'currency',
			currency: 'VND',
		})
	}  

	const columns = [
		{
			title: 'STT',
			dataIndex: 'index',
		},
		{
			title: 'Ngày trả nợ gốc, lãi',
			dataIndex: 'date',
		},
		{
			title: 'Dư nợ gốc',
			dataIndex: 'principal_balance',
			render: text => <p style={{textAlign: 'center'}}>{formatVND(text)}</p>,
		},
		{
			title: 'Gốc thanh toán',
			dataIndex: 'principal_payment',
			render: text => <p style={{textAlign: 'center'}}>{formatVND(text)}</p>,
		},
		{
			title: 'Gốc còn lại',
			dataIndex: 'remaining_balance',
			render: text => <p style={{textAlign: 'center'}}>{formatVND(text)}</p>,
		},
		{
			title: 'Lãi phải thanh toán (Dự kiến)',
			dataIndex: 'interest_payment',
			render: text => <p style={{textAlign: 'center'}}>{formatVND(text)}</p>,
		},
		{
			title: 'Tổng giá trị thanh toán',
			dataIndex: 'total_payment',
			render: text => <p style={{textAlign: 'center'}}>{formatVND(text)}</p>,
		},
	];
	return (
		<Modal className="l-modal"
			title="Chi tiết kế hoạch trả vay"
			onCancel={hidePopup}
			onOk={hidePopup}
			visible={visible}
			width="80%"
			footer={null}
			className="payment-plan-detail">
				<Tabs defaultActiveKey="1">
				<TabPane tab="Tháng" key="1">
					<Table columns={columns} pagination={{defaultPageSize: 5}} dataSource={plans}
					></Table>
				</TabPane>
			</Tabs>
		</Modal>
	)
}

export default DetailLoanRepayment;
					//summary={summary}
