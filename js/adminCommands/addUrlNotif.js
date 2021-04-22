import queryData from "../helper/query.js";

function notifUrl(message, url) {
    queryData(`UPDATE configuration SET value="${url}" WHERE id=7 LIMIT 1`);

    message.channel.send('Notification has been updated!');
}

export default notifUrl;