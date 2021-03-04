import React from 'react';
import {connect} from 'react-redux';
import { EditOutlined, DeleteOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Menu, Dropdown, message} from 'antd';
import {deletePost, getCurAuthorPosts} from '../../actions/postActions'

class DropDown extends React.Component {
    constructor(props) {
        super(props);
        this.a = this.props.url.split("/");
        this.id = this.a[this.a.length - 1];
    }    

    handleMenuClick = (e) =>  {
        if(e.key == "delete"){
            this.props.deletePost(this.id);
            if(this.props.deleteError){
                message.error('Post delete failed');
            }
            else{
                message.success('Post delete success');
            }
        }

        if (e.key == "edit"){
            this.props.openEditModal(this.props.index);
        }
    }

    render() {      
        const menu = (
            <Menu onClick={this.handleMenuClick}>
                <Menu.Item key="edit" icon={<EditOutlined />}>
                    Edit
                </Menu.Item>
                <Menu.Item key="delete" icon={<DeleteOutlined />}>
                    Delete
                </Menu.Item>
            </Menu>
          );

        return (        
            <Dropdown trigger={['click']} overlay={menu}>
                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                    <EllipsisOutlined />
                </a>
            </Dropdown>
        );
    }
}

const mapStateToProps = state => ({
    profile: state.profile.profile,
});

export default connect(mapStateToProps, {deletePost, getCurAuthorPosts})(DropDown);