import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { HugeiconsIcon } from "@hugeicons/react";
import {
  MoreHorizontalCircle01Icon,
  ArrowRight,
  ShoppingBag01Icon,
  PackageOutOfStockIcon,
  AlertCircleIcon,
  TrendingUp,
  DollarCircleIcon,
  UserIcon,
  CalendarIcon,
  TradeUpIcon,
  TradeDownIcon,
} from "@hugeicons/core-free-icons";
import React, { useEffect, useState, useMemo } from 'react';
import { getDashboardStats } from '@/services/dashboard-actions';
import { formatCurrency } from '@/lib/currency';
import { LoadingOverlay } from '@/components/loading-overlay';
import { useUser } from '@/hooks';
import { getDashboardStatsClient } from '@/lib/db/client-actions';
import { isNative } from "@/lib/native";
import { useBranch } from '@/components/providers/branch-provider';
import { usePurchasesQuery, usePurchaseStatsQuery } from '@/hooks/use-purchases-query';
import { useProducts } from '@/hooks/use-products-query';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7days');
  const { user } = useUser();
  const { branch } = useBranch();

  // Obtener datos adicionales
  const { data: purchases = [] } = usePurchasesQuery(branch?.id, undefined);
  const { data: purchaseStats } = usePurchaseStatsQuery(branch?.id);
  const { data: productsData } = useProducts(branch?.id);
  const products = productsData?.products || [];

  useEffect(() => {
    async function fetchStats() {
      // Esperar a que el usuario esté cargado
      if (!user) {
        return;
      }

      setLoading(true);
      try {
        const result = typeof window !== 'undefined' && isNative()
          ? await getDashboardStatsClient(user.id)
          : await getDashboardStats(user.id);

        if (result.success && result.data) {
          setStats(result.data);
        } else {
          console.error('Error al cargar estadísticas:', result.error);
          // Si no hay datos, establecer datos vacíos para evitar mostrar el mensaje de error
          setStats({
            totalRevenue: 0,
            newCustomers: 0,
            productsSold: 0,
            growthRate: 0,
            chartData: [],
            recentSessions: [],
          });
        }
      } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        // Establecer datos vacíos en caso de error
        setStats({
          totalRevenue: 0,
          newCustomers: 0,
          productsSold: 0,
          growthRate: 0,
          chartData: [],
          recentSessions: [],
        });
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [user]);

  const isLoading = loading || !user;

  if (!stats && !isLoading) {
    return (
      <React.Fragment>
        <div className='p-6'>
          <Card>
            <CardContent className='pt-6'>
              <p className='text-center text-muted-foreground'>
                No se pudieron cargar las estadísticas
              </p>
            </CardContent>
          </Card>
        </div>
      </React.Fragment>
    );
  }

  // Calcular métricas adicionales
  const todayRevenue = useMemo(() => {
    if (!stats?.chartData) return 0;
    const today = new Date().toISOString().split('T')[0];
    const todayData = stats.chartData.find((d: any) => d.date === today);
    return todayData?.value || 0;
  }, [stats]);

  const averagePerSession = useMemo(() => {
    if (!stats || stats.productsSold === 0) return 0;
    return stats.totalRevenue / stats.productsSold;
  }, [stats]);

  const pendingPurchases = useMemo(() => {
    return purchases.filter((p: any) => p.status === 'pending').length;
  }, [purchases]);

  const lowStockProducts = useMemo(() => {
    return (products as any[]).filter((p: any) => (p.stock || 0) > 0 && (p.stock || 0) <= 10).length;
  }, [products]);

  const outOfStockProducts = useMemo(() => {
    return (products as any[]).filter((p: any) => (p.stock || 0) === 0).length;
  }, [products]);

  // Only define metrics and chart functions when stats exists
  const metrics = stats ? [
    {
      title: 'Ingresos totales',
      value: formatCurrency(stats.totalRevenue),
      change: stats.growthRate >= 0 ? `+${stats.growthRate.toFixed(1)}%` : `${stats.growthRate.toFixed(1)}%`,
      trend: stats.growthRate >= 0 ? 'up' : 'down',
      description: stats.growthRate >= 0 ? 'Incremento este mes' : 'Disminución este mes',
      detail: 'Ventas de los últimos 30 días',
      icon: DollarCircleIcon,
    },
    {
      title: 'Ventas de hoy',
      value: formatCurrency(todayRevenue),
      change: '+0%',
      trend: 'up',
      description: 'Ingresos del día',
      detail: new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }),
      icon: CalendarIcon,
    },
    {
      title: 'Promedio por sesión',
      value: formatCurrency(averagePerSession),
      change: '+0%',
      trend: 'up',
      description: 'Ticket promedio',
      detail: `${stats.productsSold.toLocaleString()} sesiones`,
      icon: TrendingUp,
    },
    {
      title: 'Clientes únicos',
      value: stats.newCustomers.toLocaleString(),
      change: '+0%',
      trend: 'up',
      description: 'Sesiones únicas',
      detail: 'Clientes activos este mes',
      icon: UserIcon,
    },
  ] : [];

  const alertMetrics = [
    {
      title: 'Pedidos pendientes',
      subtitle: "Proveedores",
      value: pendingPurchases,
      description: 'Requieren atención',
      icon: ShoppingBag01Icon,
      variant: pendingPurchases > 0 ? 'destructive' : 'default' as const,
      link: '/dashboard/purchases',
    },
    {
      title: 'Productos bajo stock',
      subtitle: "Inventario",
      value: lowStockProducts,
      description: 'Stock ≤ 10 unidades',
      icon: AlertCircleIcon,
      variant: lowStockProducts > 0 ? 'destructive' : 'default' as const,
      link: '/dashboard/products',
    },
    {
      title: 'Productos sin stock',
      subtitle: "Inventario",
      value: outOfStockProducts,
      description: 'Stock agotado',
      icon: PackageOutOfStockIcon,
      variant: outOfStockProducts > 0 ? 'destructive' : 'default' as const,
      link: '/dashboard/products',
    },
  ];

  // Preparar datos del gráfico según el rango de tiempo seleccionado
  const getChartData = () => {
    if (!stats || !stats.chartData) return [];
    if (timeRange === '7days') {
      return stats.chartData.slice(-7);
    } else if (timeRange === '30days') {
      // Agrupar por semana si hay más de 7 días
      return stats.chartData;
    } else {
      // 3 meses - agrupar por mes
      return stats.chartData;
    }
  };

  const displayChartData = getChartData();

  const chartConfig = {
    revenue: {
      label: "Ingresos",
      color: "var(--primary)",
    },
  } satisfies ChartConfig

  return (
    <React.Fragment>
      <LoadingOverlay isLoading={isLoading} />
      {stats && (
        <div className='p-6 space-y-6 overflow-y-auto'>
          {/* Métricas principales */}
          <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
            {metrics.map((metric, index) => (
              <Card key={index} className='relative overflow-hidden'>
                <CardHeader>
                  <CardDescription>{metric.title}</CardDescription>
                  <CardTitle className='text-3xl'>{metric.value}</CardTitle>
                  <CardAction>
                    <Badge variant='outline'>
                      {
                        metric.trend === 'up' ? (
                          <HugeiconsIcon
                            icon={TradeUpIcon}
                            strokeWidth={2}
                          />
                        ) : (
                          <HugeiconsIcon
                            icon={TradeDownIcon}
                            strokeWidth={2}
                          />
                        )
                      }
                      {metric.change}
                    </Badge>
                  </CardAction>
                </CardHeader>
                <CardFooter className='flex flex-col items-start'>
                  <span>{metric.description} {metric.trend === 'up' ? <HugeiconsIcon icon={TradeUpIcon} strokeWidth={2} className='inline-block' size={16} /> : <HugeiconsIcon icon={TradeDownIcon} strokeWidth={2} className='inline-block' size={16} />}</span>
                  <span className='text-muted-foreground'>
                    {metric.detail}
                  </span>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Alertas y acciones rápidas */}
          <div className='grid gap-4 md:grid-cols-3'>
            {alertMetrics.map((alert, index) => (
              <Link key={index} to={alert.link}>
                <Card className={cn(
                  'cursor-pointer transition-all hover:shadow-md'
                )}>
                  <CardHeader>
                    <CardDescription>{alert.title}</CardDescription>
                    <CardTitle className='font-medium text-3xl'>{alert.value}</CardTitle>
                    <CardAction>
                      <Badge variant={alert.variant === 'destructive' ? 'destructive' : 'outline'}>
                        <HugeiconsIcon
                          icon={alert.icon}
                          strokeWidth={2}
                        />
                        {alert.subtitle}
                      </Badge>
                    </CardAction>
                  </CardHeader>
                  <CardFooter>
                    <span>{alert.description}</span>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
          <Card className='overflow-hidden'>
            <CardHeader>
              <CardTitle>Ingresos totales</CardTitle>
              <CardDescription>Evolución de ingresos en el tiempo</CardDescription>
              <CardAction>
                <Tabs value={timeRange} onValueChange={setTimeRange} className='w-auto'>
                  <TabsList>
                    <TabsTrigger value='7days'>Últimos 7 días</TabsTrigger>
                    <TabsTrigger value='30days'>Últimos 30 días</TabsTrigger>
                    <TabsTrigger value='3months'>Últimos 3 meses</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardAction>
            </CardHeader>
            <CardContent className='pt-4 pl-0'>
              <div className='h-[300px] w-full'>
                {displayChartData.length > 0 ? (
                  <ChartContainer config={chartConfig} className="h-full w-full">
                    <AreaChart
                      accessibilityLayer
                      data={displayChartData}
                      margin={{
                        left: 12,
                        right: 12,
                        top: 12,
                        bottom: 12,
                      }}
                    >
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        minTickGap={32}
                        tickFormatter={(value) => {
                          // Just return the date string as-is since it's already formatted
                          return value;
                        }}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={
                          <ChartTooltipContent
                            labelFormatter={(value) => {
                              // Return the date string as-is
                              return value;
                            }}
                            indicator="dot"
                          />
                        }
                      />
                      <defs>
                        <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor="var(--color-revenue)"
                            stopOpacity={1.0}
                          />
                          <stop
                            offset="95%"
                            stopColor="var(--color-revenue)"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <Area
                        dataKey="value"
                        type="natural"
                        fill="url(#fillRevenue)"
                        stroke="var(--color-revenue)"
                        stackId="a"
                      />
                    </AreaChart>
                  </ChartContainer>
                ) : (
                  <div className='flex items-center justify-center h-full text-muted-foreground'>
                    No hay datos para mostrar
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          {/* Tabla de sesiones recientes */}
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle>Sesiones Recientes</CardTitle>
                  <CardDescription>Últimas transacciones realizadas</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/dashboard/sessions">
                    <HugeiconsIcon icon={ArrowRight} className='size-4' strokeWidth={2} />
                    Ver todas
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className='border rounded-lg overflow-hidden'>
                <Table>
                  <TableHeader className='bg-muted'>
                    <TableRow>
                      <TableHead>Sesión</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Usuario</TableHead>
                      <TableHead className='text-right'>Total</TableHead>
                      <TableHead className='w-12'></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(!stats.recentSessions || stats.recentSessions.length === 0) ? (
                      <TableRow>
                        <TableCell colSpan={7} className='text-center text-muted-foreground py-8'>
                          No hay sesiones recientes
                        </TableCell>
                      </TableRow>
                    ) : (
                      stats.recentSessions.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell className='font-medium'>{item.header}</TableCell>
                          <TableCell className='text-muted-foreground'>
                            {item.type}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                item.status === 'Done' ? 'secondary' : 'outline'
                              }
                            >
                              {item.status === 'Done' ? 'Finalizada' : 'En curso'}
                            </Badge>
                          </TableCell>
                          <TableCell>{item.reviewer}</TableCell>
                          <TableCell className='text-right font-medium'>
                            {formatCurrency(item.total)}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant='ghost' size='icon-sm'>
                                  <HugeiconsIcon icon={MoreHorizontalCircle01Icon} className='size-4' strokeWidth={2} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align='end'>
                                <Link to='/dashboard/sessions'>
                                  <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                                </Link>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              {stats.recentSessions && stats.recentSessions.length > 0 && (
                <div className='flex items-center justify-between mt-4 text-sm text-muted-foreground'>
                  <div>Mostrando {stats.recentSessions.length} sesión(es) reciente(s)</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </React.Fragment>
  );
}
