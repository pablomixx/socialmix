import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { dbService, storageService } from "../fbase";
import React, { useState, useEffect } from "react";
import Smix from "../components/Smix";
import { v4 } from "uuid";

const Home = ({ userObj }) => {
  console.log(userObj);
  const [smix, setSmix] = useState("");
  const [smixs, setSmixs] = useState([]);
  const [attachment, setAttachment] = useState("");

  useEffect(() => {
    dbService.collection("smixs").orderBy("createdAt", "desc").onSnapshot((snapshot) => {
      const newArray = snapshot.docs.map((document) => ({
        id:document.id,
        ...document.data(), 
      }));
      setSmixs(newArray);
    });
  }, []);
  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = "";
    if (attachment !== "") {
      const attachmentRef = ref(storageService, `${userObj.uid}/${v4()}`);
      const response = await uploadString(attachmentRef, attachment, "data_url");
      attachmentUrl = await getDownloadURL(response.ref);
    }
    await dbService.collection("smixs").add({
      text: smix,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    });
    setSmix("");
    setAttachment("");
  };

  
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setSmix(value);
  };
  
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader ();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };
  
  const onClearAttachment = () => {setAttachment("")};

  return (
    <div>
      <>
        <form onSubmit={onSubmit}>
          <input
            value={smix}
            onChange={onChange}
            type="text"
            placeholder="What's on your mind?"
            maxLength={120}
          />
          <input type="file" accept="image/*" onChange={onFileChange} /> 
          <input type="submit" value="Smix" />
          {attachment && (
            <div>
              <img src={attachment} width="50px" height="50px" />
              <button onClick={onClearAttachment}>Clear</button>
            </div>
          )}
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
      </>
    </div>
  );
};
export default Home;
