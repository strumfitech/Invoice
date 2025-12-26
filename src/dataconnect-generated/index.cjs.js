const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'invoice',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const createInvoiceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateInvoice', inputVars);
}
createInvoiceRef.operationName = 'CreateInvoice';
exports.createInvoiceRef = createInvoiceRef;

exports.createInvoice = function createInvoice(dcOrVars, vars) {
  return executeMutation(createInvoiceRef(dcOrVars, vars));
};

const listInvoicesForUserRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListInvoicesForUser');
}
listInvoicesForUserRef.operationName = 'ListInvoicesForUser';
exports.listInvoicesForUserRef = listInvoicesForUserRef;

exports.listInvoicesForUser = function listInvoicesForUser(dc) {
  return executeQuery(listInvoicesForUserRef(dc));
};

const updateInvoiceStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateInvoiceStatus', inputVars);
}
updateInvoiceStatusRef.operationName = 'UpdateInvoiceStatus';
exports.updateInvoiceStatusRef = updateInvoiceStatusRef;

exports.updateInvoiceStatus = function updateInvoiceStatus(dcOrVars, vars) {
  return executeMutation(updateInvoiceStatusRef(dcOrVars, vars));
};

const getInvoiceDetailsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetInvoiceDetails', inputVars);
}
getInvoiceDetailsRef.operationName = 'GetInvoiceDetails';
exports.getInvoiceDetailsRef = getInvoiceDetailsRef;

exports.getInvoiceDetails = function getInvoiceDetails(dcOrVars, vars) {
  return executeQuery(getInvoiceDetailsRef(dcOrVars, vars));
};
