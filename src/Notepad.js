/*global chrome*/
import "./Notepad.scss";
import Note from "./Note";
import { useEffect, useState } from "react";

export default function Notepad() {
  const [notes, setNotes] = useState([]);
  useEffect(() => {
    refresh();
    //get notes from google api storage
  }, []);

  const refresh = () => {
    try {
      chrome.storage.local.get(["notes"], function (result) {
        if (result.notes) {
          // sort by date updated desending, transform the strings into dates first
          result.notes.sort((a, b) => {
            const dateA = new Date(a.dateUpdated);
            const dateB = new Date(b.dateUpdated);
            if (dateA > dateB) return -1;
            if (dateA < dateB) return 1;
            return 0;
          });

          setNotes([
            ...[<Note create={true} refresh={refresh} />, ...result.notes],
          ]);
        } else setNotes([<Note create={true} refresh={refresh} />]);
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="Notepad">
      <div className="container">
        <div className="notes">
          {notes && notes.length > 1 ? (
            <>
              {notes[0]}
              {notes.slice(1).map((note) => {
                if (!note) return null;
                return (
                  <Note
                    key={note.id}
                    id={note.id}
                    content={note.content}
                    dateCreated={note.dateCreated}
                    dateUpdated={note.dateUpdated}
                    refresh={refresh}
                  />
                );
              })}
            </>
          ) : (
            <>
              {notes[0]}

              <div className="no-notes">No notes yet</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
