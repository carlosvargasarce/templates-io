'use client';

import Button from '@/components/Button/Button';
import InputField from '@/components/InputField/InputField';
import RadioButton from '@/components/RadioButton/RadioButton';
import Title from '@/components/Title/Title';
import UserManager from '@/lib/manager/UserManager';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Page() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    question1: '1',
    question2: '1',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid =
    formData.name &&
    formData.email &&
    formData.password &&
    formData.password === formData.passwordConfirmation;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
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
      };

      const userManager = new UserManager();

      try {
        userManager.createUser(userData, answers);
        console.log('Usuario creado con éxito');
        // TODO: CREAR UN SNACKBAR MOSTRANDO ESTOS MENSAJES
        router.push('/usuarios');
        
      } catch (error) {
        console.error('Error al crear usuario:', error);
      }
    } else {
      console.error('El formulario no es válido.');
    }
  };

  return (
    <>
    <Title color="primaryColor">Crear usuario</Title>
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '20px' }}>
      <div style={{ flex: 1.5 }}>
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
      </div>
        <div style={{ flex: 1 }}>
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
        <Button
          label="Crear Cuenta"
          type="submit"
          disabled={!isFormValid}
          style={{ marginBottom: '24px', marginTop: '24px' }}
        />
      </div>
      </form>
    </>
  );
}
