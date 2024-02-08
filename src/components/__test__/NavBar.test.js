import { render, screen, fireEvent } from "@testing-library/react"
import { BrowserRouter as Router } from "react-router-dom/cjs/react-router-dom" 
import NavBar from "../NavBar"
import { CurrentUserProvider } from "../../contexts/CurrentUserContext"

test('renders Navbar', () => {
    render(
    <Router>
        {/* make sure to import NavBar, not bootstraps Navbar */}
        <NavBar />
    </Router>
    )
    // screen.debug works like clg
    // screen.debug();
    // looking for a link with the name of Sign in
    const signInLink = screen.getByRole('link', {name: 'Sign in'})
    // checking if the Sign in link is present in the document, we'll call the toBeInDocument method
    // we fail the test as per Red Green Refactor.
    // expect(signInLink).not.toBeInTheDocument()
    // we pass the test
    expect(signInLink).toBeInTheDocument()
})

// async function as we'll need to await for fetching data
test("renders link to the user profile for a logged in user", async () => {
    render(
      <Router>
        {/* CurrentUserProvider is necessary to fetch current user data */}
        <CurrentUserProvider>
          <NavBar />
        </CurrentUserProvider>
      </Router>
    );
  
    // we need to target elements which aren't there on mount,
    // since they appear as a result of an async function, we'll use
    // one of the find query methods with the await keyword
    const profileAvatar = await screen.findByText("Profile");
    // failing the test
    // expect(profileAvatar).not.toBeInTheDocument();
    // passing the test
    expect(profileAvatar).toBeInTheDocument();
  });

  test("renders Sign in and Sign up buttons again on log out", async () => {
    render(
      <Router>
        <CurrentUserProvider>
          <NavBar />
        </CurrentUserProvider>
      </Router>
    );
  
    // sign out link isn't present on mount so we use findByRole method as it's async query
    const signOutLink = await screen.findByRole("link", { name: "Sign out" });
    // our user click is fired on our chosen element
    fireEvent.click(signOutLink);
  
    const signInLink = await screen.findByRole("link", { name: "Sign in" });
    const signUpLink = await screen.findByRole("link", { name: "Sign up" });
  
    expect(signInLink).toBeInTheDocument();
    expect(signUpLink).toBeInTheDocument();
  });