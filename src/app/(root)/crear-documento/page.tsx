'use client';

import Button from '@/components/Button/Button';
import InputField from '@/components/InputField/InputField';
import Select from '@/components/Select/Select';
import Title from '@/components/Title/Title';
import useToast from '@/hooks/useToast';
import DocumentManager from '@/lib/manager/DocumentManager';
import TemplateManager from '@/lib/manager/TemplateManager';
import { TemplateProps } from '@/types/template';
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
 * Página de creación de documento.
 *
 * Permite a los clientes crear un nuevo documento proporcionando su nombre, descripción,
 * palabras clave, entre otros.
 */

export default function Page() {
  const editorRef = useRef<EditorJs | null>(null);
  const router = useRouter();
  const { notifyError } = useToast();
  const [templates, setTemplates] = useState<TemplateProps[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateProps>();
  const [loader, setLoader] = useState(true);
  const templateManager = new TemplateManager();
  const [refreshDataTrigger, setRefreshDataTrigger] = useState(false);
  //Datos que se deben de rellenar del texto del template
  const [placeholderValues, setPlaceholderValues] = useState<
    Record<string, string>
  >({});

  type FormDataState = {
    name: string;
    template1: string;
    template2: string;
  };

  // Estado inicial del formulario, incluyendo el manejo de preguntas condicionales.
  const [formData, setFormData] = useState<FormDataState>({
    name: '',
    template1: '',
    template2: '',
  });

  useEffect(() => {
    const data = templateManager.getAllTemplates();

    let filteredTemplates = data;
    filteredTemplates = data.filter((template) => template.isReviewed === true);
    setTemplates(filteredTemplates);
    setLoader(false);
  }, [refreshDataTrigger]);

  useEffect(() => {
    const loadEditorData = async () => {
      if (typeof window !== 'undefined' && formData.template1) {
        const selectedTemplate = templates.find(
          (template) => formData.template1 && template.id === formData.template1
        );

        if (!selectedTemplate) return;

        setSelectedTemplate(selectedTemplate);

        const EditorJS = require('@editorjs/editorjs').default;
        if (
          editorRef.current &&
          typeof editorRef.current.destroy === 'function'
        ) {
          editorRef.current.destroy();
          editorRef.current = null;
        }

        editorRef.current = new EditorJS({
          holder: 'editorjs',
          readOnly: true,
          data: JSON.parse(selectedTemplate.text),
          tools: {
            simpleImage: SimpleImage,
            embed: Embed,
            header: Header,
            list: List,
          },
        });

        //Extraer los placeholders del texto
        const placeholders: string[] = extractPlaceholders(
          selectedTemplate.text
        ) as string[];

        //Asignarlos al state
        const initialValues = placeholders.reduce<Record<string, string>>(
          (acc, placeholder) => {
            acc[placeholder] = '';
            return acc;
          },
          {}
        );

        setPlaceholderValues(initialValues);
      }
    };

    loadEditorData();

    return () => {
      if (
        editorRef.current &&
        typeof editorRef.current.destroy === 'function'
      ) {
        editorRef.current.destroy();
      }
    };
  }, [formData.template1, templates]);

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

  /**
   * Extrae todos los marcadores de posición únicos de una plantilla de texto.
   * Los marcadores de posición están en el formato {{nombreDelMarcador}}.
   *
   * @param {string} templateText - El texto de la plantilla del cual extraer los marcadores.
   * @returns {Array} Una lista de todos los marcadores de posición únicos encontrados en la plantilla.
   */
  const extractPlaceholders = (templateText: string) => {
    const regex = /{{(.*?)}}/g;
    let match;
    const placeholders = new Set();

    while ((match = regex.exec(templateText)) !== null) {
      placeholders.add(match[1].trim());
    }

    return Array.from(placeholders);
  };

  /**
   * Maneja cambios en los campos de entrada para cada marcador de posición,
   * actualizando el estado con los valores ingresados por el usuario.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - Evento del cambio en el input.
   */
  const handlePlaceholderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPlaceholderValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  /**
   * Sustituye los marcadores de posición en el texto de la plantilla con los valores proporcionados por el usuario.
   * Los marcadores de posición están en el formato {{nombreDelMarcador}} y se reemplazan con valores correspondientes.
   *
   * @param {string} templateText - El texto de la plantilla original que contiene marcadores de posición.
   * @param {Object} values - Objeto que contiene los valores para cada marcador de posición, donde cada clave es el nombre del marcador.
   * @returns {string} El texto de la plantilla con los marcadores de posición sustituidos por los valores del usuario.
   */
  const substitutePlaceholders = (
    templateText: string,
    values: Record<string, string>
  ) => {
    let substitutedText = templateText;

    Object.entries(values).forEach(([key, value]) => {
      substitutedText = substitutedText.replace(
        new RegExp(`{{${key}}}`, 'g'),
        value
      );
    });

    return substitutedText;
  };

  // Verifica si el formulario es válido antes de permitir el envío.
  const isFormValid =
    formData.name &&
    formData.template1 &&
    Object.values(placeholderValues).every((value) => value.trim() !== '');

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
    if (!formData.template1) {
      notifyError('El texto de los templates no esta disponible.');
      return;
    }

    let documentData = {
      name: formData.name,
      templates: [formData.template1, formData.template2].filter(
        (templateId) => templateId !== ''
      ),
      content: substitutePlaceholders(
        selectedTemplate ? selectedTemplate.text : '',
        placeholderValues
      ),
      id: '',
    };

    const documentManager = new DocumentManager();

    try {
      documentManager.createDocument(documentData);
      router.push('/documentos');
    } catch (error) {
      notifyError(`Error al crear el documento: ${error}`);
    }
  };

  return (
    <>
      {loader ? (
        <div>Loading...</div>
      ) : (
        <>
          <Title color="primaryColor">Crear Documento</Title>
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
                id="template1"
                name="template1"
                label="Template"
                items={templates}
                value={formData.template1 ? formData.template1 : ''}
                onChange={handleChange}
                required
                defaultOptionMessage="Seleccione un template"
              />
            </div>
            {formData.template1 && (
              <div className={styles.formControlLong}>
                <p className={styles.editorLabel}>Texto:</p>
                <div className={styles.editor} id="editorjs" />
              </div>
            )}
            {Object.keys(placeholderValues).map((placeholder) => (
              <div className={styles.formControl} key={placeholder}>
                <InputField
                  key={placeholder}
                  id={placeholder}
                  name={placeholder}
                  label={placeholder}
                  type="text"
                  value={placeholderValues[placeholder]}
                  onChange={handlePlaceholderChange}
                  required
                />
              </div>
            ))}
            <div className={styles.formControlLong}>
              <Link href="/documentos">
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
                label="Crear Documento"
                type="submit"
                disabled={!isFormValid}
                style={{
                  marginBottom: '24px',
                  marginTop: '24px',
                  float: 'right',
                }}
              />
            </div>
          </form>
        </>
      )}
    </>
  );
}
