import React from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import {Row, Col, Button} from 'antd';
import { Skeleton, Switch, List, Avatar, Space, Spin } from 'antd';
import { StarOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons';

import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'

import CreatePostModal from '../components/post/CreatePostModal';
import PaginationModal from '../components/post/PaginationModal';

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
    this.isUpdated = true;
    this.state = {posts: []};
  }

  componentDidMount = () =>{
    // get posts when render the component
    this.props.getCurAuthorPosts();
  }

  componentDidUpdate = () => {
    if (this.props.isLoading){
      this.isUpdated = false;
    }

    // when there are posts exist
    if (this.props.posts.length !== 0){
      // grab posts when new post is created
      if (!this.props.isLoading && !this.isUpdated && this.state.posts.length == this.props.posts.length){
        // give 1 second for backend server to update
        setTimeout(() => { }, 1000);
        this.props.getCurAuthorPosts();
      }
    }
    else{
      // when first post is getting added
      if (this.props.postsCreated){
        setTimeout(() => { }, 1000);
        this.props.getCurAuthorPosts();
      }
    }
    // rerender when posts is updated
    if (!this.props.isLoading && this.state.posts.length != this.props.posts.length){
      this.addPostsIntoList(this.props.posts);
      this.isUpdated = true;
    }
  }

  addPostsIntoList = (posts) => {
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
        contentType: `${posts[i]['contentType']}`,
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
                  ]
                }
              >
                <Skeleton loading={false} active avatar>
                  <List.Item.Meta
                    avatar={<Avatar src={item.avatar} />}
                    title={<div style={{textAlign: 'left'}}><a href={item.href}>{item.title}</a> </div>}
                    description={<div style={{textAlign:'left'}}>{item.author + ':  '}{item.description}</div>}
                  />
                  <div style={{textAlign: 'left', marginTop: '10px'}}>
                  {(item.contentType == 'text/plain') ? item.content : <ReactMarkdown plugins={[gfm]} children={item.content} />}
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
