import React from "react";
import s from "styles/authentication.module.scss";
import BackdropLayout from "components/Layouts/BackdropLayout";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { setUser } from "store/slices/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "hooks/redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import {
  selectSideBarIndex,
  selectSideBarItem,
} from "store/slices/sideBarSlice";

export default function Login() {
  const [error, setError] = React.useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const auth = getAuth();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };

    const email = target.email.value;
    const password = target.password.value;

    await signInWithEmailAndPassword(auth, email, password)
      .then(({ user }) => {
        dispatch(selectSideBarItem("chats"));
        dispatch(selectSideBarIndex(2));
        if (user.email && user.displayName !== null) {
          dispatch(
            setUser({
              displayName: user.displayName,
              photoURL: user.photoURL,
              email: user.email,
              id: user.uid,
            })
          );
        }
        navigate("/");
      })
      .catch(() => {
        setError(true);
      });
  };

  return (
    <BackdropLayout>
      <div className={s.formWrapper}>
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>
          <div className={s.inputWrapper}>
            <FontAwesomeIcon icon={faEnvelope} />
            <input type="text" name="email" required />
            <span>Email</span>
          </div>
          <div className={s.inputWrapper}>
            <FontAwesomeIcon icon={faLock} />
            <input type="password" name="password" required />
            <span>Password</span>
          </div>

          <button className="button" type="submit">
            Sing in
          </button>
          {error && (
            <p className={s.error}>
              <FontAwesomeIcon icon={faTriangleExclamation} /> Wrong Email or
              Password
            </p>
          )}
        </form>
        <p>
          You don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </BackdropLayout>
  );
}
