import { Table, Button } from 'antd';
import React, { useState } from 'react';
const ListAgency = ({ dataSource, setCurrentAgent, currentPage, setCurrentPage, total }) => {
	const handleClickAgent = (index) => {
		setCurrentAgent(index)
	}

	const columns = [
		{
			title: 'Mã đại lý',
			dataIndex: 'agent_code',
			key: 'agent_code',
			render: (agent_code, _, index) => {
				return (
					<a onClick={() => handleClickAgent(index)}>{agent_code}</a>
				)
			}
		},
		{
			title: 'Tên đại lý',
			// dataIndex: 'agentName',
			// key: 'agentName',
			dataIndex: 'agent_name',
			key: 'agent_name',
			render: (agent_name) => {
				return (
					<div>{agent_name}</div>
				)
			}
		},
		{
			title: 'Vùng',
			dataIndex: 'region',
			key: 'region',
			render: (region) => {
				return region?.region_name || region?.regionName ? region.region_name || region?.regionName : ""
			}
		},
		{
			title: 'Số điện thoại',
			dataIndex: 'phone',
			key: 'phone',
		},
		{
			title: 'Người đại diện pháp luật',
			dataIndex: 'legalRepresentative',
			key: 'legalRepresentative',
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			render: (value) => (
				value ? (<Button className='status-btn' style={{ backgroundColor: '#1D4994' }}>
					<span className="l-calendar-name">Hợp tác</span>  </Button>) : (<Button className='status-btn' style={{ backgroundColor: '#1D4994' }}>
						<span className="l-calendar-name">Dừng hợp tác</span>  </Button>)


			),
		},
	];
	// const [page, setPage]=useState(1);
	const onChangePage = (e) => {
		setCurrentPage(e)
	}
	return (
		<Table
			dataSource={dataSource}
			columns={columns}
			pagination={{ defaultPageSize: 5, current: currentPage, onChange: onChangePage, total: total }}
		/>
	)
}

export default ListAgency;