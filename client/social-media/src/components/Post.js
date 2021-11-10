import React, { useState, useContext, useEffect } from 'react';
import { PostsContext } from '../context/PostsState';
import { GlobalContext } from '../context/GlobalState';
import Comments from './Comments'

const Post = ({post})=> {
    const [ comment, setComment ] = useState("");
    const {handlePostLike,getPostLikedBy,addComment,setPostToDelete,editPost} = useContext(PostsContext);
    const {info,infoLoading} = useContext(GlobalContext); 
   
    const [editMode, setEditMode] = useState(false);
    const [editContent, setEditContent] = useState("");
    
    const handleComment = async (e)=>{
        e.preventDefault();
        if(!comment || comment.trim().length === 0) {
            setComment("");
        }else{
            await addComment(post.postid,comment);
            setComment("");
        }
    }
   
    useEffect(()=>{
        setEditContent(post.content);
    },[post.content])

    

    const handleEdit = async (e) => {
        e.preventDefault();
        if(!editContent || editContent.trim().length === 0) {
            setEditContent("");
        }else{
            await editPost(post.postid,editContent);
            setEditContent("");
            setEditMode(!editMode);
        }
    }
    
    return (
        <>
        <div className="Post media py-3 my-2 px-2 border rounded" >         
        <a href={`/profile/${post.username}`}><img src={`/img/${post.pic}`} className="mr-2 img-thumbnail profile-pic"  /></a>
            <div className="media-body w-100">
                <div className="d-flex">
                    <div>                    
                    <a href={`/profile/${post.username}`}><h5 className="mt-0">{post.nickname}</h5> </a>
                    {post.editTime?
                        <small className="text-muted">Last Edited at: {post.editTime}</small>
                        :
                        <small className="text-muted">Posted at: {post.postTime}</small> 
                    }            
                    {   !localStorage.getItem("jwt")?null:
                        !editMode?<h5 style={{"whiteSpace": "pre-line"}}>{post.content}</h5>:
                        <div>
                            <form className="w-100" onSubmit={(e) => {handleEdit(e)}}>
                                <textarea className="form-control mb-2 " value={editContent} onChange={(e) => setEditContent(e.target.value)}  />
                                <button className="btn btn-light mb-2 " type="submit">Edit</button>
                                <button className="btn btn-light mb-2 ml-2 " onClick={()=>{setEditContent(post.content);setEditMode(!editMode)}}>Cancel</button>
                            </form>
                        </div>
                        
                    }
                    {
                        !post.postPic?null:
                        <img src={`/img/${post.postPic}`} className=" img-thumbnail post-pic"  />
                        }
                    </div>
                    {   !localStorage.getItem("jwt")?null:
                        post.username===JSON.parse(localStorage.getItem("jwt")).username?
                        <div className="ml-auto">
                            <div className="material-icons icon-btn" onClick={()=>{setEditMode(!editMode)}}>edit</div>
                            <div className="material-icons icon-btn" data-toggle="modal" data-target="#deleteConfirm" onClick={()=>setPostToDelete(post.postid)}>delete</div>                    
                        </div>:null
                    }
                    
                </div>
                
                <hr/>
              
                    <div>
                    <span className="icon-btn" onClick={()=>{handlePostLike(post.postid)}}>
                        {post.hasLike?
                        <span className="material-icons align-middle like-after">favorite</span>:
                        <span className="material-icons align-middle">favorite_border</span>}                    
                    </span>
                    {post.numOfLikes>0?<span data-toggle="modal" data-target="#likedByList" className="align-middle ml-1 icon-btn icon-color" onClick={()=>getPostLikedBy(post.postid)}>{post.numOfLikes}</span>
                                      
                   :null}
                    </div> 
                <hr/> 
                            
                
                {<Comments post={post}/>}
                {(localStorage.getItem("jwt"))?
                    <div className="media">
                    {
                        infoLoading?null:
                        <img src={`/img/${info.pic}`} className="mr-3 img-thumbnail profile-pic"  />
                    }
                    
                   
                    <form className="media-body w-100" onSubmit={(e)=>{handleComment(e)}}>
                    <textarea className="form-control mb-2" value={comment} onChange={(e)=>setComment(e.target.value)} placeholder="Leave some comments..."/>
                    <button className="btn btn-light mb-2" type="submit">Comment</button>
                    </form>
                    </div>                
                    :null
                }
            </div>            
        </div>
        
            
          
     </>         
    );
}

export default Post;
