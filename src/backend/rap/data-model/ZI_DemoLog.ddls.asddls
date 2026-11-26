@EndUserText.label: 'Technical Execution Log Custom Entity'
@ObjectModel.query.implementedBy: 'ABAP:ZCL_DEMO_LOG_QUERY'
define custom entity ZI_DemoLog
{
  key LogUUID      : sysuuid_x16;
      SourceEntity : abap.char(30);
      ActionName   : abap.char(30);
      MessageText  : abap.char(255);
      CreatedAt    : abp_creation_tstmpl;
}

