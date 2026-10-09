/**
 * One entry per "kind of customer" a test can ask for.
 * globalSetup calls each endpoint and stores the ids under the scenario key.
 *
 * Adjust endpoints, params and extractIds to match your backend.
 */
export interface CustomerQuery {
  endpoint: string;
  params?: Record<string, string | number | boolean>;
  extractIds: (body: any) => Array<string | number>;
}

export const customerQueries = {
  activeCustomer: {
    endpoint: '/api/customers',
    params: { status: 'ACTIVE', limit: 10 },
    extractIds: (body) => body.items.map((c: { id: string }) => c.id),
  },
  customerWithOpenInvoices: {
    endpoint: '/api/invoices/customers',
    params: { invoiceStatus: 'OPEN', limit: 10 },
    extractIds: (body) => body.map((c: { customerId: string }) => c.customerId),
  },
  blockedCustomer: {
    endpoint: '/api/customers',
    params: { status: 'BLOCKED', limit: 5 },
    extractIds: (body) => body.items.map((c: { id: string }) => c.id),
  },
} satisfies Record<string, CustomerQuery>;

export type CustomerScenario = keyof typeof customerQueries;
