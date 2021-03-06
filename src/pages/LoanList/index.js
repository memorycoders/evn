import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import { Table, Button, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Link, useLocation, useParams, useRouteMatch } from "react-router-dom";
import '../../styles/loanList.scss';
import { getLoans, delLoan, setLoanDetail, setLoanCode } from '../../store/loans/action';

import Sign from './containers/Sign';
import http from "../../apis/http";
import { history } from "../../utils/history";
import { LoanDetail } from './loanDetail';
import { DetailLoan } from './DetailLoan';



const LoanList = (props)=>{
    const totalItem = props?.loansData?.total_elements;
    const [dataSource, setDataSource] = useState([]);
    const [dataDetail, setDataDetail] = useState({});
    const [l_code, setLCode] = useState('');
    const [data, setData] = useState([]);
    const [step, updateStep] = useState(1);
    let { search } = useLocation();
    let status_cash = [
        'EXPERTISE',
        'BLACKLIST_DEDUP_PASSED',
        'BLACKLIST_DEDUP_NOT_PASSED',
        'S37_PASSED',
        'S37_NOT_PASSED',
        'PCB_PASSED',
        'PCB_NOT_PASSED',
        'CIC_PASSED',
        'CIC_NOT_PASSED',
    ];
    let status_score = [
        'COLLECT_SURVEY',
        'SCORE_PASSED',
        'SCORE_NOT_PASSED',
    ]
    const [city,setCity] = useState([])
    const getCity = async () => {
        const rs = await http.get(`web/dict_item/items?item_type=TinhThanh`);
        if (rs?.status === 200) {
            setCity(rs?.data?.data?.data);
        }
    }
    useEffect(()=>{
        getCity()
    },[])
    useEffect(() => {
        let params = new URLSearchParams(search);
        let id = params.get("id");
        props.getLoans({ id: id, status: 0, user: props?.username })
    },[props?.username])

    useEffect(() => {
        if (props.loansData) {
            // console.log("loanData",props.loansData);
            setDataSource(props.loansData?.content)
        }
    }, [props.loansData])

    useEffect(() => {
        if (props.loanDetail.id) {
            setDataDetail(props.loanDetail)
        }
    }, [props.loanDetail])

    // console.log("loansData",props.loansData);

    const handleLoanDetail = (id, progress) => {
        props.getLoans({ id: id, status: 0 });
    }

    const columns = [
        {
            title: 'M?? giao d???ch',
            dataIndex: 'loan_code',
            key: 'loan_code',
            render: loan_code => <div style={{ color: '#1D4994', textAlign: 'center' }}>{loan_code}</div>
        },
        {
            title: 'Kha??ch ha??ng',
            dataIndex: 'name',
            key: 'name',
            render: name => <div style={{ textAlign: 'center' }}>{name}</div>
        },
        {
            title: 'S??? ti???n vay (VN??)',
            dataIndex: 'loan_amount',
            key: 'loan_amount',
            render: loan_amount => <div style={{ textAlign: 'center' }}>{loan_amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
        },
        // {
        //     title: 'Th???i h???n (n??m)',
        //     dataIndex: 'term',
        //     key: 'term',
        //     render: term => <div style={{ textAlign: 'center' }}>{term}</div>
        // },
        // {
        //     title: 'L??i su???t d??? ki???n (%/n??m)',
        //     dataIndex: 'interest_rate',
        //     key: 'interest_rate',
        //     render: interest_rate => <div style={{ textAlign: 'center' }}>{interest_rate}</div>
        // },
        {
            title: 'Tr???ng th??i',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) =>
                <div style={{ textAlign: 'center' }}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleLoanDetail(record.id, status)
                    }}>
                    {status === 'NEW' ? <Button className="status-btn" style={{ backgroundColor: '#F6BB3B', width: '50%' }}>Ti????p nh????n</Button>
                        : status === 'RECEIVED_LOAN_APPLICATION' ? <Button style={{ backgroundColor: '#1D4994', width: '50%' }} className="status-btn">??a?? ti????p nh????n ????n vay</Button>
                            : status_cash.includes(status) ? <Button style={{ backgroundColor: '#FF5733', width: '50%' }} className="status-btn">Ki????m tra ti??n du??ng</Button>
                                : status === 'SENT_PARTNER' ? <Button style={{ backgroundColor: '#33BAFF', width: '50%' }} className="status-btn">Chuy????n nha?? th????u</Button>
                                    : status === 'SURVEY' ? <Button style={{ backgroundColor: '#359E32', width: '50%' }} className="status-btn">??ang kh???o s??t</Button>
                                        : status_score.includes(status) ? <Button style={{ backgroundColor: '#2A70D1', width: '50%' }} className="status-btn">Th????m ??i??nh</Button>
                                            : status === 'AWAITING_APPROVAL_LOAN' ? <Button style={{ backgroundColor: '#B42E2E', width: '50%' }} className="status-btn">??ang ph?? duy????t</Button>
                                                : status === 'APPROVED_LOAN' ? <Button style={{ backgroundColor: '#4DB769', width: '50%' }} className="status-btn">???? ph?? duy???t</Button>
                                                    : status === 'NOT_APPROVED_LOAN' ? <Button style={{ backgroundColor: '#302AD1', width: '50%' }} className="status-btn">T???? ch????i ph?? duy????t</Button>
                                                        : status === 'SIGNED_WAITING_SETUP' ? <Button style={{ backgroundColor: '#DB8297', width: '50%' }} className="status-btn">??a?? ky?? h????p ??????ng 1</Button>
                                                            : status === 'SIGNED_SETUPED' ? <Button style={{ backgroundColor: '#DB8297', width: '50%' }} className="status-btn">??a?? ky?? h????p ??????ng 1</Button>
                                                                : status === 'SIGNED_WAITING_DISBURSE' ? <Button style={{ backgroundColor: '#DB8297', width: '50%' }} className="status-btn">??a?? ky?? h????p ??????ng 2</Button>
                                                                    : status === 'APPROVED_DISBURSE' ? <Button style={{ backgroundColor: '#DB8297', width: '50%' }} className="status-btn">Ph?? duy????t gia??i ng??n</Button>
                                                                        : status === 'NOT_APPROVED_DISBURSE' ? <Button style={{ backgroundColor: '#DB8297', width: '50%' }} className="status-btn">T???? ch????i gia??i ng??n</Button>
                                                                            : status === 'DISBURSED' ? <Button style={{ backgroundColor: '#DB8297', width: '50%' }} className="status-btn">Gia??i ng??n</Button>
                                                                                : status === 'T24_IMPORT' ? <Button style={{ backgroundColor: '#DB8297', width: '50%' }} className="status-btn">Gia??i ng??n</Button>
                                                                                    : <Button style={{ backgroundColor: '#27A29D' }} className="status-btn">Kha??c</Button>}
                </div>

        },
        // {
        //     title: 'Thao t??c',
        //     dataIndex: 'status',
        //     key: 'status',
        //     render: (status, record) => {
        //         status === 1 ?
        //         <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
        //             <Button onClick={(e) => {
        //                 e.stopPropagation();
        //                 handleLoanDetail(record.id)
        //             }}
        //                 className="del-btn"> <EditOutlined /></Button><Popconfirm
        //                     title="B???n c?? ch???c mu???n x??a kho???n vay n??y?"
        //                     onConfirm={() =>
        //                         handleDeleteLoan(record.id)
        //                     }
        //                     okText="C??" cancelText="Kh??ng"
        //                 ><Button onClick={(e) => e.stopPropagation()}
        //                     className="del-btn"> <DeleteOutlined /></Button></Popconfirm>
        //         </div>
        //         : null
        //     }

        // },
    ];

    const handleDeleteLoan = id => {
        props.delLoan(id)
    }

    const handleViewLoan = (status, record) => {
        // console.log("status",status, "record",record);
        props.getLoans({ id: record?.loan_code, status: status, user: props?.username });
        if (record?.loan_code?.length > 0) {
            setLCode(record?.loan_code);
            props.setLoanCode(record?.loan_code);
        }
    }

    const viewSign = () => {
        updateStep(2);
        history.push('/sign');
    }

    const changePage = (page, pageSize) => {
        props.getLoans({ pageIndex: page - 1 })
    }

    return (
        <div className="loan-wrapper">
            <div className="l-loan-container">
                {props?.username === 'Kh??ch h??ng vay ti??u d??ng' ? <div></div> : <div className="step-by-step">
                    <div className={step === 0 ? "l-register active-step" : "l-register"}>
                        <div className="l-register-inner">
                            <span>????ng k?? kho???n vay</span>
                            <CheckCircleOutlined />
                        </div>
                    </div>
                    <div onClick={() => { updateStep(1) }} className={step === 1 ? "l-approval active-step" : "l-approval"}>
                        <div className="l-approval-inner">
                            <div className="inner2">
                                <div>Ph?? duy???t</div>
                            </div>
                            <CheckCircleOutlined />
                        </div>
                    </div>
                    <div onClick={() => { viewSign() }} className={step === 2 ? "l-sign active-step" : "l-sign"}>
                        <div className="l-sign-inner">
                            <div>K?? h???p ?????ng</div>
                        </div>
                        <CheckCircleOutlined />
                    </div>
                </div>}
                {
                    !props.viewDetail ? <div className={"loan-list"}> <div className="title">Danh sa??ch kho???n vay</div>
                        <Table
                            dataSource={dataSource}
                            columns={columns}
                            rowKey="id"
                            onRow={(r) => ({
                                onClick: () => handleViewLoan(1, r),
                            })}
                            pagination={{ defaultPageSize: 5, total: totalItem, onChange: changePage }}
                        />
                        </div> 
                       : props?.username ===  'Kh??ch h??ng vay ti??u d??ng' ? <DetailLoan user={props?.username} loanCode={props.loanCode} dataDetail={dataDetail} close={() => handleViewLoan(2)}></DetailLoan> : <LoanDetail city={city} user={props?.username} loanCode={props.loanCode} dataDetail={dataDetail} close={() => handleViewLoan(2)} />
                   
                        //  : <LoanDetail user={props?.username} loanCode={props.loanCode} dataDetail={dataDetail} close={() => handleViewLoan(2)} />
                }
                 
            </div>
        </div>
    )
}

function mapDispatchToProps(dispatch) {
    return {
        getLoans: (payload) => dispatch(getLoans(payload)),
        delLoan: (id) => dispatch(delLoan(id)),
        setLoanCode: payload => dispatch(setLoanCode(payload)),
    }
};

const mapStateToProps = (state) => ({
    loansData: state.loan.loansData,
    viewDetail: state.loan.viewDetail,
    loanDetail: state.loan.loanDetail,
    loanCode: state.loan.loanCode,
    username: state?.authentication?.user?.role?.name,
})

export default connect(mapStateToProps, mapDispatchToProps)(LoanList);