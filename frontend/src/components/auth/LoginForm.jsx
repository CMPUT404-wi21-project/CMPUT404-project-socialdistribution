import React from 'react';

import { Form, Input, Button, Checkbox, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
// Redux
import {connect} from 'react-redux';

import {Redirect} from 'react-router-dom';

// Type checking of props
import PropTypes from 'prop-types';

// Auth Action
import {login} from '../../actions/authActions';
import {clearErrors} from '../../actions/errorActions';

class LoginForm extends React.Component {
    state = {
        msg: null,
    };

    componentDidUpdate(prevProps) {
        const { error, isAuthenticated} = this.props;
        if (error !== prevProps.error) {
            // Check for a login error
            if (error.id === 'LOGIN_FAIL') {
               this.setState({msg: error.msg}); 
            } else {
                this.setState({msg: null});
            }
        }
    }

    componentWillUnmount() {
        this.props.clearErrors();
    }

    onLogin = (values) => {
        // Attempt to register
        this.props.login(values);
    }
    render() {
        if (this.props.isAuthenticated) {
            return <Redirect to="/Home"/>
        }
        return (
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={this.onLogin}
        >
              {this.state.msg? <Alert message={this.state.msg} type="error" />: null}

              <Form.Item
                name="username"
                rules={[{ required: true, message: 'Please input your Username!' }]}
              >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your Password!' }]}
              >
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Password"
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" className="lgin-form-button">
                  Login
                </Button>
              </Form.Item>
            </Form>
        );
    }

}

LoginForm.propTypes = {
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired,
        login: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    error: state.error,
});

export default connect(
    mapStateToProps,
    {login, clearErrors}
)(LoginForm);
