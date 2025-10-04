export const api = {
  fetchCompanies: async (userId: string | undefined) => {
    console.log(`[API] Buscando empresas para o usuário ${userId}...`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return [
      {id: "comp-1", name: "Empresa A"},
      {id: "comp-2", name: "Empresa B"},
    ];
  },

  fetchProducts: async (userId: string | undefined) => {
    console.log(`[API] Buscando produtos para o usuário ${userId}...`);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return [{id: "prod-1", name: "Produto X", categoryId: "cat-1"}];
  },

  fetchCategories: async (userId: string | undefined) => {
    console.log(`[API] Buscando categorias para o usuário ${userId}...`);
    await new Promise((resolve) => setTimeout(resolve, 800));
    return [{id: "cat-1", name: "Categoria 1"}];
  },
};
