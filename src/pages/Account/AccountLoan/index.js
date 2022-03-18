import React, { useEffect, useState } from "react";
import { Form, Row, Col, Table, Button, DatePicker } from 'antd';
const { RangePicker } = DatePicker;
import CustomerInfo from '../components/CustomerInfo'
import ProductInfo from "../components/ProductInfo";
import { connect } from "react-redux";
import moment from "moment";
import http from "../../../apis/http";
import { NotificationError, NotificationSuccess } from '../../../common/components/Notification'

const AccountLoan = (props) => {
    const [form] = Form.useForm();
    const [id, setId] = useState('');
    const [transfer, setTransfer] = useState([]);
    const [step, updateStep] = useState('tranfer');
    const [dataSource_payment, setDataSource_payment] = useState([]);
    const fetchPaymentCalendar = async () => {
        try {
			const rs = await http.get(`web/loan_info/${id}/reppayment`);
			if(rs?.status === 200) {
				console.log('rs', rs)
				setDataSource_payment(rs?.data?.data?.data)
			} else {
				return NotificationError("", "Có lỗi xảy ra. Vui lòng thử lại");
			}
		}catch(ex){
            return NotificationError("", "Có lỗi xảy ra. Vui lòng thử lại");
        }
    }
    const handleChangeTab = (tab) => {
        updateStep(tab)
        fetchPaymentCalendar()
    }
    const onFinish = async (values) => {
        try {
            let endDate = values?.dateTime?.[1].valueOf();
            let startDate = values?.dateTime?.[0].valueOf();
			const rs = await http.get(`web/transaction/${id}?start_time=${startDate ? startDate : ''}&end_time=${endDate ? endDate : ''}`);
			if(rs?.status === 200) {
				console.log('rs', rs)
				setTransfer(rs?.data?.data?.data)
			} else {
				return NotificationError("", "Có lỗi xảy ra. Vui lòng thử lại");
			}
		}catch(ex){
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
    const columns_payment = [
        {
            title: 'Kỳ trả nợ',
            children: [
                {
                  title: "Ngày",
                  dataIndex: "repaymentDate",
                  key: "repaymentDate",
                  render: repaymentDate => {
                    return (
                        <div>{moment(repaymentDate).format('DD/MM/YYYY')}</div>
                    )
                }
                },
                {
                  title: "Kỳ",
                  dataIndex: "repaymentTerm",
                  key: "repaymentTerm",
                  render: repaymentTerm => {
                    return (
                        <div>{repaymentTerm}</div>
                    )
                }
                }
              ]
        }, 
        {
            title: 'Số gốc còn lại',
            dataIndex: 'originalRemaining',
            key: 'originalRemaining',
            render: originalRemaining => {
                return (
                    <div>{originalRemaining} VNĐ</div>
                )
            }
        }, 
        {
            title: 'Gốc',
            dataIndex: 'originalAmount',
            key: 'originalAmount',
            render: originalAmount => {
                return (
                    <div>{originalAmount} VNĐ</div>
                )
            }
        }, 
        {
            title: 'Lãi',
            dataIndex: 'interestAmount',
            key: 'interestAmount',
            render: interestAmount => {
                return (
                    <div>{interestAmount} VNĐ</div>
                )
            }
        },  
        {
            title: 'Gốc + Lãi',
            dataIndex: 'originalInterest',
            key: 'originalInterest',
            render: (originalInterest, record) => {
                return (
                    // <div>{a?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VNĐ</div>
                    <div>{originalInterest} VNĐ</div>
                )
            }
        },
];

    return (
        <>
        <h3 style={{ color: '#0096D7'}}>Danh sách tài khoản {'>'} Tài khoản vay </h3>
        <div style={{  marginBottom: 20}}>
        <div style={{ margin: 20, padding: '0px 20px', backgroundColor: '#1d4994'}} className="content-step clear-input-border">
            <CustomerInfo/>
        </div>
        <div style={{ marginTop: 0, padding: '0px 20px', width: '100%', }} className="content-step clear-input-border">
            <ProductInfo user={props.user?.personal_information?.card_number} setId={setId} setTransfer={setTransfer}/>
        </div>
        </div>
        <div style={{ display: 'flex', marginLeft: 20 }} className="loanlist-operate">
            <div className="l-calendar-button">
				<Button onClick={() => handleChangeTab('tranfer')} className={step === 'tranfer' ? "status-btn-active" : "status-btn-default"}>
					<span className="l-calendar-name">Tra cứu lịch sử giao dịch</span>
				</Button>
			</div>
			<div className="l-calendar-button calendar-last">
				<Button onClick={() => handleChangeTab('payment')} className={step === 'payment' ? "status-btn-active" : "status-btn-default"}>
					<span className="l-calendar-name">Xem lịch trả nợ</span>
				</Button>
			</div>
            <div style={{ marginLeft: 'auto', marginRight: '20px'}} className={step === 'tranfer' ? 'show' : 'hidden'}>
                <Form style={{ display: 'flex' }} onFinish={onFinish}>
                    <Form.Item  name='dateTime'>
                        <RangePicker placeholder={['Từ ngày', 'Đến ngày']} format='DD/MM/YYYY' style={{ marginRight: '20px' }}/>
                    </Form.Item>
                    <Button type="primary" htmlType="submit" className='status-btn' style={{ backgroundColor: '#0096D7' }}>
                        <span className="l-calendar-name">Tra cứu</span>
                    </Button>
                </Form>
            </div>					
        </div>
        <div className="loanlist-operate">
         { step === 'tranfer' ? <>
                <Table style={{ marginTop: 20, padding: '0px 20px' }}
                    scroll={{ x: 1300 }}
                    className="attach-table"
                    dataSource={transfer}
                    columns={columns}
                    rowKey="key"
                    pagination={false}/>  </>
            :   <Table style={{ marginTop: 20, padding: '0px 20px' }}
                    scroll={{ x: 1300 }}
                    className="attach-table"
                    dataSource={dataSource_payment}
                    columns={columns_payment}
                    rowKey="key"
                    pagination={false}/>
        }     
         </div>
        </>
    )
}

const mapStateToProps = (state) => {
    return {
      user: state?.authentication,
    };
  };
  export default connect(mapStateToProps)(AccountLoan);