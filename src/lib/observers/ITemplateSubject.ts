// Import the necessary types
import { TemplateProps } from '@/types/template';
import { Observer } from './IObserver';

/**
 * Interface for the subject in the Observer pattern.
 * This interface defines the basic operations required to manage observers
 * and notify them of changes in the subject.
 */
interface Subject {
  /**
   * Registers an observer to be notified of updates.
   * @param observer The observer to register.
   */
  registerObserver(observer: Observer): void;

  /**
   * Removes an observer from the list of registered observers.
   * @param observer The observer to remove.
   */
  removeObserver(observer: Observer): void;

  /**
   * Notifies all registered observers about a change.
   * @param template The data related to the change that observers should be notified about.
   */
  notifyObservers(template: TemplateProps): void;
}

export default Subject;
