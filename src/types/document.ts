import { ITemplate } from '../lib/models/ITemplate';

export interface MyDocumentProps {
  id: string;
  name: string;
  templates: ITemplate[] | string[];
  content: string;
}
