import React from 'react';
import {connect} from 'react-redux';

import {Row, Col} from 'antd';
import { Menu } from 'antd';
import {UserOutlined, ContactsOutlined, GithubOutlined} from '@ant-design/icons';
import AboutMe from './AboutMe';
import EditButton from './EditButton';
import Github from './GitHub';

class PageLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = { key: 'aboutMe' }
    }    

    handleClick = e => {
        this.setState({key: e.key});
    };    

    componentDidMount() {

    }

    render() {
        //page style
        const {key } = this.state;
        
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
                <Col span={8} style={{
                    backgroundColor: 'aqua',
                    height: '80vh',
                }}>

                </Col>
                <Col span={16} style={rightCol}>
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
                        (<>
                            <Github />
                        </>)}
                </Col>
            </Row>
        );
    }
}

const mapStateToProps = state => ({
    profile: state.profile.profile,
});

export default connect(mapStateToProps, {})(PageLayout);


                
