import React from 'react';

import { Layout, Menu, Breadcrumb } from 'antd';

import {connect} from 'react-redux';
import {logout} from '../actions/authActions';
import Logout from '../components/auth/Logout';
import MenuItem from 'antd/lib/menu/MenuItem';
import { InboxOutlined, UserOutlined  } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;


const authenticatedMenu = () => {
    return (
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                    <Menu.Item key="1">
                        <b>SocialDist</b>
                        <Link to="/Home" />
                    </Menu.Item>
                    <Logout style={{float:"right"}}/>
                    <Menu.Item key="2" style={{float: "right"}}>
                            <UserOutlined/>
                            <span>Profile</span>
                            <Link to="/Profile" />
                    </Menu.Item>
                    <Menu.Item key="3" style={{float: "right"}}>
                            <InboxOutlined/>
                            <span>Inbox</span>
                            <Link to="/Inbox" />
                    </Menu.Item>
                </Menu>
    );
}

const unAuthenticatedMenu = () => {
    return (
            <Menu theme="dark" mode="horizontal">
                    <Menu.Item key="1"><b>SocialDist</b></Menu.Item>
            </Menu>
    );
}

class CustomLayout extends React.Component {
    state = {};
    render() {
        return (
            <Layout>
                  <div className="logo" /> 
                  {this.props.isAuthenticated?authenticatedMenu():unAuthenticatedMenu()}
                <Content>
                    {this.props.children}
                </Content>
                <Footer styles={{textAlign:'center'}}>Created By Team 5</Footer>
            </Layout>
        );
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
});
export default connect(
    mapStateToProps,
    {}
)(CustomLayout);
