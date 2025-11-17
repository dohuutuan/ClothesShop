import api from "./api";

export const getProfileApi = async () => {
    const response = await api.get("/user/profile");
    return response.data.data;
}

export const sendMessageApi = async (message: { content: string }) => {
    const response = await api.post("/user/message", message);
    return response.data.data;
}
