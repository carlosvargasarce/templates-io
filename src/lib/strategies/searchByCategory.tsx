import { TemplateProps } from '@/types/template';
import { SearchStrategy } from './search';

export class SearchByCategory implements SearchStrategy {
  search(templates: TemplateProps[], category: string): TemplateProps[] {
    const lowerCaseName = category.toLowerCase();
    return templates.filter((template) =>
      template.category?.toLowerCase().includes(lowerCaseName)
    );
  }
}
