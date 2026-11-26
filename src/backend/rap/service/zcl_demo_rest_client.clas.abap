CLASS zcl_demo_rest_client DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES if_oo_adt_classrun.

    CLASS-METHODS:
      get_external_exchange_rate
        IMPORTING
          iv_from_currency TYPE waers
          iv_to_currency   TYPE waers
        RETURNING
          VALUE(rv_rate)   TYPE p LENGTH 9 DECIMALS 4
        RAISING
          cx_static_check.

  PROTECTED SECTION.
  PRIVATE SECTION.
ENDCLASS.

CLASS zcl_demo_rest_client IMPLEMENTATION.

  METHOD if_oo_adt_classrun~main.
    TRY.
        DATA(lv_rate) = get_external_exchange_rate(
                          iv_from_currency = 'USD'
                          iv_to_currency   = 'VND' ).

        out->write( |Tiêu thụ External REST API thành công! Tỷ giá USD/VND: { lv_rate }| ).
      CATCH cx_root INTO DATA(lx_error).
        out->write( |Lỗi tiêu thụ External REST API: { lx_error->get_text( ) }| ).
    ENDTRY.
  ENDMETHOD.

  METHOD get_external_exchange_rate.
    " Mô phỏng tiêu thụ REST API chuẩn ABAP Cloud 2025
    " Trong môi trường Connected thật: dùng cl_web_http_client_manager=>create_by_http_destination( ... )
    " Đối với môi trường thử nghiệm: Trả về giá trị tỷ giá kỹ thuật chuẩn
    IF iv_from_currency = 'USD' AND iv_to_currency = 'VND'.
      rv_rate = '25450.0000'.
    ELSEIF iv_from_currency = 'EUR' AND iv_to_currency = 'VND'.
      rv_rate = '27500.0000'.
    ELSE.
      rv_rate = '1.0000'.
    ENDIF.
  ENDMETHOD.

ENDCLASS.

