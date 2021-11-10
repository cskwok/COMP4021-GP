import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import  { useHistory } from 'react-router-dom';
import { GlobalContext } from './GlobalState';

export const ProfileContext = createContext();

export const ProfileProvider = ({ children })=> {
    let history = useHistory();
    const [profile, setProfile] = useState({});
    const [friends, setFriends] = useState([]);
    const [friendRequests, setFriendRequests] = useState({});
    const [profileLoading, setProfileLoading] = useState(true);
    const [friendsLoading, setFriendsLoading] = useState(true);
    const [friendRequestsLoading, setFriendRequestsLoading] = useState(true);
    const [msg, setMsg] = useState("");
    const [error, setError] = useState("");
    const [permission, setPermission] = useState(false); 
    const [permissionLoading, setPermissionLoading] = useState(true);

    const {checkToken,info,setInfo} = useContext(GlobalContext); 

    async function getProfile(username){  
        await checkToken();
        const res = await axios.get("/api/users/" + username);  
        if(res.data.success){            
            let pro = {                
                username: res.data.rows[0].username,
                //email: res.data.rows[0].email,
                nickname: res.data.rows[0].nickname,
                //gender: res.data.rows[0].gender,
                //birthday: res.data.rows[0].birthday,
                bio: res.data.rows[0].bio,
                numOfFriends: res.data.rows[0].numOfFriends,
                publicity: res.data.rows[0].publicity,
                pic:res.data.rows[0].pic
            } 
            if(localStorage.getItem("jwt")){
                if(JSON.parse(localStorage.getItem("jwt")).username !== username){
                    const token = "bearer " + JSON.parse(localStorage.getItem("jwt")).token;
                    const conf = {
                        headers: {
                            "Content-Type": "application/json",
                            "authorization": token
                        }
                    };
                    const res2 = await axios.get(`/api/friends/${username}/isFriend`,conf);   
                    const res3 = await axios.get(`/api/friends/${username}/isSentRequest`,conf);  
                    const res4 = await axios.get(`/api/friends/${username}/isReceivedRequest`,conf); 
                    pro.isFriend = res2.data.isFriend;
                    pro.isSent = res3.data.isSent;
                    pro.isReceived = res4.data.isReceived;
                }else{
                    pro.isFriend = false
                    pro.isRequest = false;
                }
            }
            if((localStorage.getItem("jwt")&&JSON.parse(localStorage.getItem("jwt")).username === username)||pro.publicity==="public"){
                setPermission(true);
              
            }else            
            if(localStorage.getItem("jwt")){
                const token = "bearer " + JSON.parse(localStorage.getItem("jwt")).token;
                const conf = {
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": token
                    }                        
                };
                const res2 = await axios.get(`/api/friends/${username}/isFriend`,conf );
                if(res2.data.success){
                    setPermission(res2.data.isFriend);  
                }   
            }
            setProfile(pro);  
            setProfileLoading(false);
            setPermissionLoading(false);  
            
        } 
        
    }
    
    async function getFriends(username){
        await checkToken();
        const res = await axios.get(`/api/friends/${username}`);   
           
        if(res.data.success){
            let tempFriends=res.data.friends;
            if(localStorage.getItem("jwt")){
                const token = "bearer " + JSON.parse(localStorage.getItem("jwt")).token;
                const conf = {
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": token
                    }
                };   
                for (let index = 0; index < tempFriends.length; index++) {
                    const res2 = await axios.get(`/api/friends/${tempFriends[index].username}/isFriend`,conf);   
                    const res3 = await axios.get(`/api/friends/${tempFriends[index].username}/isSentRequest`,conf);  
                    const res4 = await axios.get(`/api/friends/${tempFriends[index].username}/isReceivedRequest`,conf);  
                    if(res2.data.success && res3.data.success) {
                        tempFriends[index].isFriend = res2.data.isFriend;
                        tempFriends[index].isSent = res3.data.isSent;
                        tempFriends[index].isReceived = res4.data.isReceived;
                    }
                }
            }

            setFriends(tempFriends);
            setFriendsLoading(false);
        }
        
    }



    async function getFriendRequests(username){
        await checkToken();
        const token = "bearer " + JSON.parse(localStorage.getItem("jwt")).token;
        const conf = {
            headers: {
                "Content-Type": "application/json",
                "authorization": token
            }
        };   
        let requests = {received:[],sent:[]};
        const res = await axios.get(`/api/friends/request/received/${username}`,conf);
        if(res.data.success){
            const res2 = await axios.get(`/api/friends/request/sent/${username}`,conf);
            if(res2.data.success){
                requests.received = res.data.receivedReq;
                requests.sent = res2.data.sentReq;
                setFriendRequests(requests);
                setFriendRequestsLoading(false);
            }
            
        }
        
        

    }

    async function acceptRequest(username){    
        await checkToken();
        const token = "bearer " + JSON.parse(localStorage.getItem("jwt")).token;
        const conf = {
            headers: {
                "Content-Type": "application/json",
                "authorization": token
            }
        };   
        const res = await axios.get(`/api/friends/request/${username}`,conf);
        
        if(res.data.success){
            let tempFriends = [...friends];
            if(profile.username===JSON.parse(localStorage.getItem("jwt")).username){
                let tempReq = {...friendRequests};
                tempReq.received = tempReq.received.filter(rec=>rec.username!==username);
                setFriendRequests(tempReq);

                
                tempFriends.push(res.data.friend);
                setFriends(tempFriends);
                
                let tempPro = {...profile};
                tempPro.numOfFriends += 1;
                setProfile(tempPro);

            }else if(tempFriends.find(friend=>friend.username===username)){
                let tempFriends = [...friends];
                let index = tempFriends.findIndex(friend=>friend.username===username);
                tempFriends[index].isFriend = true;
                setFriends(tempFriends);
            }else{
                let tempPro = {...profile};
                tempPro.isFriend = true;
                setProfile(tempPro);
            }
        }
    }

    async function cancelRequest(username){        
        await checkToken();
        const token = "bearer " + JSON.parse(localStorage.getItem("jwt")).token;
        const conf = {
            headers: {
                "Content-Type": "application/json",
                "authorization": token
            }
        };   
        const res = await axios.delete(`/api/friends/request/${username}`,conf);
        
        if(res.data.success){      
            let tempFriends = [...friends];     
            if(profile.username===JSON.parse(localStorage.getItem("jwt")).username){
                let tempReq = {...friendRequests};            
                if(tempReq.received.find(rec=>rec.username===username)){
                    tempReq.received = tempReq.received.filter(rec=>rec.username!==username);
                }else if(tempReq.sent.find(rec=>rec.username===username)){
                    tempReq.sent = tempReq.sent.filter(rec=>rec.username!==username);
                }
                
                setFriendRequests(tempReq);
            }else if(tempFriends.find(friend=>friend.username===username)){
                let index = tempFriends.findIndex(friend=>friend.username===username);
                tempFriends[index].isReceived = false;
                tempFriends[index].isSent = false;
                setFriends(tempFriends);
            }else{
                let tempPro = {...profile};
                tempPro.isReceived = false;
                tempPro.isSent = false;
                setProfile(tempPro);
            }
            
        }
    }

    async function unFriend(username){        
        await checkToken();
        const token = "bearer " + JSON.parse(localStorage.getItem("jwt")).token;
        const conf = {
            headers: {
                "Content-Type": "application/json",
                "authorization": token
            }
        };   
        const res = await axios.delete(`/api/friends/${username}`,conf);
        
        if(res.data.success){      
            let tempFriends = [...friends];
            if(profile.username===JSON.parse(localStorage.getItem("jwt")).username){
                let tempFriends = [...friends];
                tempFriends = tempFriends.filter(friend=>friend.username!==username);
                setFriends(tempFriends);
                let tempPro = {...profile};
                tempPro.numOfFriends -= 1;
                setProfile(tempPro);
            }else if(tempFriends.find(friend=>friend.username===username)){    
                let index = tempFriends.findIndex(friend=>friend.username===username);
                tempFriends[index].isFriend = false;
                setFriends(tempFriends);
            }else{
                let tempPro = {...profile};
                tempPro.isFriend = false;
                setProfile(tempPro);
            }
            
        }
    }

    async function sentRequest(username){        
        await checkToken();
        const token = "bearer " + JSON.parse(localStorage.getItem("jwt")).token;
        const conf = {
            headers: {
                "Content-Type": "application/json",
                "authorization": token
            }
        };   
        const res = await axios.get(`/api/friends/request/send/${username}`,conf);
        
        if(res.data.success){
            let tempFriends = [...friends];
            if(tempFriends.find(friend=>friend.username===username)){
                let index = tempFriends.findIndex(friend=>friend.username===username);
                tempFriends[index].isSent = true;
                setFriends(tempFriends);
            }else{
                let tempPro = {...profile};
                tempPro.isSent = true;
                setProfile(tempPro);
            }
            
        }
    }

    async function editPassword(newContent) {
        await checkToken();
        const token = "bearer " + JSON.parse(localStorage.getItem("jwt")).token;
        const conf = {
            headers: {
                "Content-Type": "application/json",
                "authorization": token
            }
        };
        const res = await axios.put(`/api/users/edit/password`,
            JSON.stringify({
                password: newContent.password,
                newPassword: newContent.newPassword
            }),
            conf
        );
        if(res.data.success){
            setMsg(res.data.msg);
        }else{
            setError(res.data.msg);
        }
    }

    async function editNickname(newContent) {
        await checkToken();
        const token = "bearer " + JSON.parse(localStorage.getItem("jwt")).token;
        const conf = {
            headers: {
                "Content-Type": "application/json",
                "authorization": token
            }
        };
        const res = await axios.put(`/api/users/edit/nickname`,
            JSON.stringify({
                nickname: newContent
            }),
            conf
        );
        if(res.data.success){
            setMsg(res.data.msg);
            let tempPro = {...profile};
            tempPro.nickname = newContent;
            setProfile(tempPro);
            let tempInfo = {...info};
            tempInfo.nickname = newContent;
            setInfo(tempPro);
        }else{
            setError(res.data.msg);
        }
    }
    async function editBio(newContent) {
        await checkToken();
        const token = "bearer " + JSON.parse(localStorage.getItem("jwt")).token;
        const conf = {
            headers: {
                "Content-Type": "application/json",
                "authorization": token
            }
        };
        const res = await axios.put(`/api/users/edit/bio`,
            JSON.stringify({
                bio: newContent
            }),
            conf
        );
        if(res.data.success){
            setMsg(res.data.msg);
            let tempPro = {...profile};
            tempPro.bio = newContent;
            setProfile(tempPro);
        }else{
            setError(res.data.msg);
        }
    }

    async function editPublicity(newContent) {
        await checkToken();
        const token = "bearer " + JSON.parse(localStorage.getItem("jwt")).token;
        const conf = {
            headers: {
                "Content-Type": "application/json",
                "authorization": token
            }
        };
        const res = await axios.put(`/api/users/edit/publicity`,
            JSON.stringify({
                publicity: newContent
            }),
            conf
        );
        if(res.data.success){
            setMsg(res.data.msg);
            let tempPro = {...profile};
            tempPro.publicity = newContent;
            setProfile(tempPro);
        }else{
            setError(res.data.msg);
        }
    }

    async function editPic(newContent) {
        await checkToken();
        const token = "bearer " + JSON.parse(localStorage.getItem("jwt")).token;
        const conf = {
            headers: {
                "Content-Type": "application/json",
                "authorization": token
            }
        };
        const res = await axios.put(`/api/users/edit/pic`,
            JSON.stringify({
                pic: newContent
            }),
            conf
        );
        console.log(res)
        if(res.data.success){
            setMsg(res.data.msg);
            let tempPro = {...profile};
            tempPro.pic = newContent;
            setProfile(tempPro);
            let tempInfo = {...info};
            tempInfo.pic = newContent;
            setInfo(tempPro);
        }else{
            setError(res.data.msg);
        }
    }

    async function getPermission(username) {
        await checkToken();    
        if(localStorage.getItem("jwt")&&JSON.parse(localStorage.getItem("jwt")).username === username){
            setPermission(true);
            return setPermissionLoading(false);
        }   
        if(profile.publicity){
            setPermission(true);
            return setPermissionLoading(false);
        }
                
        if(localStorage.getItem("jwt")){
            const token = "bearer " + JSON.parse(localStorage.getItem("jwt")).token;
            const conf = {
                headers: {
                    "Content-Type": "application/json",
                    "authorization": token
                }                        
            };
            const res2 = await axios.get(`/api/friends/${username}/isFriend`,conf );
            if(res2.data.success){
                setPermission(res2.data.isFriend);  
                return setPermissionLoading(false);  
            }   
        }
    }





    return (<ProfileContext.Provider value={{        
        profile,
        friends,
        profileLoading,
        friendsLoading,
        getProfile,
        getFriends,
        getFriendRequests,
        friendRequests,
        friendRequestsLoading,
        acceptRequest,
        cancelRequest,
        unFriend,
        sentRequest,
        editPassword,
        editNickname,
        editBio,
        editPublicity,
        editPic,
        msg,
        setMsg, 
        error, 
        setError,
        getPermission,
        permission,
        permissionLoading
    }}>
        {children}
    </ProfileContext.Provider>);
}