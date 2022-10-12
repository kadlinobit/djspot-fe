import _ from 'lodash'
import useDirectus from '~/composables/directus'
const directus = useDirectus()

const file = ($axios) => {
    const getCroppedImageBlob = async (imageObj) => {
        if (!imageObj.croppedImage)
            throw new Error(
                'Cropped image not present in provided image object.'
            )

        const { canvas } = imageObj.croppedImage
        if (!canvas)
            throw new Error(
                'Canvas object not present in provided image object.'
            )

        const blob = await new Promise((resolve) => canvas.toBlob(resolve))

        return blob
    }

    const handleCoverPhotoUpdate = async (
        newPhoto,
        prevPhoto,
        newPhotoMeta
    ) => {
        // # Case 1 - keeping original photo
        if (newPhoto === 'keep-current') {
            return 'keep-current'
        }
        // # Case 2 - delete previous photo
        if (_.isNil(newPhoto) && !_.isNil(prevPhoto)) {
            const deletePhotoResponse = await deleteFile(prevPhoto)
            if (deletePhotoResponse.status === 204) return null
        }

        // # Case 3 - update photo (or upload photo if there was no photo before)
        if (!_.isEmpty(newPhoto) && newPhoto !== 'keep-current') {
            let uploadedPhoto = null
            const photoBlob = await getCroppedImageBlob(newPhoto)
            if (photoBlob) {
                // Case #3A - there was no photo before / create new photo
                if (!_.isNil(prevPhoto)) {
                    await deleteFile(prevPhoto)
                }
                uploadedPhoto = await uploadFile(photoBlob, newPhotoMeta)
            }
            return uploadedPhoto?.id ? uploadedPhoto.id : null
        }
    }

    const uploadFile = async (file, fileMeta) => {
        if (_.isNil(file)) {
            throw new TypeError(
                'Binary file content is missing - cannot upload file.'
            )
        }

        const formData = buildFormData(file, fileMeta)
        // // AXIOS WAY
        // const response = await $axios.post('files', formData)

        const response = await directus.files.createOne(formData)
        return response
    }

    const updateFile = async (fileId, file, fileMeta) => {
        if (_.isNil(fileId)) {
            throw new TypeError('File ID is missing - cannot update file')
        }
        const formData = buildFormData(file, fileMeta)
        // // AXIOS WAY
        // const response = await $axios.patch(`files/${fileId}`, formData)
        const response = await directus.files.updateOne(id, formData)

        return response
    }

    const deleteFile = async (fileId) => {
        if (_.isNil(fileId)) {
            throw new TypeError('File ID is missing - cannot delete file')
        }

        // TODO - handle error somehow
        // because when error happens here, nothing happens in the browser
        // also directus returns just "undefined" when file is succesfully deleted, that is shit
        await directus.files.deleteOne(fileId)
        return { status: 204 }
        // // AXIOS WAY
        // const response = await $axios.delete(`files/${fileId}`)
    }

    const buildFormData = (file, fileMeta) => {
        const formData = new FormData()

        if (!_.isNil(fileMeta) && !_.isEmpty(fileMeta)) {
            Object.entries(fileMeta).forEach(([key, value]) =>
                formData.append(key, value)
            )
        }

        if (!_.isNil(file)) {
            formData.append('file', file)
        }

        return formData
    }

    const api = {
        uploadFile,
        updateFile,
        deleteFile,
        handleCoverPhotoUpdate,
        helpers: {
            getCroppedImageBlob,
            buildFormData
        }
    }

    return api
}

export default file
