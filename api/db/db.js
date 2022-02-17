const { Pool } = require("pg");
let connectionString =
  "postgresql://postgres:nMtq9wabHDLf48sd@34.134.36.176:5432/ml";

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    connectionString: connectionString,
    rejectUnauthorized: false,
  },
});

/**
 * DB Query
 * @param {object} req
 * @param {object} res
 * @returns {object} object
 */
function query(quertText, params) {
  return new Promise((resolve, reject) => {
    pool
      .query(quertText, params)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

module.exports = {
  query,
};
