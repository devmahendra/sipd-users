const pool = require('../configs/db');
const roleRepository = require('../repositories/roleRepository');
const { handlePostgresError } = require('../utils/errorDbHandler');

const getData = async (page, limit ) => {
  try {
    const result = await roleRepository.getData(page, limit);
    return result;
  } catch (error) {
    throw error;
  }
};

const insertData = async (data ) => {
  try {
    const result = await roleRepository.insertData(data);
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
    const result = await roleRepository.updateData(data);
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
    const result = await roleRepository.deleteData(data);
    return result;
  } catch (error) {
    const { message, httpCode } = handlePostgresError(error);
    error.message = message;
    error.httpCode = httpCode;
    throw error;
  }
};

module.exports = { getData, insertData, updateData, deleteData };
