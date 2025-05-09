const menuRepository = require('../repositories/menuRepository');
const { handlePostgresError } = require('../utils/errorDbHandler');

const getData = async (page, limit ) => {
  try {
    const result = await menuRepository.getData(page, limit);
    return result;
  } catch (error) {
    throw error;
  }
};

const insertData = async (data ) => {
  try {
    const result = await menuRepository.insertData(data);
    return result;
  } catch (error) {
    const { message, httpCode } = handlePostgresError(error);
    error.message = message;
    error.httpCode = httpCode;
    throw error;
  }
};

const updateData = async (data ) => {
  try {
    const result = await menuRepository.updateData(data);
    return result;
  } catch (error) {
    const { message, httpCode } = handlePostgresError(error);
    error.message = message;
    error.httpCode = httpCode;
    throw error;
  }
};

const deleteData = async (data ) => {
  try {
    const result = await menuRepository.deleteData(data);
    return result;
  } catch (error) {
    const { message, httpCode } = handlePostgresError(error);
    error.message = message;
    error.httpCode = httpCode;
    throw error;
  }
};

module.exports = { getData, insertData, updateData, deleteData };
