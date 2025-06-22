import {INFO, SEARCH, DUTIES} from "../constants/UrlConstants";
import api from "../config/axiosConfig";


export default class DutyService {

    static async getById(id) {
        const response = await api.get(DUTIES + `/${id}`);
        return response.data;
    }

    static async getInfoById(id) {
        const response = await api.get(DUTIES + `/${id}` + INFO);
        return response.data;
    }

    static async deleteById(id) {
        await api.delete(DUTIES + `/${id}`);
    }

    static async save(data) {
        const response = await api.post(DUTIES, data);
        return response.data.id;
    }

    static async search(data, tenantId, apartmentId) {
        const response = await api.post(DUTIES + SEARCH,
            data,
            {
                params: {
                    tenantId: tenantId,
                    apartmentId: apartmentId
                }
            }
        );

        return response.data;
    }

    static async updateById(id, form) {
        await api.put(DUTIES + `/${id}`, form)
    }

}