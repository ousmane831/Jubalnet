# JUBBAL-NET
Jubbal Net est une plateforme numérique citoyenne de signalement des crimes et délits au Sénégal. Conçue pour lutter contre la cybercriminalité (arnaques en ligne, usurpations d’identité, fraudes, cyberharcèlement…), elle couvre également d’autres infractions comme le blanchiment de capitaux, la corruption, le vol, le cambriolage ou encore les violences physiques.

Accessible via le web, mobile et USSD/SMS, elle permet aux citoyens de déclarer rapidement un signalement ou une situation d’urgence (texte, pièces jointes ou audio), d’obtenir un suivi sécurisé et d’accéder à une liste de numéros utiles (police, gendarmerie, services de secours). Les autorités disposent de tableaux de bord analytiques pour assurer un traitement efficace, tandis que la plateforme propose aussi des guides de prévention et de sensibilisation afin d’accompagner les populations et renforcer la confiance numérique.

# Description des fonctionnalités ou services
Les principales fonctionnalités de l’application sont :
1 - Gestion des roles:
- Création et gestion des comptes utilisateurs.
- Authentification sécurisée par authtoken
- Attribution de rôles :
    Administrateur : supervise et gère l’ensemble du système
    Autorite : recoivent les signalements analyse et font la gestion
    Citoyen: Effectue un signalement, visualise ses signalement, visualise les pages Prevention et urgences

2 - Enregistrer un signalement:
    Par formulaire : (categorie de crime, titre, description, Region, localisation, date et heure et des pieces jointes comme preuve)
    Par vocal : (enregistrement vocal)

3 - Gestion des signalements:
    Analyser les signalements verifier l'euthenticite ensuite les gerer (En cours, En enquete, transmis, resolus)

4 - Tableau de bord interactif:
    Statistiques des signalements(Signalements Total, Résolus, En Cours, Citoyens Engagés)
    Graphiques dynamiques et carte sur les region plus touchés


# Architecture fonctionnelle
L’architecture fonctionnelle de cette plateforme décrit les interactions entre les acteurs et le système, ainsi que les principales fonctionnalités offertes. Elle permet de visualiser de manière claire les responsabilités de chaque utilisateur et les services mis à disposition.

Les principaux acteurs sont:
a-Citoyens: Authentifier, Non Authentifier et Autentifier anonymement
b-Autorite: Police, Gendarmerie, Cybercriminalité 
c-Administrateur.


# Architecture technique
Backend:
 - Python
 - Django Rest framework

Frontend
 - React
 - CSS Tailwind

Base de données
 - PostgreSQL
 
# Outils utilisés   
 - Vs code
 - GitHub
 - StarUML



