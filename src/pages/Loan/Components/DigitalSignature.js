import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Table, Button } from "antd";
import { ArrowRightOutlined } from '@ant-design/icons';

import '../../../styles/digitalSignature.scss';
import { signCloudFirstTime } from '../../../store/loans/action';

const DigitalSignature = (props) => {
    const [dataSource, setDataSource] = useState([]);
    const [isCreateAgreement, setCreateAgreement] = useState(false);
    const [isDebtContract, setDebContract] = useState(false)
    const columns = [
        {
            title: 'Mã giao dịch',
            dataIndex: 'code',
            render: code => {
                return (
                    <span style={{ color: '#1D4994' }}>{code}</span>
                )
            }
        },
        {
            title: 'Khách hàng',
            dataIndex: 'name',
        },
        {
            title: 'Hợp đồng tín dụng',
            dataIndex: 'status',
            render: (status, record) => <div className="sign-btn">
                <Button className={status === 8 ? (isCreateAgreement ? "done-btn" : "active-btn")
                    : (status === 11 || status === 10 || status === 9) ? "done-btn"
                        : ""
                } onClick={status === 8 && !isCreateAgreement ? () => handleSign(record) : handleViewContract}>{status === 8 ? (isCreateAgreement ? "Xem" : "Ký hợp đồng")
                    : (status === 11 || status === 10 || status === 9) ? "Xem"
                        : "Ký hợp đồng"} <ArrowRightOutlined /></Button>
            </div>
        },
        {
            title: 'Khế ước nhận nợ',
            dataIndex: 'status',
            render: status => <div className="sign-btn">
                <Button className={status === 8 ? ""
                    : status === 10 ? (isDebtContract ? "done-btn" : "active-btn")
                        : status === 11 ? "done-btn" : ""
                }>Ký hợp đồng <ArrowRightOutlined /></Button>
            </div>
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: status => {
                return (
                    <div>
                        {status === 8 ? <Button style={{ backgroundColor: '#4DB769' }} className="status-btn">Đã phê duyệt</Button>
                            : status === 9 ? <Button style={{ backgroundColor: '#302AD1' }} className="status-btn">Đang lắp đặt</Button>
                                : status === 10 ? <Button style={{ backgroundColor: '#DB8297' }} className="status-btn">Nghiệm thu</Button>
                                    : <Button style={{ backgroundColor: '#27A29D' }} className="status-btn">Đã ký hợp đồng</Button>}
                    </div>
                )
            }
        },

    ]

    const handleSign = (record) => {
        props.signCloudFirstTime(record.id)
    }

    const handleViewContract = () => {

    }

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

    useEffect(() => {
        if (props.loanDetail?.attachment_files?.length > 0) {
            props.loanDetail.attachment_files.forEach(item => {
                if (item.label === 13) {
                    setCreateAgreement(true)
                }
                if (item.label === 14) {
                    setDebContract(true)
                }
            });
        }
    }, [props.loanDetail])

    return (
        <div className="digital-signature">
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
export default connect(mapStateToProps, mapDispatchToProps)(DigitalSignature);