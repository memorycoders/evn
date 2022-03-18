import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Table, Button } from "antd";
import { ArrowRightOutlined } from '@ant-design/icons';
import { Link, useLocation, useParams, useRouteMatch } from "react-router-dom";
import '../../../styles/digitalSignature.scss';
import { signCloudFirstTime, getLoans } from '../../../store/loans/action';
import { assignOrder, getAgents, getLoanLos } from "../../../store/common/action";
import { NotificationError, NotificationSuccess } from "../../../common/components/Notification";

import http from "../../../apis/http";

const DigitalSignature = (props) => {
    const { setLoanCalendar, getAgents } = props;
	const [dataSource, setDataSource] = useState([]);
    let { search } = useLocation();
    var size = window.innerWidth;
    const getLoanLosList = async () => {
		try {
			const rs = await http.get('web/loan-los');
			if(rs?.status === 200) {
				setDataSource(rs?.data?.data?.content)
			} else {
				return NotificationError("", "Có lỗi xảy ra. Vui lòng thử lại");
			}
		}catch(ex){
		}
	}
	useEffect(() => {
        getLoanLosList();
        getAgents();
	}, [])
    const fetchDataByLoanCode = async (data) => {
		try {
			// let loanCode = dataSource[index].loan_code
			const rs = await http.get('web/loans/' + data +'/operator');
            if(rs?.status === 200) {
                setLoanCalendar(rs?.data?.data)
                } else {
                    return NotificationError("", "Có lỗi xảy ra. Vui lòng thử lại");
                }
		}catch(ex){
		}
	}
    const columns = [
        {
            title: 'Mã giao dịch',
            dataIndex: 'loan_code',
            key: 'loan_code',
            render: loan_code => {
                return (
                    <a onClick={() => fetchDataByLoanCode(loan_code)}>{loan_code}</a>
                )
            },
        },
		{
			title: 'Tên khách hàng',
			dataIndex: 'name',
			key: 'name',
			render: (name) => (
				<span>{name}</span>
			),
		},
		{
			title: 'Số điên thoại',
			dataIndex: 'contact_phone',
			key: 'contact_phone',
			render: (contact_phone) => (
				<span>{contact_phone}</span>
			),
			// width: size > 1440 ? 120 : 100
		},
		{
			title: 'Địa chỉ',
			dataIndex: 'installation_address',
			key: 'installation_address',
			render: (installation_address) => {
				return (
					<span>{installation_address}</span>

				)
			}
		},
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 80,
            render: status => {
                return (
                    <div>
                    {status === 1 ? <Button className="status-btn" style={{ backgroundColor: '#F6BB3B', minWidth: 150, height: size > 1440 ? '35px' : '25px' }}>Đã tiếp nhận</Button>
                        : status === 2 ? <Button style={{ backgroundColor: '#1D4994', minWidth: 150, height: size > 1440 ? '35px' : '25px' }} className="status-btn">Đang xử lý</Button>
                            : status === 3 ? <Button style={{ backgroundColor: '#FF5733', minWidth: 150, height: size > 1440 ? '35px' : '25px'  }} className="status-btn">Chuyển nhà thầu</Button>
                                : ''}
                       
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
                    columns={columns}
                    rowKey="id"
                    pagination={{defaultPageSize: 5}}
                    // size={size > 1440 ? 'default' : 'small'} 
                    />
            </div>

        </div>
    )
}
function mapDispatchToProps(dispatch) {
    return {
        signCloudFirstTime: (id) => dispatch(signCloudFirstTime(id)),
        getAgents: () => dispatch(getAgents()),
    }
}
const mapStateToProps = (state) => {
    return {
        loansData: state.loan.loansData,
        customer: state.authentication.customer,
        loanDetail: state.loan.loanDetail,
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(DigitalSignature);