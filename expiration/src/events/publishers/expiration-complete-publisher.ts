import {
  Subjects,
  ExpirationCompleteEvent,
  Publisher,
} from '@ey-tickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
