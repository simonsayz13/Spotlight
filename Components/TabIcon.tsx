import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
// IconTab supports different libraries
const IconTab = ({
  iconName,
  iconLibrary,
  size = 22,
  colour = "black",
}: any) => {
  const IconComponent = (() => {
    switch (iconLibrary) {
      case "AntDesign":
        return AntDesign;
      case "FontAwesome":
        return FontAwesome;
      case "Ionicons":
        return Ionicons;
      default:
        return MaterialCommunityIcons; // Fallback
    }
  })();

  return <IconComponent name={iconName} size={size} color={colour} />;
};

export default IconTab;
