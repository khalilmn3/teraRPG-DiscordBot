import queryData from "../helper/query.js";

function notifUrl(message, url) {
    queryData(`UPDATE configuration SET value="${url}" WHERE id=7 LIMIT 1`);
    queryData(`UPDATE notification_read SET is_read=0`);

    message.channel.send('Notification has been updated!');
}

export default notifUrl;