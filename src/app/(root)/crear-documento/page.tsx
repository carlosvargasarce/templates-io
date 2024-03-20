'use client';

import Button from '@/components/Button/Button';
import InputField from '@/components/InputField/InputField';
import RadioButton from '@/components/RadioButton/RadioButton';
import Select from '@/components/Select/Select';
import Title from '@/components/Title/Title';
import useToast from '@/hooks/useToast';
import DocumentManager from '@/lib/manager/DocumentManager';
import TemplateManager from '@/lib/manager/TemplateManager';
import { ITemplate } from '@/lib/models/ITemplate';
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
  const [isMultipleTemplate, setIsMultipleTemplate] = useState(false);
  const [selectedTemplate2, setSelectedTemplate2] = useState<TemplateProps>();
  const [loader, setLoader] = useState(true);
  const [content, setContent] = useState({});
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
    useMultipleTemplates: boolean;
  };

  // Estado inicial del formulario, incluyendo el manejo de preguntas condicionales.
  const [formData, setFormData] = useState<FormDataState>({
    name: '',
    template1: '',
    template2: '',
    useMultipleTemplates: false,
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
      if (
        typeof window !== 'undefined' &&
        (formData.template1 || formData.template2)
      ) {
        const template1 = templates.find(
          (template) => template.id === formData.template1
        );
        const template2 = templates.find(
          (template) => template.id === formData.template2
        );

        // Combinar los textos de ambos templates si están seleccionados
        let combinedBlocks = [];

        const dividerBlock = {
          type: 'paragraph',
          data: {
            text: '------------------------------------------------------',
          },
        };

        if (template1 && template2) {
          // Deserializa los textos de ambos templates
          const blocks1 = JSON.parse(template1.text || '{"blocks":[]}').blocks;
          const blocks2 = JSON.parse(template2.text || '{"blocks":[]}').blocks;

          // Combina los bloques de ambos templates y el espaciado
          combinedBlocks = blocks1.concat(dividerBlock, blocks2);
        } else if (template1) {
          // Solo template1 está seleccionado
          combinedBlocks = JSON.parse(template1.text || '{"blocks":[]}').blocks;
        } else if (template2) {
          // Solo template2 está seleccionado
          combinedBlocks = JSON.parse(template2.text || '{"blocks":[]}').blocks;
        }

        const combinedText = JSON.stringify({
          time: Date.now(),
          blocks: combinedBlocks,
          version: '2.29.0',
        });

        const EditorJS = require('@editorjs/editorjs').default;
        if (editorRef.current) {
          editorRef.current.destroy();
        }

        setContent(combinedText);

        editorRef.current = new EditorJS({
          holder: 'editorjs',
          readOnly: true,
          data: JSON.parse(combinedText || '{}'),
          tools: {
            simpleImage: SimpleImage,
            embed: Embed,
            header: Header,
            list: List,
          },
        });

        // Se combinan los placeholders de ambos templates
        const placeholders1: string[] = extractPlaceholders(
          template1?.text ?? ''
        ) as string[];
        const placeholders2: string[] = extractPlaceholders(
          template2?.text ?? ''
        ) as string[];

        const combinedPlaceholders: string[] = Array.from(
          new Set([...placeholders1, ...placeholders2])
        );

        // Se actualizan los valores de los placeholders
        const initialValues = combinedPlaceholders.reduce<
          Record<string, string>
        >((acc, placeholder) => {
          acc[placeholder] = '';
          return acc;
        }, {});

        setPlaceholderValues(initialValues);
      }
    };

    loadEditorData();
  }, [formData.template1, formData.template2, templates.length]);

  /**
   * Actualiza el estado del formulario cuando los campos cambian.
   * @param {React.ChangeEvent<HTMLInputElement>} e - Evento del cambio en el input.
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Manejar específicamente el cambio en el uso de múltiples templates
    // Si el cambio es en la selección de uso de múltiples templates
    if (name === 'useMultipleTemplates') {
      const useMultiple = value === 'true';

      // Restablecer completamente el formulario si se cambia el modo
      setFormData({
        name: formData.name,
        template1: '',
        template2: '',
        useMultipleTemplates: useMultiple,
      });

      if (editorRef.current) {
        editorRef.current.clear();
      }
      setPlaceholderValues({});
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  /**
   * Extrae todos los marcadores de posición únicos de una plantilla de texto.
   * Los marcadores de posición están en el formato {{nombreDelMarcador}}.
   *
   * @param {string} templateText - El texto de la plantilla del cual extraer los marcadores.
   * @returns {Array} Una lista de todos los marcadores de posición únicos encontrados en la plantilla.
   */
  // const extractPlaceholders = (templateText: string) => {
  //   const regex = /{{(.*?)}}/g;
  //   let match;
  //   const placeholders = new Set();

  //   while ((match = regex.exec(templateText)) !== null) {
  //     placeholders.add(match[1].trim());
  //   }

  //   return Array.from(placeholders);
  // };
  const extractPlaceholders = (jsonText: string) => {
    const { blocks } = JSON.parse(jsonText || '{"blocks":[]}');
    const placeholders = new Set();

    blocks.forEach((block: any) => {
      const matches = block.data.text.match(/{{(.*?)}}/g) || [];
      matches.forEach((match: any) =>
        placeholders.add(match.slice(2, -2).trim())
      );
    });

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
    placeholderValues: Record<string, string>
  ) => {
    let content = templateText;
    Object.entries(placeholderValues).forEach(([placeholder, value]) => {
      content = content.replace(new RegExp(`{{${placeholder}}}`, 'g'), value);
    });
    return content;
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
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!isFormValid) {
      notifyError('El formulario no es válido.');
      return;
    }

    // Sustituir los placeholders en el contenido combinado almacenado en el estado
    const finalContent = substitutePlaceholders(
      JSON.stringify(content),
      placeholderValues
    );

    // Preparar los datos básicos del documento
    let documentData = {
      name: formData.name,
      templates: [formData.template1, formData.template2].filter(Boolean), // Filtra los IDs de template no vacíos
      content: finalContent,
      id: '',
    };

    const documentManager = new DocumentManager();

    try {
      if (formData.useMultipleTemplates) {
        // Obtiene los objetos ITemplate basados en los IDs seleccionados
        const selectedTemplates = [formData.template1, formData.template2]
          .map((templateId) => {
            const templateProps = templateManager.getTemplateById(templateId);
            if (templateProps) {
              //Esto es porque como no tenemos una DB necesitamos reinstancear los objetos.
              return templateManager.convertPropsToTemplate(templateProps);
            }
            return undefined;
          })
          .filter(Boolean) as ITemplate[];

        // Verifica si ambos templates están seleccionados antes de llamar a createCompositeDocument
        if (selectedTemplates.length === 2) {
          documentManager.createCompositeDocument(
            documentData,
            selectedTemplates
          );
        } else {
          notifyError(
            'Debes seleccionar dos templates para crear un documento compuesto.'
          );
          return;
        }
      } else {
        // Si solo se seleccionó un template (o ninguno), utilizar el método para crear un documento simple
        // Aquí podrías decidir si manejar el caso de 'ningún template seleccionado' de una manera especial
        documentManager.createDocument(documentData);
      }

      // Redireccionar al usuario a la lista de documentos o a la página de éxito
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
            <div className={styles.formControlLong}>
              <p>
                <strong>
                  ¿Desea crear un documento con múltiples templates?
                </strong>
              </p>
              <RadioButton
                id="useMultipleTemplates-yes"
                name="useMultipleTemplates"
                label="Sí"
                value="true"
                checked={formData.useMultipleTemplates === true}
                onChange={handleChange}
              />
              <RadioButton
                id="useMultipleTemplates-no"
                name="useMultipleTemplates"
                label="No"
                value="false"
                checked={formData.useMultipleTemplates === false}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formControl}>
              <Select
                id="template1"
                name="template1"
                label="Template"
                items={templates.map((template) => ({
                  id: template.id || 'default-id',
                  name: template.name || 'Default Name',
                }))}
                value={formData.template1 ? formData.template1 : ''}
                onChange={handleChange}
                required
                defaultOptionMessage="Seleccione un template"
              />
            </div>
            {formData.useMultipleTemplates && (
              <div className={styles.formControl}>
                <Select
                  id="template2"
                  name="template2"
                  label="Segundo Template"
                  items={templates.map((template) => ({
                    id: template.id || 'default-id',
                    name: template.name || 'Default Name',
                  }))}
                  value={formData.template2 ? formData.template2 : ''}
                  onChange={handleChange}
                  required
                  disabled={!formData.template1}
                  defaultOptionMessage="Seleccione el segundo template"
                />
              </div>
            )}
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
