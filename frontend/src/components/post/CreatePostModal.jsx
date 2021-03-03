import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Form, Input, Radio, Select, Switch, Alert, Upload } from 'antd';
import { PlusOutlined, MinusCircleOutlined  } from '@ant-design/icons';

// Import actions
import {createPost} from '../../actions/postActions';
import {clearErrors} from '../../actions/errorActions';

const plaintextFormItem = () => (
    <Form.Item 
        name="content"
        rules={[{required: true, message: "Please Input Content!"}]}
    >
      <Input.TextArea />  
    </Form.Item>
)

const markdownFormItem = () => (
    <Form.Item 
        name="content"
        rules={[{required: true, message: "Please Input Content!"}]}
    >
      <Input.TextArea />  
    </Form.Item>
);

const visibilities = [
  { label: 'Public', value: 'public' },
  { label: 'Friends', value: 'friends' },
];

class CreatePostModal extends React.Component {
    state = {
        visible: false,
        confirmLoading: false,
        content: "",
        categories: {},
        type: "text/plain",
        msg: null,
        image: null,
        imageFrom: null,
    }


    componentDidUpdate(prevProps) {
        const { error,  isLoading, createError } = this.props;

        if (error !== prevProps.error) {
            // Check for a login error
            if (error.id === 'CREATE_POST_FAIL') {
               this.setState({msg: error.msg}); 
            } else {
                this.setState({msg: null});
            }
        } else if (isLoading !== prevProps.isLoading) {
            if (createError === false) {
                if(isLoading === false) {
                    this.setState({visible: false});
                }
            }
        }
    }
    
    handleCancel = () => {
        this.props.clearErrors();
        this.setState({visible: false});
        // Clear all the content of the modal as well
    }

    getBase64(e) {
        var file = e.target.files[0];
        if (file === undefined) {
          return;
        } else {
          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            this.setState(({image:reader.result}))
          };
          reader.onerror = (err) => {
            console.log(err);
            this.setState({msg: err}); 
          };
        }
      }
    
    getImageUrl = async (e)=>  {
        this.setState(({image:e.target.value}))
    }
    
    jpegFormItem = () => (
        
        <Form.Item 
            name="content"
            rules={[{message: "Please Upload An Image"}]}
        >
            <Radio.Group onChange={e => this.imageFromChange(e)} name="imageFrom">
                <Radio.Button value="local">Local Input</Radio.Button>
                <Radio.Button value="link">Link To Images</Radio.Button>
            </Radio.Group>
            {this.state.imageFrom === "local"?
            <input required
            type="file"
            accept=".jpeg"
            onChange={(e) => this.getBase64(e)}
            />:null}
            {this.state.imageFrom === "link"?
            <input required 
            type="url"
            onChange={(e) => this.getImageUrl(e)}
            />:null}
            
        </Form.Item>
    );
    
    
    pngFormItem = () => (
        
        <Form.Item 
            name="content"
            rules={[{ message: "Please Upload An Image"}]}
        >
        

            <Radio.Group onChange={e => this.imageFromChange(e)} name="imageFrom">
                <Radio.Button value="local">Local Input</Radio.Button>
                <Radio.Button value="link">Link To Images</Radio.Button>
            </Radio.Group>
            {this.state.imageFrom === "local"?
            <input required
            type="file"
            accept=".png"
            onChange={(e) => this.getBase64(e)}
            />:null}
            {this.state.imageFrom === "link"?
            <input required 
            type="url"
            onChange={(e) => this.getImageUrl(e)}
            />:null}
        
        </Form.Item>
    );

    showModal = () => {
        this.setState({visible: true});
    }

    onFinish = (values) => {
        // It can be the case that the user provides no categories, in that case, default to []
        if (values.categories === undefined) {
            values.categories = []
        }
        if (values.unlisted === undefined) {
            values.unlisted = false;
        }
        if (values.contentType==="image/png;base64" || values.contentType==="image/jpeg;base64"){
            values.content = this.state.image;
        }
        this.props.createPost(values); 
    }
     
    // Update the content type in the state to ensure we show relevant information in the form
    postTypeChange = e => {
        this.setState({type: e.target.value});
    }

    imageFromChange = e => {
        this.setState({imageFrom: e.target.value});
    }

    render()  {
        return (
            <>
                <Button type="primary" 
                        icon={<PlusOutlined />} 
                        size="large"
                        onClick={this.showModal}>
                    Create Post  
                </Button>
                <Modal
                    title="Create Post"
                    visible={this.state.visible}
                    okText="Submit"
                    onCancel={this.handleCancel}
                    okButtonProps={{form: 'create-post-form', key:'submit', htmlType:'submit'}}
                    destroyOnClose={true}
                    confirmLoading={this.props.isLoading}
                    o
                    >
                    <Form layout="vertical" 
                          id="create-post-form"
                          onFinish={this.onFinish}
                          initialValues={{contentType: this.state.type}}
                    >
                        {this.state.msg? <Alert message={this.state.msg} type="error" />: null}
                        <Form.Item 
                            label="Title" name="title"
                            rules={[{required: true, message: "Please input a title!"}]}
                            >
                            <Input placeholder="Title"/>
                        </Form.Item>
                        <Form.Item 
                            label="Description" name="description"
                            rules={[{required: true, message: "Please provide a description!"}]}
                            >
                            <Input placeholder="Description"/>
                        </Form.Item>
                        <Form.Item 
                            name="visibility"
                            label="Visibility" 
                            rules={[{ required: true, message: 'Please select visibility' }]}>
                            <Select options={visibilities} />
                        </Form.Item>
                        <Form.Item label="Unlisted" name="unlisted" valuePropName="checked">
                          <Switch />
                        </Form.Item>
                        <Form.Item label="Categories">
                            <Form.List name="categories" label="categories">
                                {(fields, {add, remove}) => (
                                    <div>
                                      {fields.map(field => (
                                        <div style={{display:"flex"}}>
                                            <Form.Item {...field} 
                                                rules={[{required: true, message: "Provide a Category!"}]}>
                                              <Input />
                                            </Form.Item>
                                            <Button
                                                type="danger"
                                                className="dynamic-delete-button"
                                                onClick={() => remove(field.name)}
                                                icon={<MinusCircleOutlined />}
                                              >
                                              </Button>
                                          </div>
                                      ))}
                                        <Form.Item>
                                          <Button
                                            type="dashed"
                                            onClick={() => add()}
                                          >
                                            <PlusOutlined /> Add Category 
                                          </Button>
                                        </Form.Item>
                                    </div>
                                  )}
                            </Form.List>
                        </Form.Item>
                        <Form.Item name="contentType" label="Type">
                            <Radio.Group onChange={this.postTypeChange} name="contentType">
                                <Radio.Button value="text/plain">Plaintext</Radio.Button>
                                <Radio.Button value="text/markdown">Markdown</Radio.Button>
                                <Radio.Button value="application/base64">Application</Radio.Button>
                                <Radio.Button value="image/jpeg;base64">JPEG</Radio.Button>
                                <Radio.Button value="image/png;base64">PNG</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                    {this.state.type == "text/plain"?plaintextFormItem():null}
                    {this.state.type == "text/markdown"?markdownFormItem():null}
                    {this.state.type == "image/jpeg;base64"?this.jpegFormItem():null}
                    {this.state.type == "image/png;base64"?this.pngFormItem():null}
                    </Form>
                </Modal>
            </>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    error: state.error,
    isLoading: state.post.isLoading,
    createError: state.post.createError,
});
export default connect(mapStateToProps, {createPost, clearErrors})(CreatePostModal);
