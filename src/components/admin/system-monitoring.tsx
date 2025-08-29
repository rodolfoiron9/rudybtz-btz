'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  Database, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Gauge, 
  Server, 
  Globe, 
  Shield, 
  RefreshCw, 
  Download, 
  Upload as UploadIcon, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Music, 
  Image, 
  FileText, 
  Package,
  Monitor,
  Smartphone,
  Tablet,
  Chrome,
  Eye,
  Settings,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  MapPin,
  Info
} from 'lucide-react';

interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  history: number[];
}

interface ServiceStatus {
  name: string;
  status: 'online' | 'offline' | 'maintenance';
  uptime: string;
  responseTime: number;
  lastCheck: string;
  url?: string;
}

interface UserSession {
  id: string;
  user: string;
  device: string;
  browser: string;
  location: string;
  startTime: string;
  lastActivity: string;
  pages: number;
}

interface PerformanceData {
  timestamp: string;
  cpu: number;
  memory: number;
  loadTime: number;
  requests: number;
}

const SystemMonitoring: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  // Real-time system metrics (simulated)
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([
    {
      name: 'CPU Usage',
      value: 45,
      unit: '%',
      status: 'good',
      trend: 'stable',
      history: [42, 45, 43, 46, 45, 47, 45]
    },
    {
      name: 'Memory Usage',
      value: 68,
      unit: '%',
      status: 'warning',
      trend: 'up',
      history: [65, 66, 67, 68, 69, 68, 68]
    },
    {
      name: 'Disk Usage',
      value: 72,
      unit: '%',
      status: 'warning',
      trend: 'up',
      history: [70, 71, 71, 72, 72, 73, 72]
    },
    {
      name: 'Network I/O',
      value: 23,
      unit: 'MB/s',
      status: 'good',
      trend: 'down',
      history: [25, 24, 23, 24, 23, 22, 23]
    }
  ]);

  const [serviceStatuses, setServiceStatuses] = useState<ServiceStatus[]>([
    {
      name: 'Audio Engine',
      status: 'online',
      uptime: '99.8%',
      responseTime: 45,
      lastCheck: '30 seconds ago',
      url: '/api/audio'
    },
    {
      name: 'Template System',
      status: 'online',
      uptime: '99.9%',
      responseTime: 23,
      lastCheck: '15 seconds ago',
      url: '/api/templates'
    },
    {
      name: 'Database',
      status: 'online',
      uptime: '99.7%',
      responseTime: 12,
      lastCheck: '10 seconds ago'
    },
    {
      name: 'File Storage',
      status: 'online',
      uptime: '99.5%',
      responseTime: 67,
      lastCheck: '25 seconds ago'
    },
    {
      name: 'Authentication',
      status: 'online',
      uptime: '99.9%',
      responseTime: 34,
      lastCheck: '20 seconds ago'
    }
  ]);

  const [userSessions, setUserSessions] = useState<UserSession[]>([
    {
      id: 'session_1',
      user: 'Admin User',
      device: 'Desktop',
      browser: 'Chrome',
      location: 'New York, USA',
      startTime: '2024-08-28 14:30:00',
      lastActivity: '2 minutes ago',
      pages: 15
    },
    {
      id: 'session_2',
      user: 'Guest',
      device: 'Mobile',
      browser: 'Safari',
      location: 'London, UK',
      startTime: '2024-08-28 15:45:00',
      lastActivity: '5 minutes ago',
      pages: 8
    }
  ]);

  const [performanceHistory, setPerformanceHistory] = useState<PerformanceData[]>([
    { timestamp: '14:00', cpu: 42, memory: 65, loadTime: 1.2, requests: 145 },
    { timestamp: '14:15', cpu: 45, memory: 66, loadTime: 1.1, requests: 167 },
    { timestamp: '14:30', cpu: 43, memory: 67, loadTime: 1.3, requests: 134 },
    { timestamp: '14:45', cpu: 46, memory: 68, loadTime: 1.0, requests: 189 },
    { timestamp: '15:00', cpu: 45, memory: 69, loadTime: 1.2, requests: 156 },
    { timestamp: '15:15', cpu: 47, memory: 68, loadTime: 1.1, requests: 178 },
    { timestamp: '15:30', cpu: 45, memory: 68, loadTime: 1.4, requests: 143 }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // Update system metrics with slight variations
      setSystemMetrics(prev => prev.map(metric => {
        const variation = (Math.random() - 0.5) * 4; // ±2% variation
        const newValue = Math.max(0, Math.min(100, metric.value + variation));
        const newHistory = [...metric.history.slice(1), newValue];
        
        return {
          ...metric,
          value: Math.round(newValue),
          history: newHistory,
          trend: newValue > metric.value ? 'up' : newValue < metric.value ? 'down' : 'stable',
          status: newValue > 80 ? 'critical' : newValue > 60 ? 'warning' : 'good'
        };
      }));

      // Update service response times
      setServiceStatuses(prev => prev.map(service => ({
        ...service,
        responseTime: Math.max(10, service.responseTime + (Math.random() - 0.5) * 10),
        lastCheck: 'Just now'
      })));
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  const refreshData = async () => {
    setIsRefreshing(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const getStatusIcon = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'online': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'offline': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'maintenance': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getStatusBadge = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'online': return <Badge className="bg-green-600">Online</Badge>;
      case 'offline': return <Badge className="bg-red-600">Offline</Badge>;
      case 'maintenance': return <Badge className="bg-yellow-600">Maintenance</Badge>;
    }
  };

  const getTrendIcon = (trend: SystemMetric['trend']) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-red-400" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-green-400" />;
      case 'stable': return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const getBrowserIcon = (browser: string) => {
    switch (browser.toLowerCase()) {
      case 'chrome': return <Chrome className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      case 'tablet': return <Tablet className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  const systemHealth = Math.round(
    systemMetrics.reduce((sum, metric) => {
      const score = metric.status === 'good' ? 100 : metric.status === 'warning' ? 70 : 30;
      return sum + score;
    }, 0) / systemMetrics.length
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-3d-silver-violet silver-violet">System Monitoring</h2>
          <p className="text-muted mt-1">Real-time performance metrics and system health monitoring</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${autoRefresh ? 'animate-pulse bg-green-400' : 'bg-gray-400'}`} />
            <span className="text-sm text-muted">
              {autoRefresh ? `Auto-refresh: ${refreshInterval}s` : 'Manual refresh'}
            </span>
          </div>
          <Button
            onClick={refreshData}
            disabled={isRefreshing}
            className="cyber-button-primary"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cyber-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-sm text-muted">System Health</p>
                <p className="text-2xl font-bold text-white">{systemHealth}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cyber-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-sm text-muted">Active Sessions</p>
                <p className="text-2xl font-bold text-white">{userSessions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cyber-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-sm text-muted">Services Online</p>
                <p className="text-2xl font-bold text-white">
                  {serviceStatuses.filter(s => s.status === 'online').length}/{serviceStatuses.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cyber-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-sm text-muted">Avg Response</p>
                <p className="text-2xl font-bold text-white">
                  {Math.round(serviceStatuses.reduce((sum, s) => sum + s.responseTime, 0) / serviceStatuses.length)}ms
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* System Metrics */}
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="text-lg">System Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {systemMetrics.map((metric, index) => (
                  <Card key={index} className="cyber-card">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted">{metric.name}</span>
                        {getTrendIcon(metric.trend)}
                      </div>
                      <div className="text-2xl font-bold text-white mb-2">
                        {metric.value}{metric.unit}
                      </div>
                      <Progress 
                        value={metric.value} 
                        className={`h-2 ${
                          metric.status === 'critical' ? 'bg-red-900' : 
                          metric.status === 'warning' ? 'bg-yellow-900' : 'bg-green-900'
                        }`}
                      />
                      <div className="flex justify-between items-center mt-2">
                        <Badge variant="outline" className={`text-xs ${
                          metric.status === 'critical' ? 'text-red-400 border-red-400' : 
                          metric.status === 'warning' ? 'text-yellow-400 border-yellow-400' : 
                          'text-green-400 border-green-400'
                        }`}>
                          {metric.status.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-muted">Last 7h</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button className="cyber-button-primary h-16 flex-col">
                  <Download className="w-5 h-5 mb-1" />
                  <span className="text-xs">Export Logs</span>
                </Button>
                <Button className="cyber-button-primary h-16 flex-col">
                  <Shield className="w-5 h-5 mb-1" />
                  <span className="text-xs">Security Scan</span>
                </Button>
                <Button className="cyber-button-primary h-16 flex-col">
                  <Database className="w-5 h-5 mb-1" />
                  <span className="text-xs">Backup DB</span>
                </Button>
                <Button className="cyber-button-primary h-16 flex-col">
                  <Settings className="w-5 h-5 mb-1" />
                  <span className="text-xs">Configure</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="text-lg">Performance History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Simulated Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-white">CPU & Memory Usage</h4>
                    <div className="h-48 bg-gray-900 rounded-lg p-4 flex items-end justify-between">
                      {performanceHistory.map((data, index) => (
                        <div key={index} className="flex flex-col items-center gap-1">
                          <div className="flex flex-col gap-1">
                            <div 
                              className="w-4 bg-blue-500 rounded-t"
                              style={{ height: `${data.cpu * 1.5}px` }}
                            />
                            <div 
                              className="w-4 bg-purple-500 rounded-b"
                              style={{ height: `${data.memory * 1.5}px` }}
                            />
                          </div>
                          <span className="text-xs text-muted">{data.timestamp}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-blue-500 rounded" />
                        <span className="text-muted">CPU</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-purple-500 rounded" />
                        <span className="text-muted">Memory</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-white">Response Time & Requests</h4>
                    <div className="h-48 bg-gray-900 rounded-lg p-4 flex items-end justify-between">
                      {performanceHistory.map((data, index) => (
                        <div key={index} className="flex flex-col items-center gap-1">
                          <div className="flex flex-col gap-1">
                            <div 
                              className="w-4 bg-green-500 rounded-t"
                              style={{ height: `${data.loadTime * 30}px` }}
                            />
                            <div 
                              className="w-4 bg-orange-500 rounded-b"
                              style={{ height: `${data.requests * 0.5}px` }}
                            />
                          </div>
                          <span className="text-xs text-muted">{data.timestamp}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-green-500 rounded" />
                        <span className="text-muted">Load Time (s)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-orange-500 rounded" />
                        <span className="text-muted">Requests</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="cyber-card p-4 text-center">
                    <BarChart3 className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">1.2s</div>
                    <div className="text-sm text-muted">Avg Load Time</div>
                  </div>
                  <div className="cyber-card p-4 text-center">
                    <PieChart className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">156</div>
                    <div className="text-sm text-muted">Requests/min</div>
                  </div>
                  <div className="cyber-card p-4 text-center">
                    <LineChart className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">99.8%</div>
                    <div className="text-sm text-muted">Uptime</div>
                  </div>
                  <div className="cyber-card p-4 text-center">
                    <TrendingUp className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">45ms</div>
                    <div className="text-sm text-muted">Avg Response</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="text-lg">Service Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {serviceStatuses.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(service.status)}
                      <div>
                        <div className="font-medium text-white">{service.name}</div>
                        <div className="text-sm text-muted">
                          Uptime: {service.uptime} • Response: {Math.round(service.responseTime)}ms
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm text-muted">{service.lastCheck}</div>
                        {service.url && (
                          <div className="text-xs text-muted">{service.url}</div>
                        )}
                      </div>
                      {getStatusBadge(service.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="text-lg">Service Dependencies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="cyber-card p-4">
                    <Music className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-center">
                      <div className="text-sm font-medium text-white">Audio Engine</div>
                      <div className="text-xs text-muted mt-1">Web Audio API, Real-time Processing</div>
                      <Badge className="mt-2 bg-green-600">Healthy</Badge>
                    </div>
                  </div>
                  
                  <div className="cyber-card p-4">
                    <Package className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <div className="text-center">
                      <div className="text-sm font-medium text-white">Template System</div>
                      <div className="text-xs text-muted mt-1">ZIP Analysis, Component Extraction</div>
                      <Badge className="mt-2 bg-green-600">Healthy</Badge>
                    </div>
                  </div>
                  
                  <div className="cyber-card p-4">
                    <Database className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <div className="text-center">
                      <div className="text-sm font-medium text-white">Data Storage</div>
                      <div className="text-xs text-muted mt-1">Firestore, File Storage</div>
                      <Badge className="mt-2 bg-green-600">Healthy</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="text-lg">Active User Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userSessions.map((session) => (
                  <div key={session.id} className="p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-white">
                            {session.user.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-white">{session.user}</div>
                          <div className="text-sm text-muted">{session.lastActivity}</div>
                        </div>
                      </div>
                      <Badge className="bg-green-600">Active</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        {getDeviceIcon(session.device)}
                        <span className="text-muted">{session.device}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getBrowserIcon(session.browser)}
                        <span className="text-muted">{session.browser}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-muted">{session.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        <span className="text-muted">{session.pages} pages</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="text-lg">Session Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="cyber-card p-4 text-center">
                  <Clock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">24m</div>
                  <div className="text-sm text-muted">Avg Session Time</div>
                </div>
                <div className="cyber-card p-4 text-center">
                  <FileText className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">11.5</div>
                  <div className="text-sm text-muted">Pages per Session</div>
                </div>
                <div className="cyber-card p-4 text-center">
                  <Users className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">73%</div>
                  <div className="text-sm text-muted">Return Visitors</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="text-lg">Monitoring Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="refresh-interval" className="text-sm font-medium text-white">Auto-refresh Interval</label>
                  <select
                    id="refresh-interval"
                    value={refreshInterval}
                    onChange={(e) => setRefreshInterval(Number(e.target.value))}
                    className="w-full mt-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
                  >
                    <option value={15}>15 seconds</option>
                    <option value={30}>30 seconds</option>
                    <option value={60}>1 minute</option>
                    <option value={300}>5 minutes</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label htmlFor="auto-refresh" className="text-sm font-medium text-white">Auto-refresh</label>
                    <p className="text-xs text-muted">Automatically update metrics</p>
                  </div>
                  <input
                    id="auto-refresh"
                    type="checkbox"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                    className="toggle"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label htmlFor="email-alerts" className="text-sm font-medium text-white">Email Alerts</label>
                    <p className="text-xs text-muted">Send alerts for critical issues</p>
                  </div>
                  <input id="email-alerts" type="checkbox" defaultChecked className="toggle" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label htmlFor="performance-logging" className="text-sm font-medium text-white">Performance Logging</label>
                    <p className="text-xs text-muted">Log detailed performance metrics</p>
                  </div>
                  <input id="performance-logging" type="checkbox" defaultChecked className="toggle" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="text-lg">Alert Thresholds</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="cpu-warning" className="text-sm font-medium text-white">CPU Usage Warning (%)</label>
                  <input 
                    id="cpu-warning"
                    type="number" 
                    defaultValue={70} 
                    className="w-full mt-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="memory-warning" className="text-sm font-medium text-white">Memory Usage Warning (%)</label>
                  <input 
                    id="memory-warning"
                    type="number" 
                    defaultValue={80} 
                    className="w-full mt-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="response-time-warning" className="text-sm font-medium text-white">Response Time Warning (ms)</label>
                  <input 
                    id="response-time-warning"
                    type="number" 
                    defaultValue={500} 
                    className="w-full mt-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="disk-usage-warning" className="text-sm font-medium text-white">Disk Usage Warning (%)</label>
                  <input 
                    id="disk-usage-warning"
                    type="number" 
                    defaultValue={85} 
                    className="w-full mt-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemMonitoring;