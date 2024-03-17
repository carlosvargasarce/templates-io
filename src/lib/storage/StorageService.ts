export class StorageService {
  private static instance: StorageService;

  private constructor() {
    this.initializeLocalStorage();
  }

  private initializeLocalStorage(): void {
    console.log('Instancia local creada');
  }

  //El siguiente método es usado porque localStorage no puede correr del lado del servidor
  private isClientSide() {
    return typeof window !== 'undefined';
  }

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }

    return StorageService.instance;
  }

  public saveUser(user: any) {
    if (!this.isClientSide()) return;

    const users = this.getUsers();
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
  }

  public updateUser(updatedUser: any) {
    let users = this.getUsers();
    const userIndex = users.findIndex(
      (existingUser) => existingUser.id === updatedUser.id
    );

    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
    } else {
      console.warn('Usuario no encontrado para actualizar.');
    }
  }

  public getUsers(): any[] {
    if (!this.isClientSide()) return [];

    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  }

  public getUserById(id: string) {
    const users = this.getUsers();
    return users.find((user) => user.id === id);
  }

  public getActiveUser() {
    if (!this.isClientSide()) return null;

    const activeUser = localStorage.getItem('activeUser');
    if (activeUser) {
      return JSON.parse(activeUser);
    }
    return null;
  }

  public deleteUser(id: string): void {
    if (!this.isClientSide()) return;

    let users = this.getUsers();
    users = users.filter((user) => user.id !== id);
    localStorage.setItem('users', JSON.stringify(users));
  }

  public saveTemplate(template: any) {
    if (!this.isClientSide()) return;

    const templates = this.getTemplates();
    templates.push(template);
    localStorage.setItem('templates', JSON.stringify(templates));
  }

  public updateTemplate(updatedTemplate: any) {
    let templates = this.getTemplates();
    const templateIndex = templates.findIndex(
      (existingTemplate) => existingTemplate.id === updatedTemplate.id
    );

    if (templateIndex !== -1) {
      templates[templateIndex] = updatedTemplate;
      localStorage.setItem('templates', JSON.stringify(templates));
    } else {
      console.warn('Template no encontrado para actualizar.');
    }
  }

  public getTemplates(): any[] {
    if (!this.isClientSide()) return [];

    const templates = localStorage.getItem('templates');
    return templates ? JSON.parse(templates) : [];
  }

  public getTemplateById(id: string) {
    const templates = this.getTemplates();
    return templates.find((template) => template.id === id);
  }

  public deleteTemplate(id: string): void {
    if (!this.isClientSide()) return;

    let templates = this.getTemplates();
    templates = templates.filter((template) => template.id !== id);
    localStorage.setItem('templates', JSON.stringify(templates));
  }

  public saveDocument(template: any) {
    if (!this.isClientSide()) return;

    const documents = this.getDocuments();
    documents.push(template);
    localStorage.setItem('documents', JSON.stringify(documents));
  }

  public getDocuments(): any[] {
    if (!this.isClientSide()) return [];

    const documents = localStorage.getItem('documents');
    return documents ? JSON.parse(documents) : [];
  }

  public getDocumentById(id: string) {
    const documents = this.getDocuments();
    return documents.find((template) => template.id === id);
  }

  public deleteDocument(id: string): void {
    if (!this.isClientSide()) return;

    let documents = this.getDocuments();
    documents = documents.filter((template) => template.id !== id);
    localStorage.setItem('documents', JSON.stringify(documents));
  }
}
