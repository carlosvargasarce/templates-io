'use client';

import Button from '@/components/Button/Button';
import InputField from '@/components/InputField/InputField';
import Title from '@/components/Title/Title';
import useToast from '@/hooks/useToast';
import { AuthService } from '@/lib/storage/authService';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { FormEvent, useState } from 'react';
import logo from '../../../../public/assets/logo.png';

/**
 * Página de inicio de sesión.
 *
 * Este componente permite a los usuarios iniciar sesión utilizando su correo electrónico y contraseña.
 * Utiliza AuthService para la autenticación, useRouter para la navegación, y useToast para las notificaciones.
 */
export default function Page() {
  // Hooks para servicios y estado de navegación.
  const authService = new AuthService();
  const router = useRouter();
  const { notifyError } = useToast();

  // Estado local para gestionar los datos del formulario de inicio de sesión.
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  /**
   * Maneja el cambio en los campos del formulario actualizando el estado local.
   * @param {React.ChangeEvent<HTMLInputElement>} e - El evento del campo de formulario que cambió.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Maneja el envío del formulario de inicio de sesión.
   *
   * Valida los datos del formulario, intenta iniciar sesión a través de AuthService,
   * y navega a la página principal en caso de éxito o muestra un error en caso contrario.
   * @param {FormEvent} event - El evento de envío del formulario.
   */
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (isFormValid) {
      //TODO: Hacer esto una promesa para manejar diferentes mensajes
      const isValidLogin = authService.login(formData.email, formData.password);

      if (isValidLogin) {
        router.push('/');
      } else {
        notifyError(
          'Las credenciales proporcionadas son incorrectas o el usuario esta deshabilitado.'
        );
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
      </form>
    </>
  );
}
