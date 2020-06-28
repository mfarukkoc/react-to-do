import React, { useContext, useState } from 'react';

import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useHistory } from 'react-router-dom';
import Alert from '@material-ui/lab/Alert';
import { FirebaseContext } from '../Firebase';
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const SignUp = () => {
  const classes = useStyles();
  const history = useHistory();
  const firebase = useContext(FirebaseContext);
  const initialForm = {
    name: '',
    email: '',
    password1: '',
    password2: '',
  };
  const [formData, setFormData] = useState(initialForm);
  const [confirmed, setConfirmed] = useState(true);
  const [error, setError] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();

    firebase.auth
      .createUserWithEmailAndPassword(formData.email, formData.password1)
      .then((usr) => {
        setFormData(initialForm);
        console.log(usr);
        firebase.db
          .collection('users')
          .doc(usr.user.uid)
          .set({ name: formData.name });
        history.push('/');
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleChange = (e) => {
    const copyForm = { ...formData };
    copyForm[e.target.name] = e.target.value;
    setFormData(copyForm);

    let disabled = false;
    Object.entries(copyForm).forEach(([key, value]) => {
      if (value.trim() === '') disabled = true;
    });
    if (e.target.name === 'password2') {
      if (formData.password1 !== e.target.value) {
        setError('Passwords must match!');
        disabled = true;
      } else setError('');
    }
    setConfirmed(disabled);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline>
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoFocus
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password1"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password1}
              onChange={handleChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password2"
              label="Password Again"
              type="password"
              id="password2"
              value={formData.password2}
              onChange={handleChange}
            />

            <Alert
              severity="error"
              style={error === '' ? { display: 'none' } : {}}
            >
              {error}
            </Alert>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={confirmed}
            >
              Sign Up
            </Button>
          </form>
        </div>
      </CssBaseline>
    </Container>
  );
};

export default SignUp;
