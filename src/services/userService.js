const userRepository = require('../repositories/userRepository');
const { logData } = require('../utils/loggers');

const getData = async (page, limit, proccessName) => {
    try {
        const result = await userRepository.getData(page, limit);
        logData({
            level: 'debug',
            proccessName: proccessName,
            reason: `Success retrieve: ${result.totalRecords} rows.`,
            statusCode: 200,
        });
      return result;
    } catch (error) {
        console.error(`Failed retrieve data with error: ${error.message}.`);
        throw error;
    }
};

const insertData = async (data) => {
    try {
        
    } catch (error) {
        
    }
}

module.exports = { getData, insertData };
