import axios from "axios";
import eNotificationType from "../assets/enums/eNotificationType";

const createApiClient = (useToast: any) => {
  const apiClient = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const handleResponseMessage = (response: any, notificationType: any) => {
    const $toast = useToast();
    switch (notificationType) {
      case eNotificationType.Success:
        $toast.open({
          message: response.message,
          type: "success",
          position: "top-right",
          duration: 3000,
        });
        break;
      case eNotificationType.Error:
        $toast.open({
          message: response?.data?.message || "An error occurred",
          type: "error",
          position: "top-right",
          duration: 3000,
        });
        break;
      default:
        throw new Error("handleResponseMessage: Notification Type not handled");
    }
  };

  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response?.data?.message) {
        handleResponseMessage(error.response, eNotificationType.Error);
      }
      return Promise.reject(error);
    }
  );

  return apiClient;
};

export default createApiClient;
