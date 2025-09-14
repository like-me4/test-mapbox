import style from './Login.module.scss';
import bg from '../../assets/images/login_background.png';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from '../../hooks/store.ts';
import { loginAction } from '../../controllers/auth/actions.ts';
import { unwrapResult } from '@reduxjs/toolkit';
import { Link, useNavigate } from 'react-router';

type FormData = {
  email: string;
  password: string;
};

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: {errors},
    setError
  } = useForm<FormData>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    console.log('Form submitted:', data);
    try {
      console.log('loginAction');
      const actionResponse = await dispatch(loginAction(data));
      const response = unwrapResult(actionResponse);

      if (!response) {
        setError('root', {
          type: 'manual',
          message: 'Username or password wrong.'
        });
      } else {
        // ✅ Успішна авторизація
        console.log('Successfully logged in:', response);
        navigate('/');
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('root', {
        type: 'server',
        message: 'Something went wrong. Please try again later.'
      });
    }
  };

  return (
    <>
      <div className={style.login__modal__overlay}/>
      <div className={style.login__modal} style={{
        backgroundImage: `url(${bg})`
      }}>
        <div className={style.title}>
          Sign In
        </div>
        <div className={style.content}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={style.signup_prompt}>
              Don’t have an account? <Link to="/register">Sign up</Link>
            </div>
            <label className={style.field}>
              <span>USERNAME</span>
              <input type="text" name="email" {...register('email', {required: 'Email is required'})}/>
              {errors.email && (
                <p className={style.error}>{errors.email.message}</p>
              )}
            </label>


            <label className={style.field}>
              <span>PASSWORD</span>
              <input type="password" name="password" {...register('password', {required: 'Password is required'})}/>
              {errors.password && (
                <p className={style.error}>{errors.password.message}</p>
              )}
            </label>

            <div className={style.forgot_password}>Forgot Password?</div>
            <button type="submit">SIGN IN</button>
            {errors.root && <p className={style.error} style={{textAlign: 'center', marginTop: 20}}>{errors.root.message}</p>}

          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
