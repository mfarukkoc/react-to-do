import React, { useState, useContext } from 'react';
import ToDoItem from './ToDoItem';
import AddItem from './AddItem';
import { FirebaseContext } from '../../Firebase';
import './style.css';
function ToDoList() {
  const firebase = useContext(FirebaseContext);
  const [filter, setFilter] = useState('all');

  const [todos, setTodos] = useState([]);
  const [error, setError] = useState('');
  React.useEffect(() => {
    try {
      const uid = firebase.auth.currentUser.uid;
      return firebase.db
        .collection('users')
        .doc(uid)
        .collection('todos')
        .onSnapshot((snapshot) => {
          const todosData = [];
          snapshot.forEach((doc) =>
            todosData.push({ id: doc.id, data: doc.data() })
          );
          setTodos(todosData);
        });
    } catch (e) {
      setError('Error fetching user data');
    }
  }, [firebase]);

  if (error !== '') return <div>An errorr ocurred</div>;
  else
    return (
      <div className="App">
        <AddItem />
        <div className="item-categories">
          <div
            className={
              filter === 'all' ? 'category category-active' : 'category'
            }
            onClick={(e) => {
              setFilter('all');
            }}
          >
            All
          </div>
          <div
            className={
              filter === 'unfinished' ? 'category category-active' : 'category'
            }
            onClick={(e) => setFilter('unfinished')}
          >
            Unfinished
          </div>
          <div
            className={
              filter === 'finished' ? 'category category-active' : 'category'
            }
            onClick={(e) => setFilter('finished')}
          >
            Finished
          </div>
        </div>
        {todos
          .sort((b, a) => {
            a = new Date(a.data.createdAt);
            b = new Date(b.data.createdAt);
            return a > b ? -1 : a < b ? 1 : 0;
          })
          .map((todo) => {
            if (
              (!todo.data.completed && filter !== 'finished') ||
              (todo.data.completed && filter !== 'unfinished')
            ) {
              return <ToDoItem key={todo.id} todo={todo}></ToDoItem>;
            }
            return;
          })}
      </div>
    );
}

export default ToDoList;
