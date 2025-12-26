import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

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

interface CreateInvoiceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateInvoiceVariables): MutationRef<CreateInvoiceData, CreateInvoiceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateInvoiceVariables): MutationRef<CreateInvoiceData, CreateInvoiceVariables>;
  operationName: string;
}
export const createInvoiceRef: CreateInvoiceRef;

export function createInvoice(vars: CreateInvoiceVariables): MutationPromise<CreateInvoiceData, CreateInvoiceVariables>;
export function createInvoice(dc: DataConnect, vars: CreateInvoiceVariables): MutationPromise<CreateInvoiceData, CreateInvoiceVariables>;

interface ListInvoicesForUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListInvoicesForUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListInvoicesForUserData, undefined>;
  operationName: string;
}
export const listInvoicesForUserRef: ListInvoicesForUserRef;

export function listInvoicesForUser(): QueryPromise<ListInvoicesForUserData, undefined>;
export function listInvoicesForUser(dc: DataConnect): QueryPromise<ListInvoicesForUserData, undefined>;

interface UpdateInvoiceStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateInvoiceStatusVariables): MutationRef<UpdateInvoiceStatusData, UpdateInvoiceStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateInvoiceStatusVariables): MutationRef<UpdateInvoiceStatusData, UpdateInvoiceStatusVariables>;
  operationName: string;
}
export const updateInvoiceStatusRef: UpdateInvoiceStatusRef;

export function updateInvoiceStatus(vars: UpdateInvoiceStatusVariables): MutationPromise<UpdateInvoiceStatusData, UpdateInvoiceStatusVariables>;
export function updateInvoiceStatus(dc: DataConnect, vars: UpdateInvoiceStatusVariables): MutationPromise<UpdateInvoiceStatusData, UpdateInvoiceStatusVariables>;

interface GetInvoiceDetailsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetInvoiceDetailsVariables): QueryRef<GetInvoiceDetailsData, GetInvoiceDetailsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetInvoiceDetailsVariables): QueryRef<GetInvoiceDetailsData, GetInvoiceDetailsVariables>;
  operationName: string;
}
export const getInvoiceDetailsRef: GetInvoiceDetailsRef;

export function getInvoiceDetails(vars: GetInvoiceDetailsVariables): QueryPromise<GetInvoiceDetailsData, GetInvoiceDetailsVariables>;
export function getInvoiceDetails(dc: DataConnect, vars: GetInvoiceDetailsVariables): QueryPromise<GetInvoiceDetailsData, GetInvoiceDetailsVariables>;

