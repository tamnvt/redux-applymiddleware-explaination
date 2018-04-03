const createLoggerMiddleware = () => {
    const injectMiddlewareApi = ({ dispatch, getState }) => { // loggerMiddleware

        console.log('In Logger, inject dispatch and getState api from Redux')

        /**
         * @param next Action handler of next middleware
         * @returns {loggerActionHandler}
         */
        const nextActionHanlderInjector = next => {

            console.log('In Logger\'s nextActionHanlderInjector, next action handler is:', next)

            const loggerActionHandler = (action) => { // Action handler

                console.log('In Logger, action handler called:', action)

                let previousState = getState();
                next(action)
                let nextState = getState()

                console.group('Log action:', action.type)
                console.log('Previous state', {...previousState})
                console.log('Next state', {...nextState})
                console.groupEnd();
            }

            return loggerActionHandler;
        }

        return nextActionHanlderInjector
    }

    return injectMiddlewareApi;
}

export default createLoggerMiddleware();
