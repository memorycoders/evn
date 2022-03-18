import { Col, Input, Row, Select, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import http from '../../../../apis/http';
import { CALCULATION_UNIT, STATUS_AFTER_SALES } from '../../../../utils/constants';
const ListPrice = ({ fetchDataSource, setEquipment, dataSource, setCurrentIndexEdit, totalItem }) => {
	const [filterValue, setFilterValue] = useState({
		key: null,
		value: ''
	})
	const [quotations, setQuotations] = useState([])
	const handleClickId = (index) => {
		if (dataSource[index]) {
			setCurrentIndexEdit(index);
			setEquipment(dataSource[index])
		}
	}
	const fetchQuotation = async () => {
		try {
			const rs = await http.get('/web/quotation?type=equipment')
			setQuotations(rs?.data?.data?.data)
		} catch (ex) { }
	}
	useEffect(() => {
		fetchQuotation()
	}, [])

	const columns = [
		{
			title: 'Mã ĐG',
			dataIndex: 'id',
			key: 'id',
			render: (value, _, index) => {
				return <a onClick={() => { handleClickId(index) }}>{value}</a>
			}
		},
		{
			title: 'Thiết bị',
			dataIndex: 'equipmentName',
			key: 'equipmentName',
		},
		{
			title: 'Nhà SX',
			dataIndex: 'manufacturer',
			key: 'manufacturer',
		},
		{
			title: 'Nhà cung cấp',
			dataIndex: 'provider',
			key: 'provider',
			render: (value) => (
				value?.providerName ? value?.providerName : ""
			)
		},
		{
			title: 'Quy cách',
			dataIndex: 'regulations',
			key: 'regulations',
		},
		{
			title: 'DVT',
			dataIndex: 'calculationUnit',
			key: 'calculationUnit',
			render: (value) => (
				CALCULATION_UNIT[value] ? CALCULATION_UNIT[value].name : ''
			)
		},
		{
			title: 'Đơn giá',
			dataIndex: 'price',
			key: 'price',
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			render: (value) => (
				STATUS_AFTER_SALES[value] ? STATUS_AFTER_SALES[value].name : ""
			)
		}
	];


	const handleSearch = () => {
		fetchDataSource({ ...filterValue, pageIndex: 0, pageSize: 5 })
	}

	const handleFilterField = (value) => {
		setFilterValue({
			...filterValue,
			key: value
		})
	}

	const handleFilterValue = (_) => {
		setFilterValue({
			...filterValue,
			value: _.target.value
		})
	}

	const changePage = (page) => {
		fetchDataSource({
			...filterValue,
			pageIndex: page - 1,
			pageSize: 5
		})
	}


	return (
		<>
			<div className="quo_search" >
				<Row>
					<Col span="12"></Col>
					<Col span="5">
						<Select placeholder="Nhà cung cấp" style={{ width: "100%" }} value={filterValue?.key} onChange={handleFilterField}>
							{quotations?.map((item) => (
								<Select.Option value={item.key}>{item.value}</Select.Option>
							))}
						</Select>
					</Col>
					<Col span="7"><Input.Search placeholder="Tìm kiếm" defaultValue="" value={filterValue?.value} onChange={handleFilterValue} onSearch={handleSearch} /></Col>
				</Row>

			</div>
			
			<Table dataSource={dataSource} columns={columns}
				pagination={{ defaultPageSize: 5, total: totalItem, onChange: changePage }} />
		</>
	)
}

export default ListPrice;