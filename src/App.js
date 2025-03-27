import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./Login";
import ArticleList from "./ArticleList";
import ArticleDetail from "./ArticleDetail";
import { IoIosLogOut } from "react-icons/io";

function App() {
  const [articles, setArticles] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

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
          createdAt: "",
          whatIsThat: "Co to je",
          organizer: "Pořadatel",
          content: "Obsah článku",
          summary: "Vše",
          imageUrl: "",
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
    if (token) fetchArticles();
  }, [token]);

  const handleLogin = async (password) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_HOST_URL}/api/login`,
        {
          password,
        }
      );
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
    } catch (error) {
      console.error(
        "Chyba při přihlašování:",
        error.response?.data || error.message
      );
      alert("Špatné přihlašovací údaje");
    }
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
  };

  return (
    <Router>
      <div className="app-container">
        {token && (
          <button className="logout" onClick={handleLogout}>
            <div className="sign">
              <span>
                <IoIosLogOut />
              </span>
            </div>

            <div className="text">Odhlášení</div>
          </button>
        )}
        <h1 className="app-title">Studentské spolky na UPCE</h1>
        <Routes>
          <Route
            path="/login"
            element={
              <Login
                onLogin={handleLogin}
                onLogout={handleLogout}
                isLoggedIn={token}
              />
            }
          />
          <Route
            path="/"
            element={
              <ArticleList
                articles={articles}
                onArticleClick={handleEditArticle}
                isLoggedIn={token}
                handleDeleteArticle={handleDeleteArticle}
                handleAddArticle={handleAddArticle}
              />
            }
          />
          <Route
            path="/article/:id"
            element={
              <ArticleDetail
                isLoggedIn={token}
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
