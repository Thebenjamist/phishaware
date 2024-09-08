import { Modal, View, Text, TouchableOpacity } from "react-native";
import { commonStyles as styles } from "@/assets/styles";
import React from "react";

const CustomModal = ({
  isModalVisible,
  setIsModalVisible,
  children,
  noBackground,
}: {
  isModalVisible: boolean;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
  noBackground?: boolean;
}) => (
  <Modal
    animationType="fade"
    transparent={true}
    visible={isModalVisible}
    onRequestClose={() => {
      setIsModalVisible(!isModalVisible);
    }}
  >
    <View
      style={[
        styles.modalContainer,
        noBackground && {
          backgroundColor: "rgba(0,0,0,0)",
        },
      ]}
    >
      <View style={styles.modalView}>{children}</View>
    </View>
  </Modal>
);

export default CustomModal;
