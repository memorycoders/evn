import React, { useEffect } from "react";
import { Col, Input, Row, Select, Form } from "antd";

const Address = (props) => {
	const { loanDetail, disabled, form, provinces, info, setInfo, type, districts, communes, getDistricts, getCommune, isDuplicateAddress } = props;
	useEffect(() => {
		if(loanDetail.id) {
			form.setFieldsValue({
				[`${type}_province_id`]: loanDetail[`${type}`] && loanDetail[`${type}`].province?.id,
				[`${type}_district_id`]: loanDetail[`${type}`] && loanDetail[`${type}`].district?.id,
				[`${type}_commune_id`]: loanDetail[`${type}`] && loanDetail[`${type}`].commune?.id,
				[`${type}_street`]: loanDetail[`${type}`] && loanDetail[`${type}`].street
			})
			getDistricts(loanDetail?.[`${type}`]?.province?.id);
			getCommune(loanDetail?.[`${type}`]?.district?.id);
		}
	}, [loanDetail])
	const handleChangeProvince = (value) => {
		if(type === 'contact_address' && isDuplicateAddress){
				setInfo({
					...info,
					[type]: {
						...info[type],
						province_id: value,
						district_id: null,
						commune_id: null,
						street: null
					},
					permanent_address: {
						...info.permanent_address,
						province_id: value,
						district_id: null
					}

				})
				getDistricts(value);
				// form.setFieldsValue({ [`${type}_district_id`]: null })
				// form.setFieldsValue({ [`${type}_commune_id`]: null })
				form.setFieldsValue({
					permanent_address_province_id: value,
					permanent_address_district_id: null,
					permanent_address_commune_id: null,
					permanent_address_street: null,
					contact_address_district_id: null,
					contact_address_commune_id: null,
					contact_address_street: null,
				})
		
		} else {
			setInfo({
				...info,
				[type]: {
					...info[type],
					province_id: value,
					commune_id: null,
					district_id: null,
					street: null
				}
			})
			getDistricts(value);
			form.setFieldsValue({ [`${type}_district_id`]: null })
			form.setFieldsValue({ [`${type}_commune_id`]: null })
			form.setFieldsValue({ [`${type}_street`]: null })
		}
		
	}
	const handleChangeDistrict = (value) => {
		if(type === 'contact_address' && isDuplicateAddress) {
			setInfo({
				...info,
				[type]: {
					...info[type],
					commune_id: null,
					district_id: value
				},
				permanent_address: {
					...info.permanent_address,
					commune_id: null,
					district_id: value
				}
			})
			// form.setFieldsValue({ [`${type}_commune_id`]: null });
			form.setFieldsValue({
				permanent_address_district_id: value,
				permanent_address_commune_id: null,
				permanent_address_street: null,
				contact_address_commune_id: null,
				contact_address_street: null
			})
			getCommune(value);
		} else {
			setInfo({
				...info,
				[type]: {
					...info[type],
					commune_id: null,
					district_id: value,
					street: null

				}
			})
			form.setFieldsValue({ [`${type}_commune_id`]: null });
			form.setFieldsValue({ [`${type}_street`]: null })

			getCommune(value);
		}
		
	}
	const handleChangeCommune = (value) => {
		if(type === 'contact_address' && isDuplicateAddress) {
			setInfo({
				...info,
				[type]: {
					...info[type],
					commune_id: value
				},
				permanent_address: {
					...info.permanent_address,
					commune_id: value
				}
			});
			form.setFieldsValue({
				permanent_address_commune_id: value,
			})
		} else {
			setInfo({
				...info,
				[type]: {
					...info[type],
					commune_id: value,
					// street: null

				}
			})
		}
	
	}
	const handleInputStreet = (e) => {
		if(type === 'contact_address' && isDuplicateAddress) {

			setInfo({
				...info,
				[type]: {
					...info[type],
					street: e.target.value
				},
				permanent_address: {
					...info.permanent_address,
					street: e.target.value
				}
			})
			form.setFieldsValue({
				permanent_address_street: e.target.value,
			})
		} else {
			setInfo({
				...info,
				[type]: {
					...info[type],
					street: e.target.value
				}
			})
		}

	}
	
	return (
		<>
		<Row>
			<Col span={12} className="col-left">
				<Form.Item label="T???nh/ Th??nh ph???" 
				name={`${type}_province_id`}
				rules={[{ required: true, message: 'Vui l??ng ch???n t???nh/ th??nh ph???!' }]}>
				<Select disabled={disabled}
				 onChange={handleChangeProvince}
				 value={info[type] && info[type].province}
				 >
				{provinces && provinces.map(item => (
					<Select.Option key={item.id} value={item.id}>
						{item.name}
					</Select.Option>
					))
				}

				</Select>
				</Form.Item>
			</Col>
			<Col span={12} className="col-right">
				<Form.Item label="Qu???n/ Huy???n"
				name={`${type}_district_id`}
				rules={[{ required: true, message: 'Vui l??ng ch???n qu???n/ huy???n!' }]}
			>
				<Select	
					disabled={disabled}
					onChange={handleChangeDistrict}
					value={info[type] && info[type].district}
				> 
					{districts && districts.filter(e => e.province_id === info[type]?.province_id).map(item => (
						<Select.Option key={item.id} value={item.id}>
							{item.name}
						</Select.Option>
						))
					}
					</Select>
				</Form.Item>
			</Col>
		</Row>
		<Row>
		<Col span={12} className="col-left">
			<Form.Item label="Ph?????ng/ X??"
				name={`${type}_commune_id`}
				rules={[{ required: true, message: 'Vui l??ng ch???n ph?????ng/ x??!' }]}>
				<Select onChange={handleChangeCommune}
				disabled={disabled}
				value={info[type] && info[type].commune_id}> 
					{communes && communes.filter(e => e.district_id === info[type]?.district_id).map(item => (
						<Select.Option key={item.id} value={item.id}>
							{item.name}
						</Select.Option>
						))
					}
				</Select>
			</Form.Item>
		</Col>
		<Col span={12} className="col-right *">
			<Form.Item
				className="require-style"
				label="S??? ph??ng/ C??n h???, s??? nh??, ???????ng" name={`${type}_street`} rules={[() => ({
				validator(rule, value) {
					if(value === undefined || value !== undefined && value.length === 0) {
						return Promise.reject(
							"Vui l??ng ??i???n th??ng tin!"
						);
					}
					return Promise.resolve();
				}
			})]}>
				<Input disabled={disabled} defaultValue={info[type].street} value={info[type].street} onChange={handleInputStreet}/>
			</Form.Item>
		</Col>
	</Row>
	</>
	)
}
export default Address;