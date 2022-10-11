import _ from 'lodash'

const tools = () => {
    const parseErrorMessage = function (e) {
        if (_.isNil(e)) return null
        if (typeof e === 'string') return e
        if (e?.message) return e.message

        const errorMessage = e?.response?.data?.errors[0]?.message || e
        return errorMessage
    }

    const api = {
        parseErrorMessage
    }

    return api
}

export default tools
