import styles from "./App.module.css";
import NavBar from "./components/NavBar";
import Container from "react-bootstrap/Container";
import { Route, Switch } from "react-router-dom";
import "./api/axiosDefaults";
import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm";
import PostCreateForm from "./pages/posts/PostCreateForm";
import PostPage from "./pages/posts/PostPage";
import PostsPage from "./pages/posts/PostsPage";
import PostEditForm from "./pages/posts/PostEditForm";
import { useCurrentUser } from "./contexts/CurrentUserContext";
import ProfilePage from "./pages/profiles/ProfilePage";

function App() {
  // check for current user so we can return liked posts and ones by followed profiles.
  const currentUser = useCurrentUser();
  // need profile_id to filter the posts by.
  // defaults to an empty string if current user details are still being fetched.
  const profile_id = currentUser?.profile_id || "";

  return (
    <div className={styles.App}>
      <NavBar />
      <Container className={styles.Main}>
        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              // message for when search brings up no results.
              <PostsPage message="No results found. Adjust your search keyword." />
            )}
          />
          <Route
            exact
            path="/feed"
            render={() => (
              // message for when search brings up no results.
              <PostsPage
                message="No results found. Adjust your search keyword or follow a user."
                filter={`owner__followed__owner__profile=${profile_id}&`}
              />
            )}
          />
          <Route
            exact
            path="/liked"
            render={() => (
              // message for when search brings up no results.
              <PostsPage
                message="No results found. Adjust your search keyword or like a post."
                filter={`likes__owner__profile=${profile_id}&ordering=-likes__created_at&`}
              />
            )}
          />
          <Route exact path="/signin" render={() => <SignInForm />} />
          <Route exact path="/signup" render={() => <SignUpForm />} />
          <Route exact path="/posts/create" render={() => <PostCreateForm />} />
          {/* id is a URL parameter for our post */}
          <Route exact path="/posts/:id/edit" render={() => <PostEditForm />} />
          <Route exact path="/posts/:id" render={() => <PostPage />} />
          <Route exact path="/profiles/:id" render={() => <ProfilePage />} />
          <Route render={() => <p>Page not found</p>} />
        </Switch>
      </Container>
    </div>
  );
}

export default App;
