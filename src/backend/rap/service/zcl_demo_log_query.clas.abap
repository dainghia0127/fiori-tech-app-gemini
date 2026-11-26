CLASS zcl_demo_log_query DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES if_rap_query_provider.
  PROTECTED SECTION.
  PRIVATE SECTION.
ENDCLASS.

CLASS zcl_demo_log_query IMPLEMENTATION.
  METHOD if_rap_query_provider~select.
    DATA lt_logs TYPE STANDARD TABLE OF zi_demolog WITH EMPTY KEY.

    lt_logs = VALUE #(
      ( LogUUID      = '11111111111111111111111111111111'
        SourceEntity = 'DemoHeader'
        ActionName   = 'CREATE'
        MessageText  = 'Instance initialized with StatusCode NW'
        CreatedAt    = '20261107120000' )
      ( LogUUID      = '22222222222222222222222222222222'
        SourceEntity = 'DemoItem'
        ActionName   = 'CALCULATE_TOTALS'
        MessageText  = 'Item LineTotal recalculation executed'
        CreatedAt    = '20261107120500' )
      ( LogUUID      = '33333333333333333333333333333333'
        SourceEntity = 'DemoHeader'
        ActionName   = 'APPROVE'
        MessageText  = 'Status transition from NW to AP completed'
        CreatedAt    = '20261107121000' )
    ).

    IF io_request->is_total_numb_of_rec_requested( ).
      io_response->set_total_number_of_records( lines( lt_logs ) ).
    ENDIF.

    IF io_request->is_data_requested( ).
      DATA(lo_paging) = io_request->get_paging( ).
      DATA(lv_top)  = lo_paging->get_page_size( ).
      DATA(lv_skip) = lo_paging->get_offset( ).

      IF lv_skip > 0.
        DELETE lt_logs TO lv_skip.
      ENDIF.
      IF lv_top > 0 AND lines( lt_logs ) > lv_top.
        DELETE lt_logs FROM ( lv_top + 1 ).
      ENDIF.

      io_response->set_data( lt_logs ).
    ENDIF.
  ENDMETHOD.
ENDCLASS.

