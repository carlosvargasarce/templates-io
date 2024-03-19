import { TemplateProps } from '@/types/template';

/**
 * Clase abstracta ITemplate
 * Descripción: Esta clase representa un template en el sistema.
 */
abstract class ITemplate {
  private id?: string;
  private name?: string;
  private description?: string;
  private keywords?: string[];
  private category?: string;
  private text?: string;
  private isReviewed?: boolean;
  private owner?: string;

  /**
   * Constructor de la clase ITemplate.
   * @param {TemplateProps} props - Propiedades para inicializar un template. Es opcional.
   */
  constructor(props?: TemplateProps) {
    if (props) {
      this.id = props.id;
      this.name = props.name;
      this.description = props.description;
      this.keywords = props.keywords;
      this.category = props.category;
      this.text = props.text;
      this.isReviewed = props.isReviewed;
      this.owner = props.owner;
    }
  }

  // Getters y Setters
  get Id(): string | undefined {
    return this.id;
  }

  get Name(): string | undefined {
    return this.name;
  }

  set Name(value: string) {
    this.name = value;
  }

  get Keywords(): string[] | undefined {
    return this.keywords;
  }

  set Keywords(value: string[]) {
    this.keywords = value;
  }

  get Description(): string | undefined {
    return this.description;
  }

  set Description(value: string) {
    this.description = value;
  }

  get Category(): string | undefined {
    return this.category;
  }

  set Category(value: string) {
    this.category = value;
  }

  get Text(): string | undefined {
    return this.text;
  }

  set Text(value: string) {
    this.text = value;
  }

  get IsReviewed(): boolean | undefined {
    return this.isReviewed;
  }

  set IsReviewed(value: boolean) {
    this.isReviewed = value;
  }

  get Owner(): string | undefined {
    return this.owner;
  }

  set Owner(value: string) {
    this.owner = value;
  }

  // Métodos abstractos
  abstract clone(): ITemplate;

  /**
   * Método abstracto para revisar un template.
   * @param templateId El ID del template a revisar.
   * @param isReviewed El nuevo estado de revisión del template.
   * @param userEmail El correo electrónico del usuario que realiza la revisión.
   * @param userPassword La contraseña del usuario que realiza la revisión.
   * @returns Una promesa que se resuelve a un mensaje de string sobre la acción de revisión.
   */
  abstract review(
    templateId: string,
    isReviewed: boolean,
    userEmail: string
  ): Promise<string>;
}

export { ITemplate };
