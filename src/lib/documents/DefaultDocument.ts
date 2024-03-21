import { MyDocumentProps } from '@/types/document';
import { IDocument } from '../models/IDocument';

class Document extends IDocument {
  constructor({ id, name, templates, content }: MyDocumentProps) {
    super({
      id,
      name,
      templates,
      content,
    });
  }
}

export { Document };
