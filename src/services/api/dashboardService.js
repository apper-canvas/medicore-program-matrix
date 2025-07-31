import dashboardData from "@/services/mockData/dashboard.json"

class DashboardService {
  async getDashboardMetrics() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    return [...dashboardData]
  }
}

export default new DashboardService()