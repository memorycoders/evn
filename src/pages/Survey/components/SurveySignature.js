import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Button, Select, Table } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import '../../../styles/digitalSignature.scss';
import { assignOrder, getAgents, getLoanLos } from "../../../store/common/action";
import http from "../../../apis/http";
import { STATUS_CODE } from "../../../utils/constants";
import { NotificationError, NotificationSuccess } from "../../../common/components/Notification";
import { forEach } from "lodash";
import moment from "moment";

const SurveySignature = (props) => {
	const {getAgents, agents, setCurrentStaff, assignOrder, data, setLoanCalendar, listAgentID, currentSchedule, setCurrentLoanCode, totalItem, getListByPage, role_info} = props;
	let id = props.agentId ? props.agentId : props.employeeId ? props.employeeId : null
	const [dataSource, setDataSource] = useState([]);
	const ASSIGN_TYPE = {
		AGENCY: 'AGENCY',
		STAFF: 'STAFF'
	}

	let size = window.innerWidth;
	const fetchStaffByAgentId = async (id, sourceIndex, isResetEmployee) => {
		try {
			const rs = await http.get('web/providers/employees', { params: {
				agentId: id,

			}})
			let _dataSourceIndex = [...dataSource];
			_dataSourceIndex[sourceIndex]['agent_id'] = id;
			if(isResetEmployee)
				_dataSourceIndex[sourceIndex]['employee_id'] = null;
			if(rs?.status === STATUS_CODE.SUCCESS) {
				_dataSourceIndex[sourceIndex]['staff'] = rs?.data?.data?.content;
			}
			setDataSource(_dataSourceIndex)

		}catch(ex){}
	}

	useEffect(() => {
		setTimeout(() => {
			forEach(listAgentID, (item) => {
				fetchStaffByAgentId(item.agent_id, item.index)
			})
		})

	}, [listAgentID])
	const changeAgency = (value, index) => {
		fetchStaffByAgentId(value, index, true);
	}

	const changeStaff = (value, name, index) => {
		let _dataSourceIndex = [...dataSource];
		_dataSourceIndex[index]['employee_id'] = value
		setDataSource(_dataSourceIndex)
		setCurrentStaff(name)
	}

	const fetchDataByLoanCode = async (data, index) => {
		try {
			setCurrentLoanCode(data)
			if(dataSource[index]?.employee?.name) {
				setCurrentStaff(dataSource[index].employee.name)
			} else {
				setCurrentStaff("")
			}
			const rs = await http.get('web/loans/' + data +'/operator');
			if(rs?.status === 200) {
			setLoanCalendar(rs?.data?.data)
			} else {
				return NotificationError("", "Co?? l????i xa??y ra. Vui lo??ng th???? la??i");
			}
		}catch(ex){}
	}

	const _assignOrder = (index, type) => {

		let _data = {}
		switch(type) {
			case ASSIGN_TYPE.AGENCY:
				_data = {
					agent_id: dataSource[index].agent_id,
					loan_code: dataSource[index].loan_code
				}
				assignOrder({
					employee_id: dataSource[index].employee_id,
					loan_code: dataSource[index].loan_code
				})
			break;
			case ASSIGN_TYPE.STAFF:
				_data = {
					employee_id: dataSource[index].employee_id,
					loan_code: dataSource[index].loan_code
				}
				
			break;
		}
		
		if(type === 'AGENCY'){
			if(!_data.agent_id){
				NotificationError("", "Vui lo??ng cho??n 1 ??a??i ly??.");
				return false;
			} else {
				NotificationSuccess("", "C????p nh????t tha??nh c??ng.");
				assignOrder(_data)
			} 
		} 
		if(type === 'STAFF'){
			if(!_data.employee_id){
				NotificationError("", "Vui lo??ng cho??n 1 ??a??i ly?? ho????c nh??n vi??n.");
				return false;
			} else {
				NotificationSuccess("", "C????p nh????t tha??nh c??ng.");
				assignOrder(_data)
			} 
		}
		}

    const columns = [
			{
				title: 'M?? giao d???ch',
				dataIndex: 'loan_code',
				key: 'loan_code',
				width: 150,
				render: (loan_code, _, index) => {
					return (
						<a onClick={() => fetchDataByLoanCode(loan_code, index)}>{loan_code}</a>
					)
				}
			},
			{
				title: 'T??n kh??ch h??ng',
				dataIndex: 'name',
				key: 'name',
				render: (name) => (
					<span>{name}</span>
				)			
			},
			{
				title: 'S??? ??i??n tho???i',
				dataIndex: 'contact_phone',
				key: 'contact_phone',
				render: (contact_phone) => (
					<span>{contact_phone}</span>
				)
			},
			{
				title: '?????a ch??? l???p ?????t',
				dataIndex: 'installation_address',
				key: 'installation_address',
				render: (installation_address) => (
					<span>{installation_address}</span>
				)
			},
			{
				title: props.catch === 'van_hanh' ? 'Nga??y y??u c????u' : '',
				dataIndex: 'request_at_value',
				key: 'request_at_value',
				render: (request_at_value) => {
					let a = ''
					if(request_at_value) a = moment.unix(request_at_value / 1000).format("DD/MM/YYYY");
					else a = '';
					// console.log('>>>', a)
					return (
					props.catch === 'van_hanh' &&
					<div>
						{a}
					</div>
					)
					
				}
			},
			{
				title: props.catch === 'van_hanh' ? 'N????i dung y??u c????u' : '',
				dataIndex: 'request_content',
				key: 'request_content',
				render: (request_content) => {
					return (
					props.catch === 'van_hanh' &&
					<div>
						{request_content}
					</div>
					)
					
				}
			},
			{
				title: props.index !== 'SETUP' ? '?????i l??' : '',
				dataIndex: 'agent_id',
				key: 'agency',
				width: 80,
				render: (data, record, index) => {
					return (
					props.index !== 'SETUP' &&
					<div style={{ display: "flex"}}>
					<Select disabled={role_info?.some(e => e?.permission?.permissionName === 'Provider - Kh???o s??t - Ti???p nh???n chuy???n ?????i l??') ? false : true}
					placeholder="Cho??n ??a??i ly??" value={data}  onChange={(value) => { changeAgency(value, index) }} style={{ width: "100%", height: size > 1440 ? '35px' : '25px' }} bordered={true} >
						{
							agents && agents?.content?.map((item) => {
								return (
									<Option value={item.id}>{item.agent_name}</Option>
								)
							})
						}
					</Select>
					<CheckOutlined disabled={role_info?.some(e => e?.permission?.permissionName === 'Provider - Kh???o s??t - Ti???p nh???n chuy???n ?????i l??') ? false : true}
					 style={{color: "#4DB769", marginLeft: '10px', marginTop: '8px',
					 display: role_info?.some(e => e?.permission?.permissionName === 'Provider - Kh???o s??t - Ti???p nh???n chuy???n ?????i l??') ? 'block' : 'none'  }} onClick= {() => { _assignOrder(index, ASSIGN_TYPE.AGENCY) }} />
					</div>
					)
					
				}
			},
			{
				title: props.index !== 'SETUP' ? 'Nh??n vi??n' : '',
				dataIndex: 'employee_id',
				key: 'staff',
				width: 80,
				render: (data, _, index) => {
					return (
						props.index !== 'SETUP' &&
					<div style={{ display: "flex"}}>
					<Select disabled={role_info?.some(e => e?.permission?.permissionName === 'Provider - Kh???o s??t - Chuy???n nh??n vi??n kh???o s??t') ? false : true}
					 placeholder="Cho??n nh??n vi??n" value={data} onChange={ (value, item) => { changeStaff(value, item.children, index) } } style={{ width: "100%", height: size > 1440 ? '35px' : '25px' }} bordered={true} >
						{
							dataSource[index]?.staff?.map((item) => {
								return (
									<Option value={item.id}>{item.name}</Option>
								)
							})
						}
					</Select>
					<CheckOutlined disabled={role_info?.some(e => e?.permission?.permissionName === 'Provider - Kh???o s??t - Chuy???n nh??n vi??n kh???o s??t') ? false : true}
					 style={{color: "#4DB769", marginLeft: '10px', marginTop: '8px',
					 display: role_info?.some(e => e?.permission?.permissionName === 'Provider - Kh???o s??t - Chuy???n nh??n vi??n kh???o s??t') ? 'block' : 'none' }} onClick= {() => { _assignOrder(index, ASSIGN_TYPE.STAFF) }}/>
					</div>
					)
					
			},
			},
			{
				title: props.catch !== 'van_hanh' ? 'Tr???ng th??i' : '',
				dataIndex: 'status',
				key: 'status',
				// width: 80,
				render: (status) => {
					return (
						props.catch !== 'van_hanh' ? 
						<div>
						{status === 'SENT_PARTNER' ? <Button className="status-btn" style={{ backgroundColor: '#1890ff', height: size > 1440 ? '35px' : '25px' }}>Chuy????n nha?? th????u</Button>
							: status === 'SURVEY' ? <Button style={{ backgroundColor: '#1890ff',  height: size > 1440 ? '35px' : '25px' }} className="status-btn">??ang kha??o sa??t</Button>
								: status === 'COLLECT_SURVEY' ? <Button style={{ backgroundColor: '#1890ff',  height: size > 1440 ? '35px' : '25px'  }} className="status-btn">??a?? kha??o sa??t</Button>
									: status === 'SCORE_PASSED' ? <Button style={{ backgroundColor: '#1890ff',  height: size > 1440 ? '35px' : '25px'  }} className="status-btn">??a?? kha??o sa??t</Button>
								: status === 'SCORE_NOT_PASSED' ? <Button style={{ backgroundColor: '#1890ff',  height: size > 1440 ? '35px' : '25px'  }} className="status-btn">???? kh???o s??t</Button>
							:status === 'AWAITING_APPROVAL_LOAN' ? <Button style={{ backgroundColor: '#1890ff',  height: size > 1440 ? '35px' : '25px'  }} className="status-btn">??ang ph?? duy????t</Button>
						:status === 'APPROVED_LOAN' ? <Button style={{ backgroundColor: '#1890ff',  height: size > 1440 ? '35px' : '25px'  }} className="status-btn">??a?? ph?? duy????t</Button>
					:status === 'SIGNED_WAITING_SETUP' ? <Button style={{ backgroundColor: '#1890ff',  height: size > 1440 ? '35px' : '25px'  }} className="status-btn">??a?? ky?? h????p ??????ng 1</Button>
				:status === 'SIGNED_SETUPED' ? <Button style={{ backgroundColor: '#1890ff',  height: size > 1440 ? '35px' : '25px'  }} className="status-btn">??a?? l????p ??????t</Button>
				:status === 'SIGNED_WAITING_DISBURSE' ? <Button style={{ backgroundColor: '#1890ff',  height: size > 1440 ? '35px' : '25px'  }} className="status-btn">Ch???? gia??i ng??n</Button>
				:status === 'SIGNED_SETUPED' ? <Button style={{ backgroundColor: '#1890ff',  height: size > 1440 ? '35px' : '25px'  }} className="status-btn">??a?? l????p ??????t</Button>
				: <div></div>
			}		   
						</div>
				 
				: <div></div>
					)
				}
			},
			{
				title: '',
				dataIndex: 'status',
				key: 'action1',
				width: 80,
				render: status => {
					props.catch !== 'van_hanh' ? 
					
						(status === 'SIGNED_SETUPED' || status === 'SIGNED_WAITING_SETUP' || 'SIGNED_WAITING_DISBURSE') && currentSchedule === 'CONTRACT' &&
						<div>
						<Button className="status-btn" style={{ backgroundColor: '#1890ff',  height: size > 1440 ? '35px' : '25px', cursor: 'pointer' }}>View h????p ??????ng l????p ??????t</Button>
						</div>
					 : <div></div>
				}
			},
			{
				title: '',
				dataIndex: 'status',
				key: 'action2',
				width: 80,
				render: status => {
					props.catch !== 'van_hanh' ? 
						status === 'SIGNED_WAITING_DISBURSE' && currentSchedule === 'CONTRACT' &&
						<div>
						<Button className="status-btn" style={{ backgroundColor: '#1890ff',  height: size > 1440 ? '35px' : '25px', cursor: 'pointer' }}>View h????p ??????ng nghi????m thu</Button>
						</div>
					: <div></div>
				}
			},
	]


	useEffect(() => {
		// getLoanLosList();
		getAgents();
		setDataSource(data);
	}, [data])
	
	const changePage = (page, pageSize) => {
		getListByPage(null, page - 1, id)
	}
    return (
		
        <div style={{ marginBottom: '-20px', marginTop: '-10px', maxWidth: size > 1440 ? '100%' : '1440px' }} className="digital-signature operate-signature">
            <div className="loanlist-operate">
            <h2 style={{ marginLeft: '5px'}}>Danh sa??ch ????n ha??ng</h2>
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
		agentId: state?.authentication?.agent_id,
		role_info: state?.authentication?.role_info,
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(SurveySignature);