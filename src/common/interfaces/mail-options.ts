export interface MailOptions {
  from?: string;
  to: string;
  subject: string;
  template: string;
  context: Object;
}
