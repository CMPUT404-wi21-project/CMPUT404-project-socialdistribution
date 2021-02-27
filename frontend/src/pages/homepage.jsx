import React from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import {Row, Col, Button} from 'antd';


import CreatePostModal from '../components/post/CreatePostModal';

class HomePage extends React.Component {
    render() {
        if (!this.props.isAuthenticated) {
            return <Redirect to="/"/>
        }
        return (
        <>
            <Row style={{margin: "2%"}}>
              <CreatePostModal/>
            </Row>
            <Row type="flex" justify="center" align="middle">
                <h1>Stuff will go here, like a Stream ;)</h1>
            </Row>
        </>
        
       ); 
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    error: state.error,
});

export default connect(mapStateToProps, {})(HomePage);
