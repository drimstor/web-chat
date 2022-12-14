import React from "react";
import s from "styles/authentication.module.scss";
import BackdropLayout from "components/Layouts/BackdropLayout";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import { setUser } from "store/slices/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "hooks/redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleDown,
  faEnvelope,
  faLock,
  faLockOpen,
  faTriangleExclamation,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

export default function Register() {
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [image, setImage] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<number | null>(null);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const db = getFirestore();
  const auth = getAuth();
  const storage = getStorage();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const target = e.target as typeof e.target & {
      displayName: { value: string };
      email: { value: string };
      password: { value: string };
      confirmPassword: { value: string };
      file: { files: any };
    };

    const displayName = target.displayName.value.toLowerCase();
    const email = target.email.value;
    const password = target.password.value;
    const confirmPassword = target.confirmPassword.value;
    const file = target.file.files[0];

    if (confirmPassword !== password) {
      setErrorMessage("Passwords do not match");
    } else {
      await createUserWithEmailAndPassword(auth, email, password)
        .then(async ({ user }) => {
          setErrorMessage("");
          // If added image
          if (image) {
            //Create a unique image name
            const date = new Date().getTime();
            const storageRef = ref(storage, `${displayName + date}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
              "state_changed",
              (snapshot) => {
                const progress =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                // console.log("Upload is " + progress + "% done");
                setLoading(0);

                switch (snapshot.state) {
                  case "paused":
                    // console.log("Upload is paused");
                    break;
                  case "running":
                    // console.log("Upload is running");
                    break;
                }
                setLoading(Math.round(progress));
              },
              (error) => {
                setErrorMessage("Something went wrong");
              },
              () => {
                // Handle successful uploads on complete
                getDownloadURL(uploadTask.snapshot.ref).then(
                  async (downloadURL) => {
                    // console.log("File available at", downloadURL);
                    try {
                      // Update profile
                      await updateProfile(user, {
                        photoURL: downloadURL,
                        displayName,
                      });
                      // Update db
                      await setDoc(doc(db, "users", user.uid), {
                        photoURL: downloadURL,
                        id: user.uid,
                        displayName,
                        email,
                      });
                      //create empty user chats on firestore
                      await setDoc(doc(db, "userChats", user.uid), {});
                      // Redux
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
                      // Redirect
                      navigate("/");
                    } catch (error) {
                      setErrorMessage("Something went wrong");
                    }
                  }
                );
              }
            );
          }
          if (!image) {
            try {
              // Update profile
              await updateProfile(user, {
                photoURL: null,
                displayName,
              });
              //create user on firestore
              await setDoc(doc(db, "users", user.uid), {
                photoURL: null,
                id: user.uid,
                displayName,
                email,
              });
              //create empty user chats on firestore
              await setDoc(doc(db, "userChats", user.uid), {});
              // Redux
              if (user.email && user.displayName) {
                dispatch(
                  setUser({
                    displayName: user.displayName,
                    photoURL: null,
                    email: user.email,
                    id: user.uid,
                  })
                );
              }
              // Redirect
              navigate("/");
            } catch (error) {
              setErrorMessage("Something went wrong");
            }
          }
        })
        .catch((error) => {
          const errorContent = error.message;
          setErrorMessage(errorContent.slice(10));
        });
    }
  };
  return (
    <BackdropLayout>
      <div className={s.formWrapper}>
        <h1>Registration</h1>
        <form onSubmit={handleSubmit}>
          <div className={s.inputWrapper}>
            <FontAwesomeIcon icon={faUser} />
            <input type="text" name="displayName" required />
            <span>Display Name</span>
          </div>
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
          <div className={s.inputWrapper}>
            <FontAwesomeIcon icon={faLockOpen} />
            <input type="password" name="confirmPassword" required />
            <span>Confirm Password</span>
          </div>

          <input
            type="file"
            id="file"
            onChange={(e) => e.target.value && setImage(true)}
            accept="image/*"
            name="file"
          />
          <label htmlFor="file">
            {image ? (
              <FontAwesomeIcon icon={faCircleCheck} />
            ) : (
              <FontAwesomeIcon icon={faCircleDown} />
            )}
            <span>{image ? "Avatar added" : "Add an avatar"}</span>
          </label>

          <button className="button" type="submit">
            Register
          </button>

          {errorMessage && (
            <p className={s.error}>
              <FontAwesomeIcon icon={faTriangleExclamation} /> {errorMessage}
            </p>
          )}

          {loading !== null && (
            <div className={s.loading}>
              <span>Loading</span>
              <div className={s.loadingBox}>
                <div
                  className={s.loadingBar}
                  style={{
                    width: `calc(${loading > 9 ? loading : 9}% - 4px)`,
                  }}
                ></div>
              </div>
            </div>
          )}
        </form>
        <p>
          You do have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </BackdropLayout>
  );
}
