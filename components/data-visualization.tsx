"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts"

interface DataVisualizationProps {
  title: string
  description?: string
  type: "line" | "bar" | "pie" | "radar"
  data: any[]
  dataKeys: string[]
  xAxisKey?: string
  colors?: string[]
  className?: string
  animate?: boolean
  height?: number
  legend?: boolean
  tooltip?: boolean
  grid?: boolean
  labels?: boolean
  formatter?: (value: number) => string
}

export function DataVisualization({
  title,
  description,
  type,
  data,
  dataKeys,
  xAxisKey = "name",
  colors = [
    "#FF8000",
    "#3671C6",
    "#27F4D2",
    "#64C4FF",
    "#229971",
    "#52E252",
    "#E80020",
    "#0093CC",
    "#6692FF",
    "#B6BABD",
  ],
  className = "",
  animate = true,
  height = 300,
  legend = true,
  tooltip = true,
  grid = true,
  labels = true,
  formatter,
}: DataVisualizationProps) {
  const renderChart = () => {
    switch (type) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              {grid && <CartesianGrid strokeDasharray="3 3" opacity={0.1} />}
              {labels && <XAxis dataKey={xAxisKey} />}
              {labels && <YAxis />}
              {tooltip && <Tooltip />}
              {legend && <Legend />}
              {dataKeys.map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )
      case "bar":
        if (dataKeys.length === 1 && data.length > 1 && colors.length >= data.length) {
          const dataWithColors = data.map((item, index) => ({
            ...item,
            fill: item.color || colors[index % colors.length],
          }))

          return (
            <ResponsiveContainer width="100%" height={height}>
              <BarChart data={dataWithColors} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                {grid && <CartesianGrid strokeDasharray="3 3" opacity={0.1} />}
                {labels && <XAxis dataKey={xAxisKey} />}
                {labels && <YAxis />}
                {tooltip && <Tooltip formatter={formatter} />}
                {legend && <Legend />}
                <Bar dataKey={dataKeys[0]} radius={[4, 4, 0, 0]}>
                  {dataWithColors.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )
        } else {
          return (
            <ResponsiveContainer width="100%" height={height}>
              <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                {grid && <CartesianGrid strokeDasharray="3 3" opacity={0.1} />}
                {labels && <XAxis dataKey={xAxisKey} />}
                {labels && <YAxis />}
                {tooltip && <Tooltip formatter={formatter} />}
                {legend && <Legend />}
                {dataKeys.map((key, index) => (
                  <Bar key={key} dataKey={key} fill={colors[index % colors.length]} radius={[4, 4, 0, 0]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          )
        }
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey={dataKeys[0]}
                nameKey={xAxisKey}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              {tooltip && <Tooltip />}
              {legend && <Legend />}
            </PieChart>
          </ResponsiveContainer>
        )
      case "radar":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <RadarChart cx="50%" cy="50%" outerRadius={80} data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey={xAxisKey} />
              <PolarRadiusAxis />
              {dataKeys.map((key, index) => (
                <Radar
                  key={key}
                  name={key}
                  dataKey={key}
                  stroke={colors[index % colors.length]}
                  fill={colors[index % colors.length]}
                  fillOpacity={0.2}
                />
              ))}
              {tooltip && <Tooltip />}
              {legend && <Legend />}
            </RadarChart>
          </ResponsiveContainer>
        )
      default:
        return null
    }
  }

  const cardContent = (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{renderChart()}</CardContent>
    </Card>
  )

  return animate ? (
    <div className="opacity-0 animate-fade-in translate-y-5 animate-slide-in-up">{cardContent}</div>
  ) : (
    cardContent
  )
}
