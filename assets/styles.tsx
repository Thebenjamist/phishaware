import { StatusBar, StyleSheet } from "react-native";

export const commonStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    // marginTop: StatusBar.currentHeight,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 40,
  },
  input: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 16,
    marginBottom: 20,
  },
  button: {
    width: "100%",
    padding: 15,
    backgroundColor: "#7796CB",
    borderRadius: 16,
    alignItems: "center",
  },
  buttonSpacing: {
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  link: {
    color: "#7796CB",
    fontWeight: "bold",
    padding: 8,
  },
  errorText: {
    color: "#D83148",
    marginVertical: 10,
    fontWeight: "bold",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },

  valid: {
    color: "#4AAD52",
    fontWeight: "bold",
  },

  invalid: {
    color: "#D83148",
    fontWeight: "bold",
  },

  passwordPolicy: {
    marginBottom: 20,
  },
});
