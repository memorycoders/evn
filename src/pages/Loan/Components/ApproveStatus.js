import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Table, Button } from "antd";
import { } from '@ant-design/icons';

import '../../../styles/approveStatus.scss'

const ApproveStatus = (props) => {
    const [dataSource, setDataSource] = useState([])
    const columns = [
        {
            title: 'Mã giao dịch',
            dataIndex: 'code',
        },
        {
            title: 'Khách hàng',
            dataIndex: 'name',
        },
        {
            title: 'Số tiền (VNĐ)',
            dataIndex: 'loan_amount',
            render: loan_amount => <div style={{ textAlign: 'center' }}>{loan_amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: status => {
                return (
                    <div>
                        {status === 1 ? <Button className="status-btn" style={{ backgroundColor: '#F6BB3B' }}>Đã tiếp nhận đơn vay</Button>
                        : status === 2 ? <Button style={{ backgroundColor: '#1D4994' }} className="status-btn">Đang xử lý</Button>
                            : status === 3 ? <Button style={{ backgroundColor: '#FF5733' }} className="status-btn">Chuyển nhà thầu</Button>
                                : status === 4 ? <Button style={{ backgroundColor: '#33BAFF' }} className="status-btn">Đang khảo sát</Button>
                                    : status === 5 ? <Button style={{ backgroundColor: '#359E32' }} className="status-btn">Đã khảo sát</Button>
                                        : status === 6 ? <Button style={{ backgroundColor: '#2A70D1' }} className="status-btn">Đang phê duyệt</Button>
                                            : status === 7 ? <Button style={{ backgroundColor: '#B42E2E' }} className="status-btn">Từ chối</Button>
                                                : status === 8 ? <Button style={{ backgroundColor: '#4DB769' }} className="status-btn">Đã phê duyệt</Button>
                                                    : status === 9 ? <Button style={{ backgroundColor: '#302AD1' }} className="status-btn">Đang lắp đặt</Button>
                                                        : status === 10 ? <Button style={{ backgroundColor: '#DB8297' }} className="status-btn">Nghiệm thu</Button>
                                                            : <Button style={{ backgroundColor: '#27A29D' }} className="status-btn">Đã ký hợp đồng</Button>}
                    </div>
                )
            }
        },

    ]

    useEffect(() => {
        if (props.loansData?.content?.length > 0) {
            let data = props.loansData.content.map(item => {
                return {
                    ...item,
                    name: props.customer.personal_information.name
                }
            })
            setDataSource(data)
        }
    }, [props.loansData])

    return (
        <div className="approve-status">
            <h2>Các đơn hàng</h2>
            <div className="loanlist">
                <Table scroll={scroll}
                className="attach-table"
                dataSource={dataSource}
                columns={columns}
                rowKey="id" />
            </div>
            
        </div>
    )
}
function mapDispatchToProps(dispatch) {

}
const mapStateToProps = (state) => {
    return {
        loansData: state.loan.loansData,
        customer: state.authentication.customer,
    }
};
export default connect(mapStateToProps, null)(ApproveStatus);