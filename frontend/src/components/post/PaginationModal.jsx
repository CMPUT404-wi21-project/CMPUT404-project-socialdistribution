import React from 'react';
import { Pagination } from 'antd';


class PaginationModal extends React.Component {
  state = {
    current: 1,
  };

  onChange = page => {
    this.setState({
      current: page,
    });
  };

  render() {
    return <Pagination current={this.state.current} pageSize={50} onChange={this.onChange} total={50} />;
  }
}

export default PaginationModal;