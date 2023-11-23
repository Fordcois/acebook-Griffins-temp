import React, { useEffect, useState } from 'react';
import './Post.css';
import getSessionUserID from '../utility/getSessionUserID';
import formatNumLikes from '../utility/getNumLikes';
import formatLikesUsersPreview from '../utility/getNumLikesUserPreview';
import formatFullDateString from '../utility/getFullDateString';
import convertRelativeDateTimeString from '../utility/getRelativeTimestamp';
import CommentsBox from '../comments/CommentsBox';

import { BiLike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";

const Post = ({ post }) => {

  // =========== STATE VARIABLES ==========================
  const [token, setToken] = useState(window.localStorage.getItem("token"));
  let sessionUserID = getSessionUserID(token);
  // checks if sessionUserID is in user._id for user in post.likes --> array of Users, not user_id's due to populate in controllers/posts line 7-8
  const [userLiked, setUserLiked] = useState(post.likes.some(user => user._id === sessionUserID));


  // ============ LIKE BUTTON =============================
  const handleLikeSubmit = async (event) => {

    if (token) {
      event.preventDefault();

      // Step 1: Put request for the session user to Like/Unlike the post
      fetch(`/posts/${post._id}`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({})
      }) // complete Put request & update token
        .then(async response => {
          let putData = await response.json();
          console.log("token", putData)
          window.localStorage.setItem("token", putData.token);
          setToken(window.localStorage.getItem("token"));

          // Step 2: Perform the GET request to fetch the updated post
          return fetch(`/posts/${post._id}`, {
            method: 'get',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
        }) // Update post.likes to the data from the new GET request
        .then(getResponse => {
          if (!getResponse.ok) {
            throw new Error(`Failed to fetch updated post with ID ${post._id}`);
          }
          return getResponse.json();
        })
        .then(getData => {
          // Update the likes and userLiked state using the updated post data
          post.likes = getData.post.likes;
          setUserLiked(post.likes.some(user => user._id === sessionUserID));
        })
    }
  }
// ============= DISPLAYING LIKES ==================

  // --------- "X like(s)" ---------------
  const likes_formatted = formatNumLikes(post.likes)

  // --------- "You/User and X others liked this" ---------------
  const likes_formatted_with_user_preview = formatLikesUsersPreview(post.likes, sessionUserID)


  // ======== FORMATTING TIME ==============
  const postedDateTime = new Date(post.date_posted);

  // ------------ '19 Nov 2023 at 5:45PM' -------------
  const fullDateTimeString = formatFullDateString(postedDateTime)

  // ------------ 'X seconds ago / X minutes ago / X hours ago / X days ago / fullDateTime --------------
  const relativeDateTimeString = convertRelativeDateTimeString(postedDateTime);


  const fillerImage = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/35.png"

  // ========= JSX FOR THE UI OF THE COMPONENT =====================
  return (
    <article className='thread-container' data-cy="post" key={post._id}>
      <div className='post-container'>

        {/* LINKED USER PROFILE PIC */}
        <div class="circle-container">
        <a href={`/users/${post.user_id._id}`}>
          <img src={fillerImage} alt="Image Alt Text"/>
        </a>
        </div>

        <div class="author-and-timestamp">
          {/* LINKED USER FULL NAME */}
          <a href={`/users/${post.user_id._id}`}>
            <p className='user-full-name'>{ post.user_id.firstName } { post.user_id.lastName }</p> 
          </a>
          {/* RELATIVE DATE STAMP AND HOVER FULL DATE STAMP */}
          <div className='tooltip'>
            <p className='date-posted'>{relativeDateTimeString}</p>
          <span className='tooltiptext'>{fullDateTimeString}</span>
      </div>

        </div>

        <div className="content">
          <p className='message'>{post.message}</p>

          {/* Display image if available */}
          {post.imageUrl && (
            <img src={post.imageUrl} alt="Post" className="post-image" />
          )}
          
        </div>
        
        <div className='reactions'>
          {/* choose one format later */}
          {/* <button onClick={handleLikeSubmit} className={userLiked ? 'unlike-button' : 'like-button'}>{userLiked ? 'Unlike' : 'Like'}</button> */}
          <button onClick={handleLikeSubmit} className={userLiked ? 'unlike-button' : 'like-button'}>
            {userLiked ? <BiSolidLike /> : <BiLike />}
          </button>
          {/* <p className='likes'>{likes_formatted}</p> */}
          {/* TODO make number of likes clickable -- popup that shows each user who liked this */}
          <p className='likes-users'>{likes_formatted_with_user_preview}</p>

          {/* TODO Add showComments state that is activated when you click 'comments' */}
          <p className='comments-num'>{`${post.comments.length} comments`}</p>

          {/* TODO Add showWriteReply state that is activated when you click 'reply' */}
          <button onClick={console.log('show leave-comment box')} className='show-leave-comment-box-button'>
            Leave Comment
          </button>
        </div>
      </div>  

      
      <CommentsBox post={post}/>
    </article>
  )
}

export default Post;
