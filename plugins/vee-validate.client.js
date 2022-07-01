import { configure } from 'vee-validate'

export default function ({ app }) {
    // const i18n = app.i18n

    configure({
        defaultMessage: (field, values) => {
            // return i18n.t(`validation.${values._rule_}`, values)
            return `validation.${values._rule_}`
        }
    })
}
