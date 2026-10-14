import {
  ARCH_LAYER_LABEL,
  apiExamples,
  architectures,
  caseStudies,
  dbModel,
  projectEngineering,
} from "../data/engineering";
import type {
  ApiExample,
  ArchLayer,
  ArchNode,
  Architecture,
  CaseStudy,
  DbEntity,
  DbRelation,
  LifecycleStep,
  ProjectEngineering,
} from "../data/engineering";
import type { Locale } from "./locale";

/**
 * Localized engineering content. The English layer reuses `data/engineering.ts`
 * verbatim (no text is copied); French and Arabic translate the prose while
 * keeping technology names, routes, HTTP status codes, column names and URLs
 * identical across every locale.
 *
 * The shape mirrors the source data so the engineering components can consume
 * it unchanged. Translations are authored as overrides keyed by stable ids
 * (node id, edge `from->to`, entity id, example id, case-study id, project
 * title), so non-translatable fields are inherited from the English source.
 */

export interface DbModelContent {
  name: string;
  note: string;
  entities: DbEntity[];
  relations: DbRelation[];
}

export interface EngineeringContent {
  archLayerLabel: Record<ArchLayer, string>;
  architectures: Architecture[];
  dbModel: DbModelContent;
  apiExamples: ApiExample[];
  caseStudies: CaseStudy[];
  projectEngineering: ProjectEngineering[];
}

/* ------------------------------------------------------------------ */
/* Override shapes                                                     */
/* ------------------------------------------------------------------ */

type NodeText = Pick<ArchNode, "short" | "label" | "responsibility" | "io">;
type StepText = Partial<Pick<LifecycleStep, "title" | "what" | "detail" | "status">>;

interface ArchText {
  name: string;
  subtitle: string;
  note: string;
  nodes: Record<string, NodeText>;
  edges: Record<string, string>;
  lifecycle: StepText[];
}

interface DbText {
  name: string;
  note: string;
  entities: Record<string, { purpose: string; notes?: Record<string, string> }>;
  relations: Record<string, string>;
}

interface ApiText {
  title: string;
  description: string;
  auth: string;
  why?: string;
}

interface CaseText {
  project: string;
  summary: string;
  problem: string;
  constraints: string[];
  architecture: string;
  decision: string;
  rationale: string;
  alternatives: { option: string; tradeoff: string }[];
  quality: { label: string; value: string }[];
  improvements: string[];
}

interface ProjText {
  problem: string;
  contribution: string;
  dataNotes: string;
  apiNotes: string;
  quality: string;
}

/* ------------------------------------------------------------------ */
/* Builders                                                            */
/* ------------------------------------------------------------------ */

function buildArchitectures(overrides: Record<string, ArchText>): Architecture[] {
  return architectures.map((arch) => {
    const o = overrides[arch.id];
    return {
      ...arch,
      name: o.name,
      subtitle: o.subtitle,
      note: o.note,
      stack: [...arch.stack],
      nodes: arch.nodes.map((node) => ({
        ...node,
        tech: [...node.tech],
        ...o.nodes[node.id],
      })),
      edges: arch.edges.map((edge) => {
        const label = o.edges[`${edge.from}->${edge.to}`];
        return label !== undefined ? { ...edge, label } : { ...edge };
      }),
      lifecycle: arch.lifecycle.map((step, i) => ({ ...step, ...o.lifecycle[i] })),
    };
  });
}

function buildDb(o: DbText): DbModelContent {
  return {
    name: o.name,
    note: o.note,
    entities: dbModel.entities.map((entity) => {
      const over = o.entities[entity.id];
      return {
        ...entity,
        purpose: over.purpose,
        attributes: entity.attributes.map((attr) => {
          const note = over.notes?.[attr.name];
          return note !== undefined ? { ...attr, note } : { ...attr };
        }),
      };
    }),
    relations: dbModel.relations.map((relation) => {
      const label = o.relations[`${relation.from}->${relation.to}`];
      return label !== undefined ? { ...relation, label } : { ...relation };
    }),
  };
}

function buildApi(o: Record<string, ApiText>): ApiExample[] {
  return apiExamples.map((example) => {
    const t = o[example.id];
    return {
      ...example,
      title: t.title,
      description: t.description,
      auth: t.auth,
      errorCase: example.errorCase
        ? { ...example.errorCase, why: t.why ?? example.errorCase.why }
        : undefined,
    };
  });
}

function buildCases(o: Record<string, CaseText>): CaseStudy[] {
  return caseStudies.map((cs) => {
    const t = o[cs.id];
    return {
      ...cs,
      project: t.project,
      summary: t.summary,
      problem: t.problem,
      constraints: [...t.constraints],
      architecture: t.architecture,
      decision: t.decision,
      rationale: t.rationale,
      alternatives: t.alternatives.map((a) => ({ ...a })),
      quality: t.quality.map((q) => ({ ...q })),
      improvements: [...t.improvements],
      repo: cs.repo,
    };
  });
}

function buildProjects(o: Record<string, ProjText>): ProjectEngineering[] {
  return projectEngineering.map((project) => {
    const t = o[project.title];
    return {
      ...project,
      problem: t.problem,
      contribution: t.contribution,
      dataNotes: t.dataNotes,
      apiNotes: t.apiNotes,
      quality: t.quality,
      backend: [...project.backend],
      frontend: [...project.frontend],
    };
  });
}

/* ------------------------------------------------------------------ */
/* English                                                             */
/* ------------------------------------------------------------------ */

const en: EngineeringContent = {
  archLayerLabel: { ...ARCH_LAYER_LABEL },
  architectures: architectures.map((arch) => ({
    ...arch,
    stack: [...arch.stack],
    nodes: arch.nodes.map((node) => ({ ...node, tech: [...node.tech] })),
    edges: arch.edges.map((edge) => ({ ...edge })),
    lifecycle: arch.lifecycle.map((step) => ({ ...step })),
  })),
  dbModel: {
    name: dbModel.name,
    note: dbModel.note,
    entities: dbModel.entities.map((entity) => ({
      ...entity,
      attributes: entity.attributes.map((attr) => ({ ...attr })),
    })),
    relations: dbModel.relations.map((relation) => ({ ...relation })),
  },
  apiExamples: apiExamples.map((example) => ({ ...example })),
  caseStudies: caseStudies.map((cs) => ({
    ...cs,
    constraints: [...cs.constraints],
    alternatives: cs.alternatives.map((alt) => ({ ...alt })),
    quality: cs.quality.map((q) => ({ ...q })),
    improvements: [...cs.improvements],
  })),
  projectEngineering: projectEngineering.map((project) => ({
    ...project,
    backend: [...project.backend],
    frontend: [...project.frontend],
  })),
};

/* ------------------------------------------------------------------ */
/* French                                                              */
/* ------------------------------------------------------------------ */

const FR_ARCH_LAYER_LABEL: Record<ArchLayer, string> = {
  client: "Client",
  entry: "Point d'entrée",
  security: "Transversal",
  mapping: "Transversal",
  service: "Logique métier",
  repository: "Persistance",
  store: "Stockage de données",
  ops: "Exploitation",
};

const FR_ARCH_NOTE =
  "Vue illustrative de l'architecture de ce projet, reconstruite à partir de sa stack et de ses fonctionnalités documentées — et non de la disposition d'origine du code source.";

const FR_ARCH: Record<string, ArchText> = {
  inventory: {
    name: "Stocks et commandes fournisseurs",
    subtitle: "Spring Boot · service REST en couches",
    note: FR_ARCH_NOTE,
    nodes: {
      client: {
        short: "Client web",
        label: "Client web",
        responsibility:
          "Envoie les appels REST et affiche les vues des commandes fournisseurs et des stocks.",
        io: "Requête HTTPS entrante · réponse JSON sortante",
      },
      entry: {
        short: "Contrôleurs REST",
        label: "API REST — contrôleurs Spring MVC",
        responsibility:
          "Définit le contrat REST, lie et valide les requêtes, et renvoie des DTO avec des codes de statut HTTP explicites.",
        io: "Méthode + chemin HTTP entrants · DTO + statut sortants",
      },
      mapping: {
        short: "DTO et mappage",
        label: "DTO, validation et mappage",
        responsibility:
          "Sépare le contrat d'API des entités : Bean Validation rejette les entrées invalides, MapStruct mappe entité ↔ DTO.",
        io: "Rejet des entrées invalides (400) · mappage entité ↔ DTO",
      },
      service: {
        short: "Couche service",
        label: "Couche service",
        responsibility:
          "Porte les règles métier et les frontières transactionnelles — commandes fournisseurs et valorisation des stocks au coût moyen pondéré (CUMP).",
        io: "Opérations métier entrantes · entités/commandes sortantes",
      },
      repository: {
        short: "Dépôts",
        label: "Dépôts Spring Data JPA",
        responsibility:
          "Accès aux données sur le modèle relationnel : mappage des entités, requêtes dérivées et persistance.",
        io: "Entités ↔ lignes",
      },
      store: {
        short: "MySQL",
        label: "Base de données MySQL",
        responsibility:
          "Stockage relationnel durable pour les produits, fournisseurs, commandes et mouvements de stock.",
        io: "Requêtes SQL",
      },
      ops: {
        short: "Liquibase",
        label: "Migrations de schéma",
        responsibility:
          "Modifications du schéma de base de données versionnées et reproductibles, appliquées au démarrage.",
        io: "Changelogs → schéma",
      },
    },
    edges: {
      "entry->mapping": "valider",
      "entry->service": "commande",
      "mapping->service": "DTO mappé",
      "ops->store": "schéma",
      "service->entry": "DTO résultant",
    },
    lifecycle: [
      {
        title: "Le client envoie la requête",
        what: "Le navigateur émet une requête HTTP avec un corps JSON.",
        detail:
          "Exemple : POST /api/supplier-orders avec supplierId, orderDate et une liste de lignes (productId, quantity, unitCost).",
        status: "→ requête HTTP",
      },
      {
        title: "Le contrôleur reçoit et valide",
        what: "Spring MVC lie le corps à un DTO et exécute Bean Validation.",
        detail:
          "Les charges invalides échouent rapidement avec 400 Bad Request et un corps d'erreur champ par champ ; les charges valides passent au service.",
        status: "400 si invalide",
      },
      {
        title: "Le service applique les règles métier",
        what: "La couche service exécute la logique métier dans une frontière transactionnelle.",
        detail:
          "@Transactional ouvre une unité de travail. La commande est créée et le coût moyen pondéré (CUMP) est recalculé pour les produits concernés.",
        status: "→ @Transactional",
      },
      {
        title: "Le dépôt persiste",
        what: "Spring Data JPA / Hibernate traduit les entités en SQL.",
        detail:
          "L'en-tête et les lignes de commande sont persistés et les identifiants générés sont reportés sur les entités gérées.",
        status: "→ INSERT",
      },
      {
        title: "La base de données stocke",
        what: "MySQL exécute les instructions dans la transaction.",
        detail:
          "Si une instruction échoue, toute l'unité de travail est annulée, de sorte qu'aucune commande partielle ne persiste.",
        status: "commit / rollback",
      },
      {
        title: "Mappage et sérialisation",
        what: "L'entité est mappée vers un DTO de réponse et sérialisée en JSON.",
        detail:
          "MapStruct garde le format d'échange découplé du modèle de persistance ; le contrôleur renvoie 201 Created avec un en-tête Location.",
        status: "201 Created",
      },
    ],
  },
  teleexpertise: {
    name: "Télé-expertise médicale",
    subtitle: "Jakarta EE · servlet + Hibernate",
    note: FR_ARCH_NOTE,
    nodes: {
      client: {
        short: "Client web",
        label: "Client web",
        responsibility:
          "L'interface utilisée par les infirmiers, les médecins généralistes et les spécialistes.",
        io: "Requête HTTP entrante · réponse rendue sortante",
      },
      entry: {
        short: "Couche web / contrôleur",
        label: "Couche web Jakarta EE",
        responsibility:
          "Reçoit les requêtes, les oriente vers le bon cas d'usage et prépare la réponse.",
        io: "HTTP entrant · appels métier sortants",
      },
      security: {
        short: "Auth et rôles",
        label: "Authentification et accès basé sur les rôles",
        responsibility:
          "Authentifie l'acteur et autorise chaque action selon le rôle — infirmier, médecin généraliste ou spécialiste.",
        io: "Identité + rôle entrants · autoriser / refuser",
      },
      service: {
        short: "Services métier",
        label: "Couche de services métier",
        responsibility:
          "Le parcours de soins : demandes d'expertise, planification et remise des avis médicaux.",
        io: "Cas d'usage entrants · entités sortantes",
      },
      repository: {
        short: "DAO Hibernate",
        label: "Couche de persistance Hibernate",
        responsibility:
          "Mappage objet-relationnel et accès aux données pour la couche de persistance.",
        io: "Entités ↔ lignes",
      },
      store: {
        short: "PostgreSQL",
        label: "Base de données PostgreSQL",
        responsibility:
          "Stockage relationnel pour les patients, les consultations, les demandes d'expertise et les avis médicaux.",
        io: "Requêtes SQL",
      },
    },
    edges: {
      "client->entry": "Requête HTTP",
      "entry->security": "vérifier le rôle",
      "security->service": "autorisé",
      "entry->client": "résultat",
    },
    lifecycle: [
      {
        title: "L'acteur envoie une requête",
        what: "Un infirmier, un médecin généraliste ou un spécialiste soumet une action depuis l'interface.",
        detail:
          "Exemple : un spécialiste ouvre une demande d'expertise qui lui est assignée pour publier un avis médical.",
        status: "→ requête HTTP",
      },
      {
        title: "La couche web l'oriente",
        what: "La couche web Jakarta EE mappe la requête vers un cas d'usage.",
        detail:
          "Les paramètres de la requête sont lus et transmis à la couche service.",
      },
      {
        title: "Authentification et autorisation",
        what: "L'acteur est authentifié et comparé au rôle requis.",
        detail:
          "Le contrôle d'accès basé sur les rôles décide si un infirmier, un médecin généraliste ou un spécialiste peut effectuer l'action, et la refuse sinon.",
        status: "401 / 403",
      },
      {
        title: "Les règles métier s'exécutent",
        what: "La logique de workflow et la frontière transactionnelle sont appliquées.",
        detail:
          "Les demandes d'expertise, la planification et la remise des avis sont coordonnées comme une seule unité de travail.",
        status: "→ transaction",
      },
      {
        title: "Hibernate persiste",
        what: "Les entités sont mappées vers des lignes via Hibernate.",
        detail: "L'ORM génère les instructions et gère la session.",
      },
      {
        title: "PostgreSQL stocke",
        what: "La base de données valide la modification.",
        detail:
          "Une défaillance annule la transaction, préservant la cohérence de l'enregistrement.",
        status: "commit / rollback",
      },
    ],
  },
  store: {
    name: "Boutique en ligne et stocks",
    subtitle: "Vue.js · Laravel MVC",
    note: FR_ARCH_NOTE,
    nodes: {
      client: {
        short: "SPA Vue.js",
        label: "Application monopage Vue.js",
        responsibility:
          "Interface de boutique et de back-office à base de composants qui appelle l'API.",
        io: "Appels d'API JSON · jeton dans l'en-tête",
      },
      entry: {
        short: "Routes Laravel",
        label: "Routes et contrôleurs Laravel",
        responsibility:
          "Définit les points de terminaison et le traitement des requêtes pour la boutique et les stocks.",
        io: "HTTP entrant · validation sortante",
      },
      security: {
        short: "Sanctum et rôles",
        label: "Authentification par jetons Laravel Sanctum et rôles",
        responsibility:
          "Émet et valide les jetons d'API, et applique les rôles pour les administrateurs, les commerciaux et les gestionnaires produits.",
        io: "Jeton entrant · autoriser / refuser",
      },
      service: {
        short: "Logique métier",
        label: "Logique métier (MVC)",
        responsibility:
          "Panier, traitement des commandes, facturation et import Excel comme services de modèle.",
        io: "Cas d'usage entrants · modèles sortants",
      },
      repository: {
        short: "Eloquent ORM",
        label: "Eloquent ORM",
        responsibility:
          "Mappage active-record entre les modèles PHP et les tables.",
        io: "Modèles ↔ lignes",
      },
      store: {
        short: "PostgreSQL",
        label: "Base de données PostgreSQL",
        responsibility:
          "Stockage relationnel pour les produits, commandes, factures et utilisateurs.",
        io: "Requêtes SQL",
      },
    },
    edges: {
      "client->entry": "appel API",
      "entry->security": "vérifier le jeton",
      "security->service": "autorisé",
    },
    lifecycle: [
      {
        title: "La SPA appelle l'API",
        what: "Le frontend Vue.js demande des données avec un jeton bearer.",
        detail: "Exemple : POST /api/orders avec le contenu du panier en JSON.",
        status: "→ appel API",
      },
      {
        title: "Routage et validation de la requête",
        what: "Laravel valide la requête selon les règles.",
        detail: "Une validation échouée renvoie 422 avec les champs en cause.",
        status: "422 si invalide",
      },
      {
        title: "Authentification par jeton",
        what: "Sanctum résout le jeton en un utilisateur et vérifie le rôle.",
        detail:
          "Seuls les rôles autorisés atteignent le traitement des commandes ; les autres sont refusés.",
        status: "401 / 403",
      },
      {
        title: "La logique métier s'exécute",
        what: "Le traitement des commandes, les totaux et la génération de factures s'exécutent.",
        detail:
          "Encapsulé pour qu'un échec ne laisse aucune commande à moitié écrite.",
        status: "→ transaction",
      },
      {
        title: "Eloquent persiste",
        what: "Les modèles sont écrits via l'ORM.",
        detail: "Les relations gèrent les lignes liées, comme les lignes de commande.",
      },
      {
        title: "PostgreSQL stocke",
        what: "La base de données valide la transaction.",
        detail: "L'API répond avec la commande créée.",
        status: "201 Created",
      },
    ],
  },
  events: {
    name: "Gestion d'événements",
    subtitle: "Laravel · application web MVC",
    note: FR_ARCH_NOTE,
    nodes: {
      client: {
        short: "Interface web",
        label: "Interface web — Blade + TailwindCSS",
        responsibility:
          "Pages rendues côté serveur pour les organisateurs, artistes, participants et administrateurs.",
        io: "Requête HTTP entrante · HTML sortant",
      },
      entry: {
        short: "Contrôleurs Laravel",
        label: "Contrôleurs Laravel",
        responsibility:
          "Gère les points de terminaison de gestion des événements et de participation.",
        io: "HTTP entrant · validation sortante",
      },
      security: {
        short: "Auth et rôle admin",
        label: "Authentification et rôle d'administrateur",
        responsibility:
          "Protège le tableau de bord d'administration et distingue les actions des organisateurs, artistes et participants.",
        io: "Session / rôle entrants · autoriser / refuser",
      },
      service: {
        short: "Logique MVC",
        label: "Logique métier MVC",
        responsibility:
          "Création, gestion et parcours de participation aux événements.",
        io: "Cas d'usage entrants · modèles sortants",
      },
      repository: {
        short: "Eloquent ORM",
        label: "Eloquent ORM",
        responsibility:
          "Mappage modèle ↔ table pour les événements et les participants.",
        io: "Modèles ↔ lignes",
      },
      store: {
        short: "PostgreSQL",
        label: "Base de données PostgreSQL",
        responsibility:
          "Stockage relationnel pour les événements, les artistes et les participants.",
        io: "Requêtes SQL",
      },
    },
    edges: {},
    lifecycle: [
      {
        title: "L'utilisateur ouvre une page",
        what: "Un visiteur demande une page d'événement ou soumet un formulaire.",
        detail: "Exemple : un organisateur publie un nouvel événement.",
        status: "→ requête HTTP",
      },
      {
        title: "Le contrôleur le traite",
        what: "Laravel route la requête et valide les entrées.",
        detail:
          "Une saisie de formulaire invalide est renvoyée avec les messages de validation.",
        status: "422 si invalide",
      },
      {
        title: "Vérification de l'auth et du rôle",
        what: "La session est authentifiée et le rôle est vérifié.",
        detail:
          "Seuls les organisateurs et les administrateurs peuvent publier ou gérer des événements.",
        status: "401 / 403",
      },
      {
        title: "La logique MVC s'exécute",
        what: "L'événement est créé et les enregistrements liés sont préparés.",
        detail:
          "L'opération s'exécute comme une seule unité pour que les lignes liées restent cohérentes.",
      },
      {
        title: "Eloquent persiste",
        what: "Les modèles sont écrits via l'ORM.",
        detail: "Les relations couvrent les organisateurs, les artistes et les participants.",
      },
      {
        title: "PostgreSQL stocke",
        what: "La base de données valide la modification.",
        detail: "Le contrôleur rend la page mise à jour.",
        status: "redirect / 200",
      },
    ],
  },
};

const FR_DB: DbText = {
  name: "Stocks et commandes fournisseurs",
  note: "Modèle illustratif reconstruit à partir des fonctionnalités documentées du projet (produits, fournisseurs, commandes, mouvements de stock). Les noms de colonnes sont représentatifs, et non issus du schéma d'origine.",
  entities: {
    category: {
      purpose: "Regroupe les produits pour la navigation et les rapports.",
    },
    product: {
      purpose: "Un article en stock avec son coût moyen pondéré.",
      notes: { sku: "unique" },
    },
    supplier: {
      purpose: "Un fournisseur auprès duquel les produits sont commandés.",
      notes: { email: "nullable" },
    },
    supplier_order: {
      purpose: "Un bon de commande passé auprès d'un fournisseur.",
    },
    order_line: {
      purpose: "Une ligne de produit sur une commande fournisseur.",
    },
    stock_movement: {
      purpose: "Un changement de stock utilisé pour la valorisation CUMP.",
    },
  },
  relations: {
    "category->product": "regroupe",
    "product->order_line": "commandé comme",
    "supplier->supplier_order": "reçoit",
    "supplier_order->order_line": "contient",
    "product->stock_movement": "suivi par",
  },
};

const FR_API: Record<string, ApiText> = {
  "list-products": {
    title: "Lister les produits (paginé)",
    description: "Renvoie une page de produits avec leur stock actuel.",
    auth: "Public dans cet exemple — un déploiement réel le restreindrait à un rôle authentifié.",
  },
  "get-product": {
    title: "Récupérer un produit",
    description: "Renvoie un seul produit ou 404 lorsqu'il n'existe pas.",
    auth: "Public dans cet exemple.",
    why: "Requête GET /api/products/999999, un id qui n'existe pas.",
  },
  "create-product": {
    title: "Créer un produit",
    description: "Valide le corps et renvoie 201 avec un en-tête Location.",
    auth: "Nécessite un utilisateur authentifié avec un rôle d'écriture dans un déploiement réel.",
    why: "Envoyer un sku vide et un prix négatif échoue à Bean Validation.",
  },
  unauthorized: {
    title: "Créer une commande fournisseur",
    description: "Crée un bon de commande et recalcule la valorisation du stock.",
    auth: "Nécessite un jeton bearer. Sans jeton, l'API renvoie 401.",
    why: "Appeler le point de terminaison sans en-tête Authorization.",
  },
};

const FR_CASES: Record<string, CaseText> = {
  cump: {
    project: "Système de gestion des stocks et des commandes fournisseurs",
    summary:
      "Maintenir une valorisation des stocks correcte (CUMP) sous des commandes concurrentes.",
    problem:
      "La valorisation des stocks au coût moyen pondéré (CUMP) doit rester correcte à mesure que les commandes fournisseurs et les mouvements de stock modifient les quantités et les coûts des produits.",
    constraints: [
      "Chaque mouvement modifie le coût moyen du produit, donc le calcul doit être cohérent.",
      "Une commande partiellement appliquée corromprait les chiffres de stock, donc les écritures doivent être atomiques.",
      "Le contrat d'API ne doit pas laisser fuiter le modèle de persistance.",
    ],
    architecture:
      "Un service Spring Boot en couches : contrôleurs REST → couche service (@Transactional) → dépôts Spring Data JPA → MySQL, avec Liquibase pour gérer le schéma.",
    decision:
      "Centraliser la valorisation dans la couche service et exécuter chaque commande comme une transaction unique, en recalculant le CUMP à partir des mouvements de stock enregistrés.",
    rationale:
      "Le coût moyen est dérivé de la séquence ordonnée des mouvements ; il relève donc des règles métier, et non du contrôleur ni de la base de données. Une frontière transactionnelle garantit que la commande et sa valorisation changent ensemble ou pas du tout.",
    alternatives: [
      {
        option: "Calculer la moyenne dans la base de données via un trigger ou une vue.",
        tradeoff:
          "Moins d'allers-retours, mais masque la logique métier dans le schéma, est plus difficile à tester isolément et moins portable entre bases de données.",
      },
      {
        option: "Calculer la valorisation à la lecture (matérialisée à la demande).",
        tradeoff:
          "Simplifie les écritures, mais répète un travail coûteux à chaque lecture et abandonne la source unique de vérité.",
      },
    ],
    quality: [
      {
        label: "Gestion des erreurs",
        value:
          "Les entrées invalides sont rejetées par Bean Validation avant l'exécution du service ; les échecs dans la transaction annulent toute l'unité de travail.",
      },
      {
        label: "Tests",
        value:
          "La logique de valorisation réside dans du code de service simple, donc testable par des tests unitaires sans base de données active.",
      },
      {
        label: "Maintenabilité",
        value:
          "Les DTO et MapStruct gardent le contrat REST découplé des entités, donc le schéma peut évoluer sans casser l'API.",
      },
      {
        label: "Schéma",
        value:
          "Les changelogs Liquibase rendent les changements de schéma revus et reproductibles entre environnements.",
      },
    ],
    improvements: [
      "Ajouter un verrouillage optimiste ou une colonne de version pour se protéger des mises à jour concurrentes de la valorisation.",
      "Exposer la valorisation comme une opération métier explicite, avec des invariants clairs et des tests unitaires.",
      "Documenter le contrat REST avec des exemples de charges issus directement de la spécification OpenAPI.",
    ],
  },
  roles: {
    project: "Système de workflow de télé-expertise médicale",
    summary:
      "Modéliser un parcours de soins multi-acteurs avec une séparation stricte des rôles.",
    problem:
      "Le système relie les infirmiers, les médecins généralistes et les spécialistes autour de demandes d'expertise et d'avis médicaux partagés, et chaque acteur ne doit effectuer que les actions qui lui sont permises.",
    constraints: [
      "Des acteurs différents ont besoin de vues et d'autorisations différentes sur les mêmes enregistrements.",
      "Les données médicales rendent la justesse de l'autorisation et l'auditabilité importantes.",
      "Le workflow couvre plusieurs étapes (demande → consultation → avis).",
    ],
    architecture:
      "Une application web Jakarta EE : couche web/contrôleur → sécurité basée sur les rôles → couche service → persistance Hibernate → PostgreSQL.",
    decision:
      "Appliquer l'autorisation au niveau de la couche d'entrée selon le rôle, et garder le workflow multi-étapes dans la couche service sous forme de cas d'usage cohérents.",
    rationale:
      "Vérifier les rôles à la frontière garantit que chaque cas d'usage est protégé de façon cohérente, tandis que la couche service reste concentrée sur les règles de workflow au lieu de répéter les contrôles de sécurité.",
    alternatives: [
      {
        option: "Placer les contrôles d'autorisation dans chaque méthode de service.",
        tradeoff:
          "Fin et explicite, mais facile à oublier dans une nouvelle méthode et plus difficile à appréhender globalement.",
      },
      {
        option: "Stocker les permissions sous forme de données et les évaluer dynamiquement.",
        tradeoff:
          "Plus flexible, mais ajoute un sous-système de permissions excessif pour un ensemble fixe de trois rôles d'acteurs.",
      },
    ],
    quality: [
      {
        label: "Sécurité",
        value:
          "L'authentification et le contrôle d'accès basé sur les rôles filtrent chaque action ; les acteurs ne peuvent pas atteindre des fonctions hors de leur rôle.",
      },
      {
        label: "Intégrité des données",
        value:
          "La couche service exécute les étapes du workflow en transactions, de sorte qu'un workflow partiellement achevé ne peut pas persister.",
      },
      {
        label: "Maintenabilité",
        value:
          "Chaque étape du parcours de soins est un cas d'usage nommé, ce qui garde les règles métier lisibles.",
      },
    ],
    improvements: [
      "Introduire une piste d'audit indiquant qui a effectué quelle action et quand.",
      "Ajouter des tests d'intégration automatisés pour les actions autorisées et refusées de chaque rôle.",
      "Extraire la validation partagée de la machine à états du workflow.",
    ],
  },
  tokens: {
    project: "Plateforme de boutique en ligne et de gestion des stocks",
    summary:
      "Authentification par jetons d'API et accès back-office basé sur les rôles avec Laravel.",
    problem:
      "Une boutique Vue.js et un back-office doivent partager une même API, tandis que les administrateurs, les commerciaux et les gestionnaires produits ont besoin de niveaux d'accès différents.",
    constraints: [
      "Le frontend est une SPA séparée, donc l'API doit être sans état et basée sur des jetons.",
      "Les rôles doivent être appliqués côté serveur, jamais confiés au client.",
      "Les commandes doivent rester cohérentes même lorsque la facturation et les imports s'exécutent.",
    ],
    architecture:
      "SPA Vue.js → routes/contrôleurs Laravel → auth par jetons Sanctum et rôles → logique métier (MVC) → Eloquent → PostgreSQL.",
    decision:
      "Utiliser Laravel Sanctum pour des jetons d'API sans état et appliquer les contrôles de rôle côté serveur pour chaque route protégée.",
    rationale:
      "Sanctum convient naturellement à une SPA dialoguant avec une API Laravel, et les contrôles de rôle côté serveur permettent de traiter la SPA comme une entrée non fiable.",
    alternatives: [
      {
        option: "Des cookies de session pour la SPA.",
        tradeoff:
          "Plus simple pour les applications de même origine, mais peu adapté à une SPA découplée et à des appels d'API d'origines différentes.",
      },
      {
        option: "Mettre en place un schéma JWT maison.",
        tradeoff:
          "Contrôle total, mais réimplémente l'émission, la révocation et les gardes de jetons qu'une bibliothèque maintenue gère déjà en sécurité.",
      },
    ],
    quality: [
      {
        label: "Sécurité",
        value:
          "Les jetons authentifient la SPA ; les rôles sont vérifiés côté serveur, donc les permissions ne peuvent pas être contournées depuis le client.",
      },
      {
        label: "Maintenabilité",
        value:
          "MVC et Eloquent gardent les contrôleurs légers et la logique métier dans les modèles/services.",
      },
      {
        label: "Fonctionnalités",
        value:
          "Le traitement des commandes, la facturation PDF et l'import Excel sont séparés, de sorte que chacun évolue indépendamment.",
      },
    ],
    improvements: [
      "Déplacer la génération des factures et l'import Excel vers des tâches en file d'attente pour que les requêtes restent rapides.",
      "Ajouter des tests de fonctionnalités vérifiant la matrice d'accès de chaque rôle.",
      "Introduire des ressources d'API pour standardiser la forme des réponses.",
    ],
  },
  structure: {
    project: "Application web de gestion d'événements",
    summary:
      "Garder une plateforme d'événements multi-rôles lisible avec des frontières MVC claires.",
    problem:
      "Les organisateurs, artistes, participants et administrateurs partagent une même plateforme, et le code doit rester compréhensible à mesure que les fonctionnalités s'ajoutent.",
    constraints: [
      "Plusieurs rôles agissent sur des données qui se recoupent (événements, participation).",
      "L'interface doit rester responsive sur tous les appareils.",
      "Le tableau de bord d'administration exige un accès plus strict que les pages publiques.",
    ],
    architecture:
      "Interface Blade + TailwindCSS → contrôleurs Laravel → auth et rôle d'administrateur → logique MVC → Eloquent → PostgreSQL.",
    decision:
      "Suivre strictement les conventions MVC de Laravel et réserver les actions d'administration à un contrôle de rôle explicite.",
    rationale:
      "La convention plutôt que la configuration rend le projet abordable pour quiconque connaît Laravel, et une frontière d'administration claire évite les fuites de privilèges accidentelles.",
    alternatives: [
      {
        option: "Construire une SPA d'administration séparée.",
        tradeoff:
          "Plus agréable pour un back-office complexe, mais ajoute une seconde base de code et une surface d'API pour un projet de cette taille.",
      },
      {
        option: "Un middleware fin par route pour chaque rôle.",
        tradeoff:
          "Plus explicite, mais verbeux ; un petit ensemble de rôles est mieux servi par quelques gardes clairs.",
      },
    ],
    quality: [
      {
        label: "Sécurité",
        value:
          "L'authentification et une garde de rôle d'administrateur protègent le tableau de bord ; les pages publiques restent ouvertes.",
      },
      {
        label: "Maintenabilité",
        value:
          "Des conventions MVC strictes gardent les contrôleurs, les modèles et les vues à des emplacements prévisibles.",
      },
      {
        label: "Frontend",
        value:
          "TailwindCSS fournit un système de design cohérent et responsive sans CSS sur mesure.",
      },
    ],
    improvements: [
      "Ajouter des tests automatisés couvrant les parcours de participation.",
      "Introduire des policies pour des règles d'autorisation plus fines.",
      "Indexer la table des événements pour les requêtes de liste les plus courantes.",
    ],
  },
};

const FR_PROJECTS: Record<string, ProjText> = {
  "Healthcare Tele-Expertise Workflow System": {
    problem:
      "Offrir aux infirmiers, médecins généralistes et spécialistes un workflow partagé pour les demandes d'expertise et les avis médicaux, en remplacement d'une communication dispersée.",
    contribution:
      "Conçu l'application Jakarta EE en couches et implémenté le workflow multi-acteurs, l'accès basé sur les rôles et la couche de persistance Hibernate.",
    dataNotes:
      "Entités principales : patients, consultations, demandes d'expertise et avis médicaux, reliées par des mappings Hibernate.",
    apiNotes:
      "Points de terminaison tenant compte des rôles, qui exposent les étapes du workflow tout en masquant les détails de persistance.",
    quality:
      "Authentification et contrôles de rôle côté serveur ; les étapes du workflow s'exécutent en transactions, de sorte qu'un flux partiel ne peut pas persister.",
  },
  "Inventory & Supplier Orders Management System": {
    problem:
      "Suivre avec précision les commandes fournisseurs, les mouvements de stock et la valorisation des stocks à mesure que les quantités et les coûts changent.",
    contribution:
      "Construit le service Spring Boot en couches, la logique de valorisation CUMP et le contrat d'API, avec documentation générée et changements de schéma gérés.",
    dataNotes:
      "Produits, fournisseurs, commandes, lignes de commande et mouvements de stock ; changements de schéma versionnés avec Liquibase.",
    apiNotes:
      "Points de terminaison REST avec DTO et Bean Validation ; MapStruct tient les entités hors du format d'échange.",
    quality:
      "Bean Validation rejette tôt les entrées invalides ; les écritures de commandes s'exécutent dans des frontières @Transactional ; l'API est documentée avec Swagger/OpenAPI.",
  },
  "Online Store & Inventory Management Platform": {
    problem:
      "Faire tourner une boutique et un back-office sur une même API, avec des niveaux d'accès différents pour les administrateurs, les commerciaux et les gestionnaires produits.",
    contribution:
      "Implémenté le frontend Vue.js au-dessus d'une API Laravel, incluant l'authentification par jetons, l'accès basé sur les rôles, le traitement des commandes, la facturation PDF et l'import Excel.",
    dataNotes:
      "Utilisateurs, rôles, produits, commandes et factures dans PostgreSQL, accédés via Eloquent.",
    apiNotes:
      "Points de terminaison d'API sans état authentifiés par jetons, partagés par la SPA et le back-office.",
    quality:
      "Jetons Sanctum et application des rôles côté serveur ; les commandes sont traitées en unités, de sorte que la facturation reste cohérente.",
  },
  "Event Management Web Application": {
    problem:
      "Permettre aux organisateurs, artistes, participants et administrateurs de créer, gérer et rejoindre des événements depuis une même plateforme.",
    contribution:
      "Construit l'application MVC Laravel avec un tableau de bord d'administration protégé par rôle et une interface responsive en TailwindCSS.",
    dataNotes:
      "Événements, artistes, participants et enregistrements de participation reliés via Eloquent.",
    apiNotes:
      "Routes rendues côté serveur avec validation ; les actions d'administration se trouvent derrière un contrôle de rôle explicite.",
    quality:
      "Authentification avec une garde de rôle d'administrateur ; validation de toutes les saisies de formulaire ; frontières MVC claires.",
  },
};

const fr: EngineeringContent = {
  archLayerLabel: FR_ARCH_LAYER_LABEL,
  architectures: buildArchitectures(FR_ARCH),
  dbModel: buildDb(FR_DB),
  apiExamples: buildApi(FR_API),
  caseStudies: buildCases(FR_CASES),
  projectEngineering: buildProjects(FR_PROJECTS),
};

/* ------------------------------------------------------------------ */
/* Arabic                                                              */
/* ------------------------------------------------------------------ */

const AR_ARCH_LAYER_LABEL: Record<ArchLayer, string> = {
  client: "العميل",
  entry: "نقطة الدخول",
  security: "عرضي",
  mapping: "عرضي",
  service: "منطق الأعمال",
  repository: "الاستمرارية",
  store: "مخزن البيانات",
  ops: "التشغيل",
};

const AR_ARCH_NOTE =
  "عرض توضيحي لهندسة هذا المشروع، أُعيد بناؤه من تقنياته وميزاته الموثّقة — وليس التخطيط الأصلي للكود المصدري.";

const AR_ARCH: Record<string, ArchText> = {
  inventory: {
    name: "المخزون وطلبات المورّدين",
    subtitle: "Spring Boot · خدمة REST طبقية",
    note: AR_ARCH_NOTE,
    nodes: {
      client: {
        short: "عميل الويب",
        label: "عميل الويب",
        responsibility:
          "يرسل استدعاءات REST ويعرض واجهات طلبات المورّدين والمخزون.",
        io: "طلب HTTPS داخل · استجابة JSON خارج",
      },
      entry: {
        short: "متحكمات REST",
        label: "واجهة REST — متحكمات Spring MVC",
        responsibility:
          "يعرّف عقد REST، ويربط الطلبات ويتحقق منها، ويعيد كائنات DTO مع رموز حالة HTTP صريحة.",
        io: "طريقة + مسار HTTP داخل · DTO + الحالة خارج",
      },
      mapping: {
        short: "DTO والتحويل",
        label: "DTO والتحقق والتحويل",
        responsibility:
          "يفصل عقد API عن الكيانات: يرفض Bean Validation المدخلات غير الصالحة، ويحوّل MapStruct بين الكيان و DTO.",
        io: "رفض المدخلات غير الصالحة (400) · تحويل الكيان ↔ DTO",
      },
      service: {
        short: "طبقة الخدمة",
        label: "طبقة الخدمة",
        responsibility:
          "تملك قواعد الأعمال وحدود المعاملات — طلبات المورّدين وتقييم المخزون بمتوسط التكلفة المرجّح (CUMP).",
        io: "عمليات المجال داخل · كيانات/أوامر خارج",
      },
      repository: {
        short: "المستودعات",
        label: "مستودعات Spring Data JPA",
        responsibility:
          "الوصول إلى البيانات على النموذج العلائقي: تحويل الكيانات والاستعلامات المشتقة والاستمرارية.",
        io: "الكيانات ↔ الصفوف",
      },
      store: {
        short: "MySQL",
        label: "قاعدة بيانات MySQL",
        responsibility:
          "مخزن علائقي دائم للمنتجات والمورّدين والطلبات وحركات المخزون.",
        io: "عبارات SQL",
      },
      ops: {
        short: "Liquibase",
        label: "ترحيلات المخطط",
        responsibility:
          "تغييرات مخطط قاعدة البيانات المُحكمة الإصدار والقابلة للتكرار، تُطبَّق عند بدء التشغيل.",
        io: "سجلات التغيير → المخطط",
      },
    },
    edges: {
      "entry->mapping": "تحقّق",
      "entry->service": "أمر",
      "mapping->service": "DTO محوَّل",
      "ops->store": "المخطط",
      "service->entry": "DTO الناتج",
    },
    lifecycle: [
      {
        title: "يرسل العميل الطلب",
        what: "يُصدر المتصفح طلب HTTP مع جسم JSON.",
        detail:
          "مثال: POST /api/supplier-orders مع supplierId و orderDate وقائمة بنود (productId و quantity و unitCost).",
        status: "→ طلب HTTP",
      },
      {
        title: "يستقبل المتحكم الطلب ويتحقق منه",
        what: "يربط Spring MVC الجسم بـ DTO ويشغّل Bean Validation.",
        detail:
          "تفشل الحُمول غير الصالحة سريعًا بـ 400 Bad Request مع جسم أخطاء لكل حقل؛ أما الحُمول الصالحة فتنتقل إلى الخدمة.",
        status: "400 إذا كان غير صالح",
      },
      {
        title: "تطبّق الخدمة قواعد الأعمال",
        what: "تشغّل طبقة الخدمة منطق المجال داخل حدّ معاملة.",
        detail:
          "يفتح @Transactional وحدة عمل. يُنشأ الطلب ويُعاد حساب متوسط التكلفة المرجّح (CUMP) للمنتجات المتأثرة.",
        status: "→ @Transactional",
      },
      {
        title: "يُثبّت المستودع البيانات",
        what: "يحوّل Spring Data JPA / Hibernate الكيانات إلى SQL.",
        detail:
          "يُثبَّت رأس الطلب وبنوده وتُعاد المعرّفات الناتجة إلى الكيانات المُدارة.",
        status: "→ INSERT",
      },
      {
        title: "تخزّن قاعدة البيانات",
        what: "تنفّذ MySQL العبارات داخل المعاملة.",
        detail:
          "إذا فشلت أي عبارة، تُلغى وحدة العمل كاملة فلا يبقى أي طلب جزئي.",
        status: "commit / rollback",
      },
      {
        title: "التحويل والتسلسل",
        what: "يُحوَّل الكيان إلى DTO استجابة ويُسلسَل إلى JSON.",
        detail:
          "يبقي MapStruct صيغة التبادل منفصلة عن نموذج الاستمرارية؛ ويعيد المتحكم 201 Created مع ترويسة Location.",
        status: "201 Created",
      },
    ],
  },
  teleexpertise: {
    name: "الاستشارة الطبية عن بُعد",
    subtitle: "Jakarta EE · servlet + Hibernate",
    note: AR_ARCH_NOTE,
    nodes: {
      client: {
        short: "عميل الويب",
        label: "عميل الويب",
        responsibility:
          "الواجهة التي يستخدمها الممرضون والأطباء العامون والمتخصصون.",
        io: "طلب HTTP داخل · استجابة مُصيَّرة خارج",
      },
      entry: {
        short: "طبقة الويب / المتحكم",
        label: "طبقة ويب Jakarta EE",
        responsibility:
          "يستقبل الطلبات ويوجّهها إلى حالة الاستخدام المناسبة ويجهّز الاستجابة.",
        io: "HTTP داخل · استدعاءات المجال خارج",
      },
      security: {
        short: "المصادقة والأدوار",
        label: "المصادقة والوصول حسب الأدوار",
        responsibility:
          "يوثّق الفاعل ويصرّح بكل إجراء حسب الدور — ممرض أو طبيب عام أو متخصص.",
        io: "الهوية + الدور داخل · سماح / منع",
      },
      service: {
        short: "خدمات الأعمال",
        label: "طبقة خدمات الأعمال",
        responsibility:
          "سير الرعاية: طلبات الخبرة والجدولة وتسليم الآراء الطبية.",
        io: "حالات الاستخدام داخل · الكيانات خارج",
      },
      repository: {
        short: "DAO الخاص بـ Hibernate",
        label: "طبقة استمرارية Hibernate",
        responsibility:
          "التحويل الكائني-العلائقي والوصول إلى البيانات في طبقة الاستمرارية.",
        io: "الكيانات ↔ الصفوف",
      },
      store: {
        short: "PostgreSQL",
        label: "قاعدة بيانات PostgreSQL",
        responsibility:
          "مخزن علائقي للمرضى والاستشارات وطلبات الخبرة والآراء الطبية.",
        io: "عبارات SQL",
      },
    },
    edges: {
      "client->entry": "طلب HTTP",
      "entry->security": "التحقق من الدور",
      "security->service": "مصرّح",
      "entry->client": "النتيجة",
    },
    lifecycle: [
      {
        title: "يرسل الفاعل طلبًا",
        what: "يقدّم ممرض أو طبيب عام أو متخصص إجراءً من الواجهة.",
        detail: "مثال: يفتح المتخصص طلب خبرة مُسنَدًا إليه لنشر رأي طبي.",
        status: "→ طلب HTTP",
      },
      {
        title: "توجّهه طبقة الويب",
        what: "تحوّل طبقة ويب Jakarta EE الطلب إلى حالة استخدام.",
        detail: "تُقرأ معاملات الطلب وتُمرَّر إلى طبقة الخدمة.",
      },
      {
        title: "المصادقة والتفويض",
        what: "يُوثَّق الفاعل ويُقارَن بالدور المطلوب.",
        detail:
          "يقرّر التحكم في الوصول حسب الأدوار ما إذا كان بإمكان ممرض أو طبيب عام أو متخصص تنفيذ الإجراء، ويرفضه بخلاف ذلك.",
        status: "401 / 403",
      },
      {
        title: "تُنفَّذ قواعد الأعمال",
        what: "تُطبَّق منطق سير العمل وحدّ المعاملة.",
        detail:
          "تُنسَّق طلبات الخبرة والجدولة وتسليم الآراء كوحدة عمل واحدة.",
        status: "→ معاملة",
      },
      {
        title: "يُثبّت Hibernate البيانات",
        what: "تُحوَّل الكيانات إلى صفوف عبر Hibernate.",
        detail: "يولّد ORM العبارات ويدير الجلسة.",
      },
      {
        title: "تخزّن PostgreSQL",
        what: "تُثبّت قاعدة البيانات التغيير.",
        detail: "يؤدي أي فشل إلى التراجع عن المعاملة، حفاظًا على تماسك السجل.",
        status: "commit / rollback",
      },
    ],
  },
  store: {
    name: "المتجر الإلكتروني والمخزون",
    subtitle: "Vue.js · Laravel MVC",
    note: AR_ARCH_NOTE,
    nodes: {
      client: {
        short: "تطبيق Vue.js",
        label: "تطبيق Vue.js أحادي الصفحة",
        responsibility:
          "واجهة متجر ولوحة خلفية مبنية على المكوّنات تستدعي واجهة API.",
        io: "استدعاءات API بصيغة JSON · الرمز في الترويسة",
      },
      entry: {
        short: "مسارات Laravel",
        label: "مسارات ومتحكمات Laravel",
        responsibility:
          "يعرّف نقاط النهاية ومعالجة الطلبات للمتجر والمخزون.",
        io: "HTTP داخل · التحقق خارج",
      },
      security: {
        short: "Sanctum والأدوار",
        label: "مصادقة الرموز Laravel Sanctum والأدوار",
        responsibility:
          "يُصدر رموز API ويتحقق منها، ويفرض الأدوار للمسؤولين وموظفي المبيعات ومسؤولي المنتجات.",
        io: "الرمز داخل · سماح / منع",
      },
      service: {
        short: "منطق المجال",
        label: "منطق المجال (MVC)",
        responsibility:
          "السلة ومعالجة الطلبات والفوترة واستيراد Excel كخدمات نموذج.",
        io: "حالات الاستخدام داخل · النماذج خارج",
      },
      repository: {
        short: "Eloquent ORM",
        label: "Eloquent ORM",
        responsibility: "تحويل active-record بين نماذج PHP والجداول.",
        io: "النماذج ↔ الصفوف",
      },
      store: {
        short: "PostgreSQL",
        label: "قاعدة بيانات PostgreSQL",
        responsibility:
          "مخزن علائقي للمنتجات والطلبات والفواتير والمستخدمين.",
        io: "عبارات SQL",
      },
    },
    edges: {
      "client->entry": "استدعاء API",
      "entry->security": "التحقق من الرمز",
      "security->service": "مصرّح",
    },
    lifecycle: [
      {
        title: "يستدعي التطبيق واجهة API",
        what: "تطلب واجهة Vue.js البيانات باستخدام رمز bearer.",
        detail: "مثال: POST /api/orders مع محتويات السلة بصيغة JSON.",
        status: "→ استدعاء API",
      },
      {
        title: "التوجيه والتحقق من الطلب",
        what: "يتحقق Laravel من الطلب وفق القواعد.",
        detail: "يعيد التحقق الفاشل 422 مع الحقول المخالفة.",
        status: "422 إذا كان غير صالح",
      },
      {
        title: "المصادقة بالرمز",
        what: "يحوّل Sanctum الرمز إلى مستخدم ويتحقق من الدور.",
        detail:
          "لا تصل إلى معالجة الطلبات إلا الأدوار المسموح لها؛ ويُرفض غيرها.",
        status: "401 / 403",
      },
      {
        title: "يُنفَّذ منطق المجال",
        what: "تُنفَّذ معالجة الطلبات والإجماليات وتوليد الفواتير.",
        detail: "مغلّف بحيث لا يترك أي فشل طلبًا مكتوبًا جزئيًا.",
        status: "→ معاملة",
      },
      {
        title: "يُثبّت Eloquent البيانات",
        what: "تُكتب النماذج عبر ORM.",
        detail: "تدير العلاقات الصفوف المرتبطة مثل بنود الطلب.",
      },
      {
        title: "تخزّن PostgreSQL",
        what: "تُثبّت قاعدة البيانات المعاملة.",
        detail: "تستجيب واجهة API بالطلب المُنشأ.",
        status: "201 Created",
      },
    ],
  },
  events: {
    name: "إدارة الفعاليات",
    subtitle: "Laravel · تطبيق ويب MVC",
    note: AR_ARCH_NOTE,
    nodes: {
      client: {
        short: "واجهة الويب",
        label: "واجهة الويب — Blade + TailwindCSS",
        responsibility:
          "صفحات مُصيَّرة على الخادم للمنظمين والفنانين والحضور والمسؤولين.",
        io: "طلب HTTP داخل · HTML خارج",
      },
      entry: {
        short: "متحكمات Laravel",
        label: "متحكمات Laravel",
        responsibility: "يتولّى نقاط نهاية إدارة الفعاليات والمشاركة.",
        io: "HTTP داخل · التحقق خارج",
      },
      security: {
        short: "المصادقة ودور المسؤول",
        label: "المصادقة ودور المسؤول",
        responsibility:
          "يحمي لوحة تحكم الإدارة ويميّز إجراءات المنظّم والفنان والحاضر.",
        io: "الجلسة / الدور داخل · سماح / منع",
      },
      service: {
        short: "منطق MVC",
        label: "منطق الأعمال MVC",
        responsibility: "إنشاء الفعاليات وإدارتها ومسارات المشاركة.",
        io: "حالات الاستخدام داخل · النماذج خارج",
      },
      repository: {
        short: "Eloquent ORM",
        label: "Eloquent ORM",
        responsibility: "تحويل النموذج ↔ الجدول للفعاليات والمشاركين.",
        io: "النماذج ↔ الصفوف",
      },
      store: {
        short: "PostgreSQL",
        label: "قاعدة بيانات PostgreSQL",
        responsibility: "مخزن علائقي للفعاليات والفنانين والحضور.",
        io: "عبارات SQL",
      },
    },
    edges: {},
    lifecycle: [
      {
        title: "يفتح المستخدم صفحة",
        what: "يطلب زائر صفحة فعالية أو يرسل نموذجًا.",
        detail: "مثال: ينشر المنظّم فعالية جديدة.",
        status: "→ طلب HTTP",
      },
      {
        title: "يتولّاه المتحكم",
        what: "يوجّه Laravel الطلب ويتحقق من المدخلات.",
        detail: "يُعاد إدخال النموذج غير الصالح مع رسائل التحقق.",
        status: "422 إذا كان غير صالح",
      },
      {
        title: "التحقق من المصادقة والدور",
        what: "تُوثَّق الجلسة ويُتحقق من الدور.",
        detail:
          "لا يمكن للمنظمين والمسؤولين فقط نشر الفعاليات أو إدارتها.",
        status: "401 / 403",
      },
      {
        title: "يُنفَّذ منطق MVC",
        what: "تُنشأ الفعالية وتُجهَّز السجلات المرتبطة.",
        detail: "تُنفَّذ العملية كوحدة واحدة لتبقى الصفوف المرتبطة متسقة.",
      },
      {
        title: "يُثبّت Eloquent البيانات",
        what: "تُكتب النماذج عبر ORM.",
        detail: "تغطّي العلاقات المنظمين والفنانين والحضور.",
      },
      {
        title: "تخزّن PostgreSQL",
        what: "تُثبّت قاعدة البيانات التغيير.",
        detail: "يعرض المتحكم الصفحة المحدّثة.",
        status: "redirect / 200",
      },
    ],
  },
};

const AR_DB: DbText = {
  name: "المخزون وطلبات المورّدين",
  note: "نموذج توضيحي أُعيد بناؤه من الميزات الموثّقة للمشروع (المنتجات، المورّدون، الطلبات، حركات المخزون). أسماء الأعمدة تمثيلية وليست من المخطط الأصلي.",
  entities: {
    category: {
      purpose: "يجمّع المنتجات للتصفح وإعداد التقارير.",
    },
    product: {
      purpose: "عنصر مخزون مع متوسط تكلفته المرجّح.",
      notes: { sku: "فريد" },
    },
    supplier: {
      purpose: "مورّد تُطلب منه المنتجات.",
      notes: { email: "nullable" },
    },
    supplier_order: {
      purpose: "أمر شراء مُوجَّه إلى مورّد.",
    },
    order_line: {
      purpose: "بند منتج واحد في طلب مورّد.",
    },
    stock_movement: {
      purpose: "تغيّر في المخزون يُستخدم لتقييم CUMP.",
    },
  },
  relations: {
    "category->product": "يجمّع",
    "product->order_line": "يُطلب كـ",
    "supplier->supplier_order": "يستقبل",
    "supplier_order->order_line": "يحتوي",
    "product->stock_movement": "يُتتبَّع بـ",
  },
};

const AR_API: Record<string, ApiText> = {
  "list-products": {
    title: "اسرد المنتجات (مقسّمة على صفحات)",
    description: "يعيد صفحة من المنتجات مع مخزونها الحالي.",
    auth: "عام في هذا المثال — أما في نشر حقيقي فسيُقصر على دور موثَّق.",
  },
  "get-product": {
    title: "اجلب منتجًا واحدًا",
    description: "يعيد منتجًا واحدًا أو 404 عندما لا يوجد.",
    auth: "عام في هذا المثال.",
    why: "طلب GET /api/products/999999، وهو id غير موجود.",
  },
  "create-product": {
    title: "أنشئ منتجًا",
    description: "يتحقق من الجسم ويعيد 201 مع ترويسة Location.",
    auth: "يتطلب مستخدمًا موثَّقًا له دور كتابة في نشر حقيقي.",
    why: "إرسال sku فارغ وسعر سالب يفشل في Bean Validation.",
  },
  unauthorized: {
    title: "أنشئ طلب مورّد",
    description: "ينشئ أمر شراء ويعيد حساب تقييم المخزون.",
    auth: "يتطلب رمز bearer. وبدونه تعيد API الحالة 401.",
    why: "استدعاء نقطة النهاية دون ترويسة Authorization.",
  },
};

const AR_CASES: Record<string, CaseText> = {
  cump: {
    project: "نظام إدارة المخزون وطلبات المورّدين",
    summary: "الحفاظ على دقة تقييم المخزون (CUMP) في ظل الطلبات المتزامنة.",
    problem:
      "يجب أن يبقى تقييم المخزون بمتوسط التكلفة المرجّح (CUMP) صحيحًا مع تغيّر الكميات والتكاليف نتيجة طلبات المورّدين وحركات المخزون.",
    constraints: [
      "كل حركة تغيّر متوسط تكلفة المنتج، لذا يجب أن يكون الحساب متسقًا.",
      "الطلب المطبَّق جزئيًا يُفسد أرقام المخزون، لذا يجب أن تكون الكتابات ذرّية.",
      "يجب ألّا يُسرّب عقد API نموذج الاستمرارية.",
    ],
    architecture:
      "خدمة Spring Boot طبقية: متحكمات REST → طبقة الخدمة (@Transactional) → مستودعات Spring Data JPA → MySQL، مع إدارة المخطط بـ Liquibase.",
    decision:
      "مركزة التقييم في طبقة الخدمة وتنفيذ كل طلب كمعاملة واحدة، مع إعادة حساب CUMP من حركات المخزون المسجّلة.",
    rationale:
      "يتشتقّ متوسط التكلفة من التسلسل المرتّب للحركات، فهو يخصّ قواعد الأعمال لا المتحكم ولا قاعدة البيانات. ويضمن حدّ المعاملة أن يتغيّر الطلب وتقييمه معًا أو لا يتغيّرا إطلاقًا.",
    alternatives: [
      {
        option: "حساب المتوسط في قاعدة البيانات عبر trigger أو view.",
        tradeoff:
          "أقل عددًا من الرحلات، لكنه يخفي منطق الأعمال داخل المخطط، ويصعب اختباره بمعزل، وأقل قابلية للنقل بين قواعد البيانات.",
      },
      {
        option: "حساب التقييم عند القراءة (مُجسَّد عند الطلب).",
        tradeoff:
          "يبقي الكتابات بسيطة، لكنه يكرّر عملًا مكلفًا في كل قراءة ويتخلى عن مصدر حقيقة واحد.",
      },
    ],
    quality: [
      {
        label: "معالجة الأخطاء",
        value:
          "تُرفض المدخلات غير الصالحة بـ Bean Validation قبل تشغيل الخدمة؛ وتؤدي الأعطال داخل المعاملة إلى التراجع عن وحدة العمل كاملة.",
      },
      {
        label: "الاختبارات",
        value:
          "يوجد منطق التقييم في كود خدمة بسيط، لذا يمكن اختباره بوحدات دون قاعدة بيانات عاملة.",
      },
      {
        label: "قابلية الصيانة",
        value:
          "تُبقي DTO و MapStruct عقد REST منفصلًا عن الكيانات، لذا يمكن تغيير المخطط دون كسر API.",
      },
      {
        label: "المخطط",
        value:
          "تجعل سجلات Liquibase تغييرات المخطط قابلة للمراجعة والتكرار عبر البيئات.",
      },
    ],
    improvements: [
      "إضافة قفل تفاؤلي أو عمود إصدار للحماية من تحديثات التقييم المتزامنة.",
      "إتاحة التقييم كعملية مجال صريحة مع ثوابت واضحة واختبارات وحدة.",
      "توثيق عقد REST بأمثلة على الحُمول مباشرة من مواصفة OpenAPI.",
    ],
  },
  roles: {
    project: "نظام سير عمل الاستشارة الطبية عن بُعد",
    summary: "نمذجة سير رعاية متعدد الأطراف بفصل صارم بين الأدوار.",
    problem:
      "يربط النظام الممرضين والأطباء العامين والمتخصصين حول طلبات خبرة وآراء طبية مشتركة، ويجب ألّا ينفّذ كل فاعل إلا الإجراءات المسموح له بها.",
    constraints: [
      "يحتاج الفاعلون المختلفون إلى واجهات وأذونات مختلفة على السجلات نفسها.",
      "تجعل البيانات الطبية صحة التفويض وقابلية التدقيق أمرين مهمين.",
      "يمتدّ سير العمل عبر خطوات عدة (طلب → استشارة → رأي).",
    ],
    architecture:
      "تطبيق ويب Jakarta EE: طبقة الويب/المتحكم → أمان حسب الأدوار → طبقة الخدمة → استمرارية Hibernate → PostgreSQL.",
    decision:
      "فرض التفويض في طبقة الدخول حسب الدور، وإبقاء سير العمل متعدد الخطوات في طبقة الخدمة كحالات استخدام متماسكة.",
    rationale:
      "التحقق من الأدوار عند الحدود يضمن حماية كل حالة استخدام باتساق، بينما تبقى طبقة الخدمة مركّزة على قواعد سير العمل بدل تكرار فحوص الأمان.",
    alternatives: [
      {
        option: "وضع فحوص التفويض داخل كل دالة خدمة.",
        tradeoff:
          "دقيق وصريح، لكن يسهل نسيانه في دالة جديدة ويصعب استيعابه على المستوى العام.",
      },
      {
        option: "تخزين الأذونات كبيانات وتقييمها ديناميكيًا.",
        tradeoff:
          "أكثر مرونة، لكنه يضيف نظام أذونات فرعيًا مبالغًا فيه لمجموعة ثابتة من ثلاثة أدوار.",
      },
    ],
    quality: [
      {
        label: "الأمان",
        value:
          "تحرس المصادقة والتحكم في الوصول حسب الأدوار كل إجراء؛ فلا يصل الفاعلون إلى وظائف خارج أدوارهم.",
      },
      {
        label: "سلامة البيانات",
        value:
          "تنفّذ طبقة الخدمة خطوات سير العمل كمعاملات، فلا يبقى سير عمل مكتمل جزئيًا.",
      },
      {
        label: "قابلية الصيانة",
        value:
          "كل خطوة في سير الرعاية حالة استخدام مسمّاة، ما يبقي قواعد الأعمال مقروءة.",
      },
    ],
    improvements: [
      "إدخال سجل تدقيق يبيّن من نفّذ أي إجراء ومتى.",
      "إضافة اختبارات تكامل آلية للإجراءات المسموح بها والمرفوضة لكل دور.",
      "استخراج التحقق المشترك لآلة حالات سير العمل.",
    ],
  },
  tokens: {
    project: "منصّة متجر إلكتروني وإدارة المخزون",
    summary: "مصادقة رموز API ووصول خلفي حسب الأدوار في Laravel.",
    problem:
      "يجب أن تتشارك واجهة Vue.js الأمامية ولوحة الخلفية واجهة API واحدة، بينما يحتاج المسؤولون وموظفو المبيعات ومسؤولو المنتجات إلى مستويات وصول مختلفة.",
    constraints: [
      "الواجهة الأمامية تطبيق SPA منفصل، لذا يجب أن تكون API عديمة الحالة وقائمة على الرموز.",
      "يجب فرض الأدوار على الخادم، ولا يُوثق بها أبدًا من العميل.",
      "يجب أن تبقى الطلبات متسقة حتى عند تشغيل الفوترة والاستيراد.",
    ],
    architecture:
      "تطبيق Vue.js SPA → مسارات/متحكمات Laravel → مصادقة الرموز Sanctum والأدوار → منطق المجال (MVC) → Eloquent → PostgreSQL.",
    decision:
      "استخدام Laravel Sanctum لرموز API عديمة الحالة وفرض فحوص الأدوار على الخادم لكل مسار محمي.",
    rationale:
      "يلائم Sanctum تطبيق SPA يتخاطب مع API Laravel، وتعني فحوص الأدوار على الخادم إمكان التعامل مع SPA كمدخل غير موثوق.",
    alternatives: [
      {
        option: "ملفات ارتباط الجلسة (cookies) لتطبيق SPA.",
        tradeoff:
          "أبسط للتطبيقات ذات الأصل نفسه، لكنه غير مناسب لتطبيق SPA منفصل واستدعاءات API عبر أصول مختلفة.",
      },
      {
        option: "بناء مخطط JWT مخصّص.",
        tradeoff:
          "تحكم كامل، لكنه يعيد تنفيذ إصدار الرموز وإبطالها وحرّاسها التي تتولّاها مكتبة مُصانة بأمان بالفعل.",
      },
    ],
    quality: [
      {
        label: "الأمان",
        value:
          "توثّق الرموز تطبيق SPA؛ وتُفحص الأدوار على الخادم فلا يمكن تجاوز الأذونات من العميل.",
      },
      {
        label: "قابلية الصيانة",
        value:
          "تُبقي MVC و Eloquent المتحكمات نحيفة ومنطق المجال في النماذج/الخدمات.",
      },
      {
        label: "الميزات",
        value:
          "معالجة الطلبات وفوترة PDF واستيراد Excel منفصلة بحيث يتطور كل منها باستقلالية.",
      },
    ],
    improvements: [
      "نقل توليد الفواتير واستيراد Excel إلى مهام في قائمة انتظار لتبقى الطلبات سريعة.",
      "إضافة اختبارات ميزات تتحقق من مصفوفة وصول كل دور.",
      "إدخال موارد API لتوحيد شكل الاستجابات.",
    ],
  },
  structure: {
    project: "تطبيق ويب لإدارة الفعاليات",
    summary: "إبقاء منصة فعاليات متعددة الأدوار مقروءة بحدود MVC واضحة.",
    problem:
      "يتشارك المنظمون والفنانون والحضور والمسؤولون منصة واحدة، ويجب أن يبقى الكود مفهومًا مع نمو الميزات.",
    constraints: [
      "تتصرّف أدوار عدة على بيانات متشابكة (الفعاليات، المشاركة).",
      "يجب أن تبقى الواجهة متجاوبة على كل الأجهزة.",
      "تحتاج لوحة تحكم الإدارة إلى وصول أكثر صرامة من الصفحات العامة.",
    ],
    architecture:
      "واجهة Blade + TailwindCSS → متحكمات Laravel → المصادقة ودور المسؤول → منطق MVC → Eloquent → PostgreSQL.",
    decision:
      "اتّباع اصطلاحات MVC في Laravel بصرامة وإبقاء إجراءات المسؤول خلف فحص دور صريح.",
    rationale:
      "الاعتماد على الاصطلاح بدل الإعداد يجعل المشروع في متناول كل ملمّ بـ Laravel، ويحول حدّ إدارة واضح دون تسرّبات الصلاحيات غير المقصودة.",
    alternatives: [
      {
        option: "بناء تطبيق SPA إداري منفصل.",
        tradeoff:
          "أجمل للوحة خلفية معقّدة، لكنه يضيف قاعدة كود ثانية وواجهة API لمشروع بهذا الحجم.",
      },
      {
        option: "وسيط دقيق لكل مسار ولكل دور.",
        tradeoff:
          "أوضح، لكنه مطوّل؛ ومجموعة صغيرة من الأدوار تخدمها مجموعة قليلة من الحرّاس الواضحين.",
      },
    ],
    quality: [
      {
        label: "الأمان",
        value:
          "تحمي المصادقة وحارس دور المسؤول لوحة التحكم؛ وتبقى الصفحات العامة مفتوحة.",
      },
      {
        label: "قابلية الصيانة",
        value:
          "تُبقي اصطلاحات MVC الصارمة المتحكمات والنماذج والواجهات في مواضع متوقّعة.",
      },
      {
        label: "الواجهة",
        value:
          "يوفّر TailwindCSS نظام تصميم متسقًا ومتجاوبًا دون CSS مخصّص.",
      },
    ],
    improvements: [
      "إضافة اختبارات آلية تغطّي مسارات المشاركة.",
      "إدخال سياسات لقواعد تفويض أدقّ.",
      "فهرسة جدول الفعاليات للاستعلامات الأكثر شيوعًا في السرد.",
    ],
  },
};

const AR_PROJECTS: Record<string, ProjText> = {
  "Healthcare Tele-Expertise Workflow System": {
    problem:
      "منح الممرضين والأطباء العامين والمتخصصين سير عمل مشتركًا لطلبات الخبرة والآراء الطبية، بدلًا من تواصل متفرّق.",
    contribution:
      "صمّمت تطبيق Jakarta EE الطبقي ونفّذت سير العمل متعدد الأطراف والوصول حسب الأدوار وطبقة استمرارية Hibernate.",
    dataNotes:
      "الكيانات الأساسية: المرضى والاستشارات وطلبات الخبرة والآراء الطبية، مرتبطة عبر تحويلات Hibernate.",
    apiNotes:
      "نقاط نهاية تراعي الأدوار وتكشف خطوات سير العمل مع إخفاء تفاصيل الاستمرارية.",
    quality:
      "المصادقة مع فحوص الأدوار على الخادم؛ تُنفَّذ خطوات سير العمل كمعاملات فلا يبقى أي سير جزئي.",
  },
  "Inventory & Supplier Orders Management System": {
    problem:
      "تتبّع طلبات المورّدين وحركات المخزون وتقييمه بدقة مع تغيّر الكميات والتكاليف.",
    contribution:
      "بنيت خدمة Spring Boot الطبقية ومنطق تقييم CUMP وعقد API، مع توثيق مُولَّد وتغييرات مخطط مُدارة.",
    dataNotes:
      "المنتجات والمورّدون والطلبات وبنود الطلب وحركات المخزون؛ تغييرات المخطط مُحكمة الإصدار بـ Liquibase.",
    apiNotes:
      "نقاط نهاية REST مع DTO و Bean Validation؛ يُبقي MapStruct الكيانات خارج صيغة التبادل.",
    quality:
      "يرفض Bean Validation المدخلات السيئة مبكرًا؛ وتُنفَّذ كتابات الطلبات داخل حدود @Transactional؛ وتُوثَّق API بـ Swagger/OpenAPI.",
  },
  "Online Store & Inventory Management Platform": {
    problem:
      "تشغيل متجر ولوحة خلفية على API واحدة بمستويات وصول مختلفة للمسؤولين وموظفي المبيعات ومسؤولي المنتجات.",
    contribution:
      "نفّذت واجهة Vue.js الأمامية فوق API Laravel، بما يشمل المصادقة بالرموز والوصول حسب الأدوار ومعالجة الطلبات وفوترة PDF واستيراد Excel.",
    dataNotes:
      "المستخدمون والأدوار والمنتجات والطلبات والفواتير في PostgreSQL، بالوصول عبرها عبر Eloquent.",
    apiNotes:
      "نقاط نهاية API عديمة الحالة موثَّقة بالرموز، يتشاركها تطبيق SPA واللوحة الخلفية.",
    quality:
      "رموز Sanctum مع فرض الأدوار على الخادم؛ تُعالَج الطلبات كوحدات فتبقى الفوترة متسقة.",
  },
  "Event Management Web Application": {
    problem:
      "تمكين المنظمين والفنانين والحضور والمسؤولين من إنشاء الفعاليات وإدارتها والمشاركة فيها من منصة واحدة.",
    contribution:
      "بنيت تطبيق MVC بـ Laravel مع لوحة إدارة محميّة بالدور وواجهة متجاوبة بـ TailwindCSS.",
    dataNotes: "الفعاليات والفنانون والحضور وسجلات المشاركة مرتبطة عبر Eloquent.",
    apiNotes:
      "مسارات مُصيَّرة على الخادم مع تحقق؛ وتقع إجراءات المسؤول خلف فحص دور صريح.",
    quality:
      "المصادقة مع حارس دور المسؤول؛ والتحقق من كل مدخلات النماذج؛ وحدود MVC واضحة.",
  },
};

const ar: EngineeringContent = {
  archLayerLabel: AR_ARCH_LAYER_LABEL,
  architectures: buildArchitectures(AR_ARCH),
  dbModel: buildDb(AR_DB),
  apiExamples: buildApi(AR_API),
  caseStudies: buildCases(AR_CASES),
  projectEngineering: buildProjects(AR_PROJECTS),
};

export const ENGINEERING: Record<Locale, EngineeringContent> = { en, ar };
