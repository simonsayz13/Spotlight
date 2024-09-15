import App from "./FirebaseApp";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { clearUser, setUser } from "../Redux/Slices/userSlice";
import store from "../Redux/store";

const auth = getAuth(App);

export const signUpWithEmail = async (
  email: string,
  username: string,
  password: string
) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        await updateProfile(auth.currentUser!, { displayName: username }).then(
          () => {
            const userData = {
              userId: auth.currentUser?.uid,
              displayName: auth.currentUser?.displayName,
              profileURL: auth.currentUser?.photoURL,
            };
            store.dispatch(setUser(userData));
          }
        );
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`Error ${errorCode}: ${errorMessage}`);
        // ..
      });
  } catch (error) {
    console.log(`signUpWithEmail Error: ${error}`);
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up
      const user = userCredential.user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(`Error ${errorCode}: ${errorMessage}`);
    });
};

export const logOut = async () => {
  try {
    await signOut(auth).then(() => {
      console.log("signed out");
      store.dispatch(clearUser());
    });
  } catch (error) {
    console.log(`signUpWithEmail Error: ${error}`);
  }
};
