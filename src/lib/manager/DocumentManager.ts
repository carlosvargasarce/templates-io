import { DocumentProps } from '@/types/document';
import { v4 as uuidv4 } from 'uuid';
import { Document } from '../documents/DefaultDocument';
import { ITemplate } from '../models/ITemplate';
import { StorageService } from '../storage/StorageService';
import CompositeTemplate from '../templates/CompositeTemplate';

/**
 * Clase para gestionar operaciones relacionadas con los documentos.
 */
class DocumentManager {
  private storageService: StorageService;

  /**
   * Constructor de DocumentManager.
   * Inicializa una instancia de StorageService para interactuar con el almacenamiento local.
   */
  constructor() {
    this.storageService = StorageService.getInstance();
  }

  /**
   * Crea y almacena un nuevo documento utilizando los datos proporcionados.
   *
   * @param {DocumentProps} documentData - Los datos del nuevo documento.
   */
  public createDocument(documentData: DocumentProps) {
    const id = uuidv4();
    const completeTemplateData = { ...documentData, id };
    const newDocument = new Document(completeTemplateData);

    this.storageService.saveDocument(newDocument);
  }

  /**
   * Crea y almacena un nuevo documento compuesto utilizando varios templates.
   *
   * @param documentData Los datos del nuevo documento.
   * @param templates Lista de templates para combinar en el documento.
   */
  public createCompositeDocument(
    documentData: DocumentProps,
    templates: ITemplate[]
  ) {
    // Crea un CompositeTemplate y agrega todos los templates proporcionados
    const compositeTemplate = new CompositeTemplate();
    const id = uuidv4();
    const completeTemplateData = { ...documentData, id };

    templates.forEach((template) => compositeTemplate.add(template));

    const compositeDocumentData = {
      ...completeTemplateData,
      template: compositeTemplate,
    };

    // Crea el documento con el template compuesto y lo guarda
    const newDocument = new Document(compositeDocumentData);
    this.storageService.saveDocument(newDocument);
  }

  /**
   * Obtiene un documento por su identificador.
   *
   * @param {string} id - El identificador del documento a obtener.
   * @returns {DocumentProps} Los datos del documento solicitado.
   */
  public getDocumentById(id: string): DocumentProps {
    return this.storageService.getDocumentById(id);
  }

  /**
   * Obtiene todos los documentos almacenados.
   *
   * @returns {DocumentProps[]} Un arreglo con todos los documentos.
   */
  public getAllDocuments(): DocumentProps[] {
    return this.storageService.getDocuments();
  }

  /**
   * Elimina un documento por su identificador.
   *
   * @param {string} id - El identificador del documento a eliminar.
   */
  public deleteDocument(id: string): void {
    this.storageService.deleteDocument(id);
  }
}

export default DocumentManager;
