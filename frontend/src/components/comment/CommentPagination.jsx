import React from 'react';

// REDUX
import {connect} from 'react-redux';
import {getComments} from '../../actions/commentActions';

// ANTD
import {Button, Tooltip} from 'antd';
import { DownCircleOutlined } from '@ant-design/icons';

class CommentPagination extends React.Component {
    constructor(props) {
        super(props);
        this.fetchNextPage = this.fetchNextPage.bind(this);
    }

    fetchNextPage = () => {
        this.props.getComments(this.props.post.apihref, this.props.page); 
    }

    render() {
         if (this.props.hasMore) {
            return ( 
                <Tooltip title="More Comments" onClick={this.fetchNextPage}>
                      <Button type="primary" shape="circle" icon={<DownCircleOutlined />} />
                </Tooltip>
            );

        } else {
            return (null);
        }
    }
}

const mapStateToProps = state => ({
    isCommentsLoading: state.comment.isCommentsLoading,
    Comments: state.comment.Comments,
    page: state.comment.page,
    hasMore: state.comment.hasMore,
});


export default connect(mapStateToProps, {getComments})(CommentPagination);
