"use strict";

// Modules
const I18n = require("i18n");

// Helper interface
module.exports = I18n;

I18n.configure({
    directory: './locale',
    register: global,
    objectNotation: true,
    defaultLocale: 'pt-BR'
});