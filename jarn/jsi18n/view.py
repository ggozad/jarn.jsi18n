import json

from plone.memoize import ram
from zope.component import queryUtility
from zope.i18n.interfaces import ITranslationDomain

from Products.Five.browser import BrowserView


def _cache_key(method, self, domain, language):
    return (domain, language,)


class i18njs(BrowserView):

    @ram.cache(_cache_key)
    def _gettext_catalog(self, domain, language):
        td = queryUtility(ITranslationDomain, domain)
        if td is None or language not in td._catalogs:
            return
        mo_path = td._catalogs[language][0]
        catalog = td._data[mo_path]._catalog
        if catalog is None:
            td._data[mo_path].reload()
            catalog = td._data[mo_path]._catalog
        return catalog._catalog

    def __call__(self, domain, language=None):
        if domain is None:
            return
        if language is None:
            language = self.request['LANGUAGE']

        catalog = self._gettext_catalog(domain, language)
        response = self.request.response
        response.setHeader('content-type', 'application/json')
        response.setBody(json.dumps(catalog))
        return response
