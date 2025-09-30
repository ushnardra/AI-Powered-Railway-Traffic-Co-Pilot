import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area, ComposedChart } from 'recharts';

const punctualityData = [
  { name: '08:00', otp: 95 },
  { name: '09:00', otp: 92 },
  { name: '10:00', otp: 93 },
  { name: '11:00', otp: 88 },
  { name: '12:00', otp: 91 },
  { name: '13:00', otp: 94 },
];

const delayData = [
  { name: 'Mon', avgDelay: 2.1 },
  { name: 'Tue', avgDelay: 1.8 },
  { name: 'Wed', avgDelay: 2.5 },
  { name: 'Thu', avgDelay: 2.2 },
  { name: 'Fri', avgDelay: 3.1 },
  { name: 'Sat', avgDelay: 1.5 },
  { name: 'Sun', avgDelay: 1.2 },
];

const throughputData = [
    { hour: 6, trains: 8 },
    { hour: 7, trains: 12 },
    { hour: 8, trains: 15 },
    { hour: 9, trains: 14 },
    { hour: 10, trains: 11 },
    { hour: 11, trains: 10 },
];

const weatherImpactData = [
  { name: 'Clear', incidents: 2, "Avg Delay": 1.2 },
  { name: 'Rain', incidents: 5, "Avg Delay": 2.5 },
  { name: 'Wind', incidents: 3, "Avg Delay": 3.1 },
  { name: 'Heat', incidents: 1, "Avg Delay": 1.8 },
  { name: 'Snow', incidents: 2, "Avg Delay": 4.5 },
];


const ChartWrapper: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
        <div className="h-64">
            {children}
        </div>
    </div>
);


const KpiDashboard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ChartWrapper title="On-Time Performance (%)">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={punctualityData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
            <XAxis dataKey="name" stroke="#A0AEC0" />
            <YAxis stroke="#A0AEC0" />
            <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }} />
            <Legend />
            <Bar dataKey="otp" fill="#2DD4BF" name="OTP %" />
          </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>

      <ChartWrapper title="Average Delay (minutes)">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={delayData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
            <XAxis dataKey="name" stroke="#A0AEC0" />
            <YAxis stroke="#A0AEC0" />
            <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }} />
            <Legend />
            <Line type="monotone" dataKey="avgDelay" stroke="#FBBF24" name="Avg Delay" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </ChartWrapper>

        <ChartWrapper title="Network Throughput (Trains/Hour)">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={throughputData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
            <XAxis dataKey="hour" stroke="#A0AEC0" unit=":00"/>
            <YAxis stroke="#A0AEC0" />
            <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }} />
            <Legend />
            <Area type="monotone" dataKey="trains" stroke="#60A5FA" fill="#60A5FA" fillOpacity={0.3} name="Trains" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartWrapper>

      <ChartWrapper title="Weather Impact on Operations">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={weatherImpactData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
            <XAxis dataKey="name" stroke="#A0AEC0" />
            <YAxis yAxisId="left" stroke="#A0AEC0" />
            <YAxis yAxisId="right" orientation="right" stroke="#FBBF24" />
            <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }} />
            <Legend />
            <Bar yAxisId="left" dataKey="incidents" fill="#60A5FA" name="Incidents" />
            <Line yAxisId="right" type="monotone" dataKey="Avg Delay" stroke="#FBBF24" name="Avg Delay (min)" strokeWidth={2} />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartWrapper>
    </div>
  );
};

export default KpiDashboard;