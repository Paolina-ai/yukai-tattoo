# Yukaï Tattoo · site V1

Landing page de Paul (@yukai.tattoo), tatoueur au salon Label Encre, Reignac-sur-Indre.
Site statique : HTML + CSS + un peu de JS, sans build.

## Aperçu local

```
cd yukai_tatoo && python3 -m http.server 8765
```
puis ouvrir http://localhost:8765

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
- [ ] Hébergement (Netlify / Vercel / OVH…)
- [ ] Ajouter l'URL du site sur la fiche Google et dans les bios Instagram
- [ ] Corriger la coquille « Bourd du Fau » dans la bio @label_encre
