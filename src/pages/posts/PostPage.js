import React, { useEffect, useState } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import appStyles from "../../App.module.css";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { axiosReq } from "../../api/axiosDefaults";
import Post from "./Post"

function PostPage() {
  const { id } = useParams();
  // setting an initial value as an empty array in useState to make all the future logic compatible with arrays of objects.
  // this way it doesn't matter if we're getting a single object or array of posts.
  const [post, setPost] = useState({ results: [] });

  useEffect(() => {
    // handleMount to fetch the post on mount.
    const handleMount = async () => {
      try {
        // we'll eventually be making 2 requests - posts, comments.
        // destructuring and renaming variable (to post) in place.
        // it is called renaming with an object key.
        // Promises.all accepts an array of promises and gets resolved when all promises get resolved, returning an array of data.
        // If any of the promises fail, Promise.all gets rejected w/an error.
        const [{ data: post }] = await Promise.all([
          axiosReq.get(`/posts/${id}`),
        ]);
        // using setPost func to update the results array in the state to contain a post
        setPost({ results: [post] });
        // clg post to check that this is working
        console.log(post);
      } catch (err) {
        console.log(err);
      }
    };
    // calling handleMount and running the code every time the id in the url changes.
    handleMount();
  }, [id]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <p>Popular profiles for mobile</p>
        {/* <p>Post component</p> */}
        {/* postPage will evaluate to true */}
        <Post {...post.results[0]} setPosts={setPost} postPage />
        <Container className={appStyles.Content}>Comments</Container>
      </Col>
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
        Popular profiles for desktop
      </Col>
    </Row>
  );
}

export default PostPage;
