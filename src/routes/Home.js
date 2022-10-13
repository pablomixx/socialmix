import React, { useState, useEffect } from "react";
import { dbService } from "fbase";
import Smix from "components/Smix";

const Home = ({ userObj }) => {
  console.log(userObj);
  const [smix, setSmix] = useState("");
  const [smixs, setSmixs] = useState([]);

  useEffect(() => {
    dbService.collection("smixs").onSnapshot((snapshot) => {
      const newArray = snapshot.docs.map((document) => ({
        id:document.id,
        ...document.data(), 
      }));
      setSmixs(newArray);
    });
  }, []);
  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.collection("smixs").add({
      text: smix,
      createdAt: Date.now(),
      creatorId: userObj.uid,
    });
    setSmix("");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setSmix(value);
  };
  console.log(smixs);
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={smix}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="file" accept="image/*" /> 
        <input type="submit" value="Smix" />
      </form>
      <div>
        {smixs.map((smix) => (
          <Smix 
            key={smix.id}
            smixObj={smix}
            isOwner={smix.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};
export default Home;
