export const errorResponse = (error: any) => {
  return {
    message: [error.message],
    error: 'Bad Request',
    statusCode: 400,
  };
};
