import React, { useState, useEffect, useRef } from 'react';
import { Tabs, Row, Col, DatePicker, Table, Popover, Upload, Button, Form, Badge, Input, Modal, Checkbox, Select, Slider } from 'antd';
import { CloseCircleOutlined, MoreOutlined, LeftOutlined, RightOutlined, CheckCircleOutlined } from '@ant-design/icons';
import '../../styles/loanList.scss';
import loanInfo from '../../asset/images/loanInfo.png';
import investInfo from '../../asset/images/investInfo.png';
import moment from "moment";
import { EVN_TOKEN, BASE_URL } from "../../utils/constants";
import upFile from '../../asset/images/icon-upFile.png';
import download from '../../asset/images/icon-download.png';
import detailFile from '../../asset/images/icon-detailFile.png';
import chatIcon from '../../asset/images/chat-icon.png';
import { connectSocket } from './socket'
import { setLoanDetail } from '../../store/loans/action';
import http from "../../apis/http";
import { NotificationError, NotificationSuccess } from "../../common/components/Notification";
import update, { current } from 'immer';
import { suppressDeprecationWarnings } from 'moment';
import { PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import NumberFormat from 'react-number-format';
import iRight from '../../asset/images/longRight.png';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import PersonalInfo from '../Loan/Components/PersonalInfo';
import RelativePerson from '../Loan/Components/RelativePerson';
const { TabPane } = Tabs;
const { Option } = Select;


export function LoanDetail(props) {
    const baseURL = BASE_URL
    const dateFormat = 'DD/MM/YYYY';
    const { dataDetail, close, loanCode, user, loanDetail, } = props;

    const size = { size: 'small' }
    const [repayment, setRepayment] = useState([]);
    const [messageCount, setMessageCount] = useState(1);
    const [isOpenChatBox, setOpenChatBox] = useState(false);

    const [formFirst] = Form.useForm();
    const [collateral, setCollateral] = useState([]);
    const [otherCollateral, setOtherCollateral] = useState(["1"]);
    const [payment, setPayment] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [visibleModalDetail, setVisibleModalDetail] = useState(false);
    const [visibleModalTemplate, setVisibleModalTemplate] = useState(false);
    const [isDoc, setIsDoc] = useState(false)
    const [isCheckContact, setCheckContact] = useState(false);;
    const [isCheckPermanent, setCheckPermanent] = useState(false);
    const [url, setUrl] = useState('');
    const [urlTemp, setUrlTemp] = useState('');
    const [max, setCurrentMax] = useState(10);
    const [row, setRow] = useState({})
    const [detail, setDetail] = useState({});

    // const [detail, setDetail] = useState({})
    const [errorMonth, setErrorMonth] = useState("")
    const [errorLoan_amount, setErrorLoan_amount] = useState("")
    const [errorInvestTotal, setErrorInvestTotal] = useState("");
    const [errorInvestment_amount, setErrorInvestment_amount] = useState("")
    const [errorInstallAdd, setErrorInstallAdd] = useState("");
    const [errorRate, setErrorRate] = useState("")
    const [errorCity, setErrorCity] = useState("");

    const [form] = Form.useForm();
    let token = sessionStorage.getItem(EVN_TOKEN);
    if (!token) {
        token = localStorage.getItem(EVN_TOKEN)
    }
    let access_token;
    if (token && token !== 'undefined') {
        let objToken = JSON.parse(token);
        access_token = objToken.token.access_token;
    }



    const update = async () => {
        try {
            // console.log("detail Update", detail);
            const detailupdates = {
                "attachment_files": detail?.customer?.attachment_files,
                "career_type": 0,
                "cmis": detail?.cmis,
                "collateral": 0,
                "contact_address": detail?.customer?.contact_address,
                "contact_city": detail?.customer?.contact_city,
                "contact_district": detail?.customer?.contact_district,
                "expected_total_investment": detail?.expectedTotalInvestment,
                "installation_address": detail?.installation_address,
                "installation_location": 1,
                "interest_rate": detail?.interestRate,
                "investment_amount": detail?.investmentAmount,
                "loan_amount": detail?.loan?.register_amount,
                "mortgage_status": detail?.mortgageStatus,
                "ownership_type": detail?.ownershipType,
                "permanent_address": detail?.customer?.permanent_address,
                "permanent_city": detail?.customer?.permanent_city,
                "permanent_district": detail?.customer?.permanent_district,
                "personal_information": {
                    "additional_emails_list": [
                    ],
                    "additional_phone_numbers_list": [
                    ],
                    "address": detail?.installation_address,
                    "birthday": detail?.customer?.dob,
                    "card_number": detail?.customer?.identity_card_id,
                    "email": detail?.customer?.contact_email,
                    "expiration_date": detail?.customer?.expiration_date,
                    "gender": detail?.customer?.gender,
                    "id_card_issued_date": detail?.customer?.id_card_issued_date,
                    "issued_by": detail?.customer?.issued_by,
                    "marital_status": detail?.customer?.maritaStatus,
                    "name": detail?.customer?.name,
                    "passport": detail?.customer?.passport,
                    "phone_number": detail?.customer?.contact_phone
                },
                "power_capacity": detail?.power_capacity,
                "ppa_type": 1,
                "relative_persons": detail?.relative_person,
                "rental_status": detail?.rentalStatus,
                "repayment_method": detail?.repaymentMethod,
                "term": parseInt(detail?.term),
                "working_information": {
                    "company_id": detail?.customer?.company_id,
                    "company_name": detail?.workplace?.company_name,
                    "contract_type": detail?.contract_type,
                    "income": detail?.customer?.income,
                    "other_income": detail?.customer?.other_income,
                    "other_income_desc": detail?.customer?.other_income_desc,
                    "pay_forms": detail?.customer?.pay_forms == "Chuyển khoản" ? 1 : detail?.customer?.pay_forms,
                    "working_address": detail?.workplace?.address,
                    "working_duration": 0
                }
            }
            const rs = await http.post(`web/loan-los/${detail?.id}`, detailupdates);
            if (rs?.status === 200) {
                NotificationSuccess('', 'Cập nhật khoản vay thành công');
                close();
            }
        } catch (err) {
            return NotificationError('', err.message)
        }

    }
    const getCity = async () => {
        const rs = await http.get(`web/dict_item/items?item_type=TinhThanh`);
        if (rs?.status === 200) {
            setCity(rs?.data?.data?.data);

        }
    }
    const getDetail = async () => {
        try {
            let url = `web/loan-los/${loanCode}`;
            const rs = await http.get(url);
            if (rs?.status === 200) {
                // console.log("loan-los", rs);
                let data = rs?.data?.data;
                // console.log("data", data);

                // city.map((item, index) => {
                //     if (item.item_code === data?.customer?.installation_city) {
                //         data.customer.installation_city = item.id
                //     }
                //     if (item.item_code === data?.customer?.contact_city) {
                //         data.customer.contact_city = item.id
                //     }
                //     if (item.item_code === data?.customer?.permanent_city) {
                //         data.customer.permanent_city = item.id
                //     }
                // })
                setDetail(data);
                // getDistric(data?.customer?.installation_city)
                getCity()
                let attachment_list = rs?.data?.data?.customer?.attachment_files;
                // const newDatasourceList = update(dataSource, draf => {
                //         attachment_list?.forEach((item) => {
                //         const findIndex = draf.findIndex(i => i.label === item.label)
                //         if (findIndex !== -1) {
                //             let label_list = attachment_list.filter(item => item.label === draf[findIndex].label)
                //             draf[findIndex].files.push(label_list);
                //             setCurrentMax(label_list?.length);
                //         } else {
                //             // stop
                //         }
                //     })
                // });
                let newSourceData = [...dataSource];
                attachment_list.forEach(item => {
                    newSourceData.forEach(i => {
                        if (item.label === i.label) i.files.push(item);
                    })
                })
                setDataSource(newSourceData);
            } else {
                return NotificationError("", "Có lỗi xảy ra. Vui lòng thử lại");
            }
        } catch (ex) {
        }
    }


    useEffect(() => {
        const temp2 = (dataDetail.repayment_method >>> 0).toString(2).split('');
        if (dataDetail.id) {
            let tempPaymentMethod = [];
            if (temp2[0] && temp2[0] === "1") {
                tempPaymentMethod.push("Lương")
            }
            if (temp2[1] && temp2[1] === "1") {
                tempPaymentMethod.push("Bán điện")
            }
            if (temp2[2] && temp2[2] === "1") {
                tempPaymentMethod.push("Khác")
            }
            setRepayment(tempPaymentMethod);
        }
    }, [dataDetail]);

    const handleViewTemplate = async (key) => {
        if (key === '2' || key === '3') {
            const rs = await http.get('web/agreements/sign-cloud-second-time/preview?loan_code=' + detail?.loan_code);
            if (rs?.status === 200) {
                setUrlTemp('');
                setVisibleModalTemplate(true);
                if (key === '3') {
                    let x = rs?.data?.data?.files[0]?.data;
                    let file_url;
                    file_url = encodeURI(x);
                    setUrlTemp(`data:application/pdf;base64, ${file_url}`)
                } else if (key === '2') {
                    let x = rs?.data?.data?.files[0]?.data;
                    let file_url;
                    file_url = encodeURI(x);
                    setUrlTemp(`data:application/pdf;base64, ${file_url}`)
                }
            }
        } else if (key === '1' || key === '4') {
            const rs = await http.get('web/agreements/sign-cloud-first-time/preview?loan_code=' + detail?.loan_code);
            if (rs?.status === 200) {
                setUrlTemp('');
                setVisibleModalTemplate(true);
                if (key === '1') {
                    let x = rs?.data?.data?.files[0]?.data;
                    let file_url;
                    file_url = encodeURI(x);
                    setUrlTemp(`data:application/pdf;base64, ${file_url}`)
                } else if (key === '4') {
                    let x = rs?.data?.data?.files[1]?.data;
                    let file_url;
                    file_url = encodeURI(x);
                    setUrlTemp(`data:application/pdf;base64, ${file_url}`)
                }
            }
        }
    }

    const handleCancelModalTemplate = () => {
        setVisibleModalTemplate(false);
        setUrlTemp('');
    }
    const [dataSource, setDataSource] = useState([
        {
            key: "1",
            name: "CMND/CCCD/Hộ chiếu người vay và vợ (chồng) của người đi vay (nếu đã kết hôn)",
            status: false,
            label: 1,
            files: [],
        },
        {
            key: "2",
            name: 'Hộ khẩu thường trú/ KT3 /Đăng ký kết hôn',
            status: false,
            label: 2,
            files: [],
        },
        {
            key: "3",
            name: 'HĐLĐ/Quyết định bổ nhiệm/chứng từ tương đương',
            status: false,
            label: 3,
            files: [],
        },
        {
            key: "4",
            name: 'Giấy tờ chứng minh thu nhập khác (hợp đồng mua bán nhà, Hợp đồng cho thuê xe)',
            status: false,
            label: 4,
            files: [],
        },
        {
            key: "5",
            name: 'Sao kê tài khoản lương 3 tháng gần nhất',
            status: false,
            label: 5,
            files: [],
        },
        {
            key: "6",
            name: 'Kết quả khảo sát nhu cầu lắp đặt trên EVNSolar',
            status: false,
            label: 6,
            files: [],
        },
        {
            key: "7",
            name: 'Ảnh chụp mái nhà ở 3- 5 góc chụp khác nhau',
            status: false,
            label: 7,
            files: [],
        },
        {
            key: "8",
            name: 'Hóa đơn tiền điện (Hóa đơn tiền điện hoặc báo cáo tiêu thụ điện từ cổng CSKH của điện lực trong 6 tháng gần nhất)',
            status: false,
            label: 8,
            files: [],
        },
        {
            key: "9",
            name: 'Xác nhận nhân viên',
            status: false,
            label: 9,
            files: [],
        }
    ])
    const columns = [
        {
            title: 'Loại hồ sơ',
            dataIndex: 'name',
        },
        {
            title: "Số lượng file",
            dataIndex: "countFile",
            render: (text, record) => {
                return (
                    <div>
                        {record?.files?.length}
                    </div>
                )
            }
        },
        {
            title: 'Trạng thái',
            width: 160,
            dataIndex: "action",
            render: (text, record) => {
                return (
                    <div>
                        {record.files?.length > 0 ? <div className="attach-btn">
                            <CheckCircleOutlined style={{ transform: 'rotate(0deg)' }} className="green" />
                            <Popover
                                content={<Row style={{ minWidth: 220 }}>
                                    <Col span={8} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '10px 0px', cursor: 'pointer' }}>
                                        <img onClick={() => handleDownloadFile(record.files[0])} className="attach-icon" src={download} />
                                        Tải xuống
									</Col>
                                    <Col span={8}>
                                        {/* <Popconfirm
											title="Bạn có chắc muốn xóa file này?"
											onConfirm={() => confirmDel(record)}
											okText="Có" cancelText="Không"
										> */}
                                        <div onClick={() => {
                                            handleViewAttach(record, 0)
                                            setRow(record)
                                        }}
                                            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '10px 0px', cursor: 'pointer' }}>
                                            <img className="attach-icon" src={detailFile} />
                                            Xem File
											</div>

                                        {/* </Popconfirm> */}
                                    </Col>
                                    <Col span={8}>
                                        <Upload multiple={true} className='attach-upload' beforeUpload={(info) => handleChangeFileUpload(info, record)}>
                                            <img style={{ cursor: 'pointer' }} className="attach-icon" src={upFile} />
                                            <div style={{ cursor: 'pointer' }}></div>Upload
										</Upload>
                                    </Col>
                                </Row>}
                                trigger="click"
                            // visible={visibleGreen}
                            // onVisibleChange={handleVisibleChangeGreen}
                            >
                                <MoreOutlined className="attach-more" />
                            </Popover>
                        </div>
                            : <div className="attach-btn">
                                <CloseCircleOutlined className="red" />
                                <Popover
                                    className="red-popover"
                                    content={<div
                                        style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '10px 0px' }}
                                    >
                                        <Upload multiple={true} className='attach-upload' beforeUpload={(info) => { handleChangeFileUpload(info, record) }}>
                                            <img style={{ cursor: 'pointer' }} className="attach-icon" src={upFile} />
                                            <div style={{ cursor: 'pointer' }}></div>Upload
										</Upload>
                                    </div>}
                                    trigger="click"
                                // visible={visibleRed}
                                // onVisibleChange={handleVisibleChangeRed}
                                >
                                    <MoreOutlined className="attach-more" />
                                </Popover>

                            </div>}
                    </div>
                )
            }
        }
    ]



    const handleChangeFileUpload = async (_file, record) => {
        try {
            let arr = [];
            let fd = new FormData();
            fd.append('files', _file)
            fd.append('label', record?.label)
            arr.push(fd);
            const rs = await http.post(`web/attachment-files/upload-loan-files`, fd);
            if (rs?.status === 200) {
                NotificationSuccess("", "Tải lên thành công");
                let data = detail?.customer?.attachment_files;
                data.push(rs?.data?.data?.attachment_files[0]);
                setDetail({
                    ...detail,
                    customer: {
                        ...detail.customer,
                        attachment_files: data
                    }
                })

                let newDatasourceList = [...dataSource];
                newDatasourceList.forEach(elements => {
                    if (elements.label === record?.label) {
                        let objectFile = {
                            file_uuid: rs?.data?.data?.attachment_files[0]?.file_uuid,
                            original_file_name: rs?.data?.data?.attachment_files[0]?.original_file_name
                        }
                        elements.files.push(objectFile);
                    }
                })
                setDataSource(newDatasourceList);
            }
        } catch (ex) {
            console.log("ex", ex)
            NotificationError("", ex.message);
        }
    }

    const handleViewAttach = (record, pageIndex) => {
        console.log('record =>', record);
        setUrl('');
        setCurrentMax(record?.files?.length);
        setVisibleModalDetail(true);
        if (record?.files[0]?.[pageIndex]?.original_file_name.includes('pdf') || record?.files[0]?.[pageIndex]?.original_file_name.includes('doc')
            || record?.files[0]?.[pageIndex]?.original_file_name.includes('docx')) {
            setIsDoc(true);
            let new_url = baseURL + `web/loans/ftps/view?file_uuid=${record?.files[0]?.[pageIndex]?.file_uuid}`;
            setUrl(`https://docs.google.com/viewer?url=${new_url}&embedded=true`);
        } else {
            setIsDoc(false);
            console.log('File type is image');
            setUrl(baseURL + `web/loans/ftps/view?file_uuid=${record?.files[pageIndex]?.file_uuid}`);
        }
    }

    const handlePreFile = () => {
        let temp = currentPage - 1;
        setCurrentPage(currentPage - 1);
        handleViewAttach(row, temp);
    }

    const handleNextFile = () => {
        let temp = currentPage + 1;
        setCurrentPage(currentPage + 1);
        handleViewAttach(row, temp);
    }

    const handleCancelModalDetail = () => {
        setVisibleModalDetail(false);
        setUrl('');
    }

    const handleDownloadFile = async (payload) => {
        console.log('payload => ', payload)
        try {
            const rs = await http.get(`web/loans/ftps/download?file_uuid=${payload}`);
            console.log('rss', rs)
            if (rs.status === 200) {
                window.open(rs?.data?.data?.download_link, '_blank');
            }
        } catch (ex) {
            NotificationError("", ex.message);
        }
    }

    const marital = [
        { value: 0, name: "Độc thân" },
        { value: 1, name: "Đã kết hôn" },
    ]

    const handleChangePayForm = (value) => {
        setDetail({
            ...detail,
            customer: {
                ...detail.customer,
                marital_status: value
            }
        })
    }
    const [isMortgage, setMortgage] = useState(true);

    const sliderWattage = {
        min: 0,
        max: 50
    }
    const marksWattage = {
        [sliderWattage.min]: `${sliderWattage.min} kWp`,
        [sliderWattage.max]: `${sliderWattage.max} kWp`,
    }
    const GENDERS = {
        M: 0,
        F: 1
    }
    const ruleEmail = [() => ({
        validator(rule, value) {
            if (value === undefined || value !== undefined && value?.length === 0) {
                return Promise.reject(
                    "Vui lòng nhập email!"
                );
            } else {
                const listCheck = value.split("@");
                if (
                    value.includes("..") ||
                    listCheck[0].startsWith(".") ||
                    listCheck[0].endsWith(".") ||
                    (listCheck?.length > 1 &&
                        listCheck[1].startsWith(".")) ||
                    (listCheck?.length > 1 &&
                        listCheck[1].endsWith("."))
                ) {
                    return Promise.reject(
                        "Email không đúng định dạng!"
                    );
                }
                if (value?.length > 255) {
                    return Promise.reject(
                        "Email vượt quá 255 ký tự!"
                    );
                }
                if (validation.test(value)) {
                    return Promise.resolve();
                } else {
                    return Promise.reject(
                        "Email không đúng định dạng!"
                    );
                }
            }
        }
    }),
    ]
    const [keyTab, setKeyTab] = useState("1")
    const [isBackFromInformation, setisBackFromInformation] = useState(true)

    const [isResult, setIsResult] = useState(true)
    const nextStep = () => {
        if (keyTab === "1") {
            if (!detail?.installation_address) {
                NotificationError("", " Vui lòng nhập số nhà")
                return;
            }
            if (!detail?.customer?.installation_district) {
                NotificationError("", " Vui lòng chọn quần huyện")
                return;
            }
            if (detail?.term?.length > 3) {
                setErrorMonth("Vui lòng nhập thời hạn vay không vượt quá 3 ký tự")
                NotificationError("", " Vui lòng nhập thời hạn vay không vượt quá 3 ký tự")
                return;
            }
            if (!detail?.investmentAmount) {
                NotificationError("", " Vui lòng nhập số tiền đầu tư")
                return;
            }
            if (!detail?.expectedTotalInvestment) {
                NotificationError("", " Vui lòng nhập tổng mức đầu tư")
                return;
            }
            if (!detail?.interestRate) {
                // setErrorRate("Vui lòng nhập tỉ lệ đầu tư")
                NotificationError("", "Vui lòng nhập tỉ lệ tài trợ")
                return
            }
            if (detail?.interestRate > 85) {
                NotificationError("", "Tỉ lệ tài trợ không được vượt quá 85 %")
                return
            }
            if (!detail?.loan?.register_amount) {
                NotificationError("", "Vui lòng nhập thông tin tiền vay")
                return;
            }

            if (!detail.term) {
                NotificationError("", " Vui lòng nhập thời hạn vay")
                return
            }

        }

        if (keyTab === "2") {
            if (!detail?.customer?.dob) {
                NotificationError("", " Vui lòng nhập ngày sinh")
                return
            }
            if (detail?.customer?.dob === "Invalid date") {
                NotificationError("", " Vui lòng nhập ngày sinh")
                return
            }
            if (!detail?.customer?.issued_by) {
                NotificationError("", " Vui lòng nhập nơi cấp CMND/CCCD/Hộ chiếu")
                return
            }
            if (!detail?.customer?.contact_phone) {
                NotificationError("", " Vui lòng nhập số điện thoại")
                return
            }
            if (!detail?.customer?.contact_city) {
                NotificationError("", " Vui lòng nhập thành phố địa chỉ liên lạc ")
                return
            }
            if (!detail.customer?.contact_district) {
                NotificationError("", " Vui lòng nhập quận huyện địa chỉ liên lạc ")
                return
            }
            if (!detail?.customer?.permanent_city) {
                NotificationError("", " Vui lòng nhập thành phố địa chỉ thường chủ ")
                return
            }
            if (!detail?.customer?.permanent_district) {
                NotificationError("", " Vui lòng nhập quận huyện địa chỉ thường chủ ")
                return
            }
            if (!detail?.workplace?.address) {
                NotificationError("", " Vui lòng nhập nơi làm việc")
                return
            }
            if (!detail?.workplace?.company_name) {
                NotificationError("", " Vui lòng nhập địa chỉ làm việc")
                return
            }
            if (detail?.customer?.id_card_issued_date === "Invalid date") {
                NotificationError("", " Vui lòng nhập ngày cấp CMND/CCCD/Hộ chiếu")
                return
            }
            if (!detail?.customer?.contact_address) {
                NotificationError("", "Vui lòng nhập địa chỉ liên lạc")
                return
            }
            if (!detail?.customer?.permanent_address) {
                NotificationError("", "Vui lòng nhập hộ khẩu thường trú")
                return
            }
            if (!detail?.customer?.income) {
                NotificationError("", " Vui lòng nhập mức lương")
                return
            }



            var result;
            detail.relative_person.forEach((item, index) => {
                for (let key in item) {
                    // if (item[key]?.length === 0) {
                    //     result = false;
                    // }
                    if (key === "relation") {
                        if (item[key] === 0) {
                            result = false;
                        }
                    }
                    if (key === "name") {
                        const regExp = /\`|\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\+|\=|\[|\{|\]|\}|\||\\|\'|\<|\,|\.|\>|\?|\/|\""|\;|\:|\_|\d/;
                        if (regExp.test(item[key])) {
                            result = false;
                        }
                        if (item[key]?.length > 255) {
                            result = false;
                        }
                    }
                    if (key === "phone") {
                        if (item[key].startsWith('0') && item[key]?.length !== 10) {
                            result = false;
                        }
                        if (item[key].startsWith('84') && item[key]?.length !== 11) {
                            result = false;
                        }
                        if (!item[key].startsWith('0') || item[key].startsWith('84')) {
                            result = false;
                        }
                        const phoneHeader = ['86', '96', '97', '98', '32', '33', '34', '35', '36', '37', '38', '39', '88', '91', '94', '93', '84', '85', '81', '82',
                            '83', '89', '90', '93', '70', '79', '77', '76', '78', '92', '56', '58', '99', '59']
                        if (item[key].startsWith('0') && !phoneHeader.includes(item[key].substring(1, 3))
                            || item[key].startsWith('84') && !phoneHeader.includes(item[key].substring(2, 4))) {
                            result = false;
                        }
                    }
                    if (key === "identity_card_id") {
                        const char = /^[A-Za-z]*$/;
                        const int = /^[0-9]*$/;
                        // if (!regExp.test(value)) return Promise.reject("Số CMND/CCCD/Hộ chiếu sai định dạng");
                        if (!char.test(item[key].charAt(0))) {
                            if (!int.test(item[key])) {
                                result = false;
                            }
                        } else {
                            if (!int.test(item[key].substring(1))) {
                                if (!int.test(item[key])) {
                                    result = false;
                                }
                            }
                        }
                        if (item[key]?.length < 8) {
                            result = false;
                        }
                        if (item[key]?.length > 12) {
                            result = false;
                        }
                    }
                    // if (key === "dob") {
                    //     if (item[key] === "Invalid date") {
                    //         result = false;
                    //     }
                    // }
                    // if (key === "id_card_issued_date") {
                    //     if (item[key] === "Invalid date") {
                    //         result = false;
                    //     }
                    // }
                    // if (key === "email") {
                    //     const validation = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
                    //     const listCheck = item[key].split("@");
                    //     if (
                    //         item[key].includes("..") ||
                    //         listCheck[0].startsWith(".") ||
                    //         listCheck[0].endsWith(".") ||
                    //         (listCheck?.length > 1 &&
                    //             listCheck[1].startsWith(".")) ||
                    //         (listCheck?.length > 1 &&
                    //             listCheck[1].endsWith("."))
                    //     ) {
                    //         result = false;
                    //     }
                    //     if (item[key]?.length > 255) {
                    //         result = false;
                    //     }
                    //     if (!validation.test(item[key])) {
                    //         result = false;
                    //     }
                    // }
                }
            })
            if (result === false) {
                NotificationError("", "Vui lòng nhập thông tin người thân")
                return;
            }

        }

        if (keyTab === "1") {
            setKeyTab("2")
        } else if (keyTab === "2") {
            setKeyTab("3")
            setisBackFromInformation(false)
        }
        document.querySelector(".detail-content").scrollTop = 0;
    }

    const backStep = () => {
        if (keyTab === "2") {
            setisBackFromInformation(true)
            setKeyTab("1")
        } else if (keyTab === "3") {
            setKeyTab("2")
            setisBackFromInformation(true)
        }
        document.querySelector(".detail-content").scrollTop = 0;
    }
    const mortgageStatus = [
        { value: 1, name: "Đã thế chấp - cầm cố" },
        { value: 2, name: "Chưa thế chấp - cầm cố" },
    ]
    const installationLocation = [
        { value: 1, name: "Khu dân cư mật độ thấp" },
        { value: 2, name: "Khu dân cư mật độ trung bình" },
        { value: 3, name: "Khu dân cư mật độ cao" },
        { value: 4, name: "Khu công nghiệp" },
        { value: 5, name: "Khu đô thị" },
    ]
    const loanForms = [
        { value: 1, name: 'Chính chủ' },
        { value: 2, name: 'Đồng sở hữu' },
        { value: 3, name: 'Thuê' },
        { value: 4, name: 'Khác' },
    ]
    const rentStatus = [
        { value: 1, name: "Đã cho thuê" },
        { value: 2, name: "Chưa cho thuê" },
    ]
    const payForms = [
        { value: 1, name: "Chuyển khoản" },
        { value: 2, name: "Tiền mặt" },
        // { value: 3, name: "Khác" },
    ]
    const ppaStatus = [
        { value: 1, name: "Chính chủ" },
        { value: 2, name: "Không chính chủ" },
    ]
    const paymentOptions = [
        { label: 'Lương', value: '1' },
        { label: 'Bán điện', value: '2' },
        { label: 'Khác', value: '3' },
    ];
    const otherOptions = [
        { label: 'Bất động sản', value: '1' },
        { label: 'Phương tiện vận tải', value: '2' },
        { label: 'Giấy tờ có giá', value: '3' },
    ]
    const collateralOptions = [
        { label: 'Thế chấp ĐMTMN hình thành từ vốn vay', value: '1' },
        { label: 'Khác', value: '2' }
    ]
    const [city, setCity] = useState([]);
    const [distric, setDistric] = useState([]);
    const handleSelect = (item, type) => {
        setDetail({
            ...detail,
            [type]: item.value
        })
    }
    useEffect(() => {
        getConvertCity(city, detail)
    }, [city])
    const [data, setData] = useState({})
    const getConvertCity = (citys, details) => {
        let a;
        let b;
        let c;
        citys?.map((item, index) => {
            if (item.item_code === details?.customer?.installation_city) {
                a = item.id
                getDistric(a)
            }
            if (item.item_code === details?.customer?.contact_city) {
                b = item.id
                getDistricContact(b)
            }
            if (item.item_code === details?.customer?.permanent_city) {
                c = item.id
                getDistricPermanet(c)
            }
        })
        setData({
            ...detail,
            customer: {
                ...detail.customer,
                installation_city: a,
                contact_city: b,
                permanent_city: c
            }
        })


    }
    // useEffect(() => {
    //     getDistricContact(data?.customer?.contact_city)
    //     getDistricPermanet(data?.customer?.permanent_city)
    // }, [data])


    const handleOpenChat = () => {
        setOpenChatBox(true)
    }
    // console.log("detail", detail);
    const handleCloseChat = () => {
        setOpenChatBox(false)
    }

    const handleChangeIncome = (e) => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }
        typingTimeoutRef.current = setTimeout(() => {
            // setErrorLoan_amount("")
            setDetail({
                ...detail,
                customer: {
                    ...detail.customer,
                    income: e.floatValue
                }
            })
        }, 300)
    }



    const handleChangePayment = (checkedValue) => {
        setPayment(checkedValue);
    }

    const handleSelectDate = (e, type) => {
        if (type === "dob" || type === "id_card_issued_date" || type === "expiration_date") {
            setDetail({
                ...detail,
                customer: {
                    ...detail.customer,
                    // dob:moment(value, dateFormat)
                    [type]: moment(e).format('YYYY-MM-DD')

                }
            })
        }

    }

    const handleChangeInstallAdd = (e, type) => {
        // setValueAddress(e.target.value)
        if (type === "installation_address") {

            setDetail({
                ...detail,
                [type]: e.target.value

            })
        }
        if (e.target.value) {
            setErrorInstallAdd("")
        } else {
            setErrorInstallAdd("Vui lòng nhập số nhà")
        }
    }


    const getDistric = async (item) => {
        // console.log("item", item);
        const rs = await http.get(`web/dict_item/items?item_type=TinhThanh&parent_id=${item}`);
        if (rs?.status === 200) {
            setDistric(rs?.data?.data?.data);
        }
    }

    const [districContact, setdistricContact] = useState([])
    const getDistricContact = async (item) => {
        // console.log("item", item);
        const rs = await http.get(`web/dict_item/items?item_type=TinhThanh&parent_id=${item}`);
        if (rs?.status === 200) {
            setdistricContact(rs?.data?.data?.data);
        }
    }


    const [districPermanent, setdistricPermanent] = useState([])
    const getDistricPermanet = async (item) => {
        // console.log("item", item);
        const rs = await http.get(`web/dict_item/items?item_type=TinhThanh&parent_id=${item}`);
        if (rs?.status === 200) {
            setdistricPermanent(rs?.data?.data?.data);
        }
    }


    const typingTimeoutRef = useRef(null);
    const changeLoan_amount = (e) => {
        // setValueLoan_amount(e.value)
        // console.log("e",e);
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }
        typingTimeoutRef.current = setTimeout(() => {
            // setErrorLoan_amount("")
            setDetail({
                ...detail,
                loan: {
                    ...detail.loan,
                    loan_amount: e.floatValue
                }
            })
        }, 300)
    }

    const changeExpected_total_investment = (e) => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }
        typingTimeoutRef.current = setTimeout(() => {
            setDetail({
                ...detail,
                expectedTotalInvestment: e.floatValue
            })
        }, 300)
    }


    const changeSponsorship_rate = (e) => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }
        typingTimeoutRef.current = setTimeout(() => {
            setDetail({
                ...detail,
                interestRate: e.floatValue
            })
        }, 300)
    }

    const handleChangeMonth = (e) => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }
        typingTimeoutRef.current = setTimeout(() => {
            setDetail({
                ...detail,
                term: e.value
            })
        }, 300)
    }
    const handeChangeInstallCity = (value) => {
        if (value) {
            setErrorCity('')
            var id;
            var itemId;
            city.forEach((item, index) => {
                if (item.id === value) {
                    id = item.item_code
                    itemId = item.id
                }
            })
            setDetail({
                ...detail,
                customer: {
                    ...detail.customer,
                    installation_city: id,
                    contact_city: isCheckContact ? id : detail.customer.contact_city,
                    permanent_city: isCheckPermanent ? id : detail.customer.permanent_city,
                    installation_district: "",
                    // contact_district: detail?.customer?.contact_district,
                    // permanent_district: detail?.customer?.permanent_district,
                }
            })
            setData({
                ...detail,
                customer: {
                    ...detail.customer,
                    installation_city: itemId,
                    contact_city: isCheckContact ? itemId : data.customer.contact_city,
                    permanent_city: isCheckPermanent ? itemId : data.customer.permanent_city,
                    installation_district: "",
                }
            })


        } else {
            setErrorCity("Vui lòng chọn thành phố")
        }

    }
    const handeChangeInstallDistrict = (value) => {
        if (value) {
            setDetail({
                ...detail,
                customer: {
                    ...detail.customer,
                    installation_district: value,
                    contact_district: isCheckContact ? value : detail.customer.contact_district,
                    permanent_district: isCheckPermanent ? value : detail.customer.permanent_district,
                }
            })
            setData({
                ...detail,
                customer: {
                    ...data.customer,
                    installation_district: value,
                    contact_district: isCheckContact ? value : detail.customer.contact_district,
                    permanent_district: isCheckPermanent ? value : detail.customer.permanent_district,
                }
            })

        }
    }
    const handleChangeCollatera = (checkedValue) => {
        setCollateral(checkedValue);
        if (checkedValue.includes("2")) {
            setMortgage(false);
        } else {
            setMortgage(true)
        }
    }

    const handleChangeOther = (checkedValue) => {
        if (checkedValue?.length) {
            setOtherCollateral(checkedValue)
        } else {
            if (collateral.includes("1")) {
                setCollateral(["1"])
            } else {
                setCollateral([])
            }
            setMortgage(true)
        }

    }
    const handleChangePermanentAdd = (e) => {
        if (e.target.checked) {
            setCheckPermanent(true)
            setDetail({
                ...detail,
                customer: {
                    ...detail.customer,
                    permanent_address: detail?.customer.installation_address,
                    permanent_city: detail?.customer.installation_city,
                    permanent_district: detail?.customer.installation_district,
                }
            })
            setData({
                ...data,
                customer: {
                    ...data.customer,
                    permanent_address: data?.customer.installation_address,
                    permanent_city: data?.customer.installation_city,
                    permanent_district: data?.customer.installation_district,
                }
            })


        } else {
            setCheckPermanent(false)
            setDetail({
                ...detail,
                customer: {
                    ...detail.customer,
                    permanent_address: detail?.customer?.permanent_address,
                    permanent_city: null,
                    permanent_district: null,
                    // permanent_city: detail?.customer?.permanent_city,
                    // permanent_district: detail?.customer?.permanent_district,
                }
            })
            setData({
                ...data,
                customer: {
                    ...data.customer,
                    permanent_address: data?.customer.installation_address,
                    permanent_city: null,
                    permanent_district: null,
                }
            })

        }
    }

    const handleChangeWorkPlaceAddress = (e, type) => {
        if (type === "address") {
            setDetail({
                ...detail,
                workplace: {
                    ...detail.workplace,
                    [type]: e.target.value
                }
            })
        } else if (type === "company_name") {
            setDetail({
                ...detail,
                workplace: {
                    ...detail.workplace,
                    [type]: e.target.value
                }
            })
        }
    }

    const changeContractType = (e) => {
        if ((e === 0 || e === 1)) {
            setDetail({
                ...detail,
                contract_type: e

            })
        }
    }

    const handleChangeOtherIncome = (e) => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }
        typingTimeoutRef.current = setTimeout(() => {
            setDetail({
                ...detail,
                customer: {
                    ...detail.customer,
                    other_income: e.floatValue
                }
            })
        }, 300)
    }
    const handleChangeContactAdd = (e) => {
        if (e.target.checked) {
            setCheckContact(true)
            setDetail({
                ...detail,
                customer: {
                    ...detail.customer,
                    contact_address: detail.customer?.installation_address,
                    contact_city: detail.customer?.installation_city,
                    contact_district: detail.customer?.installation_district,
                }
            })
            setData({
                ...data,
                customer: {
                    ...data.customer,
                    contact_address: data.customer?.installation_address,
                    contact_city: data.customer?.installation_city,
                    contact_district: data.customer?.installation_district,
                }
            })

        } else {
            setCheckContact(false)
            setDetail({
                ...detail,
                customer: {
                    ...detail.customer,
                    contact_address: detail?.customer?.contact_address,
                    contact_city: null,
                    contact_district: null,
                    // contact_city: detail?.customer?.contact_city,
                    // contact_district: detail?.customer?.contact_district,
                }
            })
            setData({
                ...data,
                customer: {
                    ...data.customer,
                    contact_address: detail?.customer?.contact_address,
                    contact_city: null,
                    contact_district: null,
                }
            })
        }
    }

    const handleChangeSlider = (value, type) => {
        setDetail({
            ...detail,
            [type]: value
        })
    }
    const handleChangeInput = () => {

    }

    const [valueCmis, setValueCmis] = useState("")
    useEffect(() => {
        setDetail({
            ...detail,
            cmis: valueCmis,
        })
    }, [valueCmis])
    const handleChangeCustomerCode = (e) => {
        setValueCmis(e.target.value)
        if (e.target.value) {
            setDetail({
                ...detail,
                cmis: valueCmis,
            })
        }
    }
    const handleChangeInvestotal = (e) => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }
        typingTimeoutRef.current = setTimeout(() => {

            setDetail({
                ...detail,
                investmentAmount: e.floatValue
            })
        }, 300)
    }

    const handleInputPersonalInfo = (e, type) => {
        setDetail({
            ...detail,
            customer: {
                ...detail.customer,
                [type]: e.target.value
            }
        })
    }


    const handleChangeAddress = (e, type) => {

        if (type === 'permanent_city' || type === 'permanent_district' || type === 'installation_city' || type === 'installation_district'
            || type === 'contact_city' || type === 'contact_district') {
            if (type === 'permanent_city') {
                // setDetail({
                //     ...detail,
                //     customer: {
                //         ...detail.customer,
                //         [type]: e,
                //         permanent_district: null,
                //     }
                // })
                var id;
                var itemId;
                city.forEach((item, index) => {
                    if (item.id === e) {
                        id = item.item_code
                        itemId = item.id
                    }
                })
                setDetail({
                    ...detail,
                    customer: {
                        ...detail.customer,
                        permanent_city: id,
                        permanent_district: null,
                    }
                })
                setData({
                    ...detail,
                    customer: {
                        ...data.customer,
                        permanent_city: itemId,
                        permanent_district: null,
                    }
                })
            } else if (type === 'installation_city') {
                // setDetail({
                //     ...detail,
                //     customer: {
                //         ...detail.customer,
                //         [type]: e,
                //         installation_district: null,
                //     }
                // })

            } else if (type === 'contact_city') {
                var id;
                var itemId;
                city.forEach((item, index) => {
                    if (item.id === e) {
                        id = item.item_code
                        itemId = item.id
                    }
                })
                setDetail({
                    ...detail,
                    customer: {
                        ...detail.customer,
                        contact_city: id,
                        contact_district: null
                    }
                })
                setData({
                    ...data,
                    customer: {
                        ...data.customer,
                        contact_city: itemId,
                        contact_district: null
                    }
                })

            }
            else {
                setDetail({
                    ...detail,
                    customer: {
                        ...detail.customer,
                        [type]: e,
                    }
                })

            }
        } else {
            setDetail({
                ...detail,
                customer: {
                    ...detail.customer,
                    [type]: e.target.value,
                }
            })
            setData({
                ...data,
                customer: {
                    ...data.customer,
                    [type]: e,
                }
            })

        }
        if (type === "contact_district") {
            setData({
                ...data,
                customer: {
                    ...data.customer,
                    contact_district: e,
                }
            })
        }
        if (type === "permanent_district") {
            setData({
                ...data,
                customer: {
                    ...data.customer,
                    permanent_district: e,
                }
            })
        }

    }

    const handelChangeOtherIncomeDesc = (e) => {
        if (e.target.value) {
            setDetail({
                ...detail,
                customer: {
                    ...detail.customer,
                    other_income_desc: e.target.value
                }
            })
        }
    }
    const handleSelectDateRange = (e, value) => {
        const format = moment(e).format('YYYY-MM-DD');
        setDetail({
            ...detail,
            customer: {
                ...detail.customer,
                // dob:moment(value, dateFormat)
                id_card_issued_date: format
            }
        })
    }
    useEffect(() => {
        // connectSocket();
        getDetail();
        // getCity();
        // getDistric("001")
    }, [])


    const relations = [
        {
            id: 0,
            name: "Chọn quan hệ"
        },
        {
            id: 1,
            name: "Bố/mẹ"
        },
        {
            id: 2,
            name: "Vợ/Chồng"
        },
        {
            id: 3,
            name: "Anh/Chị/Em"
        },
        {
            id: 4,
            name: "Con"
        }
    ]

    const handelSelectReleativePersons = (index, value) => {
        let relative_persons = detail.relative_person;
        if (value === 2) {
            relative_persons[index] = {
                ...relative_persons[index],
                relation: value,
                name: "",
                card_number: "",
                email: "",
                id_card_issued_date: "",
                contact_address: "",
                address: "",
                phone_number: "",
                birthday: ""
            }
            form.resetFields();
            setDetail({
                ...detail,
                relative_person: relative_persons,
            })
            return
        } else {
            relative_persons[index] = {
                relation: value,
                name: "",
                card_number: "",
                phone_number: "",
            }
            form.resetFields(
                // relative_persons[index] = {
                //     relation: value,
                //     name: "",
                //     card_number: "",
                //     phone_number: "",
                // }
            );
            setDetail({
                ...detail,
                relative_person: relative_persons,
            })
            return
        }
    }

    const handleInputRelativeInfo = (e, type, index) => {
        let relative_persons = detail.relative_person;
        if (type === "birthday" || type === "id_card_issued_date") {
            relative_persons[index] = {
                ...relative_persons[index],
                [type]: moment(e).format('YYYY-MM-DD')
            }
        } else {
            relative_persons[index] = {
                ...relative_persons[index],
                [type]: e.target.value
            }
        }

        setDetail({
            ...detail,
            relative_person: relative_persons,
        })

    }

    const handleChangePayFormS = (value) => {
        setDetail({
            ...detail,
            customer: {
                ...detail.customer,
                pay_forms: value
            },
        })
    }
    const renderRelativePerson = (detail) => {
        return (
            <>
                {detail?.relative_person?.map((item, index) => {
                    return (
                        <div key={index} >
                            <Row className="related-person" >
                                <Col span={24} style={{ padding: 0 }}>
                                    <Row className="related-person">
                                        <Col span={5}>
                                            <Form.Item label={`Người thân ${index + 1}`}
                                                rules={[{ required: true, message: 'Vui lòng chọn người thân!' }]}
                                                name={`releative_persion_relations_${index}`}>
                                                <Select defaultValue={item.relation} value={item.relation}
                                                    onChange={(value) => {
                                                        handelSelectReleativePersons(index, value)
                                                    }}>
                                                    {relations.map((i) => {
                                                        return (
                                                            <Select.Option key={i.id} value={i.id}>{i.name}</Select.Option>
                                                        )
                                                    })}
                                                </Select>
                                            </Form.Item>
                                            {/* <span className="required-field" style={{ color: '#B42E2E', marginRight: 5 }}>* </span> Người thân */}

                                        </Col>
                                        <Col span={6}>
                                            <Form.Item label="Số điện thoại"
                                                // name="phone_number"
                                                name={`releative_phone_${index}`}
                                                className={item.relation ? "required-field" : ''}
                                                rules={[
                                                    () => ({
                                                        validator(rule, value) {
                                                            if (!value && item.relation) return Promise.reject("Vui lòng nhập Số điện thoại!")
                                                            if (!value && !item.relation) return Promise.resolve();
                                                            if (value && value.trim() === '') return Promise.reject("Vui lòng nhập Số điện thoại!");
                                                            const regExp = /^[0-9]*$/;
                                                            // if (!regExp.test(value.replace('+', ''))) return Promise.reject("Số điện thoại không đúng định dạng");
                                                            if (value.startsWith('0') && value?.length !== 10) return Promise.reject("Số điện thoại không đúng định dạng");
                                                            if (value.startsWith('84') && value?.length !== 11) return Promise.reject("Số điện thoại không đúng định dạng");
                                                            if (!(value.startsWith('0') || value.startsWith('84'))) return Promise.reject("Số điện thoại không đúng định dạng");
                                                            const phoneHeader = ['86', '96', '97', '98', '32', '33', '34', '35', '36', '37', '38', '39', '88', '91', '94', '93', '84', '85', '81', '82',
                                                                '83', '89', '90', '93', '70', '79', '77', '76', '78', '92', '56', '58', '99', '59']
                                                            if (value.startsWith('0') && !phoneHeader.includes(value.substring(1, 3))
                                                                || value.startsWith('84') && !phoneHeader.includes(value.substring(2, 4))) {
                                                                return Promise.reject("Số điện thoại không tồn tại");
                                                            }
                                                            return Promise.resolve();
                                                        }
                                                    })
                                                ]}
                                            >
                                                <Input className="text-input-left" defaultValue={item.phone_number} value={item.phone_number} onChange={(e) => { handleInputRelativeInfo(e, 'phone', index) }} />
                                            </Form.Item>
                                            {/* <span style={{ color: '#B42E2E', marginRight: 5 }}>* </span> Số điện thoại
                                            <Input className="text-input-left" defaultValue={item.phone_number} value={item.phone_number} onChange={(e) => { handleInputRelativeInfo(e, 'phone_number', index) }} /> */}
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item label="Tên người thân" name={`releative_name_${index}`}
                                                className={item.relation ? "required-field" : ''}
                                                rules={[
                                                    () => ({
                                                        validator(rule, value) {
                                                            // if (!value) return Promise.reject("Vui lòng nhập Tên khách hàng!");
                                                            if (!value && item.relation) return Promise.reject("Vui lòng nhập Tên người thân!")
                                                            if (!value && !item.relation) return Promise.resolve();
                                                            if (value && value.trim() === '') return Promise.reject("Vui lòng nhập Tên người thân!");
                                                            const regExp = /\`|\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\+|\=|\[|\{|\]|\}|\||\\|\'|\<|\,|\.|\>|\?|\/|\""|\;|\:|\_|\d/;
                                                            if (regExp.test(value)) return Promise.reject("Tên người thân sai định dạng")
                                                            if (value?.length > 255) return Promise.reject("Tên người thân không được lớn hơn 255 ký tự");
                                                            return Promise.resolve();
                                                        }
                                                    })
                                                ]}
                                            >
                                                <Input className="text-input-left" defaultValue={item.name ? item.name : null} value={item.name ? item.name : null} onChange={(e) => { handleInputRelativeInfo(e, 'name', index) }} />
                                            </Form.Item>
                                            {/* <span style={{ color: '#B42E2E', marginRight: 5 }}>* </span>Tên người thân
                                            <Input className="text-input-left" defaultValue={item.name} value={item.name} onChange={(e) => { handleInputRelativeInfo(e, 'name', index) }} /> */}
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item label="Số CMND/CCCD/Hộ chiếu" name={`card_number_${index}`}
                                                className={item.relation === "Vợ/Chồng" ? "required-field" : ''}
                                                rules={[
                                                    () => ({
                                                        validator(rule, value) {
                                                            // if (!value && item.relation === 2) return Promise.reject("Vui lòng nhập Số CMND/CCCD/Hộ chiếu!")
                                                            if (!value && item.relation) return Promise.reject("Vui lòng nhập Số CMND/CCCD/Hộ chiếu!")
                                                            if (!value && item.relation !== 2) return Promise.resolve();
                                                            if (value && value.trim() === '') return Promise.reject("Vui lòng nhập Số CMND/CCCD/Hộ chiếu!");
                                                            const regExp = /^[A-Za-z0-9]*$/;
                                                            const char = /^[A-Za-z]*$/;
                                                            const int = /^[0-9]*$/;
                                                            // if (!regExp.test(value)) return Promise.reject("Số CMND/CCCD/Hộ chiếu sai định dạng");
                                                            if (!char.test(value.charAt(0))) {
                                                                if (!int.test(value)) return Promise.reject("Số CMND/CCCD/Hộ chiếu sai định dạng");
                                                            } else {
                                                                if (!int.test(value.substring(1))) {
                                                                    if (!int.test(value)) return Promise.reject("Số CMND/CCCD/Hộ chiếu sai định dạng");
                                                                }
                                                            }
                                                            if (value?.length < 8) return Promise.reject("Số CMND/CCCD/Hộ chiếu sai định dạng");
                                                            if (value?.length > 12) return Promise.reject("Số CMND/CCCD/Hộ chiếu không được lớn hơn 12 ký tự");
                                                            return Promise.resolve();
                                                        }
                                                    })
                                                ]}
                                            >
                                                <Input className="text-input-left" defaultValue={item.card_number} value={item.card_number} onChange={(e) => { handleInputRelativeInfo(e, 'card_number', index) }} />
                                            </Form.Item>
                                        </Col>
                                        {item.relation === 2 ? <Col span={6}>
                                            <Form.Item
                                                label="Ngày sinh"
                                                name={`birthday_${index}`}
                                                rules={[{ required: true, message: 'Vui lòng nhập Ngày sinh!' }]}
                                            >
                                                <DatePicker
                                                    // inputReadOnly
                                                    placeholder="Chọn ngày"
                                                    format={"DD/MM/YYYY"}
                                                    onChange={(e) => handleInputRelativeInfo(e, "birthday", index)}
                                                    defaultValue={item?.birthday ? moment(item?.birthday) : null}
                                                    disabledDate={(currentDate) => {
                                                        const currentTimes = currentDate?.valueOf();
                                                        const nowTimes = moment().endOf("day").valueOf();
                                                        return currentTimes >= nowTimes;
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col> : null}
                                        {item.relation === 2 ? <Col span={6}>
                                            <Form.Item className="required-field" label="Nơi cư trú hiện tại" name={`address_${index}`}
                                                rules={[
                                                    () => ({
                                                        validator(rule, value) {
                                                            if (!value && item.relation) return Promise.reject("Vui lòng nhập Nơi cư trú!")
                                                            if (!value && !item.relation) return Promise.resolve();
                                                            if (!value) return Promise.resolve();
                                                            if (value && value.trim() === '') return Promise.reject("Vui lòng nhập Nơi cư trú!");
                                                            if (value?.length > 255) return Promise.reject("Nơi cư trú không được lớn hơn 255 ký tự");
                                                            return Promise.resolve();
                                                        }
                                                    })
                                                ]}
                                            >
                                                <Input className="text-input-left" defaultValue={item.contact_address} value={item.contact_address} onChange={(e) => { handleInputRelativeInfo(e, 'contact_address', index) }} />
                                            </Form.Item>
                                        </Col> : null}
                                        {item.relation === 2 ? <Col span={6}>
                                            <Form.Item className="required-field" label="Hộ khẩu thường trú" name={`permanent_address_${index}`}
                                                rules={[
                                                    () => ({
                                                        validator(rule, value) {
                                                            if (!value && item.relation) return Promise.reject("Vui lòng nhập Hộ khẩu thường trú!")
                                                            if (!value && !item.relation) return Promise.resolve();// if (!value) return Promise.reject("Vui lòng nhập Tên khách hàng!");
                                                            if (!value) return Promise.resolve();
                                                            if (value && value.trim() === '') return Promise.reject("Vui lòng nhập Nơi cư trú!");
                                                            if (value?.length > 255) return Promise.reject("Nơi cư trú không được lớn hơn 255 ký tự");
                                                            return Promise.resolve();
                                                        }
                                                    })
                                                ]}
                                            >
                                                <Input className="text-input-left" value={item.address} defaultValue={item.address} onChange={(e) => { handleInputRelativeInfo(e, 'permanent_address', index) }} />
                                            </Form.Item>
                                        </Col> : null}
                                        {item.relation === 2 ? <Col span={6}>
                                            <Form.Item label="Ngày cấp"
                                                name={`id_card_issued_date_${index}`}
                                                rules={[{ required: true, message: 'Vui lòng chọn ngày cấp CMND/CCCD/Hộ chiếu' }]}>
                                                <DatePicker placeholder="Chọn ngày" format={dateFormat} onChange={(e) => handleInputRelativeInfo(e, "id_card_issued_date", index)}
                                                    defaultValue={item.id_card_issued_date ? moment(item.id_card_issued_date) : null}
                                                    // value={item.id_card_issued_date ? moment(item.id_card_issued_date, dateFormat) : null}
                                                    disabledDate={(currentDate) => {
                                                        const currentTimes = currentDate?.valueOf();
                                                        const nowTimes = moment().endOf("day").valueOf();
                                                        return currentTimes >= nowTimes;
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col> : null}
                                        {item.relation === 2 ? <Col span={6}>
                                            <Form.Item className="required-field" label="Email"
                                                name={`email_${index}`}
                                                rules={[({ getFieldValue }) => ({
                                                    validator(rule, value) {
                                                        const validation = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
                                                        if (value) {
                                                            const listCheck = value.split("@");

                                                            if (
                                                                value.includes("..") ||
                                                                listCheck[0].startsWith(".") ||
                                                                listCheck[0].endsWith(".") ||
                                                                (listCheck?.length > 1 &&
                                                                    listCheck[1].startsWith(".")) ||
                                                                (listCheck?.length > 1 &&
                                                                    listCheck[1].endsWith("."))
                                                            ) {
                                                                return Promise.reject(
                                                                    "Email không đúng định dạng!"
                                                                );
                                                            }
                                                            if (value?.length > 255) {
                                                                return Promise.reject(
                                                                    "Email vượt quá 255 ký tự!"
                                                                );
                                                            }
                                                            if (validation.test(value)) {
                                                                return Promise.resolve();
                                                            }
                                                            return Promise.reject(
                                                                "Email không đúng định dạng!"
                                                            );
                                                        } else {
                                                            // if (!item.relation) {
                                                            //     return Promise.reject("Vui lòng nhập Emai!");
                                                            // }
                                                            if (!value) {
                                                                return Promise.reject("Vui lòng nhập Emai!");
                                                            }
                                                            return Promise.resolve();
                                                        }
                                                    },
                                                }),]}>
                                                <Input className="text-input-left" onChange={(e) => handleInputRelativeInfo(e, "email", index)} defaultValue={item.email} placeholder="Example@gmail.com" value={item.email} />
                                            </Form.Item>
                                        </Col> : null}
                                        <Col span={1} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <DeleteOutlined onClick={() => handleDeleteRelatedPerson(index)} style={{ cursor: 'pointer' }} />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>

                        </div>
                    )
                })}

            </>
        )
    }
    const handleDeleteRelatedPerson = (index) => {
        let data = [...detail.relative_person]
        if (data?.length > 1) {
            let relative_persons = data.filter((item, i) => i !== index);
            setDetail({
                ...detail,
                relative_person: relative_persons
            })
            form.resetFields()
        } else {
            NotificationError("", "Bắt buộc phải có một người thân")
        }

    }

    const changeGender = (value) => {
        setDetail({
            ...detail,
            customer: {
                ...detail.customer,
                gender: value
            }
        });
        form.setFieldsValue({ gender: value });
    }
    const addRelativePersion = () => {
        if (detail.relative_person?.length === 5) return;
        let relative_persons = detail.relative_person;
        relative_persons.push({
            relation: "Chọn quan hệ",
            name: "",
            identity_card_id: "",
            phone_number: "",
        })
        setDetail({
            ...detail,
            relative_person: relative_persons,
        })
    }
    return (
        <div className="loan-detail">
            <div className="breadcrumb">
                <span onClick={() => close()}>{user === 'Khách hàng vay tiêu dùng' ? 'Theo dõi khoản vay' : 'Xét duyệt'}</span> <RightOutlined /> <span style={{ color: '#1D4994' }}>Khoản vay {detail?.loan_code}</span>
            </div>
            <div className="detail-content">
                <Form layout="vertical" form={form}>
                    <Tabs defaultActiveKey={keyTab} activeKey={keyTab} type="card" size={size}>
                        <TabPane tab="Thông tin khoản vay" key="1" >
                            <div className="loan_infoS">
                                <div className="l-border">
                                    <div className="info-title">
                                        <div>1. Phương án lắp đặt</div>
                                        <div className="title-line"></div>
                                    </div>
                                    <Row className="l-row-title">
                                        <Col span={12} className="l-row-left">
                                            <div className="content-title"><span style={{ color: '#B42E2E' }}>*</span> Số nhà</div>
                                            {/* <Form.Item

                                                rules={[{ required: true, message: 'Vui lòng nhập số nhà!' }]}
                                            >
                                                <Input value={detail?.installation_address || null} defaultValue={detail?.installation_address || null}
                                                    className="text-input-left" onChange={(e) => handleChangeInstallAdd(e)} />
                                            </Form.Item> */}
                                            <Form.Item
                                                // name="installation_address"
                                                rules={[{ required: true, message: 'Vui lòng điền số nhà !' }]}
                                            >
                                                <Input
                                                    value={detail?.installation_address || null}
                                                    defaultValue={detail?.installation_address || null} onChange={(e) => handleChangeInstallAdd(e, "installation_address")}
                                                    className="text-input-left" />
                                                {errorInstallAdd ? <span style={{ color: '#B42E2E' }}>{errorInstallAdd}</span> : null}
                                            </Form.Item>

                                        </Col>
                                        <Col span={12} className="l-row-right">
                                            <Checkbox onChange={(e) => handleChangePermanentAdd(e)}>Trùng địa chỉ thường trú</Checkbox>
                                            <Checkbox onChange={(e) => handleChangeContactAdd(e)}>Trùng địa chỉ liên lạc</Checkbox>
                                        </Col>
                                    </Row>
                                    <Row className="l-row-title">
                                        <Col span={12} className="l-row-left">
                                            <div className="content-title"><span style={{ color: '#B42E2E' }}>*</span> Thành phố</div>
                                            <Select style={{ width: '100%' }} className="text-input-left"
                                                // defaultValue={detail?.customer?.installation_city ? detail?.customer?.installation_city : null} value={detail?.customer?.installation_city ? detail?.customer?.installation_city : null}
                                                defaultValue={data?.customer?.installation_city ? data?.customer?.installation_city : null}
                                                value={data?.customer?.installation_city ? data?.customer?.installation_city : null}

                                                onChange={(e) => {
                                                    handeChangeInstallCity(e)
                                                    getDistric(e);
                                                }}>
                                                {city?.map((item) => (
                                                    <Select.Option value={item.id}>{item?.item_name}</Select.Option>
                                                )
                                                )}
                                            </Select>
                                            {errorCity ? <span style={{ color: '#B42E2E' }}>{errorCity}</span> : null}
                                        </Col>
                                        <Col span={12} className="l-row-right">
                                            <div className="content-title"><span style={{ color: '#B42E2E' }}>*</span> Quận/Huyện</div>
                                            <Select style={{ width: '100%' }} className="text-input-left"
                                                defaultValue={detail?.customer?.installation_district ? detail?.customer?.installation_district : null} value={detail?.customer?.installation_district ? detail?.customer?.installation_district : null}
                                                onChange={(e) => {
                                                    handeChangeInstallDistrict(e)
                                                }}>
                                                {distric?.map((item) => (
                                                    <Option value={item.item_code}>{item?.item_name}</Option>
                                                ))}
                                            </Select>
                                            {/* {errorDistrict ? <span style={{ color: '#B42E2E' }}>{errorDistrict}</span> : null} */}
                                        </Col>
                                    </Row>
                                    <Row className="l-row-title">
                                        <Col span={12} className="l-row-left">
                                            <div className="content-title"><span style={{ color: '#B42E2E' }}>*</span> Số tiền đầu tư</div>

                                            <Form.Item
                                                name="investment_amount"
                                                rules={[{ required: true, message: 'Vui lòng nhập số tiền đầu tư!' }]}
                                            >
                                                <span className="ant-input-affix-wrapper ant-input-affix-wrapper-borderless">
                                                    <NumberFormat
                                                        customInput={Input}
                                                        thousandSeparator={true}
                                                        onValueChange={(_) => handleChangeInvestotal(_)}
                                                        className="text-input-left "
                                                        // defaultValue={loanDetail?.expected_total_investment || null}
                                                        value={detail?.investmentAmount || null}
                                                    />
                                                    <span className="ant-input-suffix suffix-style">VND</span>
                                                </span>
                                                {/* {errorInvestment_amount ? <span style={{ color: '#B42E2E' }}>{errorInvestment_amount}</span> : null} */}
                                            </Form.Item>

                                        </Col>
                                        <Col span={12} className="l-row-right wattage">
                                            <Row>
                                                <Col span={12}>
                                                    <div className="content-title">Công suất</div>
                                                </Col>
                                                <Col span={12}>
                                                    <Input onChange={(e) => handleChangeInput(e, "power_capacity")} className="suffix-style" defaultValue={detail.power_capacity} value={detail.power_capacity} suffix="kWP" />
                                                </Col>
                                            </Row>
                                            {/* <Col style={{top: 40}} span={12} className="l-text-right l-blue"><span className="l-font-bold">{info.wattage}</span> kWp</Col> */}
                                            <Slider style={{ marginTop: 30 }} onChange={value => handleChangeSlider(value, 'power_capacity')} marks={marksWattage} dots={false} min={sliderWattage?.min} max={sliderWattage?.max} defaultValue={detail?.power_capacity} value={detail?.power_capacity} />
                                        </Col>
                                    </Row>
                                    <div className="info-title">
                                        <div>2. Phương án vay</div>
                                        <div className="title-line"></div>
                                    </div>
                                    <Row className="l-row-title">
                                        <Col span={12} className="l-row-left">
                                            <Row>
                                                <Col span={12} className="l-center l-title">Tổng mức đầu tư dự kiến</Col>
                                                <Col span={12}>
                                                    {/* <Input onChange={(e) => handleChangeInput(e, "expected_total_investment")} className="suffix-style" value={info.expected_total_investment ? info.expected_total_investment.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0} suffix="VNĐ" /> */}
                                                    <Form.Item
                                                        name="expected_TotalInvestment"
                                                        rules={[{ required: true, message: 'Vui lòng nhập tổng mức đầu tư dự kiến!' }]}
                                                    >
                                                        <span className="ant-input-affix-wrapper ant-input-affix-wrapper-borderless">
                                                            <NumberFormat
                                                                customInput={Input}
                                                                thousandSeparator={true}
                                                                onValueChange={(_) => changeExpected_total_investment(_)}
                                                                className="text-input-left "
                                                                // defaultValue={loanDetail?.expected_total_investment || null}
                                                                value={detail?.expectedTotalInvestment || null}
                                                            />
                                                            <span className="ant-input-suffix suffix-style">VND</span>
                                                        </span>
                                                        {/* {errorInvestTotal ? <span style={{ color: '#B42E2E' }}>{errorInvestTotal}</span> : null} */}
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col span={12} className="l-row-right">
                                            <Row>
                                                <Col span={12} className="l-center l-title">Tỉ lệ tài trợ</Col>
                                                <Col span={12}>
                                                    {/* <Input className="suffix-style" suffix="%" onChange={changeSponsorship_rate} defaultValue={sponsorship_rate} /> */}

                                                    <Form.Item
                                                        name="interestRate"
                                                        // rules={[{ required: true, message: 'Vui lòng nhập tỉ lệ tài trợ!' }]}
                                                        rules={[
                                                            () => ({
                                                                validator(rule, value) {
                                                                    if (!value) return Promise.reject("Vui lòng nhập tỉ lệ tài trợ!")
                                                                    if (value > 85) return Promise.reject("Vui lòng nhập tỉ lệ tài trợ nhỏ hơn 85%!")
                                                                    return Promise.resolve();
                                                                }
                                                            })
                                                        ]}
                                                    >
                                                        <span class="ant-input-affix-wrapper ant-input-affix-wrapper-borderless">
                                                            <NumberFormat
                                                                customInput={Input}
                                                                thousandSeparator={true}
                                                                onValueChange={(_) => changeSponsorship_rate(_)}
                                                                className="text-input-left "
                                                                value={detail?.interestRate || null}
                                                            />
                                                            <span class="ant-input-suffix suffix-style">%</span>
                                                        </span>

                                                    </Form.Item>
                                                    {/* {errorRate ? <span style={{ color: '#B42E2E' }}>{errorRate}</span> : null} */}

                                                </Col>
                                            </Row>
                                            {/* {sponsorship_rate > 85 ? <span className="warning-rate">{ERROR_SPONSOR_RATE}</span> : null} */}
                                        </Col>
                                    </Row>
                                    <Row className="l-row-title">
                                        <Col span={12} className="l-row-left">
                                            <Row>
                                                <Col span={12} className="l-title">Số tiền vay</Col>
                                                <Col span={12}>
                                                    <Form.Item
                                                        name="power_consume"
                                                        rules={[{ required: true, message: 'Vui lòng nhập số tiền vay!' }]}
                                                    >
                                                        <span class="ant-input-affix-wrapper ant-input-affix-wrapper-borderless">
                                                            <NumberFormat
                                                                customInput={Input}
                                                                allowEmptyFormatting={true}
                                                                thousandSeparator={true}
                                                                isNumericString={true}
                                                                onValueChange={(_) => changeLoan_amount(_)}
                                                                className="text-input-left "
                                                                value={detail?.loan?.register_amount || null}
                                                            />
                                                            <span class="ant-input-suffix suffix-style">VND</span>
                                                        </span>
                                                    </Form.Item>
                                                    {errorLoan_amount ? <span style={{ color: '#B42E2E' }}>{errorLoan_amount}</span> : null}

                                                    {/* <Input onChange={(e) => handleChangeInput(e, "loan_amount")} className="suffix-style" value={info.loan_amount ? info.loan_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0} suffix="VNĐ" /> */}
                                                </Col>
                                                {/* <Col span={12} className="l-text-right l-red"><span className="l-font-bold">{loanAmountStr}</span></Col> */}
                                            </Row>
                                        </Col>
                                        <Col span={12} className="l-row-right">
                                            <Row>
                                                <Col span={12} className="l-title">Thời hạn vay</Col>
                                                <Col span={12}>
                                                    <Form.Item
                                                        name="term"
                                                        // rules={[{ required: true, message: 'Vui lòng nhập thời hạn vay!' }]}
                                                        rules={[
                                                            () => ({
                                                                validator(rule, value) {
                                                                    if (!value) return Promise.reject("Vui lòng nhập thời hạn vay!")
                                                                    if (value?.length > 3) return Promise.reject("Vui lòng nhập thời hạn vay không được quá 3 ký tự!")
                                                                    return Promise.resolve();
                                                                }
                                                            })
                                                        ]}
                                                    >
                                                        <span class="ant-input-affix-wrapper ant-input-affix-wrapper-borderless">
                                                            <NumberFormat
                                                                customInput={Input}
                                                                thousandSeparator={true}
                                                                onValueChange={(_) => handleChangeMonth(_)}
                                                                className="text-input-left "
                                                                // defaultValue={detail?.term || null}
                                                                value={detail?.term || null}
                                                            />
                                                            <span class="ant-input-suffix suffix-style">Tháng</span>
                                                        </span>
                                                        {/* {errorMonth ? <span style={{ color: '#B42E2E' }}>{errorMonth}</span> : null} */}
                                                    </Form.Item>


                                                    {/* <Input onChange={handleChangeMonth} className="suffix-style" defaultValue={info.term} suffix="Tháng" /> */}
                                                </Col>

                                            </Row>

                                        </Col>
                                    </Row>
                                    <Row style={{ marginBottom: 20 }}>
                                        <Col span={12} className="l-row-left">
                                            <div className="l-title">
                                                Tài sản bảo đảm
						                </div>
                                            <Checkbox.Group options={collateralOptions} defaultValue={collateral} value={collateral} onChange={handleChangeCollatera} />
                                            {!isMortgage ? <div style={{ marginTop: 10 }}>
                                                <span style={{ textDecoration: 'underline' }}>Phương thức thế chấp khác</span>
                                                <Checkbox.Group style={{ marginTop: 10 }} options={otherOptions} value={otherCollateral} defaultValue={otherOptions[0].value} onChange={handleChangeOther} />
                                            </div> : null}
                                        </Col>
                                        <Col span={12} className="l-row-left">
                                            <div className="l-title">
                                                Hình thức trả nợ
						                </div>
                                            <Checkbox.Group options={paymentOptions} value={payment} defaultValue={paymentOptions[0].value} onChange={handleChangePayment} />
                                        </Col>
                                    </Row>
                                    <div className="info-title">
                                        <div>3. Thông tin khác</div>
                                        <div className="title-line"></div>
                                    </div>
                                    <Row>
                                        <Col span={12} className="l-row-left l-title l-black">
                                            Hiện trạng sử dụng nhà ở nơi lắp đặt
					                </Col>
                                        <Col className="l-row-right l-title l-black" span={12}>
                                            Hình thức sở hữu nhà nơi lắp đặt
					                </Col>
                                    </Row>
                                    <Row className="l-b-margin-20">
                                        <Col span={12} className="l-row-left">
                                            <div className="l-list-button">
                                                {rentStatus.map((item, index) => {
                                                    return (
                                                        // <Button key={index} onClick={() => { handleSelect(item, 'rental_status') }} className={detail.rental_status === item.value ? 'active' : ''} type="primary" shape="round" size="default">{item.name}</Button>
                                                        <Button key={index} onClick={() => { handleSelect(item, 'rentalStatus') }} className={detail.rentalStatus === item.value ? 'active' : ''} type="primary" shape="round" size="default">{item.name}</Button>
                                                    )
                                                })}
                                            </div>
                                        </Col>
                                        <Col span={12} className="l-row-right">
                                            <div className="l-list-button">
                                                {loanForms.map((item, index) => {
                                                    return (
                                                        <Button key={index} onClick={() => { handleSelect(item, 'ownership_type') }} className={detail.ownership_type === item.value ? 'active' : ''} type="primary" shape="round" size="default">{item.name}</Button>
                                                    )
                                                })}
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={12} className="l-row-left l-title">
                                            Hiện trạng đảm bảo dân sự nhà ở nơi lắp đặt
					                </Col>
                                        <Col span={12} className="l-row-right l-title">
                                            Chủ thể ký hợp đồng mua điện với EVN
					                </Col>
                                    </Row>
                                    <Row className="l-b-margin-20">
                                        <Col span={12} className="l-row-left">
                                            <div className="l-list-button">
                                                {mortgageStatus.map((item, index) => {
                                                    return (
                                                        // <Button key={index} onClick={() => { handleSelect(item, 'mortgage_status') }} className={detail.mortgage_status === item.value ? 'active' : ''} type="primary" shape="round" size="default">{item.name}</Button>
                                                        <Button key={index} onClick={() => { handleSelect(item, 'mortgageStatus') }} className={detail.mortgageStatus === item.value ? 'active' : ''} type="primary" shape="round" size="default">{item.name}</Button>
                                                    )
                                                })}
                                            </div>
                                        </Col>
                                        <Col span={12} className="l-row-right">

                                            <div className="l-list-button">
                                                {ppaStatus.map((item, index) => {
                                                    return (
                                                        <Button key={index} onClick={() => { handleSelect(item, "ppaType") }} className={detail.ppaType === item.value ? 'active' : ''} type="primary" shape="round" size="default">{item.name}</Button>
                                                    )
                                                })}
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={12} className="l-row-left l-title">
                                            Vị trí nhà ở nơi lắp đặt
					                </Col>
                                        <Col span={12} className="l-row-right l-title">
                                            <span style={{ color: '#B42E2E', marginRight: 5 }}></span> Mã khách hàng điện lực
					                </Col>
                                    </Row>
                                    <Row className="l-b-margin-20">
                                        <Col span={12} className="l-row-left">
                                            <div className="l-list-button">
                                                {installationLocation.map((item, index) => {
                                                    return (
                                                        <Button key={index} onClick={() => { handleSelect(item, 'installationLocation') }} className={detail.installationLocation === item.value ? 'active' : ''} type="primary" shape="round" size="default">{item.name}</Button>
                                                    )
                                                })}
                                            </div>
                                        </Col>
                                        <Col span={12} className="l-row-left">
                                            <Input defaultValue={detail?.cmis || null} value={detail?.cmis || null} className="text-input-left" onChange={handleChangeCustomerCode} />
                                            {/* {errorCodeCustomer ? <span style={{ color: '#B42E2E' }}>{errorCodeCustomer}</span> : null} */}
                                        </Col>
                                    </Row>

                                </div>
                                <div className="btn-register-loan" onClick={nextStep}>
                                    {isBackFromInformation ? "Tiếp theo" : "Cập nhât"} <img src={iRight} />
                                </div>
                            </div>
                        </TabPane>
                        <TabPane tab="Thông tin  cá nhân" key="2">
                            <div className="loan_infoS">
                                <div className="l-border">
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div className=" l-title l-black">Thông tin cá nhân</div>

                                    </div>
                                    <Row>
                                        <Col span={12} className=" l-row-left">
                                            <Form.Item label="Tên khách hàng theo CMND/CCCD (có dấu)"
                                                className="require-style"
                                                name="name"
                                                rules={[
                                                    () => ({
                                                        validator(rule, value) {
                                                            if (!value) return Promise.reject("Vui lòng nhập Tên khách hàng!");
                                                            if (value && value.trim() === '') return Promise.reject("Vui lòng nhập Tên khách hàng!");
                                                            const regExp = /\`|\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\+|\=|\[|\{|\]|\}|\||\\|\'|\<|\,|\.|\>|\?|\/|\""|\;|\:|\_|\d/;
                                                            if (regExp.test(value)) return Promise.reject("Tên khách hàng sai định dạng")
                                                            if (value?.length > 255) return Promise.reject("Tên khách hàng không được lớn hơn 255 ký tự");
                                                            return Promise.resolve();
                                                        }
                                                    })
                                                ]}
                                            >
                                                <Input disabled className="text-input-left" defaultValue={detail?.customer?.name} value={detail?.customer?.name} onChange={(e) => { handleInputPersonalInfo(e, 'name') }} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} className=" l-row-right">
                                            <Form.Item label="Ngày sinh"
                                                name="dob"
                                                rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
                                            >
                                                <DatePicker placeholder="Chọn ngày" format={dateFormat} onChange={(e) => { handleSelectDate(e, "dob") }}
                                                    defaultValue={detail?.customer?.dob ? moment(detail?.customer?.dob) : null}
                                                    value={detail?.customer?.dob ? moment(detail?.customer?.dob) : null}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row >
                                        <Col span={12} className="l-row-left">
                                            <Form.Item label="Số CMND/CCCD/Hộ chiếu"
                                                className="require-style"
                                                name="card_number"
                                                rules={[
                                                    () => ({
                                                        validator(rule, value) {
                                                            if (!value) return Promise.reject("Vui lòng nhập Số CMND/CCCD/Hộ chiếu!");
                                                            if (value && value.trim() === '') return Promise.reject("Vui lòng nhập Số CMND/CCCD/Hộ chiếu!");
                                                            const regExp = /^[A-Za-z0-9]*$/;
                                                            const char = /^[A-Za-z]*$/;
                                                            const int = /^[0-9]*$/;

                                                            if (!char.test(value.charAt(0))) {
                                                                if (!int.test(value)) return Promise.reject("Số CMND/CCCD/Hộ chiếu sai định dạng");
                                                            } else {
                                                                if (!int.test(value.substring(1))) {
                                                                    if (!int.test(value)) return Promise.reject("Số CMND/CCCD/Hộ chiếu sai định dạng");
                                                                }
                                                            }
                                                            if (value?.length > 12) return Promise.reject("Số CMND/CCCD/Hộ chiếu không được lớn hơn 12 ký tự");
                                                            return Promise.resolve();
                                                        }
                                                    })
                                                ]}>
                                                <Input disabled className="text-input-left" defaultValue={detail?.customer?.identity_card_id} value={detail?.customer?.identity_card_id} onChange={(e) => { handleInputPersonalInfo(e, 'card_number') }} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} className="l-row-right">
                                            <Form.Item label="Ngày cấp"
                                                name="id_card_issued_date"
                                                rules={[{ required: true, message: 'Vui lòng chọn ngày cấp CMND/CCCD/Hộ chiếu' }]}>
                                                <DatePicker placeholder="Chọn ngày" format={dateFormat} onChange={(e) => handleSelectDate(e, "id_card_issued_date")}
                                                    defaultValue={detail?.customer?.id_card_issued_date ? moment(detail?.customer?.id_card_issued_date) : null}
                                                    value={detail?.customer?.id_card_issued_date ? moment(detail?.customer?.id_card_issued_date) : null}
                                                // defaultValue={detail?.customer?.id_card_issued_date ? moment(detail?.customer?.id_card_issued_date, dateFormat) : null}
                                                // value={detail?.customer?.id_card_issued_date ? moment(detail?.customer?.id_card_issued_date, dateFormat) : null}
                                                />

                                            </Form.Item>
                                        </Col>

                                    </Row>
                                    <Row>
                                        <Col span={12} className="l-row-left">
                                            <Form.Item label="Nơi cấp"
                                                name="issued_by"
                                                rules={[{ required: true, message: 'Vui lòng chọn nơi cấp CMND/CCCD/Hộ chiếu' }]}>
                                                <Input className="text-input-left" defaultValue={detail?.customer?.issued_by}
                                                    value={detail?.customer?.issued_by} onChange={(e) => { handleInputPersonalInfo(e, 'issued_by') }} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} className="l-row-right">
                                            <Form.Item label="Hộ chiếu"
                                                name="passport"
                                            >
                                                <Input className="text-input-left" defaultValue={detail?.customer?.passport}
                                                    value={detail?.customer?.passport} onChange={(e) => { handleInputPersonalInfo(e, 'passport') }} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={12} className="l-row-left">
                                            <Form.Item label="Ngày hết hạn"
                                                name="expiration_date"
                                            >
                                                <DatePicker placeholder="Chọn ngày" format={dateFormat} onChange={(e) => handleSelectDate(e, "expiration_date")}
                                                    defaultValue={detail?.customer?.expiration_date ? moment(detail?.customer?.expiration_date) : null}
                                                    value={detail?.customer?.expiration_date ? moment(detail?.customer?.expiration_date) : null}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} className="l-row-right">
                                            <Form.Item label="Tình trạng hôn nhân"
                                                name="marital_status"
                                                rules={[{ required: true, message: 'Vui lòng chọn tình trạng hôn nhân' }]}>
                                                <Select style={{ width: '100%' }}
                                                    defaultValue={detail?.customer?.maritaStatus ? detail?.customer?.maritaStatus : null}
                                                    onChange={(value) => {
                                                        let a = marital?.filter(e => e.id === value);
                                                        handleChangePayForm(value)
                                                    }}
                                                    placeholder='Chọn tình trạng hôn nhân'>
                                                    {
                                                        marital?.map((item) => {
                                                            return (
                                                                <Option value={item.value}>{item.name}</Option>
                                                            )
                                                        })
                                                    }
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={12} className="l-row-left">
                                            <Form.Item className="require-style" label="Email" name="p_email" rules={ruleEmail}>
                                                <Input className="text-input-left" disabled defaultValue={detail?.customer?.contact_email} value={detail?.customer?.contact_email} onChange={(e) => { handleInputPersonalInfo(e, 'email') }} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} className="l-row-right">
                                            <Form.Item label="Số điện thoại"
                                                className="require-style"
                                                name="phone_number"
                                                rules={[
                                                    () => ({
                                                        validator(rule, value) {
                                                            if (!value) return Promise.reject("Vui lòng nhập Số điện thoại!");
                                                            if (value && value.trim() === '') return Promise.reject("Vui lòng nhập Số điện thoại!");
                                                            const regExp = /^[0-9]*$/;

                                                            if (value.startsWith('0') && value?.length !== 10) return Promise.reject("Số điện thoại không đúng định dạng");
                                                            if (value.startsWith('84') && value?.length !== 11) return Promise.reject("Số điện thoại không đúng định dạng");
                                                            if (!(value.startsWith('0') || value.startsWith('84'))) return Promise.reject("Số điện thoại không đúng định dạng");
                                                            const phoneHeader = ['86', '96', '97', '98', '32', '33', '34', '35', '36', '37', '38', '39', '88', '91', '94', '93', '84', '85', '81', '82',
                                                                '89', '90', '93', '70', '79', '77', '76', '78', '92', '56', '58', '99', '59']
                                                            if (value.startsWith('0') && !phoneHeader.includes(value.substring(1, 3))
                                                                || value.startsWith('84') && !phoneHeader.includes(value.substring(2, 4))) {
                                                                return Promise.reject("Số điện thoại không tồn tại");
                                                            }
                                                            return Promise.resolve();
                                                        }
                                                    })
                                                ]}>
                                                <Input className="text-input-left" defaultValue={detail?.customer?.contact_phone} value={detail?.customer?.contact_phone} onChange={(e) => { handleInputPersonalInfo(e, 'contact_phone') }} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={12} className="l-row-left">
                                            <Form.Item className="require-style"
                                                label="Địa chỉ liên lạc"
                                                // name="contact_address"
                                                rules={[() => ({
                                                    validator(rule, value) {
                                                        if (!value) return Promise.reject("Vui lòng nhập Địa chỉ liên lạc!");
                                                        if (value?.length > 255) return Promise.reject("Địa chỉ liên lạc không được lớn hơn 255 ký tự");
                                                        return Promise.resolve();
                                                    }
                                                })
                                                ]}
                                            >
                                                <Input disabled={isCheckContact} className="text-input-left"
                                                    value={detail?.customer?.contact_address ? detail?.customer?.contact_address : null}
                                                    defaultValue={detail?.customer?.contact_address}
                                                    onChange={(e) => { handleChangeAddress(e, 'contact_address') }} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} className="l-row-right">
                                            <Form.Item className="require-style" label="Giới tính" name="gender"
                                            >
                                                <div className="l-list-button">
                                                    <Button type="primary" className={`${detail?.customer?.gender === GENDERS.M ? 'active' : ''}`} shape="round" size="default" onClick={() => { changeGender(GENDERS.M) }}>Nam</Button>
                                                    <Button type="primary" className={`${detail?.customer?.gender === GENDERS.F ? 'active' : ''}`} shape="round" size="default" onClick={() => { changeGender(GENDERS.F) }}>Nữ</Button>
                                                </div>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={12} className="l-row-left">
                                            <div className=""><span style={{ color: '#B42E2E', fontWeight: 300 }}>*</span> Thành phố</div>
                                            <Select style={{ width: '100%' }} disabled={isCheckContact} className="text-input-left"
                                                defaultValue={data?.customer?.contact_city ? data?.customer?.contact_city : null}
                                                value={data?.customer?.contact_city ? data?.customer?.contact_city : null}
                                                // defaultValue={detail?.customer?.contact_city}
                                                // value={detail?.customer?.contact_city}
                                                onChange={(e) => {
                                                    handleChangeAddress(e, 'contact_city')
                                                    // getDistric(e)
                                                    getDistricContact(e)
                                                }}>
                                                {city?.map((item) => (
                                                    <Select.Option value={item.id}>{item?.item_name}</Select.Option>
                                                ))}
                                            </Select>
                                        </Col>
                                        <Col span={12} className="l-row-right">
                                            <div className=""><span style={{ color: '#B42E2E', fontWeight: 300 }}>*</span> Quận/Huyện</div>
                                            <Select style={{ width: '100%' }} disabled={isCheckContact} className="text-input-left"
                                                value={data?.customer?.contact_district ? data?.customer?.contact_district : null}
                                                defaultValue={data?.customer?.contact_district ? data?.customer?.contact_district : null}
                                                onChange={(e) => { handleChangeAddress(e, 'contact_district') }}>
                                                {/* {districContact?.map((item) => (
                                                    <Select.Option value={item.item_code}>{item?.item_name}</Select.Option>
                                                ))} */}
                                                {/* {distric?.map((item) => (
                                                    <Select.Option value={item.item_code}>{item?.item_name}</Select.Option>
                                                ))} */}
                                                {
                                                    isCheckContact ? distric?.map((item) => (
                                                        <Select.Option value={item.item_code}>{item?.item_name}</Select.Option>
                                                    )) : districContact?.map((item) => (
                                                        <Select.Option value={item.item_code}>{item?.item_name}</Select.Option>
                                                    ))
                                                }
                                            </Select>
                                        </Col>
                                    </Row>
                                    <Row style={{ marginTop: 10 }}>
                                        <Col span={12} className="l-row-left">
                                            <Form.Item className="require-style" label="Địa chỉ thường trú" name="permanent_address2"
                                                rules={[() => ({
                                                    validator(rule, value) {
                                                        if (!value) return Promise.reject("Vui lòng nhập Địa chỉ thường trú!");
                                                        if (value?.length > 255) return Promise.reject("Địa chỉ thường trú không được lớn hơn 255 ký tự");
                                                        return Promise.resolve();
                                                    }
                                                })
                                                ]}
                                            >
                                                <Input disabled={isCheckPermanent}
                                                    className="text-input-left" defaultValue={detail?.customer?.permanent_address} value={detail?.customer?.permanent_address} onChange={(e) => { handleChangeAddress(e, 'permanent_address') }} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={12} className="l-row-left">
                                            {/* <Form.Item className="require-style" label="Thành phố" name="permanent_city"
                                                rules={[() => ({
                                                    validator(rule, value) {
                                                        if (!value) return Promise.reject("Vui lòng chọn thành phố!");
                                                        return Promise.resolve();
                                                    }
                                                })
                                                ]}
                                            >
                                                <Select disabled={isCheckPermanent} className="text-input-left"
                                                    defaultValue={detail?.customer?.permanent_city} value={detail?.customer?.permanent_city}
                                                    onChange={(e) => {
                                                        handleChangeAddress(e, 'permanent_city')
                                                        getDistric(e)
                                                    }}>
                                                    {city?.map((item) => (
                                                        <Select.Option value={item.item_code}>{item?.item_name}</Select.Option>
                                                    ))}
                                                </Select>
                                            </Form.Item> */}
                                            <div className=""><span style={{ color: '#B42E2E', fontWeight: 300 }}>*</span> Thành phố</div>
                                            <Select style={{ width: '100%' }} disabled={isCheckPermanent} className="text-input-left"
                                                defaultValue={data?.customer?.permanent_city ? data?.customer?.permanent_city : null}
                                                value={data?.customer?.permanent_city ? data?.customer?.permanent_city : null}
                                                onChange={(e) => {
                                                    handleChangeAddress(e, 'permanent_city')
                                                    // getDistric(e)
                                                    getDistricPermanet(e)

                                                }}>
                                                {city?.map((item) => (
                                                    <Select.Option value={item.id}>{item?.item_name}</Select.Option>
                                                ))}
                                            </Select>
                                        </Col>
                                        <Col span={12} className="l-row-right">
                                            <div className=""><span style={{ color: '#B42E2E' }}>*</span>Quận/Huyện</div>
                                            <Select style={{ width: '100%', marginBottom: 20 }}
                                                disabled={isCheckPermanent} className="text-input-left"
                                                defaultValue={data?.customer?.permanent_district ? data?.customer?.permanent_district : null}
                                                value={data?.customer?.permanent_district ? data?.customer?.permanent_district : null}
                                                onChange={(e) => { handleChangeAddress(e, 'permanent_district') }}>

                                                {
                                                    isCheckPermanent ? distric?.map((item) => (
                                                        <Select.Option value={item.item_code}>{item?.item_name}</Select.Option>
                                                    )) : districPermanent?.map((item) => (
                                                        <Select.Option value={item.item_code}>{item?.item_name}</Select.Option>
                                                    ))
                                                }

                                                {/* {districPermanent?.map((item) => (
                                                    <Select.Option value={item.item_code}>{item?.item_name}</Select.Option>
                                                ))} */}
                                            </Select>
                                        </Col>
                                    </Row>
                                    <Row style={{ marginTop: 15, marginBottom: 15 }}>
                                        <Col span={12} className="l-row-left">
                                            <Form.Item className="require-style" label="Địa chỉ lắp đặt điện mặt trời"
                                                name="installation_address"
                                                rules={[() => ({
                                                    validator(rule, value) {
                                                        if (!value) return Promise.reject("Vui lòng nhập Địa chỉ lắp đặt điện mặt trời!");
                                                        if (value?.length > 255) return Promise.reject("Địa chỉ lắp đặt điện mặt trời không được lớn hơn 255 ký tự");
                                                        return Promise.resolve();
                                                    }
                                                })
                                                ]}			>
                                                <Input disabled className="text-input-left" defaultValue={detail?.customer?.installation_address} onChange={(e) => { handleChangeAddress(e, 'install') }} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={12} className="l-row-left">
                                            {/* <Form.Item className="require-style" label="Thành phố" name="installation_city"
                                                rules={[() => ({
                                                    validator(rule, value) {
                                                        if (!value) return Promise.reject("Vui lòng chọn thành phố!");
                                                        return Promise.resolve();
                                                    }
                                                })
                                                ]}
                                            >
                                                <Select disabled className="text-input-left"
                                                    defaultValue={detail?.customer?.installation_city ? detail?.customer?.installation_city : null} 
                                                    value={detail?.customer?.installation_city ? detail?.customer?.installation_city : null}
                                                    onChange={(e) => {
                                                        handleChangeAddress(e, 'installation_city')
                                                        // handeChangeInstallCity(e)
                                                        getDistric(e)
                                                    }}>        
                                                    {city?.map((item) => (
                                                        <Select.Option value={item.id}>{item?.item_name}</Select.Option>
                                                    ))}
                                                </Select>
                                            </Form.Item> */}
                                            <div className=""><span style={{ color: '#B42E2E' }}>*</span> Thành phố</div>
                                            <Select style={{ width: '100%', marginBottom: 20 }} disabled className="text-input-left"

                                                defaultValue={data?.customer?.installation_city ? data?.customer?.installation_city : null}
                                                value={data?.customer?.installation_city ? data?.customer?.installation_city : null}
                                                onChange={(e) => {
                                                    handleChangeAddress(e, 'installation_city')
                                                    // handeChangeInstallCity(e)
                                                    getDistric(e)
                                                }}>
                                                {city?.map((item) => (
                                                    <Select.Option value={item.id}>{item?.item_name}</Select.Option>
                                                ))}
                                            </Select>
                                        </Col>
                                        <Col span={12} className="l-row-right">

                                            <div className=""><span style={{ color: '#B42E2E' }}>*</span>Quận/Huyện</div>
                                            <Select style={{ width: '100%', marginBottom: 20 }}
                                                disabled className="text-input-left" defaultValue={detail?.customer?.installation_district} value={detail?.customer?.installation_district} onChange={(e) => { handleChangeAddress(e, 'installation_district') }}>
                                                {distric?.map((item) => (
                                                    <Select.Option value={item.item_code}>{item?.item_name}</Select.Option>
                                                ))}
                                            </Select>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={12} className="l-row-left">
                                            {/* <span style={{ color: '#B42E2E', marginRight: 5 }}>* </span> Mức lương */}
                                            <Form.Item
                                                name="amount"
                                                label="Mức lương"
                                                rules={[{ required: true, message: 'Vui lòng nhập mức lương!' }]}
                                            >
                                                <NumberFormat
                                                    customInput={Input}
                                                    allowEmptyFormatting={true}
                                                    thousandSeparator={true}
                                                    isNumericString={true}
                                                    onValueChange={(_) => handleChangeIncome(_)}
                                                    className="text-input-left "
                                                    value={detail?.customer?.income || null}
                                                    defaultValue={detail?.customer?.income || null}
                                                />

                                                {/* <NumberFormat
                                                    customInput={Input}
                                                    thousandSeparator={true}
                                                    onValueChange={(_) => handleChangeIncome(_)}
                                                    className="text-input-left"
                                                    value={detail?.customer?.income || null}
                                                /> */}
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} className="l-row-right">
                                            {/* <span style={{ color: '#B42E2E', marginRight: 5, marginLeft: 15 }}>* </span> Hình thức nhận lương */}
                                            <Form.Item
                                                name="payment"
                                                label="Hình thức nhận lương"
                                                rules={[{ required: true, message: 'Vui lòng chọn hình thức nhận lương' }]}
                                            >
                                                <Select style={{ width: '100%' }} className="text-input-left"
                                                    onChange={(value) => {
                                                        // let a = payForms?.filter(e => e.value === value);
                                                        handleChangePayFormS(value)
                                                    }}
                                                    defaultValue={detail?.customer?.pay_forms}
                                                    placeholder="Chọn hình thức nhận lương">
                                                    {
                                                        payForms?.map((item) => {
                                                            return (
                                                                <Option value={item.value} >{item.name}</Option>
                                                            )
                                                        })
                                                    }
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col span={12} className="l-row-left ">
                                            {/* <span style={{ color: '#B42E2E', marginRight: 5 }}></span> Thu nhập khác */}
                                            <Form.Item
                                                name="amounts"
                                                label="Thu nhập khác"
                                            >
                                                <NumberFormat
                                                    customInput={Input}
                                                    thousandSeparator={true}
                                                    onValueChange={(_) => handleChangeOtherIncome(_)}
                                                    className="text-input-left"
                                                    defaultValue={detail?.customer?.other_income || null}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} className="l-row-right ">
                                            {/* <span style={{ color: '#B42E2E', marginRight: 5,marginLeft:15 }}></span>Mô tả thu nhập khác */}
                                            <Form.Item
                                                label="Mô tả thu nhập khác"
                                                name="other_income_desc"
                                            >
                                                <Input defaultValue={detail?.customer?.other_income_desc || null} className="text-input-left"
                                                    onChange={handelChangeOtherIncomeDesc}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={12} className="l-row-left ">
                                            {/* <span style={{ color: '#B42E2E', marginRight: 5}}>* </span> Nơi làm việc */}
                                            <Form.Item
                                                name="working_address"
                                                label="Nơi làm việc"
                                                rules={[{ required: true, message: 'Vui lòng điền nơi làm việc !' }]}
                                            >
                                                <Input defaultValue={detail?.workplace?.address || null}
                                                    value={detail?.workplace?.address || null}
                                                    // onChange={changeWorkingAddress}
                                                    onChange={(e) => handleChangeWorkPlaceAddress(e, "address")}
                                                    className="text-input-left" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} className="l-row-right ">
                                            {/* <span style={{ color: '#B42E2E', marginRight: 5,marginLeft:15 }}>* </span> Địa chỉ làm việc */}
                                            <Form.Item
                                                label="Địa chỉ làm việc"
                                                name="company_name"
                                                rules={[{ required: true, message: 'Vui lòng điền địa chỉ làm việc !' }]}
                                            >
                                                <Input
                                                    value={detail?.workplace?.company_name || null}
                                                    defaultValue={detail?.workplace?.company_name || null} onChange={(e) => handleChangeWorkPlaceAddress(e, "company_name")}
                                                    className="text-input-left" />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={12} className="l-row-left ">
                                            <span style={{ color: '#B42E2E', marginRight: 5 }}>* </span> Loại hợp đồng
                                            <Form.Item
                                                name="contractype"
                                                rules={[{ required: true, message: 'Vui lòng chọn loại hợp đồng !' }]}

                                            >
                                                <Select style={{ width: '100%' }} defaultValue={detail?.contract_type}
                                                    onChange={(e) => { changeContractType(e) }}
                                                    required className="text-input-left" placeholder='Chọn loại hợp đồng' bordered={true} >
                                                    <Select.Option value={0}>Ngắn hạn</Select.Option>
                                                    <Select.Option value={1}>Dài hạn</Select.Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <div className="l-title l-black">Thông tin người thân</div>
                                    {renderRelativePerson(detail)}
                                    {detail?.relative_person?.length < 5 ? <div className="loan-btn-add-relative-persion">
                                        <Button type="primary" onClick={addRelativePersion}>Thêm <PlusCircleOutlined /></Button>
                                    </div> : null}
                                    {/* <Row>
                                        <Col xs={24} sm={12}>
                                            <h4>Địa chỉ lắp đặt</h4>
                                            <h2>{detail?.installation_address}</h2>
                                            <h4>Công suất lắp đặt</h4>
                                            <h2 className="loan_number">{detail?.power_capacity?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} kWp</h2>
                                            <h4>Số tiền đầu tư</h4>
                                            <h2 className="loan_number">{detail?.loan?.register_amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VNĐ</h2>
                                        </Col>
                                        <Col xs={24} sm={12}>
                                            <img className="img-loan-info" src={investInfo} />
                                        </Col>
                                    </Row>  */}
                                </div>
                            </div>
                            <div className="l-list-button-action">
                                <Button icon={<ArrowLeftOutlined />} onClick={backStep}>Trở lại</Button>
                                <Button type="primary" onClick={nextStep}>  {isBackFromInformation ? "Tiếp theo" : "Tiếp theo"} <ArrowRightOutlined /></Button>
                            </div>

                        </TabPane>
                        <TabPane tab="File đính kèm" key="3">
                            <div className="attach-title">Thông tin đính kèm</div>
                            <Table
                                scroll={scroll}
                                className="attach-table"
                                dataSource={dataSource}
                                columns={columns}
                                rowKey="key"
                            />
                            {/* <Table
                                scroll={scroll}
                                className="attach-table template-table"
                                dataSource={templateList}
                                columns={columnTemplate}
                                rowKey="key"
                            /> */}
                            <div className="l-list-button-action">
                                <Button icon={<ArrowLeftOutlined />} onClick={backStep}>Trở lại</Button>
                                {detail?.loan?.status === "NEW" ? <Button type="primary" onClick={update}>  {isBackFromInformation ? "Cập nhật" : "Cập nhật"} <ArrowRightOutlined /></Button> : null}

                            </div>
                        </TabPane>
                    </Tabs>
                </Form>
                {/* <div className="attach-title">Thông tin đính kèm</div>
                <Table
                    scroll={scroll}
                    className="attach-table"
                    dataSource={dataSource}
                    columns={columns}
                    rowKey="key"
                />
                <div className="attach-title">Lịch sử giao dịch</div>
                <Table
                    scroll={scroll}
                    className="attach-table"
                    dataSource={transactionHistory}
                    columns={columnHistory}
                    rowKey="key"
                /> */}
            </div>
            <Modal
                className="modal-view-attachment"
                title="Chi tiết tệp đính kèm"
                visible={visibleModalDetail}
                onCancel={handleCancelModalDetail}
            >
                <div className="detail-content">
                    <div className="left-btn">
                        <Button disabled={currentPage === 0 ? true : false}><LeftOutlined onClick={(record) => handlePreFile(record)} /></Button>
                    </div>
                    <div className="center-content">
                        {
                            isDoc ? <iframe src={url} frameBorder="0" style={{ width: '100%', height: '100%' }}></iframe>
                                : <img src={url} style={{ height: '100%', width: '100%' }} />}

                    </div>
                    <div className="right-btn">
                        <Button disabled={currentPage === (max - 1)}><RightOutlined onClick={(record) => handleNextFile(record)} /></Button>
                    </div>
                </div>
            </Modal>
            <Modal
                className="modal-view-attachment"
                title="Chi tiết biểu mẫu"
                visible={visibleModalTemplate}
                onCancel={handleCancelModalTemplate}
            >
                <div className="detail-content">
                    <div className="center-content">
                        {
                            <iframe src={urlTemp} frameborder="0" scrolling="no" width="100%" height="100%"></iframe>
                        }

                    </div>
                </div>
            </Modal>
        </div>
    )
}
