'use client';

import Button from '@/components/Button/Button';
import Switch from '@/components/Switch/Switch';
import Title from '@/components/Title/Title';
import { customStyles } from '@/constants/tableStylesOverrides';
import useObserverManager from '@/hooks/useObserverManager';
import useToast from '@/hooks/useToast';
import TemplateManager from '@/lib/manager/TemplateManager';
import UserManager from '@/lib/manager/UserManager';
import ProxyModerator from '@/lib/proxies/TemplateProxyModerator';
import { AuthService } from '@/lib/storage/authService';
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
  const authService = new AuthService();
  const proxyModerador = new ProxyModerator(authService);
  const userManager = new UserManager();
  const { notifySuccess, notifyError } = useToast();
  const activeUser = userManager.getActiveUser();
  const canCreateTemplate = activeUser && activeUser.role === 'Cliente';
  const isModerator = activeUser && activeUser.role === 'Moderador';
  const [columns, setColumns] = useState<TableColumn<TemplateProps>[]>([]);
  const [showButton, setShowButton] = useState(false);

  useObserverManager(notifySuccess);

  useEffect(() => {
    const shouldShowButton = canCreateTemplate || selectedRows.length > 0;
    setShowButton(shouldShowButton);
  }, [canCreateTemplate, selectedRows.length]);

  const handleSwitchChange = (template: TemplateProps, isReviewed: boolean) => {
    // Asegurar primero que activeUser no es null
    if (activeUser && template.id) {
      proxyModerador
        .review(template.id, isReviewed, activeUser.email)
        .then((message: string) => {
          notifySuccess(message);
          //Refrescar tabla
          setRefreshDataTrigger((current: boolean) => !current);
        })
        .catch((error: any) => {
          // Mostrar errores
          notifyError(error.message);
        });
    } else {
      // Handle the case where there is no active user (e.g., not logged in)
      notifyError(
        'Debes estar logeado y ser moderador para ejecutar esta acción.'
      );
    }
  };

  useEffect(() => {
    /**
     * Define la estructura de las columnas para la tabla de templates.
     * @type {TableColumn<TemplateProps>[]}
     */
    const initialColumns: TableColumn<TemplateProps>[] = [
      {
        name: 'Nombre',
        selector: (row: TemplateProps) => row.name ?? '',
        sortable: true,
      },
      {
        name: 'Palabras Clave',
        selector: (row: TemplateProps) =>
          row.keywords ? row.keywords.join(', ') : '',
        sortable: true,
      },
      {
        name: 'Categoría',
        selector: (row: TemplateProps) => row.category ?? '',
        sortable: true,
      },
    ];

    if (isModerator) {
      initialColumns.push({
        name: 'Aprobar',
        selector: (row: TemplateProps) => row.isReviewed ?? '',
        cell: (row) => (
          <Switch
            id={`switch-${row.id}`}
            name="isReviewed"
            checked={row.isReviewed ?? false}
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
  }, [isModerator]);

  useEffect(() => {
    const templates = templateManager.getAllTemplates();
    setData(templates);
    setLoader(false); // Desactiva el indicador de carga una vez que los datos están listos.
  }, [refreshDataTrigger]);

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

    templateManager.deleteTemplate(selectedRows[0].id ?? '');
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
