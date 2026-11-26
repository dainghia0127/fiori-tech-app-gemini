CLASS lhc_democonfig DEFINITION INHERITING FROM cl_abap_behavior_handler.
  PRIVATE SECTION.
    METHODS get_instance_authorizations FOR INSTANCE AUTHORIZATION
      IMPORTING keys REQUEST requested_authorizations FOR DemoConfig RESULT result.

    METHODS validateHandlerClass FOR VALIDATE ON SAVE
      IMPORTING keys FOR DemoConfig~validateHandlerClass.
ENDCLASS.

CLASS lhc_democonfig IMPLEMENTATION.
  METHOD get_instance_authorizations.
  ENDMETHOD.

  METHOD validateHandlerClass.
    CONSTANTS:
      lc_handler_legacy  TYPE string VALUE 'ZCL_LEGACY_CONFIG_HANDLER',
      lc_handler_audit   TYPE string VALUE 'ZCL_AUDIT_CONFIG_HANDLER',
      lc_handler_default TYPE string VALUE 'ZCL_DEFAULT_CONFIG_HANDLER'.

    READ ENTITIES OF zi_democonfigmsavetp IN LOCAL MODE
      ENTITY DemoConfig
      FIELDS ( HandlerClass )
      WITH CORRESPONDING #( keys )
      RESULT DATA(lt_configs).

    LOOP AT lt_configs INTO DATA(ls_config).
      IF ls_config-HandlerClass IS NOT INITIAL AND
         ls_config-HandlerClass <> lc_handler_legacy AND
         ls_config-HandlerClass <> lc_handler_audit AND
         ls_config-HandlerClass <> lc_handler_default.

        APPEND VALUE #( %tky = ls_config-%tky ) TO failed-democonfig.
        APPEND VALUE #( %tky = ls_config-%tky
                        %msg = new_message_with_text(
                                 severity = if_abap_behv_message=>severity-error
                                 text     = |Handler class '{ ls_config-HandlerClass }' is unauthorized in whitelist| ) )
          TO reported-democonfig.
      ENDIF.
    ENDLOOP.
  ENDMETHOD.
ENDCLASS.

CLASS lsc_zi_democonfigmsavetp DEFINITION INHERITING FROM cl_abap_behavior_saver.
  PROTECTED SECTION.
    METHODS save_modified REDEFINITION.
    METHODS cleanup_finalize REDEFINITION.
ENDCLASS.

CLASS lsc_zi_democonfigmsavetp IMPLEMENTATION.
  METHOD save_modified.
    " Unmanaged Save: Save sequence AFTER Point of No Return.
    " STRICT RULE: Absolutely NO COMMIT WORK or ROLLBACK WORK allowed!
    DATA: lv_ts TYPE timestampl.
    GET TIME STAMP FIELD lv_ts.

    " 1. Process Creates
    IF create-democonfig IS NOT INITIAL.
      DATA lt_insert TYPE STANDARD TABLE OF zdemo_config_m WITH DEFAULT KEY.
      LOOP AT create-democonfig INTO DATA(ls_create).
        APPEND VALUE #(
          client                = sy-mandt
          config_key            = ls_create-ConfigKey
          config_name           = ls_create-ConfigName
          config_type           = ls_create-ConfigType
          handler_class         = ls_create-HandlerClass
          is_active             = ls_create-IsActive
          local_last_changed_by = sy-uname
          local_last_changed_at = lv_ts
          last_changed_at       = lv_ts
        ) TO lt_insert.
      ENDLOOP.
      IF lt_insert IS NOT INITIAL.
        MODIFY zdemo_config_m FROM TABLE @lt_insert.
      ENDIF.
    ENDIF.

    " 2. Process Updates
    IF update-democonfig IS NOT INITIAL.
      LOOP AT update-democonfig INTO DATA(ls_update).
        UPDATE zdemo_config_m
          SET config_name           = @ls_update-ConfigName,
              config_type           = @ls_update-ConfigType,
              handler_class         = @ls_update-HandlerClass,
              is_active             = @ls_update-IsActive,
              local_last_changed_by = @sy-uname,
              local_last_changed_at = @lv_ts,
              last_changed_at       = @lv_ts
          WHERE config_key = @ls_update-ConfigKey.
      ENDLOOP.
    ENDIF.

    " 3. Process Deletes
    IF delete-democonfig IS NOT INITIAL.
      LOOP AT delete-democonfig INTO DATA(ls_delete).
        DELETE FROM zdemo_config_m WHERE config_key = @ls_delete-ConfigKey.
      ENDLOOP.
    ENDIF.
  ENDMETHOD.

  METHOD cleanup_finalize.
  ENDMETHOD.
ENDCLASS.

