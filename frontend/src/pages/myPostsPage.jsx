import React from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import {Row, Col, Button} from 'antd';
import { Skeleton, Switch, List, Avatar, Space, Spin } from 'antd';
import { StarOutlined, LikeOutlined, MessageOutlined, UserOutlined } from '@ant-design/icons';

import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'

import CreatePostModal from '../components/post/CreatePostModal';
import EditPostModal from '../components/post/EditPostModal';
import PaginationModal from '../components/post/PaginationModal';
import DropDown from '../components/post/DropDown'

import { getCurAuthorPosts } from '../actions/postActions';

const IconText = ({ icon, text }) => (
  <span>
    {React.createElement(icon, { style: { marginRight: 8 } })}
    {text}

  </span>
);
class myPostsPage extends React.Component {
  constructor(props){
    super(props);
    this.addPostsIntoList = this.addPostsIntoList.bind(this);
    this.getEditedIndex = this.getEditedIndex.bind(this);
    this.openEditModal = this.openEditModal.bind(this);
    this.closeEditModal = this.closeEditModal.bind(this);
    this.state = {posts: [], openEditModal: false};
    this.state1 = {posts: []};
    this.editedIndex = -1;
    this.index = -1;
  }

  componentDidMount = () =>{
    // get posts when render the component
    this.props.getCurAuthorPosts();
  }

  componentDidUpdate = () => {
    if (this.props.postsCreated){
      this.props.getCurAuthorPosts();
    }

    if (!this.props.isLoading && this.state.posts.length != this.props.posts.length){
      this.addPostsIntoList(this.props.posts);
    }

    const isEdited = (JSON.stringify(this.props.posts[this.editedIndex]) !== JSON.stringify(this.state1.posts[this.editedIndex]))
    if (!this.props.isLoading && this.editedIndex != -1 && isEdited){
      this.addPostsIntoList(this.props.posts);
      this.editedIndex = -1;
    }
  }

  openEditModal = (index) => {
    this.index = index;
    this.setState({openEditModal: true});
  }

  closeEditModal = (index) => {
    this.index = index;
    this.setState({openEditModal: false});
  }

  renderSwitch(contentType, content) {
        switch (contentType) {
            case 'text/plain':
                return content;
            case 'text/markdown':
                return <ReactMarkdown plugins={[gfm]} children={content} />;
            case "image/png;base64":
              return <img src={content} width="300px"></img>;
            case "image/jpeg;base64":
              return <img src={content} width="300px"></img>;
            default:
                return content;
        }
  }

  getEditedIndex = (index) =>{
    this.editedIndex = index;
  }

  addPostsIntoList = (posts) => {
    this.state1.posts = posts;
    let dataList = [];
    for (let i = 0; i < posts.length; i++) {
      dataList.push({
        author: `${posts[i]['author']['displayName']}`,
        href: `${posts[i]['id']}`,
        title: `${posts[i]['title']}`,
        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        description:
        `${posts[i]['description']}`,
        content:
        `${posts[i]['content']}`,
        visibility:
        `${posts[i]['visibility']}`,
        unlisted:
        `${posts[i]['unlisted']}`,
        categories:
        `${posts[i]['categories']}`,
        contentType:
        `${posts[i]['contentType']}`,
        content:
        `${posts[i]['content']}`,
        image: null,

        index: i
      });
    }
    this.setState({posts: dataList});
  } 

  render() {
    if (!this.props.isAuthenticated) {
        return <Redirect to="/"/>
    }    

    return (
    <>
        <Row style={{margin: "2%"}}>
          <CreatePostModal/>
        </Row>
        <>
        {this.props.isLoading?(<Space size="middle">
            <Spin size="large" />
          </Space>):(
            <List
            itemLayout="vertical"
            size="large"
            dataSource={this.state.posts}
            style={{marginLeft: 'auto', marginRight: 'auto', height:'80%', width:'80%'}}
            renderItem={item => (
              <List.Item
                key={item.index}
                style={{borderColor: '#eee #ddd #bbb', maxWidth: '80%', backgroundColor: 'white', marginLeft: 'auto', marginRight: 'auto'}}
                actions={
                  [
                    <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
                    <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
                    <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,                    
                    <DropDown url={item.href} openEditModal={this.openEditModal} index = {item.index}/>
                     
                  ]
                  
                }
              >
                {this.state.openEditModal && item.index == this.index ?
                  <Row style={{margin: "2%"}}>
                    <EditPostModal 
                    text="Edit Post"
                    initialValues={{
                      title:item.title, 
                      description:item.description,
                      visibility:item.visibility,
                      unlisted:item.unlisted == 'true',
                      categories:JSON.parse(item.categories),
                      contentType:item.contentType,
                      content:item.contentType==="text/plain"||item.contentType==="text/markdown"?item.content:null,
                      id:item.href.split("/").pop()
                    }}
                    contentType={item.contentType}
                    image={item.contentType==="image/jpeg;base64"||item.contentType==="image/png;base64"?item.content:null}
                    hasInitImage={item.contentType==="image/jpeg;base64"||item.contentType==="image/png;base64"?true:false}
                    index={item.index}
                    getEditedIndex = {this.getEditedIndex}
                    closeEditModal = {this.closeEditModal}
                    />
                   </Row>
                   : null}
                <Skeleton loading={false} active avatar>
                  <List.Item.Meta
                    avatar={<Avatar src={item.avatar} />}
                    title={<div style={{textAlign: 'left'}}><a href={item.href}>{item.title}</a> </div>}
                    description={<div style={{textAlign:'left'}}>{item.author + ':  '}{item.description}</div>}
                  />
                  <div style={{textAlign: 'left', marginTop: '10px'}}>
                  {this.renderSwitch(item.contentType, item.content)}
                  </div>
                </Skeleton>
              </List.Item>
            )}
          />

          )}
        </>
        <Row style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20px"}}>
          <PaginationModal/>
        </Row>
    </>
   ); 
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error,
  posts: state.post.posts,
  isLoading: state.post.isLoading,
  postsCreated: state.post.postsCreated,
});

export default connect(mapStateToProps, {getCurAuthorPosts})(myPostsPage);
