import React from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const TextEditor = ({ value, onChange, handleSaveClick, isEditing }) => {
  return (
    <div>
      {isEditing ? (
        <div>
          <ReactQuill value={value} onChange={onChange} />
          <button onClick={handleSaveClick}>Uložit</button>
        </div>
      ) : (
        <div>
          <div dangerouslySetInnerHTML={{ __html: value }} />
        </div>
      )}
    </div>
  );
};

export default TextEditor;
