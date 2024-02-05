import React, {FC, useEffect, useState} from 'react';
import './LoginModalForm.scss';
import '../UIComponents/popUpForm.scss';
import CustomInput from "../UIComponents/CustomInput/CustomInput";
import axios from "axios";
import User from "../../classes/User";
import TypeUser from "../../types/TypeUser";

interface LoginModalFormProps {
  showLoginModalForm: boolean,
  setShowLoginModalForm: React.Dispatch<React.SetStateAction<boolean>>,
  setUser: React.Dispatch<React.SetStateAction<TypeUser | null>>,
}

type TypeErrorLoginForm = { login: boolean, password: boolean }

const LoginModalForm: FC<LoginModalFormProps> = ({showLoginModalForm, setUser, setShowLoginModalForm}) => {
  const [loginFormData, setLoginFormData] = useState<{ login: string, password: string }>({
    login: '',
    password: '',
  });

  const [errorLoginForm, setErrorLoginForm] = useState<TypeErrorLoginForm>({
    login: true,
    password: true,
  });

  const validateLogin: RegExp = /^[a-zA-Z0-9]+$/;
  const validatePassword: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  useEffect(() => {
    if (loginFormData.login.length > 5 && validateLogin.test(loginFormData.login)) {
      setErrorLoginForm((prevState: TypeErrorLoginForm) => ({
        ...prevState,
        login: false,
      }));
    } else {
      setErrorLoginForm((prevState: TypeErrorLoginForm) => ({
        ...prevState,
        login: true,
      }));
    }
  }, [loginFormData.login]);

  useEffect(() => {
    if (validatePassword.test(loginFormData.password)) {
      setErrorLoginForm((prevState: TypeErrorLoginForm) => ({
        ...prevState,
        password: false,
      }));
    } else {
      setErrorLoginForm((prevState: TypeErrorLoginForm) => ({
        ...prevState,
        password: true,
      }));
    }
  }, [loginFormData.password]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown as unknown as EventListener);

    return () => {
      document.removeEventListener("keydown", handleKeyDown as unknown as EventListener);
    };
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent): void => {
    if (event.code === 'Escape') {
      setShowLoginModalForm(false);
    } else if (event.code === 'Enter') {
      login();
    }
  };

  const validateFields = (): boolean => {
    return Object.values(errorLoginForm).every(value => !value);
  }

  const clearForm = () => {
    setLoginFormData({
      login: '',
      password: '',
    });
  };

  const login = async () => {
    if (validateFields()) {
      try {
        const response = await axios.post('http://localhost:5000/api/v1/login', {
          login: loginFormData.login,
          password: loginFormData.password,
        });


        if (response.status === 200) {
          const user = new User(loginFormData.login, response.data.email, response.data.isAdmin);
          setUser({
            login: loginFormData.login,
            email: response.data.email,
            isAdmin: response.data.isAdmin,
          });
          setShowLoginModalForm(false);
          clearForm();
        }
      } catch (error) {
        console.error('Error submitting the login form: ', error);
      }
    }
  }

  const onSubmitLoginForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    login();
  };

  return (
    <div id="LoginModalForm" onClick={(): void => setShowLoginModalForm(false)} className="popUpForm">
      <form onSubmit={(event: React.FormEvent<HTMLFormElement>) => onSubmitLoginForm(event)}
            onClick={(event: React.MouseEvent<HTMLFormElement, MouseEvent>): void => event.stopPropagation()}>
        <h2>Авторизація</h2>
        <CustomInput isValid={!errorLoginForm.login} label={'Логін'} name={'login'} type={'text'}
                     state={loginFormData.login} setState={setLoginFormData}
                     id={'loginInput'}/>
        <CustomInput isValid={!errorLoginForm.password} label={'Пароль'} name={'password'} type={'password'}
                     state={loginFormData.password}
                     setState={setLoginFormData}
                     id={'passwordInput'}/>
        <button type="submit">Продовжити</button>
      </form>
    </div>
  );
};

export default LoginModalForm;