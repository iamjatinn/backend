// asyncHandler is a wrapper function used to handle errors in async Express routes
// Express does NOT automatically catch errors thrown inside async/await functions
// This wrapper ensures that any error is caught and passed to Express error middleware

const asyncHandler = (requestHandler) => {
  // Return a function in the format Express expects: (req, res, next)
  return (req, res, next) => {
    // Execute the actual async route handler
    // Promise.resolve() ensures both sync and async errors are handled
    // If the promise is rejected or an error occurs, it is caught below
    Promise.resolve(requestHandler(req, res, next))
      // Forward the error to Express's global error handler
      .catch((err) => next(err));
  };
};

export { asyncHandler };

/*
This commented version shows the traditional approach:
- Manually using try-catch inside every async route
- Sending error response directly from the route

Downside:
- Repetitive try-catch blocks in every route
- Error handling logic scattered across the codebase

The asyncHandler approach above:
- Centralizes error handling
- Keeps routes clean
- Lets global error middleware handle responses
*/

/*
const asyncHandler = (fn) => (req, res, next) => {
    try {
        await fn(req, res, next)
    } catch (error) {
        res.status(err.code || 500).json({
            success : false,
            message: err.message
        })
    }
}
*/
