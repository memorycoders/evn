import { Collapse, Row, Col } from 'antd';
import React, { useState } from 'react';
import { SettingOutlined } from '@ant-design/icons';
const { Panel } = Collapse;

function Faq(props) {

    const contents = [
        {
            title: "Tôi muốn tìm hiểu đối tượng cho vay của gói Easy Solar?",
            desc: "Đối tượng áp dụng CBCNV Đã ký hợp đồng lao động không xác định thời hạn với ngành điện, hiện đang công tác tại EVNHCMC.",
        },
        {
            title: "Tôi có thể được vay tối đa bao nhiêu để lắp đặt Hệ thống Điện mặt trời mái nhà EVNSOLAR?",
            desc: "Hạn mức cho vay tối đa của chương trình đến 85% tổng mức đầu tư hệ thống.",
        },
        {
            title: "Tôi cần có hồ sơ/ giấy tờ gì của cơ quan quản lý để xác nhận quá trình làm việc tại EVN hoặc đơn vị thành viên?",
            desc: "Nếu Quý khách hàng là CBCNV có nhu cầu vay, Quý khách hàng có thể thực hiện theo mẫu được cung cấp bởi EVNFinance hoặc yêu cầu EVNFinance thực hiện xác nhận với cơ quan quản lý của Quý khách hàng."
        },
        {
            title: "Tôi muốn biết các điều kiện về mái nhà để lắp đặt hệ thống Điện mặt trời mái nhà EVNSOLAR?",
            desc: "Quý khách hàng có thể liên hệ ngay với EVNFinance để kết nối với nhà cung cấp. Đơn vị khảo sát của Nhà cung cấp sẽ đến tận nơi địa chỉ lắp đặt để tư vấn cho Quý khách hàng."
        },
        {
            title: "Trong trường hợp tôi muốn bán điện từ hệ thống Điện mặt trời mái nhà EVNSOLAR thì tôi cần thực hiện những thủ tục như thế nào?",
            desc: "Quý khách hàng sẽ được Nhà cung cấp phối hợp với cơ quan Điện lực địa phương thực hiện thủ tục này"
        },
        {
            title: "Tôi cần chuẩn bị những hồ sơ/ thủ tục gì để được xác nhận đủ điều kiện lắp đặt và đấu nối của chương trình Điện mặt trời mái nhà EVNSOLAR?",
            desc: "Quý khách hàng sẽ được Nhà cung cấp phối hợp với cơ quan Điện lực địa phương thực hiện thủ tục này."
        },

    ]
    const renderPanel = () => {
        let result;
        if (contents.length > 0) {
            result = contents.map((item, index) => {
                return (
                    <Panel header={item.title} key={index}>
                        <p>{item.desc}</p>
                    </Panel>
                )
            })
        }
        return result;
    }
    const [expandIconPosition] = useState('right')
    return (
        <div className="support support-custom">
            <div className="support-container">
                <h2 className="support-title">Câu hỏi thường gặp </h2>
                <Row>
                    <Col span={24}>
                        <Collapse accordion className="accordion-custom"
                            expandIconPosition={expandIconPosition}
                        >
                            {renderPanel()}
                        </Collapse>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default Faq;