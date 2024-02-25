'use client';

import Button from '@/components/Button/Button';
import InputField from '@/components/InputField/InputField';
import Title from '@/components/Title/Title';
import { AuthService } from '@/lib/storage/authService';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import logo from '../../../../public/assets/logo.png';

export default function Page() {
  const authService = new AuthService();
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (isFormValid) {
      const isValidLogin = authService.login(formData.email, formData.password);

      if (isValidLogin) {
        console.log('Inicio de sesión exitoso');
        router.push('/');
      } else {
        console.error('Credenciales inválidas');
      }
    } else {
      console.error('Formulario inválido');
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
