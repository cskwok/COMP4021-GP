import React, {  useContext, useEffect } from 'react';
import { PostsContext } from '../context/PostsState';
import Post from './Post';
import Loading from './Loading';

const Posts = () => {
    const {posts,likedBy,postLoading,likeListloading,setPostToDelete,postToDelete,deletePost,setcommentToDelete,commentToDelete,deleteComment} = useContext(PostsContext);
   
    const handleDelete = async ()=>{
        if(postToDelete){
            await deletePost(postToDelete);
        }
        if(commentToDelete){
            await deleteComment(commentToDelete[0],commentToDelete[1]);
        }
        
    }

    return (
        <>
        {
            postLoading?<Loading />:
            <div className="Posts">
            {
                posts.length >0?
                posts.map((post,index)=>(
                    <Post key={index}  post={post}/>
                )):
                <div className="d-flex justify-content-center">
                        <h5>This user hasn't posted anything yet</h5>
                </div>
            }
            <div className="modal" id="likedByList" tabIndex="-1" role="dialog" aria-labelledby="likedByListTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered" role="document">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title" id="likedByListTitle">liked By</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div className="modal-body">   
            {   likeListloading?<Loading />:
                likedBy.map((like,index)=>(                            
                    <a key={index}  href={`/profile/${like.username}`}>
                    <div className="media mx-2 my-2 px-2 border rounded" > 
                    <a href={`/profile/${like.username}`}><img src={`/img/${like.pic}`} className="mr-3 img-thumbnail profile-pic"  /></a>
                        <div className="media-body w-100 mt-2">
                        <a href={`/profile/${like.username}`}>
                            <h5 className="mt-0">{like.nickname}</h5>
                            <h5 className="mt-0 text-muted">@{like.username}</h5>
                        </a>
                        </div>
                    </div>
                    </a>
                ))
                }                  
                
            
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>                        
            </div>
            </div>
        </div>
        </div>
        
        <div className="modal" id="deleteConfirm" tabIndex="-1" role="dialog" aria-labelledby="deleteConfirmLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
            <div className="modal-content">
            <div className="modal-header">
                <div className="modal-title" id="deleteConfirmLabel">
                <h5>Do you want to delete this {postToDelete?"post":"comment"}?</h5>
                <small className="text-muted">This cannot be undone!</small>
                </div>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-light" data-dismiss="modal" onClick={()=>handleDelete()}>Delete</button>
                {
                    postToDelete?
                    <button type="button" className="btn btn-light" data-dismiss="modal" onClick={()=>setPostToDelete(null)}>Cancel</button>
                    :
                    <button type="button" className="btn btn-light" data-dismiss="modal" onClick={()=>setcommentToDelete(null)}>Cancel</button>
                }
                
                
            </div>
            </div>
        </div>
        </div>    

        
        </div>
        }
        </>
        
    )
}

export default Posts
