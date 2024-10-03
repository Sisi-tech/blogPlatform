const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('./custom_api');

class UnauthenticatedError extends CustomAPIError {
    constructor(message) {
        super(message);
        this.statusCodes = StatusCodes.UNAUTHORIZED;
    }
}

module.exports = UnauthenticatedError;