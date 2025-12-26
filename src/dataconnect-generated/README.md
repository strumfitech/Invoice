# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListInvoicesForUser*](#listinvoicesforuser)
  - [*GetInvoiceDetails*](#getinvoicedetails)
- [**Mutations**](#mutations)
  - [*CreateInvoice*](#createinvoice)
  - [*UpdateInvoiceStatus*](#updateinvoicestatus)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListInvoicesForUser
You can execute the `ListInvoicesForUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listInvoicesForUser(): QueryPromise<ListInvoicesForUserData, undefined>;

interface ListInvoicesForUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListInvoicesForUserData, undefined>;
}
export const listInvoicesForUserRef: ListInvoicesForUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listInvoicesForUser(dc: DataConnect): QueryPromise<ListInvoicesForUserData, undefined>;

interface ListInvoicesForUserRef {
  ...
  (dc: DataConnect): QueryRef<ListInvoicesForUserData, undefined>;
}
export const listInvoicesForUserRef: ListInvoicesForUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listInvoicesForUserRef:
```typescript
const name = listInvoicesForUserRef.operationName;
console.log(name);
```

### Variables
The `ListInvoicesForUser` query has no variables.
### Return Type
Recall that executing the `ListInvoicesForUser` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListInvoicesForUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListInvoicesForUserData {
  invoices: ({
    id: UUIDString;
    invoiceNumber: string;
    dueDate: DateString;
    totalAmount: number;
    status: string;
  } & Invoice_Key)[];
}
```
### Using `ListInvoicesForUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listInvoicesForUser } from '@dataconnect/generated';


// Call the `listInvoicesForUser()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listInvoicesForUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listInvoicesForUser(dataConnect);

console.log(data.invoices);

// Or, you can use the `Promise` API.
listInvoicesForUser().then((response) => {
  const data = response.data;
  console.log(data.invoices);
});
```

### Using `ListInvoicesForUser`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listInvoicesForUserRef } from '@dataconnect/generated';


// Call the `listInvoicesForUserRef()` function to get a reference to the query.
const ref = listInvoicesForUserRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listInvoicesForUserRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.invoices);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.invoices);
});
```

## GetInvoiceDetails
You can execute the `GetInvoiceDetails` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getInvoiceDetails(vars: GetInvoiceDetailsVariables): QueryPromise<GetInvoiceDetailsData, GetInvoiceDetailsVariables>;

interface GetInvoiceDetailsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetInvoiceDetailsVariables): QueryRef<GetInvoiceDetailsData, GetInvoiceDetailsVariables>;
}
export const getInvoiceDetailsRef: GetInvoiceDetailsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getInvoiceDetails(dc: DataConnect, vars: GetInvoiceDetailsVariables): QueryPromise<GetInvoiceDetailsData, GetInvoiceDetailsVariables>;

interface GetInvoiceDetailsRef {
  ...
  (dc: DataConnect, vars: GetInvoiceDetailsVariables): QueryRef<GetInvoiceDetailsData, GetInvoiceDetailsVariables>;
}
export const getInvoiceDetailsRef: GetInvoiceDetailsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getInvoiceDetailsRef:
```typescript
const name = getInvoiceDetailsRef.operationName;
console.log(name);
```

### Variables
The `GetInvoiceDetails` query requires an argument of type `GetInvoiceDetailsVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetInvoiceDetailsVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetInvoiceDetails` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetInvoiceDetailsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetInvoiceDetails`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getInvoiceDetails, GetInvoiceDetailsVariables } from '@dataconnect/generated';

// The `GetInvoiceDetails` query requires an argument of type `GetInvoiceDetailsVariables`:
const getInvoiceDetailsVars: GetInvoiceDetailsVariables = {
  id: ..., 
};

// Call the `getInvoiceDetails()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getInvoiceDetails(getInvoiceDetailsVars);
// Variables can be defined inline as well.
const { data } = await getInvoiceDetails({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getInvoiceDetails(dataConnect, getInvoiceDetailsVars);

console.log(data.invoice);

// Or, you can use the `Promise` API.
getInvoiceDetails(getInvoiceDetailsVars).then((response) => {
  const data = response.data;
  console.log(data.invoice);
});
```

### Using `GetInvoiceDetails`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getInvoiceDetailsRef, GetInvoiceDetailsVariables } from '@dataconnect/generated';

// The `GetInvoiceDetails` query requires an argument of type `GetInvoiceDetailsVariables`:
const getInvoiceDetailsVars: GetInvoiceDetailsVariables = {
  id: ..., 
};

// Call the `getInvoiceDetailsRef()` function to get a reference to the query.
const ref = getInvoiceDetailsRef(getInvoiceDetailsVars);
// Variables can be defined inline as well.
const ref = getInvoiceDetailsRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getInvoiceDetailsRef(dataConnect, getInvoiceDetailsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.invoice);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.invoice);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateInvoice
You can execute the `CreateInvoice` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createInvoice(vars: CreateInvoiceVariables): MutationPromise<CreateInvoiceData, CreateInvoiceVariables>;

interface CreateInvoiceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateInvoiceVariables): MutationRef<CreateInvoiceData, CreateInvoiceVariables>;
}
export const createInvoiceRef: CreateInvoiceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createInvoice(dc: DataConnect, vars: CreateInvoiceVariables): MutationPromise<CreateInvoiceData, CreateInvoiceVariables>;

interface CreateInvoiceRef {
  ...
  (dc: DataConnect, vars: CreateInvoiceVariables): MutationRef<CreateInvoiceData, CreateInvoiceVariables>;
}
export const createInvoiceRef: CreateInvoiceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createInvoiceRef:
```typescript
const name = createInvoiceRef.operationName;
console.log(name);
```

### Variables
The `CreateInvoice` mutation requires an argument of type `CreateInvoiceVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `CreateInvoice` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateInvoiceData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateInvoiceData {
  invoice_insert: Invoice_Key;
}
```
### Using `CreateInvoice`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createInvoice, CreateInvoiceVariables } from '@dataconnect/generated';

// The `CreateInvoice` mutation requires an argument of type `CreateInvoiceVariables`:
const createInvoiceVars: CreateInvoiceVariables = {
  clientId: ..., // optional
  currency: ..., // optional
  discountPercentage: ..., // optional
  dueDate: ..., 
  invoiceNumber: ..., 
  issueDate: ..., 
  notes: ..., // optional
  status: ..., 
  taxPercentage: ..., // optional
  totalAmount: ..., 
};

// Call the `createInvoice()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createInvoice(createInvoiceVars);
// Variables can be defined inline as well.
const { data } = await createInvoice({ clientId: ..., currency: ..., discountPercentage: ..., dueDate: ..., invoiceNumber: ..., issueDate: ..., notes: ..., status: ..., taxPercentage: ..., totalAmount: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createInvoice(dataConnect, createInvoiceVars);

console.log(data.invoice_insert);

// Or, you can use the `Promise` API.
createInvoice(createInvoiceVars).then((response) => {
  const data = response.data;
  console.log(data.invoice_insert);
});
```

### Using `CreateInvoice`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createInvoiceRef, CreateInvoiceVariables } from '@dataconnect/generated';

// The `CreateInvoice` mutation requires an argument of type `CreateInvoiceVariables`:
const createInvoiceVars: CreateInvoiceVariables = {
  clientId: ..., // optional
  currency: ..., // optional
  discountPercentage: ..., // optional
  dueDate: ..., 
  invoiceNumber: ..., 
  issueDate: ..., 
  notes: ..., // optional
  status: ..., 
  taxPercentage: ..., // optional
  totalAmount: ..., 
};

// Call the `createInvoiceRef()` function to get a reference to the mutation.
const ref = createInvoiceRef(createInvoiceVars);
// Variables can be defined inline as well.
const ref = createInvoiceRef({ clientId: ..., currency: ..., discountPercentage: ..., dueDate: ..., invoiceNumber: ..., issueDate: ..., notes: ..., status: ..., taxPercentage: ..., totalAmount: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createInvoiceRef(dataConnect, createInvoiceVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.invoice_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.invoice_insert);
});
```

## UpdateInvoiceStatus
You can execute the `UpdateInvoiceStatus` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateInvoiceStatus(vars: UpdateInvoiceStatusVariables): MutationPromise<UpdateInvoiceStatusData, UpdateInvoiceStatusVariables>;

interface UpdateInvoiceStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateInvoiceStatusVariables): MutationRef<UpdateInvoiceStatusData, UpdateInvoiceStatusVariables>;
}
export const updateInvoiceStatusRef: UpdateInvoiceStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateInvoiceStatus(dc: DataConnect, vars: UpdateInvoiceStatusVariables): MutationPromise<UpdateInvoiceStatusData, UpdateInvoiceStatusVariables>;

interface UpdateInvoiceStatusRef {
  ...
  (dc: DataConnect, vars: UpdateInvoiceStatusVariables): MutationRef<UpdateInvoiceStatusData, UpdateInvoiceStatusVariables>;
}
export const updateInvoiceStatusRef: UpdateInvoiceStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateInvoiceStatusRef:
```typescript
const name = updateInvoiceStatusRef.operationName;
console.log(name);
```

### Variables
The `UpdateInvoiceStatus` mutation requires an argument of type `UpdateInvoiceStatusVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateInvoiceStatusVariables {
  id: UUIDString;
  status: string;
}
```
### Return Type
Recall that executing the `UpdateInvoiceStatus` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateInvoiceStatusData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateInvoiceStatusData {
  invoice_update?: Invoice_Key | null;
}
```
### Using `UpdateInvoiceStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateInvoiceStatus, UpdateInvoiceStatusVariables } from '@dataconnect/generated';

// The `UpdateInvoiceStatus` mutation requires an argument of type `UpdateInvoiceStatusVariables`:
const updateInvoiceStatusVars: UpdateInvoiceStatusVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateInvoiceStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateInvoiceStatus(updateInvoiceStatusVars);
// Variables can be defined inline as well.
const { data } = await updateInvoiceStatus({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateInvoiceStatus(dataConnect, updateInvoiceStatusVars);

console.log(data.invoice_update);

// Or, you can use the `Promise` API.
updateInvoiceStatus(updateInvoiceStatusVars).then((response) => {
  const data = response.data;
  console.log(data.invoice_update);
});
```

### Using `UpdateInvoiceStatus`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateInvoiceStatusRef, UpdateInvoiceStatusVariables } from '@dataconnect/generated';

// The `UpdateInvoiceStatus` mutation requires an argument of type `UpdateInvoiceStatusVariables`:
const updateInvoiceStatusVars: UpdateInvoiceStatusVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateInvoiceStatusRef()` function to get a reference to the mutation.
const ref = updateInvoiceStatusRef(updateInvoiceStatusVars);
// Variables can be defined inline as well.
const ref = updateInvoiceStatusRef({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateInvoiceStatusRef(dataConnect, updateInvoiceStatusVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.invoice_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.invoice_update);
});
```

