import {APARTMENTS, EQUIPMENTS, SEARCH} from "../constants/UrlConstants";
import api from "../config/axiosConfig";


export default class EquipmentService {

    static async search(data, dormId) {
        const response = await api.post(EQUIPMENTS + SEARCH,
            data,
            {
                params: {
                    dormId: dormId
                }
            }
        );

        return response.data;
    }

    static async getById(id) {
        const response = await api.get(EQUIPMENTS + `/${id}`);
        return response.data;
    }

    static async save(data) {
        const response = await api.post(EQUIPMENTS, data);
        return response.data.id;
    }

    static async updateById(id, form) {
        await api.put(EQUIPMENTS + `/${id}`, form)
    }

    static async deleteById(id) {
        await api.delete(EQUIPMENTS + `/${id}`);
    }

}