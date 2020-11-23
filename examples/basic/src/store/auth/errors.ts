import { ApiError } from '../../api/errors'
import { ValidationError } from '../../api'
import { errors } from '../constants'

export const loginUserErrors = {
  [errors.alert]: (error: ApiError): string | undefined => {
    if (!error.data) return 'Something went wrong. Please try again!'
  },
  [errors.loginUserForm]: (error: ApiError<ValidationError[]>): ValidationError[] | undefined => {
    if (error.data) return error.data
  },
}
