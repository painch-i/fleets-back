import { useEffect, useState } from 'react';

type FormField = {
  initialValue: unknown;
  onValidation?: (value: unknown) => boolean;
  errorLabel?: string;
};

type FormControl<T> = {
  [key in keyof T]: FormField;
};

type FormData<T> = {
  [key in keyof T]: any;
};

function formatForm<T extends FormData<T>>(initialValues: FormControl<T>): T {
  const newForm: FormData<T> = {} as FormData<T>;
  Object.keys(initialValues).forEach((fieldName: string) => {
    newForm[fieldName as keyof T] =
      initialValues[fieldName as keyof T].initialValue;
  });
  return newForm;
}

function computed<T>(callback: () => T): T {
  return callback();
}

type FormReturn<T> = {
  /** An object containing validation errors for form fields. */
  errors: any;
  /** The current form data. */
  form: T;
  /** Boolean indicating whether the form is empty. */
  isEmpty: boolean;
  /** Boolean indicating whether the form is valid (all fields are filled). */
  isValid: boolean;
  /** Function to update a form field value. */
  onFormUpdate: (name: string, value: unknown) => void;
  /** Function to set an error for a form field. */
  onRequestError: (name: string, error: string) => void;
};

/**
 * A custom hook for managing form state.
 *
 * @param {FormControl<T>} initialValues - Initial values for form fields.
 * @returns {FormReturn<T>} {@link FormReturn} - Object containing form data and state, including validation errors and update functions.
 */
export function useForm<T extends FormData<T>>(
  initialValues: FormControl<T>,
): FormReturn<T> {
  const [form, setForm] = useState<T>(formatForm<T>(initialValues));
  const [errors, setErrors] = useState<any>({});

  const isEmpty: boolean = computed<boolean>(() => {
    return Object.keys(form)
      .map(
        (key: string) =>
          form[key as keyof T] !== initialValues[key as keyof T].initialValue,
      )
      .some((condition) => !condition);
  });

  const onFormUpdate = (name: string, value: unknown) => {
    setForm((previousForm: T) => ({
      ...previousForm,
      [name]: value,
    }));

    const formControl = initialValues[name as keyof T];

    if (!formControl.onValidation) return;
    if (!formControl.onValidation(value)) {
      setErrors((previousErrors: any) => ({
        ...previousErrors,
        [name]: formControl?.errorLabel,
      }));
    }
  };

  const onRequestError = (name: string, error: string) => {
    setErrors((previousError: any) => ({
      ...previousError,
      [name]: error,
    }));
  };

  const isValid = Object.values(form).every(
    (value) => value !== null && value !== undefined && value !== '',
  );

  /* A chaque fois qu'on modifie le formulaire après une erreur, on clear l'erreur */
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setErrors({});
    }
  }, [form]);

  return { form, errors, onFormUpdate, onRequestError, isEmpty, isValid };
}
