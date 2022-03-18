import React from "react";
import { connect } from "react-redux";
import { Router } from "react-router";
import { login, signup, setRoleInfo } from "./store/authentication/action";
import { Layout, Menu, Avatar, Popover, Modal, Badge } from "antd";
import {
    CaretDownOutlined,
    LogoutOutlined,
    BellOutlined,
    BellFilled
} from "@ant-design/icons";

import "./styles/custom.scss";
import "./styles/app.scss";
import Routes from "./routes";
import { initData, showSidebar } from "./store/common/action";
import { signout } from "./store/authentication/action";
import { history } from "./utils/history";
import { EVN_TOKEN, ROLE_USER } from "./utils/constants";
import { setIsLogin, setUserLogin } from "./store/authentication/action";

import loanIcon from "./asset/images/loan-icon.png";
import accountIcon from "./asset/images/account-icon.png";
import helpIcon from "./asset/images/help-icon.png";
import { setUserData, getNotification, readNotification } from "./store/infoAccount/action";

const { Header } = Layout;

class App extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            widthSidebar: 268,
            openLogoutModal: false,
            currentPath: "",
            notification: [],
            userID: ""
        };
    }




    componentWillMount() {
        const pathname = window.location.pathname;
        if (
            (sessionStorage.getItem("EVN_TOKEN") ||
                localStorage.getItem("EVN_TOKEN"))
        ) {
            history.push("/signup");
        }
        this.setState({
            currentPath: pathname,
        });
        history.listen((location) => {

            this.setState({
                currentPath: location.pathname,
            });
        });
    }

    goTo = (url) => {
        history.push(url);
    };

    handleCancel = () => {
        this.setState({
            openLogoutModal: false,
        });
    };

    logout = () => {
        this.setState({
            openLogoutModal: true,
        });
    };

    componentDidUpdate() {
        if (!this.props.isLogin) {
            this.setState({
                openLogoutModal: false,
            });
        }
    }


    componentDidMount() {
        const token =
            localStorage.getItem(EVN_TOKEN) || sessionStorage.getItem(EVN_TOKEN);
        const role = localStorage.getItem(ROLE_USER) ? JSON.parse(localStorage.getItem(ROLE_USER)) : []
        if (token) {
            this.props.dispatch(setUserLogin(JSON.parse(token)));
            this.props.dispatch(setRoleInfo(role));
            this.props.dispatch(setIsLogin(true));
            this.props.dispatch(setUserData(JSON.parse(token)?.personal_information));
            this.props.initData();
            this.props.getNoti(JSON.parse(token)?.user?.id);
        }

    }
    componentWillReceiveProps(nextProps) {
        // console.log("nextProps", nextProps.noti)

        if (nextProps && nextProps.noti) {
            const { noti } = nextProps
            this.setState({
                notification: [...noti]
            })
        }
    }


    content = () => (
        <div className="tooltip">
            <div
                className="tooltip-item"
                onClick={() => {
                    this.goTo("/info-account");
                }}
            >
                <div>Thông tin cá nhân</div>
            </div>
            <div
                className="tooltip-item"
                onClick={() => {
                    this.goTo("/change-password");
                }}
            >
                <div>Đổi mật khẩu</div>
            </div>
            <div onClick={this.logout} className="tooltip-item">
                <div>
                    <LogoutOutlined />{" "}
                    <span style={{ marginRight: 10, cursor: "pointer" }}>Đăng xuất</span>
                </div>
            </div>
        </div>
    );

    readNotificationUser = (id) => {
        const data = {
            "read": true,
        }
        this.props.readNoti(id, data);
    }


    contentNotification = () => (
        <div className="tooltip custom-tooltip">
            <div className="tooltip-item custom-tooltip-head">
                <div style={{ fontSize: '16px' }}>Thông báo <BellOutlined style={{ fontSize: '18px' }} /></div>
            </div>
            <div className="tooltip-oveflow">

                {
                    this.state.notification.length > 0 ?
                        this.state.notification.map((item, index) => {
                            // console.log(" userID", this.state.userID);
                            return (
                                <div key={index} className={`tooltip-item custom-tooltip-item ${item.is_read ? "" : "toollip-active"}`}
                                    onClick={() => {
                                        this.readNotificationUser(item.id)
                                    }}
                                >
                                    <div className="tooltip-box">
                                        <span className="tooltip-item-desc">{item.body}</span>
                                    </div>
                                </div>
                            )
                        })
                        : <div className="tooltip-item">
                            <div> Chưa có thông báo nào</div>
                        </div>
                }
            </div>
        </div>
    );

    handleCount = (data) => {
        let result = [];
        if (data.length > 0) {
            result = data.filter((item, index) => {
                return item.is_read === false
            })
        }
        // return result?.length 
        return result?.length
    }

    handleOk = () => {
        this.props.signout();
    };
    render() {
        // console.log("notification", this.state.notification);
        const { widthSidebar, openLogoutModal } = this.state;
        const {
            showSidebar,
            isShowSidebar,
            hasWaitingStatus,
            username,
            user,
            info,
            role_info,
            noti,
            ava
        } = this.props;

        const customer = sessionStorage.getItem(EVN_TOKEN)
            ? JSON.parse(sessionStorage.getItem(EVN_TOKEN))
            : JSON.parse(localStorage.getItem(EVN_TOKEN));

        return (
            <>
                <Layout className="app-container">
                    <Header
                        className={`header-container ${!isShowSidebar ? "hide" : ""}`}
                    >
                        <div className="logo"></div>
                        <div className="user-info">
                            <Avatar

                                size={35}
                                style={{ color: "#fff", backgroundColor: "#1D4994" }}
                                src={
                                    ava ? "data:image/png;base64," + ava : "data:image/png;base64," + customer?.user?.avatar
                                    // customer?.user?.avatar
                                    //     ? "data:image/png;base64," + customer.user.avatar
                                    //     : "data:image/png;base64," + ava
                                }
                            >
                                {info?.user?.avatar
                                    ? ""
                                    : info?.personal_information?.name
                                        ? info.personal_information.name.charAt(0)
                                        : null}
                            </Avatar>
                            {/* <Badge count={0} showZero offset={[1, 1]} size="small">
                                <BellOutlined
                                className="noti-icon"
                                onClick={() => {
                                    this.goTo("/notification");
                                }}
                                />
                            </Badge> */}
                            <Popover
                                placement="bottomRight"
                                // content={this.contentNotification()}
                                content={this.contentNotification()}
                                trigger="click"
                            >
                                <Badge count={this.handleCount(this.state.notification)} showZero offset={[1, 1]} size="small">
                                    <BellOutlined
                                        className="noti-icon"
                                    />
                                </Badge>
                            </Popover>
                            <div className="username">{user?.name}</div>
                            <Popover
                                placement="bottomRight"
                                content={this.content()}
                                trigger="click"
                            >
                                <CaretDownOutlined />
                            </Popover>
                        </div>
                        <Modal
                            title="Đăng xuất"
                            className="logout-modal"
                            visible={openLogoutModal}
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                            okText={"Có"}
                            cancelText={"Không"}
                            closable={false}
                        >
                            <p style={{ textAlign: "center" }}>
                                Bạn có chắc muốn đăng xuất khỏi hệ thống không?
              </p>
                        </Modal>
                    </Header>
                    <Layout>
                        <Layout.Sider
                            width={isShowSidebar ? widthSidebar : 0}
                            className={`menu ${!isShowSidebar ? "hide" : ""}`}
                            style={{
                                overflow: "auto",
                                position: "fixed",
                                left: 0,
                            }}
                        >
                            <Menu
                                theme="dark"
                                mode="inline"
                                openKeys={[
                                    "sub2",
                                    "sub3",
                                    "sub4",
                                    "sub5",
                                    "sub6",
                                    "sub7",
                                    "sub8",
                                    "sub9",
                                    "sub10",
                                    "sub11",
                                    "sub12"
                                ]}
                                defaultOpenKeys={[
                                    "sub2",
                                    "sub3",
                                    "sub4",
                                    "sub5",
                                    "sub6",
                                    "sub7",
                                    "sub8",
                                    "sub9",
                                    "sub10",
                                    "sub11",
                                    "sub12"
                                ]}
                                selectedKeys={this.state.currentPath}
                            // selectedKeys={"/loan/register"}
                            >
                                <Menu.SubMenu
                                    key="sub2"
                                    style={
                                        (role_info?.some(e => (e?.permission?.permissionName === 'Customer - Đăng ký vay điện mặt trời'
                                            || e?.permission?.permissionName === 'Customer - Đăng ký vay tiêu dùng'
                                            || e?.permission?.permissionName === 'Customer - Vận hành'
                                            || e?.permission?.permissionName === 'Customer - Theo dõi quá trình xét duyệt'
                                        )) || user === '0976627796')
                                            ? { display: 'block' } : { display: 'none' }
                                    }
                                    title={
                                        <div>
                                            <img src={loanIcon} />
                                            Cho vay Easy Solar
                    </div>
                                    }
                                >
                                    <Menu.Item
                                        disabled={hasWaitingStatus}
                                        key="/loan/register"
                                        onClick={() => {
                                            this.goTo("/loan/register");
                                        }}
                                    >
                                        {(role_info?.some(e => e?.permission?.permissionName === 'Customer - Đăng ký vay điện mặt trời') || user === '0976627796') ? 'Đăng ký' : null}
                                    </Menu.Item>
                                    <Menu.Item
                                        key="/system-and-sell"
                                        onClick={() => {
                                            this.goTo("/system-and-sell");
                                        }}
                                    >
                                        {role_info?.some(e => e?.permission?.permissionName === 'Customer - Vận hành') ? 'Vận hành và bán điện' : null}
                                    </Menu.Item>
                                    <Menu.Item
                                        key="/loan-list"
                                        onClick={() => {
                                            this.goTo("/loan-list");
                                        }}
                                    >
                                        {role_info?.some(e => e?.permission?.permissionName === 'Customer - Theo dõi quá trình xét duyệt' || e?.permission?.permissionName === 'Customer - Đăng ký vay tiêu dùng')
                                            ? (
                                                username === "Khách hàng vay tiêu dùng"
                                                    ? "Theo dõi khoản vay"
                                                    : "Xét duyệt"
                                            )
                                            : null}
                                    </Menu.Item>
                                </Menu.SubMenu>
                                <Menu.SubMenu
                                    key="sub3"
                                    style={
                                        role_info?.some(e => (e?.permission?.permissionName === 'CustomerSearch - Tài khoản vay'
                                            || e?.permission?.permissionName === 'CustomerSearch - Tài khoản tiền gửi'))
                                            ? { display: 'block' } : { display: 'none' }
                                    }
                                    title={
                                        <div>
                                            <img src={accountIcon} />
                                            Danh sách tài khoản
                    </div>
                                    }
                                >
                                    <Menu.Item
                                        key="/account/rent"
                                        onClick={() => {
                                            this.goTo("/account/rent");
                                        }}
                                    >
                                        {role_info?.some(e => e?.permission?.permissionName === 'CustomerSearch - Tài khoản vay') ? 'Tài khoản vay' : null}
                                    </Menu.Item>
                                    <Menu.Item
                                        key="/account/deposit"
                                        onClick={() => {
                                            this.goTo("/account/deposit");
                                        }}
                                    >
                                        {role_info?.some(e => e?.permission?.permissionName === 'CustomerSearch - Tài khoản tiền gửi') ? 'Tiền gửi' : null}
                                    </Menu.Item>
                                </Menu.SubMenu>
                                <Menu.SubMenu
                                    key="sub5"
                                    style={
                                        role_info?.some(e => (e?.permission?.permissionName === 'Provider - Báo giá & hậu mãi'
                                            || e?.permission?.permissionName === 'Provider - Lắp đặt - Đặt lịch + Cập nhật kết quả lắp đặt'
                                            || e?.permission?.permissionName === 'Provider - Vận hành - Bảo dưỡng'
                                            || e?.permission?.permissionName === 'Provider - Quản lý đại lý'
                                            || e?.permission?.permissionName === 'Provider - Khảo sát - Tiếp nhận chuyển đại lý'
                                            || e?.permission?.permissionName === 'Provider - Khảo sát - Chuyển nhân viên khảo sát'
                                            || e?.permission?.permissionName === 'Provider - Hợp đồng'))
                                            ? { display: 'block' } : { display: 'none' }
                                    }
                                    title={
                                        <div>
                                            <img src={helpIcon} />
                                            Nhà cung cấp
                    </div>
                                    }
                                >
                                    <Menu.Item
                                        key="/survey"
                                        onClick={() => {
                                            this.goTo("/survey");
                                        }}
                                    >
                                        {role_info?.some(e => e?.permission?.permissionName === 'Provider - Lắp đặt - Đặt lịch + Cập nhật kết quả lắp đặt'
                                            || e?.permission?.permissionName === 'Provider - Khảo sát - Tiếp nhận chuyển đại lý'
                                            || e?.permission?.permissionName === 'Provider - Khảo sát - Chuyển nhân viên khảo sát'
                                            || e?.permission?.permissionName === 'Provider - Hợp đồng') ? 'Khảo sát & lắp đặt' : null}
                                    </Menu.Item>
                                    <Menu.Item
                                        key="/operate"
                                        onClick={() => {
                                            this.goTo("/operate");
                                        }}
                                    >
                                        {role_info?.some(e => e?.permission?.permissionName === 'Provider - Vận hành - Bảo dưỡng') ? 'Vận hành' : null}
                                    </Menu.Item>
                                    <Menu.Item
                                        key="/agency"
                                        onClick={() => {
                                            this.goTo("/agency");
                                        }}
                                    >
                                        {role_info?.some(e => e?.permission?.permissionName === 'Provider - Quản lý đại lý'
                                            || e?.permission?.permissionName === 'Provider - Thông tin nhân sự - quản lý nhận sự') ? 'Đại lý' : null}
                                    </Menu.Item>
                                    <Menu.Item
                                        key="/quotation"
                                        onClick={() => {
                                            this.goTo("/quotation");
                                        }}
                                    >
                                        {role_info?.some(e => e?.permission?.permissionName === 'Provider - Báo giá & hậu mãi') ? 'Báo giá' : null}
                                    </Menu.Item>
                                </Menu.SubMenu>
                                <Menu.SubMenu
                                    key="sub7"
                                    style={
                                        (role_info?.some(e => e?.permission?.permissionName === 'Admin - Thêm mới người dùng'
                                            || e?.permission?.permissionName === 'Admin - Danh sách người dùng'
                                            || e?.permission?.permissionName === 'Admin - Thêm mới tài khoản khách hàng'
                                            || e?.permission?.permissionName === 'Admin - Admin - Phân quyền'
                                        ) || user === '0976627796') ? { display: 'block' } : { display: 'none' }
                                    }
                                    title={
                                        <div>
                                            <img src={accountIcon} />
                                            Quản trị user
                    </div>
                                    }
                                >
                                    <Menu.Item
                                        key="/admin/user-manager"
                                        onClick={() => {
                                            this.goTo("/admin/user-manager");
                                        }}
                                    >
                                        {
                                            role_info?.some(e => (e?.permission?.permissionName === 'Admin - Danh sách người dùng'
                                                || e?.permission?.permissionName === 'Admin - Thêm mới người dùng'
                                            )) ? 'Danh sách người dùng' : null}
                                    </Menu.Item>
                                    {/* Code  */}
                                    <Menu.Item
                                        key="/admin/add-account"
                                        onClick={() => {
                                            this.goTo("/admin/add-account");
                                        }}
                                    >
                                        {role_info?.some(e => e?.permission?.permissionName === 'Admin - Thêm mới tài khoản khách hàng') ? 'Thêm mới' : null}
                                    </Menu.Item>
                                    <Menu.Item
                                        key="/admin/role"
                                        onClick={() => {
                                            this.goTo("/admin/role");
                                        }}
                                    >
                                        {(role_info?.some(e => e?.permission?.permissionName === 'Admin - Phân quyền') || user === '0976627796') ? 'Phân quyền' : null}
                                    </Menu.Item>
                                </Menu.SubMenu>
                                <Menu.SubMenu
                                    key="sub8"
                                    style={
                                        role_info?.some(e => e?.permission?.permissionName === 'Evnfc - Quản lý khách hàng'
                                            || e?.permission?.permissionName === 'Evnfc - Quản lý trạng thái đơn hàng'
                                        ) ? { display: 'block' } : { display: 'none' }
                                    }
                                    title={
                                        <div>
                                            <img src={helpIcon} />
                                            Quản trị khách hàng
                    </div>
                                    }
                                >
                                    <Menu.Item
                                        key="/user-manual"
                                        onClick={() => {
                                            this.goTo("/user-manual");
                                        }}
                                    >
                                        {role_info?.some(e => e?.permission?.permissionName === 'Evnfc - Quản lý khách hàng') ? 'Khách hàng' : null}
                                    </Menu.Item>
                                    <Menu.Item
                                        key="/order-list"
                                        onClick={() => {
                                            this.goTo("/order-list");
                                        }}
                                    >
                                        {role_info?.some(e => e?.permission?.permissionName === 'Evnfc - Quản lý trạng thái đơn hàng') ? 'Khách hàng' : null}
                                    </Menu.Item>
                                </Menu.SubMenu>
                                <Menu.SubMenu
                                    key="sub9"
                                    style={
                                        role_info?.some(e => e?.permission?.permissionName === 'Admin - Quản lý sản phẩm đối tác'
                                        ) ? { display: 'block' } : { display: 'none' }
                                    }
                                    title={
                                        <div>
                                            <img src={helpIcon} />
                                            Quản trị sản phẩm
                    </div>
                                    }
                                >
                                    <Menu.Item
                                        key="/product"
                                        onClick={() => {
                                            this.goTo("/product");
                                        }}
                                    >
                                        {role_info?.some(e => e?.permission?.permissionName === 'Admin - Quản lý sản phẩm đối tác') ? 'Danh sách sản phẩm' : null}
                                    </Menu.Item>
                                </Menu.SubMenu>
                                <Menu.SubMenu
                                    key="sub10"
                                    style={
                                        role_info?.some(e => e?.permission?.permissionName === 'Admin - Quản lý nhà cung cấp'
                                        ) ? { display: 'block' } : { display: 'none' }
                                    }
                                    title={
                                        <div>
                                            <img src={helpIcon} />
                                            Quản trị nhà cung cấp
                    </div>
                                    }
                                >
                                    <Menu.Item
                                        key="/provider"
                                        onClick={() => {
                                            this.goTo("/provider");
                                        }}
                                    >
                                        {role_info?.some(e => e?.permission?.permissionName === 'Admin - Quản lý nhà cung cấp') ? 'Danh sách nhà cung cấp' : null}
                                    </Menu.Item>
                                </Menu.SubMenu>
                                <Menu.SubMenu
                                    key="sub11"
                                    style={
                                        role_info?.some(e => e?.permission?.permissionName === 'Provider - Quản lý đại lý'
                                        ) ? { display: 'block' } : { display: 'none' }
                                    }
                                    title={
                                        <div>
                                            <img src={helpIcon} />
                                            Quản lý
                    </div>
                                    }
                                >
                                    <Menu.Item
                                        key="/admin-agency"
                                        onClick={() => {
                                            this.goTo("/admin-agency");
                                        }}
                                    >
                                        {role_info?.some(e => e?.permission?.permissionName === 'Provider - Quản lý đại lý') ? 'Đại lý' : null}
                                    </Menu.Item>
                                </Menu.SubMenu>
                                <Menu.SubMenu
                                    key="sub4"
                                    style={
                                        role_info?.some(e => e?.permission?.permissionName === 'Support - Hướng dẫn sử dụng')
                                            ? { display: 'block' } : { display: 'none' }
                                    }
                                    title={
                                        <div>
                                            <img src={helpIcon} />
                                            Hỗ trợ
                    </div>
                                    }
                                >
                                    <Menu.Item
                                        key="/user-manual"
                                        onClick={() => {
                                            this.goTo("/user-manual");
                                        }}
                                    >
                                        {role_info?.some(e => e?.permission?.permissionName === 'Support - Hướng dẫn sử dụng') ? 'Hướng dẫn sử dụng' : null}
                                    </Menu.Item>
                                    <Menu.Item
                                        key="/faq"
                                        onClick={() => {
                                            this.goTo("/faq");
                                        }}
                                    >
                                        {role_info?.some(e => e?.permission?.permissionName === 'Support - Hướng dẫn sử dụng') ? 'Câu hỏi thường gặp' : null}
                                    </Menu.Item>
                                    <Menu.Item
                                        key="/money-transfer-instrusction"
                                        onClick={() => {
                                            this.goTo("/money-transfer-instrusction");
                                        }}
                                    >
                                        {role_info?.some(e => e?.permission?.permissionName === 'Support - Hướng dẫn sử dụng') ? 'Hướng dẫn GD tiền' : null}
                                    </Menu.Item>
                                </Menu.SubMenu>
                                <Menu.SubMenu
                                    key="sub12"
                                    style={
                                        role_info?.some(e => e?.permission?.permissionName === 'Admin - Quản lý template/email/sms'
                                        ) ? { display: 'block' } : { display: 'none' }
                                    }
                                    title={
                                        <div>
                                            <img src={helpIcon} />
                                            Template
                    </div>
                                    }
                                >
                                    <Menu.Item
                                        key="/email"
                                        onClick={() => {
                                            this.goTo("/email");
                                        }}
                                    >
                                        {role_info?.some(e => e?.permission?.permissionName === 'Admin - Quản lý template/email/sms') ? 'Email' : null}
                                    </Menu.Item>
                                    <Menu.Item
                                        key="/sms"
                                        onClick={() => {
                                            this.goTo("/sms");
                                        }}
                                    >
                                        {role_info?.some(e => e?.permission?.permissionName === 'Admin - Quản lý template/email/sms') ? 'SMS' : null}
                                    </Menu.Item>
                                    <Menu.Item
                                        key="/notification-template"
                                        onClick={() => {
                                            this.goTo("/notification-template");
                                        }}
                                    >
                                        {role_info?.some(e => e?.permission?.permissionName === 'Admin - Quản lý template/email/sms') ? 'Thông báo' : null}
                                    </Menu.Item>
                                    <Menu.Item
                                        key="/template"
                                        onClick={() => {
                                            this.goTo("/template");
                                        }}
                                    >
                                        {role_info?.some(e => e?.permission?.permissionName === 'Admin - Quản lý template/email/sms') ? 'Biểu mẫu' : null}
                                    </Menu.Item>
                                </Menu.SubMenu>
                            </Menu>
                        </Layout.Sider>
                        <Layout
                            className="site-layout"
                            style={{ marginLeft: isShowSidebar ? widthSidebar : 0 }}
                        >
                            <Layout.Content className="content">
                                <Router history={history}>
                                    <Routes showSidebar={showSidebar} />
                                </Router>
                            </Layout.Content>
                        </Layout>
                    </Layout>
                </Layout>
            </>
        );
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        login: (payload) => dispatch(login(payload)),
        signup: (payload) => dispatch(signup(payload)),
        showSidebar: (s) => dispatch(showSidebar(s)),
        signout: () => dispatch(signout()),
        forgotPassword: (payload) => dispatch(forgotPassword(payload)),
        initData: () => dispatch(initData()),
        // ---------
        getNoti: (id) => dispatch(getNotification(id)),
        readNoti: (id, data) => dispatch(readNotification(id, data)),
        dispatch,
    };
};

console.log();

const mapStateToProps = (state) => {
    return {
        info: state?.authentication,
        ava: state?.user?.ava,
        user: state?.user?.userData,
        username: state?.authentication?.user?.role?.name,
        isShowSidebar: state.common.isShowSidebar,
        isLogin: state.authentication.isLogin,
        hasWaitingStatus: state.loan.hasWaitingStatus,
        role_info: state?.authentication?.role_info,
        noti: state?.user?.noti
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
