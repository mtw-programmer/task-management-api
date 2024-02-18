export const SuccessResponse = {
  status: 201,
  description: 'Successfully registered',
  schema: {
    properties: {
      message: {
        type: 'string',
        example: 'You have been successfully registered',
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
          example: 'This username is already taken'
        },
      },
      error: {
        type: 'string',
        example: 'Bad Request',
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
