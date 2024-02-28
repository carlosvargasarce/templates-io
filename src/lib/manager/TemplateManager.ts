import { TemplateProps } from '@/types/template';
import { StorageService } from '../storage/StorageService';
import { DefaultTemplate } from '../templates/DefaultTemplate';

class TemplateManager {
  private storageService: StorageService;

  constructor() {
    this.storageService = StorageService.getInstance();
  }

  public createTemplate(templateData: TemplateProps) {
    const newTemplate = new DefaultTemplate(templateData);
    this.storageService.saveTemplate(newTemplate);
  }

  public getTemplateById(id: string): TemplateProps {
    return this.storageService.getTemplateById(id);
  }

  public getAllTemplates(): TemplateProps[] {
    return this.storageService.getTemplates();
  }

  public deleteTemplate(id: string): void {
    this.storageService.deleteTemplate(id);
  }
}

export default TemplateManager;
