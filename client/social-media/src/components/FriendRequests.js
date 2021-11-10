import React, { useState, useContext, useEffect } from 'react';
import  { useHistory,useParams } from 'react-router-dom';
import { ProfileContext } from '../context/ProfileState'
import Loading from './Loading';
import Denied from './Denied';

const FriendRequests = () => {
    const {  friendRequests, acceptRequest, cancelRequest,friendRequestsLoading,getFriendRequests} = useContext(ProfileContext);
    let { username }= useParams();
   
    useEffect(()=>{
        if(localStorage.getItem("jwt")&&JSON.parse(localStorage.getItem("jwt")).username===username)
            getFriendRequests(username);
    },[])
    return (
        <>
        {
        !localStorage.getItem("jwt")?<Denied/>:
        JSON.parse(localStorage.getItem("jwt")).username!==username?<Denied />:
        friendRequestsLoading?<Loading />:
        <div>
            <h3 className="mx-2 my-4 px-2 py-3">Friend Requests</h3>
                <div className="mx-5">
                    <h5>Recieved Friend Request</h5>
                    {
                        friendRequests.received.length>0?
                        friendRequests.received.map((req,index)=>(
                            <div key={index} className="media mx-2 my-2 px-2 py-2 border rounded" > 
                                <a  href={`/profile/${req.username}`}>
                                <img src={`/img/${req.pic}`} className="mr-3 img-thumbnail profile-pic"  />
                                </a>
                                <div className="media-body w-100">
                                    <div className="d-flex">
                                        <div>
                                            <a href={`/profile/${req.username}`}><h5 className="mt-0">{req.nickname}</h5></a>
                                        </div>
                                        <div className="ml-auto ">
                                            <div className="btn btn-light" onClick={()=>acceptRequest(req.username)}>Accept</div>
                                            <div className="btn btn-light ml-2" onClick={()=>cancelRequest(req.username)}>Cancel</div>
                                        </div>
                                    </div>
                                
                                </div>
                            </div>
                       
                        )) :
                        <div className="d-flex justify-content-center">
                            <h5>You haven't received any friend requests yet.</h5>
                        </div>
                    }
                    <hr/>
                    <h5>Sent Friend Request</h5>
                    {
                        friendRequests.sent.length>0?
                        friendRequests.sent.map((req,index)=>(
                            <div key={index} className="media mx-2 my-2 px-2 py-2 border rounded" > 
                                <a  href={`/profile/${req.username}`}>
                                <img src={`/img/${req.pic}`} className="mr-3 img-thumbnail profile-pic"  />
                                </a>
                                <div className="media-body w-100">
                                    <div className="d-flex">
                                        <div>
                                            <a href={`/profile/${req.username}`}>
                                                <h5 className="mt-0">{req.nickname}</h5>
                                                <h5 className="mt-0 text-muted">@{req.username}</h5>
                                            </a>
                                        </div>
                                        <div className="ml-auto ">
                                            <div className="btn btn-light ml-2" onClick={()=>cancelRequest(req.username)}>Cancel</div>
                                        </div>
                                    </div>
                                
                                </div>
                            </div>
                       
                        )) :
                        <div className="d-flex justify-content-center">
                            <h5>You haven't sent any friend requests yet.</h5>
                        </div>
                    }
                </div>
                
            
        </div>
        }
        </>

    )
}

export default FriendRequests;
