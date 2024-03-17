import { TemplateProps } from '@/types/template';

/**
 * Clase ITemplate
 * Descripción: Esta clase representa a un template en el sistema.
 */
abstract class ITemplate {
  private id: string;
  private name: string;
  private description: string;
  private keywords: string[];
  private category: string;
  private text: string;
  private isReviewed: boolean;
  private owner: string;

  /**
   * Constructor de la clase ITemplate.
   * @param {TemplateProps} props - Propiedades para inicializar un template.
   */
  constructor({
    id,
    name,
    description,
    keywords,
    category,
    text,
    isReviewed,
    owner,
  }: TemplateProps) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.keywords = keywords;
    this.category = category;
    this.text = text;
    this.isReviewed = isReviewed;
    this.owner = owner;
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

  get Keywords(): string[] {
    return this.keywords;
  }

  set Keywords(value: string[]) {
    this.keywords = value;
  }

  get Description(): string {
    return this.description;
  }

  set Description(value: string) {
    this.description = value;
  }

  get Category(): string {
    return this.category;
  }

  set Category(value: string) {
    this.category = value;
  }

  get Text(): string {
    return this.text;
  }

  set Text(value: string) {
    this.text = value;
  }

  get IsReviewed(): boolean {
    return this.isReviewed;
  }

  set IsReviewed(value: boolean) {
    this.isReviewed = value;
  }

  get Owner(): string {
    return this.owner;
  }

  set Owner(value: string) {
    this.owner = value;
  }

  //Métodos abstractos
  abstract clone(): ITemplate;
}

export { ITemplate };
