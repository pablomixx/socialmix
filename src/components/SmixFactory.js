import React, { useState, storageService, dbService } from "react";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { v4 } from "uuid";

const SmixFactory = ({ userObj }) => {
    const [smix, setSmix] = useState("");
    const [attachment, setAttachment] = useState("");

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
        reader.readAsDataURL(theFile);
    };
      
    const onClearAttachment = () => {setAttachment("")};
    
    return (
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
              <img src={attachment} width="50px" height="50px" alt="preview" />
              <button onClick={onClearAttachment}>Clear</button>
            </div>
          )}
        </form>
    );
};

export default SmixFactory;