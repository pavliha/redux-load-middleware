import { createErrorSelector } from 'redux-load-middleware'
import { errors } from '../../store/constants'
import { Selector } from 'reselect'
import { State } from '../../store/reducer'

export const selectAlertError: Selector<State, string | undefined> = createErrorSelector(errors.alert)
