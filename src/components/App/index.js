import React, { useContext } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';
import Home from '../Home';
import Login from '../Login';
import SignUp from '../SignUp';
import { FirebaseContext } from '../Firebase';
const App = () => {
  return (
    <Router>
      <Switch>
        <PrivateRoute exact path="/">
          <Home />
        </PrivateRoute>

        <Route path="/login">
          <Login />
        </Route>

        <Route exact path="/signup">
          <SignUp />
        </Route>
      </Switch>
    </Router>
  );
};

function PrivateRoute({ children, ...rest }) {
  const firebase = useContext(FirebaseContext);
  try {
    const x = firebase.auth.currentUser.uid;
    return <Route {...rest} render={({ location }) => children} />;
  } catch (err) {
    return (
      <Route
        {...rest}
        render={({ location }) => (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )}
      />
    );
  }
}

export default App;
