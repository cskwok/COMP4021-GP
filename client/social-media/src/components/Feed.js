import React, { useContext, useEffect, useState } from 'react';
import  { useHistory } from 'react-router-dom'
import { PostsContext } from '../context/PostsState';
import { GlobalContext } from '../context/GlobalState';
import axios from 'axios';
import Loading from './Loading';
import Posts from './Posts';

const Feed = () => {
    const [content, setContent] = useState("");
    const [pic, setPic] = useState("");
    const [selected, setSelected] = useState("");
    const { addPost,postLoading,getFeed } = useContext(PostsContext);
    const {info,infoLoading} = useContext(GlobalContext); 
    let history = useHistory();

    const handlePost = async (e) => {
        e.preventDefault();

        if((content&&content.trim().length > 0)||(pic || pic.trim().length > 0)){
            await addPost(content,pic);
            setContent("");
            setPic("");
            setSelected("");
        }else{
            setContent("");
        }
    }
    const handleUpload = async (e) => {
        if(!e.target.files[0]) return;
        setSelected(e.target.files[0]);
        var formData = new FormData();
        formData.append("image", e.target.files[0]);
        const conf = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        };
        const res = await axios.post(`/upload/image`,formData,conf);
        if(res.data.success){
            setPic(res.data.image);
        }
    }
    useEffect(()=>{
        getFeed();
    },[]); 
  
    return (
        <div>
            <>
            {infoLoading?null:
            <div className="media mt-2 ml-3 mr-2">
                <a href={`/profile/${info.username}`}>
                    <img src={`/img/${info.pic}`} className="mr-3 img-thumbnail profile-pic"  />
                </a>
                <form className=" media-body w-100" onSubmit={(e) => { handlePost(e) }}>
                    <textarea className="form-control mb-2 " value={content} onChange={(e) => setContent(e.target.value)} placeholder={`Hello ${JSON.parse(localStorage.getItem("jwt")).nickname}, how are you today?`} />
                  
                    {pic?
                    <div className="preview">
                    <img src={`/img/${pic}`} className="mr-3 img-thumbnail profile-pic"  />
                    </div>:null
                    } 
                    <div className="custom-file my-2">
                        <input type="file" className="custom-file-input" id="customFile" accept=".jpg,.png,.svg,.gif" onChange={(e)=>{handleUpload(e)}}/>
                        <label className="custom-file-label" htmlFor="customFile"><span className="material-icons align-middle"> add_photo_alternate</span> {selected.name}</label>
                    </div>     
                    
                    <button className="btn btn-light mb-2" type="submit">Post</button>              
                    
                    
                    
                    
                    
                </form>
            </div>
            }
            <Posts />
        </>
        </div>
    )
}

export default Feed;
