import React from 'react';
import { withRouter } from "react-router-dom";
import * as accountService from "../services/account-service";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import clsx from 'clsx';
import { useStyles } from './ResetPasswordRequest'


const validationSchema = Yup.object().shape({
  password: Yup.string()
  .min(8, "Password must be atleast 8 characters")
  .required('Password is Required'),
  passwordConfirm: Yup.string()
    .required("Confirm your password")
    .oneOf([Yup.ref("password")], "Password does not match")
})

export function ResetPassword(props) {
  const { token } = props.match.params
  const classes = useStyles();

  const handleSubmit = async (
    { token, password}, { setFieldError }
  ) => {
    const { history } = props;
    const submitResponse = await accountService
      .resetPassword({ token, password });
      if (submitResponse.data.isSuccess) {
        history.push('/login')
      } else  {
        setFieldError('passwordConfirm', submitResponse.data.message)
      }
  }

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <h1>Reset Your Password</h1>
        
        <Formik
          initialValues={{
            token,
            password: "",
            passwordConfirm: ""
          }}
          validationSchema={validationSchema}
          onSubmit={( values, action) => {
            handleSubmit(values, action)
          }}
        >
          {({ touched, errors, values }) => (
            <Form className={classes.form}>
              <div className={classes.fieldGroup}>
                <Field
                  type='password'
                  value={values.password}
                  name='password'
                  placeholder='Password'
                  className={
                    clsx(classes.inputField, touched.password && errors.password ? classes.error : '')
                  }
                />
                <ErrorMessage
                  name='password'
                  component='div'
                  className={classes.errorMessage}
                />
              </div>
              <div className={classes.fieldGroup}>
                <Field
                  type='password'
                  value={values.passwordConfirm}
                  name='passwordConfirm'
                  placeholder='Confirm Password'
                  className={
                    clsx(classes.inputField, touched.passwordConfirm && errors.passwordConfirm ? classes.error : '')
                  }
                />
                <ErrorMessage
                  name='passwordConfirm'
                  component='div'
                  className={classes.errorMessage}
                />
              </div>
              <button
                    type='submit'
                  >
                    Submit
                  </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default withRouter(ResetPassword);