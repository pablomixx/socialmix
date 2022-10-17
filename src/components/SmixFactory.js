import React, { useState } from "react";
import { storageService, dbService } from "../fbase";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { v4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons"

const SmixFactory = ({ userObj }) => {
  const [smix, setSmix] = useState("");
  const [attachment, setAttachment] = useState("");

  const onSubmit = async (event) => {
      event.preventDefault();
      if (smix === "") {
        return;
      }
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
      event.preventDefault();
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
      if (Boolean(theFile)) {
        reader.readAsDataURL(theFile);
      }
  };
      
  const onClearAttachment = () => {setAttachment("")};
  
  return (
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input
          className="factoryInput__input"
          value={smix}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="submit" value="&rarr;" className="factoryInput__arrow" />
      </div>
      <label htmlFor="attach-file" className="factoryInput__lable">
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        id="attach-file"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{ 
          opacity: 0,
          }}
      />
      {attachment && (
        <div className="factoryForm__attachment">
          <img
            src={attachment}
            style={{ 
              backgroundImage: attachment, 
            }}
          />
          <div className="factoryForm__clear" onClick={onClearAttachment}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
      </form>
  );
};

export default SmixFactory;