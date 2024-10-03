export enum FireStoreCollections {
  Users = "users",
  Posts = "posts",
  Chats = "chats",
}

export enum FireStoreUsersField {
  DisplayName = "display_name",
  Bio = "biography",
  Gender = "gender",
  Age = "age",
  Location = "location",
  Education = "education",
}

export enum FireStorageFolder {
  UserProfile = "user_profiles",
}

export enum FireStorePostField {
  Likes = "likes",
  Favourites = "favourites",
  PostID = "postId",
}

export enum FireStoreAction {
  Add = "add",
  Remove = "remove",
  Increment = "increment",
  Decrement = "decrement",
}
