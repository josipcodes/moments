import { rest } from "msw";

// baseURL value from axiosDefaults
const baseURL = "https://josip-drf-api-d66c735b7edd.herokuapp.com/";

// used to store mock request handlers.
export const handlers = [
  // auto-importing rest object
  // defining a mock response for a get req for user details
  // callback func accepts 3 arguments, request, response and context
  rest.get(`${baseURL}dj-rest-auth/user/`, (req, res, ctx) => {
    // we'll return a JSON response
    return res(
      // copied from drf-api JSON when logged in to moments.
      // when our tests try to reach out to this endpoint to get user details,
      // our mocked API req handlers will intercept the test req and respond with our data
      // this will indicate that this user is currently logged in user.
      ctx.json({
        pk: 2,
        username: "test",
        email: "",
        first_name: "",
        last_name: "",
        profile_id: 2,
        profile_image:
          "https://res.cloudinary.com/darbzwl6q/image/upload/v1/media/images/6388c9a3-e4a7-43ce-ab80-dbbea0b6eaa3_itnghf",
      })
    );
  }),
  rest.post(`${baseURL}dj-rest-auth/logout/`, (req, res, ctx) => {
    // upon logout, response status will be 200
    return res(ctx.status(200))
  }),
];
