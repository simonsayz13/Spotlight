import { View } from "react-native";
import CommentCard from "./CommentCard";

const CommentSection = ({ commentData }: any) => {
  return (
    <View>
      {commentData.map((comment: any) => (
        <CommentCard key={comment.id} commentData={comment} />
      ))}
    </View>
  );
};

export default CommentSection;
