import React, { useState, useEffect } from "react"
import ApexCharts from "apexcharts"
import ReactApexChart from "react-apexcharts"
import Button from "@/components/atoms/Button"
import { format } from "date-fns"

const VitalsChart = ({ vitals, selectedMetrics = ['systolicBP', 'diastolicBP'] }) => {
  const [metrics] = useState([
    { key: 'systolicBP', label: 'Systolic BP', color: '#DC3545', unit: 'mmHg' },
    { key: 'diastolicBP', label: 'Diastolic BP', color: '#FD7E14', unit: 'mmHg' },
    { key: 'temperature', label: 'Temperature', color: '#E74C3C', unit: '°F' },
    { key: 'heartRate', label: 'Heart Rate', color: '#28A745', unit: 'bpm' },
    { key: 'respiratoryRate', label: 'Respiratory Rate', color: '#17A2B8', unit: '/min' },
    { key: 'weight', label: 'Weight', color: '#6F42C1', unit: 'lbs' }
  ])

  const [activeMetrics, setActiveMetrics] = useState(selectedMetrics)

  const toggleMetric = (metricKey) => {
    setActiveMetrics(prev => 
      prev.includes(metricKey)
        ? prev.filter(k => k !== metricKey)
        : [...prev, metricKey]
    )
  }

  const chartData = {
    series: activeMetrics.map(metricKey => {
      const metric = metrics.find(m => m.key === metricKey)
      return {
        name: metric.label,
        data: vitals
          .filter(vital => vital[metricKey] !== null && vital[metricKey] !== undefined)
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .map(vital => ({
            x: new Date(vital.date).getTime(),
            y: parseFloat(vital[metricKey])
          })),
        color: metric.color
      }
    }),
    options: {
      chart: {
        type: 'line',
        height: 400,
        zoom: {
          enabled: true
        },
        toolbar: {
          show: true
        }
      },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      xaxis: {
        type: 'datetime',
        labels: {
          formatter: function(value) {
            return format(new Date(value), 'MMM dd')
          }
        }
      },
      yaxis: {
        title: {
          text: 'Values'
        },
        labels: {
          formatter: function(value) {
            return Math.round(value * 100) / 100
          }
        }
      },
      tooltip: {
        x: {
          formatter: function(value) {
            return format(new Date(value), 'MMM dd, yyyy HH:mm')
          }
        },
        y: {
          formatter: function(value, { seriesIndex }) {
            const metric = metrics.find(m => m.key === activeMetrics[seriesIndex])
            return `${value} ${metric?.unit || ''}`
          }
        }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left'
      },
      grid: {
        borderColor: '#e0e0e0'
      },
      markers: {
        size: 6,
        hover: {
          sizeOffset: 3
        }
      }
    }
  }

  if (vitals.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <p className="text-lg font-medium">No vital signs data</p>
          <p className="text-sm">Add some vital signs to see the chart</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Metric Toggle Buttons */}
      <div className="flex flex-wrap gap-2">
        {metrics.map(metric => (
          <Button
            key={metric.key}
            size="sm"
            variant={activeMetrics.includes(metric.key) ? "primary" : "secondary"}
            onClick={() => toggleMetric(metric.key)}
            className="text-xs"
          >
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: metric.color }}
            />
            {metric.label}
          </Button>
        ))}
      </div>

      {/* Chart */}
      {activeMetrics.length > 0 ? (
        <div className="bg-white rounded-lg p-4">
          <ReactApexChart
            options={chartData.options}
            series={chartData.series}
            type="line"
            height={400}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center h-64 text-gray-500 bg-gray-50 rounded-lg">
          <p>Select at least one metric to display the chart</p>
        </div>
      )}
    </div>
  )
}

export default VitalsChart