import React from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';

/* Page Imports */
import LandingPage from './pages/landing';
import HomePage from './pages/homepage';
import myPostsPage from './pages/myPostsPage'
import postDescPage from './pages/postDescPage'
import myProfile from './pages/myProfile';
import NotFound from './pages/notfound';
import CustomLayout from './containers/layout';

/*
 * Central file for all routing related tasks.
 */

const BaseRouter = (props) => {
        return (
            <CustomLayout>
               <Switch>
                    <Route exact path="/" component={LandingPage}/>
                    <Route exact path="/Home" component={HomePage} />
                    <Route exact path="/MyPosts" component={myPostsPage} />
                    <Route exact path="/profile" component={myProfile}/>
                    <Route exact path="/posts/:id" component={postDescPage}/>
                    <Route exact path="/NotFound" component={NotFound}/>
                    // If no route is found we automically default to NotFound
                    <Redirect to="/NotFound"/> 
               </Switch>
           </CustomLayout>

        );
}

export default BaseRouter;
