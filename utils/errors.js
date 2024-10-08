const errorCode = {
    ok:200,
    invalidData: 400,
    accessDenied: 403,
    idNotFound: 404,
    defaultError: 500,
    conflict: 409,
    unauthorized: 401,
};

const errorMessage = {
    invalidData: "Invalid data provided",
    invalidEmail: 'Invalid email format',
    idNotFound: "Requested resource not found",
    defaultError: "An error has occurred on the server",
    validationError: "Validation failed",
    requiredEmailAndPassword: 'The email and password fields are required',
    incorrectEmailOrPassword: 'Incorrect email or password',
    authorizationRequired:"Authorization required",
    existEmail: 'Email already exist',
    messageAccessDeniedError: 'Access denied',
};

module.exports = { errorCode, errorMessage };