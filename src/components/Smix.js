import { dbService } from "fbase";
import { useState } from "react";

const Smix = ({ smixObj, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [newSmix, setNewSmix] = useState(smixObj.text);
    const onDeleteClick = async () => {
        const ok = window.confirm("Do you want to delete this smix?");
        console.log(ok);
        if (ok) {
            console.log(smixObj.id);
            const data = await dbService.doc(`smixs/${smixObj.id}`).delete();
            console.log(data);
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