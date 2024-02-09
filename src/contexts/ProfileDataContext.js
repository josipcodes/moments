import { createContext, useContext, useEffect, useState } from "react";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { useCurrentUser } from "./CurrentUserContext";
import { followHelper,  unfollowHelper } from "../utils/utils";

// creating context objects
export const ProfileDataContext = createContext();
export const SetProfileDataContext = createContext();

// We we create custom hooks we can call in other components
// to actually access the context objects we've created, via the useContext hook.
export const useProfileData = () => useContext(ProfileDataContext);
export const useSetProfileData = () => useContext(SetProfileDataContext);

// exporting and defining a function component with children props
export const ProfileDataProvider = ({ children }) => {
  const [profileData, setProfileData] = useState({
    // we will use the pageProfile later!
    pageProfile: { results: [] },
    // passing popularProfiles empty results array
    popularProfiles: { results: [] },
  });
  // removing the line  after moving block  from PopularProfiles.js
  // We won’t use the destructured popularProfiles because, eventually,
  // we’ll pass the entire profileData object as the value prop in the ProfileDataContext.Provider.
  // But we’ll need the useState and useEffect hooks here, so that the data is fetched on mount.
  //   const { popularProfiles } = profileData;
  const currentUser = useCurrentUser();

  const handleFollow = async (clickedProfile) => {
    try {
      // destructuring data property from the response object
      const { data } = await axiosRes.post("/followers/", {
        // data sent is what profile user followed
        followed: clickedProfile.id,
      });
      setProfileData((prevState) => ({
        ...prevState,
        pageProfile: {
          results: prevState.pageProfile.results.map((profile) =>
            followHelper(profile, clickedProfile, data.id)
          ),
        },
        popularProfiles: {
          ...prevState.popularProfiles,
          results: prevState.popularProfiles.results.map((profile) =>
            followHelper(profile, clickedProfile, data.id)
          ),
        },
      }));
    } catch (err) {
      // console.log(err);
    }
  };

  const handleUnfollow = async (clickedProfile) => {
    try {
      await axiosRes.delete(`/followers/${clickedProfile.following_id}/`);
      setProfileData((prevState) => ({
        pageProfile: {
          results: prevState.pageProfile.results.map((profile) =>
            unfollowHelper(profile, clickedProfile)
          ),
        },
        popularProfiles: {
          ...prevState.popularProfiles,
          results: prevState.popularProfiles.results.map((profile) =>
            unfollowHelper(profile, clickedProfile)
          ),
        },
      }));
    } catch (err) {
      // console.log(err);
    }
  };

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(
          // most followed profile will be at the top
          "/profiles/?ordering=-followers_count"
        );
        setProfileData((prevState) => ({
          ...prevState,
          popularProfiles: data,
        }));
      } catch (err) {
        // console.log(err);
      }
    };

    handleMount();
  }, [currentUser]);

  return (
    <ProfileDataContext.Provider value={profileData}>
      {/* adding extra pair of curly braces so we can send value as an object */}
      <SetProfileDataContext.Provider value={{ setProfileData, handleFollow, handleUnfollow }}>
        {children}
      </SetProfileDataContext.Provider>
    </ProfileDataContext.Provider>
  );
};
