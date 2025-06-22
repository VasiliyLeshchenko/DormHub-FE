import {EQUIPMENT_LOCATIONS} from "../constants/UrlConstants";
import api from "../config/axiosConfig";


export default class EquipmentLocationService {


    static async getById(id) {
        const response = await api.get(EQUIPMENT_LOCATIONS + `/${id}`);
        return response.data;
    }

    static async save(data) {
        const response = await api.post(EQUIPMENT_LOCATIONS, data);
        return response.data.id;
    }

    static async updateById(id, form) {
        await api.put(EQUIPMENT_LOCATIONS + `/${id}`, form)
    }

    static async deleteById(id) {
        await api.delete(EQUIPMENT_LOCATIONS + `/${id}`);
    }

}