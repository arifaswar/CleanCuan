import { Alert } from "react-native";

export function handleError(error, customMessage = "An unexpected error occurred. Please Try again.") {
  console.error("Error:", error);

  if (error.response) {
    const { status, message } = error.response;
    const detailedMessage = message || "Something went wrong!";
    
    if (status === 403) {
      Alert.alert("Forbidden", detailedMessage);
    } else
    if (status === 404) {
      Alert.alert("Not Found", detailedMessage);
    } else
    if (status === 400) {
      Alert.alert("Bad Request", detailedMessage);
    } else if (status === 401) {
      Alert.alert("Unauthorized", "You need to log in again.");
    } else if (status === 500) {
      Alert.alert("Server Error", "Oops! Something is wrong on our end.");
    } else {
      Alert.alert("Error", detailedMessage);
    }
  } else {
    Alert.alert("Error", customMessage);
  }
}
