import {BRIEF, DORMS, SEARCH} from "../constants/UrlConstants";
import api from "../config/axiosConfig";


export default class DormService {

    static async getBriefAll() {
        const response = await api.get(DORMS + BRIEF)
        return response.data;
    }

    static async getById(id) {
        const response = await api.get(DORMS + `/${id}`);
        return response.data;
    }

    static async search(data) {
        const response = await api.post(DORMS + SEARCH, data)
        return response.data;
    }

    static async save(data) {
        const response = await api.post(DORMS, data);
        return response.data.id;
    }

    static async deleteById(id) {
        await api.delete(DORMS + `/${id}`);
    }

    static async updateById(id, form) {
        await api.put(DORMS + `/${id}`, form)

    }
}