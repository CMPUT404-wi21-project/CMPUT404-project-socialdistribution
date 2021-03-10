import React from 'react';

// REDUX
import {connect} from 'react-redux';
import {getComments} from '../../actions/commentActions';

// ANTD
import {List, Comment, Tooltip, Spin} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

// Styling
import moment from 'moment';
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm';


const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;


class CommentList extends React.Component {
    constructor(props) {
        super(props);
        this.fetchData = this.fetchData.bind(this);
    }

    handleItemRender = (item) => {
       switch (item.contentType) {
           case "text/plain":
               return (<p>{item.comment}</p>);
           case "text/markdown":
               return (<div style={{textAlign: 'left', marginTop: '10px', wordWrap: 'break-word'}}>
                            <ReactMarkdown plugins={[gfm]} children={item.comment}/>
                        </div>)
            default:
               return (<p>{item.comment}</p>)
       } 
    }

    componentDidMount() {
       this.props.getComments(this.props.post.apihref, this.props.page); 
    }

    fetchData() {
        this.props.getComments(this.props.post.apihref, this.props.page); 
    }

    render() {
        return (
                    <List
                        className="comment-list"
                        itemLayout="horizontal"
                        dataSource={this.props.Comments}
                        renderItem={item=> {
                            let formatted_publish = moment(item.published).format("YYYYMMDDhmmss");
                            return (
                            <li>
                                <Comment
                                    author={item.author.displayName}
                                    content={this.handleItemRender(item)}
                                    datetime={
                                        <Tooltip title={moment().format(item.published)}>
                                          <span>{moment(formatted_publish, "YYYYMMDDhmmss").fromNow()}</span>
                                        </Tooltip>
                                    }
                                />
                            </li>
                        )}
                       }
                    />
        )
    }
}

const mapStateToProps = state => ({
    isCommentsLoading: state.comment.isCommentsLoading,
    Comments: state.comment.Comments,
    page: state.comment.page, 
});

export default connect(mapStateToProps, {getComments})(CommentList);



