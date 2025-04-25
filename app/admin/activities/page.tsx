"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ActivitiesPage() {
  const { activities } = useAuth()
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [dateRange, setDateRange] = useState("all")

  // Filtrar actividades
  const filteredActivities = activities.filter((activity) => {
    // Filtro por tipo de actividad
    if (filter !== "all") {
      if (!activity.action.toLowerCase().includes(filter.toLowerCase())) {
        return false
      }
    }

    // Filtro por término de búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch =
        activity.action.toLowerCase().includes(searchLower) ||
        activity.userName.toLowerCase().includes(searchLower) ||
        (activity.details && activity.details.toLowerCase().includes(searchLower))

      if (!matchesSearch) {
        return false
      }
    }

    // Filtro por rango de fecha
    if (dateRange !== "all") {
      const now = new Date()
      const activityDate = new Date(activity.timestamp)

      switch (dateRange) {
        case "today":
          // Hoy
          if (
            activityDate.getDate() !== now.getDate() ||
            activityDate.getMonth() !== now.getMonth() ||
            activityDate.getFullYear() !== now.getFullYear()
          ) {
            return false
          }
          break
        case "week":
          // Última semana
          const oneWeekAgo = new Date(now)
          oneWeekAgo.setDate(now.getDate() - 7)
          if (activityDate < oneWeekAgo) {
            return false
          }
          break
        case "month":
          // Último mes
          const oneMonthAgo = new Date(now)
          oneMonthAgo.setMonth(now.getMonth() - 1)
          if (activityDate < oneMonthAgo) {
            return false
          }
          break
      }
    }

    return true
  })

  // Obtener tipos únicos de actividades para el filtro
  const activityTypes = Array.from(new Set(activities.map((activity) => activity.action)))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Actividades Recientes</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:w-1/3 space-y-2">
          <label className="text-sm font-medium">Filtrar por tipo</label>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Todos los tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              {activityTypes.map((type) => (
                <SelectItem key={type} value={type.toLowerCase()}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-1/3 space-y-2">
          <label className="text-sm font-medium">Filtrar por fecha</label>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger>
              <SelectValue placeholder="Todas las fechas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las fechas</SelectItem>
              <SelectItem value="today">Hoy</SelectItem>
              <SelectItem value="week">Última semana</SelectItem>
              <SelectItem value="month">Último mes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-1/3 space-y-2">
          <label className="text-sm font-medium">Buscar</label>
          <div className="relative">
            <Input
              placeholder="Buscar actividades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Filter className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => {
            setFilter("all")
            setSearchTerm("")
            setDateRange("all")
          }}
        >
          Limpiar filtros
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registro de Actividades</CardTitle>
          <CardDescription>Historial de todas las acciones realizadas en el sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {filteredActivities.length > 0 ? (
              filteredActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0">
                  <div className="mt-0.5">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{new Date(activity.timestamp).toLocaleString()}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {activity.userName} {activity.details && `- ${activity.details}`}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">No hay actividades que coincidan con los filtros</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
