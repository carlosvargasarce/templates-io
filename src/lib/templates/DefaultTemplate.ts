import { TemplateProps } from '@/types/template';
import { ITemplate } from '../models/ITemplate';

/**
 * Clase DefaultTemplate
 * Descripción: Implementación concreta de ITemplate para demostrar el patrón prototipo.
 */
class DefaultTemplate extends ITemplate {
  /**
   * Constructor de la clase DefaultTemplate.
   * @param {TemplateProps} props - Propiedades para inicializar un template.
   */
  constructor(props: TemplateProps) {
    super(props);
  }

  /**
   * Crea y devuelve una copia profunda de este objeto DefaultTemplate.
   * Utiliza getters para acceder a las propiedades de la instancia actual.
   * @return {DefaultTemplate} Una nueva instancia de DefaultTemplate con las mismas propiedades que la instancia actual.
   */
  clone(): DefaultTemplate {
    const cloneProps: TemplateProps = {
      id: this.Id,
      name: this.Name,
      description: this.Description,
      keywords: this.Keywords ? [...this.Keywords] : [],
      category: this.Category,
      text: this.Text,
      isReviewed: this.IsReviewed,
      owner: this.Owner,
    };

    // Devuelve una nueva instancia de DefaultTemplate con las propiedades clonadas.
    return new DefaultTemplate(cloneProps);
  }

  review(
    templateId: string,
    isReviewed: boolean,
    userEmail: string
  ): Promise<string> {
    return new Promise(async (resolve, reject) => {
      console.log('Revisando el template...');
    });
  }
}

export { DefaultTemplate };
