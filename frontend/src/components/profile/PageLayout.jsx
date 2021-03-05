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
        this.state = { key: 'aboutMe', items: [], isLoaded:false }
    }    

    handleClick = e => {
        this.setState({key: e.key});
    };    

    componentDidMount() {

        fetch('https://api.github.com/users/GillisGill/events')
            .then(res => res.json())
            .then(json => {
                this.setState({
                    items: json,
                    isLoaded: true, 
                })
            }).catch((err) => {
                console.log(err);
            });

    }

    render() {
        //page style
        const {key, isLoaded, items} = this.state;
        
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
        
        if (!isLoaded)
            return <div>Loading...</div>;


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
                    <p>
                        <a href={this.props.profile.github}>
                            <img src={"https://grass-graph.moshimo.works/images/" + (this.props.profile.github.replace("http://github.com/", '')) + ".png"}           
                            style={{
                                resizeMode: "center",
                                width: 650
                                }}>    
                            </img>
                        </a>     
                        <div>
                            <ul>
                                {items.map(item => (
                                    <li key={item.id}>
                                        {(() => {
                                        if (item.type == "CreateEvent") {
                                            if (item.payload.ref_type == "branch"){
                                                return (
                                                    <li>Created a {item.payload.ref_type}  '{item.payload.ref}' in {item.repo.name} </li>
                                                )
                                            } else {
                                                return(
                                                    <li>Created a {item.payload.ref_type} {item.repo.name} </li>
                                                )
                                            }
                                        } else if (item.type == "PushEvent") {
                                        return (
                                            <li>Created a commit in repository {item.repo.name}</li>
                                        )
                                        } else if (item.type == "ForkEvent") {
                                        return (
                                            <li>Forked a repository {item.payload.forkee.full_name}</li>
                                        )
                                        } else {
                                        return (
                                            <li>other</li>
                                        )
                                        }
                                        })()}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </p>}
                </Col>
            </Row>
        );
    }
}

const mapStateToProps = state => ({
    profile: state.profile.profile,
});

export default connect(mapStateToProps, {})(PageLayout);


                