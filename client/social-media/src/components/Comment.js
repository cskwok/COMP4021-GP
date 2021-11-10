import React, { useContext } from 'react';
import { PostsContext } from '../context/PostsState';

const Comment = ({comment,postUsername})=> {
    const {handleCommentLike,getCommentLikedBy,setcommentToDelete} = useContext(PostsContext);
   
    return (
            <div className="media" >
            <a href={`/profile/${comment.username}`}><img src={`/img/${comment.pic}`} className="mr-3 img-thumbnail profile-pic"  /></a>
            <div className="media-body w-100">
                <div className="d-flex">
                    <div>
                    
                    <a href={`/profile/${comment.username}`}><h5 className="mt-0">{comment.nickname}</h5> </a>               
                    {comment.editTime?
                        <small className="text-muted">Last Edited at: {comment.editTime}</small>
                        :
                        <small className="text-muted">Posted at: {comment.postTime}</small> 
                    }            
                    <h5 style={{"whiteSpace": "pre-line"}}>{comment.comment}</h5>  
                    </div>
                    {   !localStorage.getItem("jwt")?null:
                        (comment.username==JSON.parse(localStorage.getItem("jwt")).username||postUsername==JSON.parse(localStorage.getItem("jwt")).username)?
                        <div className="ml-auto mr-2">
                            <span className="material-icons icon-btn" data-toggle="modal" data-target="#deleteConfirm" onClick={()=>setcommentToDelete([comment.postid,comment.commentid])}>delete</span>                    
                        </div>:null

                    }
                </div>
                
                <hr/>
                
                    
                    <div>
                    <span className="icon-btn icon-color" onClick={()=>{handleCommentLike(comment.postid,comment.commentid)}}>
                        {comment.hasLike?
                        <span className="material-icons align-middle like-after">favorite</span>:
                        <span className="material-icons align-middle">favorite_border</span>}                    
                    </span>
                    {comment.numOfLikes>0?<span data-toggle="modal" data-target="#likedByList" className="align-middle ml-1 icon-btn icon-color" onClick={()=>{getCommentLikedBy(comment.commentid)}}>{comment.numOfLikes}</span>:null}
                    </div>
                <hr/> 
            </div>     
                   
        </div> 
         
    );
}

export default Comment;
