import React, { useState, useContext } from 'react';
import { FirebaseContext } from '../../Firebase';
import CreateIcon from '@material-ui/icons/Create';
import ClearIcon from '@material-ui/icons/Clear';
function ToDoItem(props) {
  const [checked, setChecked] = useState(props.todo.data.completed);
  const [content, setContent] = useState(props.todo.data.content);
  const [editEnabled, setEditEnabled] = useState(false);

  const firebase = useContext(FirebaseContext);
  const style = {
    textDecoration: 'line-through',
  };
  if (!checked) style.textDecoration = '';

  const deleteTodo = () => {
    firebase.db
      .collection('users')
      .doc(firebase.auth.currentUser.uid)
      .collection('todos')
      .doc(props.todo.id)
      .delete();
  };
  const updateTodo = () => {
    console.log('update');
    firebase.db
      .collection('users')
      .doc(firebase.auth.currentUser.uid)
      .collection('todos')
      .doc(props.todo.id)
      .update({ content: content, completed: checked })
      .catch((err) => {
        console.log(err);
      });
  };

  // callback after state changed
  React.useEffect(() => {
    return updateTodo();
  }, [checked, content]);

  return (
    <div className="todo-item">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => {
          setChecked(!checked);
        }}
      />
      <input
        type="text"
        value={content}
        style={{ ...style }}
        readOnly={editEnabled ? '' : true}
        onChange={(e) => setContent(e.target.value)}
        onDoubleClick={() => setEditEnabled(true)}
        onBlur={() => setEditEnabled(false)}
      />

      <div className="todo-item-control">
        <div onClick={() => setEditEnabled(!editEnabled)}>
          <CreateIcon color="primary" />
        </div>
        <div onClick={deleteTodo}>
          <ClearIcon color="primary" />
        </div>
      </div>
    </div>
  );
}

export default ToDoItem;
