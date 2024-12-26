import { notificationSocket } from "../components/layout/AuthLayout"

const useNotificationSocket = () => {

    const registerUser = (userId) => {
        notificationSocket.emit("registerUser", userId);
    }

    return { registerUser };
}

export default useNotificationSocket;