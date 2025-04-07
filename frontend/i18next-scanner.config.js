module.exports = {
    input: [
        'src/**/*.{js,jsx,ts,tsx}',
        '!src/locales/**',
    ],
    output: './',
    options: {
        func: {
            list: ['t'],
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
        lngs: ['en', 'ru'],
        ns: ['translation'],
        defaultLng: 'en',
        defaultNs: 'translation',
        resource: {
            loadPath: 'src/locales/{{lng}}/{{ns}}.json',
            savePath: 'src/locales/{{lng}}/{{ns}}.json',
        },
        keySeparator: false,
        nsSeparator: false,
    }
};
