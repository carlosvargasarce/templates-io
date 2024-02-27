import { TemplateProps } from '@/types/template';

abstract class ITemplate {
  private id: string;
  private name: string;
  private description: string;
  private keywords: string[];
  private category: string;
  private text: string;

  constructor({
    id,
    name,
    description,
    keywords,
    category,
    text,
  }: TemplateProps) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.keywords = keywords;
    this.category = category;
    this.text = text;
  }

  public getId() {
    return this.id;
  }

  public setId(id: string) {
    this.id = id;
  }

  public getName() {
    return this.name;
  }

  public setName(name: string) {
    this.name = name;
  }

  public getDescription() {
    return this.description;
  }

  public setDescription(description: string) {
    this.description = description;
  }

  public getKeywords() {
    return this.keywords;
  }

  public setKeywords(keywords: string[]) {
    this.keywords = keywords;
  }

  public getCategory() {
    return this.category;
  }

  public setCategory(category: string) {
    this.category = category;
  }

  public getText() {
    return this.text;
  }

  public setText(text: string) {
    this.text = text;
  }

  public getData() {
    let mData: string = '< Sobre este template >\n';
    mData += 'Numero de id: ' + this.getId() + '\n';
    mData += 'Nombre: ' + this.getName() + '\n';
    mData += 'Descripción: ' + this.getDescription() + '\n';
    mData += 'Keywords: ' + this.getKeywords() + '\n';
    mData += 'Categoría: ' + this.getCategory() + '\n';
    mData += 'Texto: ' + this.getText() + '\n';
    return mData;
  }

  //Funcion que obligamos a los objetos a definir.
  abstract clone(): ITemplate;
}

export { ITemplate };
