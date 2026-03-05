import { useTranslation } from 'react-i18next';
import { IntlProvider } from 'react-intl';

import { DEFAULT_LANGUAGE } from '@/i18n';

import '../i18n';

interface Props {
	readonly children: React.ReactNode;
}

const LocaleProvider = (props: Props) => {
	const { i18n } = useTranslation();

	const locale = i18n.resolvedLanguage ?? DEFAULT_LANGUAGE;

	return (
		<IntlProvider locale={locale} timeZone={Intl.DateTimeFormat().resolvedOptions().timeZone}>
			{props.children}
		</IntlProvider>
	);
};

export default LocaleProvider;
