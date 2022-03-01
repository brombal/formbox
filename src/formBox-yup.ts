import { AnySchema, ValidationError } from 'yup';
import set from 'just-safe-set';
import get from 'just-safe-get';

export const createYupValidator = (schema: AnySchema) => {
  return async (values: any) => {
    try {
      await schema.validate(values, { context: values, abortEarly: false });
      return null;
    } catch (err: any) {
      return yupErrorToObject(err);
    }
  };
};

function yupErrorToObject(yupError: ValidationError): object {
  const errors: any = {};

  if (yupError.inner) {
    if (yupError.inner.length === 0) {
      set(errors, yupError.path!, yupError.message);
      return errors;
    }

    for (const err of yupError.inner) {
      if (!get(errors, err.path!)) {
        set(errors, err.path!, err.message);
      }
    }
  }

  return errors;
}
