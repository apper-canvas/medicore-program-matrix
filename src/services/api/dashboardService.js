import dashboardData from "@/services/mockData/dashboard.json"

class DashboardService {
  async getDashboardMetrics() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    return [...dashboardData.metrics]
  }

  async getDepartmentAnalytics() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...dashboardData.departmentAnalytics]
  }

  async getReadmissionData() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...dashboardData.readmissionData]
  }

  async getStaffProductivity() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...dashboardData.staffProductivity]
  }

  async getQualityMetrics() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return {...dashboardData.qualityMetrics}
  }

  async getFinancialMetrics() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return {...dashboardData.financialMetrics}
  }
}

export default new DashboardService()