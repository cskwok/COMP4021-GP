import React, { useState, useContext, useEffect} from 'react';
import { PostsContext } from '../context/PostsState';
import { ProfileContext } from '../context/ProfileState'
import { GlobalContext } from '../context/GlobalState'
import Loading from './Loading';
import Posts from './Posts';
import { useParams  } from 'react-router-dom';
import axios from 'axios';

const ProfilePosts = () => {
    const [pic, setPic] = useState("");
    const [selected, setSelected] = useState("");
    const [content, setContent] = useState("");
    const {getPosts,addPost} = useContext(PostsContext);
    const {permission ,permissionLoading,profileLoading,getPermission, profile} = useContext(ProfileContext);
    const {info,infoLoading} = useContext(GlobalContext); 
    let { username } = useParams();
 
   
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
        if(permission)
            getPosts(username);        
    },[permission]); 
    

    return (
        <>
            { profileLoading?null:(localStorage.getItem("jwt") && (JSON.parse(localStorage.getItem("jwt")).username === username)) ?
                <div className="media my-4 py-3 ml-3 mr-2">
                   {infoLoading?null:
                      <img src={`/img/${info.pic}`} className="mr-3 img-thumbnail profile-pic"  /> 
                   }
                    
                    
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
                        <button className="btn btn-light mb-2 " type="submit">Post</button>
                    </form>
                </div>:null
               
            }

            {          
                profileLoading?<Loading />:  
                (permission) ?
                    <Posts />
                    : 
                    <div className="d-flex mt-2 justify-content-center">
                        <h5>This account is private</h5>
                    </div>
            }
           
            
        
        </>
        

    );

}

export default ProfilePosts;
