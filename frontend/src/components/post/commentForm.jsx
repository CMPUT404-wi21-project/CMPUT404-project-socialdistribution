import React from 'react';
import {Modal, Tooltip, Button, Comment, Skeleton, List, Form, Input, Radio} from 'antd';

const CommentForm = (props) => {
	const [form] = Form.useForm();

	// Case: Submit button out of Form
	const handleFormSubmit = () => {
		form.validateFields()
			.then((values) => {
                props.handleSubmit(values);
			})
			.catch((errorInfo) => {});
	};

    // ==== FORM ITEMS =====
    const commentplaintextFormItem = () => (
        <Form.Item 
            name="content"
            
            rules={[{required: true, message: "Please Input Content!"}]}
        >
          <Input placeholder="comment"/>  
        </Form.Item>
    )

    const commentmarkdownFormItem = () =>( 
        <Form.Item 
            name="content"
            
            rules={[{required: true, message: "Please Input Content!"}]}
        >
          <Input placeholder="comment"/>  
        </Form.Item>
    )



	return (
		<>
			<Form id="create-post-form" layout="vertical"                         
                form={form}
                initialValues={{contentType: props.type}}
                    >
                        <Form.Item name="contentType">
                            <Radio.Group onChange={props.commentTypeChange} name="contentType">
                                <Radio.Button value="text/plain">Plaintext</Radio.Button>
                                <Radio.Button value="text/markdown">Markdown</Radio.Button>
                                <Radio.Button value="application/base64">Application</Radio.Button>
                                <Radio.Button value="image/jpeg;base64">JPEG</Radio.Button>
                                <Radio.Button value="image/png;base64">PNG</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        {props.type === "text/plain"?commentplaintextFormItem():null} 
                        {props.type === "text/markdown"?commentmarkdownFormItem():null}
                    </Form>
                    <Button type="primary" onClick={handleFormSubmit}>
                            Comment
                       </Button>
		</>
	);
};

export default CommentForm;
