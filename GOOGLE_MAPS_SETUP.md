# Guide d'Intégration et de Configuration Google Maps Platform - ZARÉN 2.0

Ce document détaille toutes les étapes pour configurer, activer, sécuriser et tester votre clé **Google Maps Platform** dans l'application **ZARÉN**.

---

## 1. Créer un Projet Google Cloud Platform

1. Rendez-vous sur la [Google Cloud Console](https://console.cloud.google.com/?utm_campaign=gmp_git_agentskills_v1).
2. Connectez-vous avec votre compte Google.
3. Cliquez sur le sélecteur de projet en haut à gauche et choisissez **Nouveau projet**.
4. Nommez votre projet : `ZAREN-Marketplace` puis cliquez sur **Créer**.

---

## 2. Activer les APIs Google Maps Nécessaires

Pour que toutes les fonctionnalités de géolocalisation, recherche et itinéraires fonctionnent, activez les APIs suivantes depuis la section **APIs & Services > Bibliothèque** :

* **Maps JavaScript API** : Permet l'affichage de la carte interactive, des marqueurs personnalisés et du clustering.
* **Places API (New)** : Permet la recherche intelligente d'adresses, villes et commerces avec auto-complétion.
* **Geocoding API** : Permet de convertir les adresses des vendeurs en coordonnées GPS (latitude/longitude).
* **Routes API / Directions API** : Permet le calcul des itinéraires routiers et du temps de trajet vers les boutiques.

---

## 3. Créer votre Clé d'API (API Key)

1. Dans le menu de gauche, rendez-vous dans **APIs & Services > Identifiants** (ou [Console Credentials](https://console.cloud.google.com/google/maps-apis/credentials?utm_campaign=gmp_git_agentskills_v1)).
2. Cliquez sur **+ CRÉER DES IDENTIFIANTS** > **Clé API**.
3. Votre clé d'API est générée (ex : `AIzaSyD...`). Copiez-la.

---

## 4. Configurer les Restrictions de Sécurité (Obligatoire)

Pour empêcher toute utilisation non autorisée ou facturation abusive :

### A. Restriction des Référents d'Application (Restrictions HTTP)
1. Dans la page de modification de votre clé, sous **Restrictions d'application**, sélectionnez **Sites Web (référents HTTP)**.
2. Ajoutez vos domaines autorisés :
   * Pour le développement local : `http://localhost:*/*` et `http://127.0.0.1:*/*`
   * Pour la production : `https://votredomaine.com/*` et `https://*.votredomaine.com/*`

### B. Restriction des APIs
1. Sous **Restrictions relatives aux API**, cochez **Restreindre la clé**.
2. Cochez uniquement les 4 APIs utilisées :
   * *Maps JavaScript API*
   * *Places API (New)*
   * *Geocoding API*
   * *Routes API*
3. Cliquez sur **Enregistrer**.

> 🔗 Documentation officielle : [Restrictions des clés d'API Google Cloud](https://docs.cloud.google.com/api-keys/docs/add-restrictions-api-keys)

---

## 5. Où mettre la Clé dans le Projet ZARÉN ?

Ouvrez le fichier `.env` situé à la racine du projet `c:\Users\Joffray\ZAREN 2.0\.env` :

```env
# Remplacez MA_CLE_GOOGLE_MAPS par votre vraie clé API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyVotreCleReelleIci
VITE_GOOGLE_MAPS_API_KEY=AIzaSyVotreCleReelleIci
```

> ⚠️ **Sécurité :** Le fichier `.env` est automatiquement exclu du contrôle de version via `.gitignore`. Ne committez jamais votre clé dans Git.

---

## 6. Tester Google Maps dans l'Application

1. Lancez l'application ou ouvrez : **[http://127.0.0.1:3005/#/map](http://127.0.0.1:3005/#/map)**
2. Testez les fonctionnalités suivantes :
   * **Vue Partagée** : Vérifiez que la liste des boutiques à gauche est synchronisée avec la carte à droite.
   * **Recherche** : Tapez un quartier (*Louis, Akanda, Akwa...*) dans la barre de recherche.
   * **Filtres par Rayon** : Changez le rayon (*1km, 5km, 10km, 25km, 50km, 100km*).
   * **Géolocalisation** : Cliquez sur **« Me géolocaliser »** et autorisez l'accès pour voir votre position exacte et le calcul des distances en km.
   * **Itinéraire** : Cliquez sur un marqueur puis sur **« Voir l'itinéraire »** pour ouvrir le trajet Google Maps.
   * **Espace Vendeur** : Rendez-vous sur **`#/seller/location`** pour tester le positionnement de boutique.

---

## 7. Coûts & Optimisation du Quota

* Google Cloud offre un crédit mensuel récurrent gratuit de **200 $ USD** (couvrant des dizaines de milliers de chargements de cartes et de requêtes de géocodage chaque mois).
* **Bonnes pratiques d'optimisation intégrées dans Zarén :**
  * Calcul de distance géographique côté client via la formule de Haversine pour éviter les appels d'API inutiles.
  * Mise en cache des coordonnées géocodées des vendeurs dans la base de données.
  * Fallback gracieux : l'application fonctionne même si la clé n'est pas encore saisie ou si le quota est atteint.
