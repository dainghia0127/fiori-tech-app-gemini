CLASS lhc_democonfigunman DEFINITION INHERITING FROM cl_abap_behavior_handler.
  PRIVATE SECTION.
    METHODS get_instance_authorizations FOR INSTANCE AUTHORIZATION
      IMPORTING keys REQUEST requested_authorizations FOR DemoConfigUnman RESULT result.

    METHODS create FOR MODIFY
      IMPORTING entities FOR CREATE DemoConfigUnman.

    METHODS update FOR MODIFY
      IMPORTING entities FOR UPDATE DemoConfigUnman.

    METHODS delete FOR MODIFY
      IMPORTING keys FOR DELETE DemoConfigUnman.

    METHODS read FOR READ
      IMPORTING keys FOR READ DemoConfigUnman RESULT result.

    METHODS lock FOR LOCK
      IMPORTING keys FOR LOCK DemoConfigUnman.
ENDCLASS.

CLASS lhc_democonfigunman IMPLEMENTATION.
  METHOD get_instance_authorizations.
  ENDMETHOD.

  METHOD create.
    " Unmanaged create: Direct persistence into custom table ZDEMO_CONFIG_U
    DATA: lv_ts TYPE timestampl.
    GET TIME STAMP FIELD lv_ts.
    DATA lt_data TYPE STANDARD TABLE OF zdemo_config_u.
    LOOP AT entities INTO DATA(ls_entity).
      APPEND VALUE #(
        client          = sy-mandt
        config_key      = ls_entity-ConfigKey
        config_name     = ls_entity-ConfigName
        config_value    = ls_entity-ConfigValue
        is_active       = ls_entity-IsActive
        last_changed_at = lv_ts
      ) TO lt_data.
      APPEND VALUE #( %cid = ls_entity-%cid ConfigKey = ls_entity-ConfigKey ) TO mapped-democonfigunman.
    ENDLOOP.
    IF lt_data IS NOT INITIAL.
      MODIFY zdemo_config_u FROM TABLE @lt_data.
    ENDIF.
  ENDMETHOD.

  METHOD update.
    DATA: lv_ts TYPE timestampl.
    GET TIME STAMP FIELD lv_ts.
    LOOP AT entities INTO DATA(ls_entity).
      UPDATE zdemo_config_u
        SET config_name     = @ls_entity-ConfigName,
            config_value    = @ls_entity-ConfigValue,
            is_active       = @ls_entity-IsActive,
            last_changed_at = @lv_ts
        WHERE config_key = @ls_entity-ConfigKey.
    ENDLOOP.
  ENDMETHOD.

  METHOD delete.
    LOOP AT keys INTO DATA(ls_key).
      DELETE FROM zdemo_config_u WHERE config_key = @ls_key-ConfigKey.
    ENDLOOP.
  ENDMETHOD.

  METHOD read.
    SELECT * FROM zdemo_config_u
      FOR ALL ENTRIES IN @keys
      WHERE config_key = @keys-ConfigKey
      INTO TABLE @DATA(lt_db).

    LOOP AT lt_db INTO DATA(ls_db).
      APPEND VALUE #(
        ConfigKey     = ls_db-config_key
        ConfigName    = ls_db-config_name
        ConfigValue   = ls_db-config_value
        IsActive      = ls_db-is_active
        LastChangedAt = ls_db-last_changed_at
      ) TO result.
    ENDLOOP.
  ENDMETHOD.

  METHOD lock.
  ENDMETHOD.
ENDCLASS.

CLASS lsc_zi_democonfigunmantp DEFINITION INHERITING FROM cl_abap_behavior_saver.
  PROTECTED SECTION.
    METHODS finalize REDEFINITION.
    METHODS check_before_save REDEFINITION.
    METHODS save REDEFINITION.
    METHODS cleanup REDEFINITION.
    METHODS cleanup_finalize REDEFINITION.
ENDCLASS.

CLASS lsc_zi_democonfigunmantp IMPLEMENTATION.
  METHOD finalize.
  ENDMETHOD.

  METHOD check_before_save.
  ENDMETHOD.

  METHOD save.
    " STRICT RULE: Absolutely NO COMMIT WORK or ROLLBACK WORK allowed!
  ENDMETHOD.

  METHOD cleanup.
  ENDMETHOD.

  METHOD cleanup_finalize.
  ENDMETHOD.
ENDCLASS.

