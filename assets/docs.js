/* RETOUR90 — les dossiers : anecdotes et mots-clés vidéo par fiche.
   Clé = slug du titre de la fiche. Toute fiche sans entrée ici reçoit
   quand même un dossier générique (texte + vidéos trouvées + commentaires). */
window.DOCS={

/* ---------- OBJETS ---------- */
'tamagotchi':{q:'tamagotchi',plus:[
 'Lancé au Japon fin 1996, arrivé en France au printemps 1997 : 40 millions d’exemplaires vendus dans le monde en deux ans.',
 'Des écoles françaises l’ont interdit dès la rentrée 1997 — trop d’élèves le nourrissaient sous la table. Certains parents le gardaient en vie pendant les heures de classe.',
 'Il existait un cimetière virtuel en ligne pour Tamagotchi décédés. Des gens y laissaient de vrais messages de deuil.']},
'furby':{q:'furby',plus:[
 'Le Furby parlait d’abord « furbish », puis apprenait progressivement des mots de français. Beaucoup ont juré l’avoir entendu parler la nuit.',
 'En 1999, la NSA a interdit les Furby dans ses locaux, craignant qu’ils enregistrent des conversations. Ils n’enregistraient rien — mais le mythe était trop beau.']},
'le-walkman':{q:'walkman sony baladeur',plus:[
 'Le premier Walkman date de 1979, mais c’est dans les années 90 qu’il devient universel, avec l’anti-choc et l’autoreverse — plus besoin de retourner la cassette.',
 'L’autonomie se comptait en piles AA. On les rechargeait au congélateur, ce qui ne marchait pas, mais tout le monde le faisait quand même.']},
'le-minitel':{q:'minitel',plus:[
 'Distribué gratuitement par France Télécom dès 1982 pour remplacer l’annuaire papier. Au sommet, 25 000 services et des milliards de francs de chiffre d’affaires.',
 'Le 3615 coûtait environ 1 franc la minute. La ligne de la facture « services télématiques » a provoqué des milliers de conversations familiales tendues.',
 'Le Minitel n’a été éteint qu’en juin 2012 — il a survécu treize ans à l’an 2000.']},
'le-bi-bop':{q:'bi-bop bibop',plus:[
 'Lancé à Paris en 1993 : le téléphone ne marchait qu’à moins de 300 mètres d’une borne, signalée par un autocollant bleu-blanc sur les poteaux.',
 'On ne pouvait pas recevoir d’appel en marchant — seulement en appeler. Les Parisiens s’agglutinaient sous les bornes comme des fumeurs sous un auvent.']},
'le-tatoo':{q:'tatoo france telecom',plus:[
 'Le Tatoo affichait des messages numériques ou du texte court. Le rituel : recevoir un « bip », trouver une cabine, rappeler. La conversation avait donc toujours un temps de retard.',
 'Son concurrent chez SFR s’appelait le Tam-Tam. La guerre des bippers a duré trois ans, puis le portable a tout balayé.']},
'nokia-3210':{q:'nokia',plus:[
 '160 millions d’exemplaires vendus : l’un des téléphones les plus vendus de l’histoire. Antenne interne — une révolution esthétique à l’époque.',
 'Snake se jouait avec les touches 2, 4, 6, 8. Le record du lycée valait une réputation durable.',
 'Les coques Xpress-on interchangeables ont créé tout un marché de contrefaçons au marché du samedi.']},
'la-disquette-3-5':{q:'disquette ordinateur windows',plus:[
 '1,44 Mo : une seule photo de smartphone actuel ne tiendrait pas dessus. On y mettait pourtant l’exposé, trois jeux shareware et le CV des parents.',
 'Le loquet de protection en écriture — la petite languette qu’on faisait coulisser — était le premier geste de sécurité informatique d’une génération.']},
'le-cd-rom-aol':{q:'aol internet en ligne',plus:[
 'AOL a pressé plus d’un milliard de CD promotionnels dans le monde. À un moment, la moitié des CD produits sur Terre étaient des CD AOL.',
 'Les « 100 heures gratuites » exigeaient un numéro de carte bancaire. Beaucoup de familles ont découvert l’abonnement reconduit sur la facture, trois mois plus tard.']},
'l-appareil-photo-jetable':{q:'kodak pellicule photo',plus:[
 'Le jetable, c’était 27 poses — parfois 24. On cadrait dans un viseur minuscule, sans mise au point, et le flash se chargeait avec un sifflement strident.',
 'Le développement en une heure au centre commercial était un luxe. Le standard, c’était trois jours à une semaine — et l’enveloppe des tirages s’ouvrait toujours dans la voiture.']},
'la-telecarte':{q:'telecarte cabine telephonique france telecom',plus:[
 'La France comptait environ 300 000 cabines au milieu des années 90. La télécarte à puce, invention française, s’est vendue à des centaines de millions d’exemplaires.',
 'Les télécartes publicitaires sont devenues des objets de collection cotés, avec argus, salons et vitrines dédiées.']},
'le-magnetoscope':{q:'magnetoscope vhs philips',plus:[
 'Programmer un enregistrement demandait de comprendre le ShowView, un code numérique publié dans les programmes télé. Peu y sont arrivés du premier coup.',
 'La bataille VHS contre Betamax et V2000 était déjà gagnée en 1990 — mais les cassettes V2000 des familles pionnières traînent encore dans des cartons, illisibles.']},
'les-pogs':{q:'pog',plus:[
 'Le jeu vient d’Hawaï : des capsules de jus de fruit Passion-Orange-Goyave — P.O.G. En France, l’explosion date de 1995, via les paquets de chips et les fast-foods.',
 'La règle officielle se jouait « pour de vrai » : les POGS retournés étaient gagnés définitivement. C’est cette règle qui a fait interdire le jeu dans les écoles — c’était du jeu d’argent en carton.']},
'les-panini-france-98':{q:'france 98 coupe du monde',plus:[
 'L’album France 98 comptait 561 vignettes. Les doubles s’échangeaient à la récré selon un cours du jour parfaitement connu de tous.',
 'La légende de la « vignette introuvable » était vraie : certaines étaient imprimées en quantités moindres. Panini ne l’a jamais officiellement confirmé pour 98.']},
'les-cartes-pokemon':{q:'pokemon france',plus:[
 'Le jeu de cartes arrive en France fin 1999, après la Game Boy et le dessin animé. En quelques mois, des écoles l’interdisent — rackets et échanges en larmes à la clé.',
 'Le Dracaufeu première édition, introuvable alors, se vend aujourd’hui plusieurs dizaines de milliers d’euros aux enchères.']},
'les-billes':{q:'billes recreation',plus:[
 'La hiérarchie officielle : la bille simple, l’œil-de-chat, l’agate, le calot (gros), le boulard (énorme). Les taux de change variaient d’une cour à l’autre, comme des monnaies locales.',
 'Le « pot » — creuser un trou et y faire rouler les billes — était interdit dans la moitié des écoles pour cause de trous dans la cour.']},
'le-yo-yo-a-roulement':{q:'yo-yo jouet noel',plus:[
 'Le grand retour du yo-yo (1998) venait des modèles à roulement à billes capables de « dormir » en bas du fil — la condition de toutes les figures.',
 '« La promenade du chien », « la tour Eiffel », « le berceau » : un répertoire complet de figures circulait par démonstration, de cour en cour.']},
'le-scoubidou':{q:'scoubidou recreation',plus:[
 'Les fils plastiques se vendaient en mercerie et en papeterie. Deux fils pour apprendre, quatre pour frimer, huit pour les virtuoses des colonies de vacances.',
 'Le mot vient de la chanson de Sacha Distel (1958) — la mode des années 90 était déjà un revival de celle des années 60.']},

/* ---------- MIAM ---------- */
'malabar':{q:'malabar pub',plus:[
 'Le personnage jaune musclé s’appelle simplement « Monsieur Malabar ». Les tatouages à l’eau sont apparus dans les années 70 et ont survécu jusqu’aux années 2000.',
 'Technique officielle de cour de récré : lécher le bras, appliquer, appuyer dix secondes, retirer lentement. Taux d’échec : 40 %, toujours au moment du retrait.']},
'carambar':{q:'carambar pub',plus:[
 'Né en 1954 d’une machine mal réglée qui produisait des barres trop longues — la légende officielle de la marque, parfaitement invérifiable et parfaitement adoptée.',
 'Les blagues apparaissent en 1969. « Blague Carambar » est depuis passé dans la langue comme catégorie officielle de l’humour français.']},
'pitch-contre-choco-bn':{q:'bn biscuit pub gouter',plus:[
 'Le BN au chocolat et son visage découpé datent de 1993 — les yeux et le sourire troués dans le biscuit, qu’on mangeait toujours en premier.',
 'Le Pitch de Pasquier a gagné la guerre du cartable sur un argument simple : il ne s’émiettait pas. Le BN, lui, laissait des indices au fond du sac.']},
'tang-nesquik':{q:'nesquik pub',plus:[
 'Le Tang se préparait censément dans un litre d’eau. Dans la pratique, la poudre se mangeait au doigt, directement au pot, en surveillant la porte de la cuisine.',
 'Quik est devenu Nesquik en 1999. Le lapin, lui, n’a jamais changé de métier.']},
'champomy':{q:'champomy pub',plus:[
 'Lancé en 1990 : du pur jus de pomme gazéifié dans une bouteille de champagne, bouchon qui saute compris. Le nom est un mot-valise devenu générique.',
 'C’était la première expérience de « trinquer comme les grands » — la sociologie du repas de fête française en 75 cl sans alcool.']},
'chocapic-frosties-tresor':{q:'chocapic frosties cereales pub',plus:[
 'Pico le chien arrive sur les boîtes de Chocapic au début des années 90. Tony le Tigre, lui, rugissait déjà depuis 1952 aux États-Unis.',
 'Le vrai débat du mercredi : verser les céréales avant ou après le lait. Les « après » étaient minoritaires mais organisés.']},
'yop-danette-flanby':{q:'yop danette flanby pub',plus:[
 'Le Yop se buvait au goulot en secouant d’abord — le geste faisait partie du produit. La pub des années 90 en a fait un marqueur d’adolescence.',
 'Le coup sec du Flanby retourné — d’un seul geste, caramel dessus — se transmettait de parent à enfant comme un savoir-faire artisanal.']},
'kiri-babybel-ficello':{q:'kiri babybel pub fromage',plus:[
 'La cire rouge du Babybel était officiellement un emballage. Officieusement : une pâte à modeler fournie avec le goûter, roulée en boule sur tous les bureaux de France.',
 'Le Ficello s’effilochait en rubans — le manger d’un coup était considéré comme un gâchis pur et simple.']},
'mystere-calippo-pouss-pouss':{q:'glace pub miko',plus:[
 'Le Mystère — vanille, cœur meringue, éclats de noisette — doit son nom au fait qu’on ne savait pas ce qu’il y avait au centre. Le marketing le plus honnête de la décennie.',
 'Le Calippo se poussait par en dessous, et le dernier tiers se buvait fondu, directement au tube. C’était prévu par le fabricant, et c’était le meilleur moment.']},
'pom-potes':{q:'pompotes compote pub',plus:[
 'Lancées en 1997 par Materne : la compote en gourde, à boire debout, en marchant, sans cuillère. Une petite révolution logistique du goûter.',
 'Le geste final — écraser la gourde pour aspirer la dernière goutte — produisait un bruit reconnu par toute une génération.']},
'le-mcdo-du-samedi':{q:'mcdonald pub france',plus:[
 'Le premier McDonald’s français ouvre à Strasbourg en 1979, mais l’explosion date des années 90 : plus de 500 restaurants ouverts dans la décennie.',
 'Le Happy Meal et son jouet sous licence — Disney surtout — a transformé le repas en événement à collectionner. La piscine à balles a fait le reste.']},
'le-ketchup-du-vendredi':{q:'cantine ecole reportage',plus:[
 'Le menu de cantine des années 90 avait ses classiques absolus : frites du vendredi, épinards redoutés, et le carré de chocolat glissé dans le pain à 16h.',
 'Le lait aromatisé à la fraise teintait tout en rose, y compris les souvenirs.']},

/* ---------- QUELQUES DOSSIERS PHARES AILLEURS ---------- */
'club-dorothee':{q:'club dorothee',plus:[
 'Jusqu’à 30 heures d’antenne par semaine au début des années 90 — un record absolu pour une émission jeunesse européenne.',
 'L’arrêt en août 1997 s’est fait sans véritable adieu à l’antenne. Le procès en violence fait aux dessins animés japonais y a beaucoup contribué.']},
'fort-boyard':{q:'fort boyard',plus:[
 'Le fort, au large de La Rochelle, a été acheté par le département en 1988 pour un franc symbolique. L’émission est aujourd’hui vendue dans plus de 30 pays.',
 'Le Père Fouras s’appelle ainsi à cause de la ville de Fouras, en face du fort. Ses énigmes sont écrites par une équipe dédiée depuis 1990.']},
'mega-drive':{q:'sega mega drive',plus:[
 '« SEGA, c’est plus fort que toi » est signé de l’agence française de SEGA en 1992. Le slogan a survécu à la console, à la marque, et à la décennie.',
 'Sonic a été conçu explicitement pour battre Mario en vitesse — le personnage devait être compréhensible en une image : bleu, piquant, pressé.']},
'game-boy':{q:'game boy nintendo',plus:[
 'L’écran n’était même pas rétroéclairé, l’autonomie atteignait 30 heures. C’est exactement ce compromis qui a écrasé ses concurrentes en couleur.',
 'Tetris était vendu avec la console en Europe : le meilleur bundle de l’histoire du jeu vidéo, et la raison pour laquelle tout le monde y a joué, parents compris.']},
'playstation':{q:'playstation sony pub',plus:[
 'La PlayStation est née d’un divorce : Sony développait un lecteur CD pour Nintendo, qui a rompu l’accord en public. Sony a transformé l’humiliation en console.',
 'En France, la pub de lancement et le « Comité Anti-PlayStation » ont fait scandale et parlé d’eux — exactement comme prévu.']}
};
