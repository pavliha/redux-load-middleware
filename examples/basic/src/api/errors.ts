export class ApiError<T = unknown> extends Error {
  data?: T
  constructor(data?: T) {
    super('ApiError was thrown')
    this.data = data
  }
}
