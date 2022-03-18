import { Col, Input, Row, Select, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import http from '../../../../apis/http';
import { CUSTOMER_TYPES, STATUS_AFTER_SALES } from '../../../../utils/constants';
const TableAfterSales = ({fetchDataAfterSales, totalItem, setAfterSaleItem, dataSource, setCurrentIndexEdit}) => {
	const [filterValue, setFilterValue] = useState({
		key: null,
		value: ''
	})
	const [quotations, setQuotations] = useState([])
	const handleClickId = (index) => {
		if(dataSource[index]) {
			setCurrentIndexEdit(index);
			setAfterSaleItem(dataSource[index])
		}
	}
	const fetchQuotation = async () => {
		try {
			const rs = await http.get('/web/quotation?type=afterSales')
			setQuotations(rs?.data?.data?.data)
		}catch(ex){}
	}

	const handleSearch = () => {
		fetchDataAfterSales({...filterValue, pageIndex:0, pageSize:5})
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
		fetchDataAfterSales({
			...filterValue,
			pageIndex: page -1,
			pageSize: 5
		})
	}

	useEffect(() => {
		fetchQuotation()
	}, [])

	const columns = [
		{
			title: 'STT',
			dataIndex: 'id',
			key: 'id',
			render: (value, _, index) => {
				return <a onClick={() => {handleClickId(index)}}>{value}</a>
			}
 		},
		{
			title: 'Hậu mãi',
			dataIndex: 'packagePriceDTO',
			key: 'packagePriceDTO',
			render: (value) => (
				value?.packageName ? value?.packageName : ""
			)
		},
		{
			title: 'Đối tượng KH',
			dataIndex: 'packagePriceDTO',
			key: 'packagePriceDTO',
			render: (value) => (
			   CUSTOMER_TYPES[value?.customerType] ? CUSTOMER_TYPES[value?.customerType].name : ""
			)
		},
		{
			title: 'Giá',
			dataIndex: 'price',
			key: 'price',
		},
		{
			title: 'Tỉ lệ chiết khấu(%)',
			dataIndex: 'discount',
			key: 'discount',
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

	
	return (
		<>
		<div className="quo_search">

			<Row>
				<Col span="12"></Col>
				<Col span="5">
					<Select placeholder="Vui lòng chọn" style={{ width: "100%" }} value={filterValue?.key} onChange={handleFilterField}>
						{quotations?.map((item) => (
							<Select.Option value={item.key}>{item.value}</Select.Option>
						))}
					</Select>
				</Col>
				<Col span="7"><Input.Search placeholder="Tìm kiếm"  defaultValue="" value={filterValue?.value} onChange={handleFilterValue} onSearch={handleSearch} /></Col>
			</Row>
			
		</div>
		<Table dataSource={dataSource} columns={columns} pagination={{defaultPageSize: 5, total: totalItem, onChange: changePage}}/>
		</>
	)
}

export default TableAfterSales;