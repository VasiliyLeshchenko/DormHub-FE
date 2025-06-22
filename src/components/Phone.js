import React, { useState } from 'react';

function PhoneInput() {

    const [value, setValue] = useState('');

    const formatPhone = (input) => {
        const digits = input.replace(/\D/g, '').slice(0, 10);

        let result = '8 (';

        for (let i = 0; i < digits.length; i++) {
            if (i === 3) result += ') ';
            if (i === 5 || i === 7) result += '-';

            result += digits[i];
        }

        return result;
    };

    const handleChange = (e) => {
        const input = e.target.value;

        if (input.length < value.length) {
            setValue(input);
            return;
        }

        if (!input.startsWith('8')) {
            setValue('8 ');
            return;
        }

        setValue(formatPhone(input));
    };

    return (
        <input
            type="text"
            value={value}
            onChange={handleChange}
            placeholder="8 (____) __-__-__"
            maxLength={17}
            className="form-control"
        />
    );
}

export default PhoneInput;