import { useDerivedValue } from "react-native-reanimated";

export const mockExploreData = [
  {
    id: 1,
    title: "好想婆宝宝怎么办啊啊啊?",
    user: "大狗",
    likes: 520,
    image: "",
  },

  {
    id: 10,
    title: "刚刚试了一下新开的健身房",
    user: "小赵",
    likes: 322,
    image: "", // Add URL if needed
  },
  {
    id: 2,
    title: "今天天气真好啊，适合出去玩！",
    user: "小猫",
    likes: 310,
    image: "",
  },
  {
    id: 3,
    title: "昨天看了部超好看的电影",
    user: "小明",
    likes: 432,
    image: "",
  },
  {
    id: 4,
    title: "这个新的餐厅真不错，菜品特别好吃！",
    user: "小红",
    likes: 289,
    image: "",
  },
  {
    id: 5,
    title: "今天学到了很多新知识，感觉很充实！",
    user: "阿强",
    likes: 678,
    image: "",
  },
  {
    id: 6,
    title: "看到这个新闻真是太震惊了",
    user: "小李",
    likes: 254,
    image: "",
  },
  {
    id: 7,
    title: "刚刚完成了一个大项目，心情特别好！",
    user: "小张",
    likes: 514,
    image: "",
  },
];

export const mockCommentData = [
  {
    id: 1,
    profilePicture: "",
    profileId: 1,
    userName: "JohnDoe123",
    comment: "This is an interesting post! Thanks for sharing.",
    likes: 15,
    dislikes: 2,
    timeStamp: "1h",
  },
  {
    id: 2,
    profilePicture: "",
    profileId: 2,
    userName: "JaneSmith456",
    comment: "I completely agree with your points. Well said!",
    likes: 10,
    dislikes: 0,
    timeStamp: "2h",
  },
  {
    id: 3,
    profilePicture: "",
    profileId: 3,
    userName: "TechGuru99",
    comment: "Great insights! This helped me a lot.",
    likes: 8,
    dislikes: 1,
    timeStamp: "3h",
  },
  {
    id: 4,
    profilePicture: "",
    profileId: 4,
    userName: "TravelLover",
    comment:
      "I’ve had similar experiences, totally relatable! I’ve had similar experiences, totally relatable!I’ve had similar experiences, totally relatable!I’ve had similar experiences, totally relatable!I’ve had similar experiences, totally relatable!",
    likes: 20,
    dislikes: 666,
    timeStamp: "4h",
  },
  {
    id: 5,
    profilePicture: "",
    profileId: 5,
    userName: "FoodieQueen",
    comment: "This recipe is amazing! Can't wait to try it out.",
    likes: 12,
    dislikes: 0,
    timeStamp: "5h",
  },
];

export const mockContactsList = [
  {
    userId: "12412312",
    userName: "Simon",
    lastMessage: "Hello, how are you?",
    lastMessageTimeStamp: "10 Sep",
  },
  {
    userId: "12412313",
    userName: "Alice",
    lastMessage: "Hey, what’s up?",
    lastMessageTimeStamp: "9 Sep",
  },
  {
    userId: "12412314",
    userName: "John",
    lastMessage: "See you tomorrow!",
    lastMessageTimeStamp: "8 Sep",
  },
  {
    userId: "12412315",
    userName: "Emily",
    lastMessage: "I’m running late.",
    lastMessageTimeStamp: "7 Sep",
  },
  {
    userId: "12412316",
    userName: "Michael",
    lastMessage: "Let’s grab lunch.",
    lastMessageTimeStamp: "6 Sep",
  },
  {
    userId: "12412317",
    userName: "Sarah",
    lastMessage: "Can you send me the files?",
    lastMessageTimeStamp: "5 Sep",
  },
  {
    userId: "12412318",
    userName: "David",
    lastMessage: "I’ll call you later.",
    lastMessageTimeStamp: "4 Sep",
  },
  {
    userId: "12412319",
    userName: "Sophia",
    lastMessage: "Don’t forget the meeting!",
    lastMessageTimeStamp: "3 Sep",
  },
  {
    userId: "12412320",
    userName: "James",
    lastMessage: "It’s been a while!",
    lastMessageTimeStamp: "2 Sep",
  },
  {
    userId: "12412321",
    userName: "Isabella",
    lastMessage: "Happy Birthday!",
    lastMessageTimeStamp: "1 Sep",
  },
  {
    userId: "12412322",
    userName: "Liam",
    lastMessage: "Got your message, thanks.",
    lastMessageTimeStamp: "31 Aug",
  },
  {
    userId: "12412323",
    userName: "Olivia",
    lastMessage: "Let me know if you’re free.",
    lastMessageTimeStamp: "30 Aug",
  },
];

export const mockChatData = [
  {
    userId: "11",
    message: "Hello",
    messageTimeStamp: "10:00",
  },
  {
    userId: "1337",
    message: "Hey, how are you?",
    messageTimeStamp: "10:01",
  },
  {
    userId: "11",
    message: "I'm good, thanks! How about you?",
    messageTimeStamp: "10:02",
  },
  {
    userId: "1337",
    message: "Doing well, just a bit busy with work.",
    messageTimeStamp: "10:03",
  },
  {
    userId: "11",
    message: "I understand. Anything interesting going on?",
    messageTimeStamp: "10:04",
  },
  {
    userId: "1337",
    message: "Not much, just trying to meet deadlines. You?",
    messageTimeStamp: "10:05",
  },
  {
    userId: "11",
    message: "Same here. Lots of tasks piling up.",
    messageTimeStamp: "10:06",
  },
  {
    userId: "1337",
    message: "It’s that time of the year, I guess!",
    messageTimeStamp: "10:07",
  },
  {
    userId: "11",
    message: "Yeah, always hectic towards the end.",
    messageTimeStamp: "10:08",
  },
  {
    userId: "1337",
    message: "Exactly. What are you working on right now?",
    messageTimeStamp: "10:09",
  },
  {
    userId: "11",
    message: "A new project in React Native, actually.",
    messageTimeStamp: "10:10",
  },
  {
    userId: "1337",
    message: "Nice! I’ve heard good things about it.",
    messageTimeStamp: "10:11",
  },
  {
    userId: "11",
    message: "It’s pretty cool, but there’s a lot to learn.",
    messageTimeStamp: "10:12",
  },
  {
    userId: "1337",
    message: "I can imagine. Front-end frameworks are evolving fast.",
    messageTimeStamp: "10:13",
  },
  {
    userId: "11",
    message: "Exactly, sometimes hard to keep up.",
    messageTimeStamp: "10:14",
  },
  {
    userId: "1337",
    message: "Tell me about it! Any interesting challenges so far?",
    messageTimeStamp: "10:15",
  },
  {
    userId: "11",
    message: "Yeah, customizing components can be tricky.",
    messageTimeStamp: "10:16",
  },
  {
    userId: "1337",
    message: "That sounds challenging. But I’m sure you’ll figure it out!",
    messageTimeStamp: "10:17",
  },
  {
    userId: "11",
    message: "Thanks! I’ll keep pushing through.",
    messageTimeStamp: "10:18",
  },
  {
    userId: "1337",
    message: "That’s the spirit!",
    messageTimeStamp: "10:19",
  },
];

export const mockUserBio =
  "🌟 Explorer of life’s quirky corners | Coffee enthusiast ☕ | Coding wizard 💻 | Spreading good vibes and occasional memes 😄 | Always ready for an adventure 🚀 | Let’s connect and make the world a bit brighter 🌈";

export const mockUserPostsData = [
  {
    id: 1,
    title: "好想婆宝宝怎么办啊啊啊?",
    user: "大狗",
    likes: 520,
    image: "",
  },

  {
    id: 10,
    title: "刚刚试了一下新开的健身房",
    user: "小赵",
    likes: 322,
    image: "", // Add URL if needed
  },
  {
    id: 2,
    title: "今天天气真好啊，适合出去玩！",
    user: "小猫",
    likes: 310,
    image: "",
  },
];
