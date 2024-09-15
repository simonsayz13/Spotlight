export const TopNavigationHomeButtons = [
  { id: 1, label: "Follow", clicked: false },
  { id: 2, label: "Explore", clicked: true },
  { id: 3, label: "Nearby", clicked: false },
];

export const userContentSelectorButtons = [
  { id: 1, label: "Posts", clicked: true },
  { id: 2, label: "Favourites", clicked: false },
  { id: 3, label: "Liked", clicked: false },
];

export enum HomeStackScreens {
  Home = "home",
  Post = "post",
}

export enum ProfileStackScreens {
  Login = "login",
  Register = "register",
  Profile = "profile",
  LoginSignUp = "loginsignup",
}

export enum MessagingStackScreens {
  Contacts = "contacts",
  Chat = "chat",
}

export enum ThemeColours {
  PrimaryColour = "#ef6e6e",
  SecondaryColour = "#ffffff",
  ThirdColour = "#feea00",
}
