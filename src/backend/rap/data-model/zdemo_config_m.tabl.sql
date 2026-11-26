@EndUserText.label : 'Technical Config (Managed w/ Unmanaged Save)'
@AbapCatalog.enhancement.category : #NOT_EXTENSIBLE
@AbapCatalog.tableCategory : #TRANSPARENT
@AbapCatalog.deliveryClass : #A
@AbapCatalog.dataMaintenance : #RESTRICTED
define table zdemo_config_m {
  key client            : abap.clnt not null;
  key config_key        : abap.char(10) not null;
  config_name           : abap.char(60);
  config_type           : abap.char(20);
  handler_class         : abap.char(30);
  is_active             : abap_boolean;
  local_last_changed_by : syuname;
  local_last_changed_at : timestampl;
  last_changed_at       : timestampl;
}

