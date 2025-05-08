const userRepository = require('../repositories/userRepository');
const { logData } = require('../utils/loggers');
const { randomPassword, hashedPassword } = require('../helpers/password');
const { handlePostgresError } = require('../utils/errorDbHandler');

const getData = async (page, limit, proccessName) => {
    try {
        const result = await userRepository.getData(page, limit);
        logData({
            level: 'debug',
            proccessName: proccessName,
            data: `Success retrieve: ${result.totalRecords} rows.`,
            httpCode: 200,
        });
        return result;
    } catch (error) {
        logData({
            level: 'error',
            proccessName: proccessName,
            data: `Failed retrieve data with error: ${error.message}.`,
            httpCode: 500,
        });
        throw error;
    }
};

const insertData = async (data, proccessName) => {
    try {
        const password = randomPassword();
        const hashedPass = await hashedPassword(password);

        const result = await userRepository.insertData({
            ...data,
            password: hashedPass,
        });
        logData({
            level: 'debug',
            proccessName: proccessName,
            data: `Success write data with id: ${result.id} at: ${result.created_at}.`,
            httpCode: 200,
        });
      return result;
    } catch (error) {
        const { message, httpCode } = handlePostgresError(error);
        logData({
            proccessName,
            data: `Error inserting user: ${message}`,
            httpCode: httpCode,
        });
        error.message = message;
        error.httpCode = httpCode;
        throw error;
    }
}

module.exports = { getData, insertData };
