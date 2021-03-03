import React from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import { getMyProfile } from '../actions/profileActions';
import { message} from 'antd';

import PageLayout from '../components/profile/PageLayout'

//Redirect user to its profile apge
class myProfile extends React.Component {
    constructor(props){
        super(props);        
    }    

    componentDidMount(){
        this.props.getMyProfile();    
    }

    //rerender page when update
    componentDidUpdate() {    
        if (this.props.profile.updateFoo){
            this.props.profile.updateFoo=false;            
            this.props.getMyProfile();    
            if(this.props.profile.loadFailed){
                message.warning('Failed to laod from server');   
            }    
            
        }        
    }

    render() {
        if (!this.props.isAuthenticated) {
            return <Redirect to="/"/>
        } 

        return (
            <>
                <PageLayout/>
            </>
        ); 
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    profile: state.profile,
    error: state.error,
});

export default connect(mapStateToProps, {getMyProfile})(myProfile);