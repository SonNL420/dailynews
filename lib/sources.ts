import type { Source } from './types';

/**
 * Hand-curated seed registry. Every outlet contributes one entry per available
 * per-category feed. Each source is tagged with BOTH a language and a country,
 * because language and country are not 1:1 (fr → FR/BE/CH/CA; BE → nl + fr).
 *
 * Feeds occasionally move or go offline; the API isolates each feed with
 * Promise.allSettled, so a broken entry only drops its own card — it never
 * breaks the page. Users can also extend this set with custom RSS URLs.
 */
export const SOURCES: Source[] = [
  // ─────────────────────────────── Czech (cs) ───────────────────────────────
  { id: 'irozhlas', name: 'iROZHLAS', url: 'https://www.irozhlas.cz/rss/irozhlas', language: 'cs', country: 'CZ', category: 'top', homepage: 'https://www.irozhlas.cz' },
  { id: 'novinky', name: 'Novinky.cz', url: 'https://www.novinky.cz/rss', language: 'cs', country: 'CZ', category: 'top', homepage: 'https://www.novinky.cz' },
  { id: 'ct24', name: 'ČT24', url: 'https://ct24.ceskatelevize.cz/rss', language: 'cs', country: 'CZ', category: 'top', homepage: 'https://ct24.ceskatelevize.cz' },
  { id: 'idnes-zpravodaj', name: 'iDNES Zprávy', url: 'https://servis.idnes.cz/rss.aspx?c=zpravodaj', language: 'cs', country: 'CZ', category: 'top', homepage: 'https://www.idnes.cz' },
  { id: 'aktualne', name: 'Aktuálně.cz', url: 'https://www.aktualne.cz/rss/', language: 'cs', country: 'CZ', category: 'top', homepage: 'https://www.aktualne.cz' },
  { id: 'idnes-zahranicni', name: 'iDNES Zahraničí', url: 'https://servis.idnes.cz/rss.aspx?c=zahranicni', language: 'cs', country: 'CZ', category: 'world', homepage: 'https://www.idnes.cz' },
  { id: 'idnes-ekonomika', name: 'iDNES Ekonomika', url: 'https://servis.idnes.cz/rss.aspx?c=ekonomika', language: 'cs', country: 'CZ', category: 'business', homepage: 'https://www.idnes.cz' },
  { id: 'idnes-technet', name: 'iDNES Technet', url: 'https://servis.idnes.cz/rss.aspx?c=technet', language: 'cs', country: 'CZ', category: 'technology', homepage: 'https://www.idnes.cz' },
  { id: 'idnes-sport', name: 'iDNES Sport', url: 'https://servis.idnes.cz/rss.aspx?c=sport', language: 'cs', country: 'CZ', category: 'sport', homepage: 'https://www.idnes.cz' },
  { id: 'idnes-kultura', name: 'iDNES Kultura', url: 'https://servis.idnes.cz/rss.aspx?c=kultura', language: 'cs', country: 'CZ', category: 'culture', homepage: 'https://www.idnes.cz' },

  // ────────────────────────────── Dutch (nl) ────────────────────────────────
  { id: 'nos-algemeen', name: 'NOS Nieuws', url: 'https://feeds.nos.nl/nosnieuwsalgemeen', language: 'nl', country: 'NL', category: 'top', homepage: 'https://nos.nl' },
  { id: 'nos-buitenland', name: 'NOS Buitenland', url: 'https://feeds.nos.nl/nosnieuwsbuitenland', language: 'nl', country: 'NL', category: 'world', homepage: 'https://nos.nl' },
  { id: 'nos-politiek', name: 'NOS Politiek', url: 'https://feeds.nos.nl/nosnieuwspolitiek', language: 'nl', country: 'NL', category: 'politics', homepage: 'https://nos.nl' },
  { id: 'nos-economie', name: 'NOS Economie', url: 'https://feeds.nos.nl/nosnieuwseconomie', language: 'nl', country: 'NL', category: 'business', homepage: 'https://nos.nl' },
  { id: 'nos-tech', name: 'NOS Tech', url: 'https://feeds.nos.nl/nosnieuwstech', language: 'nl', country: 'NL', category: 'technology', homepage: 'https://nos.nl' },
  { id: 'nos-sport', name: 'NOS Sport', url: 'https://feeds.nos.nl/nossportalgemeen', language: 'nl', country: 'NL', category: 'sport', homepage: 'https://nos.nl' },
  { id: 'nos-cultuur', name: 'NOS Cultuur & Media', url: 'https://feeds.nos.nl/nosnieuwscultuurenmedia', language: 'nl', country: 'NL', category: 'culture', homepage: 'https://nos.nl' },
  { id: 'nunl-algemeen', name: 'NU.nl', url: 'https://www.nu.nl/rss/Algemeen', language: 'nl', country: 'NL', category: 'top', homepage: 'https://www.nu.nl' },
  { id: 'nunl-economie', name: 'NU.nl Economie', url: 'https://www.nu.nl/rss/Economie', language: 'nl', country: 'NL', category: 'business', homepage: 'https://www.nu.nl' },
  { id: 'nunl-tech', name: 'NU.nl Tech', url: 'https://www.nu.nl/rss/Tech', language: 'nl', country: 'NL', category: 'technology', homepage: 'https://www.nu.nl' },
  { id: 'vrtnws', name: 'VRT NWS', url: 'https://www.vrt.be/vrtnws/nl.rss.articles.xml', language: 'nl', country: 'BE', category: 'top', homepage: 'https://www.vrt.be/vrtnws' },
  { id: 'hln', name: 'Het Laatste Nieuws', url: 'https://www.hln.be/home/rss.xml', language: 'nl', country: 'BE', category: 'top', homepage: 'https://www.hln.be' },

  // ────────────────────────────── French (fr) ───────────────────────────────
  { id: 'lemonde-une', name: 'Le Monde', url: 'https://www.lemonde.fr/rss/une.xml', language: 'fr', country: 'FR', category: 'top', homepage: 'https://www.lemonde.fr' },
  { id: 'lemonde-international', name: 'Le Monde International', url: 'https://www.lemonde.fr/international/rss_full.xml', language: 'fr', country: 'FR', category: 'world', homepage: 'https://www.lemonde.fr' },
  { id: 'lemonde-politique', name: 'Le Monde Politique', url: 'https://www.lemonde.fr/politique/rss_full.xml', language: 'fr', country: 'FR', category: 'politics', homepage: 'https://www.lemonde.fr' },
  { id: 'lemonde-economie', name: 'Le Monde Économie', url: 'https://www.lemonde.fr/economie/rss_full.xml', language: 'fr', country: 'FR', category: 'business', homepage: 'https://www.lemonde.fr' },
  { id: 'lemonde-pixels', name: 'Le Monde Pixels', url: 'https://www.lemonde.fr/pixels/rss_full.xml', language: 'fr', country: 'FR', category: 'technology', homepage: 'https://www.lemonde.fr' },
  { id: 'lemonde-sciences', name: 'Le Monde Sciences', url: 'https://www.lemonde.fr/sciences/rss_full.xml', language: 'fr', country: 'FR', category: 'science', homepage: 'https://www.lemonde.fr' },
  { id: 'lemonde-sport', name: 'Le Monde Sport', url: 'https://www.lemonde.fr/sport/rss_full.xml', language: 'fr', country: 'FR', category: 'sport', homepage: 'https://www.lemonde.fr' },
  { id: 'lemonde-culture', name: 'Le Monde Culture', url: 'https://www.lemonde.fr/culture/rss_full.xml', language: 'fr', country: 'FR', category: 'culture', homepage: 'https://www.lemonde.fr' },
  { id: 'franceinfo-titres', name: 'France Info', url: 'https://www.francetvinfo.fr/titres.rss', language: 'fr', country: 'FR', category: 'top', homepage: 'https://www.francetvinfo.fr' },
  { id: 'franceinfo-monde', name: 'France Info Monde', url: 'https://www.francetvinfo.fr/monde.rss', language: 'fr', country: 'FR', category: 'world', homepage: 'https://www.francetvinfo.fr' },
  { id: 'franceinfo-economie', name: 'France Info Éco', url: 'https://www.francetvinfo.fr/economie.rss', language: 'fr', country: 'FR', category: 'business', homepage: 'https://www.francetvinfo.fr' },
  { id: 'france24-fr', name: 'France 24', url: 'https://www.france24.com/fr/rss', language: 'fr', country: 'FR', category: 'top', homepage: 'https://www.france24.com/fr' },
  { id: 'rtbf-info', name: 'RTBF Info', url: 'https://rss.rtbf.be/article/rss/highlight_rtbfinfo_info.xml', language: 'fr', country: 'BE', category: 'top', homepage: 'https://www.rtbf.be' },
  { id: 'rts-info', name: 'RTS Info', url: 'https://www.rts.ch/info/?format=rss', language: 'fr', country: 'CH', category: 'top', homepage: 'https://www.rts.ch' },
  { id: 'radio-canada', name: 'Radio-Canada', url: 'https://ici.radio-canada.ca/rss/4159', language: 'fr', country: 'CA', category: 'top', homepage: 'https://ici.radio-canada.ca' },
  { id: 'ledevoir', name: 'Le Devoir', url: 'https://www.ledevoir.com/rss/manchettes.xml', language: 'fr', country: 'CA', category: 'top', homepage: 'https://www.ledevoir.com' },

  // ───────────────────────────── English (en) ──────────────────────────────
  { id: 'bbc-top', name: 'BBC News', url: 'https://feeds.bbci.co.uk/news/rss.xml', language: 'en', country: 'GB', category: 'top', homepage: 'https://www.bbc.com/news' },
  { id: 'bbc-world', name: 'BBC World', url: 'https://feeds.bbci.co.uk/news/world/rss.xml', language: 'en', country: 'GB', category: 'world', homepage: 'https://www.bbc.com/news/world' },
  { id: 'bbc-politics', name: 'BBC Politics', url: 'https://feeds.bbci.co.uk/news/politics/rss.xml', language: 'en', country: 'GB', category: 'politics', homepage: 'https://www.bbc.com/news/politics' },
  { id: 'bbc-business', name: 'BBC Business', url: 'https://feeds.bbci.co.uk/news/business/rss.xml', language: 'en', country: 'GB', category: 'business', homepage: 'https://www.bbc.com/news/business' },
  { id: 'bbc-technology', name: 'BBC Technology', url: 'https://feeds.bbci.co.uk/news/technology/rss.xml', language: 'en', country: 'GB', category: 'technology', homepage: 'https://www.bbc.com/news/technology' },
  { id: 'bbc-science', name: 'BBC Science', url: 'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml', language: 'en', country: 'GB', category: 'science', homepage: 'https://www.bbc.com/news/science_and_environment' },
  { id: 'bbc-health', name: 'BBC Health', url: 'https://feeds.bbci.co.uk/news/health/rss.xml', language: 'en', country: 'GB', category: 'health', homepage: 'https://www.bbc.com/news/health' },
  { id: 'guardian-world', name: 'The Guardian World', url: 'https://www.theguardian.com/world/rss', language: 'en', country: 'GB', category: 'world', homepage: 'https://www.theguardian.com' },
  { id: 'guardian-politics', name: 'The Guardian Politics', url: 'https://www.theguardian.com/politics/rss', language: 'en', country: 'GB', category: 'politics', homepage: 'https://www.theguardian.com' },
  { id: 'guardian-business', name: 'The Guardian Business', url: 'https://www.theguardian.com/business/rss', language: 'en', country: 'GB', category: 'business', homepage: 'https://www.theguardian.com' },
  { id: 'guardian-technology', name: 'The Guardian Tech', url: 'https://www.theguardian.com/technology/rss', language: 'en', country: 'GB', category: 'technology', homepage: 'https://www.theguardian.com' },
  { id: 'guardian-science', name: 'The Guardian Science', url: 'https://www.theguardian.com/science/rss', language: 'en', country: 'GB', category: 'science', homepage: 'https://www.theguardian.com' },
  { id: 'guardian-sport', name: 'The Guardian Sport', url: 'https://www.theguardian.com/sport/rss', language: 'en', country: 'GB', category: 'sport', homepage: 'https://www.theguardian.com' },
  { id: 'guardian-culture', name: 'The Guardian Culture', url: 'https://www.theguardian.com/culture/rss', language: 'en', country: 'GB', category: 'culture', homepage: 'https://www.theguardian.com' },
  { id: 'npr-top', name: 'NPR News', url: 'https://feeds.npr.org/1001/rss.xml', language: 'en', country: 'US', category: 'top', homepage: 'https://www.npr.org' },
  { id: 'npr-world', name: 'NPR World', url: 'https://feeds.npr.org/1004/rss.xml', language: 'en', country: 'US', category: 'world', homepage: 'https://www.npr.org' },
  { id: 'npr-business', name: 'NPR Business', url: 'https://feeds.npr.org/1006/rss.xml', language: 'en', country: 'US', category: 'business', homepage: 'https://www.npr.org' },
  { id: 'npr-technology', name: 'NPR Technology', url: 'https://feeds.npr.org/1019/rss.xml', language: 'en', country: 'US', category: 'technology', homepage: 'https://www.npr.org' },
  { id: 'npr-science', name: 'NPR Science', url: 'https://feeds.npr.org/1007/rss.xml', language: 'en', country: 'US', category: 'science', homepage: 'https://www.npr.org' },
  { id: 'npr-health', name: 'NPR Health', url: 'https://feeds.npr.org/1128/rss.xml', language: 'en', country: 'US', category: 'health', homepage: 'https://www.npr.org' },
  { id: 'aljazeera-en', name: 'Al Jazeera English', url: 'https://www.aljazeera.com/xml/rss/all.xml', language: 'en', country: 'QA', category: 'world', homepage: 'https://www.aljazeera.com' },

  // ───────────────────────────── German (de) ───────────────────────────────
  { id: 'tagesschau', name: 'tagesschau', url: 'https://www.tagesschau.de/xml/rss2/', language: 'de', country: 'DE', category: 'top', homepage: 'https://www.tagesschau.de' },
  { id: 'zeit-index', name: 'Die Zeit', url: 'https://newsfeed.zeit.de/index', language: 'de', country: 'DE', category: 'top', homepage: 'https://www.zeit.de' },
  { id: 'zeit-politik', name: 'Die Zeit Politik', url: 'https://newsfeed.zeit.de/politik/index', language: 'de', country: 'DE', category: 'politics', homepage: 'https://www.zeit.de' },
  { id: 'zeit-wirtschaft', name: 'Die Zeit Wirtschaft', url: 'https://newsfeed.zeit.de/wirtschaft/index', language: 'de', country: 'DE', category: 'business', homepage: 'https://www.zeit.de' },
  { id: 'zeit-digital', name: 'Die Zeit Digital', url: 'https://newsfeed.zeit.de/digital/index', language: 'de', country: 'DE', category: 'technology', homepage: 'https://www.zeit.de' },
  { id: 'zeit-wissen', name: 'Die Zeit Wissen', url: 'https://newsfeed.zeit.de/wissen/index', language: 'de', country: 'DE', category: 'science', homepage: 'https://www.zeit.de' },
  { id: 'zeit-sport', name: 'Die Zeit Sport', url: 'https://newsfeed.zeit.de/sport/index', language: 'de', country: 'DE', category: 'sport', homepage: 'https://www.zeit.de' },
  { id: 'zeit-kultur', name: 'Die Zeit Kultur', url: 'https://newsfeed.zeit.de/kultur/index', language: 'de', country: 'DE', category: 'culture', homepage: 'https://www.zeit.de' },
  { id: 'derstandard', name: 'Der Standard', url: 'https://www.derstandard.at/rss', language: 'de', country: 'AT', category: 'top', homepage: 'https://www.derstandard.at' },
  { id: 'orf-news', name: 'ORF News', url: 'https://rss.orf.at/news.xml', language: 'de', country: 'AT', category: 'top', homepage: 'https://orf.at' },
  { id: 'srf-news', name: 'SRF News', url: 'https://www.srf.ch/news/bnf/rss/1646', language: 'de', country: 'CH', category: 'top', homepage: 'https://www.srf.ch' },

  // ───────────────────────────── Spanish (es) ──────────────────────────────
  { id: 'elpais-portada', name: 'El País', url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada', language: 'es', country: 'ES', category: 'top', homepage: 'https://elpais.com' },
  { id: 'elpais-internacional', name: 'El País Internacional', url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/internacional/portada', language: 'es', country: 'ES', category: 'world', homepage: 'https://elpais.com' },
  { id: 'elpais-economia', name: 'El País Economía', url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/economia/portada', language: 'es', country: 'ES', category: 'business', homepage: 'https://elpais.com' },
  { id: 'elpais-tecnologia', name: 'El País Tecnología', url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/tecnologia/portada', language: 'es', country: 'ES', category: 'technology', homepage: 'https://elpais.com' },
  { id: 'elpais-ciencia', name: 'El País Ciencia', url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/ciencia/portada', language: 'es', country: 'ES', category: 'science', homepage: 'https://elpais.com' },
  { id: 'elpais-cultura', name: 'El País Cultura', url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/cultura/portada', language: 'es', country: 'ES', category: 'culture', homepage: 'https://elpais.com' },
  { id: 'elpais-deportes', name: 'El País Deportes', url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/deportes/portada', language: 'es', country: 'ES', category: 'sport', homepage: 'https://elpais.com' },
  { id: 'bbc-mundo', name: 'BBC Mundo', url: 'https://feeds.bbci.co.uk/mundo/rss.xml', language: 'es', country: 'GB', category: 'world', homepage: 'https://www.bbc.com/mundo' },

  // ───────────────────────────── Italian (it) ──────────────────────────────
  { id: 'ansa-top', name: 'ANSA', url: 'https://www.ansa.it/sito/notizie/topnews/topnews_rss.xml', language: 'it', country: 'IT', category: 'top', homepage: 'https://www.ansa.it' },
  { id: 'ansa-mondo', name: 'ANSA Mondo', url: 'https://www.ansa.it/sito/notizie/mondo/mondo_rss.xml', language: 'it', country: 'IT', category: 'world', homepage: 'https://www.ansa.it' },
  { id: 'ansa-economia', name: 'ANSA Economia', url: 'https://www.ansa.it/sito/notizie/economia/economia_rss.xml', language: 'it', country: 'IT', category: 'business', homepage: 'https://www.ansa.it' },
  { id: 'ansa-tecnologia', name: 'ANSA Tecnologia', url: 'https://www.ansa.it/sito/notizie/tecnologia/tecnologia_rss.xml', language: 'it', country: 'IT', category: 'technology', homepage: 'https://www.ansa.it' },
  { id: 'ansa-sport', name: 'ANSA Sport', url: 'https://www.ansa.it/sito/notizie/sport/sport_rss.xml', language: 'it', country: 'IT', category: 'sport', homepage: 'https://www.ansa.it' },
  { id: 'ansa-cultura', name: 'ANSA Cultura', url: 'https://www.ansa.it/sito/notizie/cultura/cultura_rss.xml', language: 'it', country: 'IT', category: 'culture', homepage: 'https://www.ansa.it' },
  { id: 'repubblica-home', name: 'la Repubblica', url: 'https://www.repubblica.it/rss/homepage/rss2.0.xml', language: 'it', country: 'IT', category: 'top', homepage: 'https://www.repubblica.it' },
  { id: 'ilpost', name: 'Il Post', url: 'https://www.ilpost.it/feed/', language: 'it', country: 'IT', category: 'top', homepage: 'https://www.ilpost.it' },

  // ──────────────────────────── Portuguese (pt) ────────────────────────────
  { id: 'publico', name: 'Público', url: 'https://www.publico.pt/rss', language: 'pt', country: 'PT', category: 'top', homepage: 'https://www.publico.pt' },
  { id: 'observador', name: 'Observador', url: 'https://observador.pt/feed/', language: 'pt', country: 'PT', category: 'top', homepage: 'https://observador.pt' },
  { id: 'g1-top', name: 'G1', url: 'https://g1.globo.com/rss/g1/', language: 'pt', country: 'BR', category: 'top', homepage: 'https://g1.globo.com' },
  { id: 'g1-mundo', name: 'G1 Mundo', url: 'https://g1.globo.com/rss/g1/mundo/', language: 'pt', country: 'BR', category: 'world', homepage: 'https://g1.globo.com' },
  { id: 'g1-economia', name: 'G1 Economia', url: 'https://g1.globo.com/rss/g1/economia/', language: 'pt', country: 'BR', category: 'business', homepage: 'https://g1.globo.com' },
  { id: 'g1-tecnologia', name: 'G1 Tecnologia', url: 'https://g1.globo.com/rss/g1/tecnologia/', language: 'pt', country: 'BR', category: 'technology', homepage: 'https://g1.globo.com' },
  { id: 'g1-ciencia', name: 'G1 Ciência e Saúde', url: 'https://g1.globo.com/rss/g1/ciencia-e-saude/', language: 'pt', country: 'BR', category: 'science', homepage: 'https://g1.globo.com' },
  { id: 'g1-politica', name: 'G1 Política', url: 'https://g1.globo.com/rss/g1/politica/', language: 'pt', country: 'BR', category: 'politics', homepage: 'https://g1.globo.com' },

  // ──────────────────────────── Vietnamese (vi) ────────────────────────────
  { id: 'vnexpress-top', name: 'VnExpress', url: 'https://vnexpress.net/rss/tin-moi-nhat.rss', language: 'vi', country: 'VN', category: 'top', homepage: 'https://vnexpress.net' },
  { id: 'vnexpress-thegioi', name: 'VnExpress Thế giới', url: 'https://vnexpress.net/rss/the-gioi.rss', language: 'vi', country: 'VN', category: 'world', homepage: 'https://vnexpress.net' },
  { id: 'vnexpress-thoisu', name: 'VnExpress Thời sự', url: 'https://vnexpress.net/rss/thoi-su.rss', language: 'vi', country: 'VN', category: 'politics', homepage: 'https://vnexpress.net' },
  { id: 'vnexpress-kinhdoanh', name: 'VnExpress Kinh doanh', url: 'https://vnexpress.net/rss/kinh-doanh.rss', language: 'vi', country: 'VN', category: 'business', homepage: 'https://vnexpress.net' },
  { id: 'vnexpress-sohoa', name: 'VnExpress Số hóa', url: 'https://vnexpress.net/rss/so-hoa.rss', language: 'vi', country: 'VN', category: 'technology', homepage: 'https://vnexpress.net' },
  { id: 'vnexpress-khoahoc', name: 'VnExpress Khoa học', url: 'https://vnexpress.net/rss/khoa-hoc.rss', language: 'vi', country: 'VN', category: 'science', homepage: 'https://vnexpress.net' },
  { id: 'vnexpress-thethao', name: 'VnExpress Thể thao', url: 'https://vnexpress.net/rss/the-thao.rss', language: 'vi', country: 'VN', category: 'sport', homepage: 'https://vnexpress.net' },
  { id: 'vnexpress-giaitri', name: 'VnExpress Giải trí', url: 'https://vnexpress.net/rss/giai-tri.rss', language: 'vi', country: 'VN', category: 'culture', homepage: 'https://vnexpress.net' },
  { id: 'vnexpress-suckhoe', name: 'VnExpress Sức khỏe', url: 'https://vnexpress.net/rss/suc-khoe.rss', language: 'vi', country: 'VN', category: 'health', homepage: 'https://vnexpress.net' },
  { id: 'tuoitre-top', name: 'Tuổi Trẻ', url: 'https://tuoitre.vn/rss/tin-moi-nhat.rss', language: 'vi', country: 'VN', category: 'top', homepage: 'https://tuoitre.vn' },
  { id: 'tuoitre-thegioi', name: 'Tuổi Trẻ Thế giới', url: 'https://tuoitre.vn/rss/the-gioi.rss', language: 'vi', country: 'VN', category: 'world', homepage: 'https://tuoitre.vn' },
  { id: 'thanhnien-top', name: 'Thanh Niên', url: 'https://thanhnien.vn/rss/home.rss', language: 'vi', country: 'VN', category: 'top', homepage: 'https://thanhnien.vn' },
  { id: 'dantri-top', name: 'Dân Trí', url: 'https://dantri.com.vn/rss/home.rss', language: 'vi', country: 'VN', category: 'top', homepage: 'https://dantri.com.vn' },
];

export const SOURCE_MAP: Record<string, Source> = Object.fromEntries(
  SOURCES.map((s) => [s.id, s]),
);

export function sourcesForLanguage(language: string): Source[] {
  return SOURCES.filter((s) => s.language === language);
}
