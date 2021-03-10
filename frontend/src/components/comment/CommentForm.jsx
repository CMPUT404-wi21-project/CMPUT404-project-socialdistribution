import React from 'react';
import {connect} from 'react-redux';

// ANTD
import {Form, Button, Input, Radio} from 'antd';

// ACTIONS
import {createComment} from '../../actions/commentActions';

class CommentForm extends React.Component {
    state = {type: "text/plain"}
    formRef = React.createRef();

    constructor(props) {        
        super(props);
        this.onCreateCommentFinish = this.onCreateCommentFinish.bind(this);
    }

    onCreateCommentFinish = (values) => {
        this.props.createComment(this.props.post.apihref, values);
        this.formRef.current.resetFields();
        // Clear the form
        console.log(this.props);
    }

    commentTypeChange = e => {
         this.setState({type: e.target.value});
    }

    plaintextFormItem = () => (
        <Form.Item
                name="content"
                rules={[{required:true, message:"Please Input Content!"}]}
        >
            <Input.TextArea showCount maxLength={150}/>
        </Form.Item>
    );

    markdownFormItem = () => (
        <Form.Item
                name="content"
                rules={[{required:true, message:"Please Input Content!"}]}
        >
            <Input.TextArea showCount maxLength={150}/>
        </Form.Item>
    ); 
    

    render() {
        return (
            <Form
                layout="vertical"
                id="create-comment-form"
                onFinish={this.onCreateCommentFinish}
                initialValues={{contentType: this.state.type}}
                ref={this.formRef}
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
                {this.state.type === "text/plain"? this.plaintextFormItem():null}
                {this.state.type === "text/markdown"? this.markdownFormItem():null}
                <Button type="primary" htmlType="submit">
                 Comment 
                </Button>
            </Form>
        )
    }
}

const mapStateToProps = state => ({
    comment: state.comment,
});

export default connect(mapStateToProps, {createComment})(CommentForm);
