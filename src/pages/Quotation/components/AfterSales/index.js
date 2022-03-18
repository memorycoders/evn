import React, { useEffect, useState } from "react";
import http from "../../../../apis/http";
import Detail from "./Detail";
import TableAfterSales from "./Table";

const AfterSales = ({step, TABS}) => {
    const [dataSource, setDataSource] = useState([])
    const [afterSaleItem, setAfterSaleItem] = useState({})
    const [currentIndexEdit, setCurrentIndexEdit] = useState(null);
    const [totalItem, setTotalItem] = useState(0)
    const fetchDataAfterSales = async (params) => {
        try{
            const _rs = await http.get(`web/quotation/afterSales`, {
				params: params ? params: {pageIndex:0, pageSize:5}
			});
            if(_rs.data?.data?.content) {
                setDataSource(_rs.data?.data?.content)
                setTotalItem(_rs?.data?.data?.total_elements)
            } else {
                setDataSource([])
                setTotalItem(0)
            }
        }catch(ex) {}
    }
    const updateDataSource = (data, isAdd) => {
		let _data = [...dataSource];
		if(isAdd) {
			_data = [...dataSource, data]
		} else {
			_data[currentIndexEdit] = data;
		}
		setDataSource(_data)
	}

    useEffect(() => {
        if(step === TABS.AFTER_SALE)
        fetchDataAfterSales()
    }, [step])
    return (
        <div style={{margin: 20}} className="clear-input-border">
			<h2>Danh mục hậu mãi</h2>
            <TableAfterSales fetchDataAfterSales={fetchDataAfterSales} totalItem={totalItem} dataSource={dataSource} setAfterSaleItem={setAfterSaleItem} setCurrentIndexEdit={setCurrentIndexEdit}/>
            <Detail afterSaleItem={afterSaleItem} setAfterSaleItem={setAfterSaleItem} updateDataSource={updateDataSource}/>
        </div>
    )
}

export default AfterSales;