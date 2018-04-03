import compose from './compose'

/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */
export default function applyMiddleware(...middlewares) {
    return (createStore) => (reducer, preloadedState, enhancer) => {

        // Recursive call createStore to get return value.
        const store = createStore(reducer, preloadedState, enhancer)
        // store = {
        //    dispatch,
        //    getState,
        //    ...
        // }

        let dispatch = store.dispatch
        let chain = []

        // Declare middleware APIs to inject to middleware.
        const middlewareAPI = {
            getState: store.getState,
            dispatch: (action) => dispatch(action)
        }

        console.group('Apply middlewares');

        // Huh, sound so familiar. If you see my logger or redux-thunk code, parameters of every middleware is very middlewareAPI

        // Now, loop through and call each middlewares and to get a chain of Next-action-handler injectors. What is the Next-action-handler injectors? I am about to explain. For shortly, we agree Next-action-handler injector is NAHInjector

        console.group('1. Create chain')
        // We have
        // middlewares = [thunkMiddlewareApiInjector, loggerMiddlewareApiInjector]
        chain = middlewares.map(middleware => middleware(middlewareAPI))
        // => chain = [thunkNAHInjector, loggerNAHInjector]
        console.groupEnd()

        console.group('2. Compose chain')
        let composedChain = compose(...chain)
        // => composedChain = (args) => thunkNAHInjector(loggerNAHInjector(args))
        // => composedChain = (args) => thunkNAHInjector(loggerActionHandler)
        // => composedChain = (args) => thunkActionHandler // Thunk-middleware action handler

        // You see that. "loggerActionHandler" is the parameter of "thunkNAHInjector". So to write a middleware, we always have a NAHInjector to retrieve the action handler of the right-next middleware.

        dispatch = composedChain(store.dispatch)
        // So. the next action handler that was injected to loggerNAHInjector (last middleware in chain) was primitive dispatch function
        // Or we can say, the last middleware in the chains of middleware will receive primitive dispatch function as the next action handler.

        // Now we have
        // dispatch = composedChain(store.dispatch)
        // => dispatch = thunkActionHandler

        console.groupEnd();

        console.group('3. Override primitive dispatch function')
        console.log('Primitive dispatch function is override by', dispatch)
        console.log('%cSo dispatch function will be override by the action handler of the first middleware, thunkActionHandler in this case', 'color:red')
        console.groupEnd();

        console.log('');
        console.log('%cTips: Click to function name in the logs above to see function implementation', 'color: green')
        console.log('Then. click %c[Increase]', 'color: blue', 'button to see dispatch process' )

        console.groupEnd();
        return {
            ...store,
            dispatch
        }
    }
}
