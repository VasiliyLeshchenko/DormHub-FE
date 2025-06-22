import React from 'react';

class ErrorUtil {

    static getErrorMessage(error) {
        if (error.response?.data === undefined || error.response?.data === null) {
            return error.message
        } else {
            return error.response.data.message
        }
    };


}

export default ErrorUtil;