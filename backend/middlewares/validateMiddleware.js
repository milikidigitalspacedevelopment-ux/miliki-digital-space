export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      res.status(400);
      throw new Error(error.details.map((detail) => detail.message).join(", "));
    }
    next();
  };
};
