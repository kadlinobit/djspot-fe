import _ from 'lodash';

// Wraps _.debounce so every call returns an awaitable Promise.
// _.debounce returns undefined for calls that are swallowed by the wait window,
// which breaks callers that await the result. See https://github.com/lodash/lodash/issues/4700
export function asyncDebounce<F extends (...args: unknown[]) => Promise<unknown>>(
    func: F,
    wait?: number
) {
    const debounced = _.debounce((resolve, reject, args: Parameters<F>) => {
        func(...args)
            .then(resolve)
            .catch(reject);
    }, wait);
    return (...args: Parameters<F>): ReturnType<F> =>
        new Promise((resolve, reject) => {
            debounced(resolve, reject, args);
        }) as ReturnType<F>;
}
