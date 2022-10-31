export {}

declare global {
    // General form data shape
    interface FormSubmitData {
        formData: Object
        successMessage?: string
    }

    type FormInitialData = Object

    interface FormProps {
        initialData?: FormInitialData
        errorMessage?: string
        successMessage?: string
        isLoading?: boolean
        mode?: 'new' | 'edit'
    }

    interface DjFormData {
        name?: string
        slug?: string
        email?: string
        bio?: string
        photo?: string
        city?: string
        genres?: Array<string>
    }

    interface SoundFormData {
        name?: string
        url?: string
        description?: string
        genres?: Array<string>
        dj?: Object
        type?: string
        duration?: number
        photo?: Object | string
        status?: string
    }

    interface Dj {
        id?: string
        name?: string
        email?: string
        bio?: string
        slug?: string
        photo?: string
        city?: string
        follow_count?: number
        follows?: Array<number | Follow>
        genres?: Array<Genre | GenreNested>
        sounds?: Array<Sound>
    }

    interface Genre {
        id?: number
        name?: string
    }

    interface GenreNested {
        genre_id: Genre
    }

    interface Like {}

    interface Follow {}

    interface Sound {
        id?: string
        date_created?: string
        name?: string
        description?: string
        url?: string
        dj?: Dj
        type?: string
        duration?: number
        photo?: string
        genres?: Array<Genre | GenreNested>
        like_count?: number
        likes?: Array<number> | Array<Like>
    }
}
