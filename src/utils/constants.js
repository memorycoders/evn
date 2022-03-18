export const BASE_URL = 'https://evnfc-be.twendeesoft.com/api/';
// export const BASE_URL = 'http://10.31.150.22/api/';
export const EVN_TOKEN = "evn-token"
export const ROLE_USER = "role-user"

export const STATUS_CODE = {
    SUCCESS: 200
}

export const LOAN_STATUS = {
    WAITING: 1,
    ACCEPT: 2,
    REJECT:3
}

export const SCHEDULE_SURVER = {
    SURVER: 'SURVER',
    SET_UP: 'SET_UP',
    MAINTAIN: 'MAINTAIN',
    INCIDENT: 'INCIDENT'
}

export const FORMAT_DATE = "DD-MM-YYYY";

export const CALCULATION_UNIT = {
    PLATE: {key: "PLATE", name:"Tấm"},
    SUITE: {key:"SUITE", name: "Bộ"},
    SYSTEM: { key: "SYSTEM", name: "Hệ" }
}

export const CUSTOMER_TYPES = {
    ELECTRICAL: { key: "ELECTRICAL", name: "Ngành điện" },
    NON_ELECTRICAL: { key: "NON_ELECTRICAL", name: "Ngoài ngành điện" }
}

export const STATUS_AFTER_SALES = {
    USE_APPLY: { key: "USE_APPLY", name: "Đang áp dụng" },
    NOT_USE_APPLY: { key: "NOT_USE_APPLY", name: "Chưa áp dụng" },
    EXPIRED: { key: "EXPIRED", name: "Hết hiệu lực" }
}

export const TEMPLATES_TYPE_ID = {
    EMAIL:1,
    SMS:2,
    NOTIFICATION:3
}

// export const maskCurrency = (value, maxLength = 12, radix = ",") => {
//     const currencyRegExp = new RegExp(
//       `(\\d{1,${maxLength - 3}})(,)?(\\d{2})`,
//       "g"
//     );
//     return value.replace(currencyRegExp, (match, p1, p2, p3) =>
//       [p1, p3].join(radix)
//     );
// };
  