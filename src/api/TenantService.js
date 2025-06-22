import {INFO, SEARCH, TENANTS} from "../constants/UrlConstants";
import api from "../config/axiosConfig";


export default class TenantService {

    static async getById(id) {
        const response = await api.get(TENANTS + `/${id}`);
        return response.data;
    }

    static async getInfoById(id) {
        const response = await api.get(TENANTS + `/${id}` + INFO);
        return response.data;
    }

    static async deleteById(id) {
        await api.delete(TENANTS + `/${id}`);
    }

    static async save(data) {
        const response = await api.post(TENANTS, data);
        return response.data.id;
    }

    static async search(data, dormId, apartmentId) {
        const response = await api.post(TENANTS + SEARCH,
            data,
            {
                params: {
                    dormId: dormId,
                    apartmentId: apartmentId
                }
            }
        );

        return response.data;
    }

    static async updateById(id, form) {
        await api.put(TENANTS + `/${id}`, form)
    }

}