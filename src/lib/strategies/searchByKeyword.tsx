import { TemplateProps } from '@/types/template';
import { SearchStrategy } from './search';

export class SearchByKeyword implements SearchStrategy {
  search(templates: TemplateProps[], keyword: string): TemplateProps[] {
    return templates.filter(
      (template) =>
        template.keywords &&
        template.keywords.some((k) =>
          k.toLowerCase().includes(keyword.toLowerCase())
        )
    );
  }
}
