import React, { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import Post from "./Post";
import Asset from "../../components/Asset";

import appStyles from "../../App.module.css";
import styles from "../../styles/PostsPage.module.css";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { axiosReq } from "../../api/axiosDefaults";

import NoResults from "../../assets/no-results.png";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import PopularProfiles from "../profiles/PopularProfiles";

// destructuring message and filter props, with later being an empty string as a default.
function PostsPage({ message, filter = "" }) {
  const [posts, setPosts] = useState({ results: [] });
  // keeping track if all data has loaded
  const [hasLoaded, setHasLoaded] = useState(false);
  // we'll have to re-fetch posts again when user clicks between home, feed and liked pages.
  // to detect location, we'll use useLocation react router hook.
  const { pathname } = useLocation();
  // used for search functionality
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // the request string will contain filter parameter, which comes from the filter prop we set in routes.
        // tells API if we want to see all posts or certain ones.
        // search query passes data entered in the search field
        const { data } = await axiosReq.get(`/posts/?${filter}search=${query}`);
        setPosts(data);
        // setting HasLoaded to true so spinner no longer spins.
        setHasLoaded(true);
      } catch (err) {
        // console.log(err);
      }
    };
    // we want spinner displayed before we fetch posts.
    setHasLoaded(false);
    const timer = setTimeout(() => {
      // we want this called any time filter or url changes.
      fetchPosts();
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
    // adding query to dependency array so the new req is made when user changed their text search
  }, [filter, pathname, query]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        {/* popular profiles */}
        <PopularProfiles mobile />
        {/* search icon */}
        <i className={`fas fa-search ${styles.SearchIcon}`} />
        {/* input field */}
        <Form
          className={styles.SearchBar}
          // passing the event so prevent default refresh behavior.
          onSubmit={(e) => e.preventDefault()}
        >
          <Form.Control
            value={query}
            // API req is handled by onChange, not onSubmit
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            className="mr-sm-2"
            placeholder="Search posts"
          />
        </Form>
        {/* ternary to display spinner or posts */}
        {hasLoaded ? (
          // nested ternary to display posts or message.
          <>
            {posts.results.length ? (
              <InfiniteScroll
                // child component will tell our Infinite Scroll component which child components we want it to render.
                children={
                  // map over posts and render each one
                  posts.results.map((post) => (
                    // setPosts is needed to like posts.
                    <Post key={post.id} {...post} setPosts={setPosts} />
                  ))
                }
                // props for infinite scroll
                // how many posts are displayed
                dataLength={posts.results.length}
                // loader
                loader={<Asset spinner />}
                // is there more data to display
                // we use double not or double bang operator, returns true for truthy and false for falsy values
                // next on our page is displayed with a value, when there is no next, it's set to null
                hasMore={!!posts.next}
                // if hasMore is true, loads more
                next={() => fetchMoreData(posts, setPosts)}
              />
            ) : (
              // show no results asset
              <Container className={appStyles.Content}>
                {/* no results image, message we passed down */}
                <Asset src={NoResults} message={message} />
              </Container>
            )}
          </>
        ) : (
          // spinner
          <Container className={appStyles.Content}>
            <Asset spinner />
          </Container>
        )}
      </Col>
      <Col md={4} className="d-none d-lg-block p-0 p-lg-2">
        <PopularProfiles />
      </Col>
    </Row>
  );
}

export default PostsPage;
