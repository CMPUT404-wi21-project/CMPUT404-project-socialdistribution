import React from 'react';
import {connect} from 'react-redux';

// Antd Imports
import { MessageOutlined} from '@ant-design/icons';
import {Modal, Tooltip, Button} from 'antd';

// Inner Components
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import CommentPagination from './CommentPagination';

// Actions
import {clearComments} from '../../actions/commentActions';

class CommentModal extends React.Component {
    constructor(props) {
        super(props);
    }
   
    // The Modal Should only worry about whether it is opened or closed, everything else is delegated
    state = {
        visible: false,
    }

    handleCancel = () => {
        this.setState({visible: false});
    }
    
    showModal = () => {
        this.setState({visible: true});
    }

    // Called to clear the modal redux state on close each time
    afterClose = () => {
       this.props.clearComments(); 
    }

    render() {
        return (
            <>
                <Tooltip title="Comments" onClick={this.showModal}>
                        <Button shape="circle" icon={<MessageOutlined />} />
                </Tooltip>
                <Modal
                    title="Comments"
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="Close" onClick={this.handleCancel}>Close</Button>
                    ]}
                    destroyOnClose={true}
                    afterClose={this.afterClose}
                >
                <CommentForm post={this.props.post}/> 
                <CommentList post={this.props.post}/>
                <CommentPagination post={this.props.post}/>
                </Modal>
            </>
        )
    };
}

export default connect(null, {clearComments})(CommentModal);
