import { Modal, View, Text, TouchableOpacity } from "react-native";
import { commonStyles as styles } from "@/assets/styles";
import React from "react";

const CustomModal = ({
  isModalVisible,
  setIsModalVisible,
  children,
}: {
  isModalVisible: boolean;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}) => (
  <Modal
    animationType="fade"
    transparent={true}
    visible={isModalVisible}
    onRequestClose={() => {
      setIsModalVisible(!isModalVisible);
    }}
  >
    <View style={styles.modalContainer}>
      <View style={styles.modalView}>{children}</View>
    </View>
  </Modal>
);

export default CustomModal;
