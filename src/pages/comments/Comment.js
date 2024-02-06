// rafce
import { Media } from 'react-bootstrap';
import styles from '../../styles/Comment.module.css'

import React, { useState } from "react";
import Avatar from '../../components/Avatar';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { MoreDropdown } from '../../components/MoreDropdown';
import { axiosRes } from '../../api/axiosDefaults';
import CommentEditForm from "./CommentEditForm";

const Comment = (props) => {
  const { 
    profile_id, 
    profile_image, 
    owner, 
    updated_at, 
    content, 
    id, 
    setPost, 
    setComments, 
  } = props;

  // adding state to toggle EditForm
  const [showEditForm, setShowEditForm] = useState(false);
  // currentUser from  custom context
  const currentUser = useCurrentUser()
  // checking if current user's username matches owner's
  const is_owner = currentUser?.username === owner;

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/comments/${id}/`)
      setPost(prevPost => ({
        results: [{
          ...prevPost.results[0],
          // reducing comment count by 1
          comments_count: prevPost.results[0].comments_count - 1
        }]
      }))
      setComments(prevComments => ({
        ...prevComments,
        // we want to filter for the id of comment we are removing
        results: prevComments.results.filter((comment) => comment.id !== id),
      }))
    } catch(err) {}
  }

  return (
    <>
      <hr />
      <Media>
        <Link to={`/profiles/${profile_id}`}>
          <Avatar src={profile_image} />
        </Link>
        <Media.Body className="align-self-center ml-2">
          <span className={styles.Owner}>{owner}</span>
          <span className={styles.Date}>{updated_at}</span>
          {/* ternary deciding if the form should show */}
          {showEditForm ? (
            <CommentEditForm
            id={id}
            profile_id={profile_id}
            content={content}
            profileImage={profile_image}
            setComments={setComments}
            setShowEditForm={setShowEditForm}
          />
          ) : (
            <p>{content}</p>
          )}
        </Media.Body>
        {is_owner && !showEditForm && (
          <MoreDropdown
            handleEdit={() => setShowEditForm(true)}
            handleDelete={handleDelete}
          />
        )}
      </Media>
    </>
  );
}

export default Comment