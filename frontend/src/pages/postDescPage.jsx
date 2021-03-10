import React from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import {Row, Col, Button} from 'antd';
import { Skeleton, Switch, List, Avatar, Space, Spin } from 'antd';
import { StarOutlined, LikeOutlined, MessageOutlined, UserOutlined } from '@ant-design/icons';

import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'

import PaginationModal from '../components/post/PaginationModal';

import { getPostByPostId } from '../actions/postActions';
import { clearErrors } from '../actions/errorActions'
import { navigatePage } from "../actions/pageActions";
import { GET_POST_FAIL } from '../actions/types';

class postDescPage extends React.Component {
  constructor(props){
    super(props);
  }

  componentDidMount = () => {
    this.props.clearErrors();
    this.props.getPostByPostId(this.props.match.params.id);
    this.props.navigatePage(1);
  }

  render(){
    if (!this.props.isAuthenticated){
      return <Redirect to="/"/>
    }
    if (this.props.error.id && this.props.error.id.toString() === GET_POST_FAIL){
      return <Redirect to="/"/>
    }
    
    return(
      
      <>
        {!this.props.post ? (<Space size="middle"> <Spin size="large" /> </Space>) :
        <div className='postDetail' style={{marginTop: '40px'}}> 
          <h1 style={{color: 'black', fontSize: '30px'}}>{this.props.post.title}</h1>
          <h3 style={{color: 'grey'}}>{this.props.post.author.displayName}</h3>
          <h3>{this.props.post.description}</h3>
          <p style={{textAlign: 'left', marginLeft: '20%'}}>{this.props.post.content}</p>
        </div>
        }
      </>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error,
  authorId: state.auth.user.pk,
  isLoading: state.post.isLoading,
  post: state.post.post,
});

export default connect(mapStateToProps, {getPostByPostId, clearErrors, navigatePage})(postDescPage);
