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
  {
    id: 1,
    label: "Trending",
    icon: "🔥",
    colour: "#FF4C4C",
    checked: false,
    examples: ["Viral", "Buzz", "Hype"], // One-word examples for Trending
  },
  {
    id: 2,
    label: "Dating",
    icon: "❤️",
    colour: "#FF69B4",
    checked: false,
    examples: ["Romance", "Crush", "Connection"], // One-word examples for Dating
  },
  {
    id: 3,
    label: "Event",
    icon: "📅",
    colour: "#1E90FF",
    checked: false,
    examples: ["Concert", "Festival", "Party"], // One-word examples for Event
  },
  {
    id: 4,
    label: "Discussion",
    icon: "💬",
    colour: "#32CD32",
    checked: false,
    examples: ["Debate", "Talk", "Chat"], // One-word examples for Discussion
  },
  {
    id: 5,
    label: "Deals",
    icon: "🛍️",
    colour: "#FFD700",
    checked: false,
    examples: ["Savings", "Discount", "Offer"], // One-word examples for Deals
  },
  {
    id: 6,
    label: "Recommendations",
    icon: "🏡",
    colour: "#8A2BE2",
    checked: false,
    examples: ["Advice", "Tips", "Suggestions"], // One-word examples for Recommendations
  },
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
  Me = "Me",
  Messages = "Messages",
  Home = "Home",
  Map = "Map",
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
  LogoColour = "#0a74da",
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
