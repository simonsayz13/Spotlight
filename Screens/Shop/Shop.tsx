import { Button, StyleSheet, Text, View } from "react-native";

const ShopScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Shop</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export { ShopScreen };
