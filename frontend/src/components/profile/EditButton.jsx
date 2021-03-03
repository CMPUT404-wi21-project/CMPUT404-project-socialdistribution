import React from 'react';
import {connect} from 'react-redux';
import { Modal, Button, Form, Input, message} from 'antd';
import {saveMyProfile} from '../../actions/profileActions';

class EditButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = { visible: false };        
    }        

    //settle profile instance
    onFinish = (values) => {        
        //post requires all fields     
        values.id = this.props.profile.id;
        values.host = this.props.profile.host;
        values.url = this.props.profile.url;
        if (values.displayName === undefined){
            values.displayName = this.props.profile.displayName;
        }
        if (values.github === undefined){
            values.github = this.props.profile.github;
        }

        this.props.saveMyProfile(values); 

        if(this.props.parentProfile.saveFailed){
            message.error('Failed to save to server');
        }
        else{
            message.success('Profile update success');
        }
        //notify parent component to rerender
        this.props.parentProfile.updateFoo = true;
    }

    render() {        

        //handle visibility of edit window
        const showModal = () => {
            this.setState({visible: true});
        };
    
        const handleOk = () => {
            this.setState({visible: false});
        };
    
        const handleCancel = () => {
            this.setState({visible: false});
        };
       

        return (     
            <>   
                <Button type="primary" onClick={showModal} >
                    Edit
                </Button>
                <Modal 
                    title="Manage Profile" visible={this.state.visible} onOk={handleOk} onCancel={handleCancel}
                    okText="Submit"
                    okButtonProps={{form: 'save-profile-form', key:'submit', htmlType:'submit'}}
                    destroyOnClose={true}
                >
                    <Form
                        layout="vertical"
                        onFinish={this.onFinish}
                        id='save-profile-form'
                    >
                        <Form.Item
                        name="displayName"
                        label="Display Name"
                        initialValue={this.props.profile.displayName}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item 
                            name="github"
                            label="Github URL"
                            initialValue={this.props.profile.github}
                        >
                            <Input />
                        </Form.Item>
                            
                    </Form>
                </Modal>
            </>
        );
    }
}

const mapStateToProps = state => ({
    profile: state.profile.profile,
    parentProfile:state.profile,
    user: state.auth.user,
});

export default connect(mapStateToProps, {saveMyProfile})(EditButton);