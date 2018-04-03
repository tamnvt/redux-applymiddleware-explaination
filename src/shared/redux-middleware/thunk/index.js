function createThunkMiddleware(extraArgument) {
    const injectMiddlewareApi =  ({ dispatch, getState }) => {

        console.log('In Thunk, inject dispatch and getState api from Redux')

        /**
         * @param next next Action handler of next middleware
         * @returns {thunkActionHandler}
         */
        const nextActionHanlderInjector = next => {

            console.log('In thunk\'s nextActionHanlderInjector, next action handler is:', next)

            const thunkActionHandler = action => {

                console.log('In Thunk, action handler called:', action)

                if (typeof action === 'function') {
                    return action(dispatch, getState, extraArgument);
                }

                return next(action);
            };

            return thunkActionHandler;
        }

        return nextActionHanlderInjector;
    }

    return injectMiddlewareApi;
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;