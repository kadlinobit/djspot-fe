import Vue from 'vue'
import { ValidationProvider, extend, configure } from 'vee-validate'
import { email, required } from 'vee-validate/dist/rules'

export default function ({ app }) {
    const i18n = app.i18n

    configure({
        defaultMessage: (field, values) => {
            return i18n.t(`validation.${values._rule_}`, values)
        }
    })

    extend('required', {
        ...required
        // message: i18n.t('validation.required_field')
    })

    extend('email', {
        ...email
        // message: i18n.t('validation.email_field')
    })

    Vue.component(ValidationProvider)
}
