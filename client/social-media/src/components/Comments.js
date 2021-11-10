import React, {  useContext } from 'react';
import Comment from './Comment'

const Comments = ({post}) => {   
  
  
    return (
        <div>
            {
            post.comments.map((comment,i)=>(
                <Comment key={i} comment={comment} postUsername={post.username}/>
            ))
            }
                
        </div>
    )
}

export default Comments
