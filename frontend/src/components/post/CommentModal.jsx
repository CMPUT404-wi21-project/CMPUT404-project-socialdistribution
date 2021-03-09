import React from 'react';
import { MessageOutlined} from '@ant-design/icons';
import {Modal, Tooltip, Button, Comment, Skeleton, List, Form, Input, Radio} from 'antd';
import {connect} from 'react-redux';
import moment from 'moment';
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm';
// Actions
import {getComments, createComment} from '../../actions/commentActions';

const initialState = {
        visible: false,
        isLoading: false,
        isCommentLoading: false,
        comments: [],
        hasMore: true,
        nextPage: 1,
        type: "text/plain",
};


class CommentModal extends React.Component {
    state=initialState;

    showModal = () => {
        // Retrieves the first page of comments, figure out how to paginate
        this.setState({visible: true});
        // Should make a call to refresh the comments here
        /* 
         * Make a Call to the API to get all current comments and store them in state
         */
        this.setState({isLoading: true});
        this.props.getComments(this.props.post.href, this.state.nextPage, (response) => {
           // What to do when the stuff returns 
           this.setState({isLoading: false});
           if (response.status === 200) {
               this.setState({comments: this.state.comments.concat(response.data.comments)});
               // Check if there are more pages after this?
               if (response.data.next === "") {
                    this.setState({hasMore: false});
               }
               console.log(this.state.comments);
           }
        });

    }

    onFinishComment = (values) => {
        let vals = {content: values.comment_content, contentType: values.contentType};
        //values = {'content': values.comment-content, 'contentType': values.contentType};
        // Make an axios request to add a comment
        this.props.createComment(this.props.post.href, vals, (response)=> {
            if (response.status === 201) {
                //console.log(response);
                this.setState({comments: this.state.comments.push(response.data)});
                // Currently will be appending the new comment to the end
            }
        })
        
    }


    // ==== FORM ITEMS =====
    commentplaintextFormItem = () => (
        <Form.Item 
            name="comment_content"
            
            rules={[{required: true, message: "Please Input Content!"}]}
        >
          <Input placeholder="comment"/>  
        </Form.Item>
    )

    commentmarkdownFormItem = () =>( 
        <Form.Item 
            name="comment_content"
            
            rules={[{required: true, message: "Please Input Content!"}]}
        >
          <Input placeholder="comment"/>  
        </Form.Item>
    )

    // =====================

    handleOk = () => {
        this.setState({visible: false});
        this.setState(initialState);
    }

    handleCancel = () => {
        this.setState({visible:false})
        this.setState(initialState);
    }

    

    commentTypeChange = e => {
        this.setState({type: e.target.value});
    }

    getContent(item) {
        if (item.contentType === "text/plain") {
            return (<p>{item.comment}</p>)
        } else if (item.contentType === "text/markdown") {
            return (<div style={{textAlign: 'left', marginTop: '10px', wordWrap: 'break-word'}}><ReactMarkdown plugins={[gfm]} children={item.comment}/> </div>)
        }
    }


    constructor(props) {
        super(props);
    }


    render() {
       // May need to handle count of comments beside the comment button
       return (
           <> 
            <Tooltip title="Comments" onClick={this.showModal}>
              <Button shape="circle" icon={<MessageOutlined />} />
            </Tooltip>
            <Modal title="Comments" 
                visible={this.state.visible} 
                onCancel={this.handleCancel}
                footer={[
                    <Button key="Close" onClick={this.handleOk}>Close</Button>,
                ]}>
                {this.state.isLoading?(
                   <Skeleton active/>) :(
                    <>
                    <Form id="create-post-form" layout="vertical" onFinish={this.onFinishComment}
                        initialValues={{contentType: this.state.type}}
                    >
                        <Form.Item name="contentType">
                            <Radio.Group onChange={this.commentTypeChange} name="contentType">
                                <Radio.Button value="text/plain">Plaintext</Radio.Button>
                                <Radio.Button value="text/markdown">Markdown</Radio.Button>
                                <Radio.Button value="application/base64">Application</Radio.Button>
                                <Radio.Button value="image/jpeg;base64">JPEG</Radio.Button>
                                <Radio.Button value="image/png;base64">PNG</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        {this.state.type === "text/plain"?this.commentplaintextFormItem():null} 
                        {this.state.type === "text/markdown"?this.commentmarkdownFormItem():null}
                        <Button type="primary" htmlType="submit" >
                            Comment
                       </Button>
                    </Form>
                    <List
                        className="comment-list"
                        itemLayout="horizontal"
                        dataSource={this.state.comments}
                        renderItem={item => (
                          <li>
                            <Comment
                                
                               author={item.author.displayName} 
                               content={this.getContent(item)
                               }
                               datetime={
                                <Tooltip title={moment().format(item.published)}>
                                  <span>{moment().fromNow()}</span>
                                </Tooltip>
                               }                       
                            />
                          </li>
                        )}
                      />
                    </>
                   )

                }
            </Modal>
            </>
       ) 
    };
}

export default connect(null, {getComments, createComment})(CommentModal);
