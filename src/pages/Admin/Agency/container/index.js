import React, { useState, useEffect } from 'react';
import { CheckCircleOutlined } from '@ant-design/icons';
import '../../../../styles/agency.scss';
import { SCHEDULE_SURVER } from '../../../../utils/constants';
import http from "../../../../apis/http";
import { Select, Button, Table } from 'antd';
import { NotificationSuccess } from '../../../../common/components/Notification';
const { Option } = Select;
function AdminAgency(props) {
    const [step, setStep] = useState('');
    const TABS = {
        SURVEY: 'SURVEY',
        CONTRACT: 'CONTRACT',
        SETUP: 'SETUP',
        FULL: 'FULL'
    }
    const [currentSchedule, setCurrentSchedule] = useState(SCHEDULE_SURVER.SURVER);
    const [totalItem, setTotalItem] = useState(0);
    const [dataSource, setDataSource] = useState([]);
    const [currentAgency, setCurrentAgency] = useState("")
    const [currentPage, setCurrentPage] = useState(1);
    
    const columns = [
        {
            title: 'Mã đại lý',
            dataIndex: 'agent_code',
            key: 'agent_code',
            render: (agent_code) => {
                return (
                    <div>{agent_code}</div>
                )
            }
        },
        {
            title: 'Tên đại lý',
            dataIndex: 'agent_name',
            key: 'agent_name',
            render: (agent_name) => {
                return (
                    <div>{agent_name}</div>
                )
            }
        },
        {
            title: 'Vùng quản lý',
            dataIndex: 'region',
            key: 'region',
            render: (region) => {
                return region?.region_name
            }
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
            render: (phone) => {
                return (
                    <div>{phone}</div>
                )
            }
        },
        {
            title: 'Người đại diện pháp luật',
            dataIndex: 'legalRepresentative',
            key: 'legalRepresentative',
            render: (legalRepresentative) => {
                return (
                    <div>{legalRepresentative}</div>
                )
            }
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (value) => (
                <div>
                    {
                        value ? <Button className='status-btn' style={{ backgroundColor: '#0096D7' }}>
                            <span className="l-calendar-name">Hợp tác</span>
                        </Button> : <Button className='status-btn' style={{ backgroundColor: '#0096D7' }}>
                                <span className="l-calendar-name">Dừng hợp tác</span>
                            </Button>
                    }
                </div>
            ),
        },
        {
            title: '',
            dataIndex: 'approved',
            key: 'approved',
            render: (approved) => (
                // defaultValue={approved}
                <Select style={{ backgroundColor: '#1D4994' }} placeholder="Chưa duyệt" value={approved} style={{ width: 150 }} onChange={handleChangeSelect}>
                    <Select.Option value={true}>Đã duyệt</Select.Option>
                    <Select.Option value={false}>Từ chối</Select.Option>
                </Select>
            ),

        },
    ];



    useEffect(() => {
        fetchData(0)
        // fetchData()
    }, [])
    const fetchData = async (pageIndex) => {
        try {
            const rs = await http.get(`web/admin/agents?pageIndex=${pageIndex}&pageSize=5`);
            // const rs = await http.get(`web/admin/agents`);
            if (rs?.status === 200) {
                setTotalItem(rs?.data?.data?.total_elements)
                setDataSource(rs?.data?.data?.content)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleChangeSelect = async (value) => {
        // handleChange(value);
        console.log("value", value);
        try {
            let id = currentAgency.id;
            let url = `web/admin/agents/${id}`
            var request = {
                "address": currentAgency.address,
                "agentCode": currentAgency.agent_code,
                "agentName": currentAgency.agent_name,
                "agentType": currentAgency.agentType,
                "approved": value,
                "businessLicense": currentAgency.businessLicense,
                "collaboration": currentAgency.collaboration,
                "legalRepresentative": currentAgency.legalRepresentative,
                "phone": currentAgency.phone,
                "position": currentAgency.position,
                "providerId": currentAgency.providerId,
                "region_id": currentAgency.region_id,
                "status": currentAgency.status,
                "taxNumber": "string"
            }
            const rs = await http.post(url, request);
            if (rs?.status === 200) {
                console.log("rs", rs);
                NotificationSuccess('', "Cập nhật thành công")
                changePage(currentPage, null);
            } else {
                NotificationSuccess('', "Cập nhật thất bại")
            };
        } catch (error) {
            console.log("error", error);

        }

    }
    const changePage = (page, pageSize) => {
        fetchData(page - 1, page - 1);
        setCurrentPage(page)
    }
    const handleEdit = (record) => {
        setCurrentAgency(record)
    }

    const renderContent = () => {
        switch (step) {
            case TABS.SURVEY:
                return <>
                    <div className="agency-content">
                        <div className="agency-list">
                            <h3>Danh sách đại lý</h3>
                            <Table
                                dataSource={dataSource}
                                rowKey="key"
                                pagination={{ defaultPageSize: 5, total:  totalItem , onChange: changePage }}
                                columns={columns}
                                // pagination={false}
                                onRow={(record) => ({
                                    onClick: () => handleEdit(record)
                                })}
                         />
                        </div>
                    </div>
                </>
            case TABS.CONTRACT:
                return <>
                    <div className="agency-content">
                        <div className="agency-list">
                            <h3>Nhân sự</h3>

                        </div>
                    </div>
                </>
            case TABS.SETUP:
                return <>
                    <div className="agency-content">
                        <div className="agency-list">
                            <h3>Kế Hoạch</h3>
                        </div>
                    </div>
                </>
            default:
                return <>
                    <div className="agency-content">
                        <div className="agency-list">
                            <h3>Danh sách đại lý</h3>
                        </div>
                    </div>
                </>
                break;

        }
    }
    const getLoanLosList = async (tab) => {
        if (tab !== step) {
            setStep(tab)
            switch (tab) {
                case TABS.SURVEY:
                    setCurrentSchedule(SCHEDULE_SURVER.SURVER)
                    break;
                case TABS.SETUP:
                    setCurrentSchedule(SCHEDULE_SURVER.SET_UP)
                    break;
                case TABS.CONTRACT:
                    setCurrentSchedule(TABS.CONTRACT)
                    break;
            }
        }
    }
    useEffect(() => {
        getLoanLosList(TABS.SURVEY);
    }, [])


    return (
        <div className="agency-container">
            <div className="agency-tabs">
                <div className="step-by-step">
                    <div onClick={() => { getLoanLosList(TABS.SURVEY) }} className={step === 'SURVEY' ? "l-register active-step" : "l-register"}>
                        <div className="l-register-inner ">
                            <div className='l-header-name'>Thông tin đại lý</div>
                            <CheckCircleOutlined />
                        </div>
                    </div>
                    <div onClick={() => { getLoanLosList(TABS.CONTRACT) }} className={step === 'CONTRACT' ? "l-approval active-step" : "l-approval"}>
                        <div className="l-approval-inner">
                            <div className="inner2">
                                <div className='l-header-name'>Nhân sự</div>
                            </div>
                            <CheckCircleOutlined />
                        </div>
                    </div>
                    <div onClick={() => { getLoanLosList(TABS.SETUP) }} className={step === 'SETUP' ? "l-sign active-step" : "l-sign"}>
                        <div className="l-sign-inner">
                            <div className='l-header-name'>Kế hoạch</div>
                        </div>
                        <CheckCircleOutlined />
                    </div>
                </div>
                {renderContent()}
            </div>
        </div>
    );
}

export default AdminAgency;