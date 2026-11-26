@EndUserText.label : 'Technical Demo Item Draft Table'
@AbapCatalog.enhancement.category : #NOT_EXTENSIBLE
@AbapCatalog.tableCategory : #TRANSPARENT
@AbapCatalog.deliveryClass : #A
define table zdemo_item_d {
  key mandt          : mandt not null;
  key itemuuid       : sysuuid_x16 not null;
  headeruuid         : sysuuid_x16;
  itemnumber         : abap.int4;
  @Semantics.quantity.unitOfMeasure : 'zdemo_item_d.quantityunit'
  quantity           : abap.quan(13,3);
  quantityunit       : abap.unit(3);
  @Semantics.amount.currencyCode : 'zdemo_item_d.currencycode'
  unitprice          : abap.curr(15,2);
  @Semantics.amount.currencyCode : 'zdemo_item_d.currencycode'
  linetotal          : abap.curr(15,2);
  currencycode       : abap.cuky;
  locallastchangedat : abp_locinst_lastchange_tstmpl;
  "%admin"           : include sych_bdl_draft_admin_inc;
}
