import {ROLES} from "../constants/UrlConstants";
import api from "../config/axiosConfig";

export default class UserService {
    static async getAll() {
        const response = await api.get(ROLES);
        return response.data;
    }

}