import React from 'react';
import { LikeOutlined} from '@ant-design/icons';
import {Modal, Tooltip, Button, Comment, Skeleton} from 'antd';
import {connect} from 'react-redux';


class LikeModal extends React.Component {
    state={
        visible: false,
        isLoading: false,
    }

    showModal = () => {
        this.setState({visible: true});
        // Should make a call to refresh the comments here
        /* 
         * Make a Call to the API to get all current comments and store them in state
         */
    }

    handleOk = () => {
        this.setState({visible: false})
    }

    handleCancel = () => {
        this.setState({visible:false})
    }

    constructor(props) {
        super(props);
    } 


    render() {
       // May need to handle count of comments beside the comment button
       return (
           <> 
            <Tooltip title="Likes" onClick={this.showModal}>
              <Button shape="circle" icon={<LikeOutlined />} />
            </Tooltip>
            <Modal title="Likes" 
                visible={this.state.visible} 
                onCancel={this.handleCancel}
                footer={[
                    <Button key="Close" onClick={this.handleOk}>Close</Button>,
                ]}>
                {this.state.isLoading?(
                   <Skeleton active/>) :(null)
                }
            </Modal>
            </>
       ) 
    };
}

export default connect(null, {})(LikeModal);
