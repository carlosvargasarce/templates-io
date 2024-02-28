'use client';

import InputField from '@/components/InputField/InputField';
import Title from '@/components/Title/Title';
import useToast from '@/hooks/useToast';
import TemplateManager from '@/lib/manager/TemplateManager';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './page.module.scss';

/**
 * Página de creación de template.
 *
 * Permite a los clientes crear un nuevo template proporcionando su nombre, descripción,
 * palabras clave, entre otros.
 */
export default function Page() {
  const router = useRouter();
  const { notifyError } = useToast();

  // Estado inicial del formulario, incluyendo el manejo de preguntas condicionales.
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    keywords: '',
    category: '',
    text: '',
  });

  /**
   * Actualiza el estado del formulario cuando los campos cambian.
   * @param {React.ChangeEvent<HTMLInputElement>} e - Evento del cambio en el input.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Verifica si el formulario es válido antes de permitir el envío.
  const isFormValid =
    formData.name &&
    formData.description &&
    formData.keywords &&
    formData.category &&
    formData.text;

  /**
   * Maneja el envío del formulario para crear una nueva cuenta.
   * @param {React.FormEvent} e - Evento de envío del formulario.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      const templateData = {
        name: formData.name,
        description: formData.description,
        // TODO: IMPLEMENTAR UN MEJOR COMPONENTE PARA PALABRAS CLAVE QUE UN INPUT
        keywords: formData.keywords.split(',').map((keyword) => keyword.trim()),
        category: formData.category,
        text: formData.text,
        id: '',
      };

      const templateManager = new TemplateManager();

      try {
        templateManager.createTemplate(templateData);
        router.push('/templates');
      } catch (error) {
        notifyError(`Error al crear template: ${error}`);
      }
    } else {
      notifyError('El formulario no es válido.');
    }
  };

  return (
    <>
      <Title color="primaryColor">Crear template</Title>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formControl}>
          <InputField
            id="name"
            name="name"
            label="Nombre"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formControl}>
          <InputField
            id="category"
            name="category"
            label="Categoría"
            type="text"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formControlLong}>
          <InputField
            id="keywords"
            label="Palabras Clave"
            name="keywords"
            type="text"
            value={formData.keywords}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formControlLong}>
          <InputField
            id="description"
            name="description"
            label="Descripción"
            type="text"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
      </form>
    </>
  );
}
