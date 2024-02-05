import React, {FC, useEffect, useState} from 'react';
import './RegisterModalForm.scss';
import '../UIComponents/popUpForm.scss';
import CustomInput from "../UIComponents/CustomInput/CustomInput";
import TypeRegisterFormData from "../../types/TypeRegisterFormData";
import axios from "axios";
import User from "../../classes/User";
import TypeUser from "../../types/TypeUser";

interface RegisterModalFormProps {
  showRegisterModalForm: boolean,
  setShowRegisterModalForm: React.Dispatch<React.SetStateAction<boolean>>,
  setUser: React.Dispatch<React.SetStateAction<TypeUser | null>>,
}

type TypeErrorRegisterForm = {
  login: boolean,
  email: boolean,
  password: boolean,
  password2: boolean,
}

const RegisterModalForm: FC<RegisterModalFormProps> = ({setShowRegisterModalForm,  setUser, showRegisterModalForm}) => {
  const [registerFormData, setRegisterFormData] = useState<TypeRegisterFormData>({
    login: '',
    email: '',
    password: '',
    password2: '',
  });

  const [errorRegisterForm, setErrorRegisterForm] = useState<TypeErrorRegisterForm>({
    login: true,
    email: true,
    password: true,
    password2: true,
  });

  const validateLogin: RegExp = /^[a-zA-Z0-9]+$/;
  const validateEmail: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const validatePassword: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  useEffect(() => {
    if (registerFormData.login.length > 5 && validateLogin.test(registerFormData.login)) {
      setErrorRegisterForm((prevState: TypeErrorRegisterForm) => ({
        ...prevState,
        login: false,
      }));
    } else {
      setErrorRegisterForm((prevState: TypeErrorRegisterForm) => ({
        ...prevState,
        login: true,
      }));
    }
  }, [registerFormData.login]);

  useEffect(() => {
    if (registerFormData.email.length > 5 && validateEmail.test(registerFormData.email)) {
      setErrorRegisterForm((prevState: TypeErrorRegisterForm) => ({
        ...prevState,
        email: false,
      }));
    } else {
      setErrorRegisterForm((prevState: TypeErrorRegisterForm) => ({
        ...prevState,
        email: true,
      }));
    }
  }, [registerFormData.email]);

  useEffect(() => {
    if (validatePassword.test(registerFormData.password)) {
      setErrorRegisterForm((prevState: TypeErrorRegisterForm) => ({
        ...prevState,
        password: false,
      }));
    } else {
      setErrorRegisterForm((prevState: TypeErrorRegisterForm) => ({
        ...prevState,
        password: true,
      }));
    }
  }, [registerFormData.password]);

  useEffect(() => {
    if (validatePassword.test(registerFormData.password2) && registerFormData.password2 === registerFormData.password) {
      setErrorRegisterForm((prevState: TypeErrorRegisterForm) => ({
        ...prevState,
        password2: false,
      }));
    } else {
      setErrorRegisterForm((prevState: TypeErrorRegisterForm) => ({
        ...prevState,
        password2: true,
      }));
    }
  }, [registerFormData.password2, registerFormData.password]);


  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown as unknown as EventListener);

    return () => {
      document.removeEventListener("keydown", handleKeyDown as unknown as EventListener);
    };
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent): void => {
    const isEscapeKey: boolean = event.code === 'Escape';

    if (isEscapeKey) {
      setShowRegisterModalForm(false);
    }
  };

  const validateFields = (): boolean => {
    return Object.values(errorRegisterForm).every(value => !value);
  }

  const clearForm = () => {
    setRegisterFormData({
      login: '',
      email: '',
      password: '',
      password2: '',
    });
  };

  const onSubmitRegisterForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validateFields()) {
      try {
        const response = await axios.post('http://localhost:5000/api/v1/register', {
          login: registerFormData.login,
          email: registerFormData.email,
          password: registerFormData.password,
        });

        const user = new User(registerFormData.login, registerFormData.email, false);

        if (response.status === 200) {
          setUser({
            login: registerFormData.login,
            email: registerFormData.email,
            isAdmin: false,
          });
          setShowRegisterModalForm(false);
          clearForm();
        }
      } catch (error) {
        console.error('Error submitting the registration form: ', error);
      }
    }
  }

  return (
    <div id="RegisterModalForm" onClick={(): void => setShowRegisterModalForm(false)} className="popUpForm">
      <form onSubmit={(event: React.FormEvent<HTMLFormElement>) => onSubmitRegisterForm(event)}
            onClick={(event: React.MouseEvent<HTMLFormElement, MouseEvent>): void => event.stopPropagation()}>
        <h2>Реєстрація</h2>
        <CustomInput isValid={!errorRegisterForm.login} label={'Логін'} name={'login'} type={'text'}
                     state={registerFormData.login} setState={setRegisterFormData}
                     id={'loginInput'}/>
        <CustomInput isValid={!errorRegisterForm.email} label={'Пошта'} name={'email'} type={'email'}
                     state={registerFormData.email} setState={setRegisterFormData}
                     id={'emailInput'}/>
        <CustomInput isValid={!errorRegisterForm.password} label={'Пароль'} name={'password'} type={'password'}
                     state={registerFormData.password}
                     setState={setRegisterFormData}
                     id={'passwordInput'}/>
        <CustomInput isValid={!errorRegisterForm.password2} label={'Повторіть пароль'} name={'password2'}
                     type={'password'}
                     state={registerFormData.password2}
                     setState={setRegisterFormData}
                     id={'repeatPasswordInput'}/>
        <button type="submit">Продовжити</button>
      </form>
    </div>
  );
};

export default RegisterModalForm;