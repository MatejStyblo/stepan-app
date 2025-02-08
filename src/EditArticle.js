import React, { useState, useEffect } from "react";

function EditArticle({ article, onSave }) {
  const [title, setTitle] = useState(article.title);
  const [content, setContent] = useState(article.content);

  useEffect(() => {
    setTitle(article.title);
    setContent(article.content);
  }, [article]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...article, title, content });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Název článku"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Obsah článku"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button type="submit">Uložit</button>
    </form>
  );
}

export default EditArticle;
