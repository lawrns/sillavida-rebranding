/**
 * Analytics Dashboard Component
 *
 * This component displays analytics data in the admin panel, including
 * sales, traffic, and user behavior metrics.
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, ShoppingCart, Users, Eye, ArrowUpRight, ArrowDownRight } from 'lucide-react';

// Mock data for the dashboard
// In a real implementation, this would come from an API
const mockData = {
  salesOverview: {
    daily: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('es-MX', { weekday: 'short' }),
      sales: Math.floor(Math.random() * 5000) + 1000,
    })),
    weekly: Array.from({ length: 4 }, (_, i) => ({
      date: `Semana ${i + 1}`,
      sales: Math.floor(Math.random() * 20000) + 5000,
    })),
    monthly: Array.from({ length: 12 }, (_, i) => ({
      date: new Date(2025, i, 1).toLocaleDateString('es-MX', { month: 'short' }),
      sales: Math.floor(Math.random() * 80000) + 20000,
    })),
  },
  trafficSources: [
    { name: 'Directo', value: 30 },
    { name: 'Orgánico', value: 25 },
    { name: 'Social', value: 20 },
    { name: 'Referido', value: 15 },
    { name: 'Email', value: 10 },
  ],
  topProducts: [
    { name: 'Silla Ergonómica Pro', sales: 120, revenue: 29999 },
    { name: 'Silla Ejecutiva Premium', sales: 85, revenue: 25499 },
    { name: 'Silla Gamer Ultra', sales: 65, revenue: 19999 },
    { name: 'Silla Visitante', sales: 45, revenue: 8999 },
    { name: 'Silla Secretarial', sales: 40, revenue: 7999 },
  ],
  conversionRate: {
    daily: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('es-MX', { weekday: 'short' }),
      rate: (Math.random() * 5 + 2).toFixed(2),
    })),
  },
  kpis: {
    totalSales: {
      value: 125750,
      change: 12.5,
      isPositive: true,
    },
    totalOrders: {
      value: 354,
      change: 8.2,
      isPositive: true,
    },
    totalVisitors: {
      value: 12450,
      change: 15.3,
      isPositive: true,
    },
    conversionRate: {
      value: 2.84,
      change: -0.5,
      isPositive: false,
    },
  },
};

// Colors for charts - Monochromatic System
const COLORS = ['#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#E5E5E5'];

// Time range options
type TimeRange = '7d' | '30d' | '90d' | '1y';

interface AnalyticsDashboardProps {
  className?: string;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ className = '' }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [salesData, setSalesData] = useState(mockData.salesOverview.daily);

  // Update sales data when time range changes
  useEffect(() => {
    switch (timeRange) {
      case '7d':
        setSalesData(mockData.salesOverview.daily);
        break;
      case '30d':
        setSalesData(mockData.salesOverview.weekly);
        break;
      case '90d':
      case '1y':
        setSalesData(mockData.salesOverview.monthly);
        break;
      default:
        setSalesData(mockData.salesOverview.daily);
    }
  }, [timeRange]);

  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className={`analytics-dashboard bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">Panel de Análisis</h2>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Periodo:</span>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          >
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
            <option value="90d">Últimos 90 días</option>
            <option value="1y">Último año</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard
          title="Ventas Totales"
          value={formatCurrency(mockData.kpis.totalSales.value)}
          change={mockData.kpis.totalSales.change}
          isPositive={mockData.kpis.totalSales.isPositive}
          icon={<DollarSign size={20} />}
        />
        <KpiCard
          title="Órdenes"
          value={mockData.kpis.totalOrders.value.toString()}
          change={mockData.kpis.totalOrders.change}
          isPositive={mockData.kpis.totalOrders.isPositive}
          icon={<ShoppingCart size={20} />}
        />
        <KpiCard
          title="Visitantes"
          value={mockData.kpis.totalVisitors.value.toString()}
          change={mockData.kpis.totalVisitors.change}
          isPositive={mockData.kpis.totalVisitors.isPositive}
          icon={<Users size={20} />}
        />
        <KpiCard
          title="Tasa de Conversión"
          value={`${mockData.kpis.conversionRate.value}%`}
          change={mockData.kpis.conversionRate.change}
          isPositive={mockData.kpis.conversionRate.isPositive}
          icon={<Eye size={20} />}
        />
      </div>

      {/* Sales Overview Chart */}
      <div className="bg-gray-50 rounded-lg p-4 mb-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Resumen de Ventas</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#000000" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#000000" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#666" />
              <YAxis stroke="#666" tickFormatter={(value) => `$${value / 1000}k`} />
              <Tooltip
                formatter={(value) => [`${formatCurrency(value as number)}`, 'Ventas']}
                labelFormatter={(label) => `Fecha: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#000000"
                fillOpacity={1}
                fill="url(#colorSales)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Traffic Sources */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Fuentes de Tráfico</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockData.trafficSources}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mockData.trafficSources.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Porcentaje']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Tasa de Conversión</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData.conversionRate.daily}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#666" />
                <YAxis stroke="#666" tickFormatter={(value) => `${value}%`} />
                <Tooltip
                  formatter={(value) => [`${value}%`, 'Tasa de Conversión']}
                  labelFormatter={(label) => `Fecha: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#000000"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Productos Más Vendidos</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unidades Vendidas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ingresos</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockData.topProducts.map((product, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sales}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(product.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// KPI Card Component
interface KpiCardProps {
  title: string;
  value: string;
  change: number;
  isPositive: boolean;
  icon: React.ReactNode;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, change, isPositive, icon }) => {
  return (
    <motion.div
      className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm"
      whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="p-2 rounded-full bg-gray-100">
          <div className="text-black">{icon}</div>
        </div>
        <div className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          <span className="mr-1">{change}%</span>
          {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        </div>
      </div>
      <div className="mt-2">
        <p className="text-sm text-gray-500">{title}</p>
        <h4 className="text-2xl font-bold text-gray-800 mt-1">{value}</h4>
      </div>
    </motion.div>
  );
};

export default AnalyticsDashboard;
