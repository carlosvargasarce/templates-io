'use client';

import Button from '@/components/Button/Button';
import Switch from '@/components/Switch/Switch';
import Title from '@/components/Title/Title';
import { customStyles } from '@/constants/tableStylesOverrides';
import useToast from '@/hooks/useToast';
import TemplateManager from '@/lib/manager/TemplateManager';
import UserManager from '@/lib/manager/UserManager';
import { TemplateProps } from '@/types/template';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import styles from './page.module.scss';

export default function Page() {
  const [selectedRows, setSelectedRows] = useState<TemplateProps[]>([]);
  const [toggleCleared, setToggleCleared] = useState(false);
  const [data, setData] = useState<TemplateProps[]>([]);
  const [loader, setLoader] = useState(true);
  const [refreshDataTrigger, setRefreshDataTrigger] = useState(false);
  const templateManager = new TemplateManager();
  const userManager = new UserManager();
  const { notifySuccess, notifyError } = useToast();
  const activeUser = userManager.getActiveUser();
  const canCreateTemplate = activeUser && activeUser.role === 'Cliente';
  const isModerator = activeUser && activeUser.role === 'Moderador';
  const [columns, setColumns] = useState<TableColumn<TemplateProps>[]>([]);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const shouldShowButton = canCreateTemplate || selectedRows.length > 0;
    setShowButton(shouldShowButton);
  }, [canCreateTemplate, selectedRows.length]);

  /**
   * Maneja el cambio en el estado del switch de la revisión de template.
   * Actualiza el estado del template en el estado de revisión y refleja el cambio en la UI.
   *
   * @param {TemplateProps} template - El objeto template correspondiente a la fila donde el switch fue cambiado.
   * @param {boolean} isReviewed - El nuevo estado de revisión del template.
   */
  const handleSwitchChange = (
    template: TemplateProps,
    isReviewed: boolean
  ): void => {
    templateManager
      .toggleTemplateIsReviewed(template.id, isReviewed)
      .then((message: string) => {
        notifySuccess(message);
        setRefreshDataTrigger((current: boolean) => !current);
      })
      .catch((error) => {
        notifyError(error);
      });
  };

  useEffect(() => {
    /**
     * Define la estructura de las columnas para la tabla de templates.
     * @type {TableColumn<TemplateProps>[]}
     */
    const initialColumns: TableColumn<TemplateProps>[] = [
      {
        name: 'Nombre',
        selector: (row) => row.name,
        sortable: true,
      },
      {
        name: 'Palabras Clave',
        selector: (row) => row.keywords.join(', '),
        sortable: true,
      },
      {
        name: 'Categoría',
        selector: (row) => row.category,
        sortable: true,
      },
    ];

    if (isModerator) {
      initialColumns.push({
        name: 'Aprobar',
        selector: (row) => row.isReviewed,
        cell: (row) => (
          <Switch
            id={`switch-${row.id}`}
            name="isReviewed"
            checked={row.isReviewed}
            onChange={(e) => handleSwitchChange(row, e.target.checked)}
          />
        ),
        ignoreRowClick: true,
        width: '120px',
        style: {
          justifyContent: 'center',
        },
      });
    }

    setColumns(initialColumns);
  }, [isModerator, handleSwitchChange]);

  useEffect(() => {
    const templates = templateManager.getAllTemplates();
    setData(templates);
    setLoader(false); // Desactiva el indicador de carga una vez que los datos están listos.
  }, [refreshDataTrigger, templateManager]);

  /**
   * Maneja la selección de filas en la tabla de templates.
   * @param {any} state - Estado actual de las filas seleccionadas.
   */
  const handleRowSelected = useCallback((state: any) => {
    setSelectedRows(state.selectedRows);
  }, []);

  /**
   * Maneja la acción de eliminar templates seleccionados.
   */
  const handleDelete = () => {
    if (selectedRows.length === 0) {
      notifyError('No se ha seleccionado ningún template para eliminar');
      return;
    }

    templateManager.deleteTemplate(selectedRows[0].id);
    setRefreshDataTrigger((current) => !current);
    setSelectedRows([]);
    setToggleCleared((current) => !current);
  };

  // TODO: CAMBIAR EL CHECKBOX POR UNO PROPIO (NICE TO HAVE) VER DOCUMENTACIÓN
  return (
    <main>
      <Title color="primaryColor">Lista de templates</Title>
      <div className={styles.buttons}>
        {selectedRows.length > 0 && (
          <Button label="Eliminar" bgColor="danger" onClick={handleDelete} />
        )}
        {showButton && (
          <Link
            href={
              selectedRows.length > 0
                ? `/editar-template/${selectedRows[0].id}`
                : '/crear-template'
            }
          >
            <Button
              label={selectedRows.length > 0 ? 'Editar' : 'Crear'}
              bgColor="primaryColor"
            />
          </Link>
        )}
      </div>

      {/* TODO: CREAR LOADER */}
      {loader ? (
        <div>Loading...</div>
      ) : (
        <DataTable
          columns={columns}
          noDataComponent={
            <div style={{ marginTop: '120px' }}>No hay templates creados</div>
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
            singular: 'template',
            plural: 'items',
            message: 'seleccionado',
          }}
        />
      )}
    </main>
  );
}
