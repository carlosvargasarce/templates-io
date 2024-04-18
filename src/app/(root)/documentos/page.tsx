'use client';

import Button from '@/components/Button/Button';
import Modal from '@/components/Modal/Modal';
import Title from '@/components/Title/Title';
import { customStyles } from '@/constants/tableStylesOverrides';
import useToast from '@/hooks/useToast';
import DocumentManager from '@/lib/manager/DocumentManager';
import TemplateManager from '@/lib/manager/TemplateManager';
import { MyDocumentProps } from '@/types/document';
import { TemplateProps } from '@/types/template';
import EditorJs from '@editorjs/editorjs';
import Embed from '@editorjs/embed';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import SimpleImage from '@editorjs/simple-image';
import Icon from '@icon-park/react/es/all';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import styles from './page.module.scss';

export default function Page() {
  const [selectedRows, setSelectedRows] = useState<MyDocumentProps[]>([]);
  const [toggleCleared, setToggleCleared] = useState(false);
  const [data, setData] = useState<MyDocumentProps[]>([]);
  const [loader, setLoader] = useState(true);
  const [refreshDataTrigger, setRefreshDataTrigger] = useState(false);
  const [templates, setTemplates] = useState<TemplateProps[]>([]);
  const templateManager = new TemplateManager();
  const [refreshTemplatesDataTrigger, setRefreshTemplatesDataTrigger] =
    useState(false);
  const editorRef = useRef<EditorJs | null>(null);
  const documentManager = new DocumentManager();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] =
    useState<MyDocumentProps | null>(null);

  const { notifyError } = useToast();

  // Instantiate Editor.js when the modal is opened and a document is selected
  useEffect(() => {
    let editorJS: any;

    if (isModalOpen && selectedDocument) {
      const EditorJS = require('@editorjs/editorjs').default;
      const contentString = selectedDocument.content || '{}';
      const intermediateJsonString = JSON.parse(contentString);
      const contentObject = JSON.parse(intermediateJsonString);

      editorJS = new EditorJS({
        holder: 'editorjs',
        readOnly: true,
        data: contentObject,
        tools: {
          header: Header,
          list: List,
          simpleImage: SimpleImage,
          embed: Embed,
        },
        onReady: () => {
          editorRef.current = editorJS;
        },
      });
    }

    return () => {
      if (editorJS && typeof editorJS.destroy === 'function') {
        editorJS.destroy();
      }
    };
  }, [isModalOpen, selectedDocument]);

  useEffect(() => {
    //Cargar los templates
    const data = templateManager.getAllTemplates();
    setTemplates(data);
    setLoader(false);
  }, [refreshTemplatesDataTrigger]);

  useEffect(() => {
    //Cargar los documentos
    const documents = documentManager.getAllDocuments();
    setData(documents);
    setLoader(false); // Desactiva el indicador de carga una vez que los datos están listos.
  }, [refreshDataTrigger]);

  /**
   * Maneja la selección de filas en la tabla de documentos.
   * @param {any} state - Estado actual de las filas seleccionadas.
   */
  const handleRowSelected = useCallback((state: any) => {
    setSelectedRows(state.selectedRows);
  }, []);

  /**
   * Maneja la acción de eliminar documentos seleccionados.
   */
  const handleDelete = () => {
    if (selectedRows.length === 0) {
      notifyError('No se ha seleccionado ningún documento para eliminar');
      return;
    }

    documentManager.deleteDocument(selectedRows[0].id);
    setRefreshDataTrigger((current) => !current);
    setSelectedRows([]);
    setToggleCleared((current) => !current);
  };

  const handlePreviewClick = (row: any) => {
    setSelectedDocument(row);
    setIsModalOpen(true);
  };

  /**
   * Define la estructura de las columnas para la tabla de documentos.
   * @type {TableColumn<MyDocumentProps>[]}
   */
  const columns: TableColumn<MyDocumentProps>[] = [
    {
      name: 'Nombre',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Templates Base',
      selector: (row) => {
        const templateNames = row.templates.slice(0, 2).map((templateId) => {
          const template = templates.find((t) => t.id === templateId);
          return template ? template.name : 'Template no encontrado';
        });

        if (templateNames.length === 0) {
          return 'Ningún template seleccionado';
        }

        return templateNames.join(', ');
      },
      sortable: true,
    },
    {
      name: 'Preview',
      cell: (row) => (
        <Button
          label={<Icon type={'More-app'} />}
          style={{
            height: '40px',
            width: '40px',
            lineHeight: '40px',
            minWidth: 'auto',
            padding: '0',
          }}
          onClick={() => {
            handlePreviewClick(row);
          }}
        />
      ),
      width: '120px',
      style: {
        justifyContent: 'center',
      },
    },
  ];

  // TODO: CAMBIAR EL CHECKBOX POR UNO PROPIO (NICE TO HAVE) VER DOCUMENTACIÓN
  return (
    <main>
      <Title color="primaryColor">Lista de documentos</Title>
      <div className={styles.buttons}>
        {selectedRows.length > 0 && (
          <Button label="Eliminar" bgColor="danger" onClick={handleDelete} />
        )}
        <Link
          href={
            selectedRows.length > 0
              ? `/editar-documento/${selectedRows[0].id}`
              : '/crear-documento'
          }
        >
          <Button
            label={selectedRows.length > 0 ? 'Editar' : 'Crear'}
            bgColor="primaryColor"
          />
        </Link>
      </div>

      {/* TODO: CREAR LOADER */}
      {loader ? (
        <div>Loading...</div>
      ) : (
        <DataTable
          columns={columns}
          noDataComponent={
            <div style={{ marginTop: '120px' }}>No hay documentos creados</div>
          }
          data={data}
          customStyles={customStyles as any}
          selectableRows
          selectableRowsSingle
          selectableRowsHighlight
          onSelectedRowsChange={handleRowSelected}
          clearSelectedRows={toggleCleared}
          pagination={true}
          paginationComponentOptions={{
            rowsPerPageText: 'Filas por página:',
            rangeSeparatorText: 'de',
            noRowsPerPage: false,
            selectAllRowsItem: false,
            selectAllRowsItemText: 'Todos',
          }}
          contextMessage={{
            singular: 'documento',
            plural: 'items',
            message: 'seleccionado',
          }}
        />
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedDocument && (
          <div>
            <h2>Preview del Documento: {selectedDocument.name}</h2>
            <div id="editorjs" style={{ marginTop: '20px' }}></div>
          </div>
        )}
      </Modal>
    </main>
  );
}
