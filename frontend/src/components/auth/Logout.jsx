import React from 'react';
import {connect} from 'react-redux';
import {logout} from '../../actions/authActions';
import { Menu } from 'antd';
import { Redirect} from 'react-router-dom';
class Logout extends React.Component {
    render() {
        
        let {logout: logouter, ...rest} = this.props;
        return (
           <Menu.Item key="1" {...rest} onClick={logouter}>Logout</Menu.Item>    

        );
    }
}

const mapStateToProps = state => ({
});

export default connect(mapStateToProps, {logout})(Logout);
