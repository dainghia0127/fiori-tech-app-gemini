CLASS lhc_demoheader DEFINITION INHERITING FROM cl_abap_behavior_handler.
  PRIVATE SECTION.
    METHODS get_instance_authorizations FOR INSTANCE AUTHORIZATION
      IMPORTING keys REQUEST requested_authorizations FOR DemoHeader RESULT result.

    METHODS get_instance_features FOR INSTANCE FEATURES
      IMPORTING keys REQUEST requested_features FOR DemoHeader RESULT result.

    METHODS calculateTotals FOR MODIFY
      IMPORTING keys FOR ACTION DemoHeader~calculateTotals RESULT result.

    METHODS approve FOR MODIFY
      IMPORTING keys FOR ACTION DemoHeader~approve RESULT result.

    METHODS calculateTotalAmount FOR DETERMINE ON MODIFY
      IMPORTING keys FOR DemoHeader~calculateTotalAmount.

    METHODS validateStatusCode FOR VALIDATE ON SAVE
      IMPORTING keys FOR DemoHeader~validateStatusCode.
ENDCLASS.

CLASS lhc_demoheader IMPLEMENTATION.
  METHOD get_instance_authorizations.
    LOOP AT keys INTO DATA(ls_key).
      APPEND VALUE #( %tky = ls_key-%tky
                      %update = if_abap_behv=>auth-allowed
                      %delete = if_abap_behv=>auth-allowed
                      %action-approve = if_abap_behv=>auth-allowed
                      %action-calculateTotals = if_abap_behv=>auth-allowed ) TO result.
    ENDLOOP.
  ENDMETHOD.

  METHOD get_instance_features.
    READ ENTITIES OF zi_demoheadertp IN LOCAL MODE
      ENTITY DemoHeader
      FIELDS ( StatusCode ) WITH CORRESPONDING #( keys )
      RESULT DATA(lt_headers).

    LOOP AT lt_headers INTO DATA(ls_header).
      DATA(lv_approve_disabled) = COND #( WHEN ls_header-StatusCode = 'AP'
                                          THEN if_abap_behv=>fc-o-disabled
                                          ELSE if_abap_behv=>fc-o-enabled ).
      APPEND VALUE #( %tky = ls_header-%tky
                      %action-approve = lv_approve_disabled ) TO result.
    ENDLOOP.
  ENDMETHOD.

  METHOD calculateTotals.
    READ ENTITIES OF zi_demoheadertp IN LOCAL MODE
      ENTITY DemoHeader BY \_Items
      FIELDS ( LineTotal Quantity UnitPrice )
      WITH CORRESPONDING #( keys )
      RESULT DATA(lt_items).

    LOOP AT keys INTO DATA(ls_key).
      DATA(lv_total) = CONV zdemo_header-total_amount( 0 ).
      LOOP AT lt_items INTO DATA(ls_item) WHERE HeaderUUID = ls_key-HeaderUUID.
        lv_total = lv_total + ( ls_item-Quantity * ls_item-UnitPrice ).
      ENDLOOP.

      MODIFY ENTITIES OF zi_demoheadertp IN LOCAL MODE
        ENTITY DemoHeader
        UPDATE FIELDS ( TotalAmount )
        WITH VALUE #( ( %tky = ls_key-%tky TotalAmount = lv_total ) )
        FAILED failed
        REPORTED reported.
    ENDLOOP.

    READ ENTITIES OF zi_demoheadertp IN LOCAL MODE
      ENTITY DemoHeader
      ALL FIELDS WITH CORRESPONDING #( keys )
      RESULT DATA(lt_headers_updated).

    result = VALUE #( FOR header IN lt_headers_updated ( %tky = header-%tky %param = header ) ).
  ENDMETHOD.

  METHOD approve.
    MODIFY ENTITIES OF zi_demoheadertp IN LOCAL MODE
      ENTITY DemoHeader
      UPDATE FIELDS ( StatusCode )
      WITH VALUE #( FOR key IN keys ( %tky = key-%tky StatusCode = 'AP' ) )
      FAILED failed
      REPORTED reported.

    READ ENTITIES OF zi_demoheadertp IN LOCAL MODE
      ENTITY DemoHeader
      ALL FIELDS WITH CORRESPONDING #( keys )
      RESULT DATA(lt_headers).

    result = VALUE #( FOR header IN lt_headers ( %tky = header-%tky %param = header ) ).
  ENDMETHOD.

  METHOD calculateTotalAmount.
    READ ENTITIES OF zi_demoheadertp IN LOCAL MODE
      ENTITY DemoHeader
      FIELDS ( StatusCode CurrencyCode ) WITH CORRESPONDING #( keys )
      RESULT DATA(lt_headers).

    MODIFY ENTITIES OF zi_demoheadertp IN LOCAL MODE
      ENTITY DemoHeader
      UPDATE FIELDS ( StatusCode CurrencyCode )
      WITH VALUE #( FOR header IN lt_headers
                    WHERE ( StatusCode IS INITIAL OR CurrencyCode IS INITIAL )
                    ( %tky = header-%tky
                      StatusCode = COND #( WHEN header-StatusCode IS INITIAL THEN 'NW' ELSE header-StatusCode )
                      CurrencyCode = COND #( WHEN header-CurrencyCode IS INITIAL THEN 'EUR' ELSE header-CurrencyCode ) ) ).
  ENDMETHOD.

  METHOD validateStatusCode.
    READ ENTITIES OF zi_demoheadertp IN LOCAL MODE
      ENTITY DemoHeader
      FIELDS ( StatusCode DemoCode ) WITH CORRESPONDING #( keys )
      RESULT DATA(lt_headers).

    LOOP AT lt_headers INTO DATA(ls_header).
      IF ls_header-StatusCode IS NOT INITIAL AND
         ls_header-StatusCode <> 'NW' AND
         ls_header-StatusCode <> 'IP' AND
         ls_header-StatusCode <> 'AP' AND
         ls_header-StatusCode <> 'RJ'.

        APPEND VALUE #( %tky = ls_header-%tky ) TO failed-demoheader.
        APPEND VALUE #( %tky = ls_header-%tky
                        %msg = new_message_with_text(
                                 severity = if_abap_behv_message=>severity-error
                                 text     = |Invalid status code: { ls_header-StatusCode }| )
                        %element-StatusCode = if_abap_behv=>mk-on ) TO reported-demoheader.
      ENDIF.
    ENDLOOP.
  ENDMETHOD.
ENDCLASS.

CLASS lhc_demoitem DEFINITION INHERITING FROM cl_abap_behavior_handler.
  PRIVATE SECTION.
    METHODS calculateLineTotal FOR DETERMINE ON MODIFY
      IMPORTING keys FOR DemoItem~calculateLineTotal.

    METHODS calculateHeaderTotal FOR DETERMINE ON MODIFY
      IMPORTING keys FOR DemoItem~calculateHeaderTotal.

    METHODS calculateHeaderTotalOnSave FOR DETERMINE ON SAVE
      IMPORTING keys FOR DemoItem~calculateHeaderTotalOnSave.
ENDCLASS.

CLASS lhc_demoitem IMPLEMENTATION.
  METHOD calculateLineTotal.
    READ ENTITIES OF zi_demoheadertp IN LOCAL MODE
      ENTITY DemoItem
      FIELDS ( Quantity UnitPrice CurrencyCode )
      WITH CORRESPONDING #( keys )
      RESULT DATA(lt_items).

    MODIFY ENTITIES OF zi_demoheadertp IN LOCAL MODE
      ENTITY DemoItem
      UPDATE FIELDS ( LineTotal CurrencyCode )
      WITH VALUE #( FOR item IN lt_items
                    ( %tky = item-%tky
                      LineTotal = item-Quantity * item-UnitPrice
                      CurrencyCode = COND #( WHEN item-CurrencyCode IS INITIAL THEN 'EUR' ELSE item-CurrencyCode ) ) ).
  ENDMETHOD.

  METHOD calculateHeaderTotal.
    READ ENTITIES OF zi_demoheadertp IN LOCAL MODE
      ENTITY DemoItem BY \_Header
      FIELDS ( HeaderUUID )
      WITH CORRESPONDING #( keys )
      RESULT DATA(lt_headers).

    READ ENTITIES OF zi_demoheadertp IN LOCAL MODE
      ENTITY DemoHeader BY \_Items
      FIELDS ( Quantity UnitPrice )
      WITH CORRESPONDING #( lt_headers )
      RESULT DATA(lt_all_items).

    LOOP AT lt_headers INTO DATA(ls_header).
      DATA(lv_header_total) = CONV zdemo_header-total_amount( 0 ).
      LOOP AT lt_all_items INTO DATA(ls_item) WHERE HeaderUUID = ls_header-HeaderUUID.
        lv_header_total = lv_header_total + ( ls_item-Quantity * ls_item-UnitPrice ).
      ENDLOOP.

      MODIFY ENTITIES OF zi_demoheadertp IN LOCAL MODE
        ENTITY DemoHeader
        UPDATE FIELDS ( TotalAmount )
        WITH VALUE #( ( %tky = ls_header-%tky TotalAmount = lv_header_total ) ).
    ENDLOOP.
  ENDMETHOD.

  METHOD calculateHeaderTotalOnSave.
    READ ENTITIES OF zi_demoheadertp IN LOCAL MODE
      ENTITY DemoItem BY \_Header
      FIELDS ( HeaderUUID )
      WITH CORRESPONDING #( keys )
      RESULT DATA(lt_headers).

    READ ENTITIES OF zi_demoheadertp IN LOCAL MODE
      ENTITY DemoHeader BY \_Items
      FIELDS ( Quantity UnitPrice )
      WITH CORRESPONDING #( lt_headers )
      RESULT DATA(lt_all_items).

    LOOP AT lt_headers INTO DATA(ls_header).
      DATA(lv_header_total) = CONV zdemo_header-total_amount( 0 ).
      LOOP AT lt_all_items INTO DATA(ls_item) WHERE HeaderUUID = ls_header-HeaderUUID.
        lv_header_total = lv_header_total + ( ls_item-Quantity * ls_item-UnitPrice ).
      ENDLOOP.

      MODIFY ENTITIES OF zi_demoheadertp IN LOCAL MODE
        ENTITY DemoHeader
        UPDATE FIELDS ( TotalAmount )
        WITH VALUE #( ( %tky = ls_header-%tky TotalAmount = lv_header_total ) ).
    ENDLOOP.
  ENDMETHOD.
ENDCLASS.

