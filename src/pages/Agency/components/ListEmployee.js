import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Button, Checkbox, Col, Input, Row, Select, Upload, Radio, Modal, Table, Form } from 'antd';
import { CheckOutlined, CheckCircleOutlined, PlusOutlined } from '@ant-design/icons';
import '../../../styles/digitalSignature.scss';
import { assignOrder, getAgents, getLoanLos } from "../../../store/common/action";
import http from "../../../apis/http";
import { NotificationError, NotificationSuccess } from "../../../common/components/Notification";
import { history } from '../../../utils/history';
import FormEmployee from './FormEmployee';
const ListEmployee = (props) => {
	const { setFields, data, totalItem, getListByPage, agents, fields, role_name, currentAgentPage, setCurrentAgentPage } = props;
	const [dataSource, setDataSource] = useState([]);
	useEffect(() => {
		setDataSource(data);
	}, [data])
	let size = window.innerWidth;
	const [form] = Form.useForm();
	const handleClickId = (record) => {
		setFields([
			{
				name: ['name'],
				value: record?.name,
			},
			{
				name: ['agencyCode'],
				value: record?.agent_id,
			},
			{
				name: ['phone'],
				value: record?.personal_information?.phone_number
			},
			{
				name: ['employeeId'],
				value: record?.code
			},
			{
				name: ['email'],
				value: record?.personal_information?.email
			},
			{
				name: ['area'],
				value: record?.region_id
			},
			{
				name: ['cmnd'],
				value: record?.personal_information?.card_number
			},
			{
				name: ['id'],
				value: record?.id
			},
			{
				name: ['address'],
				value: record?.address
			},
			{
				name: ['position'],
				value: record?.position
			},
			{
				name: ['file_uuid'],
				value: record?.file_uuid
			},
			{
				name: ['status'],
				value: record?.status
			},
		])
	}
	const columns = [
		{
			title: 'Mã nhân viên',
			dataIndex: 'code',
			key: 'code',
			width: 150,
			render: (code, record) => {
				return (
					<a onClick={() => { handleClickId(record) }}>{code}</a>
				)
			}
		},
		{
			title: 'Họ tên',
			dataIndex: 'name',
			key: 'name',
			render: (name) => (
				<span>{name}</span>
			)
		},
		{
			title: 'Chức vụ',
			dataIndex: 'position',
			key: 'position',
			render: (position) => (
				<span>{position}</span>
			)
		},
		{
			title: 'Số điên thoại',
			dataIndex: 'personal_information',
			key: 'personal_information',
			render: (personal_information) => (
				<span>{personal_information?.phone_number}</span>
			)
		},
		{
			title: 'Đại lý',
			dataIndex: 'agent',
			key: 'agent',
			render: (agent) => (
				<span>{agent?.agent_name}</span>
			)
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			// width: 80,
			render: status => {
				return (
					<div>
						{/* {status === 1 ? 'Đang hoạt động'
							: status === 0 ? 'Dừng hoạt động'
								: ''
						} */}
						{
							status === 1 ? "Đang hoạt động" : "Dừng hoạt động"
						}
					</div>
				)
			}
		},
	]

	const changePage = (page, pageSize) => {
		form.resetFields();
		setCurrentAgentPage(page)
		getListByPage(null, page - 1)

	}
	return (
		<div className="operate-wrapper">
			<div className="l-operate-container">
				<div style={{ marginTop: '10px', maxWidth: size > 1440 ? '100%' : '1440px' }} className="digital-signature operate-signature">
					<div className="loanlist-operate">
						<h2 style={{ marginLeft: '5px' }}>Danh sách nhân viên</h2>
						<Table scroll={true}
							style={{ marginTop: '-10px' }}
							className="attach-table"
							// dataSource={dataSource}
							dataSource={data}
							// columns={columns}
							columns={columns}
							rowKey="key"
							pagination={{ defaultPageSize: 5, current: currentAgentPage, total: totalItem, onChange: changePage }}
						// size={size > 1440 ? 'default' : 'small'} 
						/>

					</div>
				</div>
				<div style={{ margin: '5px 20px 0px 20px', maxWidth: size > 1440 ? '100%' : '1440px' }}>
					<FormEmployee style={role_name === 'Provider2' || role_name === 'Provider3' ? { display: 'none' } : {}} setFields={setFields} form={form} currentAgentPage={currentAgentPage} setData={setDataSource} getListByPage={getListByPage} handleChangePage={changePage} fields={fields} />
				</div>
			</div>
		</div>
	)
}
function mapDispatchToProps(dispatch) {
	return {
		getAgents: () => dispatch(getAgents()),
		getLoanLos: (payload) => dispatch(getLoanLos(payload)),
		assignOrder: (data) => dispatch(assignOrder(data))
	}
}
const mapStateToProps = (state) => {
	return {
		role_name: state?.authentication?.user?.role?.code,

	}
};
export default connect(mapStateToProps, mapDispatchToProps)(ListEmployee);