export function getApiErrorMessage(error) {
  if (typeof error === 'object' && error && 'response' in error) {
    const data = error.response?.data;
    const fieldError = Array.isArray(data?.errors) ? data.errors[0] : null;

    if (fieldError?.message) {
      return fieldError.message;
    }

    return data?.message || 'Request failed';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Request failed';
}
