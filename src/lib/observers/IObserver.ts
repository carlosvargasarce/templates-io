import { TemplateProps } from '@/types/template';

export interface Observer {
  notify(template: TemplateProps): void;
}
