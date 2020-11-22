import { createLoadMiddleware } from './loadMiddleware';

describe('loadMiddleware', () => {
  const loadMiddleware = createLoadMiddleware();

  const dispatch = jest.fn();
  const next = jest.fn();
  const getState = jest.fn();

  const user = {
    id: 1,
    name: 'Test user',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should skip action without load property pending action', async () => {
    const action = { type: 'LOAD_USER' };
    await loadMiddleware({ dispatch, getState })(next)(action);
    expect(next).toBeCalledTimes(1);
  });

  describe('Without error/loading and handling', () => {
    it('should dispatch pending action', async () => {
      const action = { type: 'LOAD_USER', load: Promise.resolve(user) };
      await loadMiddleware({ dispatch, getState })(next)(action);
      expect(dispatch).toBeCalledWith({ type: 'LOAD_USER_PENDING' });
    });

    it('should dispatch success action with payload', async () => {
      const action = { type: 'LOAD_USER', load: Promise.resolve(user) };
      await loadMiddleware({ dispatch, getState })(next)(action);
      expect(dispatch).toHaveBeenNthCalledWith(2, { type: 'LOAD_USER_SUCCESS', payload: user });
    });

    it('should dispatch error action with error payload', async () => {
      const error = new Error('failed loading user');
      const action = { type: 'LOAD_USER', load: Promise.reject(error) };
      await loadMiddleware({ dispatch, getState })(next)(action);
      expect(dispatch).toHaveBeenNthCalledWith(2, { type: 'LOAD_USER_ERROR', payload: error });
    });
  });

  describe('With error handlers', () => {
    it('should dispatch with errors property', async () => {
      const error = new Error('failed loading user');
      const errors = { alertError: new Error('error message') };
      const action = { type: 'LOAD_USER', load: Promise.reject(error), errors };
      await loadMiddleware({ dispatch, getState })(next)(action);
      expect(dispatch).toHaveBeenNthCalledWith(2, { type: 'LOAD_USER_ERROR', payload: error, errors });
    });

    it('should dispatch with error transformers', async () => {
      const error = new Error('failed loading user');
      const errorTransformers = { alertError: (error: Error) => new Error(error.message) };
      const action = { type: 'LOAD_USER', load: Promise.reject(error), errors: errorTransformers };
      await loadMiddleware({ dispatch, getState })(next)(action);
      expect(dispatch).toHaveBeenNthCalledWith(2, {
        type: 'LOAD_USER_ERROR',
        payload: error,
        errors: { alertError: error },
      });
    });
  });

  describe('With loadings', () => {
    it('should dispatch with loading property', async () => {
      const action = { type: 'LOAD_USER', load: Promise.resolve(user), loading: 'loadUser' };
      await loadMiddleware({ dispatch, getState })(next)(action);
      expect(dispatch).toHaveBeenNthCalledWith(1, { type: 'LOAD_USER_PENDING', loading: 'loadUser' });
      expect(dispatch).toHaveBeenNthCalledWith(2, { type: 'LOAD_USER_SUCCESS', payload: user, loading: 'loadUser' });
    });
  });
});
