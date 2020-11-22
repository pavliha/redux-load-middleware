import { removeError, setError } from './actions';
import { errorsReducer } from './errorsReducer';

describe('errorsReducer', () => {
  const testErrors = { snackbarError: (error: Error) => error.message };

  it('should not update state when other action called', () => {
    const action = { type: 'TEST_ACTION', payload: new Error('test error') };
    const errorsState = errorsReducer(undefined, action);
    expect(errorsState).toEqual({});
  });

  describe('Action ends with _ERROR', () => {
    it('should not put Error to state when there is no errors key', () => {
      const action = { type: 'SOME_ERROR', payload: new Error('test error') };
      const errorsState = errorsReducer({}, action);
      expect(errorsState).toEqual({});
    });

    it('should put Error to state with key from action errors', () => {
      const action = { type: 'SOME_ERROR', payload: new Error('test error'), errors: testErrors };
      const errorsState = errorsReducer({}, action);
      expect(errorsState).toEqual({ snackbarError: 'test error' });
    });
  });

  describe('Action ends with _PENDING', () => {
    it('should remove when action has errors key', () => {
      const action = { type: 'SOME_ACTION_PENDING', errors: testErrors };
      const errorsState = errorsReducer({ snackbarError: 'test error' }, action);
      expect(errorsState).toEqual({});
    });
    it('should not remove when action has not errors key', () => {
      const action = { type: 'SOME_ACTION_PENDING' };
      const state = { snackbarError: new Error('some error') };
      const errorsState = errorsReducer(state, action);
      expect(errorsState).toEqual(state);
    });
  });

  describe('Manual error handling', () => {
    it('should add error to state when error is set manually', () => {
      const action = setError('snackbarError', new Error('test error'));
      const errorsState = errorsReducer({}, action);
      expect(errorsState).toEqual({ snackbarError: new Error('test error') });
    });

    it('should remove error from state when error is removed manually', () => {
      const action = removeError('snackbarError');
      const errorsState = errorsReducer({ snackbarError: new Error('some error') }, action);
      expect(errorsState).toEqual({});
    });
  });
});
