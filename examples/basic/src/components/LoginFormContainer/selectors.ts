import { createSelector, Selector } from 'reselect'
import { Dictionary } from 'lodash'
import { createErrorSelector, createLoadingSelector } from 'redux-load-middleware' // from redux-load-middleware
import { ValidationError } from '../../api'
import { errors, loadings } from '../../store/constants'
import { State } from '../../store/reducer'

export const selectLoginUserLoading = createLoadingSelector(loadings.loginUser)

export const selectLoginUserErrors: Selector<State, Dictionary<string> | undefined> = createSelector(
  createErrorSelector(errors.loginUserForm),
  (errors: ValidationError[] | undefined) => {
    if (!errors) return
    return errors.reduce((acc, error) => ({ ...acc, [error.field]: error.message }), {})
  }
)
