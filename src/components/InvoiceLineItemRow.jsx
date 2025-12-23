import React from 'react';

export default function InvoiceLineItemRow({ index, line, onChange }){
  const handle = (field, value) => {
    onChange && onChange({ [field]: value });
  };
  return (
    <tr>
      <td>
        <select className="form-select form-select-sm" aria-label="Tip linie" value={line?.type ?? 'Product'} onChange={e => handle('type', e.target.value)}>
          <option value="Product">Produs/Serviciu</option>
        </select>
      </td>
      <td>
        <input className="form-control form-control-sm" placeholder="Denumire articol" value={line?.name ?? ''} onChange={e => handle('name', e.target.value)} />
      </td>
      <td>
        <input className="form-control form-control-sm" placeholder="Cod" value={line?.code ?? ''} onChange={e => handle('code', e.target.value)} />
      </td>
      <td>
        <select className="form-select form-select-sm" aria-label="Unitati monetare" value={line?.currencyUnit ?? 'pcs'} onChange={e => handle('currencyUnit', e.target.value)}>
          <option value="pcs">Bucati</option>
          <option value="set">Set</option>
        </select>
      </td>
      <td>
        <input className="form-control form-control-sm" placeholder="TVA" value={line?.vatRate ?? ''} onChange={e => handle('vatRate', Number(e.target.value))} />
      </td>
      <td>
        <input className="form-control form-control-sm" placeholder="Cantitate" value={line?.quantity ?? ''} onChange={e => handle('quantity', Number(e.target.value))} />
      </td>
      <td>
        <input className="form-control form-control-sm" placeholder="Pret unitar" value={line?.unitPrice ?? ''} onChange={e => handle('unitPrice', Number(e.target.value))} />
      </td>
      <td>
        <input className="form-control form-control-sm" placeholder="Valoare" readOnly value={line?.lineValue ?? ''} />
      </td>
      <td>
        <input className="form-control form-control-sm" placeholder="Total" readOnly value={line?.lineTotal ?? ''} />
      </td>
    </tr>
  );
}
