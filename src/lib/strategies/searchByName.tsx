import { TemplateProps } from '@/types/template';
import { SearchStrategy } from './search';

export class SearchByName implements SearchStrategy {
  search(templates: TemplateProps[], name: string): TemplateProps[] {
    const lowerCaseName = name.toLowerCase();
    return templates.filter((template) =>
      template.name?.toLowerCase().includes(lowerCaseName)
    );
  }
}
