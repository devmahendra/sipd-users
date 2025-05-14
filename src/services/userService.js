const pool = require('../configs/db');
const buildChangesObject = require('../helpers/changesObject');
const userRepository = require('../repositories/userRepository');
const approvalService = require('./approvalService');
const { randomPassword, hashedPassword } = require('../helpers/password');
const { handlePostgresError } = require('../utils/errorDbHandler');

const getData = async (page, limit) => {
    try {
        const result = await userRepository.getData(page, limit);
        return result;
    } catch (error) {
        throw error;
    }
};

const insertData = async (data) => {
    try {
        await pool.query('BEGIN');
        const password = randomPassword();
        const hashedPass = await hashedPassword(password);
        const roleId = data.roleId;

        const result = await userRepository.insertUser(pool, { 
            ...data,
            password: hashedPass,
        });

        await userRepository.insertUserProfile(pool, {
            ...data,
            userId: result.id,
        });

        if (roleId) {
            await userRepository.insertUserRole(pool, { userId: result.id, roleId: roleId });
        }

        if(result) {
            const changes = buildChangesObject({}, { ...data, password: hashedPass });
            await approvalService.insertApproval(pool, {
                entityType: 'users',
                entityId: result.id,
                changes,
                actionType: 'create',
                requestedBy: data.createdBy,
            });
        }
        
        await pool.query('COMMIT');
        return result;
    } catch (error) {
        const { message, httpCode } = handlePostgresError(error);
        error.message = message;
        error.httpCode = httpCode;
        throw error;
    }
}

const updateData = async (data) => {
    try {
        await pool.query('BEGIN');
        const roleId = data.roleId;
        const password = data.password;
        const hashedPass = await hashedPassword(password);

        const result = await userRepository.updateUser(pool, { 
            ...data,
            password: hashedPass,
        });

        await userRepository.updateUserProfile(pool, {
            ...data,
            userId: result.id,
        });

        if (roleId) {
            await userRepository.updateUserRole(pool, { userId: result.id, roleId: roleId });
        }
        
        await pool.query('COMMIT');
        return result;
    } catch (error) {
        const { message, httpCode } = handlePostgresError(error);
        error.message = message;
        error.httpCode = httpCode;
        throw error;
    }
}

const deleteData = async (data) => {
    try {
        const result = await userRepository.deleteData(data);
      return result;
    } catch (error) {
        const { message, httpCode } = handlePostgresError(error);
        error.message = message;
        error.httpCode = httpCode;
        throw error;
    }
}

module.exports = { getData, insertData, updateData, deleteData };
