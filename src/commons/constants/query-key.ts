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
      pic: {
        list: "master-data/iku/pic/list",
      },
      target: {
        list: "master-data/iku/target/list",
      },
    },
    component: {
      list: "master-data/component/list",
      detail: "master-data/component/detail",
      delete: "master-data/component/delete",
      edit: "master-data/component/edit",
      create: "master-data/component/create",
      pic: {
        list: "master-data/component/pic/list",
      },
      target: {
        list: "master-data/component/target/list",
      },
    },
    componentRealization: {
      list: "master-data/component-realization/list",
      detail: "master-data/component-realization/detail",
      delete: "master-data/component-realization/delete",
      edit: "master-data/component-realization/edit",
      create: "master-data/component-realization/create",
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
  period: {
    list: "period/list",
    detail: "period/detail",
    delete: "period/delete",
    edit: "period/edit",
    create: "period/create",
  },
  ikuResult: {
    list: "iku-result/list",
    detail: "iku-result/detail",
  },
  dashboard: {
    iku: "dashboard/iku",
  },
  user: {
    list: "user/list",
    detail: "user/detail",
    delete: "user/delete",
    edit: "user/edit",
    create: "user/create",
    picList: "user/picList",
  },
  bidang: {
    list: "bidang/list",
    detail: "bidang/detail",
    byUser: "bidang/byUser",
  },
  proker: {
    unit: "proker/unit",
    output: "proker/output",
    program: "proker/program",
    aktivitas: "proker/aktivitas",
    progress: "proker/progress",
    evidence: "proker/evidence",
  },
} as const;

