export const SuccessResponse = {
  status: 201,
  description: 'Successfully created',
  schema: {
    properties: {
      message: {
        type: 'string',
        example: 'Successfully created a new tag',
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
          example: 'title must be longer than or equal to 1 characters'
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
