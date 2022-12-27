export {}

declare global {
    // General form data shape
    interface FormSubmitData {
        formData: Object
        successMessage?: string
    }

    type FormInitialData = Object

    interface FormProps {
        initialData?: FormInitialData | null
        errorMessage?: string | null
        successMessage?: string | null
        isLoading?: boolean | null
        mode?: 'new' | 'edit'
    }

    interface DjFormData {
        id?: string | null
        name?: string | null
        slug?: string | null
        email?: string | null
        bio?: string | null
        photo?: string | null
        city?: number | City | null
        genres?: Array<string> | null
    }

    interface SoundFormData {
        id?: string | null
        name?: string | null
        slug?: string | null
        url?: string | null
        description?: string | null
        genres?: Array<string> | null
        dj?: Dj | null
        type?: string | null
        duration?: number | null
        photo?: Object | string | null
        status?: string | null
    }

    interface Dj {
        id?: string
        name?: string
        email?: string
        bio?: string
        slug?: string
        photo?: string
        city?: City
        follow_count?: number
        follows?: Array<number | Follow>
        genres?: Array<Genre | GenreNested>
        sounds?: Array<Sound>
    }

    interface City {
        id?: number
        name?: string
        gps?: any
        district?: string
        region?: string
        zip?: number
    }

    interface Genre {
        id: number
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
