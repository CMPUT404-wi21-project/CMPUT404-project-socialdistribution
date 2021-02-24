import React from 'react';

import { Form, Input, Button, Alert} from 'antd';
import { UserOutlined, LockOutlined, GithubOutlined, FontSizeOutlined } from '@ant-design/icons';

// Redux
import {connect} from 'react-redux';

// Type checking of props
import PropTypes from 'prop-types';

import {Redirect} from 'react-router-dom';

// Auth Action
import {register} from '../../actions/authActions';
import {clearErrors} from '../../actions/errorActions';


class RegisterForm extends React.Component {
    state = {
        msg: null,
    };

    componentDidUpdate(prevProps) {
        const { error, isAuthenticated} = this.props;
        if (error !== prevProps.error) {
            // Check for a register error
            if (error.id === 'REGISTER_FAIL') {
               this.setState({msg: error.msg}); 
            } else {
                this.setState({msg: null});
            }
        }
        
        // This should be authenticated routing
        if (isAuthenticated) {
            // Send the user to the homepage
            console.log('Sending user to the homepage');
        }
    }

    componentWillUnmount() {
        this.props.clearErrors();
    }

    onRegister = (values) => {
        // Attempt to register
        this.props.register(values);
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
          onFinish={this.onRegister}
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
          <Form.Item
            name="displayName"
            rules={[{ required: true, message: 'Please input your display name!' }]}
          >
            <Input prefix={<FontSizeOutlined />} placeholder="Display Name" />
          </Form.Item>
          <Form.Item
            name="git_url"
            rules={[{ required: false, message: 'Please input your Github URL!' }]}
          >
            <Input prefix={<GithubOutlined />} placeholder="Github URL(Optional)" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="lgin-form-button">
             Register 
            </Button>
          </Form.Item>
        </Form>
        );
    }
}

RegisterForm.propTypes = {
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired,
        register: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    error: state.error,
});

export default connect(
    mapStateToProps,
    {register, clearErrors}
)(RegisterForm);
