import React from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';

class HomePage extends React.Component {
    render() {
        if (!this.props.isAuthenticated) {
            return <Redirect to="/"/>
        }
        return (
        <h1> Social Distribution Home Page </h1>
       ); 
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    error: state.error,
});

export default connect(mapStateToProps, {})(HomePage);
