@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: 'Demo Config Managed w/ Unmanaged Save'
define root view entity ZI_DemoConfigMSaveTP
  as select from zdemo_config_m
{
  key config_key            as ConfigKey,
      config_name           as ConfigName,
      config_type           as ConfigType,
      handler_class         as HandlerClass,
      is_active             as IsActive,
      @Semantics.user.localInstanceLastChangedBy: true
      local_last_changed_by as LocalLastChangedBy,
      @Semantics.systemDateTime.localInstanceLastChangedAt: true
      local_last_changed_at as LocalLastChangedAt,
      @Semantics.systemDateTime.lastChangedAt: true
      last_changed_at       as LastChangedAt
}

