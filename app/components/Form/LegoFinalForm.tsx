import * as Sentry from '@sentry/browser';
import createFocusOnErrorDecorator from 'final-form-focus';
import { isEqual } from 'lodash';
import { useState } from 'react';
import { Form } from 'react-final-form';
import { handleSubmissionErrorFinalForm } from 'app/components/Form/utils';
import type { FormProps } from 'react-final-form';

const focusOnError = createFocusOnErrorDecorator();
interface Props<FormValues> extends FormProps<FormValues> {
  /*
   * Automatic submission error handling
   * This will add a "generic" error message to the form's FORM_ERROR value if
   * the submission fails.
   */
  enableSubmissionError?: boolean;

  /* Move the screen to the first error in the list on SubmissionError */
  enableFocusOnError?: boolean;

  /* Only validate on submit, instead of giving real-time feedback on user input */
  validateOnSubmitOnly?: boolean;
}

const LegoFinalForm = <FormValues,>({
  children,
  onSubmit,
  enableSubmissionError = true,
  enableFocusOnError = true,
  decorators = [],
  validateOnSubmitOnly = false,
  ...rest
}: Props<FormValues>) => {
  if (enableFocusOnError) {
    decorators = [focusOnError, ...decorators];
  }

  const [submitting, setSubmitting] = useState(false);

  const validate = (values) => {
    if (validateOnSubmitOnly && !submitting) {
      return {};
    } else {
      return rest.validate ? rest.validate(values) : {};
    }
  };

  return (
    <Form
      {...rest}
      validate={validate}
      initialValuesEqual={isEqual}
      decorators={decorators}
      onSubmit={(values, form) => {
        setSubmitting(true);
        const res = onSubmit(values, form);

        if (!res || !('then' in res)) {
          setSubmitting(false);
          return res;
        }

        return res
          .then((result) => {
            setSubmitting(false);
            return result;
          })
          .catch((error) => {
            setSubmitting(false);
            Sentry.captureException(error);
            if (__DEV__) console.error(error);

            if (!enableSubmissionError) {
              throw error;
            }

            return handleSubmissionErrorFinalForm(error);
          });
      }}
    >
      {children}
    </Form>
  );
};

export default LegoFinalForm;
