@EndUserText.label : 'Technical Demo Header Draft Table'
@AbapCatalog.enhancement.category : #NOT_EXTENSIBLE
@AbapCatalog.tableCategory : #TRANSPARENT
@AbapCatalog.deliveryClass : #A
define table zdemo_header_d {
  key mandt          : mandt not null;
  key headeruuid     : sysuuid_x16 not null;
  democode           : abap.char(10);
  statuscode         : abap.char(2);
  @Semantics.amount.currencyCode : 'zdemo_header_d.currencycode'
  totalamount        : abap.curr(15,2);
  currencycode       : abap.cuky;
  configkey          : abap.char(10);
  createdby          : abp_creation_user;
  createdat          : abp_creation_tstmpl;
  locallastchangedat : abp_locinst_lastchange_tstmpl;
  lastchangedat      : abp_lastchange_tstmpl;
  "%admin"           : include sych_bdl_draft_admin_inc;
}
