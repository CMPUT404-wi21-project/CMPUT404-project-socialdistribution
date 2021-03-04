import React from 'react';
import {connect} from 'react-redux';
import {logout} from '../../actions/authActions';
import { Menu } from 'antd';
import { Redirect, Link} from 'react-router-dom';
class Logout extends React.Component {
    render() {
        
        let {logout: logouter, ...rest} = this.props;
        return (
           <Menu.Item {...rest} onClick={logouter}>
                Logout
                <Link to="/"/>
           </Menu.Item>    

        );
    }
}

const mapStateToProps = state => ({
});

export default connect(mapStateToProps, {logout})(Logout);
