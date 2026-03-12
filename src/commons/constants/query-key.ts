export const queryKeys = {
  upload_file: "upload-file",
  transactions: {
    list: "transactions/list",
    detail: "transaction/detail",
  },
  masterData: {
    accessAdmin: {
      list: "master-data/access-admin/list",
      detail: "master-data/access-admin/detail",
    },
    iku: {
      list: "master-data/iku/list",
      detail: "master-data/iku/detail",
    },
    component: {
      list: "master-data/component/list",
      detail: "master-data/component/detail",
      delete: "master-data/component/delete",
      edit: "master-data/component/edit",
      create: "master-data/component/create",
    },
    facilities: {
      list: "master-data/facilities/list",
      detail: "master-data/facilities/detail",
      delete: "master-data/facilities/delete",
    },
    weddingPackages: {
      list: "master-data/wedding-packages/list",
      detail: "master-data/wedding-packages/detail",
    },
    vendors: {
      list: "master-data/vendors/list",
      detail: "master-data/vendors/detail",
    },
    contact: {
      detail: "master-data/contact",
    },
  },
  content: {
    aboutUs: {
      detail: "content/about-us",
      edit: "content/about-us/edit",
    },
    article: {
      list: "content/article/list",
      detail: "content/article/detail",
    },
    banner: {
      list: "content/banner/list",
      detail: "content/banner/detail",
    },
    event: {
      list: "content/event/list",
      detail: "content/event/detail",
    },
    testimonial: {
      list: "content/testimonial/list",
      detail: "content/testimonial/detail",
    },
  },
} as const;
