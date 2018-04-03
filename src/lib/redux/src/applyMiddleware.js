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
        const store = createStore(reducer, preloadedState, enhancer)
        let dispatch = store.dispatch
        let chain = []

        const middlewareAPI = {
            getState: store.getState,
            dispatch: (action) => dispatch(action)
        }

        console.group('Apply middlewares');

        console.group('1. Create chain')
        chain = middlewares.map(middleware => middleware(middlewareAPI))
        console.groupEnd()

        console.group('2. Compose chain')
        dispatch = compose(...chain)(store.dispatch)
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
