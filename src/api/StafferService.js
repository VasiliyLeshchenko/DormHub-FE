import {INFO, SEARCH, STAFFERS} from "../constants/UrlConstants";
import api from "../config/axiosConfig";


export default class StafferService {

    static async getById(id) {
        const response = await api.get(STAFFERS + `/${id}`);
        return response.data;
    }

    static async getInfoById(id) {
        const response = await api.get(STAFFERS + `/${id}` + INFO);
        return response.data;
    }

    static async deleteById(id) {
        await api.delete(STAFFERS + `/${id}`);
    }

    static async save(data) {
        const response = await api.post(STAFFERS, data);
        return response.data.id;
    }

    static async search(data, dormId) {
        const response = await api.post(STAFFERS + SEARCH,
            data,
            {
                params: {
                    dormId: dormId
                }
            }
        );

        return response.data;
    }

    static async updateById(id, form) {
        await api.put(STAFFERS + `/${id}`, form)
    }
}