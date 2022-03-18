import React, { useEffect, useState } from "react";
import http from "../../../../apis/http";
import DeviceDetail from "./DeviceDetail";
import ListPrice from "./ListPrice";
import { NotificationError, NotificationSuccess } from "../../../../common/components/Notification";

const Equipment = () => {
	const [equipment, setEquipment] = useState({})
	const [providers, setProviders] = useState([])
	const [dataSource, setDataSource] = useState([])
	const [currentIndexEdit, setCurrentIndexEdit] = useState(null)
	const [totalItem, setTotalItem] = useState(0)
	useEffect(() => {
		fetchDataSource();
		fetchProviders();
	}, [])

	const updateDataSource = (data, isAdd) => {
		let _data = [...dataSource];
		if (isAdd) {
			_data = [...dataSource, data]
			NotificationSuccess("", "Thêm mới thành công")

		} else {
			_data[currentIndexEdit] = data;
			NotificationSuccess("", "Cập nhật thành công")
		}
		setDataSource(_data)
	}
	const fetchDataSource = async (params) => {
		try {
			const _rs = await http.get(`web/quotation/equipment`, {
				params: params ? params : { pageIndex: 0, pageSize: 5 }
			});
			if (_rs.data?.data?.content) {
				setDataSource(_rs.data?.data?.content)
				setTotalItem(_rs?.data?.data?.total_elements)
			} else {
				setDataSource([])
				setTotalItem(0)
			}
		} catch (ex) { }
	}

	const fetchProviders = async () => {
		try {
			const rs = await http.get('web/providers');
			setProviders(rs?.data?.data?.content)
		} catch (ex) {
		}
	}
	return (
		<>
			<div style={{ marginTop: 10, marginLeft: 20, marginRight: 20 }}>
				<h2>Danh sách giá chi tiết</h2>
				<ListPrice totalItem={totalItem} fetchDataSource={fetchDataSource} setCurrentIndexEdit={setCurrentIndexEdit} dataSource={dataSource} providers={providers} setEquipment={setEquipment} />
			</div>
			<div style={{ marginTop: 20 }} className="content-step clear-input-border">
				<DeviceDetail updateDataSource={updateDataSource} equipment={equipment} setEquipment={setEquipment} providers={providers} />
			</div>
		</>
	)
}

export default Equipment;