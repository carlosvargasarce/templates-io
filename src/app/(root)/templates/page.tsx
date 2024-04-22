'use client';

import Button from '@/components/Button/Button';
import InputField from '@/components/InputField/InputField';
import Select from '@/components/Select/Select';
import Switch from '@/components/Switch/Switch';
import Title from '@/components/Title/Title';
import { customStyles } from '@/constants/tableStylesOverrides';
import useDebouncedSearch from '@/hooks/useDebouncedSearch';
import useObserverManager from '@/hooks/useObserverManager';
import useToast from '@/hooks/useToast';
import TemplateManager from '@/lib/manager/TemplateManager';
import UserManager from '@/lib/manager/UserManager';
import ProxyModerator from '@/lib/proxies/TemplateProxyModerator';
import { AuthService } from '@/lib/storage/authService';
import { SearchStrategy } from '@/lib/strategies/search';
import { SearchByCategory } from '@/lib/strategies/searchByCategory';
import { SearchByKeyword } from '@/lib/strategies/searchByKeyword';
import { SearchByName } from '@/lib/strategies/searchByName';

import { TemplateProps } from '@/types/template';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import styles from './page.module.scss';

export default function Page() {
  const [searchStrategyId, setSearchStrategyId] = useState('keyword');
  const [query, setQuery] = useState('');
  const [filteredData, setFilteredData] = useState<TemplateProps[]>([]);

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

  const searchOptions = [
    { id: 'keyword', name: 'Palabra Clave' },
    { id: 'name', name: 'Nombre' },
    { id: 'category', name: 'Categoría' },
  ];

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

  // useEffect(() => {
  //   const templates = templateManager.getAllTemplates();
  //   setData(templates);
  //   setLoader(false); // Desactiva el indicador de carga una vez que los datos están listos.
  // }, [refreshDataTrigger]);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const templates = await templateManager.getAllTemplates();
        setData(templates);
        setFilteredData(templates);
        setLoader(false);
      } catch (error) {
        notifyError('Error al cargar los templates');
        setLoader(false);
      }
    };

    fetchTemplates();
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

  /**
   * Asigna el state del query una vez realizada la busqueda en el input field
   */
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    debouncedSearch(event.target.value);
  };

  /**
   * Asigna el state de la estrategia desde el select
   */
  const handleStrategyChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSearchStrategyId(event.target.value);
    if (query) {
      const strategy = getSearchStrategy(event.target.value);
      console.log('DATA', data, 'QUERY', query);
      setFilteredData(strategy.search(data, query));
    }
  };

  const debouncedSearch = useDebouncedSearch((newQuery: any) => {
    if (newQuery) {
      const strategy = getSearchStrategy(searchStrategyId);
      setFilteredData(strategy.search(data, newQuery));
    } else {
      setFilteredData(data);
    }
  });

  /**
   * Ejecuta la busqueda
   */
  const executeSearch = () => {
    if (query) {
      const strategy = getSearchStrategy(searchStrategyId);
      setFilteredData(strategy.search(data, query));
    } else {
      setFilteredData(data);
    }
  };

  /**
   * Diferentes estrategias basadas en diferentes parametros
   */
  const getSearchStrategy = (strategyId: string): SearchStrategy => {
    switch (strategyId) {
      case 'keyword':
        return new SearchByKeyword();
      case 'name':
        return new SearchByName();
      case 'category':
        return new SearchByCategory();
      default:
        throw new Error('Unsupported search strategy');
    }
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
        <>
          <div
            style={{
              display: 'flex',
              gap: '24px',
              alignItems: 'flex-end',
            }}
          >
            <div className={styles.formControl}>
              <InputField
                id="search-input"
                name="search-input"
                label="Buscar"
                type="text"
                value={query}
                onChange={handleSearchChange}
              />
            </div>
            <div className={styles.formControl}>
              <Select
                id="search-select"
                name="search-select"
                label="Categoría"
                items={searchOptions}
                value={searchStrategyId}
                onChange={handleStrategyChange}
                required
                defaultOptionMessage="Seleccione una categoría"
              />
            </div>
          </div>
          <DataTable
            columns={columns}
            noDataComponent={
              <div style={{ marginTop: '120px' }}>
                No hay templates creados o no hacen match a tu busqueda
              </div>
            }
            data={filteredData}
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
        </>
      )}
    </main>
  );
}
