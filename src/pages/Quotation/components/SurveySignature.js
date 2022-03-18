import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Row, Col, Select, Table, Input, Form, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import '../../../styles/digitalSignature.scss';
import { assignOrder, getAgents, getLoanLos } from "../../../store/common/action";
import http from "../../../apis/http";
import { NotificationError, NotificationSuccess } from "../../../common/components/Notification";
import moment from "moment";

const SurveySignature = (props) => {
	const {setFields, data, totalItem, getListByPage} = props;
	const [dataSource, setDataSource] = useState([]);
	const listFilter = [
		{
			id: 'packageName',
			name: 'Tên gói'
		},
		{
			id: 'id',
			name: 'Mã ĐG'
		},
		{
			id: 'provider',
			name: 'Nhà cung cấp'
		},
		{
			id: 'customerType',
			name: 'ĐTKH'
		},
		{
			id: 'voltage',
			name: 'Điện áp'
		},
		{
			id: 'roofType',
			name: 'Loại mái'
		},
		{
			id: 'systemType',
			name: 'Hệ'
		},
		{
			id: 'price',
			name: 'Đơn giá'
		},
		{
			id: 'status',
			name: 'Trạng thái'
		}
	];
	const onFinish = async (values) => {
		console.log('values', values)
		const rs = await http.get(`web/quotation/package?key=${values?.filter}&value=${values?.search}&pageIndex=0&pageSize=5`);
		if(rs?.status === 200) {
			NotificationSuccess("", "Thành công");
			setDataSource(rs?.data?.data?.content);
		}
    }
	const changeFilter = async (value) => {
		const rs = await http.get(`web/quotation/package?key=${value}&pageIndex=0&pageSize=5`);
		if(rs?.status === 200) {
			NotificationSuccess("", "Thành công");
			setDataSource(rs?.data?.data?.content);
		}
	}
	const handleSearch = () => {
		form.submit();
		let a = form.getFieldValue('filter');
		let b = form.getFieldValue('search');
	}
	let size = window.innerWidth;
	const handleClickId = (record) => {
			let a = moment.unix(record?.startDate / 1000).format("DD/MM/YYYY");
			let b = moment.unix(record?.endDate / 1000).format("DD/MM/YYYY")
			setFields([
				{
					name: ['name'],
					value: record.packageName,
				}, 
				{
					name: ['system'],
					value: record?.systemType,
				},
				{
					name: ['name_ncc'],
					value: record?.provider?.id
				},
				{
					name: ['roof'],
					value: record?.roofType
				},
				{
					name: ['customer'],
					value: record?.customerType
				},
				{
					name: ['electric'],
					value: record?.voltage
				},
				{
					name: ['item'],
					value: record?.equipmentList?.[0]
				},
				{
					name: ['id'],
					value: record?.id
				},
				{
					name: ['dateTime'],
					value: [moment(a, 'DD/MM/YYYY'), moment(b, 'DD/MM/YYYY')]
				},
			])
		}
    const columns = [
			{
				title: 'Mã ĐG',
				dataIndex: 'id',
				key: 'id',
				width: 150,
				render: (id, _, index) => {
					let a = '';
					if(id < 10) { a = '0' + id}
					else a = id
					return (
						<span>{a}</span>
					)
				}
			},
			{
				title: 'Tên gói',
				dataIndex: 'packageName',
				key: 'packageName',
				render: (packageName, record) => {
					return (
						<a onClick={() => {handleClickId(record)}}>{packageName}</a>	
					)
				}
					
			},
			{
				title: 'Nhà cung cấp',
				dataIndex: 'provider',
				key: 'provider',
				render: (provider) => (
					<span>{provider?.providerName}</span>
				)
			},
			{
				title: 'ĐTKH',
				dataIndex: 'customerType',
				key: 'customerType',
				render: (customerType) => (
					<span>{customerType === 'NON_ELECTRICAL' ? 'Ngoài ngành điện' : 'Ngành điện'}</span>
				)
			},
			{
				title: 'Điện áp',
				dataIndex: 'voltage',
				key: 'voltage',
				render: (voltage) => {
					return (
					<div>
						{voltage}
					</div>
					)
					
				}
			},
			{
				title: 'Loại mái',
				dataIndex: 'roofType',
				key: 'roofType',
				render: (roofType) => {
					return (
					
					<div>
						{roofType === 'METAL' ? 'Mái tôn' : 'Mái bằng'}
					</div>
					)
					
				}
			},
			{
				title: 'Hệ',
				dataIndex: 'systemType',
				key: 'systemType',
				render: (systemType) => {
					return (
					<div>
						{/* {systemType} */}
						{systemType === 'THREE_PHASE' ? '3 pha' : systemType === "TWO_PHASE" ? '2 pha' : '1 pha'}
					</div>
					)
					
				}
			},
			{
				title: 'Đơn giá (VNĐ)',
				dataIndex: 'price',
				key: 'price',
				render: (price) => {
					return (
						<div>
						{price} VNĐ
					</div>
					)
					
			},
			},
            {
				title: 'Trạng thái',
				dataIndex: 'status',
				key: 'status',
				render: (status) => {
					return (
					<div>
						{status === 'USE_APPLY' ? 'Đang áp dụng' : status === 'NOT_USE_APPLY' ? 'Chưa áp dụng' : 'Hết hiệu lực'}
					</div>
					)
					
				}
			},
			
	]
	
	useEffect(() => {
		setDataSource(data);
	}, [data])
	const changePage = (page, pageSize) => {
		getListByPage(null, page - 1)
	}
	const [form] = Form.useForm();
    return (
		
        <div style={{ marginBottom: '-20px', marginTop: '-10px', maxWidth: size > 1440 ? '100%' : '1440px' }} className="digital-signature operate-signature">
            <div className="loanlist-operate">
            <h2 style={{ marginLeft: '5px'}}>Danh sách đơn hàng</h2>
			<Form
                form={form}
                onFinish={onFinish}
				layout="vertical"
                name="basic"
				style={{ marginBottom: '20px' }}
			>
			<Row>
				<Col span="12"></Col>
				<Col span="5">
				<Form.Item name="filter">
					<Select placeholder="Nhà cung cấp" style={{ width: "95%" }} onChange={(value) => changeFilter(value)}>
						{listFilter?.map((item) => (
							<Select.Option value={item.id}>{item.name}</Select.Option>
						))}
					</Select>
				</Form.Item>
				</Col>
				<Col span="7">
					<Form.Item name="search">
						<Input.Search onSearch={() => handleSearch()} placeholder='Tìm kiếm...' defaultValue="" />
					</Form.Item>
				</Col>
			</Row>
				<Button
                    style={{ display: 'none' }} 
                    type="primary" htmlType="submit">
                </Button>
			</Form>
                <Table scroll={true}
                    style={{ marginTop: '-10px' }}
                    className="attach-table"
					dataSource={dataSource}
					// columns={columns}
					columns={props.index != 'CONTRACT' ? columns.filter(col => (col.key !== 'action1' && col.key !== 'action2')) 
							: columns.filter(col => (col.key !== 'staff' && col.key !== 'agency'))}
                    rowKey="key"
                    pagination={{defaultPageSize: 5, total: totalItem, onChange: changePage}}
                    // size={size > 1440 ? 'default' : 'small'}
					/>
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
		agents: state.common.agents,
		loansData: state.loan.loansData,
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(SurveySignature);