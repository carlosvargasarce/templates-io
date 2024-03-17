import { TemplateProps } from '@/types/template';
import { v4 as uuidv4 } from 'uuid';
import { StorageService } from '../storage/StorageService';
import { DefaultTemplate } from '../templates/DefaultTemplate';
import UserManager from './UserManager';

/**
 * Clase para gestionar operaciones relacionadas con las plantillas (templates).
 */
class TemplateManager {
  private storageService: StorageService;
  private userManager: UserManager;

  /**
   * Constructor de TemplateManager.
   * Inicializa una instancia de StorageService para interactuar con el almacenamiento local.
   */
  constructor() {
    this.storageService = StorageService.getInstance();
    this.userManager = new UserManager();
  }

  /**
   * Crea y almacena una nueva plantilla utilizando los datos proporcionados.
   *
   * @param {TemplateProps} templateData - Los datos de la nueva plantilla.
   */
  public createTemplate(templateData: TemplateProps) {
    const activeUser = this.userManager.getActiveUser();

    if (!activeUser) {
      throw new Error('No hay usuario activo, no se puede crear el template');
    }

    const id = uuidv4();
    const owner = activeUser?.id;
    const completeTemplateData = { ...templateData, id, owner };

    const newTemplate = new DefaultTemplate(completeTemplateData);
    this.storageService.saveTemplate(newTemplate);
  }

  /**
   * Obtiene una plantilla por su identificador.
   *
   * @param {string} id - El identificador de la plantilla a obtener.
   * @returns {TemplateProps} Los datos de la plantilla solicitada.
   */
  public getTemplateById(id: string): TemplateProps {
    return this.storageService.getTemplateById(id);
  }

  /**
   * Obtiene todas las plantillas almacenadas.
   *
   * @returns {TemplateProps[]} Un arreglo con todas las plantillas.
   */
  public getAllTemplates(): TemplateProps[] {
    const activeUser = this.userManager.getActiveUser();
    const allTemplates = this.storageService.getTemplates();

    if (!activeUser) {
      // Si no hay usuario activo, retorna un arreglo vacío.
      return [];
    }

    switch (activeUser.role) {
      case 'Moderador':
        return allTemplates.filter(
          (template) => template.category === 'Para Revisión'
        );

      default:
        return allTemplates;
    }
  }

  /**
   * Elimina una plantilla por su identificador.
   *
   * @param {string} id - El identificador de la plantilla a eliminar.
   */
  public deleteTemplate(id: string): void {
    this.storageService.deleteTemplate(id);
  }

  /**
   * Cambia el estado de revisión de un template.
   *
   * @param {string} id - El ID del template a modificar.
   * @param {boolean} enable - Verdadero para aprobar, falso para deshaprobar.
   * @returns {Promise<string>} Una promesa que resuelve con un mensaje de éxito o rechaza con un mensaje de error.
   */
  public toggleTemplateIsReviewed(
    id: string,
    enable: boolean
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const templateObj = this.storageService.getTemplateById(id);

      if (!templateObj) {
        reject('Template no encontrado.');
        return;
      }

      templateObj.isReviewed = enable;

      try {
        this.storageService.updateTemplate(templateObj);
        resolve(
          `Template ${enable ? 'aprobado' : 'desaprobado'} correctamente.`
        );
      } catch (error) {
        reject('Error al actualizar el template.');
      }
    });
  }
}

export default TemplateManager;
