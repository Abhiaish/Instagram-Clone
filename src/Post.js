import React, { useState ,useEffect} from 'react'
import './Post.css'
import Avatar from '@material-ui/core/Avatar'
import { db  } from "./firebase"
import firebase from "firebase"

function Post({postId,username,caption,imageUrl,user}) {
    const [comments,setComments]=useState([])
    const [comment, setComment] = useState("")

    useEffect(() => {
        let unsubscribe
        if(postId){
            unsubscribe = db
            .collection("posts")
            .doc(postId)
            .collection("comments")
            .orderBy("timestamp", "desc")
            .onSnapshot((snapshot) =>{
                setComments(snapshot.docs.map((doc) => doc.data()));
            })
        }
        return () => {
            unsubscribe()
        }
    }, [postId])

    const postComment = (event) =>{ 
        event.preventDefault();
        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp:firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment("");
    }

    return (
        <div className="post">
        {/* header avatar */}
       
        {/* image */}
        <div className="post_header">
        <Avatar className="post_avatar"
            alt="Abhinaya"
            src="/static/images/avatar/1.jpg"
        />
         <h3>{username}</h3>
         </div>
        <img className="post_image"
        src={imageUrl} alt=""/>
            
        {/* username and caption */}

        <h4 className="post_text"><strong>{username}</strong>{caption}</h4>
        <div className="post_comments">
                {comments.map((comment) => (
                        <p>
                            <strong>{comment.username}</strong> {comment.text}
                        </p>
                    ))
                }
            </div>
            {user && (
                <form className="post_commentBox">
                <input
                    className="post_input"
                    type="text"
                    placeholder="Add a Comment..."
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                />
                <button
                    disabled={!comment}
                    className="post_button"
                    type="submit"
                    onClick={postComment}
                >
                POST
                </button>
                </form>
            )}
        </div>

    )
}

export default Post
