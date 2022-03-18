import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Table, Button, Checkbox, Modal } from "antd";
import { LeftOutlined, RightOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import { setLoanCode, setSignTime } from '../../../store/loans/action'
import '../../../styles/digitalSignature.scss';
import ContractView from './ContractView';
import OTPConfirm from "./OTPConfirm";
import http from "../../../apis/http";
import { history } from "../../../utils/history";
import { NotificationError, NotificationSuccess } from "../../../common/components/Notification";
const Sign = (props) => {
    const { data } = props
    const [step, updateStep] = useState(2);
    const [dataSource, setDataSource] = useState([])
    const [totalItem, setTotalItem] = useState(0);
    const [max, setCurrentMax] = useState(10);
    const [visibleModalDetail, setVisibleModalDetail] = useState(false);
    const [dataModal, setDataModal] = useState({});
    const [url, setUrl] = useState('');
    const [loan, setLoanCode] = useState('');
    const [currentPage, setCurrentPage] = useState(0);

    var size = window.innerWidth;
    const handleClickLoanCode = (value) => {
        props.setLoanCode(value);
    }
    const handleSecondTime = (value) => {
        props.setLoanCode(value);
        props.setSignTime('second');
    }
	const changePage = (page, pageSize) => {
		getLoanLosList('CONTRACT', page - 1)
	}
    const handlePreFile = () => {
		let temp = currentPage - 1;
        setCurrentPage(temp);
        viewContract(loan, temp)
        console.log("temp", temp)
	}
	const handleNextFile = () => {
		let temp = currentPage + 1;
        setCurrentPage(temp);
        console.log("temp", temp)
        viewContract(loan, temp)
	}
    const handleCancelModalDetail = () => {
		setVisibleModalDetail(false);
    }
    const handleViewAttach = (record) => {
		setVisibleModalDetail(true);
		setDataModal(record);
    }
    useEffect(()=>{
        console.log("new url is coming");
    }, [url])
    const viewContract = async (value, fileIndex) => {
		try {
            let url = ''
            setLoanCode(value)
            props.signTime === 'second' ?
            url = `web/agreements/sign-cloud-second-time/preview/sign?loan_code=${value}`
            : url = `web/agreements/sign-cloud-first-time/preview/sign?loan_code=${value}`
            const rs = await http.get(url)
			if(rs?.status === 200) {
                setVisibleModalDetail(true);
                setCurrentMax(rs?.data?.data?.files?.length)
                let new_url = rs?.data?.data?.files[fileIndex]?.url;
                // setUrl(new_url);
                setUrl(`https://docs.google.com/viewer?url=${new_url}&embedded=true`);
			} 
		}catch(ex){
            console.log("ex", ex)
			return NotificationError("", "Có lỗi xảy ra. Vui lòng thử lại");
		}
    }
    const getLoanLosList = async (tab, pageIndex) => {
			try {
                const rs = await http.get(`web/loan-los/loan-of-customer?tab=${tab ? tab : 'CONTRACT' }&pageIndex=${pageIndex}&pageSize=5`);
				if(rs?.status === 200) {
                    console.log('Set data on air', )
                    setDataSource(rs?.data?.data?.content)
                    setTotalItem(rs?.data?.data?.total_elements)
				} else {
					return NotificationError("", "Có lỗi xảy ra. Vui lòng thử lại");
                }
			}catch(ex){
			}
    }
    const viewDone = () => {
        updateStep(1);
        history.push('/loan-list');
    }
    const columns = [
        {
            title: 'Mã giao dịch',
            dataIndex: 'loan_code',
            key: 'loan_code',
            render: loan_code => {
                return (
                    <span>{loan_code}</span>
                )
            },
            width: size > 1440 ? 120 : 100
        },
        {
            title: 'Tên khách hàng',
            dataIndex: 'name',
            key: 'name',
            render: name => {
                return (
                    <span style={{ color: '#000000' }}>{name}</span>
                )
            }
        },
        {
            title: 'HĐ Tín dụng',
            dataIndex: 'status',
            key: 'status',
            render: (status, loan_code) => {
                return (
                    <div>
                    {(status === 'SIGNED_WAITING_SETUP' || status === 'SIGNED_SETUPED' || status === 'SIGNED_WAITING_DISBURSE') ? <Button onClick={() => viewContract(loan_code.loan_code, 0)} className="status-btn" style={{ backgroundColor: '#359e32', minWidth: 150, height: size > 1440 ? '35px' : '25px' }}>Xem</Button>
                        : status === 'APPROVED_LOAN' ? <Button onClick={() => handleClickLoanCode(loan_code)} style={{ backgroundColor: '#1d4994', minWidth: 150, height: size > 1440 ? '35px' : '25px' }} className="status-btn"><Link to='/contract-sign'>Ký hợp đồng</Link></Button>
                            : status === 'NOT_APPROVED_LOAN' ? <Button style={{ backgroundColor: '#808080', minWidth: 150, height: size > 1440 ? '35px' : '25px' }} className="status-btn">Ký hợp đồng</Button> : ''}
                       
                    </div>
                )
            }
        },
        {
            title: 'Khế ước nhận nợ',
            dataIndex: 'status',
            key: 'status',
            render: (status, loan_code) => {
                return (
                    <div>
                    {(status === 'SIGNED_SETUPED') ? <Button onClick={() => handleSecondTime(loan_code)} className="status-btn" style={{ backgroundColor: '#1d4994', minWidth: 150, height: size > 1440 ? '35px' : '25px' }}><Link to='/indenture-sign'>Ký hợp đồng</Link></Button>
                        : (status === 'APPROVED_LOAN' || status === 'SIGNED_WAITING_SETUP') ? <Button style={{ backgroundColor: '#808080', minWidth: 150, height: size > 1440 ? '35px' : '25px' }} className="status-btn">Ký hợp đồng</Button>
                            : status === 'SIGNED_WAITING_DISBURSE' ? <Button style={{ backgroundColor: '#359e32', minWidth: 150, height: size > 1440 ? '35px' : '25px' }} className="status-btn">Xem</Button> 
                            : status === 'NOT_APPROVED_LOAN' ? <Button style={{ backgroundColor: '#808080', minWidth: 150, height: size > 1440 ? '35px' : '25px' }} className="status-btn">Ký hợp đồng</Button> : ''}
                       
                    </div>
                )
            }
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: status => {
                return (
                    <div>
                    {status === 'APPROVED_LOAN' ? <Button className="status-btn" style={{ backgroundColor: '#F6BB3B', minWidth: 200, height: size > 1440 ? '35px' : '25px' }}>Đã phê duyệt</Button>
                        : status === 'NOT_APPROVED_LOAN' ? <Button style={{ backgroundColor: '#1890ff', minWidth: 200, height: size > 1440 ? '35px' : '25px' }} className="status-btn">Từ chối phê duyệt</Button>
                            : status === 'SIGNED_WAITING_SETUP' ? <Button style={{ backgroundColor: '#1890ff', minWidth: 200, height: size > 1440 ? '35px' : '25px'  }} className="status-btn">Đã ký hợp đồng lần 1</Button>
                                : status === 'SIGNED_SETUPED' ? <Button style={{ backgroundColor: '#1890ff', minWidth: 200, height: size > 1440 ? '35px' : '25px'  }} className="status-btn">Đã lắp đặt</Button> 
                                : status === 'SIGNED_WAITING_DISBURSE' ? <Button style={{ backgroundColor: '#1890ff', minWidth: 200, height: size > 1440 ? '35px' : '25px'  }} className="status-btn">Chờ giải ngân</Button> : ''}
                       
                    </div>
                )
            }
        },

    ]
	useEffect(() => {
		getLoanLosList('CONTRACT', 0);
    }, [data])
    return (
        <div className="loan-wrapper">
        <div className="l-loan-container">
                        <div className="step-by-step">
					<div className={step === 0 ? "l-register active-step" : "l-register"}>
						<div className="l-register-inner">
							<span>Đăng ký khoản vay</span>
							<CheckCircleOutlined />
						</div>
					</div>
					<div onClick={() => {viewDone()}} className={step === 1 ? "l-approval active-step" : "l-approval"}>
						<div className="l-approval-inner">
							<div className="inner2">
								<div>Phê duyệt</div>
							</div>
							<CheckCircleOutlined />
						</div>
					</div>
					<div className={step === 2 ? "l-sign active-step" : "l-sign"}>
						<div className="l-sign-inner">
							<div>Ký hợp đồng</div>
						</div>
						<CheckCircleOutlined />
					</div>
				</div>
            {/* <div className="loanlist-operate"> */}
            <h2 style={{ marginLeft: '5px'}}></h2>
                <Table scroll={true}
                    style={{ padding: '0px 20px 0px 20px' }}
                    className="attach-table"
                    dataSource={dataSource}
                    columns={columns}
                    rowKey="key"
                    pagination={{defaultPageSize: 5, total: totalItem, onChange: changePage}}
                    // pagination={{defaultPageSize: 40}}
                    // size={size > 1440 ? 'default' : 'small'} 
                    />          
            {/* </div> */}
        </div>
        <Modal
				className="modal-view-attachment"
				title="Chi tiết tệp đính kèm"
				visible={visibleModalDetail}
				onCancel={handleCancelModalDetail}
			>
				<h4>{dataModal?.files?.name}</h4>
				<div className="detail-content">
					<div className="left-btn">
						<Button disabled={currentPage === 0 ? true : false}><LeftOutlined onClick={handlePreFile} /></Button>
					</div>
					<div className="center-content">
						{
							<iframe src={url} frameBorder="0" scrolling="no" width="100%" height="100%"></iframe>
						}
							
					</div>
					<div className="right-btn">
						<Button disabled={currentPage === max-1 ? true : false}><RightOutlined onClick={handleNextFile} /></Button>
					</div>
				</div>
			</Modal>
        </div>
    )
}
function mapDispatchToProps(dispatch) {
    return {
        setLoanCode : payload => dispatch(setLoanCode(payload)),
        setSignTime : payload => dispatch(setSignTime(payload))

    }
}
const mapStateToProps = (state) => {
    return {
        loansData: state.loan.loansData,
        customer: state.authentication.customer,
        loanDetail: state.loan.loanDetail,
        loanCode: state.loan.loanCode,
        signTime: state.loan?.signTime
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(Sign);