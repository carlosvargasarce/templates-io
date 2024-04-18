import { TemplateProps } from '@/types/template';

export interface Observer {
  notify(template: TemplateProps): void;
}

export interface UserObserverInterface extends Observer {
  interests: string[];
}

function isUserObserver(observer: Observer): observer is UserObserverInterface {
  return (observer as UserObserverInterface).interests !== undefined;
}

export default class TemplateSubject {
  private static instance: TemplateSubject;
  private observers: Observer[] = [];

  private constructor() {}

  public static getInstance(): TemplateSubject {
    if (!TemplateSubject.instance) {
      TemplateSubject.instance = new TemplateSubject();
    }
    return TemplateSubject.instance;
  }

  registerObserver(observer: Observer): void {
    if (isUserObserver(observer)) {
      const isAlreadyRegistered = this.observers.some(
        (o) =>
          isUserObserver(o) && this.arraysEqual(o.interests, observer.interests)
      );

      if (!isAlreadyRegistered) {
        this.observers.push(observer);
      }
    } else {
      // Handle other types of observers if necessary
      this.observers.push(observer);
    }
  }

  /**
   * Removes an observer from the notification list.
   * @param observer The observer to be removed.
   */
  removeObserver(observer: Observer): void {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  /**
   * Notifies all registered observers about the new or updated template.
   * @param template The template data to notify observers about.
   */
  notifyObservers(template: TemplateProps): void {
    this.observers.forEach((observer) => {
      if (
        isUserObserver(observer) &&
        observer.interests.some((interest) =>
          template.keywords?.includes(interest)
        )
      ) {
        observer.notify(template);
      }
    });
  }

  arraysEqual(a: string[], b: string[]): boolean {
    return a.length === b.length && a.every((val, index) => val === b[index]);
  }
}
