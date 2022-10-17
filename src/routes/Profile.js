import React from "react"; 
import { authService } from "../fbase";
/* import { collection, getDocs, query, where, orderBy } from "@firebase/firestore"; */
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = ({ userObj, refreshUser }) => {
  const history = useNavigate();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await userObj.updateProfile({ displayName: newDisplayName });
      refreshUser();
    }
  };

  /* const getMySmixs = async () => {
    const smixs = query(
      collection(dbService, "smixs"),
      where("creatorId", "==", `${userObj.uid}`),
      orderBy("createdAt", "asc")
    );

    const querySnapshot = await getDocs(smixs);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
    });
    
  };

  useEffect(() => {
    getMySmixs();
  }, []); */

  return (
    <div className="container">
      <form onSubmit={onSubmit} className="profileForm">
        <input 
          onChange={onChange}
          type="text"
          placeholder="Display Name"
          value={newDisplayName}
          autoFocus
          className="formInput"
        />
        <input 
          type="submit" 
          value="Update Profile"
          className="formBtn"
          style={{ 
            marginTop: 10, 
          }} 
        />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>
    </div>
  );
};

export default Profile;



