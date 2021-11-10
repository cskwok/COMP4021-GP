import React, { createContext, useState,useContext } from 'react';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import  { useHistory } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalState';

export const PostsContext = createContext();

export const PostsProvider = ({ children })=> {
    const [posts, setPosts] = useState([]);  
    const [likedBy, setLikedBy] = useState([]);
    const [postLoading, setPostLoading] = useState(true);
    const [likeListloading, setLikeListLoading] = useState(true);
    const [postToDelete, setPostToDelete] = useState(null);   
    const [commentToDelete, setcommentToDelete] = useState(null);
    const {checkToken} = useContext(GlobalContext);
    

    /** post */
    //done
    async function getPosts(username){  
        await checkToken();
        const res = await axios.get("/api/posts/" + username);   
        if(res.data.success){
            let tempPosts = res.data.posts;
            for (let index = 0; index < tempPosts.length; index++) {            
                const resC = await axios.get(`/api/comments/${tempPosts[index].postid}`);        
                if(resC.data.success){
                    tempPosts[index].comments = resC.data.comments;
                } 
            }
            if(localStorage.getItem("jwt")){
                const token = "bearer " + JSON.parse(localStorage.getItem("jwt")).token;
                const conf = {
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": token
                    }
                };
                for (let index = 0; index < tempPosts.length; index++) {            
                    const res2 = await axios.get(`/api/posts/${tempPosts[index].postid}/hasLike`,conf);        
                    if(res2.data.success){
                        tempPosts[index].hasLike = res2.data.hasLike;
                    }
                    for (let j = 0; j < tempPosts[index].comments.length; j++) {
                        const resC2 = await axios.get(`/api/comments/${tempPosts[index].comments[j].commentid}/hasLike`,conf);        
                        if(resC2.data.success){
                            tempPosts[index].comments[j].hasLike = resC2.data.hasLike;
                        }
                        
                    }
                    
                }
            }        
            setPosts(tempPosts);
            setPostLoading(false);
        }
    }
    async function getFeed(){  
        await checkToken();
        const token = "bearer " + JSON.parse(localStorage.getItem("jwt")).token;
                const conf = {
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": token
                    }
                };
        const res = await axios.get("/api/feed",conf);  
        if(res.data.success){            
            let tempPosts = res.data.posts;
            
            for (let index = 0; index < tempPosts.length; index++) {            
                const resC = await axios.get(`/api/comments/${tempPosts[index].postid}`);        
                if(resC.data.success){
                    tempPosts[index].comments = resC.data.comments;
                } 
            }
            if(localStorage.getItem("jwt")){
                const token = "bearer " + JSON.parse(localStorage.getItem("jwt")).token;
                const conf = {
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": token
                    }
                };
                for (let index = 0; index < tempPosts.length; index++) {            
                    const res2 = await axios.get(`/api/posts/${tempPosts[index].postid}/hasLike`,conf);        
                    if(res2.data.success){
                        tempPosts[index].hasLike = res2.data.hasLike;
                    }
                    for (let j = 0; j < tempPosts[index].comments.length; j++) {
                        const resC2 = await axios.get(`/api/comments/${tempPosts[index].comments[j].commentid}/hasLike`,conf);        
                        if(resC2.data.success){
                            tempPosts[index].comments[j].hasLike = resC2.data.hasLike;
                        }
                        
                    }
                    
                }
            }        
            setPosts(tempPosts);
            setPostLoading(false);
        }
    }

    async function addPost(content,postPic) {
        await checkToken();
        const token = "bearer " + JSON.parse(localStorage.getItem("jwt")).token;
        const conf = {
            headers: {
                "Content-Type": "application/json",
                "authorization": token
            }
        };
        const res = await axios.post("/api/posts",
            JSON.stringify({
                content: content,
                postPic:postPic
            }),
            conf
        );
        if(res.data.success){
            setPosts(prev=>[res.data.post,...prev]);
        }
    }

    async function deletePost(postid) {
        await checkToken();
        const token = "bearer " + JSON.parse(localStorage.getItem("jwt")).token;
        const conf = {
            headers: {
                "Content-Type": "application/json",
                "authorization": token
            }
        };
        const res = await axios.delete(`/api/posts/delete/${postid}`,conf);
        if(res.data.success){
            setPosts(posts.filter(post=>post.postid!==postid));
            setPostToDelete(null);
        }
    }

    async function editPost(postid,content) {
        await checkToken();
        const token = "bearer " + JSON.parse(localStorage.getItem("jwt")).token;
        const conf = {
            headers: {
                "Content-Type": "application/json",
                "authorization": token
            }
        };
        const res = await axios.put(`/api/posts/edit/${postid}`,
            JSON.stringify({
                content: content
            })
        ,conf);
        if(res.data.success){
            let tempPosts = [...posts];
            let index = tempPosts.findIndex(i => i.postid === postid);
            tempPosts[index].content = res.data.post.content;
            tempPosts[index].editTime = res.data.post.editTime;
            setPosts(tempPosts);            
        }
    }

    async function handlePostLike(postid){
        if(!localStorage.getItem("jwt"))return;
        await checkToken();
        const token = "bearer " + JSON.parse(localStorage.getItem("jwt")).token;
        const conf = {
            headers: {
                "Content-Type": "application/json",
                "authorization": token
            }
        };
        const res = await axios.get(`/api/posts/${postid}/like`,conf);
        if(res.data.success){            
            let tempPosts = [...posts];
            let index = tempPosts.findIndex(i => i.postid === postid);
            if(tempPosts[index].hasLike){
                tempPosts[index].numOfLikes -= 1;
                tempPosts[index].hasLike = !tempPosts[index].hasLike;
            }else{
                tempPosts[index].numOfLikes += 1;
                tempPosts[index].hasLike = !tempPosts[index].hasLike;
            }
            
            
            setPosts(tempPosts);
        }
    }
    
    //get post liked by
    async function getPostLikedBy(postid){
        await checkToken();
        const token = "bearer " + JSON.parse(localStorage.getItem("jwt")).token;
        const conf = {
            headers: {
                "Content-Type": "application/json",
                "authorization": token
            }
        }; 
        const res = await axios.get(`/api/posts/like/${postid}`,conf);
        if(res.data.success){  
            setLikedBy(res.data.likedBy); 
            setLikeListLoading(false);
        }
    }

    

    //comment 

    
    
    async function addComment(postid,comment){
        await checkToken();
        const token = "bearer " + JSON.parse(localStorage.getItem("jwt")).token;
        const conf = {
            headers: {
                "Content-Type": "application/json",
                "authorization": token
            }
        };   
        const res = await axios.post(`/api/comments/${postid}`,
        JSON.stringify({
            comment: comment            
        }),
        conf
        );
        if(res.data.success){
            let tempPosts = [...posts];
            let index = tempPosts.findIndex(i => i.postid === postid);
            tempPosts[index].comments.push(res.data.comment);
            setPosts(tempPosts);
        }
    }

    async function deleteComment(postid,commentid) {
        await checkToken();
        const token = "bearer " + JSON.parse(localStorage.getItem("jwt")).token;
        const conf = {
            headers: {
                "Content-Type": "application/json",
                "authorization": token
            }
        };
        const res = await axios.delete(`/api/comments/delete/${commentid}`,conf);
        if(res.data.success){
            let tempPosts = [...posts];
            let index = tempPosts.findIndex(i => i.postid === postid);
            tempPosts[index].comments=tempPosts[index].comments.filter(comment=>comment.commentid!==commentid);
            setPosts(tempPosts);
            setcommentToDelete(null);
        }
    }
    async function handleCommentLike(postid,commentid){
        if(!localStorage.getItem("jwt"))return;        
        await checkToken();
        const token = "bearer " + JSON.parse(localStorage.getItem("jwt")).token;
        const conf = {
            headers: {
                "Content-Type": "application/json",
                "authorization": token
            }
        };
        const res = await axios.get(`/api/comments/${postid}/${commentid}/like`,conf);
        if(res.data.success){            
            let tempPosts = [...posts];
            let index = tempPosts.findIndex(i => i.postid === postid);
            let j = tempPosts[index].comments.findIndex(i => i.commentid === commentid);
            if(tempPosts[index].comments[j].hasLike){
                tempPosts[index].comments[j].numOfLikes -= 1;
                tempPosts[index].comments[j].hasLike = !tempPosts[index].comments[j].hasLike;
            }else{
                tempPosts[index].comments[j].numOfLikes += 1;
                tempPosts[index].comments[j].hasLike = !tempPosts[index].comments[j].hasLike;
            }
            setPosts(tempPosts);
        }
    }
   

    //get comment liked by
    async function getCommentLikedBy(commentid){
  
        await checkToken();
        const token = "bearer " + JSON.parse(localStorage.getItem("jwt")).token;
        const conf = {
            headers: {
                "Content-Type": "application/json",
                "authorization": token
            }
        };   
        const res = await axios.get(`/api/comments/like/${commentid}`,conf);
        if(res.data.success){
            setLikedBy(res.data.likedBy); 
            setLikeListLoading(false);
        }
    }
    
    return (<PostsContext.Provider value={{     
        posts,   
        getPosts,
        getFeed,
        addPost,
        editPost,
        deletePost,
        handlePostLike,
        getPostLikedBy,
        likedBy,
        addComment,
        deleteComment,
        handleCommentLike,
        getCommentLikedBy,
        postLoading,
        likeListloading,
        postToDelete,
        setPostToDelete,
        commentToDelete,
        setcommentToDelete        
    }}>
        {children}
    </PostsContext.Provider>);
}