import React, { useState, useContext, useEffect } from 'react';
import  { useHistory,useParams } from 'react-router-dom';
import { ProfileContext } from '../context/ProfileState'
import Loading from './Loading';

const ProfileInfo = ()=> {  
    const {profile,unFriend,cancelRequest,acceptRequest,sentRequest, profileLoading} = useContext(ProfileContext);
    
    return (
        
        
            <div className="card mb-2">
            <div className="d-flex">
            {   profileLoading?null:
               <div className="card-body">
                    <img src={`/img/${profile.pic}`} className="mr-3 img-thumbnail profile-pic-lg"  />
                   <div><h3>{profile.nickname}</h3></div>           
                   <div> <h5 className="text-muted">@{profile.username}</h5></div>
                   <div><h5> {profile.bio}</h5></div>  
               </div>
            }
               <div className="ml-auto mt-auto mr-3 mb-3 ">
                   {
                       !localStorage.getItem("jwt")?null:
                       <>
                           {   profileLoading?null:
                               profile.isFriend?
                               <div className="btn btn-light ml-2" onClick={()=>{unFriend(profile.username)}}>Unfriend</div>:
                               profile.isSent?
                               <div className="btn btn-light ml-2" onClick={()=>{cancelRequest(profile.username)}}>Cancel Request</div>:
                               profile.isReceived?
                               <>
                               <div className="btn btn-light ml-2" onClick={()=>{acceptRequest(profile.username)}}>Accept Request</div>
                               <div className="btn btn-light ml-2" onClick={()=>{cancelRequest(profile.username)}}>Reject Request</div>
                               </>:
                               profile.username!==JSON.parse(localStorage.getItem("jwt")).username?
                               <div className="btn btn-light ml-2" onClick={()=>{sentRequest(profile.username)}}>Add Friend</div>
                               :
                               null

                           }
                       </>
                   }
               </div>
            </div>
           
       </div>  
     
              
    );
}

export default ProfileInfo;
