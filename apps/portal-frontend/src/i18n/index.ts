import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import { enNamespacesMap } from './namespaces/en';

export const DEFAULT_LANGUAGE = 'en';

void i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		fallbackLng: DEFAULT_LANGUAGE,
		defaultNS: 'default',
		fallbackNS: 'default',
		resources: { en: enNamespacesMap },
		keySeparator: '.',
		interpolation: { escapeValue: false },
		returnEmptyString: false,
		returnNull: false,
	});
