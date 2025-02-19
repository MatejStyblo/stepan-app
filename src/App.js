import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./Login";
import ArticleList from "./ArticleList";
import ArticleDetail from "./ArticleDetail";

function App() {
  const [articles, setArticles] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_HOST_URL}/api/articles`
      );
      setArticles(response.data);
    } catch (error) {
      console.error(
        "Chyba při načítání článků:",
        error.response?.data || error.message
      );
    }
  };

  const handleAddArticle = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_HOST_URL}/api/articles`,
        {
          title: "Nadpis",
          createdAt: new Date().toISOString(),
          whatIsThat: "Co to je",
          organizer: "Pořadatel",
          content: "Obsah článku",
          summary: "Vše",
          imageUrl: "", // Změněno z `image: {}` na `imageUrl: ""`
        }
      );
      setArticles([...articles, response.data]);
    } catch (error) {
      console.error(
        "Chyba při přidávání článku:",
        error.response?.data || error.message
      );
    }
  };

  const handleEditArticle = async (updatedArticle) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_HOST_URL}/api/articles/${updatedArticle.id}`,
        updatedArticle
      );
      setArticles(
        articles.map((article) =>
          article.id === updatedArticle.id ? updatedArticle : article
        )
      );
    } catch (error) {
      console.error(
        "Chyba při úpravě článku:",
        error.response?.data || error.message
      );
    }
  };

  const handleDeleteArticle = async (articleId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_HOST_URL}/api/articles/${articleId}`
      );
      setArticles(articles.filter((article) => article.id !== articleId));
    } catch (error) {
      console.error(
        "Chyba při mazání článku:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    const storedLogin = localStorage.getItem("isLoggedIn");
    if (storedLogin === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (password) => {
    if (password === "matej") {
      setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn", "true");
    } else {
      alert("Neplatné heslo");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
  };

  return (
    <Router>
      <div className="app-container">
        {!isLoggedIn && (
          <Login onLogin={handleLogin} handleLogout={handleLogout} />
        )}
        <h1 className="app-title">Štěpánův kult</h1>

        <Routes>
          <Route
            path="/"
            element={
              <ArticleList
                articles={articles}
                onArticleClick={handleEditArticle}
                isLoggedIn={isLoggedIn}
                handleDeleteArticle={handleDeleteArticle}
                handleAddArticle={handleAddArticle}
              />
            }
          />
          <Route
            path="/article/:id"
            element={
              <ArticleDetail
                isLoggedIn={isLoggedIn}
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
