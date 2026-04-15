import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { useSessions } from '../contexts/SessionContext';
import { Card } from '../components/ui/Card';
import { PageHeader } from '../components/ui/PageHeader';
import { Badge } from '../components/ui/Badge';
import { 
  TrendingUp, 
  PieChart as PieChartIcon, 
  BarChart3, 
  Activity,
  Calendar,
  Layers,
  AlertCircle
} from 'lucide-react';
import { format, startOfDay, subDays, isWithinInterval } from 'date-fns';

const COLORS = ['#4f46e5', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#06b6d4'];

export function AnalyticsDashboard() {
  const { sessions } = useSessions();

  const stats = useMemo(() => {
    const categoryData: Record<string, number> = {};
    const priorityData: Record<string, number> = { low: 0, medium: 0, high: 0 };
    const statusData: Record<string, number> = { active: 0, archived: 0, done: 0, blocked: 0 };
    
    // Time series data for last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(startOfDay(new Date()), i);
      return {
        date: format(date, 'MMM d'),
        fullDate: date,
        count: 0
      };
    }).reverse();

    sessions.forEach(session => {
      // Category
      categoryData[session.category] = (categoryData[session.category] || 0) + 1;
      
      // Priority
      priorityData[session.priority]++;
      
      // Status
      statusData[session.status]++;

      // Time series
      const sessionDate = startOfDay(new Date(session.createdAt));
      const dayIndex = last7Days.findIndex(d => d.fullDate.getTime() === sessionDate.getTime());
      if (dayIndex !== -1) {
        last7Days[dayIndex].count++;
      }
    });

    return {
      category: Object.entries(categoryData).map(([name, value]) => ({ name, value })),
      priority: Object.entries(priorityData).map(([name, value]) => ({ name, value })),
      status: Object.entries(statusData).map(([name, value]) => ({ name, value })),
      timeSeries: last7Days,
      total: sessions.length,
      active: statusData.active,
      done: statusData.done,
      blocked: statusData.blocked
    };
  }, [sessions]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <PageHeader 
        title="Advanced Analytics" 
        description="Deep insights into your productivity and context management."
      >
        <Badge variant="indigo" size="md" icon={Activity}>Pro Feature</Badge>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium theme-text-secondary">Total Sessions</p>
            <p className="text-2xl font-bold theme-text-primary">{stats.total}</p>
          </div>
        </Card>
        <Card className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium theme-text-secondary">Active Now</p>
            <p className="text-2xl font-bold theme-text-primary">{stats.active}</p>
          </div>
        </Card>
        <Card className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium theme-text-secondary">Completed</p>
            <p className="text-2xl font-bold theme-text-primary">{stats.done}</p>
          </div>
        </Card>
        <Card className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium theme-text-secondary">Blocked</p>
            <p className="text-2xl font-bold theme-text-primary">{stats.blocked}</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold theme-text-primary">Creation Trend (Last 7 Days)</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.timeSeries}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-800" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'currentColor', fontSize: 12 }}
                  className="text-slate-500 dark:text-slate-400"
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'currentColor', fontSize: 12 }}
                  className="text-slate-500 dark:text-slate-400"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: 'none', 
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#4f46e5" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold theme-text-primary">Priority Distribution</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.priority}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-800" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'currentColor', fontSize: 12 }}
                  className="text-slate-500 dark:text-slate-400"
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'currentColor', fontSize: 12 }}
                  className="text-slate-500 dark:text-slate-400"
                />
                <Tooltip 
                  cursor={{ fill: 'currentColor', className: 'text-slate-100 dark:text-slate-800/50' }}
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: 'none', 
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {stats.priority.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.name === 'high' ? '#f43f5e' : entry.name === 'medium' ? '#f59e0b' : '#64748b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-8 space-y-6 lg:col-span-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
              <PieChartIcon className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold theme-text-primary">Sessions by Category</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.category}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.category.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: 'none', 
                      borderRadius: '12px',
                      color: '#fff'
                    }}
                  />
                  <Legend verticalAlign="middle" align="right" layout="vertical" />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold theme-text-primary uppercase tracking-wider">Top Categories</h4>
              <div className="space-y-3">
                {stats.category.sort((a, b) => b.value - a.value).slice(0, 5).map((cat, i) => (
                  <div key={cat.name} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-sm font-medium theme-text-secondary">{cat.name}</span>
                    </div>
                    <span className="text-sm font-bold theme-text-primary">{cat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
