// rafce
import React from "react";
import { Container } from "react-bootstrap";
import appStyles from "../../App.module.css";
import Asset from "../../components/Asset";
import Profile from "./Profile";
import { useProfileData } from "../../contexts/ProfileDataContext";

const PopularProfiles = ({ mobile }) => {
  const { popularProfiles } = useProfileData();
  // const [profileData, setProfileData] = useState({
  //   // we will use the pageProfile later!
  //   pageProfile: { results: [] },
  //   // passing popularProfiles empty results array
  //   popularProfiles: { results: [] },
  // });
  // const { popularProfiles } = profileData;
  // const currentUser = useCurrentUser();

  // useEffect(() => {
  //   const handleMount = async () => {
  //     try {
  //       const { data } = await axiosReq.get(
  //         // most followed profile will be at the top
  //         "/profiles/?ordering=-followers_count"
  //       );
  //       setProfileData((prevState) => ({
  //         ...prevState,
  //         popularProfiles: data,
  //       }));
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };

  //   handleMount();
  // }, [currentUser]);

  return (
    <Container
      className={`${appStyles.Content} ${
        mobile && "d-lg-none text-center mb-3"
      }`}
    >
      {popularProfiles.results.length ? (
        <>
          <p>Most followed profiles.</p>
          {mobile ? (
            <div className="d-flex justify-content-around">
              {/* slicing results to display the first 4 */}
              {popularProfiles.results.slice(0, 4).map((profile) => (
                // <p key={profile.id}>{profile.owner}</p>
                <Profile key={profile.id} profile={profile} mobile />
              ))}
            </div>
          ) : (
            popularProfiles.results.map((profile) => (
              // <p key={profile.id}>{profile.owner}</p>
              <Profile key={profile.id} profile={profile} />
            ))
          )}
        </>
      ) : (
        <Asset spinner />
      )}
    </Container>
  );
};

export default PopularProfiles;
