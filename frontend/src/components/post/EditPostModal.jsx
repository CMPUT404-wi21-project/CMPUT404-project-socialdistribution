import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Form, Input, Radio, Select, Switch, Alert, Upload } from 'antd';
import { PlusOutlined, MinusCircleOutlined  } from '@ant-design/icons';

// Import actions
import {editPost} from '../../actions/postActions';
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
        confirmLoading: false,
        content: "",
        categories: {},
        type: this.props.contentType,
        msg: null,
        image: this.props.image,
        hasInitImage: this.props.hasInitImage,
        updateImage: "update",
        index: this.props.index,
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
                    this.props.closeEditModal(this.props.index);
                }
            }
        }
    }
    
    handleCancel = () => {
        this.props.clearErrors();
        this.props.closeEditModal(this.props.index);
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
        this.props.editPost(values, this.props.initialValues.id);
        this.props.getEditedIndex(this.props.index);
        console.log(this.props.index)
        this.props.closeEditModal(this.props.index);
    }
     
    // Update the content type in the state to ensure we show relevant information in the form
    postTypeChange = e => {
        this.setState({type: e.target.value});
    }

    imageFromChange = e => {
        this.setState({imageFrom: e.target.value});
    }

    updateImageChange = e => {
        this.setState({updateImage: e.target.value});
        this.setState({hasInitImage: false});
    }

    render()  {
        return (
            <>
                <Modal
                    title="Edit Post"
                    visible={true}
                    okText="Submit"
                    onCancel={this.handleCancel}
                    okButtonProps={{form: 'create-post-form', key:'submit', htmlType:'submit'}}
                    destroyOnClose={true}
                    confirmLoading={this.props.isLoading}
                    onOk={() => this.onFinish}
                    >
                    <Form layout="vertical" 
                          id="create-post-form"
                          onFinish={this.onFinish}
                          initialValues={this.props.initialValues?this.props.initialValues:{contentType: this.state.type}}
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

                    {this.state.image?
                    <Radio.Group onChange={this.updateImageChange} name="updateIamge">
                    <Radio.Button value="update">Update An New Image</Radio.Button>
                    <Radio.Button value="keep">Keep The Original Image</Radio.Button>
                    </Radio.Group>
                    :null}

                    {this.state.updateImage=="update" && !this.state.hasInitImage?
                        <div><Form.Item name="contentType" label="Type">
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
                        </div>:null}
                    
                    
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
    postsCreated: state.post.postsCreated,
});
export default connect(mapStateToProps, {editPost, clearErrors})(CreatePostModal);
