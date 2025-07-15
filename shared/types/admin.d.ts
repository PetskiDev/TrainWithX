export interface AdminInfoDTO {
  totalUsers: number;
  newUsers: number;
  totalCreators: number;
  newCreators: number;
  plans: number;
  newPlans: number;
  totalRevenue: number; // converted from Decimal
  newRevenue: number; // should also be Decimal -> number
  totalBuys: number;
  newBuys: number;
}
