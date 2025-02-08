import React, { useState } from "react";
import { FaEdit, FaRegTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom"; // Corrected import

const ArticleList = ({
  articles = [], // Default to empty array to avoid errors
  onArticleClick,
  isLoggedIn,
  handleDeleteArticle,
}) => {
  const [editingArticleId, setEditingArticleId] = useState(null);
  const [editedArticle, setEditedArticle] = useState({});

  // Sort articles by date (newest first)
  const sortedArticles = [...articles].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const handleEditClick = (article, event) => {
    event.stopPropagation();
    setEditingArticleId(article.id);
    setEditedArticle({ ...article });
  };

  const handleSaveClick = (event) => {
    event.stopPropagation();
    onArticleClick(editedArticle); // Pass the edited article to the parent
    setEditingArticleId(null); // Exit edit mode
  };

  const handleDeleteClick = (id, event) => {
    event.stopPropagation();
    handleDeleteArticle(id); // Call the delete handler
  };

  return (
    <div className="article-list">
      {sortedArticles.map((article) => (
        <div key={article.id} className="article-item">
          {editingArticleId === article.id ? (
            // Edit mode
            <>
              <input
                type="text"
                value={editedArticle.title}
                onChange={(e) =>
                  setEditedArticle({ ...editedArticle, title: e.target.value })
                }
                onClick={(e) => e.stopPropagation()}
                aria-label="Edit title"
              />
              <textarea
                value={editedArticle.organizer}
                onChange={(e) =>
                  setEditedArticle({
                    ...editedArticle,
                    organizer: e.target.value,
                  })
                }
                onClick={(e) => e.stopPropagation()}
                aria-label="Edit organizer"
              />
              <textarea
                value={editedArticle.content} // Corrected field name
                onChange={(e) =>
                  setEditedArticle({
                    ...editedArticle,
                    content: e.target.value, // Corrected field name
                  })
                }
                onClick={(e) => e.stopPropagation()}
                aria-label="Edit content"
              />
              <button onClick={handleSaveClick}>Uložit</button>
              <button onClick={() => setEditingArticleId(null)}>Zrušit</button>
            </>
          ) : (
            // View mode
            <>
              {isLoggedIn && (
                <button
                  className="button-delete"
                  onClick={(e) => handleDeleteClick(article.id, e)}
                  aria-label="Delete article"
                >
                  <span className="text">Smazat</span>
                  <span className="icon">
                    <FaRegTrashAlt />
                  </span>
                </button>
              )}
              {isLoggedIn && (
                <FaEdit
                  className="edit-icon"
                  onClick={(e) => handleEditClick(article, e)}
                  aria-label="Edit article"
                />
              )}
              <p>
                Datum vytvoření:{" "}
                {new Date(article.createdAt).toLocaleDateString()}
              </p>
              <h2>{article.title}</h2>
              <h3>Organizátor: {article.organizer}</h3>
              <p>{article.content}</p>
              <Link to={`/article/${article.id}`}>Detail</Link>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default ArticleList;
