import { TemplateProps } from '@/types/template';
import TemplateManager from '../manager/TemplateManager';
import { ITemplate } from '../models/ITemplate';
import { AuthService } from '../storage/authService';

class ProxyModerador extends ITemplate {
  private authService: AuthService;

  /**
   * Constructor de la clase DefaultTemplate.
   * @param {TemplateProps} props - Propiedades para inicializar un template.
   */
  constructor(authService: AuthService) {
    super();
    this.authService = authService;
  }

  async review(
    templateId: string,
    isReviewed: boolean,
    userEmail: string
  ): Promise<string> {
    try {
      const templateManager = new TemplateManager();

      const isAuthorized = this.authService.isUserActiveAndHasRole(
        userEmail,
        'Moderador'
      );
      if (!isAuthorized) {
        throw new Error('Acceso no autorizado.');
      }

      // Aquí, capturamos el mensaje de éxito de toggleTemplateIsReviewed
      // y lo retornamos directamente.
      return await templateManager.toggleTemplateIsReviewed(
        templateId,
        isReviewed
      );
    } catch (error) {
      // Asegúrate de propagar los errores correctamente.
      throw new Error(
        `Error al actualizar el template: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Implementación del método abstracto clone. En este contexto, podría lanzar un error
   * indicando que la operación no es soportada
   */
  clone(): ITemplate {
    throw new Error('Operación no soportada.');
  }
}

export default ProxyModerador;
