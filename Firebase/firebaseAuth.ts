import app from "./FirebaseApp";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
  getAuth,
} from "firebase/auth";
import { clearUser, setLoadingLogin, setUser } from "../Redux/Slices/userSlice";
import store from "../Redux/store";
import { LoginStatus } from "../Constants/UI";

const auth = getAuth(app);

export const signUpWithEmail = async (
  email: string,
  username: string,
  password: string
) => {
  try {
    store.dispatch(setLoadingLogin({ loginStatus: LoginStatus.Loading }));
    return await createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        return await updateProfile(auth.currentUser!, {
          displayName: username,
        }).then(() => {
          const userData = {
            userId: auth.currentUser?.uid,
            displayName: auth.currentUser?.displayName,
            profileURL: auth.currentUser?.photoURL,
          };
          store.dispatch(setUser(userData));
          store.dispatch(setLoadingLogin({ loginStatus: LoginStatus.Success }));
          return { success: true, errorMessage: null };
        });
      })
      .catch((error) => {
        store.dispatch(setLoadingLogin({ loginStatus: LoginStatus.Failed }));
        return {
          success: false,
          errorMessage: error.code,
        };
      });
  } catch (error: any) {
    return {
      success: false,
      errorMessage: "Error attempting to sign up",
    };
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    store.dispatch(setLoadingLogin({ loginStatus: LoginStatus.Loading }));
    return await signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        const userData = {
          userId: auth.currentUser?.uid,
          displayName: auth.currentUser?.displayName,
          profileURL: auth.currentUser?.photoURL,
        };
        store.dispatch(setUser(userData));
        store.dispatch(setLoadingLogin({ loginStatus: LoginStatus.Success }));
        return { success: true, errorMessage: null };
      })
      .catch((error) => {
        store.dispatch(setLoadingLogin({ loginStatus: LoginStatus.Failed }));
        return {
          success: false,
          errorMessage: error.code,
        };
      });
  } catch (error) {
    return { success: false, errorMessage: error };
  }
};

export const logOut = async () => {
  try {
    await signOut(auth).then(() => {
      store.dispatch(clearUser());
    });
  } catch (error) {
    console.log(`signUpWithEmail Error: ${error}`);
  }
};
