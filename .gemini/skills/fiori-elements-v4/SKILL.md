---
name: fiori-elements-v4
description: >-
  Quy chuẩn thiết kế, từ điển Vocabularies và mẫu khai báo Annotation cho SAP Fiori Elements V4 (List Report, Object Page, Flexible Column Layout, Building Blocks).
---

# Kỹ Năng Thiết Kế & Lập Trình SAP Fiori Elements V4

Kỹ năng này định hướng và cung cấp các quy chuẩn chính xác khi phát triển ứng dụng Fiori Elements V4 trên nền OData V4 và ABAP RAP.

---

## 1. Nguyên Tắc Cốt Lõi Fiori Elements V4

1. **Metadata-driven Architecture:** Toàn bộ bố cục và hành vi giao diện được điều khiển thông qua OData V4 Annotations (Metadata Extension `.ddlx` hoặc CDS View Entity annotations).
2. **Floorplans Chuẩn:**
   - **List Report Page (LRP):** Hiển thị danh sách tổng quan (`@UI.LineItem`, `@UI.SelectionFields`).
   - **Object Page (OP):** Chi tiết thực thể với Header Facets và Sections (`@UI.HeaderInfo`, `@UI.Facets`, `@UI.FieldGroup`).
3. **Building Blocks:** Sử dụng UI5 Flexible Programming Model (FPM) và macros:
   - `<macros:Table id="tblItems" metaPath="@UI.LineItem" />`
   - `<macros:FilterBar id="fbHeader" metaPath="@UI.SelectionFields" />`
   - `<macros:Field metaPath="Status" />`

---

## 2. Từ Điển Annotations Thiết Yếu (Cheat Sheet)

### A. List Report Annotations
```cds
annotate ZC_DemoHeaderTP with {
  @UI.selectionField: [{ position: 10 }]
  HeaderId;

  @UI.selectionField: [{ position: 20 }]
  Category;

  @UI.lineItem: [
    { position: 10, label: 'Demo ID', importance: #HIGH },
    { position: 20, label: 'Tiêu đề', importance: #HIGH },
    { position: 30, label: 'Trạng thái', criticality: 'StatusCriticality' },
    { position: 40, label: 'Tổng tiền', criticalityRepresentation: #WITHOUT_ICON },
    { type: #FOR_ACTION, dataAction: 'markAsVerified', label: 'Xác minh' }
  ]
  Title;
}
```

### B. Object Page Header & Facets
```cds
@UI.headerInfo: {
  typeName: 'Demo Header',
  typeNamePlural: 'Demo Headers',
  title: { type: #STANDARD, value: 'Title' },
  description: { type: #STANDARD, value: 'HeaderId' }
}
annotate ZC_DemoHeaderTP with {
  @UI.facet: [
    {
      id: 'GeneralInfoFacet',
      purpose: #STANDARD,
      type: #COLLECTION,
      label: 'Thông tin chung',
      position: 10
    },
    {
      id: 'HeaderFieldGroup',
      parentId: 'GeneralInfoFacet',
      type: #FIELDGROUP_REFERENCE,
      targetQualifier: 'GeneralData',
      position: 10
    },
    {
      id: 'ItemsFacet',
      purpose: #STANDARD,
      type: #LINEITEM_REFERENCE,
      label: 'Danh sách Chi tiết (Items)',
      position: 20,
      targetElement: '_Items'
    }
  ]
}
```

### C. Side Effects (OData V4 Dynamic Reactivity)
```cds
@Common.sideEffects: {
  sourceProperties: [ 'Quantity', 'UnitPrice' ],
  targetProperties: [ 'LineTotal', '_Header.TotalAmount' ]
}
```

