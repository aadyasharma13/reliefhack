import { DollarSign, Droplets, Users, Zap } from 'lucide-react';

// Helper to shorten wallet addresses
const shortenAddress = (address: string) => `${address.slice(0, 5)}...${address.slice(-5)}`;

// Mock data for dashboard stats
export const stats = [
  { 
    title: 'Total Donations', 
    value: '$3,812,546', 
    icon: DollarSign, 
    change: '+12.5% vs last month',
    changeType: 'increase' 
  },
  { 
    title: 'Active Events', 
    value: '4', 
    icon: Zap,
    change: '+1 since last week',
    changeType: 'increase'
  },
  { 
    title: 'Affected People', 
    value: '12,830', 
    icon: Users,
    change: 'Across all events',
    changeType: 'neutral'
  },
  { 
    title: 'Water Purified', 
    value: '4.2M Liters', 
    icon: Droplets,
    change: 'Sufficient for 1,500 people',
    changeType: 'neutral'
  },
];

// Mock data for active donation events
export const activeEvents = [
  {
    name: 'Hurricane Zeta Relief',
    location: 'Coastal Florida, USA',
    goal: 150000,
    raised: 112500,
    cause: 'A Category 4 hurricane has caused widespread flooding and power outages.',
    endsIn: '6 days'
  },
  {
    name: 'East Asia Earthquake Response',
    location: 'Taiwan Region',
    goal: 250000,
    raised: 180000,
    cause: 'A 7.4 magnitude earthquake has displaced thousands and damaged critical infrastructure.',
    endsIn: '12 days'
  },
  {
    name: 'Sahel Drought Aid',
    location: 'Burkina Faso',
    goal: 100000,
    raised: 45000,
    cause: 'Severe drought conditions threaten food security for over 2 million people.',
    endsIn: '28 days'
  },
    {
    name: 'Amazon Wildfire Recovery',
    location: 'Rondônia, Brazil',
    goal: 75000,
    raised: 68000,
    cause: 'Uncontrolled wildfires have destroyed over 50,000 hectares of rainforest.',
    endsIn: '15 days'
  },
];

// Mock data for the transaction feed
export const transactionFeed = [
  {
    donor: shortenAddress('7m...tA2'),
    token: 'SOL',
    amount: 50,
    usdValue: 7500,
    timestamp: '2m ago',
  },
  {
    donor: shortenAddress('E5...f9B'),
    token: 'USDC',
    amount: 5000,
    usdValue: 5000,
    timestamp: '5m ago',
  },
  {
    donor: shortenAddress('Bq...d8X'),
    token: 'USDT',
    amount: 2500,
    usdValue: 2500,
    timestamp: '1h ago',
  },
  {
    donor: shortenAddress('9z...kQc'),
    token: 'SOL',
    amount: 10,
    usdValue: 1500,
    timestamp: '3h ago',
  },
  {
    donor: shortenAddress('Fx...pL1'),
    token: 'USDC',
    amount: 1000,
    usdValue: 1000,
    timestamp: '8h ago',
  }
];

// Mock data for the token distribution pie chart
export const tokenDistribution = [
  { name: 'USDC', value: 45, fill: '#3b82f6' },
  { name: 'SOL', value: 30, fill: '#8b5cf6' },
  { name: 'USDT', value: 20, fill: '#22c55e' },
  { name: 'Other', value: 5, fill: '#64748b' },
]; 