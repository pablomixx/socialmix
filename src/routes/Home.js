import { dbService } from "../fbase";
import React, { useState, useEffect } from "react";
import Smix from "../components/Smix";
import SmixFactory from "../components/SmixFactory";

const Home = ({ userObj }) => {
  console.log(userObj);
  const [smixs, setSmixs] = useState([]);

  useEffect(() => {
    dbService.collection("smixs").orderBy("createdAt", "desc").onSnapshot((snapshot) => {
      const newArray = snapshot.docs.map((document) => ({
        id:document.id,
        ...document.data(), 
      }));
      setSmixs(newArray);
    });
  }, []);

  return (
    <>
      <SmixFactory userObj={userObj} />
      <div>
        {smixs.map((smix) => (
          <Smix 
            key={smix.id}
            smixObj={smix}
            isOwner={smix.creatorId === userObj.uid}
          />
        ))}
      </div>
    </>
  );
};
export default Home;
