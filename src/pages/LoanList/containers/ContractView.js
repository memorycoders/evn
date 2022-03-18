import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Table, Button, Checkbox, Modal, Upload } from "antd";
import { CheckCircleOutlined, ArrowLeftOutlined, ArrowRightOutlined, UploadOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import '../../../styles/digitalSignature.scss';
import Sign from "./Sign";
import http from "../../../apis/http";
import { setAgreementId, setPhone } from '../../../store/loans/action'
import { NotificationSuccess } from "../../../common/components/Notification";

const ContractView = (props) => {
    // const [dataSource, setDataSource] = useState([])
    const { loanCode } = props;
    const [checkbox, changeCheckbox] = useState(0);
    const [step, updateStep] = useState(2);
    const [contract_1, updateContract] = useState(0);
    const [contract_2, updateContract2] = useState(0);
    const [visibleModalDetail, setVisibleModalDetail] = useState(false);
    const [url, setUrl] = useState('');
    var size = window.innerWidth;
    const handleCancelModalDetail = () => {
		setVisibleModalDetail(false);
    }
    const handleViewAttach = async (code) => {
        const rs = await http.get('web/agreements/sign-cloud-first-time/preview?loan_code=' + loanCode?.loan_code);
        if(rs?.status === 200) {
            setVisibleModalDetail(true);
            if(code === '1') {
                updateContract(1);
                let x = rs?.data?.data?.files[0]?.data;
                let file_url;
                file_url =encodeURI(x);
                setUrl(`data:application/pdf;base64, ${file_url}`)
            } else if(code === '2') {
                updateContract2(1);
                let x = rs?.data?.data?.files[1]?.data;
                let file_url;
                file_url =encodeURI(x);
                setUrl(`data:application/pdf;base64, ${file_url}`)            
            }
        }
    }
    const sendAPI = async () => {
        try {
            let url;
            const second_person = await http.get(`web/loan-los/${loanCode?.loan_code}`);
            if(second_person?.data?.data?.signPerson === 2) { url = 'web/agreements/sign-cloud-first-person?loan_code='}
            else { url = 'web/agreements/sign-cloud-first-time?loan_code='}
            const rs = await http.get(url + loanCode?.loan_code);
            if(rs?.status === 200) {
                console.log('mess come =>', rs)
                props.setAgreementId(rs?.data?.data?.id);
                props.setPhone(rs?.data.data.mobile_number);
            } else {
                return NotificationError("", "Có lỗi xảy ra. Vui lòng thử lại");
            }
        }catch(ex){
        }
    }
    const columns = [
        {
            title: 'Số thứ tự',
            dataIndex: 'code',
            key: 'code',
            render: code => {
                return (
                    <a>{code}</a>
                )
            },
            width: size > 1440 ? 120 : 100,
        },
        {
            title: 'Hợp đồng',
            dataIndex: 'name',
            key: 'name',
            render: name => {
                return (
                    <span style={{ color: '#000000' }}>{name}</span>
                )
            }
        },
        {
            title: '',
            dataIndex: 'code',
            key: 'code',
            render: code => {
                if(code === '1' || code === '2'){
                    return(
                        <div>
                            <Button onClick={() => handleViewAttach(code)} className="status-btn" style={{ backgroundColor: '#1890FF', minWidth: 150, height: size > 1440 ? '35px' : '25px' }}>Xem</Button>
                        </div>
                    )
                }                   
                
            }
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: status => {
                return (
                    <div>
                    {status === 0 ? 'Chưa xem'
                        : status === 1 ? 'Đã xem'
                            :  status === 2 ? 'Chưa tải lên' :
                            status === 3 ? 'Đã tải lên' : ''}
                       
                    </div>
                )
            }
        },

    ]
    const dataSource = [
        {
          key: '1',
          code: '1',
          name: 'Đề nghị vay vốn kiêm hợp đồng cho vay và thế chấp tài sản',
          number: '0976627796',
          status: contract_1,
        },
        {
          key: '2',
          code: '2',
          name: 'Phiếu yêu cầu giao dịch đảm bảo',
          number: '19002828',
          status: contract_2,
        },
      ];
    return (
        <>
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
        <div style={{ marginBottom: '-20px', marginTop: '-10px', maxWidth: size > 1440 ? '100%' : '1440px' }} className="digital-signature operate-signature">
            <Table scroll={scroll}
                    style={{ marginTop: '10px' }}
                    className="attach-table"
                    dataSource={dataSource}
                    columns={columns}
                    rowKey="key"
                    pagination={{defaultPageSize: 5}}
                    size={size > 1440 ? 'default' : 'small'} />          

            <div style={{ padding: '10px' }} className='checkbox-contract'>
                <Checkbox onChange={ () => {changeCheckbox(!checkbox)}}
                  disabled={(contract_1 === 1 && contract_2 === 1) ? false : true}
                >Tôi đã đọc và đồng ý với các nội dung trong hợp đồng.</Checkbox>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button className="back-btn"><Link to='/sign'><ArrowLeftOutlined /> Trở lại</Link></Button>
                <Button disabled={checkbox ? false : true} onClick={() => sendAPI() }
                 className="otp-btn">
                     <Link to='/otp-contract-confirm'>
                         Ký điện tử <ArrowRightOutlined />
                         </Link>
                         </Button>
            </div>
            </div>
        </div>
        </div>
        <Modal
				className="modal-view-attachment"
				title="Chi tiết hợp đồng"
				visible={visibleModalDetail}
				onCancel={handleCancelModalDetail}
			>
				<div className="detail-content">
					<div className="center-content">
						{
                            <iframe 
                            src={url}
                            frameborder="0" scrolling="no" width="100%" height="100%"></iframe>
						}
							
					</div>
				</div>
			</Modal>
    </>
    )
}
function mapDispatchToProps(dispatch) {
    return {
        // signCloudFirstTime: (id) => dispatch(signCloudFirstTime(id)),
        setAgreementId : payload => dispatch(setAgreementId(payload)),
        setPhone : payload => dispatch(setPhone(payload))
    }
}
const mapStateToProps = (state) => {
    return {
        loanCode: state.loan?.loanCode
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(ContractView);