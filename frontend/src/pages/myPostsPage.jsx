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
    this.setPageNum = this.setPageNum.bind(this);
    this.state = {posts: [], openEditModal: false,};
    this.state1 = {posts: []};
    this.editedIndex = -1;
    this.index = -1;
    if (!localStorage.getItem('myPageNum')){
      this.pageNum = 1;
    }else{
      this.pageNum = localStorage.getItem('myPageNum');
    }
    if (!localStorage.getItem('myPageSize')){
      this.pageSize = 1;
    }else{
      this.pageSize = localStorage.getItem('myPageSize');
    }
  }

  componentDidMount = () =>{
    // get posts when render the component
    this.props.getCurAuthorPosts(this.pageNum, this.pageSize);
  }

  componentDidUpdate = () => {
    if (this.props.postsCreated){
      this.props.getCurAuthorPosts(this.pageNum, this.pageSize);
    }

    if (!this.props.isLoading && this.state.posts.length != this.props.posts.length){
      this.addPostsIntoList(this.props.posts);
    }
    let isEdited = false;
    if (this.props.posts){
      isEdited = (JSON.stringify(this.props.posts[this.editedIndex]) !== JSON.stringify(this.state1.posts[this.editedIndex]))
    }
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
                return <div style={{textAlign: 'left', marginTop: '10px', wordWrap: 'break-word'}}>{content}</div>;
            case 'text/markdown':
                return <div style={{textAlign: 'left', marginTop: '10px', wordWrap: 'break-word'}}><ReactMarkdown plugins={[gfm]} children={content}/> </div>;
            case "image/png;base64":
              return <img src={content} width="300px" style={{textAlign: 'center', marginTop: '10px', maxHeight: '80%', maxWidth: '80%'}}></img>;
            case "image/jpeg;base64":
              return <img src={content} width="300px" style={{textAlign: 'center', marginTop: '10px', maxHeight: '80%', maxWidth: '80%'}}></img>;
            default:
                return <div style={{textAlign: 'left', marginTop: '10px', wordWrap: 'break-word'}}>{content}</div>;
        }
  }

  getEditedIndex = (index) =>{
    this.editedIndex = index;
  }

  setPageNum = (num, size) => {
    this.pageNum = num;
    this.pageSize = size;
    this.props.getCurAuthorPosts(this.pageNum, this.pageSize);
    this.addPostsIntoList(this.props.posts);
    // store in local storage
    localStorage.setItem('myPageNum', this.pageNum);
    localStorage.setItem('myPageSize', this.pageSize);
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
                    <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
                    <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,                    
                    <DropDown 
                    correct={this.state.posts.length == this.props.posts.length} 
                    url={item.href} 
                    openEditModal={this.openEditModal} 
                    index = {item.index}
                    />
                     
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
                  {this.renderSwitch(item.contentType, item.content)}
                </Skeleton>
              </List.Item>
            )}
          />

          )}
        </>
        <Row style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20px"}}>
          <PaginationModal setPageNum={this.setPageNum} pageNum={this.pageNum} pageSize={this.pageSize}/>
        </Row>
    </>
   );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error,
  posts: state.post.posts.posts,
  isLoading: state.post.isLoading,
  postsCreated: state.post.postsCreated,
});

export default connect(mapStateToProps, {getCurAuthorPosts})(myPostsPage);
