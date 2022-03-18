import { notification } from 'antd';

export const NotificationSuccessCenter = (title, message) => {
    notification.success({
        message: title,
        description: message,
        placement: 'center',
    });
};

export const NotificationSuccess = (title, message) => {
    notification.success({
        message: title,
        description: message,
        placement: 'topRight',
    });
};

export const NotificationError = (title, message) => {
    notification.destroy()
    notification.error({
        message: title,
        description: message,
        placement: 'topRight',
    });
};
