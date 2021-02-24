import React from 'react';
import CustomLayout from '../containers/layout';
import EntryCard from '../components/auth/EntryCard';


import {Typography} from 'antd';
const {Title} = Typography;


/*
 * Show this page when the user is not authorized.
 * It will provide the user with the ability to login or sign up
 */
class LandingPage extends React.Component {
    constructor(props) {
        super(props);
    }
    


    render() {
        return (
               <div>
                   <Title>Welcome to Social Distribution</Title>
                    <div className="container" style={{display:"flex", justifyContent:"center"}}>
                        <EntryCard
                        LoginHandler={this.LoginHandler} 
                        RegisterHandler={this.RegisterHandler}/> 
                    </div>
                </div>
        );
    }
}

export default LandingPage;

