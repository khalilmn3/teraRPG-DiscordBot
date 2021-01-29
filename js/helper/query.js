import db from '../../db_config.js';
import util from 'util';

const query = util.promisify(db.query).bind(db);

async function queryData(queryText) {
    // try {
        let data = await query(queryText)
        return data;
    // } finally {
    //     db.end();
    // }
}

export default queryData;