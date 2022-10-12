export const parseErrorMessage = function (e) {
    let errorMessage

    if (e.response && e.response.data && e.response.data.message) {
        if (Array.isArray(e.response.data.message)) {
            errorMessage = e.response.data.message[0].messages[0].message
        } else {
            errorMessage = e.response.data.message
        }
    } else {
        errorMessage = e
    }

    return errorMessage
}
