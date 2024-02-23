export const SuccessResponse = {
  status: 201,
  description: 'Successfully logged in',
  headers: {
    'Set-Cookie': {
      description: 'User session',
      schema: {
        type: 'string',
        example: 'connect.sid=s%3Aovh-Qd8vY_1jZzS--OZWMXc7nfk9dWdB.B%2Be4b5F6TRSGUFQrQUTcSw8yxg1w2bYGjaBBHbBUGHU; Path=/; HttpOnly',
      },
    },
  },
  schema: {
    properties: {
      message: {
        type: 'string',
        example: 'Successfully logged in',
      },
    },
  },
};

export const BadRequest = {
  status: 400,
  description: 'Bad Request',
  schema: {
    properties: {
      statusCode: {
        type: 'number',
        example: 400,
      },
      message: {
        type: 'array',
        items: {
          type: 'string',
          example: 'Invalid username or password'
        },
      },
      error: {
        type: 'string',
        example: 'Bad Request',
      },
    },
  },
};

export const NotFoundException = {
  status: 404,
  description: 'No user with the given username',
  schema: {
    properties: {
      statusCode: {
        type: 'number',
        example: 404,
      },
      message: {
        type: 'string',
        example: 'Not Found'
      },
    },
  },
};

export const InternalServerError = {
  status: 500,
  description: 'Internal Server Error',
  schema: {
    properties: {
      statusCode: {
        type: 'number',
        example: 500,
      },
      message: {
        type: 'string',
        example: 'Internal Server Error',
      },
    },
  }
};
