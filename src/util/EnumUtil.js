import React from 'react';

class EnumUtil {

    static getApartmentType(type) {
        switch (type) {
            case "ROOM":
                return "Комната";
            case "BLOCK":
                return "Блок";
            case "KITCHEN":
                return "Кухня";
            case "OFFICE":
                return "Кабинет";
            case "TECHNICAL_ROOM":
                return "Техническое помещение";
            default:
                return type;
        }
    };

    static getRole(role)  {
        switch (role) {
            case "TENANT":
                return "Жилец";
            case "STAFFER":
                return "Сотрудник";
            case "ADMIN":
                return "Администратор";
            default:
                return role;
        }
    };

    static getDormType(type) {
        switch (type) {
            case "CORRIDOR":
                return "Коридорное";
            case "BLOCK":
                return "Блочное";
            case "FLAT":
                return "Квартирное";
            default:
                return type;
        }
    }

    static getOrderStatus(status) {
        switch (status) {
            case "NEW":
                return "Создана";
            case "IN_PROGRESS":
                return "Исполняется";
            case "DONE":
                return "Готово";
            case "REJECTED":
                return "Отклонена";
            default:
                return status;
        }
    }

    static getPosition(position) {
        switch (position) {
            case "DIRECTOR":
                return "Заведующий";
            case "TECHNICAL_SPECIALIST":
                return "Технический сотрудник";
            case "MENTOR":
                return "Воспитатель";
            default:
                return position || "Неизвестно";
        }
    }

    static getFaculty(faculty) {
        switch (faculty) {
            case "FAMY":
                return "ФаМИ";
            case "PSY":
                return "ПСИ";
            case "TECH":
                return "ТЕХ";
            default:
                return faculty || "Неизвестно";
        }
    }

}

export default EnumUtil;