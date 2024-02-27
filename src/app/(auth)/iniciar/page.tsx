'use client';

import Button from '@/components/Button/Button';
import InputField from '@/components/InputField/InputField';
import Title from '@/components/Title/Title';
import { AuthService } from '@/lib/storage/authService';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { FormEvent, useState } from 'react';
import { Bounce, ToastContainer, ToastPosition, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../../../../public/assets/logo.png';

export default function Page() {
  const authService = new AuthService();
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const notifyErrorOptions = {
    position: 'top-right' as ToastPosition,
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
    transition: Bounce,
  };

  const notifyError = (message: string) => {
    toast.error(message, notifyErrorOptions);
  };

  const notifySuccess = (message: string) => {
    toast.success(message, {
      className: 'toast-success',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (isFormValid) {
      const isValidLogin = authService.login(formData.email, formData.password);

      if (isValidLogin) {
        notifySuccess('Inicio de sesión exitoso');
        router.push('/');
      } else {
        notifyError('Las credenciales proporcionadas son incorrectas.');
      }
    } else {
      notifyError(
        'Por favor, asegúrate de llenar todos los campos requeridos correctamente.'
      );
    }
  };

  const isFormValid = formData.email && formData.password;

  return (
    <>
      <Image src={logo} alt="logo" width={215} height={162} priority />
      <Title color="primaryColor" style={{ margin: '40px 0 24px' }}>
        Iniciar Sesión
      </Title>
      <form onSubmit={handleSubmit}>
        <InputField
          id="login-email"
          name="email"
          label="Correo electrónico"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <InputField
          id="password"
          name="password"
          label="Password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <Button label="Iniciar Sesión" type="submit" disabled={!isFormValid} />
        <Link href="/crear-cuenta">
          <Button
            label="Crear cuenta"
            style={{
              borderColor: '#00a96c',
              marginTop: '16px',
              color: '#00a96c',
            }}
            bgColor="whiteColor"
          />
        </Link>
        <ToastContainer />{' '}
        {/* Include the ToastContainer at the end of your component */}
      </form>
    </>
  );
}
