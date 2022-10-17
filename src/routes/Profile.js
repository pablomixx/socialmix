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
    <>
      <form onSubmit={onSubmit}>
        <input 
          onChange={onChange}
          type="text"
          placeholder="Display Name"
          value={newDisplayName}
        />
        <input type="submit" value="Update Profile" />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};

export default Profile;



