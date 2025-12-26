import { ConnectorConfig, DataConnect, OperationOptions, ExecuteOperationResponse } from 'firebase-admin/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;


export interface Client_Key {
  id: UUIDString;
  __typename?: 'Client_Key';
}

export interface CreateInvoiceData {
  invoice_insert: Invoice_Key;
}

export interface CreateInvoiceVariables {
  clientId?: UUIDString | null;
  currency?: string | null;
  discountPercentage?: number | null;
  dueDate: DateString;
  invoiceNumber: string;
  issueDate: DateString;
  notes?: string | null;
  status: string;
  taxPercentage?: number | null;
  totalAmount: number;
}

export interface GetInvoiceDetailsData {
  invoice?: {
    id: UUIDString;
    invoiceNumber: string;
    issueDate: DateString;
    dueDate: DateString;
    status: string;
    currency?: string | null;
    discountPercentage?: number | null;
    taxPercentage?: number | null;
    totalAmount: number;
    notes?: string | null;
    client?: {
      id: UUIDString;
      name: string;
      email: string;
      phoneNumber?: string | null;
    } & Client_Key;
      invoiceItems_on_invoice: ({
        id: UUIDString;
        description?: string | null;
        quantity: number;
        unitPrice: number;
        taxAmount?: number | null;
        lineTotal: number;
        productOrService?: {
          id: UUIDString;
          name: string;
          description?: string | null;
          unitPrice: number;
        } & ProductOrService_Key;
      } & InvoiceItem_Key)[];
  } & Invoice_Key;
}

export interface GetInvoiceDetailsVariables {
  id: UUIDString;
}

export interface InvoiceItem_Key {
  id: UUIDString;
  __typename?: 'InvoiceItem_Key';
}

export interface Invoice_Key {
  id: UUIDString;
  __typename?: 'Invoice_Key';
}

export interface ListInvoicesForUserData {
  invoices: ({
    id: UUIDString;
    invoiceNumber: string;
    dueDate: DateString;
    totalAmount: number;
    status: string;
  } & Invoice_Key)[];
}

export interface ProductOrService_Key {
  id: UUIDString;
  __typename?: 'ProductOrService_Key';
}

export interface UpdateInvoiceStatusData {
  invoice_update?: Invoice_Key | null;
}

export interface UpdateInvoiceStatusVariables {
  id: UUIDString;
  status: string;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

/** Generated Node Admin SDK operation action function for the 'CreateInvoice' Mutation. Allow users to execute without passing in DataConnect. */
export function createInvoice(dc: DataConnect, vars: CreateInvoiceVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateInvoiceData>>;
/** Generated Node Admin SDK operation action function for the 'CreateInvoice' Mutation. Allow users to pass in custom DataConnect instances. */
export function createInvoice(vars: CreateInvoiceVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateInvoiceData>>;

/** Generated Node Admin SDK operation action function for the 'ListInvoicesForUser' Query. Allow users to execute without passing in DataConnect. */
export function listInvoicesForUser(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListInvoicesForUserData>>;
/** Generated Node Admin SDK operation action function for the 'ListInvoicesForUser' Query. Allow users to pass in custom DataConnect instances. */
export function listInvoicesForUser(options?: OperationOptions): Promise<ExecuteOperationResponse<ListInvoicesForUserData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateInvoiceStatus' Mutation. Allow users to execute without passing in DataConnect. */
export function updateInvoiceStatus(dc: DataConnect, vars: UpdateInvoiceStatusVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateInvoiceStatusData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateInvoiceStatus' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateInvoiceStatus(vars: UpdateInvoiceStatusVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateInvoiceStatusData>>;

/** Generated Node Admin SDK operation action function for the 'GetInvoiceDetails' Query. Allow users to execute without passing in DataConnect. */
export function getInvoiceDetails(dc: DataConnect, vars: GetInvoiceDetailsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetInvoiceDetailsData>>;
/** Generated Node Admin SDK operation action function for the 'GetInvoiceDetails' Query. Allow users to pass in custom DataConnect instances. */
export function getInvoiceDetails(vars: GetInvoiceDetailsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetInvoiceDetailsData>>;

