import React from 'react';
import {connect} from 'react-redux';

import {Row, Col} from 'antd';
import { Menu } from 'antd';
import {UserOutlined, ContactsOutlined, GithubOutlined} from '@ant-design/icons';
import AboutMe from './AboutMe';
import EditButton from './EditButton';

class PageLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = { key: 'aboutMe' }
    }    

    handleClick = e => {
        this.setState({key: e.key});
    };    

    render() {
        //page style
        const pageStyle = {
            backgroundColor: 'white',
            padding: '3%',
            margin: 'auto',
            width:'80%',
        }

        const rightCol = {
            textAlign: 'left',
            padding: '5%',
            textAlignVertical: 'top',            
        }
               

        return (
            <Row style={pageStyle}>
                <Col span={6} style={{
                    backgroundColor: 'aqua',
                }}>

                </Col>
                <Col span={18} style={rightCol}>
                    <h1>{this.props.profile.displayName}</h1>
                    <Menu onClick={this.handleClick} mode="horizontal" selectedKeys={[this.state.key]}>
                        <Menu.Item key="aboutMe" icon={<UserOutlined />}>
                        About Me
                        </Menu.Item>
                        <Menu.Item key="github" icon={<GithubOutlined />}>
                        Github Activity
                        </Menu.Item>
                    </Menu>
                    {this.state.key==='aboutMe'?
                        <>
                            <AboutMe />
                            <EditButton />
                        </>:
                    <p>Under developing ...</p>}
                </Col>
            </Row>
        );
    }
}

const mapStateToProps = state => ({
    profile: state.profile.profile,
});

export default connect(mapStateToProps, {})(PageLayout);


                