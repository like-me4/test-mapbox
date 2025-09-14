import style from '../Login/Login.module.scss';
import styleRegister from './Register.module.scss';
import bg from '../../assets/images/login_background.png';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from '../../hooks/store.ts';
import { registerAction } from '../../controllers/auth/actions.ts';
import { unwrapResult } from '@reduxjs/toolkit';
import { useNavigate } from 'react-router';
import classNames from 'classnames';
import { useState } from 'react';

type FormData = {
  name: string;
  email: string;
  password: string;
  repeatPassword: string;
};

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<FormData>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');

  const onSubmit = async (data: FormData) => {
    if (data.password !== data.repeatPassword) {
      setError('repeatPassword', {
        type: 'manual',
        message: 'Passwords do not match'
      });
      return;
    }
    const { name, email, password } = data;
    const registerData = { name, email, password };
    try {
      const actionResponse = await dispatch(registerAction(registerData));
      const response = unwrapResult(actionResponse);

      if (!response) {
        setError('root', {
          type: 'manual',
          message: 'Registration failed.'
        });
      } else {
        setSuccessMessage('Registration successful');
        setTimeout(() => navigate('/login'), 1000);
      }
    } catch {
      setError('root', {
        type: 'server',
        message: 'Something went wrong. Please try again later.'
      });
    }
  };

  return (
    <>
      <div className={style.login__modal__overlay} />
      <div
        className={style.login__modal}
        style={{
          backgroundImage: `url(${bg})`
        }}
      >
        <div className={style.title}>Sign Up</div>
        <div className={classNames(style.content, styleRegister.content)}>
          <form onSubmit={handleSubmit(onSubmit)} className={styleRegister.form}>
            <label className={classNames(style.field, styleRegister.field)}>
              <span>NAME</span>
              <input type="text" {...register('name', { required: 'Name is required' })} />
              {errors.name && <p className={style.error}>{errors.name.message}</p>}
            </label>

            <label className={classNames(style.field, styleRegister.field)}>
              <span>EMAIL</span>
              <input type="text" {...register('email', { required: 'Email is required' })} />
              {errors.email && <p className={style.error}>{errors.email.message}</p>}
            </label>

            <label className={classNames(style.field, styleRegister.field)}>
              <span>PASSWORD</span>
              <input type="password" {...register('password', { required: 'Password is required' })} />
              {errors.password && <p className={style.error}>{errors.password.message}</p>}
            </label>

            <label className={classNames(style.field, styleRegister.field)}>
              <span>REPEAT PASSWORD</span>
              <input
                type="password"
                {...register('repeatPassword', { required: 'Repeat password is required' })}
              />
              {errors.repeatPassword && (
                <p className={style.error}>{errors.repeatPassword.message}</p>
              )}
            </label>

            <button type="submit">SIGN UP</button>
            {errors.root && (
              <p className={style.error} style={{ textAlign: 'center', marginTop: 20 }}>
                {errors.root.message}
              </p>
            )}
            {successMessage && (
              <p style={{ textAlign: 'center', marginTop: 20, color: 'green' }}>
                {successMessage}
              </p>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;

