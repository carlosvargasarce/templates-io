import { TemplateProps } from '@/types/template';

export interface SearchStrategy {
  search(templates: TemplateProps[], query: string): TemplateProps[];
}
