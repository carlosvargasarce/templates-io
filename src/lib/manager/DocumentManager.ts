import { DocumentProps } from '@/types/document';
import { Document } from '../documents/DefaultDocument';
import { StorageService } from '../storage/StorageService';

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
    const newDocument = new Document(documentData);
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
