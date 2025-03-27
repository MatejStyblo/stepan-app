import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TextEditor from "./TextEditor";
import axios from "axios";

const ArticleDetail = ({ articles, onArticleClick, isLoggedIn }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const article = articles.find((article) => article.id === parseInt(id));

  const [editedArticle, setEditedArticle] = useState(article || {});
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  useEffect(() => {
    if (article) {
      setEditedArticle(article);
    }
  }, [article]);

  if (!article) {
    return <div>Článek nebyl nalezen.</div>;
  }

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };
  const handleDeleteImage = async () => {
    const updatedArticle = { ...editedArticle, imageUrl: "" };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_HOST_URL}/api/articles/${editedArticle.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedArticle),
        }
      );

      if (!response.ok) throw new Error("Chyba při mazání obrázku");

      const updatedData = await response.json();
      setEditedArticle(updatedData);
      window.location.reload();
    } catch (error) {
      console.error("Chyba:", error);
    }
  };

  const handleSaveClick = async (event) => {
    event.preventDefault();

    let imageUrl = editedArticle.imageUrl;

    // Nahrání obrázku, pokud byl vybrán
    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_HOST_URL}/api/upload`,
          formData
        );
        const data = response.data; // axios automaticky přetváří JSON na objekt
        imageUrl = data.imageUrl;
      } catch (error) {
        console.error("Chyba při nahrávání obrázku:", error);
      }
    }

    // Aktualizace článku
    const updatedArticle = { ...editedArticle, imageUrl };
    setEditedArticle(updatedArticle);

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_HOST_URL}/api/articles/${article.id}`,
        updatedArticle,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        onArticleClick(updatedArticle);
        setIsEditing(false);
      } else {
        console.error("Chyba při ukládání článku");
      }
    } catch (error) {
      console.error("Chyba při ukládání článku:", error);
    }
  };
  const imageUrl = `${process.env.REACT_APP_HOST_URL}${editedArticle.imageUrl}`;

  return (
    <div className="article-detail">
      <p className="article-detail-date">{article.createdAt}</p>
      <h2>{article.title}</h2>
      <h3>{article.organizer}</h3>

      {isEditing && (
        <div>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {editedArticle.imageUrl && (
            <button onClick={() => handleDeleteImage()}>Smazat obrázek</button>
          )}
        </div>
      )}

      {editedArticle.imageUrl && <img src={imageUrl} alt="Náhled článku" />}

      <TextEditor
        value={editedArticle.summary}
        onChange={(summary) =>
          setEditedArticle((prev) => ({ ...prev, summary }))
        }
        handleSaveClick={handleSaveClick}
        isEditing={isEditing}
      />
      {!isEditing && isLoggedIn && (
        <button onClick={handleEditClick}>Editovat</button>
      )}
      <button onClick={() => navigate("/")}>Zpět na seznam</button>
    </div>
  );
};

export default ArticleDetail;
