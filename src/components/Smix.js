import React from "react";
import { useState } from "react";
import { dbService, storageService } from "../fbase";


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
        <div>
            {editing ? (
            <>
                <form onSubmit={onSubmit}>
                    <input onChange={onChange} value={newSmix} required />
                    <input type="submit" value="Update Smix" />
                </form>
                <button onClick={toggleEditing}>Cancel</button>
            </>
        ) : (
            <>
                <h4>{smixObj.text}</h4>
                {smixObj.attachmentUrl && (
                    <img src={smixObj.attachmentUrl} height="200px" />
                )}
                {isOwner && (
                    <>
                        <button onClick={onDeleteClick}>Delete Smix</button>
                        <button onClick={toggleEditing}>Edit Smix</button>
                    </>
                )}
            </>
        )}
        </div>
    );
};

export default Smix;