import * as Yup from 'yup';

export const getValidationSchemas = (t) => {
    const emailValidationSchema = Yup.object({
        email: Yup.string()
            .email(t('invalid_email_format'))
            .required(t('email_required'))
            .test('is-valid-domain', t('invalid_email_format'), (value) => {
                if (!value) return false;
                const emailRegex =
                    /@(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?$/i;
                return emailRegex.test(value);
            }),
    });

    const passwordValidationSchema = Yup.object({
        password: Yup.string()
            .min(8, t('minimum_eight_characters'))
            .max(128, t('maximum_eight_characters'))
            .required(t('password_required')),
    });

    const codeValidationSchema = Yup.object({
        code: Yup.string()
            .min(6, t('minimum_six_characters'))
            .max(6, t('maximum_six_characters'))
            .required(t('code_required')),
    });

    const usernameValidationSchema = Yup.object({
        username: Yup.string()
            .matches(/^\S+$/, t('username_no_spaces'))
            .matches(/[a-zA-Z0-9]/, t('username_letters_numbers_required'))
            .matches(/^[.\w@+-]+$/, t('username_invalid_characters'))
            .min(1, t('minimum_one_character'))
            .max(50, t('maximum_fifty_characters'))
            .required(t('username_required')),
    });

    const authValidationSchema = Yup.object().shape({
        email: emailValidationSchema.fields.email,
        password: passwordValidationSchema.fields.password,
    });

    const resetPasswordEmailValidationSchema = emailValidationSchema;

    const resetPasswordCodeValidationSchema = Yup.object().shape({
        code: codeValidationSchema.fields.code,
        password: passwordValidationSchema.fields.password,
    });

    const updateUserProfileValidationSchema = Yup.object().shape({
        username: usernameValidationSchema.fields.username,
        email: emailValidationSchema.fields.email,
        first_name: Yup.string(),
        last_name: Yup.string(),

        bio: Yup.string().max(500, t('bio_must_be_less_than_500_characters')),
        specialty: Yup.string().max(100, t('specialty_must_be_less_than_100_characters')),
        gender: Yup.string(),
        age: Yup.number().nullable().min(0, t('age_must_be_positive')).max(150, t('age_must_be_less_than_150')),
        phone_number: Yup.string().max(20, t('phone_number_must_be_less_than_20_characters')),
        country: Yup.string().max(100, t('country_must_be_less_than_100_characters')),
        region: Yup.string().max(100, t('region_must_be_less_than_100_characters')),
        city: Yup.string().max(100, t('city_must_be_less_than_100_characters'))


    });

    const ChangePasswordValidationSchema = Yup.object().shape({
        current_password: passwordValidationSchema.fields.password,
        new_password: passwordValidationSchema.fields.password,
    });

    const SocialValidationSchema = Yup.object().shape({
        google_link: Yup.string()
            .url(t('invalid_url_format'))
            .nullable()
            .matches(/^(https?:\/\/)?([\w-]+)\.([a-z]{2,6}\.?)(\/\S*)?$/, t('invalid_url')),
        github_link: Yup.string()
            .url(t('invalid_url_format'))
            .nullable()
            .matches(/^(https?:\/\/)?([\w-]+)\.([a-z]{2,6}\.?)(\/\S*)?$/, t('invalid_url')),
        telegram_link: Yup.string()
            .url(t('invalid_url_format'))
            .nullable()
            .matches(/^(https?:\/\/)?([\w-]+)\.([a-z]{2,6}\.?)(\/\S*)?$/, t('invalid_url')),
        habr_link: Yup.string()
            .url(t('invalid_url_format'))
            .nullable()
            .matches(/^(https?:\/\/)?([\w-]+)\.([a-z]{2,6}\.?)(\/\S*)?$/, t('invalid_url')),
        head_hunter_link: Yup.string()
            .url(t('invalid_url_format'))
            .nullable()
            .matches(/^(https?:\/\/)?([\w-]+)\.([a-z]{2,6}\.?)(\/\S*)?$/, t('invalid_url')),
    });


    return {
        emailValidationSchema,
        passwordValidationSchema,
        codeValidationSchema,
        authValidationSchema,

        resetPasswordEmailValidationSchema,
        resetPasswordCodeValidationSchema,
        updateUserProfileValidationSchema,
        ChangePasswordValidationSchema,
        SocialValidationSchema,
    };
};
