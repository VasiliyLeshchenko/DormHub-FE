import {APARTMENTS, EQUIPMENTS, SEARCH} from "../constants/UrlConstants";
import api from "../config/axiosConfig";


export default class ApartmentService {

    static async getById(id) {
        const response = await api.get(APARTMENTS + `/${id}`);
        return response.data;
    }

    static async search(data, dormId, isFree=false) {
        const response = await api.post(APARTMENTS + SEARCH,
            data,
                {
                params: {
                    dormId: dormId,
                    isFree: isFree
                }
            }
        );

        return response.data;
    }

    static async save(data) {
        const response = await api.post(APARTMENTS, data);
        return response.data.id;
    }

    static async deleteById(id) {
        await api.delete(APARTMENTS + `/${id}`);
    }

    static async updateById(id, form) {
        await api.put(APARTMENTS + `/${id}`, form)
    }

    static async getEquipments(data, apartment) {
        const response = await api.post(APARTMENTS + `/${apartment}` + EQUIPMENTS, data);

        return response.data;
    }
}