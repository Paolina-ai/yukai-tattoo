# Yukaï Tattoo · site V1

Landing page de Paul (@yukai.tattoo), tatoueur au salon Label Encre, Reignac-sur-Indre.
Site statique : HTML + CSS + un peu de JS, sans build.

## Aperçu local

```
cd yukai_tatoo && python3 -m http.server 8765
```
puis ouvrir http://localhost:8765

## Versions

- V1 « carnet d'encre » (sobre, clair) : `index.html`, `css/`, `js/`
- V2 « encre vive » (sombre, animée : GSAP + ScrollTrigger + Lenis) : `v2/`, partage le dossier `img/`
- V3 « sumi & washi » (entre-deux, optimisée) : `v3/`
  - polices auto-hébergées dans `v3/fonts/` (sous-ensemble latin) ; **Caveat est réduite aux seuls caractères utilisés** :
    si on change un texte manuscrit (« aka. Paul », « Tu gères ! », la note des dessins, la signature), il faut régénérer `caveat-700.woff2`
  - GSAP / ScrollTrigger / SplitText / Lenis auto-hébergés dans `v3/vendor/` (aucun appel tiers au chargement)
  - images responsives : variantes `-480.webp` dans `img/`
  - carte Google chargée seulement au clic
  - Lighthouse (local, mobile et desktop) : accessibilité 100, bonnes pratiques 100 ; SEO 63 uniquement à cause du `noindex` de prévisualisation

## Structure

- `index.html` : la page (avec données structurées schema.org TattooParlor + Person)
- `css/style.css` : DA « carnet d'encre » (papier, encre, vermillon)
- `js/main.js` : filtres de galerie, lightbox, apparitions au scroll
- `img/` : visuels optimisés (WebP) utilisés par le site, `logo-yukai.svg` redessiné
- `assets/` : sources brutes récupérées sur Instagram (non publiées)

## À faire avant la mise en ligne

- [ ] Logo : remplacer `img/logo-yukai.svg` par le fichier source de Paul
- [ ] Texte « Derrière Yukaï, il y a Paul » à valider avec lui
- [ ] Choisir le nom de domaine, puis décommenter la balise `canonical` et passer les URLs `og:image` en absolu
- [ ] Retirer la balise `noindex` à la mise en ligne sur le vrai domaine
- [ ] Hébergement (Netlify / Vercel / OVH…)
- [ ] Ajouter l'URL du site sur la fiche Google et dans les bios Instagram
- [ ] Corriger la coquille « Bourd du Fau » dans la bio @label_encre
