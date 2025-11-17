import api from "./api";
export const getProvinceListApi = async () => {
    const response = await api.get("/address/province");
    return response.data.data;
}
export const getDistrictListApi = async (provinceId: string) => {
    const response = await api.get(`/address/district/${provinceId}`);
    return response.data.data;
}
export const getWardListApi = async (districtId: string) => {
    const response = await api.get(`/address/ward/${districtId}`);
    return response.data.data;
}