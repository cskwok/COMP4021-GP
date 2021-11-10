import React, { useState, useContext, useEffect } from 'react';
import  { useHistory,useParams } from 'react-router-dom';
import { ProfileContext } from '../context/ProfileState'
import Loading from './Loading';
import FriendRequests from './FriendRequests';

const Friends = () => {
    const { friends,getFriends, friendsLoading,unFriend,cancelRequest,acceptRequest,sentRequest} = useContext(ProfileContext);
    let { username }= useParams();
   
    useEffect(()=>{
        getFriends(username);
    },[])
    return (
        <>
            {
                friendsLoading?<Loading />:
                <div>
                <h3 className="mx-2 my-4 px-2 py-3">Friends</h3>
                {friends.length===0?
                <div className="d-flex justify-content-center">
                <h5>No friend</h5>
                </div>:
                friends.map((friend,index)=>(
                  
                        <div key={index} className="media mx-2 my-2 px-2 py-2 border rounded" > 
                              <a  href={`/profile/${friend.username}`}><img src={`/img/${friend.pic}`} className="mr-3 img-thumbnail profile-pic"/></a>
                            <div className="media-body w-100">
                                <div className="d-flex">
                                    <div>
                                    <a  href={`/profile/${friend.username}`}>
                                        <h5 className="mt-0">{friend.nickname}</h5>
                                        <h5 className="mt-0 text-muted">@{friend.username}</h5>
                                    </a>
                                    
                                    </div>
                                    <div className="ml-auto mr-2">
                                        {
                                            !localStorage.getItem("jwt")?null:
                                            <>
                                                {
                                                    friend.isFriend?
                                                    <div className="btn btn-light ml-2" onClick={()=>{unFriend(friend.username)}}>Unfriend</div>:
                                                    friend.isSent?
                                                    <div className="btn btn-light ml-2" onClick={()=>{cancelRequest(friend.username)}}>Cancel Request</div>:
                                                    friend.isReceived?
                                                    <>
                                                    <div className="btn btn-light ml-2" onClick={()=>{acceptRequest(friend.username)}}>Accept Request</div>
                                                    <div className="btn btn-light ml-2" onClick={()=>{cancelRequest(friend.username)}}>Reject Request</div>
                                                    </>:
                                                    friend.username!==JSON.parse(localStorage.getItem("jwt")).username?
                                                    <div className="btn btn-light ml-2" onClick={()=>{sentRequest(friend.username)}}>Add Friend</div>
                                                    :
                                                    null

                                                }
                                            </>
                                        }
                                    </div>
                                </div>     
                            </div>
                        </div>
                   
                ))}
                
            </div>
        }
        </>
        
    )
}

export default Friends
