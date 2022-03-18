import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Table, Button, Form, Input, DatePicker, Modal, Select } from "antd";
import { ArrowRightOutlined } from '@ant-design/icons';
import moment from "moment";
import { NotificationError, NotificationSuccess } from '../../common/components/Notification'
import { history } from '../../utils/history';

import '../../styles/digitalSignature.scss';
import '../../styles/operate.scss';
import http from "../../apis/http";


const maintain = (props) => {
    let size = window.innerWidth;
    const [visibleModalDetail, setVisibleModalDetail] = useState(false);
    const [fields, setFields] = useState([]);
    const [code, setCode] = useState([]);
    const [dataSource, setDataSource] = useState([])
    const [errorContent, setErrorContent] = useState([]);
    const disabledDate = (current) => {
        // Can not select days before today and today
        return current.valueOf() < Date.now();
    }
    const getLoanProcess = async () => {
        const rs = await http.get('web/loans/loan-process-of-customer?processType=MAINTAIN');
        if (rs?.status === 200) {
            // console.log('data in MAINTAIN =>', rs);
            setDataSource(rs?.data?.data?.loan_process_list)
        }
    }
    const getLoanList = async () => {
        const rs = await http.get('web/loan-los/loan-of-customer?tab=MAINTAIN');
        if (rs?.status === 200) {
            console.log('get list =>', rs);
            setCode(rs?.data?.data?.content);
        }
    }
    const onFinish = async (values) => {
        const request = {
            
                "loan_code": values?.loanCode,
                "loan_process_type": "MAINTAIN",
                "request_at": values?.dateTime.valueOf(),
                "request_content": values?.content
              
        }
        const rs = await http.post('web/loans/customer-request-loan-process', request);
        if (rs?.status === 200) {
            console.log('update =>', rs);
            getLoanProcess();
            NotificationSuccess("", "Cập nhật thành công");
        }
        
    }
    const onFinishFailed = (values) => {
        console.log('vales', values)
        NotificationError("", "Có lỗi xảy ra, vui lòng thử lại");
    }
    const handleCancelModalDetail = () => {
		setVisibleModalDetail(false);
    }
    const handleViewAttach = () => {
        setVisibleModalDetail(true);
    }
    const changeToIncident = () => {
        history.push('/incident-request');
    }
    const [form] = Form.useForm();
    const columns = [
        {
			title: 'Mã đơn vay',
			dataIndex: 'loan_code',
            key: 'loan_code',
            render: loan_code => {
                return (
                    <div>{loan_code}</div> 
                )
            }
		},
		{
			title: 'Ngày bảo dưỡng',
			dataIndex: 'request_at_value',
            key: 'request_at_value',
            render: request_at_value => {
                return (
                    <div>{moment(request_at_value).format('DD/MM/YYYY')}</div> 
                )
            }
		},
		{
			title: 'Nội dung',
			dataIndex: 'request_content',
            key: 'request_content',
            width: 800,
            render: request_content => {
                return (
                    <div>
                        {request_content}
                    </div>
                )
            }
		},
		{
			title: 'Kết quả bảo dưỡng',
			dataIndex: 'btn',
            key: 'btn',
            width: 200,
            render: status => {
                return (
                    <div>
                        <Button onClick={() => handleViewAttach()} style={{ backgroundColor: '#1890ff', minWidth: 120, height: size > 1440 ? '35px' : '25px' }} className="status-btn">Xem</Button>
                    </div>
                )
            }
		},
    ]

    useEffect(() => {
        getLoanProcess();
        getLoanList();
	}, [])
    return (
        <div className="digital-signature operate-signature">
            <div style={{ display: 'flex' }} className="loanlist-operate">
                    <div className="l-calendar-button">
						<Button className='status-btn-active'>
							<span className="l-calendar-name">Vận hành bảo dưỡng</span>
						</Button>
                        <Button onClick={() => changeToIncident()} style={{ marginLeft: '10px'}} className='btn-tab-default'>
							<span className="l-calendar-name">Yêu cầu sự cố</span>
						</Button>
					</div>	
            </div>
        <div style={{ marginBottom: '-20px', marginTop: '20px', maxWidth: size > 1440 ? '100%' : '1440px' }} className="digital-signature operate-signature">
            <div className="loanlist-operate">
            <h2 style={{ marginLeft: '5px'}}>Thông tin bảo dưỡng</h2>
                <Table scroll={scroll}
                    style={{ marginTop: '-10px' }}
                    className="attach-table"
                    dataSource={dataSource}
					columns={columns}
                    rowKey="key"
                    pagination={{defaultPageSize: 5}}
                    size={size > 1440 ? 'default' : 'small'}
                    onRow={(record) => {
                        return {
                            onClick: () => {
                                setFields([
                                    {
                                        name: ['content'],
                                        value: record.request_content,
                                    }, 
                                    {
                                        name: ['dateTime'],
                                        value: moment(record?.request_at_value)
                                    },
                                    {
                                        name: ['loanCode'],
                                        value: record.loan_code
                                    }
                                ])
                            }
                        }
                    }}
                    />
            </div>
        </div>
        <div style={{ marginBottom: '-20px', marginTop: '20px', maxWidth: size > 1440 ? '100%' : '1440px' }} className="digital-signature operate-signature">
        <div className="loanlist-operate">
            <h2 style={{ marginLeft: '5px', marginBottom: '15px' }}>Yêu cầu bảo dưỡng</h2>
            <Form
                form={form}
                name="basic"
                fields={fields}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                style={{ marginLeft: '5px' }}
            >
            
            <Form.Item 
                label='Chọn đơn vay'
                name='loanCode'
                rules={[
                    () => ({
                        validator(rule, value) {
                            if (!value) return Promise.reject("Vui lòng nhập chọn đơn vay");
                            return Promise.resolve();
                        }
                    })
                ]}
            >
                <Select placeholder="Chọn đơn vay" style={{ width: "15%", height: size > 1440 ? '35px' : '25px' }} bordered={true} >
						{
                            console.log('12345', code),
							code && code.map((item) => {
								return (
									<Option value={item.loan_code}>{item.loan_code}</Option>
								)
							})
						}
				</Select>
            </Form.Item>    

            <Form.Item
                label="Nội dung bảo dưỡng"
                name="content"
                rules={[
                    () => ({
                        validator(rule, value) {
                            if (!value) return Promise.reject("Vui lòng nhập nội dung bảo dưỡng");
                            return Promise.resolve();
                        }
                    })
                ]}
            >
                <Input.TextArea />
            </Form.Item>

            <Form.Item
                label="Ngày bảo dưỡng"
                name="dateTime"
                rules={[
                    () => ({
                        validator(rule, value) {
                            if (!value) return Promise.reject("Vui lòng chọn ngày thực hiện");
                            return Promise.resolve();
                        }
                    })
                ]}
            >
                <DatePicker disabledDate={disabledDate} format='DD/MM/YYYY' />
            </Form.Item>

            <Form.Item
                style={{ display: 'none'}}
                label="Số thứ tự"
                name="key"
            >
                <Input/>
            </Form.Item>

            <Form.Item>
                <Button
                style={{ backgroundColor: '#1890ff', minWidth: 120, height: size > 1440 ? '35px' : '25px', display: 'block', margin: 'auto' }} className="status-btn"
                type="primary" htmlType="submit">
                    {fields?.length > 0 ? 'Cập nhật' : 'Tạo yêu cầu'}
                </Button>
            </Form.Item>
            </Form>
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
							<iframe src='https://docs.google.com/document/d/1PwzycbIGRMuxA6-ztl_jw5GFIkZNBnx3/edit' frameborder="0" scrolling="no" width="100%" height="100%"></iframe>
						}
							
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
        loansData: state.loan.loansData,
        customer: state.authentication.customer,
        loanDetail: state.loan.loanDetail,
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(maintain);