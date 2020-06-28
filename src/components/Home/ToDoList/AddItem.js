import React, { useState, useContext } from 'react';
import { FirebaseContext } from '../../Firebase';
function AddItem(props) {
  const firebase = useContext(FirebaseContext);
  const [content, setContent] = useState('');
  const addNewItem = () => {
    firebase.db
      .collection('users')
      .doc(firebase.auth.currentUser.uid)
      .collection('todos')
      .add({
        content: content,
        createdAt: new Date().toISOString(),
        completed: false,
      });
  };
  return (
    <form className="add-item">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></input>
      <button
        className="add-button"
        onClick={(e) => {
          e.preventDefault();
          setContent(content.trim());
          if (content !== '') addNewItem();
          setContent('');
        }}
      >
        Add
      </button>
    </form>
  );
}

export default AddItem;
