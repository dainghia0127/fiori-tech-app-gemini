@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: 'Demo Item View Entity'
define view entity ZI_DemoItemTP
  as select from zdemo_item
  association to parent ZI_DemoHeaderTP as _Header 
    on $projection.HeaderUUID = _Header.HeaderUUID
{
  key item_uuid             as ItemUUID,
      header_uuid           as HeaderUUID,
      item_number           as ItemNumber,
      
      @Semantics.quantity.unitOfMeasure: 'QuantityUnit'
      quantity              as Quantity,
      
      quantity_unit         as QuantityUnit,
      
      @Semantics.amount.currencyCode: 'CurrencyCode'
      unit_price            as UnitPrice,
      
      @Semantics.amount.currencyCode: 'CurrencyCode'
      line_total            as LineTotal,
      
      currency_code         as CurrencyCode,
      
      @Semantics.systemDateTime.localInstanceLastChangedAt: true
      local_last_changed_at as LocalLastChangedAt,

      _Header
}
