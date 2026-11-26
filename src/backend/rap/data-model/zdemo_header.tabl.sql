@EndUserText.label : 'Technical Demo Header (Active Table)'
@AbapCatalog.enhancement.category : #NOT_EXTENSIBLE
@AbapCatalog.tableCategory : #TRANSPARENT
@AbapCatalog.deliveryClass : #A
@AbapCatalog.dataMaintenance : #RESTRICTED
define table zdemo_header {
  key client            : abap.clnt not null;
  key header_uuid       : sysuuid_x16 not null;
  demo_code             : abap.char(10);
  status_code           : abap.char(2);
  @Semantics.amount.currencyCode : 'zdemo_header.currency_code'
  total_amount          : abap.curr(15,2);
  currency_code         : abap.cuky;
  config_key            : abap.char(10);
  created_by            : abp_creation_user;
  created_at            : abp_creation_tstmpl;
  local_last_changed_by : abp_locinst_lastchange_user;
  local_last_changed_at : abp_locinst_lastchange_tstmpl; // ETag Master (Instance level)
  last_changed_at       : abp_lastchange_tstmpl;         // Total ETag (Root level)
}

