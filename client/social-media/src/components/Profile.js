import React, { useState, useContext, useEffect} from 'react';
import { ProfileContext } from '../context/ProfileState';
import { GlobalContext } from '../context/GlobalState'
import Loading from './Loading';
import ProfileInfo from './ProfileInfo';
import ProfilePosts from './ProfilePosts';
import Friends from './Friends';
import FriendRequests from './FriendRequests';
import ProfileSetting from './ProfileSetting';
import page404 from './Page404'
import { BrowserRouter, Switch, Route, Link,Redirect,useRouteMatch, useParams  } from 'react-router-dom';

const Profile = () => {
    const {getProfile,profile,profileLoading} = useContext(ProfileContext);
    const { isLogin } = useContext(GlobalContext);
    let { username } = useParams();
    
    useEffect(()=>{
        getProfile(username);        
    },[username,isLogin])

    let match = useRouteMatch();
   
    return (
        <>
        {
            profileLoading?null:
            !profile.username?<page404 />:
        <div className="profile">
        
        <BrowserRouter>
                <ProfileInfo />
                
            <div className="d-flex ml-2">
                <Link to={`${match.url}/posts`}><div className="btn btn-light">Posts</div></Link>
                <Link to={`${match.url}/friends`}><div className="btn btn-light">Friends {profile.numOfFriends}</div></Link>
                {localStorage.getItem("jwt")&&JSON.parse(localStorage.getItem("jwt")).username===username?<Link to={`${match.url}/requests`}><div className="btn btn-light">Friend Requests</div></Link>:null}
                {localStorage.getItem("jwt")&&JSON.parse(localStorage.getItem("jwt")).username===username?<Link to={`${match.url}/setting`}><div className="btn btn-light">Account Setting</div></Link>:null}
               
            </div>
            
            <Switch>
                <Route path={`${match.path}/posts`}  exact component={ProfilePosts}/> />
                <Route path={`${match.path}/friends`} exact  component={Friends}/> />
                <Route path={`${match.path}/requests`} exact  component={FriendRequests}/> />
                <Route path={`${match.path}/setting`} exact component={ProfileSetting}/> />
                <Redirect exact from={`${match.path}/`} to={`${match.path}/posts`} />
          
                
            </Switch>
        
    </BrowserRouter>
       
        </div>
    } 
</>
    );

}

export default Profile;
