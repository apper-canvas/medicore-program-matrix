import React, { useState, useEffect } from "react"
import MetricCard from "@/components/molecules/MetricCard"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import BedManagementWidget from "@/components/molecules/BedManagementWidget"
import ReactApexChart from "react-apexcharts"
import ApperIcon from "@/components/ApperIcon"
import dashboardService from "@/services/api/dashboardService"
const Dashboard = () => {
const [metrics, setMetrics] = useState([])
  const [departmentData, setDepartmentData] = useState([])
  const [readmissionData, setReadmissionData] = useState([])
  const [staffMetrics, setStaffMetrics] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError("")
      const [metricsData, deptData, readmissionStats, staffStats] = await Promise.all([
        dashboardService.getDashboardMetrics(),
        dashboardService.getDepartmentAnalytics(),
        dashboardService.getReadmissionData(),
        dashboardService.getStaffProductivity()
      ])
      setMetrics(metricsData)
      setDepartmentData(deptData)
      setReadmissionData(readmissionStats)
      setStaffMetrics(staffStats)
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.")
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadDashboardData()
  }, [])
  
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded-md w-64 animate-shimmer"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-card p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-shimmer"></div>
                  <div className="h-8 bg-gray-200 rounded w-16 mb-2 animate-shimmer"></div>
                  <div className="h-4 bg-gray-200 rounded w-20 animate-shimmer"></div>
                </div>
                <div className="h-12 w-12 bg-gray-200 rounded-lg animate-shimmer"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />
  }
  
// Chart configurations
  const lengthOfStayChart = {
    series: [{
      name: 'Average Length of Stay',
      data: departmentData.map(dept => dept.avgLengthOfStay)
    }, {
      name: 'Benchmark',
      data: departmentData.map(dept => dept.benchmark)
    }],
    options: {
      chart: { type: 'bar', height: 350 },
      xaxis: { categories: departmentData.map(dept => dept.department) },
      colors: ['#0B6FBF', '#28A745'],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '60%',
          endingShape: 'rounded'
        }
      },
      dataLabels: { enabled: false },
      stroke: { show: true, width: 2, colors: ['transparent'] },
      yaxis: { title: { text: 'Days' } },
      fill: { opacity: 1 },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + ' days'
          }
        }
      }
    }
  }

  const readmissionChart = {
    series: [{
      name: 'Readmission Rate',
      data: readmissionData.map(item => ({
        x: item.month,
        y: item.rate
      }))
    }],
    options: {
      chart: { type: 'line', height: 350 },
      stroke: { curve: 'smooth', width: 3 },
      colors: ['#DC3545'],
      markers: { size: 6 },
      xaxis: { type: 'category' },
      yaxis: { 
        title: { text: 'Rate (%)' },
        max: 20
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + '%'
          }
        }
      }
    }
  }

  const staffProductivityChart = {
    series: staffMetrics.map(metric => metric.value),
    options: {
      chart: { type: 'donut', height: 350 },
      labels: staffMetrics.map(metric => metric.category),
      colors: ['#0B6FBF', '#28A745', '#FFC107', '#DC3545', '#17A2B8'],
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total Utilization',
                formatter: () => '78%'
              }
            }
          }
        }
      },
      legend: { position: 'bottom' }
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadDashboardData} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Executive Dashboard</h1>
          <p className="text-gray-600 mt-1">Hospital performance overview and key insights</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <ApperIcon name="Clock" size={16} />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
      
      {/* KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.Id}
            title={metric.label}
            value={metric.value}
            unit={metric.unit}
            trend={metric.trend}
            icon={metric.icon}
            color={metric.color}
          />
        ))}
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Length of Stay Analysis */}
        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Length of Stay by Department</h3>
            <ApperIcon name="BarChart3" size={20} className="text-gray-400" />
          </div>
          <ReactApexChart
            options={lengthOfStayChart.options}
            series={lengthOfStayChart.series}
            type="bar"
            height={350}
          />
          <div className="mt-4 text-sm text-gray-600">
            <p>Compares average length of stay against industry benchmarks</p>
          </div>
        </div>

        {/* Readmission Rate Tracking */}
        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Readmission Rate Trends</h3>
            <ApperIcon name="TrendingDown" size={20} className="text-gray-400" />
          </div>
          <ReactApexChart
            options={readmissionChart.options}
            series={readmissionChart.series}
            type="line"
            height={350}
          />
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div className="p-2 bg-red-50 rounded">
              <p className="text-xs text-gray-600">30-Day Rate</p>
              <p className="font-semibold text-red-600">8.2%</p>
            </div>
            <div className="p-2 bg-yellow-50 rounded">
              <p className="text-xs text-gray-600">Risk Score</p>
              <p className="font-semibold text-yellow-600">Medium</p>
            </div>
            <div className="p-2 bg-green-50 rounded">
              <p className="text-xs text-gray-600">Improvement</p>
              <p className="font-semibold text-green-600">-1.3%</p>
            </div>
          </div>
        </div>

        {/* Staff Productivity & Resource Utilization */}
        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Staff Productivity Metrics</h3>
            <ApperIcon name="Users" size={20} className="text-gray-400" />
          </div>
          <ReactApexChart
            options={staffProductivityChart.options}
            series={staffProductivityChart.series}
            type="donut"
            height={350}
          />
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Patient-to-Staff Ratio</span>
              <span className="font-semibold">4.2:1</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Overtime Hours</span>
              <span className="font-semibold text-yellow-600">12.3%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Satisfaction Score</span>
              <span className="font-semibold text-green-600">4.6/5</span>
            </div>
          </div>
        </div>

        {/* Quality & Safety Metrics */}
        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Quality & Safety Metrics</h3>
            <ApperIcon name="Shield" size={20} className="text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <ApperIcon name="CheckCircle" size={16} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Patient Safety Score</p>
                  <p className="text-sm text-gray-600">Above national average</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-green-600">A+</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <ApperIcon name="Heart" size={16} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Patient Satisfaction</p>
                  <p className="text-sm text-gray-600">HCAHPS Score</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-blue-600">4.8/5</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <ApperIcon name="Award" size={16} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Quality Rating</p>
                  <p className="text-sm text-gray-600">CMS Star Rating</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-purple-600">5★</span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Executive Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Financial Performance */}
        <div className="bg-white rounded-lg shadow-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Performance</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Monthly Revenue</span>
              <span className="font-semibold text-green-600">$2.45M</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Operating Margin</span>
              <span className="font-semibold">12.3%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Cost per Patient</span>
              <span className="font-semibold">$1,965</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Collection Rate</span>
              <span className="font-semibold text-green-600">94.2%</span>
            </div>
          </div>
        </div>

        {/* Operational Efficiency */}
        <div className="bg-white rounded-lg shadow-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Operational Efficiency</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Bed Turnover Rate</span>
              <span className="font-semibold">2.1 days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ED Wait Time</span>
              <span className="font-semibold text-yellow-600">23 min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Surgery On-Time</span>
              <span className="font-semibold text-green-600">96.8%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Discharge Before Noon</span>
              <span className="font-semibold">78.4%</span>
            </div>
          </div>
        </div>

        {/* Bed Management Widget */}
        <BedManagementWidget />
      </div>
    </div>
  )
}

export default Dashboard