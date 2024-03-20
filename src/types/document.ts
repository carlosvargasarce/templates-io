import { ITemplate } from '../lib/models/ITemplate';

export interface DocumentProps {
  id: string;
  name: string;
  templates: ITemplate[] | string[];
  content: string;
}
