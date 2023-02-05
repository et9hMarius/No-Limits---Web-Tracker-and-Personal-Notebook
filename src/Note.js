/*global chrome*/
import "./Note.scss";
import { useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useNavigate } from "react-router";

export default function Note({
  id = null,
  content = null,
  dateCreated = null,
  dateUpdated = null,
  refresh = null,
  create = false,
}) {
  const [noteContent, setNoteContent] = useState(content);
  const [noteDateCreated, setNoteDateCreated] = useState(dateCreated);
  const [noteDateUpdated, setNoteDateUpdated] = useState(dateUpdated);
  const [noteId, setNoteId] = useState(id);
  const navigate = useNavigate();

  const onDelete = () => {
    //delete note from google api storage
    try {
      chrome.storage.local.get(["notes"], function (result) {
        if (result.notes) {
          const notes = result.notes;
          const note = notes.find((note) => note.id === noteId);
          if (note) {
            const index = notes.indexOf(note);
            notes.splice(index, 1);
            chrome.storage.local.set({ notes: notes }, function () {
              console.log("Notes saved");
              refresh();
            });
          }
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  const onSave = () => {
    if (!noteContent) return;
    if (noteContent.length === 0) return;
    setNoteDateUpdated(formatDate(new Date()));
    //set note to google api storage
    try {
      chrome.storage.local.get(["notes"], function (result) {
        if (result.notes) {
          const notes = result.notes;
          const note = notes.find((note) => note.id === noteId);
          if (note) {
            note.content = noteContent;
            note.dateUpdated = formatDate(new Date());
          } else {
            notes.push({
              id: noteId,
              content: noteContent,
              dateCreated: noteDateCreated,
              dateUpdated: formatDate(new Date()),
            });
          }
          chrome.storage.local.set({ notes: notes }, function () {
            console.log("Notes saved");
            if (create) {
              setNoteDateCreated(formatDate(new Date()));
              setNoteDateUpdated(formatDate(new Date()));
              setNoteId(String(new Date()));
            }
            refresh();
          });
        } else {
          chrome.storage.local.set(
            {
              notes: [
                {
                  id: noteId,
                  content: noteContent,
                  dateCreated: noteDateCreated,
                  dateUpdated: noteDateUpdated,
                },
              ],
            },
            function () {
              console.log("Notes saved");
              if (create) {
                setNoteDateCreated(formatDate(new Date()));
                setNoteDateUpdated(formatDate(new Date()));
                setNoteId(String(new Date()));
              }
              refresh();
            }
          );
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    const hours = d.getHours();
    const minutes = d.getMinutes();
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  useEffect(() => {
    if (!noteDateCreated) setNoteDateCreated(formatDate(new Date()));
    if (!noteDateUpdated) setNoteDateUpdated(formatDate(new Date()));
    if (!noteId) setNoteId(String(new Date()));
  }, []);

  return (
    <div className="Note">
      <div className="note_container">
        <div className="noteContent-wrapper">
          <TextareaAutosize
            className="noteContent"
            value={noteContent}
            placeholder="New note..."
            onChange={(e) => setNoteContent(e.target.value)}
          />
        </div>
        <div className="noteFooter">
          {create == false && (
            <div className="noteDateCreated">
              {noteDateCreated}
              <span style={{ color: "gray" }}> - created</span>
            </div>
          )}
          <div className="save-button" onClick={onSave}>
            <a href="#">💾</a>
          </div>
          {create == false && (
            <div className="delete-button" onClick={onDelete}>
              <a href="#">🗑️</a>
            </div>
          )}
          {create == false && (
            <div className="noteDateUpdated">
              <span style={{ color: "gray" }}> updated - </span>
              {noteDateUpdated}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
