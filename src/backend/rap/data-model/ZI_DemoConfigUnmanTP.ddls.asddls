@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: 'Demo Config Pure Unmanaged'
define root view entity ZI_DemoConfigUnmanTP
  as select from zdemo_config_u
{
  key config_key      as ConfigKey,
      config_name     as ConfigName,
      config_value    as ConfigValue,
      is_active       as IsActive,
      @Semantics.systemDateTime.lastChangedAt: true
      last_changed_at as LastChangedAt
}

