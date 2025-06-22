import {ORDERS, SEARCH} from "../constants/UrlConstants";
import api from "../config/axiosConfig";


export default class OrderService {

    static async getById(id) {
        const response = await api.get(ORDERS + `/${id}`);
        return response.data;
    }

    static async search(data, dormId, tenantId, stafferId) {
        const response = await api.post(ORDERS + SEARCH,
            data,
                {
                params: {
                    dormId: dormId,
                    tenantId: tenantId,
                    stafferId: stafferId
                }
            }
        );

        return response.data;
    }

    static async save(data) {
        const response = await api.post(ORDERS, data);
        return response.data.id;
    }

    static async deleteById(id) {
        await api.delete(ORDERS + `/${id}`);
    }

    static async updateById(id, form) {
        await api.put(ORDERS + `/${id}`, form)
    }

}