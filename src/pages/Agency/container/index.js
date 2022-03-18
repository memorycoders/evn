import React, { useEffect, useState } from 'react';
import { CheckCircleOutlined } from '@ant-design/icons';
import '../../../styles/agency.scss';
import ListAgency from '../components/ListAgency';
import ListEmployee from '../components/ListEmployee';
import InfoAgencyTabs from '../components/InfoAgencyTabs';
import { history } from '../../../utils/history';
import http from '../../../apis/http';
import Axios from 'axios';
import { forEach } from 'lodash';
import { SCHEDULE_SURVER, EVN_TOKEN } from '../../../utils/constants';
import { NotificationSuccess } from '../../../common/components/Notification';

const Agency = () => {
	const [dataSource, setDataSource] = useState([]);
	const [totalItemSource, setTotalItemSource] = useState(0);
	const [regions, setRegions] = useState([]);
	const [currentAgent, setCurrentAgent] = useState({})
	const [currentIndexEdit, setCurrentIndexEdit] = useState(0)
	const [providers, setProvides] = useState([]);
	const [step, updateStep] = useState('');
	const [currentSchedule, setCurrentSchedule] = useState(SCHEDULE_SURVER.SURVER)
	const [totalItem, setTotalItem] = useState(0);
	const [data, setData] = useState([]);
	const [fields, setFields] = useState([])
	const [currentPage, setCurrentPage] = useState(1);

	const [currentAgentPage, setCurrentAgentPage] = useState(1)

	useEffect(() => {
		initData(0);
		fetchProvinces()
	}, [])

	const initData = async (pageIndex) => {
		try {
			const _response = await
				Axios.all([
					http.get(`web/regions`),
					http.get(`web/providers/agents?pageIndex=${pageIndex}&pageSize=5`),
				])
			if (_response) {
				if (_response[0]?.data?.data?.data)
					setRegions(_response[0]?.data?.data?.data)

				if (_response[1]?.data?.data?.content)
					forEach(_response[1]?.data?.data?.content, (agent) => {
						agent['agentName'] = agent.agent_name
						agent['regionId'] = agent.region_id
						agent['agentCode'] = agent.agent_code
					})
				setDataSource(_response[1]?.data?.data?.content);
				setTotalItemSource(_response[1]?.data?.data?.total_elements)
			}
		} catch (ex) {
			console.log("🚀 ~ file: ListAgency.js ~ line 33 ~ fetchListAgency ~ ex", ex)
		}
	}

	const fetchRegions = async () => {
		try {
			const rs = await http.get(`web/regions`);
			if (rs?.status === 200) {
				setRegions(rs?.data?.data?.data)
				NotificationSuccess('', "Thêm mới thành công")
			}
			// if (rs?.data?.data?.data)
			// 	setRegions(rs?.data?.data?.data)
		} catch (ex) { }
	}


	const fetchProvinces = async () => {
		try {
			const _response = await http.get('web/dict_item/provinces');
			if (_response) {
				setProvides(_response?.data?.data?.data)
			}
		} catch (ex) { }
	}


	const handleSetAgent = (index) => {
		setCurrentAgent(dataSource[index]);
		setCurrentIndexEdit(index);
	}
	const handleSetPage = (index) => {
		initData(index - 1)
		setCurrentPage(index);
	}



	const updateAgentEdited = async (data, isAdd) => {
		const rs = await http.get(`web/providers/agents?pageIndex=${0}&pageSize=5`)
		if (rs?.status === 200) {
			let du = rs?.data?.data?.total_elements % 5;
			let thuong = Math.floor(rs?.data?.data?.total_elements / 5);
			let latest_page = du !== 0 ? (thuong + 1) : thuong;
			if (isAdd) {
				handleSetPage(latest_page)
			} else {
				handleSetPage(latest_page)
			}
		}
	}

	const getLoanLosList = async (tab) => {
		if (tab !== step) {
			updateStep(tab)
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
			getListByPage(tab, 0)
		}
	}
	const getListByPage = async (tab, pageIndex) => {
		try {
			// const rs = await http.get(`web/providers/employees?pageIndex=${pageIndex}&pageSize=5`);
			const agentId = JSON.parse(sessionStorage.getItem(EVN_TOKEN)).agent_id
			const role_name = JSON.parse(sessionStorage.getItem(EVN_TOKEN)).user.role.code
			let rs;
			if (role_name === "Administrator") {
				rs = await http.get(`web/providers/employees?pageIndex=${pageIndex}&pageSize=5`);
			} else {
				rs = await http.get(`web/providers/employees?agentId=${agentId}&pageIndex=${pageIndex}&pageSize=5`);
			}
			if (rs?.status === 200) {
				setTotalItem(rs?.data?.data?.total_elements)
				setData(rs?.data?.data?.content)

			} else {
				return NotificationError("", "Có lỗi xảy ra. Vui lòng thử lại");
			}
		} catch (ex) { }
	}

	const TABS = {
		SURVEY: 'SURVEY',
		CONTRACT: 'CONTRACT',
		SETUP: 'SETUP',
		FULL: 'FULL'
	}

	const renderContent = () => {
		switch (step) {
			case TABS.SURVEY:
				return <>
					<div className="agency-content">
						<div className="agency-list">
							<h3>Danh sách đại lý</h3>
							<ListAgency dataSource={dataSource} total={totalItemSource} setCurrentAgent={handleSetAgent} currentPage={currentPage} setCurrentPage={handleSetPage} />
							<InfoAgencyTabs fetchRegions={fetchRegions} regions={regions} updateAgentEdited={updateAgentEdited} currentAgent={currentAgent} setCurrentAgent={setCurrentAgent} providers={providers} />
						</div>
					</div>
				</>
			case TABS.CONTRACT:
				return <>
					<div className="agency-content">
						<div className="agency-list">
							<ListEmployee setCurrentAgentPage={setCurrentAgentPage} currentAgentPage={currentAgentPage} setFields={setFields} fields={fields} totalItem={totalItem} setTotalItem={setTotalItem} getListByPage={getListByPage} data={data} />
						</div>
					</div>
				</>
			default:
				return <>
					<div className="agency-content">
						<div className="agency-list">
							<h3>Danh sách đại lý</h3>
							<ListAgency dataSource={dataSource} setCurrentAgent={handleSetAgent} total={totalItemSource} currentPage={currentPage} setCurrentPage={handleSetPage} />
							<InfoAgencyTabs fetchRegions={fetchRegions} regions={regions} updateAgentEdited={updateAgentEdited} currentAgent={currentAgent} setCurrentAgent={setCurrentAgent} providers={providers} />
						</div>
					</div>
				</>
				break;

		}
	}

	useEffect(() => {
		// getLoanLosList();
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
								<div class='l-header-name'>Nhân sự</div>
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
	)
}

export default Agency;