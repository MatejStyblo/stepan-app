import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./Login";
import ArticleList from "./ArticleList";
import ArticleDetail from "./ArticleDetail"; // Importujeme ArticleDetail

function App() {
  const [articles, setArticles] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/articles");
      setArticles(response.data);
    } catch (error) {
      console.error("Chyba při načítání článků:", error.message);
    }
  };

  const handleAddArticle = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/articles", {
        title: "Nadpis",
        createdAt: new Date().toISOString(),
        whatIsThat: "Co to je",
        organizer: "Pořadatel",
        content: "Obsah článku",
        summary: "Vše",
        image: {},
      });
      setArticles([...articles, response.data]);
    } catch (error) {
      console.error("Chyba při přidávání článku:", error.message);
    }
  };

  const handleEditArticle = async (updatedArticle) => {
    try {
      await axios.put(
        `http://localhost:5000/api/articles/${updatedArticle.id}`,
        updatedArticle
      );
      setArticles(
        articles.map((article) =>
          article.id === updatedArticle.id ? updatedArticle : article
        )
      );
    } catch (error) {
      console.error("Chyba při úpravě článku:", error.message);
    }
  };

  const handleDeleteArticle = async (articleId) => {
    try {
      await axios.delete(`http://localhost:5000/api/articles/${articleId}`);
      setArticles(articles.filter((article) => article.id !== articleId));
    } catch (error) {
      console.error("Chyba při mazání článku:", error.message);
    }
  };

  const handleLogin = (password) => {
    if (password === "matej") {
      setIsLoggedIn(true);
    } else {
      alert("Neplatné heslo");
    }
  };

  return (
    <Router>
      <div className="app-container">
        {!isLoggedIn && <Login onLogin={handleLogin} />}
        <h1 className="app-title">Štěpánův kult</h1>
        {isLoggedIn && (
          <button onClick={handleAddArticle} className="add-article-btn">
            <span className="text">Přidat článek</span>
            <span className="icon">
              <span className="buttonSpan">+</span>
            </span>
          </button>
        )}
        <Routes>
          <Route
            path="/"
            element={
              <ArticleList
                articles={articles}
                onArticleClick={handleEditArticle}
                isLoggedIn={isLoggedIn}
                handleDeleteArticle={handleDeleteArticle}
              />
            }
          />
          <Route
            path="/article/:id"
            element={
              <ArticleDetail
                onArticleClick={handleEditArticle}
                articles={articles}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
