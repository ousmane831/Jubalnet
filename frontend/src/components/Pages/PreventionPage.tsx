import React, { useState } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  Eye, 
  Smartphone, 
  Users,
  Home,
  Car,
  Phone,
  BookOpen,
  ChevronRight,

} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface PreventionPageProps {
  onPageChange: (page: string) => void;
}

export const PreventionPage: React.FC<PreventionPageProps> = ({ onPageChange }) => {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('identity_theft');
  const [expandedTip, setExpandedTip] = useState<string | null>(null);

  const preventionCategories = [
    {
      id: 'harassment',
      name: language === 'fr' ? 'Harcèlement' : 'Harcèlement',
      icon: Users,
      color: 'red',
      description: language === 'fr' 
        ? 'Prévention du harcèlement moral et sexuel'
        : 'Yëgle harcèlement moral ak sexual'
    },
    {
      id: 'identity_theft',
      name: language === 'fr' ? 'Usurpation d\'identité' : 'Fekkante identité',
      icon: Shield,
      color: 'blue',
      description: language === 'fr' 
        ? 'Protection contre le vol d\'identité et fraudes'
        : 'Jëkk ci sàcc identité ak njoloor'
    },
    {
      id: 'money_laundering',
      name: language === 'fr' ? 'Blanchiment de capitaux' : 'Blanchiment bu xaalis',
      icon: AlertTriangle,
      color: 'red',
      description: language === 'fr' 
        ? 'Prévention du blanchiment d\'argent et financement illégal'
        : 'Yëgle blanchiment bu xaalis ak financement bu dëggu'
    },
    {
      id: 'corruption',
      name: language === 'fr' ? 'Corruption' : 'Sëpp',
      icon: AlertTriangle,
      color: 'red',
      description: language === 'fr' 
        ? 'Reconnaître et signaler les actes de corruption'
        : 'Xam ak baxal jëf yu sëpp'
    },
    {
      id: 'theft',
      name: language === 'fr' ? 'Vol et Cambriolage' : 'Sàcc ak Këru Kër',
      icon: Home,
      color: 'orange',
      description: language === 'fr' 
        ? 'Sécuriser votre domicile et vos biens'
        : 'Jëkk sa kër ak sa alal yi'
    },
    {
      id: 'violence',
      name: language === 'fr' ? 'Violence et Agression' : 'Fit ak Njëbul',
      icon: Users,
      color: 'purple',
      description: language === 'fr' 
        ? 'Prévention des violences et protection des victimes'
        : 'Yëgle fit ak ndimbalante ab victim'
    },
    {
      id: 'Arnaque',
      name: language === 'fr' ? 'Arnaque par SMS/EMAIL' : 'Arnaque par SMS/EMAIL',
      icon: Users,
      color: 'red',
      description: language === 'fr' 
        ? 'Prévention contre les arnaques par SMS/EMAIL'
        : 'Yëgle arnaque par SMS/EMAIL'
    },
    {
      id: 'fraude',
      name: language === 'fr' ? 'Fraude bancaire' : 'Fit ak Njëbul',
      icon: AlertTriangle,
      color: 'blue',
      description: language === 'fr' 
        ? 'Prévention contre les fraudes bancaires'
        : 'Yëgle fit ak jëkk nit ñi ci am'
    },
     {
      id: 'phishing',
      name: language === 'fr' ? 'Phishing/Hameçonnage' : 'Phishing/Hameçonnage',
      icon: Shield,
      color: 'green',
      description: language === 'fr' 
        ? 'Prévention contre le phishing et hameçonnage'
        : ' Yëgle phishing ak hameçonnage'
    },
    {
      id: 'chantage',
      name: language === 'fr' ? ' Chantage/Sextorsion' : ' Chantage/Sextorsion',
      icon: Users,
      color: 'orange',
      description: language === 'fr' 
        ? 'Prévention contre le Chantage/Sextorsion'
        : ' Yëgle Chantage/Sextorsion'
    }
  
  ];

  const preventionContent = {
    harassment: {
  tips: [
    {
      title: language === 'fr' ? 'Reconnaître le harcèlement' : 'Xam harcèlement bi',
      content: language === 'fr' 
        ? 'Comportements répétés, intimidation, menaces, commentaires déplacés, isolement.'
        : 'Jëf yu dellu-dellu, xeex, menaces, wax yu bon, isolation.',
      icon: AlertTriangle
    },
    {
      title: language === 'fr' ? 'Comment réagir' : 'Na ngeen jëf',
      content: language === 'fr' 
        ? 'Documentez les incidents, parlez-en à quelqu\'un de confiance, signalez aux autorités.'
        : 'Bind xeey yi, wax ak kenn nga yàgg, baxal ci autorités yi.',
      icon: Shield
    },
    {
      title: language === 'fr' ? 'Soutien disponible' : 'Ndimbalante am',
      content: language === 'fr' 
        ? 'Lignes d\'écoute, associations, services juridiques, accompagnement psychologique.'
        : 'Ligne yu déggal, associations, services juridiques, ndimbalante psychologique.',
      icon: Users
    }
  ],
  laws: [
    {
      title: language === 'fr' 
        ? 'Article 319 bis - Harcèlement sexuel' 
        : 'Article 319 bis - Harcèlement sexuel',
      content: language === 'fr'
        ? `Le fait de harceler autrui en usant d'ordres, de gestes, de menaces, de paroles,
        d'écrits ou de contraintes dans le but d'obtenir des faveurs de nature sexuelle, 
        par une personne abusant de l'autorité que lui confèrent ses fonctions sera puni 
        d'un emprisonnement de six mois à trois ans et d'une amende de 50.000 à 500.000 francs. 
        Lorsque la victime de l'infraction est âgée de moins de 16 ans, le maximum de la peine 
        d'emprisonnement sera prononcée.`
        : `Harcèlement sexuel bi dafa taxawal ci ordres, gestes, menaces, paroles, écrits 
        walla contraintes ngir jot ci favours yu sexual, ku am autorité ci sa fonction. 
        Peine mooy 6 mois ba 3 ans prison ak amende 50.000 à 500.000 FCFA. 
        Su victime bi amul 16 ans, maxima ci peine bi lañu di prononcer.`
    }
  ]
},

    identity_theft: {
  tips: [
    {
      title: language === 'fr' ? 'Protéger ses documents' : 'Jëkk sa dokimaan yi',
      content: language === 'fr' 
        ? 'Ne laissez jamais vos papiers d\'identité sans surveillance. Photocopiez-les et gardez les originaux en sécurité.'
        : 'Bul bàyyi say dokimaan yu bopp ci benn bër. Def copies yi te dëkk originals yi ci sécurité.',
      icon: Shield
    },
    {
      title: language === 'fr' ? 'Vigilance en ligne' : 'Tàngal ci internet',
      content: language === 'fr' 
        ? 'Ne partagez jamais vos informations personnelles sur les réseaux sociaux ou sites non sécurisés.'
        : 'Bul jox kenn sa xibaar yu bopp ci réseaux sociaux walla sites yu amul sécurité.',
      icon: Eye
    },
    {
      title: language === 'fr' ? 'Signaler rapidement' : 'Baxal ci gaaw',
      content: language === 'fr' 
        ? 'En cas d\'usurpation, contactez immédiatement la police et vos banques.'
        : 'Su fekkee usurpation, jokkoo police ak say banques ci gaaw.',
      icon: Phone
    }
  ],
  laws: [
    {
      title: language === 'fr'
        ? 'Article 431-56 (2008-11) - Usurpation d\'identité'
        : 'Article 431-56 (2008-11) - Usurpation d\'identité',
      content: language === 'fr'
        ? `Quiconque aura reçu des informations personnelles, confidentielles ou celles
        qui sont protégées par le secret professionnel, usant de manœuvres frauduleuses quelconques,
        soit en faisant usage de faux noms ou de fausses qualités, sera puni des peines prévues à l’alinéa 1er 
        de l’article 379.`
        : `Ku jot xibaar yu bopp, yu sutura walla yu sédd ci secret professionnel, 
        te nga jëfandikoo manœuvre yu bon, buñu dëgg ci tur walla qualité, 
        dina ñu koy fal ak peine yi ci article 379 alinéa 1er.`
    }
  ]
},

    money_laundering: {
  tips: [
    {
      title: language === 'fr' ? 'Reconnaître le blanchiment' : 'Xam blanchiment bi',
      content: language === 'fr' 
        ? 'Transactions suspectes, montants inhabituels, sources de revenus floues.'
        : 'Transaction yu jafe, xaalis yu dëggu, sources revenus yu jafe.',
      icon: AlertTriangle
    },
    {
      title: language === 'fr' ? 'Signaler les activités suspectes' : 'Baxal jëf yu jafe',
      content: language === 'fr' 
        ? 'Contactez les autorités financières ou utilisez notre plateforme pour signaler.'
        : 'Jokkoo autorités yu xaalis walla jëfandikoo nun la platform bi ngir baxal.',
      icon: Shield
    },
    {
      title: language === 'fr' ? 'Protection personnelle' : 'Jëkk sa bopp',
      content: language === 'fr' 
        ? 'Ne participez jamais à des transactions douteuses, même si on vous propose de l\'argent.'
        : 'Joxe kenn bokk ci transaction yu jafe, ndax su la leen xaalis.',
      icon: Users
    }
  ],
  laws: [
    {
      title: language === 'fr' ? 'Article 415 - Blanchiment d’argent' : 'Article 415 - Blanchiment bu xaalis',
      content: language === 'fr'
        ? 'Le blanchiment d’argent par des transactions frauduleuses est puni conformément au Code pénal.'
        : 'Blanchiment bu xaalis ci transaction yu jafe moo punish selon Code pénal.'
    }
  ]
},
   corruption: {
  tips: [
    {
      title: language === 'fr' ? 'Reconnaître la corruption' : 'Xam sëpp bi',
      content: language === 'fr' 
        ? 'Demande d\'argent pour un service public, favoritisme, détournement de fonds.'
        : 'Laaj xaalis ngir service bu réew mi, favoritisme, feek xaalis yu réew mi.',
      icon: AlertTriangle
    },
    {
      title: language === 'fr' ? 'Vos droits' : 'Sa jëf',
      content: language === 'fr' 
        ? 'Vous avez le droit de refuser de payer des pots-de-vin. Les services publics sont gratuits.'
        : 'Am nga jëf u nees fey pot-de-vin. Services yu réew mi ñu ngi ligeey.',
      icon: Shield
    },
    {
      title: language === 'fr' ? 'Comment signaler' : 'Na ngeen baxal',
      content: language === 'fr' 
        ? 'Utilisez notre plateforme ou la ligne verte anti-corruption: 800 00 80 80'
        : 'Jëfandikoo nun la plateforme bi walla ligne verte anti-corruption: 800 00 80 80',
      icon: Phone
    }
  ],
  laws: [
    {
      title: language === 'fr' 
        ? 'Article 159 et suivants - Corruption' 
        : 'Article 159 ak topp - Sëpp',
      content: language === 'fr'
        ? `Sera puni d'un emprisonnement de deux à dix ans et d'une amende double 
        de la valeur des promesses agréées ou des choses reçues ou demandées, 
        sans que ladite amende puisse être inférieure à 150.000 francs, 
        quiconque aura sollicité ou agréé des offres ou promesses, sollicité 
        ou reçu des dons ou présents...`
        : `Ku def sëpp dina am 2 ba 10 ans prison, ak amende bu gën a néew 150.000 FCFA, 
        te am ndax ñaari yoon ci valeur yi lañu jël walla lañu may. Ku laaj walla jël dons, 
        cadeaux walla promesses, dina fay.`
    }
  ]
},

   theft: {
  tips: [
    {
      title: language === 'fr' ? 'Sécuriser son domicile' : 'Jëkk sa kër',
      content: language === 'fr' 
        ? 'Installez des serrures solides, éclairage extérieur et système d\'alarme si possible.'
        : 'Doxal serrures yu gëna, éclairage bu bëj kër gi ak système d\'alarme su mën.',
      icon: Home
    },
    {
      title: language === 'fr' ? 'En déplacement' : 'Bu dem',
      content: language === 'fr' 
        ? 'Ne montrez pas vos objets de valeur. Restez vigilant dans les transports en commun.'
        : 'Wontu sa alal yu bari. Tàngal ci transport en commun.',
      icon: Car
    },
    {
      title: language === 'fr' ? 'Téléphone portable' : 'Téléphone portable',
      content: language === 'fr' 
        ? 'Notez votre numéro IMEI. Activez le verrouillage automatique et la géolocalisation.'
        : 'Bind sa nimero IMEI. Doxal verrouillage otomatik ak géolocalisation.',
      icon: Smartphone
    }
  ],
  laws: [
    {
      title: language === 'fr' ? 'Article 364 - Vol' : 'Article 364 - Vol',
      content: language === 'fr'
        ? 'Quiconque a soustrait frauduleusement une chose qui ne lui appartient pas est coupable de vol.'
        : 'Ku jël mbir bu kenn, te du sa bopp, ak manœuvre bu bon, moo doon coupable de vol.'
    }
  ]
},

   violence: {
  tips: [
    {
      title: language === 'fr' ? 'Signaux d\'alarme' : 'Signaux d\'alarme',
      content: language === 'fr' 
        ? 'Menaces, isolement, contrôle excessif, violence physique ou psychologique.'
        : 'Menaces, isolation, contrôle bu bari, fit ci yaram walla ci xel.',
      icon: AlertTriangle
    },
    {
      title: language === 'fr' ? 'Demander de l\'aide' : 'Laaj ndimbalante',
      content: language === 'fr' 
        ? 'Contactez le 3919 (violences femmes), police (17) ou nos services confidentiels.'
        : 'Jokkoo 3919 (fit ci jigéen yi), police (17) walla nun la services yu sutura.',
      icon: Phone
    },
    {
      title: language === 'fr' ? 'Soutenir une victime' : 'Dimbalante ab victim',
      content: language === 'fr' 
        ? 'Écoutez sans juger, encouragez à chercher de l\'aide professionnelle.'
        : 'Déggal bu amul jugement, yàgg ko ngir wut ndimbalante bu professionnel.',
      icon: Users
    }
  ],
  laws: [
    {
      title: 'Article 320 - Définition et peines du viol',
      content: language === 'fr'
        ? 'Tout acte de pénétration sexuelle, de quelque nature qu\'il soit, commis sur la personne d\'autrui par violence, contrainte, menace ou surprise est un viol. Le viol est puni de la réclusion criminelle de dix à vingt ans.'
        : 'Benn jëf bu tënk ci pénétration sexuelle, lu mën am, ci nit bi ci jëfandikoo violence, menace walla surprise, mooy viol. Violation yi dëggu njaboot criminelle 10-20 ans.'
    },
    {
      title: 'Circonstances aggravantes',
      content: language === 'fr'
        ? 'Peines doublées si mutilation, infirmité permanente, séquestration, ou si la victime est mineure ou vulnérable.'
        : 'Peines yu gënëm su bëgg jafe, infirmité permanente, séquestration, walla su nit bi amul njariñ walla vulnérable.'
    },
    {
      title: 'Article 320 bis - Actes pédophiles',
      content: language === 'fr'
        ? 'Tout geste, attouchement, caresse, manipulation pornographique, utilisation d\'images ou de sons à des fins sexuelles sur un enfant de moins de seize ans est puni d\'emprisonnement de cinq à dix ans.'
        : 'Benn jëf, attouchement, caresse, manipulation pornographique, jëf ci images walla sons ci benn xarit bu ndaw 16 ans dëggu emprisonnement 5-10 ans.'
    }
  ]
},
    Arnaque: {
  tips: [
    {
      title: language === 'fr' ? 'Comment reconnaitre ce crime' : 'Naka ngeen xam ne am na benn njub',
      content: language === 'fr' 
        ? 'Messages urgents demandant des informations bancaires. \nPromesses de gains faciles ou de prix à récupérer. \nMenaces de fermeture de compte si pas de réaction immédiate' 
  
        : '.',
      icon: AlertTriangle
    },
    {
      title: language === 'fr' ? 'Comment ce protéger' : 'Laaj ndimbalante',
      content: language === 'fr' 
        ? 'Ne jamais communiquer ses codes bancaires par SMS ou email. \nVérifier l\'identité de l\'expéditeur en contactant directement l\'organisme. \nSe méfier des offres trop alléchantes'
        : '.',
      icon: Phone
    },
    {
      title: language === 'fr' ? 'Ressources Utiles' : ' Ressources Utiles',
      content: language === 'fr' 
        ? 'Numéro vert BCEAO : 8000 (gratuit). \nSite officiel de la BCEAO : www.bceao.int \nContactez votre banque immédiatement en cas de doute.'
        : '.',
      icon: Users
    }
  ],
  laws: [
    {
      title: 'Article 379 bis- Arnaque par sms/mail',
      content: language === 'fr'
        ? `Quiconque aura reçu des avantages ou des commodités matérielles,
         des prestations ou seserait fait fournir des services en employant
          soit des manoeuvres frauduleuses quelconque, soit en faisant usage
           de faux nom ou de fausses qualités, sera puni des peines prévues
            à l\'alinéa premier de l\'article précédent.`
        : '.'
    },
  ]
},

fraude: {
  tips: [
    {
      title: language === 'fr' ? 'Comment reconnaitre ce crime' : 'Naka ngeen xam ne am na benn njub',
      content: language === 'fr' 
        ? 'Transactions non autorisées sur le compte. \nRéception de codes OTP non demandés. \nSites web bancaires avec URL suspecte' 
  
        : '.',
      icon: AlertTriangle
    },
    {
      title: language === 'fr' ? 'Comment ce protéger' : 'Laaj ndimbalante',
      content: language === 'fr' 
        ? 'Ne jamais partager ses codes d\'accès. \nUtiliser uniquement les sites officiels des banques. \nVérifier l\'URL (https://) avant de saisir ses données'
        : '.',
      icon: Phone
    },
    {
      title: language === 'fr' ? 'Ressources Utiles' : ' Ressources Utiles',
      content: language === 'fr' 
        ? 'Service client de votre banque. \nBCEAO - Département de la surveillance bancaire'
        : '.',
      icon: Users
    }
  ],
  laws: [
    {
      title: 'Article 431-16 - Fraude informatique',
      content: language === 'fr'
        ? `Quiconque aura obtenu frauduleusement, pour soi-même ou pour autrui,
         un avantage quelconque, par l’introduction, l’altération, l’effacement
          ou la suppression de données informatisées ou par toute forme d’atteinte
           au fonctionnement d’un système informatique, sera puni d’un emprisonnement
            de un (1) an à cinq (5) ans et d’une amende de 5.000.000 francs à 10.000.000
             francs ou de l’une de ces deux peines seulement.`
        : '.'
    },
  ]
},
phishing: {
  tips: [
    {
      title: language === 'fr' ? 'Comment reconnaitre ce crime' : 'Naka ngeen xam ne am na benn njub',
      content: language === 'fr' 
        ? 'Emails imitant des sites connus (banques, réseaux sociaux). \nURLs légèrement différentes des sites officiels. \nDemandes urgentes de mise à jour de données.' 
  
        : '.',
      icon: AlertTriangle
    },
    {
      title: language === 'fr' ? 'Comment ce protéger' : 'Laaj ndimbalante',
      content: language === 'fr' 
        ? 'Ne pas cliquer sur les liens dans les emails suspects. \nVérifier toujours l\'URL des sites web. \nSaisir manuellement l\'adresse des sites sensibles'
        : '.',
      icon: Phone
    },
    {
      title: language === 'fr' ? 'Ressources Utiles' : ' Ressources Utiles',
      content: language === 'fr' 
        ? 'CERT-SN (Computer Emergency Response Team Sénégal). \nARTP - Autorité de Régulation des Télécommunications'
        : '.',
      icon: Users
    }
  ],
  laws: [
    {
      title: 'Article 431-8 - Phishing/Hameçonnage',
      content: language === 'fr'
        ? `Quiconque aura accédé ou tenté d’accéder frauduleusement à tout ou partie
          d\’un système informatique, sera puni d\’un emprisonnement de six (6) mois à
          trois (3) ans et d\’une amende de 1.000.000 à 10.000.000 francs ou de l’une de ces
          deux peines seulement.
          Est puni des mêmes peines, celui qui se procure ou tente de se procurer
          frauduleusement, pour soi-même ou pour autrui, un avantage quelconque en
          s\’introduisant dans un système informatique`
        : '.'
    },
  ]
},
chantage: {
  tips: [
    {
      title: language === 'fr' ? 'Comment reconnaitre ce crime' : 'Naka ngeen xam ne am na benn njub',
      content: language === 'fr' 
        ? 'Demandes d\'argent en échange de non-diffusion de contenus. \nMenaces de publication de photos/vidéos intimes. \nContacts de personnes inconnues prétendant avoir des preuves compromettantes.' 
  
        : '.',
      icon: AlertTriangle
    },
    {
      title: language === 'fr' ? 'Comment ce protéger' : 'Laaj ndimbalante',
      content: language === 'fr' 
        ? 'Ne jamais envoyer de contenus intimes par internet. \nVérifier l\'identité réelle des personnes rencontrées en ligne. \nNe pas céder au chantage et signaler immédiatement'
        : '.',
      icon: Phone
    },
    {
      title: language === 'fr' ? 'Ressources Utiles' : ' Ressources Utiles',
      content: language === 'fr' 
        ? 'Numéro d\'urgence Police : 17. \nAssociation des Juristes Sénégalaises (AJS)'
        : '.',
      icon: Users
    }
  ],
  laws: [
    {
      title: '363 BIS code pénal -divulgation d\'image ou audio',
      content: language === 'fr'
        ? `Est puni d'un emprisonnement d'un an a cinq ans et d'une amende de 500.000 francs
          a 5.000.000 de francs celui qui, au moyen d'un procédé quelconque, porte volontairement
          atteinte a l'intimité de la vie privée d'autrui en captant, enregistrant,transmettant
          ou diffusant sans le consentement de leur auteur, des paroles prononcées a titre privé
          ou confidentiel en fixant, enregistrant, transmettant ou diffusant, sans le consentement
          de celle-ci l'image d'une personne se trouvant dans un lieu privé`
        : '.'
    },
  ]
}



};

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
      red: 'bg-red-100 text-red-700 border-red-200',
      orange: 'bg-orange-100 text-orange-700 border-orange-200',
      purple: 'bg-purple-100 text-purple-700 border-purple-200',
      green: 'bg-green-100 text-green-700 border-green-200'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };


  const currentCategory = preventionCategories.find(cat => cat.id === selectedCategory);
  const currentContent = preventionContent[selectedCategory as keyof typeof preventionContent];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-gradient-to-br from-green-600 to-green-700 p-4 rounded-2xl shadow-lg inline-block mb-6">
            <Shield className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {language === 'fr' ? 'Prévention & Sensibilisation' : 'Yëgle ak Sensibilisation'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {language === 'fr' 
              ? 'Informez-vous et protégez-vous contre les différents types de crimes. La prévention est votre meilleure défense.'
              : 'Xibaar ak jëkk sa bopp ci mbind njub yi. Yëgle mooy sa défense bu gën.'
            }
          </p>
        </div>

        {/* Category Selection */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {language === 'fr' ? 'Choisissez un domaine' : 'Tànn ab domaine'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {preventionCategories.map((category) => {
              const IconComponent = category.icon;
              const isSelected = selectedCategory === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    isSelected 
                      ? `${getColorClasses(category.color)} border-current shadow-lg transform scale-105`
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <IconComponent className={`h-8 w-8 mb-3 ${
                    isSelected ? 'text-current' : 'text-gray-400'
                  }`} />
                  <h3 className={`font-semibold mb-2 ${
                    isSelected ? 'text-current' : 'text-gray-900'
                  }`}>
                    {category.name}
                  </h3>
                  <p className={`text-sm ${
                    isSelected ? 'text-current opacity-80' : 'text-gray-600'
                  }`}>
                    {category.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Category Header */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                {currentCategory && (
                  <>
                    <div className={`p-3 rounded-xl ${getColorClasses(currentCategory.color)}`}>
                      <currentCategory.icon className="h-8 w-8" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{currentCategory.name}</h2>
                      <p className="text-gray-600">{currentCategory.description}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Prevention Tips */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {language === 'fr' ? 'Conseils de Prévention' : 'Tànneef yu Yëgle'}
              </h3>
              <div className="space-y-4">
                {currentContent?.tips.map((tip, index) => {
                  const IconComponent = tip.icon;
                  const isExpanded = expandedTip === `${selectedCategory}-${index}`;
                  
                  return (
                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setExpandedTip(isExpanded ? null : `${selectedCategory}-${index}`)}
                        className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="bg-blue-100 p-2 rounded-lg">
                              <IconComponent className="h-5 w-5 text-blue-600" />
                            </div>
                            <h4 className="font-semibold text-gray-900">{tip.title}</h4>
                          </div>
                          <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform ${
                            isExpanded ? 'rotate-90' : ''
                          }`} />
                        </div>
                      </button>
                      {isExpanded && (
                       <div className="px-4 pb-4">
                            <p 
                              style={{ whiteSpace: "pre-line" }} 
                              className="text-gray-700 leading-relaxed pl-12"
                            >
                              {tip.content}
                            </p>
                          </div>

                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Emergency Actions */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4">
                🚨 {language === 'fr' ? 'En cas d\'urgence' : 'Su fekkee caxaan'}
              </h3>
              <p className="text-red-100 mb-4">
                {language === 'fr' 
                  ? 'Si vous êtes victime ou témoin d\'un crime, agissez rapidement'
                  : 'Su fekkee nga victim walla témoin ab njub, jëf ci gaaw'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => window.location.href = 'tel:17'}
                  className="bg-white text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-red-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <Phone className="h-4 w-4" />
                  <span>17 - Police</span>
                </button>
                <button
                  onClick={() => onPageChange('report')}
                  className="bg-red-800 hover:bg-red-900 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  {language === 'fr' ? 'Signaler maintenant' : 'Baxal leegi'}
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
           <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {language === 'fr' ? 'Articles de loi' : 'Articles yu loi'}
            </h3>
            <div className="space-y-3">
              {currentContent?.laws.map((law, index) => (
                <div 
                  key={index} 
                  className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="bg-blue-100 p-2 rounded">
                      <BookOpen className="h-4 w-4 text-blue-600" />
                    </div>
                    <p className="font-medium text-gray-900 text-sm">{law.title}</p>
                  </div>
                  {law.content && (
                    <p className="text-xs text-gray-600 leading-relaxed">{law.content}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {language === 'fr' ? 'Actions Rapides' : 'Jëf yu Gaaw'}
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => onPageChange('report')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <AlertTriangle className="h-4 w-4" />
                  <span>{language === 'fr' ? 'Signaler un crime' : 'Baxal ab njub'}</span>
                </button>
                <button
                  onClick={() => onPageChange('emergency')}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <Phone className="h-4 w-4" />
                  <span>{language === 'fr' ? 'Contacts d\'urgence' : 'Jokkoo yu caxaan'}</span>
                </button>
                <button
                    onClick={() => onPageChange('emergency')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>{language === 'fr' ? 'Guide complet' : 'Guide complet'}</span>
                  </button>
                
              </div>
            </div>

    
          </div>
        </div>
      </div>
    </div>
  );
};