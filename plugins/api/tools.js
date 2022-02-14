const tools = () => {
    const parseResponseErrorMessage = function (e) {
        const errorMessage = e?.response?.data?.errors[0]?.message || e
        return errorMessage
    }

    const api = {
        parseResponseErrorMessage
    }

    return api
}

export default tools
