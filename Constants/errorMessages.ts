export type AuthErrorCode =
  | "auth/invalid-email"
  | "auth/invalid-credential"
  | "auth/missing-password"
  | "auth/weak-password";

export const FireBaseAuthErrorMessages: Record<AuthErrorCode, string> = {
  "auth/invalid-email":
    "The email address you entered is invalid. Please enter a valid email address.",
  "auth/invalid-credential":
    "The password you have entered is incorrect. Please check your password and try again.",
  "auth/missing-password":
    "The password cannot be blank. Please check your password and try again.",
  "auth/weak-password":
    "The password need to have at least 6 characters. Please check your password and try again",
};
