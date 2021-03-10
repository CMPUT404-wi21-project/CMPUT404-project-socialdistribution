import React from 'react';

import { Layout, Menu, Breadcrumb } from 'antd';

import {connect} from 'react-redux';
import Logout from '../components/auth/Logout';
import { InboxOutlined, UserOutlined, ContainerOutlined} from '@ant-design/icons';
import { Link } from 'react-router-dom';

// ACTIONS
import {navigatePage} from '../actions/pageActions.js';

const { Header, Content, Footer, Sider } = Layout;


class CustomLayout extends React.Component {

    constructor(props) {
        super(props);
        this.setSelected = this.setSelected.bind(this);
        
    }

    // MENUS
    unAuthenticatedMenu = () => {
        return (
                <Menu theme="dark" mode="horizontal">
                        <Menu.Item key="0"><b>SocialDist</b></Menu.Item>
                </Menu>
        );
    }


    authenticatedMenu = () => {
        return (
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[this.props.activeKey]} selectedKeys={[this.props.activeKey]} >
                        <Menu.Item key="1" onClick={() => this.setSelected("1")}>
                            <b>SocialDist</b>
                            <Link to="/Home" />
                        </Menu.Item>
                        <Logout key="2" style={{float:"right"}}/>
                        <Menu.Item key="3" style={{float: "right"}} onClick={()=> this.setSelected("3")}>
                                <UserOutlined/>
                                <span>Profile</span>
                                <Link to="/profile"/>
                        </Menu.Item>
                        <Menu.Item key="4" style={{float: "right"}} onClick={()=> this.setSelected("4")}>
                                <InboxOutlined/>
                                <span>Inbox</span>
                                <Link to="/Inbox" />
                        </Menu.Item>
                        <Menu.Item key="5" style={{float: "right"}} onClick={()=> this.setSelected("5")}>
                                <ContainerOutlined/>
                                <span>MyPosts</span>
                                <Link to="/MyPosts" />
                        </Menu.Item>
                    </Menu>
        );
    }
    




    // METHODS
    setSelected(key) {
        this.props.navigatePage(key);
    };



    render() {
        return (
            <Layout>
                  <div className="logo" /> 
                  {this.props.isAuthenticated?this.authenticatedMenu():this.unAuthenticatedMenu()}
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
    activeKey: state.page.activeKey,
});
export default connect(
    mapStateToProps,
    {navigatePage},
)(CustomLayout);
