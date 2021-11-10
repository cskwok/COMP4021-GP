import React, { useState, useContext, useEffect } from 'react';
import  { useHistory,useParams } from 'react-router-dom';
import Loading from './Loading';
import { GlobalContext } from '../context/GlobalState'


const Search = () => {
    const { results,resultsLoading,search,unFriend,cancelRequest,acceptRequest,sentRequest } = useContext(GlobalContext);  
    let { query } = useParams();
    useEffect(()=>{
        search(query);
    },[query])
    
    return (
        <>
            {
                resultsLoading?<Loading />:
                <div>
                <h3 className="mx-2 my-4 px-2 py-3">Search Results</h3>
                {
                results.length===0?<div className="d-flex justify-content-center">
                        <h5>No results</h5>
                        </div>:
                results.map((result,index)=>(
                  
                        <div key={index} className="media mx-2 my-2 px-2 py-2 border rounded" > 
                              <a  href={`/profile/${result.username}`}><img src={`/img/${result.pic}`} className="mr-3 img-thumbnail profile-pic"/></a>
                            <div className="media-body w-100">
                                <div className="d-flex">
                                    <div>
                                    <a  href={`/profile/${result.username}`}>
                                        <h5 className="mt-0">{result.nickname}</h5>
                                        <h5 className="mt-0 text-muted">@{result.username}</h5>
                                    </a>
                                    </div>
                                    <div className="ml-auto mr-2">
                                        {
                                            !localStorage.getItem("jwt")?null:
                                            <>
                                                {
                                                    result.isFriend?
                                                    <div className="btn btn-light ml-2" onClick={()=>{unFriend(result.username)}}>Unfriend</div>:
                                                    result.isSent?
                                                    <div className="btn btn-light ml-2" onClick={()=>{cancelRequest(result.username)}}>Cancel Request</div>:
                                                    result.isReceived?
                                                    <>
                                                    <div className="btn btn-light ml-2" onClick={()=>{acceptRequest(result.username)}}>Accept Request</div>
                                                    <div className="btn btn-light ml-2" onClick={()=>{cancelRequest(result.username)}}>Reject Request</div>
                                                    </>:
                                                    result.username!==JSON.parse(localStorage.getItem("jwt")).username?
                                                    <div className="btn btn-light ml-2" onClick={()=>{sentRequest(result.username)}}>Add Friend</div>
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

export default Search
