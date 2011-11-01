import json

from Products.Five.browser import BrowserView
from zope.component import queryUtility
from zope.i18n.interfaces import ITranslationDomain


class i18njs(BrowserView):

    @ram.cache(lambda method, domain, language: domain+language)
    def _gettext_catalog(self, domain, language):
        td = queryUtility(ITranslationDomain, domain)
        if td is None or language not in td._catalogs:
            return
        mo_path = td._catalogs[language][0]
        catalog = td._data[mo_path]._catalog
        if catalog is None:
            td._data[mo_path].reload()
            catalog = td._data[mo_path]._catalog
        return json.dumps(catalog._catalog)

    def __call__(self, domain, language=None):
        if domain is None:
            return
        if language is None:
            language = self.request['LANGUAGE']
        return self._gettext_catalog(domain, language)
