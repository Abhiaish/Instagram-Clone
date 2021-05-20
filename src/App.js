import React, { useEffect, useState } from 'react'
import './App.css';
import Post from './Post';
import {db , auth} from './firebase';
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal'
import { Button, Input } from '@material-ui/core';
import ImgUpload from './ImgUpload';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50 
  const left = 50 

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles()
  const [modalStyle] = useState(getModalStyle);
  const [posts,setPosts]=useState([])
  const [open,setOpen]=useState(false)
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [username,setUsername]=useState('')
  const [user,setUser]=useState(null)
  const [openSignIn,setOpenSignIn]=useState(false)

  useEffect(()=>{
    const unSubscribe = auth.onAuthStateChanged((authUser)=>{
      if(authUser){
        //user logged in
        console.log(authUser);
        setUser(authUser)
      
      }else {
        //user logged out
        setUser(null);
      }
    })
    return ()=>{
      //Cleanup action  
      unSubscribe();
    }
  },[user,username])

  useEffect(()=>{
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot =>{
      //every time new post added ,this code runs
      setPosts(snapshot.docs.map(doc=> ({
        id:doc.id,
        post: doc.data()
      }) ))
    })
  },[])
   const signUp=(e)=>{
    e.preventDefault();
    auth
    .createUserWithEmailAndPassword(email,password)
    .then((authUser)=>{
     return  authUser.user.updateProfile({
        displayName:username
      })
    })
    .catch((error) => alert(error.message))
   }

   const signIn=(e)=>{
    e.preventDefault();
    auth
    .signInWithEmailAndPassword(email,password)
    .catch((error) => alert (error.message));
    setOpenSignIn(false)
   }
 
  return (
    <div className="App">
    

    <Modal
        open={open}
        onClose={()=>setOpen(false)}
      >
      <div style={modalStyle} className={classes.paper}>
      <form className="app_signup">
        <center>
        <img className="app_headerImage" style={{width:"30%"}}
        src="https://www.vippng.com/png/detail/34-343738_instagram-logo-vectors-png-free-download-instagram-name.png" 
        alt="logo"/>
         </center>
      <Input
      placeholder="username"
      type="text"
      value={username}
      onChange = {(e)=>setUsername(e.target.value)}
    />
    <Input
      placeholder="email"
      type="text"
      value={email}
      onChange = {(e)=>setEmail(e.target.value)}
    />
    <Input
    placeholder="password"
      type="text"
      value={password}
      onChange = {(e)=>setPassword(e.target.value)}

    />
    <Button type="submit" onClick={signUp}>Sign UP</Button>
    </form> 
      </div>
      </Modal>
  
       <Modal
        open={openSignIn}
        onClose={()=>setOpenSignIn(false)}
      >
      <div style={modalStyle} className={classes.paper}>
      <form className="app_signup">
        <center>
        <img className="app_headerImage" style={{width:"30%"}}
        src="https://www.vippng.com/png/detail/34-343738_instagram-logo-vectors-png-free-download-instagram-name.png" 
        alt="logo"/>
         </center>

    <Input
      placeholder="email"
      type="text"
      value={email}
      onChange = {(e)=>setEmail(e.target.value)}
    />
    <Input
    placeholder="password"
      type="text"
      value={password}
      onChange = {(e)=>setPassword(e.target.value)}

    />
    <Button type="submit" onClick={signIn}>Sign In</Button>
    </form> 
      </div>
      </Modal>

     
    <div className="app_header">
    <img className="app_headerImage" 
        src="https://www.vippng.com/png/detail/34-343738_instagram-logo-vectors-png-free-download-instagram-name.png" 
        alt="logo"/>
         {user ? (
      <Button onClick={()=>auth.signOut()}>Log Out</Button>
    ):(
      <div className="app_loginContainer">
      <Button onClick={()=>setOpenSignIn(true)}>Sign In</Button>
      <Button onClick={()=>setOpen(true)}>Sign Up</Button>
      </div>
 
    )}  
    </div>
    <div className="app_posts">
  
    <div className="app_postLeft">
    {
              posts.map(({id, post}) =>(
                <Post key={id} postId={id} user={user} username={post.username} imageUrl={post.imageUrl} caption={post.caption} />
              ))
            }
    </div> 
     <div className="app_postRight"> 
     <InstagramEmbed
        url='https://www.instagram.com/p/B_uf9dmAGPw/'
        clientAccessToken='EAADG27Ez5rUBAJfdjovNfWMi9ZBZB6NoJT6XDSiNQ6vxEaJ3aOaI6YVZAOHc2WgI9s4tCnXvJaUZB3E8yYoi93HHjhDipSPOyLviUZBVKrSr5gJe5eTo9rXguA0aAuRohZBEX47kvhNjLUPrlXXo73ZCTAK8mZCkK4DbcTWOs57TzN6QdOF8VdgA0sYbHl0JZAh3BYlTTCI0Ae2fPaDo7dTpu'
        maxWidth={400}
        hideCaption={false}
        containerTagName='div'
        protocol=''
        injectScript
        onLoading={() => {}}
        onSuccess={() => {}}
        onAfterRender={() => {}}
        onFailure={() => {}}
/>
      </div>
    </div>
   
   
    
    
    {user?.displayName ?(
      <ImgUpload username={user.displayName}/>
    ):(
      <h3>Sorry!you need to login to upload</h3>
    )}
    
    </div>
  );
}

export default App;
