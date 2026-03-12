export const paths = {
  dashboard: "/dashboard",
  transaction: {
    list: "/transactions",
    create: "/transactions/create",
    edit: "/transactions/:id/edit",
  },
  master: {
    iku: {
      list: "/master/iku",
      create: "/master/iku/create",
      detail: "/master/iku/:id",
      edit: "/master/iku/:id/edit",
    },
    component: {
      list: "/master/component",
      create: "/master/component/create",
      edit: "/master/component/:id/edit",
      detail: "/master/component/:id",
    },
    formula: {
      list: "/master/formula",
      create: "/master/formula/create",
      edit: "/master/formula/:id/edit",
    },
  },
  master_data: {
    access_admin: {
      list: "/master-data/access-admin",
      create: "/master-data/access-admin/create",
      edit: "/master-data/access-admin/:id/edit",
    },
    facilities: {
      list: "/master-data/facilities",
      create: "/master-data/facilities/create",
      edit: "/master-data/facilities/:id/edit",
    },
    wedding_packages: {
      list: "/master-data/wedding-packages",
      create: "/master-data/wedding-packages/create",
      edit: "/master-data/wedding-packages/:id/edit",
    },
    vendors: {
      list: "/master-data/vendors",
      create: "/master-data/vendors/create",
      edit: "/master-data/vendors/:id/edit",
    },
    contacts: {
      list: "/master-data/contacts",
    },
  },
  content: {
    about_us: "/content/about-us",
    banner: "/content/banner",
    // event: "/content/event",
    // article: "/content/article",
    article: {
      list: "/content/article",
      create: "/content/article/create",
      edit: "/content/article/:id/edit",
    },
    event: {
      list: "/content/event",
      create: "/content/event/create",
      edit: "/content/event/:id/edit",
    },
    testimonial: {
      list: "/content/testimonial",
      create: "/content/testimonial/create",
      edit: "/content/testimonial/:id/edit",
    },
  },
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    callback: "/auth/oauth-callback",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
  },
};
