// rafce
import React from "react";
import styles from "../../styles/Profile.module.css";
import btnStyles from "../../styles/Button.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import Avatar from "../../components/Avatar";
import Button from "react-bootstrap/Button";
import { useSetProfileData } from "../../contexts/ProfileDataContext";

const Profile = (props) => {
  // destructuring props
  const { profile, mobile, imageSize = 55 } = props;
  // destructuring profile
  const { id, following_id, image, owner } = profile;

  // checking for owner
  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;

  const { handleFollow, handleUnfollow } = useSetProfileData();

  return (
    <div
      // if user is on mobile, display content in a column
      className={`my-3 d-flex align-items-center ${mobile && "flex-column"}`}
    >
      <div>
        <Link className="align-self-center" to={`/profiles/${id}`}>
          <Avatar src={image} height={imageSize} />
        </Link>
      </div>
      <div className={`mx-2 ${styles.WordBreak}`}>
        <strong>{owner}</strong>
      </div>
      {/* displaying Follow/Unfollow button only on desktop, if user is logged in and it's not their account that's on the list */}
      <div className={`text-right ${!mobile && "ml-auto"}`}>
        {!mobile &&
          currentUser && !is_owner &&
          // if user already followes the popular profile, following_id won't be null
          (following_id ? (
            <Button
              className={`${btnStyles.Button} ${btnStyles.BlackOutline}`}
              onClick={() => handleUnfollow(profile)}
            >
              Unfollow
            </Button>
          ) : (
            <Button
            className={`${btnStyles.Button} ${btnStyles.Black}`}
              onClick={() => handleFollow(profile)}
            >Follow</Button>
          ))}
      </div>
    </div>
  );
};

export default Profile;
