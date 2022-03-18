import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Table, Button, Checkbox, Modal, Popconfirm } from "antd";
import { ArrowLeftOutlined, CheckCircleOutlined, RightOutlined, LeftOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import success from '../../../asset/images/success.png';
import { NotificationError, NotificationSuccess } from "../../../common/components/Notification";
import http from "../../../apis/http";

import '../../../styles/digitalSignature.scss';
const SuccessSign = (props) => {
    const { loanCode } = props;
    const [screen, changeScreen] = useState('thanh_cong');
    const [step, updateStep] = useState(2);
    const [dataModal, setDataModal] = useState({});
    const [currentPage, setCurrentPage] = useState(0);
    const [currentFile, setCurrentFile] = useState({});
    const [url, setUrl] = useState('');
    const [fileName, setFileName] = useState('');
    const [listData, setData] = useState([]);
    const [visibleModalDetail, setVisibleModalDetail] = useState(false);
    const [max, setCurrentMax] = useState(10);
    var size = window.innerWidth;
    const handleViewAttach = (record) => {
		setVisibleModalDetail(true);
		setDataModal(record);
    }
    const handleCancelModalDetail = () => {
		setVisibleModalDetail(false);
    }
    const handlePreFile = () => {
		let temp = currentPage - 1;
        setCurrentPage(temp);
        viewContract(loanCode?.loan_code, temp)
        console.log("temp", temp)
	}

	const handleNextFile = () => {
		let temp = currentPage + 1;
        setCurrentPage(temp);
        console.log("temp", temp)
        viewContract(loanCode?.loan_code, temp)
	}
    useEffect(()=>{
        console.log("new url is coming");
    }, [url])
    const viewContract = async (value, fileIndex) => {
		try {
            let url = ''
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
    const columns = [
        {
            title: 'Mã giao dịch',
            dataIndex: 'code',
            key: 'code',
            render: code => {
                return (
                    <span>{code}</span>
                )
            },
            // width: size > 1440 ? 120 : 100
        },
        {
            title: 'Tên khách hàng',
            dataIndex: 'name',
            key: 'name',
            render: name => {
                return (
                    <span style={{ color: '#000000' }}>{name}</span>
                )
            },
            // width: size > 1440 ? 250 : 250
        },
        {
            title: 'Số tiền',
            dataIndex: 'price',
            key: 'price',
            render: price => {
                return (
                    <span>
                        {price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VND
                    </span>
                )
            }
        },
        {
            title: 'Trạng thái HĐ',
            dataIndex: 'status',
            key: 'status',
            render: status => {
                return (
                    <span>
                        Đã ký
                    </span>
                )
            }
        },
        {
            title: '',
            dataIndex: 'status',
            key: 'status',
            width: 80,
            render: record => {
                return (
                    <span>
                        <Button onClick={() => viewContract(loanCode?.loan_code, 0)} style={{ backgroundColor: '#1890ff', minWidth: 150, height: size > 1440 ? '35px' : '25px'  }} className="status-btn">Xem</Button>
                    </span>
                )
            }
        },

    ];
    const [dataSource, setDataSource] = useState([
        {
			code: loanCode?.loan_code,
			name: loanCode?.name,
			price: loanCode?.loan_amount,
        },
    ])

    // useEffect(() => {
    //     if(loanCode) {
    //         setDataSource(loanCode);
    //     } else setDataSource([])
	// }, [loanCode])
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
					<div className={step === 1 ? "l-approval active-step" : "l-approval"}>
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
        <div style={{ marginBottom: '-20px', marginTop: '20px', maxWidth: size > 1440 ? '100%' : '1440px' }} className="digital-signature operate-signature">
            <div style={{ transform: 'translate(25%, 5%)' }} className={'sign-success-noti' + (screen === 'thanh_cong' ? ' show' : ' hidden')}>
                <div style={{ display: "flex", alignItems: 'center' }}>
                    <img src={success} style={{ width: '5%' }}></img>
                    <h2 style={{ marginLeft: '15px' }}>KÝ HỢP ĐỒNG THÀNH CÔNG</h2>
                </div>
                <div className='content' style={{ marginTop: '25px' }}>
                    <span style={{ marginRight: '20px' }}>Hợp đồng đã được ký thành công. KH có thể xem lại hợp đồng tại đây</span>
                    <Button onClick={ () => {changeScreen('danh_sach')}} style={{ backgroundColor: '#1890ff', minWidth: 80, height: size > 1440 ? '35px' : '25px'  }} className="status-btn">Xem</Button>
                </div>
            </div>
        <div className="loanlist-operate">
            <h2 style={{ marginLeft: '5px'}}></h2>
                <Table scroll={scroll}
                    style={{ marginTop: '30px' }}
                    className={"attach-table" + (screen === 'danh_sach' ? ' show' : ' hidden')}
                    dataSource={dataSource}
                    columns={columns}
                    rowKey="key"
                    pagination={{defaultPageSize: 5}}
                    // size={size > 1440 ? 'default' : 'small'} 
                    />          
            </div>
        </div>
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
        // signCloudFirstTime: (id) => dispatch(signCloudFirstTime(id)),
    }
}
const mapStateToProps = (state) => {
    return {
        // loansData: state.loan.loansData,
        // customer: state.authentication.customer,
        // loanDetail: state.loan.loanDetail,
        loanCode: state.loan.loanCode,
        signTime: state.loan?.signTime
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(SuccessSign);