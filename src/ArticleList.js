import React, { useState } from "react";
import { FaEdit, FaRegTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const ArticleList = ({
  articles = [],
  onArticleClick,
  isLoggedIn,
  handleDeleteArticle,
  handleAddArticle,
}) => {
  const [editingArticleId, setEditingArticleId] = useState(null);
  const [editedArticle, setEditedArticle] = useState({});

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
    onArticleClick(editedArticle);
    setEditingArticleId(null);
  };

  const handleDeleteClick = (id, event) => {
    event.stopPropagation();
    if (window.confirm("Opravdu chcete smazat tento článek?")) {
      handleDeleteArticle(id);
    }
  };

  if (sortedArticles.length === 0) {
    return (
      <div className="article-list">
        {isLoggedIn && (
          <button onClick={handleAddArticle} className="add-article-btn">
            <span className="text">Přidat článek</span>
            <span className="icon">
              <span className="buttonSpan">+</span>
            </span>
          </button>
        )}
        <h1 style={{ textAlign: "center" }}>Žádné články k zobrazení.</h1>
      </div>
    );
  }

  return (
    <div className="article-list">
      {isLoggedIn && (
        <button onClick={handleAddArticle} className="add-article-btn">
          <span className="text">Přidat článek</span>
          <span className="icon">
            <span className="buttonSpan">+</span>
          </span>
        </button>
      )}
      {sortedArticles.map((article) => (
        <div
          key={article.id}
          className={`article-item ${
            editingArticleId === article.id ? "edit-mode" : ""
          }`}
        >
          {editingArticleId === article.id ? (
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
                value={editedArticle.content}
                onChange={(e) =>
                  setEditedArticle({
                    ...editedArticle,
                    content: e.target.value,
                  })
                }
                onClick={(e) => e.stopPropagation()}
                aria-label="Edit content"
              />
              <button onClick={handleSaveClick}>Uložit</button>
              <button onClick={() => setEditingArticleId(null)}>Zrušit</button>
            </>
          ) : (
            <>
              {isLoggedIn && (
                <button
                  className="button-delete"
                  onClick={(e) => handleDeleteClick(article.id, e)}
                  aria-label="Smazat článek"
                  role="button"
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
                  aria-label="Upravit článek"
                />
              )}
              <p className="article-list-date">
                Datum vytvoření:{" "}
                {new Date(article.createdAt).toLocaleDateString()}
              </p>
              <h2>{article.title}</h2>
              <h3>{article.organizer}</h3>
              <p className="article-list-content">{article.content}</p>

              <Link to={`/article/${article.id}`} className="article-link">
                Přejít na detail článku
              </Link>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default ArticleList;
