import _ from 'lodash'
import useDirectus from '~/composables/directus'
const directus = useDirectus()

const tools = () => {
    const regEx = {
        profileName: /^$|^[a-z\d\-\sáčďéěíňóřšťúůýž]+$/gi,
        urlSlug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        noDjPrefix: /^(?!(dj |dj_|dj-).*$).*/gi
    }

    function parseErrorMessage(e) {
        if (_.isNil(e)) return null
        if (typeof e === 'string') return e

        const errorMessage =
            e?.response?.data?.errors[0]?.message ||
            e?.response?._data?.errors[0]?.message ||
            e?.message ||
            e
        return errorMessage
    }

    function generateUrlSlug(val: string) {
        if (!val) return ''
        return val
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036F]/g, '')
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '')
    }

    /**
     * Throttles an async function in a way that can be awaited.
     * By default throttle doesn't return a promise for async functions unless it's invoking them immediately. See CUR-4769 for details.
     * https://github.com/lodash/lodash/issues/4700
     * @param func async function to throttle calls for.
     * @param wait same function as lodash.throttle's wait parameter.
     *             Call this function at most this often.
     * @returns a promise which will be resolved/ rejected only if the function is executed, with the result of the underlying call.
     */
    function asyncDebounce<F extends (...args: any[]) => Promise<any>>(
        func: F,
        wait?: number
    ) {
        const debounced = _.debounce((resolve, reject, args: Parameters<F>) => {
            func(...args)
                .then(resolve)
                .catch(reject)
        }, wait)
        return (...args: Parameters<F>): ReturnType<F> =>
            new Promise((resolve, reject) => {
                debounced(resolve, reject, args)
            }) as ReturnType<F>
    }

    /**
     * Verifies that a field is unique in a DB collection
     * @param collection - collection name
     * @param fieldName - field name
     * @param newValue - new value (the value to be checked)
     * @param currentValue - current value (the value that is already in the DB - if they are the same, no need to call API)
     */
    const verifyUnique = async function (
        collection: string,
        fieldName: string,
        newValue: string,
        currentValue: string | null = null
    ) {
        try {
            if (!newValue) return true as boolean
            if (newValue === currentValue) return true as boolean

            const item = await directus.items(collection).readByQuery({
                filter: {
                    [fieldName]: {
                        _eq: newValue
                    }
                },
                fields: ['id']
            })
            if (item?.data?.length !== undefined && item?.data?.length > 0) {
                return false
            }
            return true
        } catch (e) {
            return false
        }
    }

    const api = {
        regEx,
        parseErrorMessage,
        generateUrlSlug,
        asyncDebounce,
        verifyUnique
    }

    return api
}

export default tools
