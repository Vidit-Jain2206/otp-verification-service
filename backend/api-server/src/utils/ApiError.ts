export class ApiError extends Error {
  status: number;
  constructor(message: string = "Invalid request", status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}
