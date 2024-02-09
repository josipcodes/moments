import React, { useEffect, useState } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import appStyles from "../../App.module.css";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { axiosReq } from "../../api/axiosDefaults";
import Post from "./Post";
import Comment from "../comments/Comment";
import CommentCreateForm from "../comments/CommentCreateForm";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import InfiniteScroll from "react-infinite-scroll-component";
import Asset from "../../components/Asset";
import { fetchMoreData } from "../../utils/utils";
import PopularProfiles from "../profiles/PopularProfiles";

function PostPage() {
  const { id } = useParams();
  // setting an initial value as an empty array in useState to make all the future logic compatible with arrays of objects.
  // this way it doesn't matter if we're getting a single object or array of posts.
  const [post, setPost] = useState({ results: [] });

  const currentUser = useCurrentUser();
  const profile_image = currentUser?.profile_image;
  const [comments, setComments] = useState({ results: [] });

  useEffect(() => {
    // handleMount to fetch the post on mount.
    const handleMount = async () => {
      try {
        // we'll eventually be making 2 requests - posts, comments.
        // destructuring and renaming variable (to post) in place.
        // it is called renaming with an object key.
        // Promises.all accepts an array of promises and gets resolved when all promises get resolved, returning an array of data.
        // If any of the promises fail, Promise.all gets rejected w/an error.
        const [{ data: post }, { data: comments }] = await Promise.all([
          // fetching the post
          axiosReq.get(`/posts/${id}`),
          // fetching the comments
          axiosReq.get(`/comments/?post=${id}`),
        ]);
        // using setPost func to update the results array in the state to contain a post
        setPost({ results: [post] });
        // setting Comments
        setComments(comments);
        // clg post to check that this is working
        // console.log(post);
      } catch (err) {
        // console.log(err);
      }
    };
    // calling handleMount and running the code every time the id in the url changes.
    handleMount();
  }, [id]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        {/* <p>Popular profiles for mobile</p> */}
        <PopularProfiles mobile />
        {/* <p>Post component</p> */}
        {/* postPage will evaluate to true */}
        <Post {...post.results[0]} setPosts={setPost} postPage />
        <Container className={appStyles.Content}>
          {currentUser ? (
            <CommentCreateForm
              profile_id={currentUser.profile_id}
              profileImage={profile_image}
              post={id}
              setPost={setPost}
              setComments={setComments}
            />
          ) : comments.results.length ? (
            "Comments"
          ) : null}
          {comments.results.length ? (
            <InfiniteScroll children={
              // if there are comments, they're shown
            comments.results.map((comment) => (
              // we're spreading comment object so its contents are passed as props
              <Comment
                key={comment.id}
                {...comment}
                setPost={setPost}
                setComments={setComments}
              />
            ))}
              dataLength={comments.results.length}
              loader={<Asset spinner />}
              hasMore={!!comments.next}
              next={() => fetchMoreData(comments, setComments)}
            />
          ) : // if there are no comments, we are checking if user is logged in
          currentUser ? (
            <span>No comments yet, be the first to comment.</span>
          ) : (
            // if the user is not logged in
            <span>No comments...yet.</span>
          )}
        </Container>
      </Col>
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
        {/* Popular profiles for desktop */}
        <PopularProfiles />
      </Col>
    </Row>
  );
}

export default PostPage;
