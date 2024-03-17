import { DocumentProps } from '@/types/document';
import { TemplateProps } from '@/types/template';

/**
 * Clase IDocument
 * Descripción: Esta clase representa a un documento en el sistema.
 */
abstract class IDocument {
  private id: string;
  private name: string;
  private templates: TemplateProps[];
  private content: string;

  /**
   * Constructor de la clase IDocument.
   * @param {DocumentProps} props - Propiedades para inicializar un documento.
   */
  constructor({ id, name, templates, content }: DocumentProps) {
    this.id = id;
    this.name = name;
    this.templates = templates;
    this.content = content;
  }

  // Getters y Setters
  get Id(): string {
    return this.id;
  }

  get Name(): string {
    return this.name;
  }

  set Name(value: string) {
    this.name = value;
  }

  get Templates(): TemplateProps[] {
    return this.templates;
  }

  set Templates(value: TemplateProps[]) {
    this.templates = value;
  }

  get Content(): string {
    return this.content;
  }

  set Content(value: string) {
    this.content = value;
  }

  //Métodos abstractos
}

export { IDocument };
