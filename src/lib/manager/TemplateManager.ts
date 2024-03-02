import { TemplateProps } from '@/types/template';
import { StorageService } from '../storage/StorageService';
import { DefaultTemplate } from '../templates/DefaultTemplate';

/**
 * Clase para gestionar operaciones relacionadas con las plantillas (templates).
 */
class TemplateManager {
  private storageService: StorageService;

  /**
   * Constructor de TemplateManager.
   * Inicializa una instancia de StorageService para interactuar con el almacenamiento local.
   */
  constructor() {
    this.storageService = StorageService.getInstance();
  }

  /**
   * Crea y almacena una nueva plantilla utilizando los datos proporcionados.
   *
   * @param {TemplateProps} templateData - Los datos de la nueva plantilla.
   */
  public createTemplate(templateData: TemplateProps) {
    const newTemplate = new DefaultTemplate(templateData);
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
    return this.storageService.getTemplates();
  }

  /**
   * Elimina una plantilla por su identificador.
   *
   * @param {string} id - El identificador de la plantilla a eliminar.
   */
  public deleteTemplate(id: string): void {
    this.storageService.deleteTemplate(id);
  }
}

export default TemplateManager;
