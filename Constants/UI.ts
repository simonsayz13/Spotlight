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
  EditProfile = "editprofile",
  FollowerList = "followerList",
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
