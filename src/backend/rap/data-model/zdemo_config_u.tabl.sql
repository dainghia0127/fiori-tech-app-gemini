@EndUserText.label : 'Technical Config (Pure Unmanaged)'
@AbapCatalog.enhancement.category : #NOT_EXTENSIBLE
@AbapCatalog.tableCategory : #TRANSPARENT
@AbapCatalog.deliveryClass : #A
@AbapCatalog.dataMaintenance : #RESTRICTED
define table zdemo_config_u {
  key client      : abap.clnt not null;
  key config_key  : abap.char(10) not null;
  config_name     : abap.char(60);
  config_value    : abap.char(100);
  is_active       : abap_boolean;
  last_changed_at : timestampl;
}

