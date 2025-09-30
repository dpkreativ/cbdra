/**
 * Maps Appwrite error codes/messages to user-friendly messages
 */
export function getUserFriendlyErrorMessage(error: unknown): string {
  // Handle null/undefined
  if (!error) {
    return "An unexpected error occurred. Please try again.";
  }

  // Extract error message
  let errorMessage = "";
  let errorCode = "";

  if (typeof error === "string") {
    errorMessage = error;
  } else if (error && typeof error === "object") {
    errorMessage = (error as { message?: string }).message || "";
    errorCode = (error as { code?: string | number }).code?.toString() || "";
  }

  const lowerMessage = errorMessage.toLowerCase();

  // Authentication Errors
  if (
    lowerMessage.includes("invalid credentials") ||
    lowerMessage.includes("invalid email or password") ||
    errorCode === "401"
  ) {
    return "The email or password you entered is incorrect. Please try again.";
  }

  if (
    lowerMessage.includes("user with the requested id could not be found") ||
    lowerMessage.includes("user not found")
  ) {
    return "No account found with this email. Please sign up first.";
  }

  if (
    lowerMessage.includes("user already exists") ||
    lowerMessage.includes("email already exists") ||
    lowerMessage.includes("already registered") ||
    errorCode === "409"
  ) {
    return "An account with this email already exists. Please log in instead.";
  }

  if (
    lowerMessage.includes("password") &&
    (lowerMessage.includes("too short") || lowerMessage.includes("minimum"))
  ) {
    return "Password must be at least 8 characters long.";
  }

  if (lowerMessage.includes("invalid email")) {
    return "Please enter a valid email address.";
  }

  // Session Errors
  if (
    lowerMessage.includes("session") &&
    (lowerMessage.includes("expired") || lowerMessage.includes("invalid"))
  ) {
    return "Your session has expired. Please log in again.";
  }

  if (lowerMessage.includes("unauthorized") || errorCode === "401") {
    return "You don't have permission to perform this action.";
  }

  // Network Errors
  if (
    lowerMessage.includes("network") ||
    lowerMessage.includes("fetch failed") ||
    lowerMessage.includes("connection")
  ) {
    return "Network error. Please check your internet connection and try again.";
  }

  if (lowerMessage.includes("timeout")) {
    return "Request timed out. Please try again.";
  }

  // Rate Limiting
  if (
    lowerMessage.includes("too many requests") ||
    lowerMessage.includes("rate limit") ||
    errorCode === "429"
  ) {
    return "Too many attempts. Please wait a moment and try again.";
  }

  // Server Errors
  if (errorCode === "500" || lowerMessage.includes("internal server error")) {
    return "Server error. Please try again in a few moments.";
  }

  if (errorCode === "503" || lowerMessage.includes("service unavailable")) {
    return "Service temporarily unavailable. Please try again later.";
  }

  // Database/Storage Errors
  if (lowerMessage.includes("document") && lowerMessage.includes("not found")) {
    return "The requested item could not be found.";
  }

  if (lowerMessage.includes("storage") || lowerMessage.includes("file")) {
    if (lowerMessage.includes("too large") || lowerMessage.includes("size")) {
      return "File is too large. Maximum size is 10MB.";
    }
    if (lowerMessage.includes("type") || lowerMessage.includes("format")) {
      return "Invalid file type. Please upload images or videos only.";
    }
    return "File upload failed. Please try again.";
  }

  // Validation Errors
  if (lowerMessage.includes("invalid") && lowerMessage.includes("format")) {
    return "Invalid format. Please check your input and try again.";
  }

  if (lowerMessage.includes("required") || lowerMessage.includes("missing")) {
    return "Please fill in all required fields.";
  }

  // Permission Errors
  if (
    lowerMessage.includes("permission") ||
    lowerMessage.includes("forbidden") ||
    errorCode === "403"
  ) {
    return "You don't have permission to access this resource.";
  }

  // Default fallback - check if message is user-friendly enough
  if (
    errorMessage &&
    errorMessage.length < 100 &&
    !errorMessage.includes("AppwriteException")
  ) {
    return errorMessage;
  }

  // Generic fallback
  return "Something went wrong. Please try again.";
}

/**
 * Extracts and formats validation errors from Zod or similar
 */
export function formatValidationErrors(
  errors: Record<string, string[]>
): string {
  const messages = Object.values(errors).flat();
  if (messages.length === 0) return "Please check your input.";
  if (messages.length === 1) return messages[0];
  return messages.join(" ");
}
