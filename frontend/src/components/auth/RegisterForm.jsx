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
        msgs: [],
        msg_type: null ,   
    };

    componentDidUpdate(prevProps) {
        const { error, isAuthenticated, isRegistered} = this.props;
        if (error !== prevProps.error) {
            // Check for a register error
            if (error.id === 'REGISTER_FAIL') {
               this.setState({msgs: error.msgs, msg_type: "error"}); 
            } else {
                this.setState({msgs: null, msgs_type: null});
            }
            // This should be authenticated routing
        } else if (isRegistered != prevProps.isRegistered) {
            // Send the user to the homepage
            this.setState({msgs: "Successfully Registered! Please await admin approval before Login!", msg_type: "success"})
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
          {this.state.msgs &&
            this.state.msgs.map(([key, value]) =>
              <Alert message={key + ": " + value} type={this.state.msg_type} />
            )            
          }
          
          <br/>
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
            name="github"
            rules={[{ required: true, message: 'Please input your Github URL!' }]}
          >
            <Input prefix={<GithubOutlined />} placeholder="Github URL" />
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
    isRegistered: state.auth.isRegistered,
    error: state.error,
});

export default connect(
    mapStateToProps,
    {register, clearErrors}
)(RegisterForm);
