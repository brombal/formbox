import { AnySchema, ValidationError } from "yup";
import set from "just-safe-set";
import get from "just-safe-get";

export const createYupValidator = (schema: AnySchema) => {
  return async (values: any) => {
    try {
      await schema.validate(values, { context: values, abortEarly: false });
      return null;
    } catch (err) {
      return yupToFormErrors(err);
    }
  };
};

function yupToFormErrors(yupError: ValidationError) {
  const errors: any = {};

  if (yupError.inner) {
    if (yupError.inner.length === 0) {
      return set(errors, yupError.path!, yupError.message);
    }

    for (const err of yupError.inner) {
      if (!get(errors, err.path!)) {
        set(errors, err.path!, err.message);
      }
    }
  }

  return errors;
}
