@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: 'Demo Header Root View Entity'
define root view entity ZI_DemoHeaderTP
  as select from zdemo_header
  composition [0..*] of ZI_DemoItemTP as _Items
{
  key header_uuid           as HeaderUUID,
      demo_code             as DemoCode,
      status_code           as StatusCode,
      
      @Semantics.amount.currencyCode: 'CurrencyCode'
      total_amount          as TotalAmount,
      
      currency_code         as CurrencyCode,
      config_key            as ConfigKey,
      
      created_by            as CreatedBy,
      created_at            as CreatedAt,
      
      // ETag Master cho Header Instance
      @Semantics.systemDateTime.localInstanceLastChangedAt: true
      local_last_changed_at as LocalLastChangedAt,
      
      // Total ETag cho Root BO (Dùng cho Draft Validation / Resume)
      @Semantics.systemDateTime.lastChangedAt: true
      last_changed_at       as LastChangedAt,

      _Items
}
