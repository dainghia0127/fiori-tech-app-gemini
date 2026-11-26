@EndUserText.label : 'Technical Demo Item (Active Table)'
@AbapCatalog.enhancement.category : #NOT_EXTENSIBLE
@AbapCatalog.tableCategory : #TRANSPARENT
@AbapCatalog.deliveryClass : #A
define table zdemo_item {
  key client            : abap.clnt not null;
  key item_uuid         : sysuuid_x16 not null;
  header_uuid           : sysuuid_x16 not null; // Khóa ngoại trỏ về Header
  item_number           : abap.int4;
  @Semantics.quantity.unitOfMeasure : 'zdemo_item.quantity_unit'
  quantity              : abap.quan(13,3);
  quantity_unit         : abap.unit(3);
  @Semantics.amount.currencyCode : 'zdemo_item.currency_code'
  unit_price            : abap.curr(15,2);
  @Semantics.amount.currencyCode : 'zdemo_item.currency_code'
  line_total            : abap.curr(15,2);
  currency_code         : abap.cuky;
  local_last_changed_at : abp_locinst_lastchange_tstmpl;
}

