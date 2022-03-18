import React, { useEffect, useState } from "react";
import { Input, Form, Row, Col, Table, Button, DatePicker } from 'antd';
const { RangePicker } = DatePicker;
import CompanyInfo from '../components/CompanyInfo'
import ContractInfo from "../components/ContractInfo";
import { connect } from "react-redux";
import { NotificationError, NotificationSuccess } from '../../../common/components/Notification'
import http from "../../../apis/http";
import moment from "moment"
const AccountBank = (props) => {
    const [form] = Form.useForm();
    const [step, updateStep] = useState('tranfer');
    const [id, setId] = useState('');
    const [transfer, setTransfer] = useState([]);
    const handleChangeTab = (tab) => {
        updateStep(tab)
    }
    const onFinish = async (values) => {
        try {

            let endDate = values?.dateTime?.[1].valueOf();
            let startDate = values?.dateTime?.[0].valueOf();
            const rs = await http.get(`web/transaction/deposits/${id}?start_time=${startDate ? startDate : ''}&end_time=${endDate ? endDate : ''}`);
            if (rs?.status === 200) {
                console.log('rs', rs)
                setTransfer(rs?.data?.data?.data)
            } else {
                return NotificationError("", "Có lỗi xảy ra. Vui lòng thử lại");
            }
        } catch (ex) {
            return NotificationError("", "Có lỗi xảy ra. Vui lòng thử lại");
        }
    }
    const columns = [
        {
            title: 'Ngày giao dịch',
            dataIndex: 'transactionDate',
            key: 'transactionDate',
            render: transactionDate => {
                return (
                    <div>{moment(transactionDate).format('DD/MM/YYYY')}</div>
                )
            }
        },
        {
            title: 'Mã giao dịch',
            dataIndex: 'transactionCode',
            key: 'transactionCode',
            render: transactionCode => {
                return (
                    <div>{transactionCode}</div>
                )
            }
        },
        {
            title: 'Số tiền',
            dataIndex: 'transactionAmount',
            key: 'transactionAmount',
            render: transactionAmount => {
                return (
                    <div>{transactionAmount} VNĐ</div>
                )
            }
        },
        {
            title: 'Nội dung giao dịch',
            dataIndex: 'description',
            key: 'description',
            render: description => {
                return (
                    <div>{description}</div>
                )
            }
        },
    ];

    // console.log(" user",props.user.personal_information.card_number);

    return (
        <>
            <h3 style={{ color: '#0096D7' }}>Danh sách tài khoản {'>'} Tài khoản Tiền gửi </h3>
            <div style={{ marginBottom: 20 }}>
                <div style={{ margin: 20, padding: '0px 20px', backgroundColor: '#1d4994' }} className="content-step clear-input-border">
                    <CompanyInfo />
                </div>
                <div style={{ marginTop: 0, padding: '0px 20px', width: '100%', }} className="content-step clear-input-border">
                    <ContractInfo user={props.user?.personal_information?.card_number} setId={setId} setTransfer={setTransfer} />
                </div>
            </div>
            <div style={{ display: 'flex', marginLeft: 20 }} className="loanlist-operate">
                <div className="l-calendar-button">
                    <Button onClick={() => handleChangeTab('tranfer')} className={step === 'tranfer' ? "status-btn-active" : "status-btn-default"}>
                        <span className="l-calendar-name">Tra cứu lịch sử giao dịch</span>
                    </Button>
                </div>
                <div style={{ marginLeft: 'auto', marginRight: '20px' }} className={step === 'tranfer' ? 'show' : 'hidden'}>
                    <Form style={{ display: 'flex' }} onFinish={onFinish}>
                        <Form.Item name='dateTime'>
                            <RangePicker placeholder={['Từ ngày', 'Đến ngày']} format='DD/MM/YYYY' style={{ marginRight: '20px' }} />
                        </Form.Item>
                        <Button type="primary" htmlType="submit" className='status-btn' style={{ backgroundColor: '#0096D7' }}>
                            <span className="l-calendar-name">Tra cứu</span>
                        </Button>
                    </Form>
                </div>
            </div>
            <div className="loanlist-operate">
                <Table style={{ marginTop: 20, padding: '0px 20px' }}
                    scroll={{ x: 1300 }}
                    className="attach-table"
                    dataSource={transfer}
                    columns={columns}
                    rowKey="key"
                    pagination={false} />
            </div>
        </>
    )
}
const mapStateToProps = (state) => {
    return {
        user: state?.authentication,
    };
};
export default connect(mapStateToProps)(AccountBank);