'use client';

import Button from '@/components/Button/Button';
import InputField from '@/components/InputField/InputField';
import RadioButton from '@/components/RadioButton/RadioButton';
import Title from '@/components/Title/Title';
import useToast from '@/hooks/useToast';
import UserManager from '@/lib/manager/UserManager';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import logo from '../../../../public/assets/logo.png';

/**
 * Página de creación de cuenta.
 *
 * Permite a los usuarios crear una nueva cuenta proporcionando su nombre, correo electrónico,
 * contraseña y preferencias específicas mediante preguntas.
 */
export default function Page() {
  const router = useRouter();
  const { notifyError } = useToast();
  const [passwordError, setPasswordError] = useState('');

  // Estado inicial del formulario, incluyendo el manejo de preguntas condicionales.
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    question1: '1',
    question2: '1',
    interests: '',
  });

  /**
   * Actualiza el estado del formulario cuando los campos cambian.
   * @param {React.ChangeEvent<HTMLInputElement>} e - Evento del cambio en el input.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'passwordConfirmation' && value !== formData.password) {
      setPasswordError('Las contraseñas no coinciden.');
    } else {
      setPasswordError('');
    }
  };

  // Verifica si el formulario es válido antes de permitir el envío.
  const passwordsMatch = formData.password === formData.passwordConfirmation;
  const isFormValid =
    formData.name &&
    formData.email &&
    formData.password &&
    passwordsMatch &&
    formData.interests;

  /**
   * Maneja el envío del formulario para crear una nueva cuenta.
   * @param {React.FormEvent} e - Evento de envío del formulario.
   */
  /**
   * Maneja el envío del formulario para crear una nueva cuenta.
   * @param {React.FormEvent} e - Evento de envío del formulario.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      notifyError('El formulario no es válido.');
      return;
    }

    const answers = [formData.question1];
    if (formData.question1 === '2') {
      answers.push(formData.question2);
    }

    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      id: '',
      role: '',
      isEnabled: true,
      interests: formData.interests
        .split(',')
        .map((interest) => interest.trim()),
    };

    const userManager = new UserManager();

    userManager
      .createUser(userData, answers)
      .then(() => {
        router.push('/iniciar');
      })
      .catch((error) => {
        notifyError(error);
      });
  };

  return (
    <>
      <Image src={logo} alt="logo" width={215} height={162} priority />
      <Title color="primaryColor" style={{ margin: '40px 0 24px' }}>
        Crear Cuenta
      </Title>
      <form onSubmit={handleSubmit}>
        <InputField
          id="name"
          name="name"
          label="Nombre completo"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <InputField
          id="register-email"
          name="email"
          label="Correo electrónico"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <InputField
          id="register-password"
          label="Contraseña"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <InputField
          id="password-confirmation"
          name="passwordConfirmation"
          label="Confirmar Contraseña"
          type="password"
          value={formData.passwordConfirmation}
          onChange={handleChange}
          required
        />
        {/* TODO: ESTE ERROR DEBE SER POSICIONADO RELATIVAMENTE AL INPUT  */}
        {passwordError && (
          <div className="label-error">Las contraseñas no coinciden.</div>
        )}
        <div>
          <p>
            <strong>
              ¿Prefiere funciones administrativas o de usuario final?
            </strong>
          </p>
          <RadioButton
            id="question-1-1"
            name="question1"
            label="Usuario Final"
            value="1"
            checked={formData.question1 === '1'}
            onChange={handleChange}
          />
          <RadioButton
            id="question-1-2"
            name="question1"
            label="Administrativas"
            value="2"
            checked={formData.question1 === '2'}
            onChange={handleChange}
          />
        </div>
        {/* Preguntas condicionales basadas en selecciones previas del usuario. */}
        {formData.question1 === '2' && (
          <div>
            <p>
              <strong>¿Deseas gestionar usuarios o templates?</strong>
            </p>
            <RadioButton
              id="question-2-1"
              name="question2"
              label="Usuarios"
              value="1"
              checked={formData.question2 === '1'}
              onChange={handleChange}
            />
            <RadioButton
              id="question-2-2"
              name="question2"
              label="Templates"
              value="2"
              checked={formData.question2 === '2'}
              onChange={handleChange}
            />
          </div>
        )}
        {formData.question1 === '1' && (
          <InputField
            id="interests"
            label="Intereses"
            name="interests"
            type="text"
            value={formData.interests}
            onChange={handleChange}
            required
          />
        )}
        <Button
          label="Crear Cuenta"
          type="submit"
          disabled={!isFormValid}
          style={{ marginBottom: '24px' }}
        />
        <p>
          Si ya tienes cuenta{' '}
          <Link href="/iniciar" className="link">
            Inicia sesión
          </Link>
        </p>
      </form>
    </>
  );
}
