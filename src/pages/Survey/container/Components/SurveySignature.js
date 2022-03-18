import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Button, DatePicker, Dropdown, Menu, Select, Space, Table, Tabs, Upload, Popover } from 'antd';
import { CloseOutlined, CheckCircleOutlined, MoreOutlined, CloseCircleOutlined, CheckOutlined, RightOutlined } from '@ant-design/icons';
import { Link, useLocation, useParams, useRouteMatch } from "react-router-dom";
import '../../../../styles/digitalSignature.scss';
import { signCloudFirstTime, getLoans } from '../../../../store/loans/action';

const SurveySignature = (props) => {
	const [dataSource, setDataSource] = useState([]);
	let { search } = useLocation();
	var size = window.innerWidth;
	useEffect(() => {
        if (props.loansData) {
            setDataSource(props.loansData?.content)
        }
    }, [props.loansData])
    const columns = [
        {
			title: 'Mã giao dịch',
			dataIndex: 'code',
			key: 'code',
			render: (code) => (
				<a>{code}</a>
			),
			width: size > 1440 ? 120 : 100
		},
		{
			title: 'Tên khách hàng',
			dataIndex: 'customer',
			key: 'customer',
			render: (customer) => (
				<span>{customer.personal_information.name}</span>
			),
		},
		{
			title: 'Số điên thoại',
			dataIndex: 'customer',
			key: 'phone_number',
			render: (customer) => (
				<span>{customer.personal_information.phone_number}</span>
			),
			width: size > 1440 ? 120 : 100
		},
		{
			title: 'Địa chỉ lắp đặt',
			dataIndex: 'installation_address',
			key: 'installation_address',
			render: (installation_address) => {
				return (
					<span>{installation_address}</span>

				)
			}
		},
		{
			title: 'Đại lý',
			dataIndex: 'agency',
			key: 'agency',
			width: 180,
			visible: props.index != 1 ? true : false,
			render: (data, record, index) => {
				return (
				<>
				<Select className="status-btn" style={{ minWidth: 120, height: size > 1440 ? '35px' : '25px' ,backgroundColor: '#D2D6DC', color: '#000000' }} bordered={false} >
					{
						data && data.map((item) => {
							return (
								<Option value={item.id}>{item.name}</Option>
							)
						})
					}
				</Select>
				<CheckOutlined style={{color: "#4DB769", marginLeft: '5px'}} />
				</>
				)
			}
		},
		{
			title: 'Nhân viên',
			dataIndex: 'staff',
			key: 'staff',
			width: 180,
			render: (data) => (
				<>
				<Select className="status-btn" style={{ minWidth: 120, height: size > 1440 ? '35px' : '25px' ,backgroundColor: '#D2D6DC', color: '#000000' }} bordered={false} >
					{
						data && data.map((item) => {
							return (
								<Option value={item.id}>{item.name}</Option>
							)
						})
					}
				</Select>
				<CheckOutlined style={{color: "#4DB769", marginLeft: '5px'}} />
				</>
			),
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			width: 80,
            render: status => {
                return (
                    <div>
                    {status === 1 ? <Button className="status-btn" style={{ backgroundColor: '#1890ff', minWidth: 120, height: size > 1440 ? '35px' : '25px' }}>Đã khảo sát</Button>
                        : status === 2 ? <Button style={{ backgroundColor: '#1890ff', minWidth: 120, height: size > 1440 ? '35px' : '25px' }} className="status-btn">Đang xử lý</Button>
                            : status === 3 ? <Button style={{ backgroundColor: '#1890ff', minWidth: 120, height: size > 1440 ? '35px' : '25px'  }} className="status-btn">Đã nghiệm thu</Button>
                                : ''}
                       
                    </div>
                )
            }
		},
		{
			title: '',
			dataIndex: 'action1',
			key: 'action1',
			width: 80,
            render: status => {
                return (
                    <div>
                    <Button className="status-btn" style={{ backgroundColor: '#1890ff', minWidth: 120, height: size > 1440 ? '35px' : '25px', cursor: 'pointer' }}>View hợp đồng lắp đặt</Button>
                    </div>
                )
            }
		},
		{
			title: '',
			dataIndex: 'action2',
			key: 'action2',
			width: 80,
            render: status => {
                return (
                    <div>
                    <Button className="status-btn" style={{ backgroundColor: '#1890ff', minWidth: 120, height: size > 1440 ? '35px' : '25px', cursor: 'pointer' }}>View hợp đồng nghiệm thu</Button>
                    </div>
                )
            }
		},
    ]
    return (
        <div style={{ marginBottom: '-20px', marginTop: '-10px', maxWidth: size > 1440 ? '100%' : '1440px' }} className="digital-signature operate-signature">
            <div className="loanlist-operate">
            <h2 style={{ marginLeft: '5px'}}>Danh sách đơn hàng</h2>
                <Table scroll={scroll}
                    style={{ marginTop: '-10px' }}
                    className="attach-table"
                    dataSource={dataSource}
					columns={props.index != 1 ? columns.filter(col => (col.dataIndex !== 'action1' && col.dataIndex !== 'action2')) 
							: columns.filter(col => (col.dataIndex !== 'staff' && col.dataIndex !== 'agency'))}
                    rowKey="id"
                    pagination={{defaultPageSize: 5}}
                    size={size > 1440 ? 'default' : 'small'} />
            </div>

        </div>
    )
}
function mapDispatchToProps(dispatch) {
    return {
		signCloudFirstTime: (id) => dispatch(signCloudFirstTime(id)),
    }
}
const mapStateToProps = (state) => {
    return {
        loansData: state.loan.loansData,
        customer: state.authentication.customer,
        loanDetail: state.loan.loanDetail,
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(SurveySignature);