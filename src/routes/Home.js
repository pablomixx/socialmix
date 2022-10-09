import React, { useState, useEffect } from "react";
import { dbService } from "fbase";

const Home = ({ userObj }) => {
  console.log(userObj);
  const [smix, setSmix] = useState("");
  const [smixs, setSmixs] = useState([]);
  const getSmixs = async () => {
    const dbSmixs = await dbService.collection("smixs").get();
    dbSmixs.forEach((document) => {
      const smixObject = {
        ...document.data(),
        id: document.id,
      };
      setSmixs((prev) => [smixObject, ...prev]);
    });
  };
  useEffect(() => {
    getSmixs();
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
        <input type="submit" value="Smix" />
      </form>
      <div>
        {smixs.map((smix) => (
          <div key={smix.id}>
            <h4>{smix.text}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Home;
