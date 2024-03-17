import { DocumentProps } from '@/types/document';
import { IDocument } from '../models/IDocument';

class Document extends IDocument {
  constructor({ id, name, templates, content }: DocumentProps) {
    super({
      id,
      name,
      templates,
      content,
    });
  }
}

export { Document };
