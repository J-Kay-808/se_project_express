const errorCode = {
    invalidData: 400,
    idNotFound: 404,
    defaultError: 500,
};

const errorMessage = {
    invalidData: "Invalid data provided",
    idNotFound: "Requested resource not found",
    defaultError: "An error has occurred on the server",
    validationError: "Validation failed",
};

module.exports = { errorCode, errorMessage };