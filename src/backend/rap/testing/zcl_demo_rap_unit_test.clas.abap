CLASS zcl_demo_rap_unit_test DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC
  FOR TESTING
  DURATION SHORT
  RISK LEVEL HARMLESS.

  PUBLIC SECTION.
  PROTECTED SECTION.
  PRIVATE SECTION.
    CLASS-DATA:
      mo_environment TYPE REF TO if_cds_test_environment.

    CLASS-METHODS:
      class_setup,
      class_teardown.

    METHODS:
      test_validation_status_code FOR TESTING,
      test_action_approve         FOR TESTING.
ENDCLASS.

CLASS zcl_demo_rap_unit_test IMPLEMENTATION.

  METHOD class_setup.
    " Khởi tạo môi trường test cô lập cho CDS Root View Entity
    mo_environment = cl_cds_test_environment=>create( 'ZI_DEMOHEADERTP' ).
  ENDMETHOD.

  METHOD class_teardown.
    " Hủy bỏ môi trường test sau khi hoàn tất
    mo_environment->destroy( ).
  ENDMETHOD.

  METHOD test_validation_status_code.
    " 1. Tạo bản ghi Header với mã trạng thái không hợp lệ 'XX'
    MODIFY ENTITIES OF ZI_DemoHeaderTP
      ENTITY DemoHeader
      CREATE FIELDS ( DemoCode StatusCode )
      WITH VALUE #( ( %cid = 'ROOT_01' DemoCode = 'INVALID_TEST' StatusCode = 'XX' ) )
      FAILED DATA(lt_failed)
      REPORTED DATA(lt_reported).

    " Bản ghi vi phạm quy tắc validation phải bị từ chối
    cl_abap_unit_assert=>assert_not_initial(
      act = lt_failed-demoheader
      msg = 'Header với StatusCode không hợp lệ phải bị đánh dấu failed trong validation' ).
  ENDMETHOD.

  METHOD test_action_approve.
    " 2. Thực thi Action 'approve' trên Header
    MODIFY ENTITIES OF ZI_DemoHeaderTP
      ENTITY DemoHeader
      EXECUTE approve FROM VALUE #( ( HeaderUUID = '00000000000000000000000000000001' ) )
      RESULT DATA(lt_result)
      FAILED DATA(lt_failed)
      REPORTED DATA(lt_reported).

    " Action approve phải hoàn tất mà không phát sinh lỗi nghiêm trọng
    cl_abap_unit_assert=>assert_initial(
      act = lt_failed-demoheader
      msg = 'Action approve trên bản ghi mẫu phải thực thi thành công' ).
  ENDMETHOD.

ENDCLASS.

