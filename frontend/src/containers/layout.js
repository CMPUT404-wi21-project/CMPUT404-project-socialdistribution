import React from 'react';

import { Layout, Menu, Breadcrumb } from 'antd';

import {connect} from 'react-redux';
import {logout} from '../actions/authActions';
import Logout from '../components/auth/Logout';
import MenuItem from 'antd/lib/menu/MenuItem';

const { Header, Content, Footer, Sider } = Layout;

class CustomLayout extends React.Component {
    state = {};
    render() {
        return (
            <Layout>
                  <div className="logo" /> 
                  <Menu theme="dark" mode="horizontal">
                    <Menu.Item key="1"><b>SocialDist</b></Menu.Item>
                    {this.props.isAuthenticated?<Logout style={{float:"right"}}/>:
                       <Menu.Item key="2"></Menu.Item>}
                  </Menu>
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
