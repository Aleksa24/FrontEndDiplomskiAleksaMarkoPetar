export class ValidationFailedResponse {
  error: {
    error: Message[];
  };
}

export class Message {
  name: string;
}
