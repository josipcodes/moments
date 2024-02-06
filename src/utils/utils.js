import { axiosReq } from "../api/axiosDefaults";

// can be reused with any  paginated data like comments/profiles by using resource, setResource...
export const fetchMoreData = async (resource, setResource) => {
  try {
    // next means next page of results
    const { data } = await axiosReq.get(resource.next);
    setResource((prevResource) => ({
      ...prevResource,
      next: data.next,
      // Using reduce to add our new data to the previous one
      // Setting the initial value to previous results.
      // If some finds a match, we'll return existing accumulator to the reduce method.
      // If it doesn't, we know it's a new post so we can return our spread operator with the new post at the end.

      // First, we use reduce method to loop through the new page of results that we got from API.
      // Then we append our new results to the existing ones in our posts.results array in the state.
      // Then, we use some() to loop through the array of posts in the accumulator.
      // Inside, we compare each acc item id to the newly fetched posts array.
      // If some returns true, it found a match and we're displaying it. We return acc without adding it.
      // If there's no match, we return an array containing our spread accumulator with the new post added to it.
      results: data.results.reduce((acc, cur) => {
        return acc.some((accResult) => accResult.id === cur.id)
          ? acc
          : [...acc, cur];
      }, prevResource.results),
    }));
  } catch (err) {}
};
