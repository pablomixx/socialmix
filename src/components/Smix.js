import React from "react";
import { useState } from "react";
import { dbService, storageService } from "../fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";


const Smix = ({ smixObj, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [newSmix, setNewSmix] = useState(smixObj.text);
    const onDeleteClick = async () => {
        const ok = window.confirm("Do you want to delete this smix?");
        if (ok) {
            await dbService.doc(`smixs/${smixObj.id}`).delete();
            if (smixObj.attachmentUrl !== "")
                await storageService.refFromURL(smixObj.attachmentUrl).delete();
        }
    };

    const toggleEditing = () => setEditing((prev) => !prev);

    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setNewSmix(value);
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.doc(`smixs/${smixObj.id}`).update({ text: newSmix + "(Edited)" });
        setEditing(false);
    };

    return (
        <div className="smix">
            {editing ? (
            <>
                <form onSubmit={onSubmit} className="container smixEdit">
                    <input 
                        onChange={onChange} 
                        value={newSmix} 
                        required
                        placeholder="Edit your smix"
                        autoFocus
                        className="formInput"
                    />
                    <input type="submit" value="Update Smix" className="formBtn" />
                </form>
                <button onClick={toggleEditing} className="formBtn cancelBtn">Cancel</button>
            </>
        ) : (
            <>
                <h4 style={{ marginBottom : 10, marginTop : 20 }}>{smixObj.text}</h4>
                {smixObj.attachmentUrl && (
                    <img src={smixObj.attachmentUrl} height="200px" alt="Smix images" />
                )}
                {isOwner && (
                    <div className="smix__actions">
                        <span onClick={onDeleteClick}>
                            <FontAwesomeIcon icon={faTrash} />
                        </span>
                        <span onClick={toggleEditing}>
                            <FontAwesomeIcon icon={faPencilAlt}
                            style={{ marginLeft : 15 }}/>
                        </span>
                    </div>
                )}
            </>
        )}
        </div>
    );
};

export default Smix;