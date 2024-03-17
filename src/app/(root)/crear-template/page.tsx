'use client';

import Button from '@/components/Button/Button';
import InputField from '@/components/InputField/InputField';
import Select from '@/components/Select/Select';
import Title from '@/components/Title/Title';
import useToast from '@/hooks/useToast';
import TemplateManager from '@/lib/manager/TemplateManager';
import EditorJs from '@editorjs/editorjs';
import Embed from '@editorjs/embed';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import SimpleImage from '@editorjs/simple-image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import styles from './page.module.scss';

/**
 * Página de creación de template.
 *
 * Permite a los clientes crear un nuevo template proporcionando su nombre, descripción,
 * palabras clave, entre otros.
 */

export default function Page() {
  const editorRef = useRef<EditorJs | null>(null);
  const router = useRouter();
  const { notifyError } = useToast();

  const categories = [
    { id: 'Privado', name: 'Privado' },
    { id: 'Público', name: 'Público' },
    { id: 'Para Revisión', name: 'Para Revisión' },
  ];

  useEffect(() => {
    if (typeof window !== 'undefined' && !editorRef.current) {
      const EditorJS = require('@editorjs/editorjs').default;
      editorRef.current = new EditorJS({
        holder: 'editorjs',
        placeholder:
          'Empezemos a crear un asombroso template, usa nombres entre llaves para utilizar como espacios dinámicos, por ejemplo: Mi nombre es {{Nombre Completo}}',
        tools: {
          simpleImage: SimpleImage,
          embed: Embed,
          header: Header,
          list: List,
        },
      });

      return () => {
        if (
          editorRef.current &&
          typeof editorRef.current.destroy === 'function'
        ) {
          editorRef.current.destroy();
        }
      };
    }
  }, []);

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
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Verifica si el formulario es válido antes de permitir el envío.
  const isFormValid =
    formData.name &&
    formData.description &&
    formData.keywords &&
    formData.category;

  /**
   * Maneja el envío del formulario para crear una nueva cuenta.
   * @param {React.FormEvent} e - Evento de envío del formulario.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      notifyError('El formulario no es válido.');
      return;
    }

    let templateData = {
      name: formData.name,
      description: formData.description,
      keywords: formData.keywords.split(',').map((keyword) => keyword.trim()),
      category: formData.category,
      text: '',
      id: '',
      isReviewed: formData.category === 'Para Revisión' ? false : true,
    };

    if (editorRef.current) {
      try {
        const outputData = await editorRef.current.save();
        templateData.text = JSON.stringify(outputData);
      } catch (error) {
        notifyError(`Error al guardar el contenido del editor: ${error}`);
        return;
      }
    }

    const templateManager = new TemplateManager();

    try {
      templateManager.createTemplate(templateData);
      router.push('/templates');
    } catch (error) {
      notifyError(`Error al crear template: ${error}`);
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
          <Select
            id="category"
            name="category"
            label="Categoría"
            items={categories}
            value={formData.category}
            onChange={handleChange}
            required
            defaultOptionMessage="Seleccione una categoría"
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
        <div className={styles.formControlLong}>
          <p className={styles.editorLabel}>Texto:</p>
          <div className={styles.editor} id="editorjs" />
        </div>
        <div className={styles.formControlLong}>
          <Link href="/templates">
            <Button
              label="Cancelar"
              style={{
                borderColor: '#00a96c',
                color: '#00a96c',
                marginBottom: '24px',
                marginTop: '24px',
              }}
              bgColor="whiteColor"
            />
          </Link>
          <Button
            label="Crear Template"
            type="submit"
            disabled={!isFormValid}
            style={{ marginBottom: '24px', marginTop: '24px', float: 'right' }}
          />
        </div>
      </form>
    </>
  );
}
