export class ValidationFailedResponse {
  error: {
    error: Message[];
  };
}

export class Message {
  type: string;
  message: string;
}
