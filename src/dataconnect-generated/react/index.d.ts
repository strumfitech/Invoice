import { CreateInvoiceData, CreateInvoiceVariables, ListInvoicesForUserData, UpdateInvoiceStatusData, UpdateInvoiceStatusVariables, GetInvoiceDetailsData, GetInvoiceDetailsVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateInvoice(options?: useDataConnectMutationOptions<CreateInvoiceData, FirebaseError, CreateInvoiceVariables>): UseDataConnectMutationResult<CreateInvoiceData, CreateInvoiceVariables>;
export function useCreateInvoice(dc: DataConnect, options?: useDataConnectMutationOptions<CreateInvoiceData, FirebaseError, CreateInvoiceVariables>): UseDataConnectMutationResult<CreateInvoiceData, CreateInvoiceVariables>;

export function useListInvoicesForUser(options?: useDataConnectQueryOptions<ListInvoicesForUserData>): UseDataConnectQueryResult<ListInvoicesForUserData, undefined>;
export function useListInvoicesForUser(dc: DataConnect, options?: useDataConnectQueryOptions<ListInvoicesForUserData>): UseDataConnectQueryResult<ListInvoicesForUserData, undefined>;

export function useUpdateInvoiceStatus(options?: useDataConnectMutationOptions<UpdateInvoiceStatusData, FirebaseError, UpdateInvoiceStatusVariables>): UseDataConnectMutationResult<UpdateInvoiceStatusData, UpdateInvoiceStatusVariables>;
export function useUpdateInvoiceStatus(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateInvoiceStatusData, FirebaseError, UpdateInvoiceStatusVariables>): UseDataConnectMutationResult<UpdateInvoiceStatusData, UpdateInvoiceStatusVariables>;

export function useGetInvoiceDetails(vars: GetInvoiceDetailsVariables, options?: useDataConnectQueryOptions<GetInvoiceDetailsData>): UseDataConnectQueryResult<GetInvoiceDetailsData, GetInvoiceDetailsVariables>;
export function useGetInvoiceDetails(dc: DataConnect, vars: GetInvoiceDetailsVariables, options?: useDataConnectQueryOptions<GetInvoiceDetailsData>): UseDataConnectQueryResult<GetInvoiceDetailsData, GetInvoiceDetailsVariables>;
