import { TemplateProps } from '@/types/template';
import { ITemplate } from '../models/ITemplate';

class CompositeTemplate extends ITemplate {
  private children: ITemplate[] = [];

  constructor(props?: TemplateProps) {
    super(props);
  }

  clone(): CompositeTemplate {
    return new CompositeTemplate();
  }

  review(
    templateId: string,
    isReviewed: boolean,
    userEmail: string
  ): Promise<string> {
    return Promise.resolve('Revisión de CompositeTemplate no implementada.');
  }

  //No todas las funciones fueron utilizadas en la implementación
  render(): string {
    return this.children.map((child) => child.render()).join('\n');
  }

  add(child: ITemplate): void {
    this.children.push(child);
  }

  remove(child: ITemplate): void {
    const index = this.children.indexOf(child);
    if (index !== -1) {
      this.children.splice(index, 1);
    }
  }
}

export default CompositeTemplate;
