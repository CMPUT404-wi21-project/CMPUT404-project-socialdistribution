import React from 'react';
import {connect} from 'react-redux';
import { Pagination } from 'antd';

class PaginationModal extends React.Component {
  state = {
    current: 1,
    size: 1,
  };

  componentDidUpdate = () => {
    this.props.setPageNum(this.state.current, this.state.size);
  }

  onChange = page => {
    this.setState({
      current: page,
    });
  };

  onShowSizeChange = (current, size) => {
    this.setState({
      size: size,
    });
  }

  render() {
    return <Pagination current={this.state.current} pageSize={this.state.size} onChange={this.onChange}
     total={this.props.postPerPage ? this.props.postPerPage : 0} onShowSizeChange={this.onShowSizeChange}
     showSizeChanger={true} pageSizeOptions={[1, 10, 20, 50, 100]}/>;
  }
}

const mapStateToProps = state => ({
  postPerPage: state.post.posts.count,
  prevPage: state.post.posts.prev,
  nextPage: state.post.posts.next,
});

export default connect(mapStateToProps, {})(PaginationModal);