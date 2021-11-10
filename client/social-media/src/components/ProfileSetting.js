import React, { useState, useContext, useEffect } from 'react';
import  { useHistory,useParams } from 'react-router-dom';
import { ProfileContext } from '../context/ProfileState'
import Loading from './Loading';
import Denied from './Denied';
import axios from 'axios';

const ProfileSetting = () => {
    const { msg, setMsg,error,setError, editPassword,editNickname,editBio,editPublicity,editPic, profile,profileLoading} = useContext(ProfileContext);
    let { username }= useParams();
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [bio, setBio] = useState("");
    const [nickname, setNickname] = useState("");
    const [publicity, setPublicity] = useState("");
    const [currentEdit, setCurrentEdit] = useState("");
    const [pic, setPic] = useState("");
    const [selected, setSelected] = useState("");


    
    const handleChangePassword = async (e)=>{
        setCurrentEdit("password");
        setMsg("");
        setError("");
        e.preventDefault();
        if((!password || password.trim().length === 0)  && (!newPassword || newPassword.trim().length === 0)){
            setError("Please enter the field");
        }else{
            if(password===newPassword){
                setError("Please enter a new password");
            }else{                
                await editPassword({password:password, newPassword:newPassword});
            }
        }
        setPassword("");
        setNewPassword("");
    }

    const handleChangeNickname = async (e)=>{
        setCurrentEdit("nickname");
        setMsg("");
        setError("");
        e.preventDefault();
        if((!nickname || nickname.trim().length === 0)){
            setError("Please enter the field");            
        }else{
            await editNickname(nickname);
        }
        
    }

    const handleChangeBio = async (e)=>{
        setCurrentEdit("bio");
        setMsg("");
        setError("");
        e.preventDefault();
        if((!bio || bio.trim().length === 0)){
            setError("Please enter the field");            
        }else{
            await editBio(bio);
        }
    }

    const handleChangePublicity = async (e)=>{
        setCurrentEdit("publicity");
        setMsg("");
        setError("");
        e.preventDefault();
        if((!publicity || publicity.trim().length === 0)){
            setError("Please choose an option");            
        }else{
            await editPublicity(publicity);
        }
    }

    const handleChangePic = async (e)=>{
        setCurrentEdit("pic");
        setMsg("");
        setError("");
        e.preventDefault();
        if((!pic || pic.trim().length === 0)){
            setError("Please choose a photo");            
        }else{
            await editPic(pic);
            setPic("");
            setSelected("");
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
   

    return (
        <>
            {
                !localStorage.getItem("jwt")?<Denied />:
                JSON.parse(localStorage.getItem("jwt")).username!==username?<Denied />:
                profileLoading?<Loading />:
                <div>
                    <h3  className="mx-2 my-4 px-2 py-3">Account Setting</h3>
                    <form className="mx-3 px-2 py-2 border rounded" onSubmit={(e)=>{handleChangePassword(e)}}>
                    {
                    currentEdit==="password"?
                    <>
                    {error?<div className="alert alert-danger" role="alert">{error}</div>:null}
                    {msg?<div className="alert alert-success" role="alert">{msg}</div>:null}
                    </>
                    :null
                    }
                        <h4  className="my-2">Change Password</h4>
                        <h5>Old password:</h5>
                        <input className="form-control my-2" type="password" value={password} onChange={(e)=>{setPassword(e.target.value)}}  />
                        <h5>New password:</h5>
                        <input className="form-control my-2" type="password" value={newPassword} onChange={(e)=>{setNewPassword(e.target.value)}}  />
                        <button className="btn btn-light my-2"  type="submit">Change Password</button>
                    </form>
                    <form className="mx-3 my-4 px-2 py-3 border rounded" onSubmit={(e)=>{handleChangePic(e)}}>
                    {
                    currentEdit==="pic"?
                    <>
                    {error?<div className="alert alert-danger" role="alert">{error}</div>:null}
                    {msg?<div className="alert alert-success" role="alert">{msg}</div>:null}
                    </>
                    :null
                    }
                        <h4  className="my-2">Choose your pic</h4>
                        {pic?
                        <div className="preview">
                        <img src={`/img/${pic}`} className="mr-3 img-thumbnail profile-pic"  />
                        </div>:null
                        }
                        <div>
                        <div className="custom-file my-2">
                            <input type="file" className="custom-file-input" id="customFile" accept=".jpg,.png,.svg,.gif" onChange={(e)=>{handleUpload(e)}}/>
                            <label className="custom-file-label" htmlFor="customFile"><span className="material-icons align-middle"> add_photo_alternate</span> {selected.name}</label>
                        </div>
                        
                        <button className="btn btn-light my-2 "  type="submit">Change Profile Pic</button>
                        </div>
                        
                    </form>
                    <form className="mx-3 my-4 px-2 py-3 border rounded" onSubmit={(e)=>{handleChangeBio(e)}}>
                    {
                    currentEdit==="bio"?
                    <>
                    {error?<div className="alert alert-danger" role="alert">{error}</div>:null}
                    {msg?<div className="alert alert-success" role="alert">{msg}</div>:null}
                    </>
                    :null
                    }
                        <h4  className="my-2">Edit Bio</h4>                        
                        <textarea className="form-control mb-2 " defaultValue={profile.bio} onChange={(e)=>setBio(e.target.value)}  />
                        <button className="btn btn-light my-2"  type="submit">Edit</button>
                    </form>
                    <form className="mx-3 my-4 px-2 py-3 border rounded" onSubmit={(e)=>{handleChangeNickname(e)}}>
                    {
                    currentEdit==="nickname"?
                    <>
                    {error?<div className="alert alert-danger" role="alert">{error}</div>:null}
                    {msg?<div className="alert alert-success" role="alert">{msg}</div>:null}
                    </>
                    :null
                    }
                        <h4  className="my-2">Change your Name</h4>                        
                        <input className="form-control my-2" defaultValue={profile.nickname} onChange={(e)=>setNickname(e.target.value)} type="text"  />
                        
                        <button className="btn btn-light my-2"  type="submit">Change Name</button>
                    </form>
                    <form className="mx-3 my-4 px-2 py-3 border rounded" onSubmit={(e)=>{handleChangePublicity(e)}}>
                    {
                    currentEdit==="publicity"?
                    <>
                    {error?<div className="alert alert-danger" role="alert">{error}</div>:null}
                    {msg?<div className="alert alert-success" role="alert">{msg}</div>:null}
                    </>
                    :null
                    }
                        <h4  className="my-2">Change Publicity</h4>
                        <select className="form-control my-2" id="publicity" defaultValue={profile.publicity} onChange={(e)=>{setPublicity(e.target[e.target.selectedIndex].value)}}  >
                            <option value="public" >Public</option>
                            <option value="private">Private</option>    
                        </select>
                        <button className="btn btn-light my-2"  type="submit">Change Publicity</button>
                    </form>
                    
                </div>
            }
        </>
    )
}

export default ProfileSetting
