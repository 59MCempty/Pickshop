const asyncHandler = fn => (req, res, next) => {
    // fn(req, res, next) => promise
    Promise.resolve(fn(req, res, next)).catch(next);
 }

export default asyncHandler
