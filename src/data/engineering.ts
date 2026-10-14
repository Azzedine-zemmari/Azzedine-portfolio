/**
 * Engineering content — the backbone for the system-design sections.
 *
 * Everything here is grounded in the four real projects documented in
 * `portfolio.ts`. Where a detail is a reasonable reconstruction rather than
 * something copied from the original repository (e.g. exact table or column
 * names), it is explicitly labelled as illustrative in the UI copy so nothing
 * reads as an invented production fact.
 */

/* ------------------------------------------------------------------ */
/* Architecture explorer                                               */
/* ------------------------------------------------------------------ */

export type ArchLayer =
  | "client"
  | "entry"
  | "security"
  | "mapping"
  | "service"
  | "repository"
  | "store"
  | "ops";

export type ArchNodeKind =
  | "client"
  | "entry"
  | "security"
  | "logic"
  | "persistence"
  | "store"
  | "ops";

/** Canonical 3D anchor for each layer. The explorer places nodes here. */
export const ARCH_LAYER_POS: Record<ArchLayer, [number, number, number]> = {
  client: [0, 4.5, 0],
  entry: [0, 2.7, 0.3],
  security: [-3.8, 2.7, 0.3],
  mapping: [3.8, 2.7, 0.3],
  service: [0, 0.9, 0],
  repository: [0, -0.9, 0.3],
  store: [0, -2.7, 0],
  ops: [3.8, -0.9, 0.3],
};

export const ARCH_LAYER_LABEL: Record<ArchLayer, string> = {
  client: "Client",
  entry: "Entry point",
  security: "Cross-cutting",
  mapping: "Cross-cutting",
  service: "Business logic",
  repository: "Persistence",
  store: "Data store",
  ops: "Operations",
};

export interface ArchNode {
  id: string;
  /** Short label shown on the node in the canvas. */
  short: string;
  /** Full label used in the detail panel and accessible list. */
  label: string;
  layer: ArchLayer;
  kind: ArchNodeKind;
  tech: string[];
  /** One-line responsibility. */
  responsibility: string;
  /** What flows in and out of this component. */
  io: string;
}

export type EdgeKind = "request" | "response" | "data" | "auth" | "migration";

export interface ArchEdge {
  from: string;
  to: string;
  kind: EdgeKind;
  label?: string;
}

export interface LifecycleStep {
  title: string;
  /** Node id this step happens in (links the step to the diagram). */
  node: string;
  what: string;
  detail: string;
  /** Optional HTTP status / outcome badge. */
  status?: string;
}

export interface Architecture {
  id: string;
  /** Project title it belongs to (matches portfolio.ts). */
  name: string;
  /** Short descriptor under the selector. */
  subtitle: string;
  /** Honesty note shown under the diagram. */
  note: string;
  stack: string[];
  nodes: ArchNode[];
  edges: ArchEdge[];
  lifecycle: LifecycleStep[];
}

const AUTH_NOTE =
  "Illustrative view of this project's architecture, reconstructed from its documented stack and features — not the original source layout.";

export const architectures: Architecture[] = [
  {
    id: "inventory",
    name: "Inventory & Supplier Orders",
    subtitle: "Spring Boot · layered REST service",
    note: AUTH_NOTE,
    stack: ["Spring Boot", "Spring Data JPA", "MapStruct", "Liquibase", "Swagger", "MySQL"],
    nodes: [
      {
        id: "client",
        short: "Web Client",
        label: "Web client",
        layer: "client",
        kind: "client",
        tech: ["Browser"],
        responsibility:
          "Sends REST calls and renders the supplier-order and stock views.",
        io: "HTTPS request in · JSON response out",
      },
      {
        id: "entry",
        short: "REST Controllers",
        label: "REST API — Spring MVC controllers",
        layer: "entry",
        kind: "entry",
        tech: ["Spring Boot", "Spring MVC", "Swagger / OpenAPI"],
        responsibility:
          "Defines the REST contract, binds and validates requests, and returns DTOs with explicit HTTP status codes.",
        io: "HTTP method + path in · DTO + status out",
      },
      {
        id: "mapping",
        short: "DTOs & Mapping",
        label: "DTOs, validation & mapping",
        layer: "mapping",
        kind: "entry",
        tech: ["Bean Validation", "MapStruct"],
        responsibility:
          "Keeps the API contract separate from entities: Bean Validation rejects bad input, MapStruct maps entity ↔ DTO.",
        io: "Reject invalid input (400) · map entity ↔ DTO",
      },
      {
        id: "service",
        short: "Service Layer",
        label: "Service layer",
        layer: "service",
        kind: "logic",
        tech: ["Spring", "@Transactional"],
        responsibility:
          "Owns the business rules and transaction boundaries — supplier orders and weighted-average (CUMP) stock valuation.",
        io: "Domain operations in · entities/commands out",
      },
      {
        id: "repository",
        short: "Repositories",
        label: "Spring Data JPA repositories",
        layer: "repository",
        kind: "persistence",
        tech: ["Spring Data JPA", "Hibernate"],
        responsibility:
          "Data access over the relational model: entity mapping, derived queries and persistence.",
        io: "Entities ↔ rows",
      },
      {
        id: "store",
        short: "MySQL",
        label: "MySQL database",
        layer: "store",
        kind: "store",
        tech: ["MySQL"],
        responsibility:
          "Durable relational store for products, suppliers, orders and stock movements.",
        io: "SQL statements",
      },
      {
        id: "ops",
        short: "Liquibase",
        label: "Schema migrations",
        layer: "ops",
        kind: "ops",
        tech: ["Liquibase"],
        responsibility:
          "Version-controlled, repeatable database schema changes applied on startup.",
        io: "Changelogs → schema",
      },
    ],
    edges: [
      { from: "client", to: "entry", kind: "request", label: "POST /api/supplier-orders" },
      { from: "entry", to: "mapping", kind: "data", label: "validate" },
      { from: "entry", to: "service", kind: "request", label: "command" },
      { from: "mapping", to: "service", kind: "data", label: "mapped DTO" },
      { from: "service", to: "repository", kind: "data" },
      { from: "repository", to: "store", kind: "data" },
      { from: "ops", to: "store", kind: "migration", label: "schema" },
      { from: "service", to: "entry", kind: "response", label: "result DTO" },
      { from: "entry", to: "client", kind: "response", label: "201 Created · JSON" },
    ],
    lifecycle: [
      {
        title: "Client sends the request",
        node: "client",
        what: "The browser issues an HTTP request with a JSON body.",
        detail:
          "Example: POST /api/supplier-orders with supplierId, orderDate and a list of lines (productId, quantity, unitCost).",
        status: "→ HTTP request",
      },
      {
        title: "Controller receives & validates",
        node: "entry",
        what: "Spring MVC binds the body to a DTO and runs Bean Validation.",
        detail:
          "Invalid payloads fail fast with 400 Bad Request and a field-by-field error body; valid payloads continue to the service.",
        status: "400 on invalid",
      },
      {
        title: "Service applies business rules",
        node: "service",
        what: "The service layer runs the domain logic inside a transaction boundary.",
        detail:
          "@Transactional opens a unit of work. The order is created and the weighted-average cost (CUMP) is recalculated for affected products.",
        status: "→ @Transactional",
      },
      {
        title: "Repository persists",
        node: "repository",
        what: "Spring Data JPA / Hibernate translates the entities into SQL.",
        detail:
          "Order header and lines are persisted and the resulting identifiers are populated back onto the managed entities.",
        status: "→ INSERT",
      },
      {
        title: "Database stores",
        node: "store",
        what: "MySQL executes the statements within the transaction.",
        detail:
          "If any statement fails, the whole unit of work rolls back so partial orders never persist.",
        status: "commit / rollback",
      },
      {
        title: "Mapping & serialization",
        node: "mapping",
        what: "The entity is mapped to a response DTO and serialized to JSON.",
        detail:
          "MapStruct keeps the wire format decoupled from the persistence model; the controller returns 201 Created with a Location header.",
        status: "201 Created",
      },
    ],
  },
  {
    id: "teleexpertise",
    name: "Healthcare Tele-Expertise",
    subtitle: "Jakarta EE · servlet + Hibernate",
    note: AUTH_NOTE,
    stack: ["Jakarta EE", "Tomcat", "PostgreSQL", "Hibernate", "Maven"],
    nodes: [
      {
        id: "client",
        short: "Web Client",
        label: "Web client",
        layer: "client",
        kind: "client",
        tech: ["Browser"],
        responsibility:
          "The interface used by nurses, general practitioners and specialists.",
        io: "HTTP request in · rendered response out",
      },
      {
        id: "entry",
        short: "Web / Controller Layer",
        label: "Jakarta EE web layer",
        layer: "entry",
        kind: "entry",
        tech: ["Jakarta EE", "Servlets"],
        responsibility:
          "Receives requests, routes them to the right use case, and prepares the response.",
        io: "HTTP in · domain calls out",
      },
      {
        id: "security",
        short: "Auth & Roles",
        label: "Authentication & role-based access",
        layer: "security",
        kind: "security",
        tech: ["Jakarta EE Security", "RBAC"],
        responsibility:
          "Authenticates the actor and authorizes each action by role — nurse, general practitioner or specialist.",
        io: "Identity + role in · allow / deny",
      },
      {
        id: "service",
        short: "Business Services",
        label: "Business service layer",
        layer: "service",
        kind: "logic",
        tech: ["Jakarta EE", "@Transactional"],
        responsibility:
          "The care workflow: expertise requests, scheduling and delivery of medical opinions.",
        io: "Use cases in · entities out",
      },
      {
        id: "repository",
        short: "Hibernate DAO",
        label: "Hibernate persistence layer",
        layer: "repository",
        kind: "persistence",
        tech: ["Hibernate", "JPA"],
        responsibility:
          "Object-relational mapping and data access for the persistence layer.",
        io: "Entities ↔ rows",
      },
      {
        id: "store",
        short: "PostgreSQL",
        label: "PostgreSQL database",
        layer: "store",
        kind: "store",
        tech: ["PostgreSQL"],
        responsibility:
          "Relational store for patients, consultations, expertise requests and medical opinions.",
        io: "SQL statements",
      },
    ],
    edges: [
      { from: "client", to: "entry", kind: "request", label: "HTTP request" },
      { from: "entry", to: "security", kind: "auth", label: "check role" },
      { from: "security", to: "service", kind: "auth", label: "authorized" },
      { from: "entry", to: "service", kind: "request" },
      { from: "service", to: "repository", kind: "data" },
      { from: "repository", to: "store", kind: "data" },
      { from: "service", to: "entry", kind: "response" },
      { from: "entry", to: "client", kind: "response", label: "result" },
    ],
    lifecycle: [
      {
        title: "Actor sends a request",
        node: "client",
        what: "A nurse, GP or specialist submits an action from the interface.",
        detail:
          "Example: a specialist opens an expertise request assigned to them to post a medical opinion.",
        status: "→ HTTP request",
      },
      {
        title: "Web layer routes it",
        node: "entry",
        what: "The Jakarta EE web layer maps the request to a use case.",
        detail: "Request parameters are read and forwarded to the service layer.",
      },
      {
        title: "Authentication & authorization",
        node: "security",
        what: "The actor is authenticated and checked against the required role.",
        detail:
          "Role-based access control decides whether a nurse, GP or specialist may perform the action, and rejects it otherwise.",
        status: "401 / 403",
      },
      {
        title: "Business rules run",
        node: "service",
        what: "The workflow logic and transaction boundary are applied.",
        detail:
          "Expertise requests, scheduling and opinion delivery are coordinated as a single unit of work.",
        status: "→ transaction",
      },
      {
        title: "Hibernate persists",
        node: "repository",
        what: "Entities are mapped to rows through Hibernate.",
        detail: "The ORM generates the statements and manages the session.",
      },
      {
        title: "PostgreSQL stores",
        node: "store",
        what: "The database commits the change.",
        detail: "A failure rolls the transaction back, keeping the record consistent.",
        status: "commit / rollback",
      },
    ],
  },
  {
    id: "store",
    name: "Online Store & Inventory",
    subtitle: "Vue.js · Laravel MVC",
    note: AUTH_NOTE,
    stack: ["Vue.js", "Laravel", "PostgreSQL", "Laravel Sanctum"],
    nodes: [
      {
        id: "client",
        short: "Vue.js SPA",
        label: "Vue.js single-page app",
        layer: "client",
        kind: "client",
        tech: ["Vue.js"],
        responsibility:
          "Component-based storefront and back-office UI that calls the API.",
        io: "JSON API calls · token in header",
      },
      {
        id: "entry",
        short: "Laravel Routes",
        label: "Laravel routes & controllers",
        layer: "entry",
        kind: "entry",
        tech: ["Laravel"],
        responsibility:
          "Defines the endpoints and request handling for the store and inventory.",
        io: "HTTP in · validation out",
      },
      {
        id: "security",
        short: "Sanctum & Roles",
        label: "Laravel Sanctum token auth & roles",
        layer: "security",
        kind: "security",
        tech: ["Laravel Sanctum", "RBAC"],
        responsibility:
          "Issues and validates API tokens, and enforces roles for administrators, sales staff and product managers.",
        io: "Token in · allow / deny",
      },
      {
        id: "service",
        short: "Domain Logic",
        label: "Domain logic (MVC)",
        layer: "service",
        kind: "logic",
        tech: ["Laravel"],
        responsibility:
          "Cart, order processing, invoicing and Excel import as model services.",
        io: "Use cases in · models out",
      },
      {
        id: "repository",
        short: "Eloquent ORM",
        label: "Eloquent ORM",
        layer: "repository",
        kind: "persistence",
        tech: ["Eloquent"],
        responsibility: "Active-record mapping between PHP models and tables.",
        io: "Models ↔ rows",
      },
      {
        id: "store",
        short: "PostgreSQL",
        label: "PostgreSQL database",
        layer: "store",
        kind: "store",
        tech: ["PostgreSQL"],
        responsibility:
          "Relational store for products, orders, invoices and users.",
        io: "SQL statements",
      },
    ],
    edges: [
      { from: "client", to: "entry", kind: "request", label: "API call" },
      { from: "entry", to: "security", kind: "auth", label: "verify token" },
      { from: "security", to: "service", kind: "auth", label: "authorized" },
      { from: "entry", to: "service", kind: "request" },
      { from: "service", to: "repository", kind: "data" },
      { from: "repository", to: "store", kind: "data" },
      { from: "service", to: "entry", kind: "response" },
      { from: "entry", to: "client", kind: "response", label: "JSON" },
    ],
    lifecycle: [
      {
        title: "SPA calls the API",
        node: "client",
        what: "The Vue.js frontend requests data with a bearer token.",
        detail: "Example: POST /api/orders with the cart contents as JSON.",
        status: "→ API call",
      },
      {
        title: "Route & request validation",
        node: "entry",
        what: "Laravel validates the request against rules.",
        detail: "Failed validation returns 422 with the offending fields.",
        status: "422 on invalid",
      },
      {
        title: "Token authentication",
        node: "security",
        what: "Sanctum resolves the token to a user and checks the role.",
        detail:
          "Only permitted roles reach order processing; others are rejected.",
        status: "401 / 403",
      },
      {
        title: "Domain logic runs",
        node: "service",
        what: "Order processing, totals and invoice generation execute.",
        detail: "Wrapped so a failure leaves no half-written order.",
        status: "→ transaction",
      },
      {
        title: "Eloquent persists",
        node: "repository",
        what: "Models are written through the ORM.",
        detail: "Relationships handle related rows such as order lines.",
      },
      {
        title: "PostgreSQL stores",
        node: "store",
        what: "The database commits the transaction.",
        detail: "The API responds with the created order.",
        status: "201 Created",
      },
    ],
  },
  {
    id: "events",
    name: "Event Management",
    subtitle: "Laravel · MVC web app",
    note: AUTH_NOTE,
    stack: ["Laravel", "TailwindCSS", "PostgreSQL", "JavaScript"],
    nodes: [
      {
        id: "client",
        short: "Web UI",
        label: "Web UI — Blade + TailwindCSS",
        layer: "client",
        kind: "client",
        tech: ["Blade", "TailwindCSS", "JavaScript"],
        responsibility:
          "Server-rendered pages for organizers, artists, attendees and admins.",
        io: "HTTP request in · HTML out",
      },
      {
        id: "entry",
        short: "Laravel Controllers",
        label: "Laravel controllers",
        layer: "entry",
        kind: "entry",
        tech: ["Laravel"],
        responsibility:
          "Handles event management and participation endpoints.",
        io: "HTTP in · validation out",
      },
      {
        id: "security",
        short: "Auth & Admin Role",
        label: "Authentication & admin role",
        layer: "security",
        kind: "security",
        tech: ["Laravel Auth", "RBAC"],
        responsibility:
          "Protects the administration dashboard and distinguishes organizer, artist and attendee actions.",
        io: "Session / role in · allow / deny",
      },
      {
        id: "service",
        short: "MVC Logic",
        label: "MVC business logic",
        layer: "service",
        kind: "logic",
        tech: ["Laravel"],
        responsibility:
          "Event creation, management and participation flows.",
        io: "Use cases in · models out",
      },
      {
        id: "repository",
        short: "Eloquent ORM",
        label: "Eloquent ORM",
        layer: "repository",
        kind: "persistence",
        tech: ["Eloquent"],
        responsibility: "Model ↔ table mapping for events and participants.",
        io: "Models ↔ rows",
      },
      {
        id: "store",
        short: "PostgreSQL",
        label: "PostgreSQL database",
        layer: "store",
        kind: "store",
        tech: ["PostgreSQL"],
        responsibility: "Relational store for events, artists and attendees.",
        io: "SQL statements",
      },
    ],
    edges: [
      { from: "client", to: "entry", kind: "request" },
      { from: "entry", to: "security", kind: "auth" },
      { from: "security", to: "service", kind: "auth" },
      { from: "entry", to: "service", kind: "request" },
      { from: "service", to: "repository", kind: "data" },
      { from: "repository", to: "store", kind: "data" },
      { from: "service", to: "entry", kind: "response" },
      { from: "entry", to: "client", kind: "response", label: "HTML" },
    ],
    lifecycle: [
      {
        title: "User opens a page",
        node: "client",
        what: "A visitor requests an event page or submits a form.",
        detail: "Example: an organizer publishes a new event.",
        status: "→ HTTP request",
      },
      {
        title: "Controller handles it",
        node: "entry",
        what: "Laravel routes the request and validates input.",
        detail: "Invalid form input returns back with validation messages.",
        status: "422 on invalid",
      },
      {
        title: "Auth & role check",
        node: "security",
        what: "The session is authenticated and the role is verified.",
        detail: "Only organizers and admins can publish or manage events.",
        status: "401 / 403",
      },
      {
        title: "MVC logic runs",
        node: "service",
        what: "The event is created and related records are prepared.",
        detail: "The operation runs as one unit so related rows stay consistent.",
      },
      {
        title: "Eloquent persists",
        node: "repository",
        what: "Models are written through the ORM.",
        detail: "Relationships cover organizers, artists and attendees.",
      },
      {
        title: "PostgreSQL stores",
        node: "store",
        what: "The database commits the change.",
        detail: "The controller renders the updated page.",
        status: "redirect / 200",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Database design explorer (illustrative)                             */
/* ------------------------------------------------------------------ */

export interface DbAttribute {
  name: string;
  type: string;
  pk?: boolean;
  fk?: string;
  note?: string;
}

export interface DbEntity {
  id: string;
  name: string;
  purpose: string;
  attributes: DbAttribute[];
  x: number;
  y: number;
}

export type Cardinality = "1:1" | "1:N" | "N:M";

export interface DbRelation {
  from: string;
  to: string;
  cardinality: Cardinality;
  label: string;
}

/**
 * Illustrative relational model reconstructed from the Inventory project's
 * documented features (products, suppliers, orders, stock movements). Column
 * names are representative, not copied from the original schema.
 */
export const dbModel: {
  name: string;
  note: string;
  entities: DbEntity[];
  relations: DbRelation[];
} = {
  name: "Inventory & Supplier Orders",
  note: "Illustrative model reconstructed from the project's documented features (products, suppliers, orders, stock movements). Column names are representative, not the original schema.",
  entities: [
    {
      id: "category",
      name: "category",
      purpose: "Groups products for browsing and reporting.",
      x: 40,
      y: 40,
      attributes: [
        { name: "id", type: "BIGINT", pk: true },
        { name: "name", type: "VARCHAR(120)" },
      ],
    },
    {
      id: "product",
      name: "product",
      purpose: "A stock item with its weighted-average cost.",
      x: 340,
      y: 40,
      attributes: [
        { name: "id", type: "BIGINT", pk: true },
        { name: "sku", type: "VARCHAR(64)", note: "unique" },
        { name: "name", type: "VARCHAR(160)" },
        { name: "unit_price", type: "DECIMAL(12,2)" },
        { name: "quantity_on_hand", type: "INT" },
        { name: "category_id", type: "BIGINT", fk: "category.id" },
      ],
    },
    {
      id: "supplier",
      name: "supplier",
      purpose: "A vendor that products are ordered from.",
      x: 640,
      y: 40,
      attributes: [
        { name: "id", type: "BIGINT", pk: true },
        { name: "name", type: "VARCHAR(160)" },
        { name: "email", type: "VARCHAR(160)", note: "nullable" },
      ],
    },
    {
      id: "supplier_order",
      name: "supplier_order",
      purpose: "A purchase order placed with a supplier.",
      x: 640,
      y: 300,
      attributes: [
        { name: "id", type: "BIGINT", pk: true },
        { name: "supplier_id", type: "BIGINT", fk: "supplier.id" },
        { name: "order_date", type: "DATE" },
        { name: "status", type: "VARCHAR(24)" },
        { name: "total_amount", type: "DECIMAL(14,2)" },
      ],
    },
    {
      id: "order_line",
      name: "supplier_order_line",
      purpose: "One product line on a supplier order.",
      x: 340,
      y: 300,
      attributes: [
        { name: "id", type: "BIGINT", pk: true },
        { name: "order_id", type: "BIGINT", fk: "supplier_order.id" },
        { name: "product_id", type: "BIGINT", fk: "product.id" },
        { name: "quantity", type: "INT" },
        { name: "unit_cost", type: "DECIMAL(12,2)" },
      ],
    },
    {
      id: "stock_movement",
      name: "stock_movement",
      purpose: "An inventory change used for CUMP valuation.",
      x: 40,
      y: 300,
      attributes: [
        { name: "id", type: "BIGINT", pk: true },
        { name: "product_id", type: "BIGINT", fk: "product.id" },
        { name: "type", type: "VARCHAR(16)", note: "IN / OUT" },
        { name: "quantity", type: "INT" },
        { name: "unit_cost", type: "DECIMAL(12,2)" },
        { name: "occurred_at", type: "TIMESTAMP" },
      ],
    },
  ],
  relations: [
    { from: "category", to: "product", cardinality: "1:N", label: "groups" },
    { from: "product", to: "order_line", cardinality: "1:N", label: "ordered as" },
    { from: "supplier", to: "supplier_order", cardinality: "1:N", label: "receives" },
    { from: "supplier_order", to: "order_line", cardinality: "1:N", label: "contains" },
    { from: "product", to: "stock_movement", cardinality: "1:N", label: "tracked by" },
  ],
};

/* ------------------------------------------------------------------ */
/* Simulated API playground                                            */
/* ------------------------------------------------------------------ */

export interface ApiExample {
  id: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  title: string;
  description: string;
  auth: string;
  request?: { headers?: Record<string, string>; body?: unknown };
  response: { status: number; statusText: string; body: unknown };
  errorCase?: { why: string; status: number; statusText: string; body: unknown };
}

/**
 * Simulated responses modelled on the Inventory project's REST contract.
 * No network request is made — the UI is clearly labelled as a simulation.
 */
export const apiExamples: ApiExample[] = [
  {
    id: "list-products",
    method: "GET",
    path: "/api/products?page=0&size=20",
    title: "List products (paginated)",
    description: "Returns a page of products with their current stock.",
    auth: "Public in this example — a real deployment would scope it to an authenticated role.",
    request: {
      headers: { Accept: "application/json" },
    },
    response: {
      status: 200,
      statusText: "OK",
      body: {
        content: [
          { id: 42, sku: "SKU-042", name: "A4 paper (500)", unitPrice: 4.9, quantityOnHand: 320 },
          { id: 51, sku: "SKU-051", name: "Ballpoint pen (blue)", unitPrice: 0.65, quantityOnHand: 1240 },
        ],
        page: 0,
        size: 20,
        totalElements: 2,
      },
    },
  },
  {
    id: "get-product",
    method: "GET",
    path: "/api/products/{id}",
    title: "Get one product",
    description: "Returns a single product or 404 when it does not exist.",
    auth: "Public in this example.",
    request: { headers: { Accept: "application/json" } },
    response: {
      status: 200,
      statusText: "OK",
      body: { id: 42, sku: "SKU-042", name: "A4 paper (500)", unitPrice: 4.9, quantityOnHand: 320, categoryId: 3 },
    },
    errorCase: {
      why: "Requesting GET /api/products/999999, an id that does not exist.",
      status: 404,
      statusText: "Not Found",
      body: { timestamp: "2025-01-01T10:00:00Z", status: 404, error: "Not Found", message: "Product 999999 not found", path: "/api/products/999999" },
    },
  },
  {
    id: "create-product",
    method: "POST",
    path: "/api/products",
    title: "Create a product",
    description: "Validates the body and returns 201 with a Location header.",
    auth: "Requires an authenticated user with a write role in a real deployment.",
    request: {
      headers: { "Content-Type": "application/json", Authorization: "Bearer <token>" },
      body: { sku: "SKU-100", name: "Stapler", unitPrice: 3.2, quantityOnHand: 0, categoryId: 3 },
    },
    response: {
      status: 201,
      statusText: "Created",
      body: { id: 100, sku: "SKU-100", name: "Stapler", unitPrice: 3.2, quantityOnHand: 0, categoryId: 3 },
    },
    errorCase: {
      why: "Sending an empty sku and a negative price fails Bean Validation.",
      status: 400,
      statusText: "Bad Request",
      body: {
        timestamp: "2025-01-01T10:00:00Z",
        status: 400,
        error: "Bad Request",
        message: "Validation failed",
        fieldErrors: [
          { field: "sku", message: "must not be blank" },
          { field: "unitPrice", message: "must be greater than or equal to 0" },
        ],
      },
    },
  },
  {
    id: "unauthorized",
    method: "POST",
    path: "/api/supplier-orders",
    title: "Create a supplier order",
    description: "Creates a purchase order and recalculates stock valuation.",
    auth: "Requires a bearer token. Without one, the API returns 401.",
    request: {
      headers: { "Content-Type": "application/json" },
      body: { supplierId: 7, orderDate: "2025-01-01", lines: [{ productId: 42, quantity: 100, unitCost: 4.5 }] },
    },
    response: {
      status: 201,
      statusText: "Created",
      body: { id: 301, supplierId: 7, orderDate: "2025-01-01", status: "DRAFT", totalAmount: 450.0 },
    },
    errorCase: {
      why: "Calling the endpoint without an Authorization header.",
      status: 401,
      statusText: "Unauthorized",
      body: { timestamp: "2025-01-01T10:00:00Z", status: 401, error: "Unauthorized", message: "Full authentication is required to access this resource", path: "/api/supplier-orders" },
    },
  },
];

/* ------------------------------------------------------------------ */
/* Software design case studies                                        */
/* ------------------------------------------------------------------ */

export interface CaseStudy {
  id: string;
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
  repo: string;
}

export const caseStudies: CaseStudy[] = [
  {
    id: "cump",
    project: "Inventory & Supplier Orders Management System",
    summary: "Keeping stock valuation correct (CUMP) under concurrent orders.",
    problem:
      "Inventory valuation using the weighted-average cost (CUMP) must stay correct as supplier orders and stock movements change the quantities and costs of products.",
    constraints: [
      "Every movement changes the product's average cost, so the calculation has to be consistent.",
      "A partially applied order would corrupt stock figures, so writes must be atomic.",
      "The API contract should not leak the persistence model.",
    ],
    architecture:
      "A layered Spring Boot service: REST controllers → service layer (@Transactional) → Spring Data JPA repositories → MySQL, with Liquibase managing the schema.",
    decision:
      "Centralise valuation in the service layer and run each order as a single transaction, recomputing CUMP from the recorded stock movements.",
    rationale:
      "The average cost is derived from the ordered sequence of movements, so it belongs with the business rules, not the controller or the database. A transaction boundary guarantees the order and its valuation change together or not at all.",
    alternatives: [
      {
        option: "Compute the average in the database with a trigger or view.",
        tradeoff:
          "Fewer round-trips, but hides business logic in the schema, is harder to test in isolation, and is less portable across databases.",
      },
      {
        option: "Compute valuation on read (materialised on demand).",
        tradeoff:
          "Keeps writes simple, but repeats expensive work on every read and gives up a single source of truth.",
      },
    ],
    quality: [
      {
        label: "Error handling",
        value:
          "Invalid input is rejected by Bean Validation before the service runs; failures inside the transaction roll back the whole unit of work.",
      },
      {
        label: "Testing",
        value:
          "The valuation logic lives in plain service code, so it can be exercised with unit tests without a running database.",
      },
      {
        label: "Maintainability",
        value:
          "DTOs and MapStruct keep the REST contract decoupled from entities, so the schema can change without breaking the API.",
      },
      {
        label: "Schema",
        value:
          "Liquibase changelogs make schema changes reviewable and repeatable across environments.",
      },
    ],
    improvements: [
      "Add optimistic locking or a version column to protect against concurrent valuation updates.",
      "Expose the valuation as an explicit domain operation with clear invariants and unit tests.",
      "Document the REST contract with example payloads directly from the OpenAPI spec.",
    ],
    repo: "https://github.com/Azzedine-zemmari/Tricol",
  },
  {
    id: "roles",
    project: "Healthcare Tele-Expertise Workflow System",
    summary: "Modelling a multi-actor care workflow with strict role separation.",
    problem:
      "The system connects nurses, general practitioners and specialists around shared expertise requests and medical opinions, and each actor must only perform the actions allowed to them.",
    constraints: [
      "Different actors need different views and permissions over the same records.",
      "Medical data makes authorization correctness and auditability important.",
      "The workflow spans several steps (request → consultation → opinion).",
    ],
    architecture:
      "A Jakarta EE web application: web/controller layer → role-based security → service layer → Hibernate persistence → PostgreSQL.",
    decision:
      "Enforce authorization at the entry layer by role, and keep the multi-step workflow in the service layer as cohesive use cases.",
    rationale:
      "Checking roles at the boundary means every use case is protected consistently, while the service layer stays focused on the workflow rules instead of repeating security checks.",
    alternatives: [
      {
        option: "Put authorization checks inside each service method.",
        tradeoff:
          "Fine-grained and explicit, but easy to forget in a new method and harder to reason about globally.",
      },
      {
        option: "Store permissions as data and evaluate them dynamically.",
        tradeoff:
          "More flexible, but adds a permissions subsystem that is overkill for a fixed set of three actor roles.",
      },
    ],
    quality: [
      {
        label: "Security",
        value:
          "Authentication plus role-based access control gate every action; actors cannot reach functions outside their role.",
      },
      {
        label: "Data integrity",
        value:
          "The service layer runs workflow steps as transactions so a partially completed workflow cannot persist.",
      },
      {
        label: "Maintainability",
        value:
          "Each step of the care workflow is a named use case, keeping the business rules readable.",
      },
    ],
    improvements: [
      "Introduce an audit trail of who performed which action and when.",
      "Add automated integration tests for each role's allowed and denied actions.",
      "Extract shared validation of the workflow state machine.",
    ],
    repo: "https://github.com/Azzedine-zemmari/tele-expertise-medicale",
  },
  {
    id: "tokens",
    project: "Online Store & Inventory Management Platform",
    summary: "API token auth and role-based back-office access in Laravel.",
    problem:
      "A Vue.js storefront and a back-office must share one API, while administrators, sales staff and product managers need different levels of access.",
    constraints: [
      "The frontend is a separate SPA, so the API must be stateless and token-based.",
      "Roles must be enforced server-side, never trusted from the client.",
      "Orders must stay consistent even when invoicing and imports run.",
    ],
    architecture:
      "Vue.js SPA → Laravel routes/controllers → Sanctum token auth & roles → domain (MVC) logic → Eloquent → PostgreSQL.",
    decision:
      "Use Laravel Sanctum for stateless API tokens and enforce role checks on the server for every protected route.",
    rationale:
      "Sanctum is a natural fit for an SPA talking to a Laravel API, and server-side role checks mean the SPA can be treated as untrusted input.",
    alternatives: [
      {
        option: "Session cookies for the SPA.",
        tradeoff:
          "Simpler for same-origin apps, but awkward for a decoupled SPA and cross-origin API calls.",
      },
      {
        option: "Roll a custom JWT scheme.",
        tradeoff:
          "Full control, but re-implements token issuance, revocation and guards that a maintained library already handles safely.",
      },
    ],
    quality: [
      {
        label: "Security",
        value:
          "Tokens authenticate the SPA; roles are checked server-side so permissions cannot be bypassed from the client.",
      },
      {
        label: "Maintainability",
        value:
          "MVC plus Eloquent keeps controllers thin and domain logic in models/services.",
      },
      {
        label: "Features",
        value:
          "Order processing, PDF invoicing and Excel import are separated so each can evolve independently.",
      },
    ],
    improvements: [
      "Move invoice generation and Excel import to queued jobs so requests stay fast.",
      "Add feature tests that assert each role's access matrix.",
      "Introduce API resources to standardise response shapes.",
    ],
    repo: "https://github.com/Azzedine-zemmari/Power_Eco",
  },
  {
    id: "structure",
    project: "Event Management Web Application",
    summary: "Keeping a multi-role event platform readable with clear MVC boundaries.",
    problem:
      "Organizers, artists, attendees and administrators share one platform, and the code needs to stay understandable as features grow.",
    constraints: [
      "Several roles act on overlapping data (events, participation).",
      "The interface must stay responsive across devices.",
      "The administration dashboard needs stricter access than public pages.",
    ],
    architecture:
      "Blade + TailwindCSS UI → Laravel controllers → auth & admin role → MVC logic → Eloquent → PostgreSQL.",
    decision:
      "Follow Laravel's MVC conventions strictly and keep admin-only actions behind an explicit role check.",
    rationale:
      "Convention over configuration keeps the project approachable for anyone familiar with Laravel, and a clear admin boundary prevents accidental privilege leaks.",
    alternatives: [
      {
        option: "Build a separate admin SPA.",
        tradeoff:
          "Nicer for a complex back-office, but adds a second codebase and API surface for a project of this size.",
      },
      {
        option: "Fine-grained per-route middleware for every role.",
        tradeoff:
          "More explicit, but verbose; a small set of roles is better served by a couple of clear guards.",
      },
    ],
    quality: [
      {
        label: "Security",
        value:
          "Authentication plus an admin role guard protect the dashboard; public pages remain open.",
      },
      {
        label: "Maintainability",
        value:
          "Strict MVC conventions keep controllers, models and views in predictable places.",
      },
      {
        label: "Frontend",
        value:
          "TailwindCSS provides a consistent, responsive design system without bespoke CSS.",
      },
    ],
    improvements: [
      "Add automated tests covering the participation flows.",
      "Introduce policies for finer-grained authorization rules.",
      "Index the events table for the most common listing queries.",
    ],
    repo: "https://github.com/Azzedine-zemmari/THE_Beatwave",
  },
];

/* ------------------------------------------------------------------ */
/* Project engineering depth (project showcase upgrade)                */
/* ------------------------------------------------------------------ */

export interface ProjectEngineering {
  /** Must match a project title in portfolio.ts. */
  title: string;
  problem: string;
  contribution: string;
  backend: string[];
  frontend: string[];
  dataNotes: string;
  apiNotes: string;
  quality: string;
}

export const projectEngineering: ProjectEngineering[] = [
  {
    title: "Healthcare Tele-Expertise Workflow System",
    problem:
      "Give nurses, GPs and specialists one shared workflow for expertise requests and medical opinions, replacing scattered communication.",
    contribution:
      "Designed the layered Jakarta EE application and implemented the multi-actor workflow, role-based access and the Hibernate persistence layer.",
    backend: ["Jakarta EE", "Hibernate / JPA", "PostgreSQL", "Maven"],
    frontend: ["Web UI"],
    dataNotes:
      "Core entities: patients, consultations, expertise requests and medical opinions, related by Hibernate mappings.",
    apiNotes:
      "Role-aware endpoints that expose the workflow steps while hiding persistence details.",
    quality:
      "Authentication plus server-side role checks; workflow steps run as transactions so a partial flow cannot persist.",
  },
  {
    title: "Inventory & Supplier Orders Management System",
    problem:
      "Track supplier orders, stock movements and inventory valuation accurately as quantities and costs change.",
    contribution:
      "Built the layered Spring Boot service, the CUMP valuation logic and the API contract, with generated documentation and managed schema changes.",
    backend: ["Spring Boot", "Spring Data JPA", "MapStruct", "Liquibase", "Swagger"],
    frontend: ["REST API client"],
    dataNotes:
      "Products, suppliers, orders, order lines and stock movements; schema changes versioned with Liquibase.",
    apiNotes:
      "REST endpoints with DTOs and Bean Validation; MapStruct keeps entities out of the wire format.",
    quality:
      "Bean Validation rejects bad input early; order writes run inside @Transactional boundaries; the API is documented with Swagger/OpenAPI.",
  },
  {
    title: "Online Store & Inventory Management Platform",
    problem:
      "Run a storefront and back-office on one API with different levels of access for admins, sales staff and product managers.",
    contribution:
      "Implemented the Vue.js frontend over a Laravel API, including token authentication, role-based access, order processing, PDF invoicing and Excel import.",
    backend: ["Laravel", "Laravel Sanctum", "PostgreSQL"],
    frontend: ["Vue.js"],
    dataNotes:
      "Users, roles, products, orders and invoices in PostgreSQL, accessed through Eloquent.",
    apiNotes:
      "Stateless token-authenticated API endpoints shared by the SPA and back-office.",
    quality:
      "Sanctum tokens plus server-side role enforcement; orders are processed as units so invoicing stays consistent.",
  },
  {
    title: "Event Management Web Application",
    problem:
      "Let organizers, artists, attendees and administrators create, manage and join events from one platform.",
    contribution:
      "Built the Laravel MVC application with a role-guarded admin dashboard and a responsive TailwindCSS interface.",
    backend: ["Laravel", "PostgreSQL"],
    frontend: ["Blade", "TailwindCSS", "JavaScript"],
    dataNotes:
      "Events, artists, attendees and participation records related through Eloquent.",
    apiNotes:
      "Server-rendered routes with validation; admin-only actions sit behind an explicit role check.",
    quality:
      "Authentication with an admin role guard; validation on all form input; clear MVC boundaries.",
  },
];
