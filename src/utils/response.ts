export function formatResponse(
  status: number,
  message = null,
  rawData = null,
  error = null,
) {
  const response = { status, message, data: rawData };

  if (!!error) {
    response['error'] = error;
  }
  return response;
}
