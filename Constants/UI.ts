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

export const guestContentSelectorButtons = [
  { id: 1, label: "Posts", clicked: true },
];

export const Tags = [
  { id: 1, label: "Trending", icon: "🔥", checked: false },
  { id: 2, label: "Dating", icon: "❤️", checked: false },
  { id: 3, label: "Event", icon: "📅", checked: false },
  { id: 4, label: "Discussion", icon: "💬", checked: false },
  { id: 5, label: "Deals", icon: "🛍️", checked: false },
  { id: 6, label: "Recommendations", icon: "🏡", checked: false },
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
  EditProfile = "editprofile",
  ViewProfile = "viewprofile",
}
export enum NavigationTabs {
  Me = "me",
  Messages = "messages",
  Contents = "contents",
  Map = "map",
}

export enum MessagingStackScreens {
  Contacts = "contacts",
  Chat = "chat",
}

export enum PostStackScreens {
  Camera = "camera",
  CreatePost = "createpost",
  ViewPhoto = "viewphoto",
}
export enum MiscStackScreens {
  PhotoBrowser = "photobrowser",
  ImageCropper = "imagecropper",
}

export enum ThemeColours {
  PrimaryColour = "#ec5050",
  SecondaryColour = "#ffffff",
  ThirdColour = "#feea00",
}

export enum ThemeColoursPrimary {
  PrimaryColour = "#ffffff",
  SecondaryColour = "#000000",
  ThirdColour = "red",
  LogoColour = "#ec5050",
  GreyColour = "#b9b9b9",
  BackgroundColour = "#f1f1f1",
  GoldColour = "#ffd700",
}

export enum LoginStatus {
  Success = "success",
  Loading = "loading",
  Failed = "failed",
}

export enum EditProfileType {
  Name = "Name",
  Bio = "Bio",
  Gender = "Gender",
  Age = "Age",
  Education = "Education",
  Location = "Location",
}

export enum Gender {
  Male = "Male",
  Female = "Female",
  Other = "Other",
}
