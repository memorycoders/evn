import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Button, Checkbox, Col, Input, Row, Select, Slider, Form, Modal, Table } from 'antd';

import iRight from '../../../asset/images/longRight.png'
import DetailLoanRepayment from './DetailLoanRepayment';
import { getRepaymentPlan } from '../../../store/loans/action';
import { ERROR_CHECK_RULES_LOAN, ERROR_SPONSOR_RATE } from '../../../utils/messages';
import http from "../../../apis/http";
import NumberFormat from 'react-number-format';
import { NotificationError } from '../../../common/components/Notification';
const { Option } = Select;

const LoanInfomation = (props) => {

	const { updateTab, info, setInfo, getRepaymentPlan, repaymentPlan, listRule, setRuleChecked, isBackFromInformation, loanDetail,
		collateral, setOtherCollateral, otherCollateral, setCollateral, payment, setPayment, isCheckContact, isCheckPermanent,
		setCheckContact, setCheckPermanent } = props;
	const [isShowPopup, showPopup] = useState(false);
	const [messageError, setMessageError] = useState("");
	const [total_investment_str, setTotalInvestmentStr] = useState(loanDetail.expected_total_investment ?
		`${loanDetail.expected_total_investment / 1000000} triệu` : `${info.expected_total_investment / 1000000} triệu`)
	const [loanAmountStr, setLoanAmountStr] = useState(loanDetail.loan_amount ?
		`${loanDetail.loan_amount / 1000000} triệu` : `${info.loan_amount / 1000000} triệu`)
	const [rate, setRate] = useState(0);
	const [isMortgage, setMortgage] = useState(true);
	const [errorInstallAdd, setErrorInstallAdd] = useState("");
	const [errorInvestTotal, setErrorInvestTotal] = useState("");
	const [errorCodeCustomer, setCodeCustomer] = useState("");
	// const [errorIncome, setIncome] = useState("");
	// const [errorPayForm, setPayForm] = useState("");
	const [errorCity, setErrorCity] = useState("");
	const [errorDistrict, setErrorDistrict] = useState("");
	const [errorOtherIncome, setOtherIncome] = useState("");
	const [errorOtherIncomeDesc, setOtherIncomeDesc] = useState("");
	const [errorContractType, setErrorContractType] = useState("");
	// const [errorWorkingAddress, setErrorWorkingAddress] = useState("");
	const [errorCompanyName, setErrorCompanyName] = useState("");
	const [errorInvestment_amount, setErrorInvestment_amount] = useState("")
	const [errorLoan_amount, setErrorLoan_amount] = useState("")
	const [sponsorship_rate, setSponsorship_rate] = useState(0)
	const [errorRate, setErrorRate] = useState("")
	const [errorMonth, setErrorMonth] = useState("")


	const [contractType, setContractType] = useState(3);
	const [showInvestModal, setShowInvestModal] = useState(false);
	const [dataSourceInvestment, setDataSourceInvestment] = useState([]);
	const [object, setObject] = useState('');
	const [voltage, setVoltage] = useState('2-<3');
	const [roof, setRoof] = useState('mai_bang');
	const [type, setType] = useState(1);
	const [form] = Form.useForm();
	const [formFirst] = Form.useForm();
	const [city, setCity] = useState([]);
	const [distric, setDistric] = useState([]);
	// console.log("info", info);

	useEffect(() => {
		getCity();
		if (!isBackFromInformation) {
			localStorage.setItem("isDuplicateAddress", false);
			localStorage.setItem("isDuplicateAddressContact", false);
			localStorage.setItem("isCompanyEVN", false);
		}
	}, []);
	const listFilter = [
		{
			id: 'packageName',
			name: 'Tên gói'
		},
		{
			id: 'id',
			name: 'Mã ĐG'
		},
		{
			id: 'provider',
			name: 'Nhà cung cấp'
		},
		{
			id: 'customerType',
			name: 'ĐTKH'
		},
		{
			id: 'voltage',
			name: 'Điện áp'
		},
		{
			id: 'roofType',
			name: 'Loại mái'
		},
		{
			id: 'systemType',
			name: 'Hệ'
		},
		{
			id: 'price',
			name: 'Đơn giá'
		},
		{
			id: 'status',
			name: 'Trạng thái'
		}
	];
	const onFinish = async (values) => {
		console.log('values', values)
		const rs = await http.get(`web/quotation/package?key=${values?.filter}&value=${values?.search}&pageIndex=0&pageSize=5`);
		if (rs?.status === 200) {
			NotificationSuccess("", "Thành công");
			setDataSource(rs?.data?.data?.content);
		}
	}
	const changeFilter = async (value) => {
		const rs = await http.get(`web/quotation/package?key=${value}&pageIndex=0&pageSize=5`);
		if (rs?.status === 200) {
			NotificationSuccess("", "Thành công");
			setDataSource(rs?.data?.data?.content);
		}
	}
	const handleSearch = () => {
		form.submit();
		let a = form.getFieldValue('filter');
		let b = form.getFieldValue('search');
	}
	const loanForms = [
		{ value: 1, name: 'Chính chủ' },
		{ value: 2, name: 'Đồng sở hữu' },
		{ value: 3, name: 'Thuê' },
		{ value: 4, name: 'Khác' },
	]
	const repaymentMethods = [
		{ value: 1, name: 'Lương' },
		{ value: 2, name: 'Phát điện' },
		{ value: 3, name: 'Nguồn khác' },
	]
	const installationLocation = [
		{ value: 1, name: "Khu dân cư mật độ thấp" },
		{ value: 2, name: "Khu dân cư mật độ trung bình" },
		{ value: 3, name: "Khu dân cư mật độ cao" },
		{ value: 4, name: "Khu công nghiệp" },
		{ value: 5, name: "Khu đô thị" },
	]
	const mortgageStatus = [
		{ value: 1, name: "Đã thế chấp - cầm cố" },
		{ value: 2, name: "Chưa thế chấp - cầm cố" },
	]
	const rentStatus = [
		{ value: 1, name: "Đã cho thuê" },
		{ value: 2, name: "Chưa cho thuê" },
	]
	const typeRoof = [
		{ value: 1, name: "Mái tôn" },
		{ value: 2, name: "Mái bằng" },
		{ value: 3, name: "Mái ngói" },
	]
	const ppaStatus = [
		{ value: 1, name: "Chính chủ" },
		{ value: 2, name: "Không chính chủ" },
	]
	const sliderMoney = {
		min: 0,
		max: 500000000
	}
	const sliderExpectedTotal = {
		min: 0,
		max: 1000000000
	}
	const sliderYear = {
		min: 1,
		max: 5
	}
	const sliderWattage = {
		min: 0,
		max: 50
	}


	const payForms = [
		{ value: 1, name: "Chuyển khoản" },
		{ value: 2, name: "Tiền mặt" },
		// { value: 3, name: "Khác" },
	]


	const columns = [
		{
			title: 'STT',
			dataIndex: 'id',
			render: id => {
				if (id) {
					return <div>{id}</div>
				}
			}
		},
		{
			title: 'TÊN GÓI',
			dataIndex: 'name'
		},
		{
			title: 'ĐƠN GIÁ (VNĐ)',
			dataIndex: 'don_gia'
		}
	]

	useEffect(() => {
		if (loanDetail.sponsorship_rate) {
			setRate(loanDetail.sponsorship_rate)
		} else {
			setRate(Math.round((info.loan_amount / info.expected_total_investment) * 100))
		}
	}, [])




	useEffect(() => {
		if (loanDetail.id) {
			setRuleChecked({
				...listRule,
				agreeContractorService: true,
			})
			const temp = (loanDetail.collateral >>> 0).toString(2).split('').reverse();
			let tempCollateral = [];
			if (temp[0] && temp[0] === "1") {
				tempCollateral.push("3")
				setMortgage(false)
			}
			if (temp[1] && temp[1] === "1") {
				tempCollateral.push("2")
				setMortgage(false)
			}
			if (temp[2] && temp[2] === "1") {
				tempCollateral.push("1")
				setMortgage(false)
			}
			if ((temp[3] && temp[3] === "1") && ((temp[2] && temp[2] === "1")) || (temp[1] && temp[1] === "1") || (temp[0] && temp[0] === "1")) {
				setCollateral(["1", "2"]);
				setMortgage(false)
			}
			if (!temp[3] && ((temp[2] && temp[2] === "1")) || (temp[1] && temp[1] === "1") || (temp[0] && temp[0] === "1")) {
				setCollateral(["2"]);
				setMortgage(false)
			}
			if ((temp[3] && temp[3] === "1") && (temp[2] && temp[2] !== "1") && (temp[1] && temp[1] !== "1") && (temp[0] && temp[0] === "1")) {
				setCollateral(["1"]);
				setMortgage(true)
			}
			setOtherCollateral(tempCollateral);

			const temp2 = (loanDetail.repayment_method >>> 0).toString(2).split('').reverse();
			let tempPaymentMethod = [];
			if (temp2[0] && temp2[0] === "1") {
				tempPaymentMethod.push("3")
			}
			if (temp2[1] && temp2[1] === "1") {
				tempPaymentMethod.push("2")
			}
			if (temp2[2] && temp2[2] === "1") {
				tempPaymentMethod.push("1")
			}
			setPayment(tempPaymentMethod);
		}
	}, [loanDetail])

	function formatter(value) {
		let val = value / 1000000;
		return `${val === 1000 ? '1 tỷ' : `${val}  triệu`}`;
	}

	const marksExpectedTotal = {
		[sliderExpectedTotal.min]: `${sliderExpectedTotal.min === 0 ? "0" : sliderExpectedTotal.min / 1000000} triệu`,
		[sliderExpectedTotal.max]: `1 tỷ`,
	};
	const marksWattage = {
		[sliderWattage.min]: `${sliderWattage.min} kWp`,
		[sliderWattage.max]: `${sliderWattage.max} kWp`,
	}
	const marksMoney = {
		[sliderMoney.min]: `${sliderMoney.min === 0 ? "0" : sliderMoney.min / 1000000} triệu`,
		[sliderMoney.max]: `${sliderMoney.max / 1000000} triệu`,
	};
	const marksYears = {
		[sliderYear.min]: `${sliderYear.min} năm`,
		[sliderYear.max]: `${sliderYear.max} năm`
	};
	const nextStep = () => {
		if (!info.installation_address) {
			setErrorInstallAdd("Vui lòng nhập số nhà")
		}
		if (!info.investment_amount) {
			setErrorInvestment_amount("Vui lòng chọn số tiền đầu tư!")
		}
		if (!info.expected_total_investment) {
			setErrorInvestTotal("Vui lòng nhập tổng mức đầu tư dự kiến")
		}
		if (!info.loan_amount) {
			setErrorLoan_amount("Vui lòng nhập số tiền vay")
		}
		if (info.interest_rate < 1) {
			setErrorRate("Vui lòng nhập tỉ lệ tài trợ")
		}
		if (info.interest_rate > 85) {
			setErrorRate("Tỉ lệ tài trợ không được vượt quá 85 %")
			return;
		}
		if (!info.term) {
			setErrorMonth("Vui lòng nhập thời hạn vay")
		}
		if (info.term > 999) {
			setErrorMonth("Vui lòng nhập thời hạn vay chứa 3 ký tự")
			return;
		}
		// if (!info.cmis) {
		// 	setCodeCustomer("Vui lòng nhập Mã khách hàng điện lực!")
		// }

		// if (!info.working_information.income) {
		// 	setIncome("Vui lòng nhập mức lương")
		// }
		// if (!info.working_information.pay_forms) {
		// 	setPayForm("Vui lòng chọn hình thức trả lương")
		// }

		// if (contractType === 3) {
		// 	setErrorContractType("Vui lòng chọn loại hợp đồng!")
		// };
		if (!info.relative_persons.length === 0) {
			return NotificationError("", "Vui lòng nhập đầy đủ thông tin người thân!")
		}

		if (rate > 85) {
			setMessageError(ERROR_SPONSOR_RATE);
			return;
		}
		// if (!info.working_information.working_address) {
		// 	setErrorWorkingAddress("Vui lòng điền địa chỉ nơi làm việc!");
		// }
		// if (!info.working_information.company_name) setErrorCompanyName("Vui lòng chọn nơi làm việc!")
		if (info.installation_address && info.investment_amount
			&& info.expected_total_investment && info.interest_rate && info.loan_amount && info.term) {
			updateTab(1);
		}
		if (!info.installation_district) {
			setErrorDistrict("Vui lòng chọn quận/huyện");
		}
		if (!info.installation_city) {
			setErrorCity("Vui lòng chọn thành phố")
		}
	}
	const toggleChecked = (key) => {
		setRuleChecked({
			...listRule,
			[key]: !listRule[key]
		})
	};

	const paymentOptions = [
		{ label: 'Lương', value: '1' },
		{ label: 'Bán điện', value: '2' },
		{ label: 'Khác', value: '3' },
	];

	const collateralOptions = [
		{ label: 'Thế chấp ĐMTMN hình thành từ vốn vay', value: '1' },
		{ label: 'Khác', value: '2' }
	]

	const otherOptions = [
		{ label: 'Bất động sản', value: '1' },
		{ label: 'Phương tiện vận tải', value: '2' },
		{ label: 'Giấy tờ có giá', value: '3' },
	]

	const getCity = async () => {
		const rs = await http.get(`web/dict_item/items?item_type=TinhThanh`);
		if (rs?.status === 200) {
			setCity(rs?.data?.data?.data);
		}
	}
	const getDistric = async (item) => {
		const rs = await http.get(`web/dict_item/items?item_type=TinhThanh&parent_id=${item}`);
		if (rs?.status === 200) {
			setDistric(rs?.data?.data?.data);
		}
	}

	const handleChangeSlider = (value, type) => {
		let _info = {
			...info,
			[type]: value
		}
		if (type === 'term') {
			let timeTerm = new Date();
			timeTerm = new Date(timeTerm.setFullYear(timeTerm.getFullYear() + value));
			_info = {
				..._info,
				timeTerm: timeTerm
			}
		}
		if (type === 'expected_total_investment' || type === 'loan_amount') {
			let rate = Math.round((_info.loan_amount / _info.expected_total_investment) * 100)
			if (rate > 85) return;
			if (type === 'loan_amount') {
				setLoanAmountStr(formatter(value))
			}
			if (type === 'expected_total_investment') {
				setTotalInvestmentStr(formatter(value))
			}
			setRate(rate)
		}
		setInfo(_info)
	}

	const handleSelect = (item, type) => {
		setInfo({
			...info,
			[type]: item.value
		})
	}

	const viewRepaymentDetail = () => {
		let data = {
			loan_amount: info.loan_amount,
			interest_rate: info.interest_rate,
			term: info.term * 12
		}
		getRepaymentPlan(data)
		showPopup(true);
	}

	const handleChangePayment = (checkedValue) => {
		setPayment(checkedValue);
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
		if (checkedValue.length) {
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
			setInfo({
				...info,
				permanent_address: info.installation_address,
				permanent_city: info.installation_city,
				permanent_district: info.installation_district,
			})
		} else {
			setCheckPermanent(false)
			setInfo({
				...info,
				permanent_address: 0,
				permanent_city: 0,
				permanent_district: 0,
			})
		}
	}

	const handleChangeContactAdd = (e) => {
		if (e.target.checked) {
			setCheckContact(true)
			setInfo({
				...info,
				contact_address: info.installation_address,
				contact_city: info.installation_city,
				contact_district: info.installation_district,
			})
		} else {
			setCheckContact(false)
			setInfo({
				...info,
				contact_address: 0,
				contact_city: 0,
				contact_district: 0,
			})
		}
	}

	const [valueInstallAdd, setValueInstallAdd] = useState("")
	useEffect(() => {
		setInfo({
			...info,
			installation_address: valueInstallAdd,
			personal_information: {
				...info.personal_information,
				address: valueInstallAdd
			}
		})
	}, [valueInstallAdd])
	const handleChangeInstallAdd = (e) => {
		setValueInstallAdd(e.target.value)
		if (e.target.value) {
			if (e.target.value.length > 255) {
				setErrorInstallAdd("Địa chỉ lắp đặt không được vượt quá 255 ký tự!")
			} else {
				setErrorInstallAdd("")
				setInfo({
					...info,
					installation_address: valueInstallAdd,
					// installation_address: e.target.value,
					contact_address: isCheckContact ? e.target.value : "",
					permanent_address: isCheckPermanent ? e.target.value : "",
					personal_information: {
						...info.personal_information,
						address: valueInstallAdd
					}
				})
			}
		} else {
			setErrorInstallAdd("Vui lòng nhập Địa chỉ lắp đặt!")
		}
	}



	const handeChangeInstallCity = (value) => {
		if (value) {
			setErrorCity('')
			setInfo({
				...info,
				installation_city: value,
				contact_city: isCheckContact ? value : null,
				permanent_city: isCheckPermanent ? value : null,
				installation_district: null,
			})
			formFirst.resetFields();
		} else {
			setErrorCity("Vui lòng chọn thành phố")
		}
	}

	const handeChangeInstallDistrict = (value) => {
		if (value) {
			setErrorDistrict("")
			setInfo({
				...info,
				installation_district: value,
				contact_district: isCheckContact ? value : null,
				permanent_district: isCheckPermanent ? value : null,

			})
		} else {
			setErrorDistrict("Vui lòng chọn quận/huyện")
		}
	}


	const [valueInvestment_amount, setValueInvestment_amount] = useState(0)
	useEffect(() => {
		setInfo({
			...info,
			investment_amount: valueInvestment_amount
		})
	}, [valueInvestment_amount])
	const handleChangeInvestotal = (e) => {
		setValueInvestment_amount(e.floatValue)
		if (e.floatValue) {
			setErrorInvestment_amount("")
			setInfo({
				...info,
				investment_amount: valueInvestment_amount
			})
		} else {
			setErrorInvestment_amount("Vui lòng nhập số tiền đầu tư!")
		}
	}

	const [valueRate, setValueRate] = useState(0)
	useEffect(() => {
		setInfo({
			...info,
			interest_rate: valueRate
		})
	}, [valueRate])
	const changeSponsorship_rate = (e) => {
		setValueRate(e.floatValue)
		if (e.floatValue) {
			setErrorRate("")
			if (e.floatValue > 85) {
				setErrorRate("Tỉ lệ tài trợ không được vượt quá 85 %")
			} else {
				setInfo({
					...info,
					interest_rate: valueRate
				})
			}
		} else {
			setErrorRate("Chưa nhập tỉ lệ tài trợ")
		}
	}
	const [valueMonth, setValueMonth] = useState(0)
	useEffect(() => {
		setInfo({
			...info,
			term: valueMonth
		})
	}, [valueMonth])
	const handleChangeMonth = (e) => {
		setValueMonth(e.value)
		if (e.floatValue) {
			setErrorMonth("")
			if (e.floatValue > 999) {
				setErrorMonth("Thời hạn vay không được vượt quá 3 ký tự")
			} else {
				setInfo({
					...info,
					term: valueMonth
				})
			}
		} else {
			setErrorMonth("Vui lòng nhập thời hạn vay")
		}
	}


	const [valueCmis, setValueCmis] = useState("")
	useEffect(() => {
		setInfo({
			...info,
			cmis: valueCmis,
		})
	}, [valueCmis])
	const handleChangeCustomerCode = (e) => {
		setValueCmis(e.target.value)
		if (e.target.value) {
			setCodeCustomer("")
			setInfo({
				...info,
				cmis: valueCmis,
			})
		} else {
			setCodeCustomer("Vui lòng nhập Mã khách hàng điện lực!")
		}
	}

	const handleChangeIncome = (e) => {
		// if (e.target.value) {
		// 	setIncome("")
		// 	setInfo({
		// 		...info,
		// 		working_information: {
		// 			...info.working_information,
		// 			income: e.target.value
		// 		}
		// 	})
		// } else {
		// 	setIncome("Vui lòng nhập mức lương!")
		// }
		if (e.floatValue) {
			setIncome("")
			setInfo({
				...info,
				working_information: {
					...info.working_information,
					income: e.floatValue
				}
			})
		} else {
			setIncome("Vui lòng nhập mức lương!")
		}
	}

	const handleChangePayForm = (value) => {
		if (value) {
			setPayForm("")
			setInfo({
				...info,
				working_information: {
					...info.working_information,
					pay_forms: value
				}
			})
		} else {
			setPayForm("Vui lòng chọn hình thức trả lương")
		}


	}

	const handleChangeOtherIncome = (e) => {
		if (e.target.value) {
			setOtherIncome("")
			setInfo({
				...info,
				working_information: {
					...info.working_information,
					other_income: e.target.value,
				}
			})
		} else {
			setOtherIncome("Vui lòng nhập thu nhập khác!")
		}
	}

	const handleChangeDescIncome = (e) => {
		if (e.target.value) {
			setOtherIncomeDesc("")
			setInfo({
				...info,
				working_information: {
					...info.working_information,
					other_income_desc: e.target.value,
				}
			})
		} else {
			setOtherIncomeDesc("Vui lòng nhập mô tả thu nhập khác!")
		}
	}

	const changeWorkingAddress = (e) => {
		if (e.target.value) {
			setErrorWorkingAddress("");
			setInfo({
				...info,
				working_information: {
					...info.working_information,
					working_address: e.target.value,
				}
			})
		} else setErrorWorkingAddress("Vui lòng nhập địa chỉ nơi làm việc!")
	}

	const changeComapnyName = (e) => {
		if (e.target.value) {
			setErrorCompanyName("");
			setInfo({
				...info,
				working_information: {
					...info.working_information,
					company_name: e.target.value,
				}
			})
		} else setErrorCompanyName("Vui lòng nhập nơi làm việc!")
	}


	const [valueExpected_total, setValueExpected_total] = useState(0)
	useEffect(() => {
		setInfo({
			...info,
			expected_total_investment: valueExpected_total
		})
	}, [valueExpected_total])
	const changeExpected_total_investment = (e) => {
		setValueExpected_total(e.floatValue)
		if (e.floatValue) {
			setErrorInvestTotal("")
			setInfo({
				...info,
				expected_total_investment: valueExpected_total
			})
		} else {
			setErrorInvestTotal("Vui lòng nhập tổng mức đầu tư dự kiến!")
		}
	}

	const [valueLoan_amount, setValueLoan_amount] = useState(0)
	useEffect(() => {
		setInfo({
			...info,
			loan_amount: valueLoan_amount
		})
	}, [valueLoan_amount])
	const changeLoan_amount = (e) => {
		setValueLoan_amount(e.floatValue)
		if (e.floatValue) {
			setErrorLoan_amount("")
			setInfo({
				...info,
				loan_amount: e.floatValue
			})
		} else {
			setErrorLoan_amount("Vui lòng số tiền  vay!")
		}
	}
	const changeContractType = (e) => {
		if ((e === 0 || e === 1)) {
			setErrorContractType("");
			setContractType(e)
			setInfo({
				...info,
				working_information: {
					...info.working_information,
					contract_type: e
				}
			})
		} else setErrorContractType("Vui lòng chọn loại hợp đồng!");
	}

	const handleChangeInput = (e, type) => {
		console.log('e.target.value => ', e.target.value, type)
		let value = Number(e.target.value.split(',').join(''))
		console.log('value => ', value)
		if (value <= 5 && type === 'term') {
			setInfo({
				...info,
				[type]: value
			})
		}
		if (value <= 50 && value >= 0 && type === "power_capacity") {
			setInfo({
				...info,
				[type]: value
			})
		}

		let _info = {
			...info,
			[type]: value
		}
		if (type === 'expected_total_investment' || type === 'loan_amount') {
			let rate = Math.round((_info.loan_amount / _info.expected_total_investment) * 100)
			if (rate > 85) {
				return;
			} else {
				if (type === 'loan_amount' && value <= 1000000000) {
					setLoanAmountStr(formatter(value))
					setInfo({
						...info,
						[type]: value
					})
				}
				if (type === 'expected_total_investment' && value <= 500000000) {
					setTotalInvestmentStr(formatter(value))
					setInfo({
						...info,
						[type]: value
					})
				}
				setRate(rate)
			}

		}
	}

	const handleInvestotal = () => {
		setShowInvestModal(true);
		http.get(`web/quotation/package`)
			.then(res => {
				let dataSource = res?.data?.data?.content?.map(item => {
					return {
						...item,
						name: item?.packageName,
						don_gia: item?.price
					}
				});
				// dataSource.unshift({
				// 	id: 0,
				// 	name: type === 1 ? "Hệ 1 pha bao gồm các thiết bị" : "Hệ 3 pha bao gồm các thiết bị",
				// 	don_gia: Object.values(res.data.prices[0]).reverse()[0],
				// 	cong_suat: '',
				// 	donvi: '',
				// 	he: '',
				// })
				setDataSourceInvestment(dataSource)
			})
			.catch(error => console.log('Its was an error when upload package => ', error));
	}

	const handleOkInvestModal = (record) => {
		setErrorInvestTotal("")
		setInfo({
			...info,
			investment_amount: record?.price,
		})
		setShowInvestModal(false)
	}

	const handleCancelInvestModal = () => {
		setShowInvestModal(false)
	}

	const handleChangeFilter = async (value, types) => {
		console.log("value => ", value);
		console.log("type => ", types);
		if (types === 'voltage') {
			setVoltage(value)
		} else if (types === 'object') {
			setObject(value)
		} else if (types === 'types') {
			setType(value)
		} else {
			setRoof(value)
		}
	}

	useEffect(() => {
		http.get(`web/quotation/package`)
			.then(res => {
				let dataSource = res?.data?.data?.content?.map(item => {
					return {
						...item,
						name: item?.packageName,
						don_gia: item?.price
					}
				});
				// dataSource.unshift({
				// 	id: 0,
				// 	name: type === 1 ? "Hệ 1 pha bao gồm các thiết bị" : "Hệ 3 pha bao gồm các thiết bị",
				// 	don_gia: Object.values(res.data.prices[0]).reverse()[0],
				// 	cong_suat: '',
				// 	donvi: '',
				// 	he: '',
				// })
				setDataSourceInvestment(dataSource)
			})
			.catch(error => console.log('Its was an error when upload package => ', error));
	}, [type, roof, object, voltage])


	return (
		<div className="loan_info">
			<div className="l-border">
				<div className="info-title">
					<div>1. Phương án lắp đặt</div>
					<div className="title-line"></div>
				</div>
				<Row className="l-row-title">
					<Col span={12} className="l-row-left">
						<div className="content-title"><span style={{ color: '#B42E2E' }}>*</span> Số nhà</div>
						<Input defaultValue={loanDetail?.installation_address || null} className="text-input-left" onChange={handleChangeInstallAdd} />
						{errorInstallAdd ? <span style={{ color: '#B42E2E' }}>{errorInstallAdd}</span> : null}
					</Col>
					<Col span={12} className="l-row-right">
						<Checkbox defaultChecked={loanDetail?.installation_address && (loanDetail.installation_address === loanDetail.permanent_address)} onChange={(e) => handleChangePermanentAdd(e)}>Trùng địa chỉ thường trú</Checkbox>
						<Checkbox defaultChecked={loanDetail?.installation_address && (loanDetail.installation_address === loanDetail.contact_address)} onChange={(e) => handleChangeContactAdd(e)}>Trùng địa chỉ liên lạc</Checkbox>
					</Col>
				</Row>
				<Row className="l-row-title">
					<Col span={12} className="l-row-left">
						<div className="content-title"><span style={{ color: '#B42E2E' }}>*</span> Thành phố</div>
						<Select style={{ width: '100%' }}
							placeholder="Chọn tỉnh thành"
							className="text-input-left" onChange={(e) => {


								// let a = city?.filter(i => i.id === e);
								// handeChangeInstallCity(e, a[0].item_code);
								handeChangeInstallCity(e);
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
						<Form form={formFirst} >
							<Form.Item name="quan">
								<Select style={{ width: '100%' }}
									placeholder="Chọn quận huyện"
									className="text-input-left" onChange={(e) => {
										handeChangeInstallDistrict(e)
									}}>
									{distric?.map((item) => (
										<Option value={item.item_code}>{item?.item_name}</Option>
									))}
								</Select>
								{errorDistrict ? <span style={{ color: '#B42E2E' }}>{errorDistrict}</span> : null}
							</Form.Item>
						</Form>
					</Col>
				</Row>
				<Row className="l-row-title">
					<Col span={12} className="l-row-left">
						<div className="content-title"><span style={{ color: '#B42E2E' }}>*</span> Số tiền đầu tư</div>
						{/* <Input readOnly defaultValue={loanDetail?.investment_amount || null} value={info.investment_amount || null} className="text-input-left"
							// onChange={handleChangeInvestotal}
							// onClick={handleInvestotal}
						/> */}
						<NumberFormat
							customInput={Input}
							thousandSeparator={true}
							onValueChange={(_) => handleChangeInvestotal(_)}
							className="text-input-left"
							defaultValue={loanDetail?.investment_amount || null}
						/>
						{errorInvestment_amount ? <span style={{ color: '#B42E2E' }}>{errorInvestment_amount}</span> : null}
					</Col>
					<Col span={12} className="l-row-right wattage">
						<Row>
							<Col span={12}>
								<div className="content-title">Công suất</div>
							</Col>
							<Col span={12}>
								<Input onChange={(e) => handleChangeInput(e, "power_capacity")} className="suffix-style" defaultValue={info.power_capacity} value={info.power_capacity} suffix="kWP" />
							</Col>
						</Row>
						{/* <Col style={{top: 40}} span={12} className="l-text-right l-blue"><span className="l-font-bold">{info.wattage}</span> kWp</Col> */}
						<Slider style={{ marginTop: 30 }} onChange={value => handleChangeSlider(value, 'power_capacity')} marks={marksWattage} dots={false} min={sliderWattage.min} max={sliderWattage.max} defaultValue={info.power_capacity} value={info.power_capacity} />
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
								<span className="ant-input-affix-wrapper ant-input-affix-wrapper-borderless">
									<NumberFormat
										customInput={Input}
										thousandSeparator={true}
										onValueChange={(_) => changeExpected_total_investment(_)}
										className="text-input-left "
										// defaultValue={loanDetail?.expected_total_investment || null}
										defaultValue={loanDetail?.expected_total_investment || null}
									/>
									<span className="ant-input-suffix suffix-style">VND</span>
								</span>
								{errorInvestTotal ? <span style={{ color: '#B42E2E' }}>{errorInvestTotal}</span> : null}

							</Col>
						</Row>
						{/* <Row>
							<Col span={24} className="l-sider-total-investment">
								<span className="expected-total-investment">{total_investment_str}</span>
								<Slider step="1000000" tipFormatter={formatter} value={info.expected_total_investment} onChange={value => handleChangeSlider(value, 'expected_total_investment')} className="l-b-margin-0" dots={false} marks={marksExpectedTotal} min={sliderExpectedTotal.min} max={sliderExpectedTotal.max} defaultValue={info.expected_total_investment} />
							</Col>
						</Row> */}

					</Col>
					<Col span={12} className="l-row-right">
						<Row>
							<Col span={12} className="l-center l-title">Tỉ lệ tài trợ</Col>
							<Col span={12}>
								{/* <Input className="suffix-style" suffix="%" onChange={changeSponsorship_rate} defaultValue={sponsorship_rate} /> */}
								<span className="ant-input-affix-wrapper ant-input-affix-wrapper-borderless">
									<NumberFormat
										customInput={Input}
										thousandSeparator={true}
										onValueChange={(_) => changeSponsorship_rate(_)}
										className="text-input-left "
										// defaultValue={loanDetail?.expected_total_investment || null}
										defaultValue={loanDetail?.interest_rate || null}
									/>
									<span className="ant-input-suffix suffix-style">%</span>
								</span>
								{errorRate ? <span style={{ color: '#B42E2E' }}>{errorRate}</span> : null}
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
								<span className="ant-input-affix-wrapper ant-input-affix-wrapper-borderless">
									<NumberFormat
										customInput={Input}
										thousandSeparator={true}
										onValueChange={(_) => changeLoan_amount(_)}
										className="text-input-left "
										// defaultValue={loanDetail?.expected_total_investment || null}
										defaultValue={loanDetail?.loan_amount || null}
									/>
									<span className="ant-input-suffix suffix-style">VND</span>
								</span>
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
								<span className="ant-input-affix-wrapper ant-input-affix-wrapper-borderless">
									<NumberFormat
										customInput={Input}
										thousandSeparator={true}
										onValueChange={(_) => handleChangeMonth(_)}
										className="text-input-left "
										// defaultValue={loanDetail?.expected_total_investment || null}
										defaultValue={info.term || null}
									/>
									<span className="ant-input-suffix suffix-style">Tháng</span>
								</span>
								{errorMonth ? <span style={{ color: '#B42E2E' }}>{errorMonth}</span> : null}
								{/* <Input onChange={handleChangeMonth} className="suffix-style" defaultValue={info.term} suffix="Tháng" /> */}
							</Col>
							{/* <Input onChange={(e) => handleChangeInput(e, "term")} className="suffix-style" value={info.term} suffix="Tháng" /></Col> */}
							{/* <Col span={12} className="l-text-right l-blue"><span className="l-font-bold">{info.term}</span> năm</Col> */}
						</Row>

					</Col>
				</Row>
				{/* <Row>
					<Col span={12} className="l-row-left">
						<Slider step="1000000" onChange={value => handleChangeSlider(value, 'loan_amount')} value={info.loan_amount} tipFormatter={formatter} dots={false} marks={marksMoney} min={sliderMoney.min} max={sliderMoney.max} defaultValue={info.loan_amount} />
					</Col>
					<Col span={12} className="l-row-right l-term">
						<Slider onChange={value => handleChangeSlider(value, 'term')} dots={false} marks={marksYears} min={sliderYear.min} max={sliderYear.max} defaultValue={loanDetail.term ? loanDetail.term : info.term} value={info.term} />
					</Col>
				</Row> */}
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
					<Col span={12} className="l-row-left  l-title l-black">
						{/* <Row>
							<Col span={12} className="l-gray">Hạn trả</Col>
							<Col span={12} className="l-gray">Lãi suất</Col>
						</Row> */}
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
									<Button key={index} onClick={() => { handleSelect(item, 'rental_status') }} className={info.rental_status === item.value ? 'active' : ''} type="primary" shape="round" size="default">{item.name}</Button>
								)
							})}
						</div>
					</Col>
					<Col span={12} className="l-row-right">
						<div className="l-list-button">
							{loanForms.map((item, index) => {
								return (
									<Button key={index} onClick={() => { handleSelect(item, 'ownership_type') }} className={info.ownership_type === item.value ? 'active' : ''} type="primary" shape="round" size="default">{item.name}</Button>
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
									<Button key={index} onClick={() => { handleSelect(item, 'mortgage_status') }} className={info.mortgage_status === item.value ? 'active' : ''} type="primary" shape="round" size="default">{item.name}</Button>
								)
							})}
						</div>
					</Col>
					<Col span={12} className="l-row-right">

						<div className="l-list-button">
							{ppaStatus.map((item, index) => {
								return (
									<Button key={index} onClick={() => { handleSelect(item, 'ppa_type') }} className={info.ppa_type === item.value ? 'active' : ''} type="primary" shape="round" size="default">{item.name}</Button>
								)
							})}
						</div>
					</Col>
				</Row>
				<Row>
					<Col span={12} className="l-row-left l-title">
						VỊ trí nhà ở nơi lắp đặt
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
									<Button key={index} onClick={() => { handleSelect(item, 'installation_location') }} className={info.installation_location === item.value ? 'active' : ''} type="primary" shape="round" size="default">{item.name}</Button>
								)
							})}
						</div>
					</Col>
					<Col span={12} className="l-row-left">
						<Input defaultValue={loanDetail?.cmis || null} className="text-input-left" onChange={handleChangeCustomerCode} />
						{errorCodeCustomer ? <span style={{ color: '#B42E2E' }}>{errorCodeCustomer}</span> : null}
					</Col>
				</Row>

			</div>
			<div className="btn-register-loan" onClick={nextStep}>
				{isBackFromInformation ? "Tiếp theo" : "Tiếp theo"} <img src={iRight} />
			</div>
			<DetailLoanRepayment visible={isShowPopup} showPopup={showPopup} repaymentPlan={repaymentPlan} />
			<Modal
				className="investment-amount-modal"
				visible={showInvestModal}
				// onOk={handleOkInvestModal}
				onCancel={handleCancelInvestModal}
			>
				<div className="invesment-content">
					<Form form={form}
						onFinish={onFinish}
						layout="vertical"
						name="basic">
						<Row>
							<Col span="12">
								<h2>Vui lòng chọn 1 gói dưới đây</h2>
							</Col>
							{/* <Col span="5">
							<Form.Item name="filter">
								<Select placeholder="Nhà cung cấp" style={{ width: "95%" }} onChange={(value) => changeFilter(value)}>
									{listFilter?.map((item) => (
										<Select.Option value={item.id}>{item.name}</Select.Option>
									))}
								</Select>
							</Form.Item>
						</Col>
						<Col span="7">
							<Form.Item name="search">
								<Input.Search onSearch={() => handleSearch()} placeholder='Tìm kiếm...' defaultValue="" />
							</Form.Item>
						</Col> */}
						</Row></Form>
					<Table
						scroll={scroll}
						className=""
						dataSource={dataSourceInvestment}
						columns={columns}
						onRow={(r) => ({
							onClick: () => handleOkInvestModal(r),
						})}
						rowKey="id"
					/>
				</div>
			</Modal>
		</div>
	)
}
function mapDispatchToProps(dispatch) {
	return {
		getRepaymentPlan: (s) => dispatch(getRepaymentPlan(s)),
	}
}

const mapStateToProps = (state) => ({
	repaymentPlan: state.loan.repaymentPlan,
	loanDetail: state.loan.loanDetail,
})
export default connect(mapStateToProps, mapDispatchToProps)(LoanInfomation);