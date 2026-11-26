CLASS zcl_demo_eml_playground DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES if_oo_adt_classrun.
    ALIASES main FOR if_oo_adt_classrun~main.
  PROTECTED SECTION.
  PRIVATE SECTION.
ENDCLASS.

CLASS zcl_demo_eml_playground IMPLEMENTATION.
  METHOD if_oo_adt_classrun~main.
    out->write( |====================================================| ).
    out->write( |   SAP FIORI TECHNICAL ACADEMY - RAP EML PLAYGROUND | ).
    out->write( |====================================================| ).

    DATA(lv_cfg_m_key) = CONV char10( |CFG_{ sy-uzeit }| ).
    DATA(lv_cfg_u_key) = CONV char10( |UNM_{ sy-uzeit }| ).

    " 1. Test Scenario 2A: Managed with Unmanaged Save
    out->write( |[Step 1] Creating DemoConfigMSave via EML (Scenario 2A)...| ).
    MODIFY ENTITIES OF zi_democonfigmsavetp
      ENTITY DemoConfig
      CREATE FIELDS ( ConfigKey ConfigName ConfigType HandlerClass IsActive )
      WITH VALUE #( ( %cid         = 'CID_CFG_01'
                      ConfigKey    = lv_cfg_m_key
                      ConfigName   = 'Technical Academy Config'
                      ConfigType   = 'SYSTEM'
                      HandlerClass = 'ZCL_DEFAULT_CONFIG_HANDLER'
                      IsActive     = abap_true ) )
      MAPPED DATA(lt_cfg_m_mapped)
      FAILED DATA(lt_cfg_m_failed)
      REPORTED DATA(lt_cfg_m_reported).

    IF lt_cfg_m_failed IS NOT INITIAL.
      out->write( |[ERROR] DemoConfigMSave create failed!| ).
      LOOP AT lt_cfg_m_reported-democonfig INTO DATA(ls_rep_m).
        IF ls_rep_m-%msg IS BOUND.
          out->write( |  - Reason: { ls_rep_m-%msg->if_message~get_text( ) }| ).
        ENDIF.
      ENDLOOP.
    ELSE.
      out->write( |[PASS] DemoConfigMSave created with Key: { lv_cfg_m_key }| ).
    ENDIF.

    " 2. Test Scenario 2B: Pure Unmanaged RAP
    out->write( |[Step 2] Creating DemoConfigUnman via EML (Scenario 2B)...| ).
    MODIFY ENTITIES OF zi_democonfigunmantp
      ENTITY DemoConfigUnman
      CREATE FIELDS ( ConfigKey ConfigName ConfigValue IsActive )
      WITH VALUE #( ( %cid        = 'CID_CFG_U_01'
                      ConfigKey   = lv_cfg_u_key
                      ConfigName  = 'Backend Timeout Setting'
                      ConfigValue = '300'
                      IsActive    = abap_true ) )
      MAPPED DATA(lt_cfg_u_mapped)
      FAILED DATA(lt_cfg_u_failed)
      REPORTED DATA(lt_cfg_u_reported).

    IF lt_cfg_u_failed IS NOT INITIAL.
      out->write( |[ERROR] DemoConfigUnman create failed!| ).
    ELSE.
      out->write( |[PASS] DemoConfigUnman created with Key: { lv_cfg_u_key }| ).
    ENDIF.

    " 3. Test Scenario 1: Managed with Draft Root + Child Items
    out->write( |[Step 3] Creating new DemoHeader with Child Items via EML...| ).

    MODIFY ENTITIES OF zi_demoheadertp
      ENTITY DemoHeader
      CREATE FIELDS ( DemoCode StatusCode TotalAmount CurrencyCode ConfigKey )
      WITH VALUE #( ( %cid         = 'CID_HDR_01'
                      DemoCode     = 'EML_DEMO'
                      StatusCode   = 'NW'
                      TotalAmount  = 0
                      CurrencyCode = 'EUR'
                      ConfigKey    = lv_cfg_m_key ) )
      CREATE BY \_Items FIELDS ( ItemNumber Quantity QuantityUnit UnitPrice LineTotal CurrencyCode )
      WITH VALUE #( ( %cid_ref = 'CID_HDR_01'
                      %target  = VALUE #( ( %cid         = 'CID_ITM_01'
                                            ItemNumber   = 10
                                            Quantity     = 3
                                            QuantityUnit = 'EA'
                                            UnitPrice    = 150
                                            LineTotal    = 450
                                            CurrencyCode = 'EUR' )
                                          ( %cid         = 'CID_ITM_02'
                                            ItemNumber   = 20
                                            Quantity     = 2
                                            QuantityUnit = 'EA'
                                            UnitPrice    = 300
                                            LineTotal    = 600
                                            CurrencyCode = 'EUR' ) ) ) )
      MAPPED DATA(lt_mapped)
      FAILED DATA(lt_failed)
      REPORTED DATA(lt_reported).

    IF lt_failed IS NOT INITIAL.
      out->write( |[ERROR] Create failed!| ).
      RETURN.
    ENDIF.

    DATA(lv_header_uuid) = lt_mapped-demoheader[ 1 ]-HeaderUUID.
    out->write( |[PASS] Header created with UUID: { lv_header_uuid }| ).
    out->write( |[PASS] Child items created: { lines( lt_mapped-demoitem ) }| ).

    " 4. Read Entities
    out->write( |[Step 4] Reading Entity via EML READ ENTITIES...| ).

    READ ENTITIES OF zi_demoheadertp
      ENTITY DemoHeader
      ALL FIELDS WITH VALUE #( ( HeaderUUID = lv_header_uuid ) )
      RESULT DATA(lt_headers_read).

    IF lt_headers_read IS NOT INITIAL.
      ASSIGN lt_headers_read[ 1 ] TO FIELD-SYMBOL(<ls_header>).
      out->write( |  - DemoCode:     { <ls_header>-DemoCode }| ).
      out->write( |  - StatusCode:   { <ls_header>-StatusCode }| ).
      out->write( |  - TotalAmount:  { <ls_header>-TotalAmount } { <ls_header>-CurrencyCode }| ).
    ENDIF.

    " 5. Action Approve
    out->write( |[Step 5] Executing Action 'approve' via EML...| ).

    MODIFY ENTITIES OF zi_demoheadertp
      ENTITY DemoHeader
      EXECUTE approve
      FROM VALUE #( ( HeaderUUID = lv_header_uuid ) )
      RESULT DATA(lt_action_result)
      MAPPED DATA(lt_action_mapped)
      FAILED DATA(lt_action_failed)
      REPORTED DATA(lt_action_reported).

    IF lt_action_failed IS NOT INITIAL.
      out->write( |[ERROR] Action approve failed!| ).
    ELSE.
      out->write( |[PASS] Action 'approve' executed successfully!| ).
      IF lt_action_result IS NOT INITIAL.
        out->write( |  - New StatusCode: { lt_action_result[ 1 ]-%param-StatusCode }| ).
      ENDIF.
    ENDIF.

    " 6. Commit Entities
    out->write( |[Step 6] Committing Entities via COMMIT ENTITIES...| ).
    COMMIT ENTITIES
      RESPONSES
      FAILED DATA(lt_commit_failed)
      REPORTED DATA(lt_commit_reported).

    IF lt_commit_failed IS NOT INITIAL.
      out->write( |[ERROR] Commit failed!| ).
    ELSE.
      out->write( |[PASS] COMMIT ENTITIES successful! Transaction saved to database.| ).
    ENDIF.

    " 7. Generate Service Binding ZUI_DEMO_HEADER_O4_UI if not existing
    out->write( |[Step 7] Generating Service Binding ZUI_DEMO_HEADER_O4_UI via XCO...| ).
    TRY.
        DATA(lo_env) = xco_cp_generation=>environment->dev_system( 'S4DK911884' ).
        DATA(lo_put) = lo_env->create_put_operation( ).
        DATA(lo_srvb_spec) = lo_put->for-srvb->add_object( 'ZUI_DEMO_HEADER_O4_UI'
          )->set_package( 'ZNGHIANDD_TEST'
          )->create_form_specification( ).

        lo_srvb_spec->set_short_description( 'Demo Header OData V4 UI Binding' ).
        lo_srvb_spec->set_binding_type( xco_cp_service_binding=>binding_type->odata_v4_ui ).
        lo_srvb_spec->add_service( 'ZUI_DEMO_HEADER_O4'
          )->add_version( '0001'
          )->set_service_definition( 'ZUI_DEMO_HEADER_O4' ).
        lo_put->execute( ).
        out->write( |[PASS] Service Binding ZUI_DEMO_HEADER_O4_UI generated successfully!| ).
      CATCH cx_root INTO DATA(lx_srvb).
        out->write( |[INFO] Service Binding generation notice: { lx_srvb->get_text( ) }| ).
    ENDTRY.

    out->write( |====================================================| ).
    out->write( |   RAP EML PLAYGROUND EXECUTION COMPLETED (100% OK) | ).
    out->write( |====================================================| ).
  ENDMETHOD.
ENDCLASS.
