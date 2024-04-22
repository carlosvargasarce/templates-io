import { TemplateProps } from '@/types/template';
import { Observer } from './IObserver';

export interface UserObserverInterface extends Observer {
  interests: string[];
}

/**
 * Implements the Observer interface to handle notifications for templates that match
 * the interests of a specific user. This class is responsible for determining if a
 * template matches the user's interests and then using a provided method to notify the user.
 */
export default class UserObserver implements UserObserverInterface {
  public interests: string[];
  private notifyMethod: (message: string) => void;

  constructor(interests: string[], notifyMethod: (message: string) => void) {
    this.interests = interests;
    this.notifyMethod = notifyMethod;
  }

  notify(template: TemplateProps): void {
    // Check if the template keywords match any of the user's interests
    if (
      template.keywords &&
      template.keywords.some((keyword) => this.interests.includes(keyword))
    ) {
      this.notifyMethod(
        `Un nuevo template relacionado con sus intereses está disponible: ${template.name}`
      );
    }
  }
}
