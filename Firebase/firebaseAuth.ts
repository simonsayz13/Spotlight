import app from "./FirebaseApp";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
  getAuth,
} from "firebase/auth";
import { clearUser, createUser, updateUser } from "../Redux/Slices/userSlice";
import store from "../Redux/store";
import { getUserDetails } from "./firebaseFireStore";

const auth = getAuth(app);

export const signUpWithEmail = async (
  email: string,
  username: string,
  password: string
) => {
  try {
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
          store.dispatch(createUser(userData));
          return {
            success: true,
            errorMessage: null,
            userId: auth.currentUser?.uid,
          };
        });
      })
      .catch((error) => {
        console.log(error);
        return {
          success: false,
          errorMessage: error.code,
          userId: null,
        };
      });
  } catch (error: any) {
    return {
      success: false,
      errorMessage: "Error attempting to sign up",
      userId: null,
    };
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password)
      .then(async () => {
        const userData = await getUserDetails(auth.currentUser?.uid!);
        store.dispatch(updateUser(userData));
        return {
          success: true,
          errorMessage: null,
        };
      })
      .catch((error) => {
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
