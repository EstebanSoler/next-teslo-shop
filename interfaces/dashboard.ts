

export interface DashboardSummaryResponse {
  numberOfOrder: number;
  paidOrders: number;
  numberOfClients: number;
  numberOfProducts: number;
  lowInventory: number;
  productsWithNoInventory: number;
  notPaidOrders: number;
}