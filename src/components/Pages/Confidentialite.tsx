import React from "react";
import { Shield, Lock, Eye, Database, UserCheck, AlertTriangle } from "lucide-react";


interface PageProps {
  onPageChange?: (page: string) => void;
}
const Confidentialite: React.FC<PageProps> = ({ onPageChange }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6 max-w-4xl">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Shield className="w-12 h-12 text-green-600" />
            <h1 className="text-4xl font-bold text-gray-800">Politique de Confidentialité</h1>
          </div>
          <p className="text-xl text-gray-600">
            Protection de vos données personnelles sur Jubbalnet
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Dernière mise à jour : 15 janvier 2025
          </p>
        </div>

        {/* Contenu principal */}
        <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Lock className="w-6 h-6 mr-2 text-green-600" />
              Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Jubbalnet s'engage à protéger la confidentialité et la sécurité de vos données personnelles. 
              Cette politique explique comment nous collectons, utilisons, stockons et protégeons vos informations 
              conformément à la loi n°2008-12 du 25 janvier 2008 portant sur la protection des données à caractère 
              personnel au Sénégal et aux meilleures pratiques internationales.
            </p>
          </section>

          {/* Données collectées */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Database className="w-6 h-6 mr-2 text-blue-600" />
              Données que nous collectons
            </h2>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Données d'inscription</h3>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Nom complet</li>
                  <li>• Adresse email</li>
                  <li>• Numéro de téléphone</li>
                  <li>• Région de résidence</li>
                  <li>• Numéro de badge (pour les autorités uniquement)</li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Données de signalement</h3>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• Contenu du signalement (texte ou audio)</li>
                  <li>• Localisation géographique (si autorisée)</li>
                  <li>• Pièces jointes (photos, documents)</li>
                  <li>• Date et heure du signalement</li>
                  <li>• Adresse IP (pour la sécurité)</li>
                </ul>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-2">Données techniques</h3>
                <ul className="text-yellow-700 text-sm space-y-1">
                  <li>• Informations sur votre navigateur et appareil</li>
                  <li>• Cookies de session et préférences</li>
                  <li>• Logs de connexion et d'activité</li>
                  <li>• Données de performance de l'application</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Utilisation des données */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Eye className="w-6 h-6 mr-2 text-purple-600" />
              Comment nous utilisons vos données
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800">Finalités principales :</h3>
                <ul className="text-gray-700 text-sm space-y-2">
                  <li>• Traitement et suivi des signalements</li>
                  <li>• Authentification et gestion des comptes</li>
                  <li>• Communication avec les utilisateurs</li>
                  <li>• Amélioration de la sécurité publique</li>
                  <li>• Génération de statistiques anonymisées</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800">Finalités secondaires :</h3>
                <ul className="text-gray-700 text-sm space-y-2">
                  <li>• Prévention de la fraude et des abus</li>
                  <li>• Respect des obligations légales</li>
                  <li>• Amélioration de nos services</li>
                  <li>• Support technique et assistance</li>
                  <li>• Recherche et développement</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Partage des données */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <UserCheck className="w-6 h-6 mr-2 text-indigo-600" />
              Partage et divulgation
            </h2>
            <div className="space-y-4">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="font-semibold text-indigo-800 mb-2">Autorités compétentes</h3>
                <p className="text-indigo-700 text-sm">
                  Les signalements sont partagés avec les autorités sénégalaises compétentes (Police, Gendarmerie, 
                  services spécialisés) dans le cadre de leurs missions de sécurité publique.
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-semibold text-red-800 mb-2">Obligations légales</h3>
                <p className="text-red-700 text-sm">
                  Nous pouvons divulguer vos données si requis par la loi, une décision de justice, 
                  ou pour protéger nos droits légaux et ceux des utilisateurs.
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Partenaires techniques</h3>
                <p className="text-gray-700 text-sm">
                  Nos prestataires de services (hébergement, maintenance) peuvent accéder à vos données 
                  uniquement dans le cadre de leurs prestations et sous contrat de confidentialité.
                </p>
              </div>
            </div>
          </section>

          {/* Sécurité */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Shield className="w-6 h-6 mr-2 text-green-600" />
              Sécurité de vos données
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Mesures techniques :</h3>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>• Chiffrement SSL/TLS pour toutes les communications</li>
                  <li>• Chiffrement des données sensibles en base</li>
                  <li>• Authentification à deux facteurs disponible</li>
                  <li>• Surveillance continue des accès</li>
                  <li>• Sauvegardes sécurisées régulières</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Mesures organisationnelles :</h3>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>• Accès limité aux données selon les besoins</li>
                  <li>• Formation du personnel à la sécurité</li>
                  <li>• Audits de sécurité réguliers</li>
                  <li>• Procédures de gestion des incidents</li>
                  <li>• Contrats de confidentialité stricts</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Droits des utilisateurs */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <UserCheck className="w-6 h-6 mr-2 text-blue-600" />
              Vos droits
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                Conformément à la loi sénégalaise sur la protection des données, vous disposez des droits suivants :
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Droit d'accès</h3>
                  <p className="text-blue-700 text-sm">
                    Vous pouvez demander une copie de toutes les données personnelles que nous détenons sur vous.
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">Droit de rectification</h3>
                  <p className="text-green-700 text-sm">
                    Vous pouvez demander la correction de données inexactes ou incomplètes.
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-yellow-800 mb-2">Droit d'effacement</h3>
                  <p className="text-yellow-700 text-sm">
                    Vous pouvez demander la suppression de vos données dans certaines conditions.
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-2">Droit d'opposition</h3>
                  <p className="text-purple-700 text-sm">
                    Vous pouvez vous opposer au traitement de vos données pour certaines finalités.
                  </p>
                </div>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-gray-700 text-sm">
                  <strong>Pour exercer vos droits :</strong> Contactez-nous à l'adresse 
                  <a href="mailto:privacy@jubbalnet.sn" className="text-green-600 underline ml-1">privacy@jubbalnet.sn</a> 
                  avec une pièce d'identité. Nous répondrons dans un délai maximum de 30 jours.
                </p>
              </div>
            </div>
          </section>

          {/* Conservation des données */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Database className="w-6 h-6 mr-2 text-orange-600" />
              Conservation des données
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Type de données</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Durée de conservation</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Justification</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Données de compte</td>
                    <td className="border border-gray-300 px-4 py-2">Durée de vie du compte + 3 ans</td>
                    <td className="border border-gray-300 px-4 py-2">Obligations légales</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Signalements</td>
                    <td className="border border-gray-300 px-4 py-2">10 ans après clôture</td>
                    <td className="border border-gray-300 px-4 py-2">Archives judiciaires</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Logs de connexion</td>
                    <td className="border border-gray-300 px-4 py-2">1 an</td>
                    <td className="border border-gray-300 px-4 py-2">Sécurité informatique</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Données anonymisées</td>
                    <td className="border border-gray-300 px-4 py-2">Indéfiniment</td>
                    <td className="border border-gray-300 px-4 py-2">Statistiques publiques</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Eye className="w-6 h-6 mr-2 text-pink-600" />
              Cookies et technologies similaires
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700">Jubbalnet utilise des cookies pour améliorer votre expérience utilisateur :</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">Cookies essentiels</h3>
                  <p className="text-green-700 text-sm">Nécessaires au fonctionnement du site (authentification, sécurité).</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Cookies de performance</h3>
                  <p className="text-blue-700 text-sm">Nous aident à comprendre comment vous utilisez le site.</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-2">Cookies de préférences</h3>
                  <p className="text-purple-700 text-sm">Mémorisent vos choix (langue, région, paramètres).</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm">Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur.</p>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <AlertTriangle className="w-6 h-6 mr-2 text-red-600" />
              Contact et réclamations
            </h2>
            <div className="bg-red-50 p-6 rounded-lg space-y-4">
              <div>
                <h3 className="font-semibold text-red-800 mb-2">Délégué à la Protection des Données</h3>
                <p className="text-red-700 text-sm">
                  Email : <a href="mailto:dpo@jubbalnet.sn" className="underline">dpo@jubbalnet.sn</a><br />
                  Téléphone : +221 33 XXX XX XX<br />
                  Adresse : Dakar, Sénégal
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-red-800 mb-2">Commission de Protection des Données Personnelles (CDP)</h3>
                <p className="text-red-700 text-sm">
                  Si vous n'êtes pas satisfait de notre réponse, vous pouvez saisir la CDP :<br />
                  Adresse : Immeuble Kébé, Avenue Léopold Sédar Senghor, Dakar<br />
                  Email : contact@cdp.sn<br />
                  Téléphone : +221 33 XXX XX XX
                </p>
              </div>
            </div>
          </section>

          {/* Modifications */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Modifications de cette politique</h2>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-yellow-800">
                Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. 
                Les modifications importantes vous seront notifiées par email ou via une notification sur la plateforme. 
                La version en vigueur est toujours disponible sur cette page avec sa date de dernière mise à jour.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Confidentialite;
