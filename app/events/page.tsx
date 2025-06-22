"use client"

import { useState } from 'react';
import Layout from '@/components/layout';
import { 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Heart
} from 'lucide-react';
import ClientOnlyDate from '@/components/client-only-date';
import Link from 'next/link';

// Mock events data
const mockEvents = [
  {
    id: 1,
    name: 'Hurricane Maria Relief',
    location: 'Puerto Rico',
    date: '2024-01-15',
    status: 'active',
    raised: 125000,
    goal: 200000,
    donors: 342,
    description: 'Emergency relief for communities affected by Hurricane Maria',
    category: 'hurricane'
  },
  {
    id: 2,
    name: 'California Wildfire Support',
    location: 'California, USA',
    date: '2024-01-10',
    status: 'completed',
    raised: 180000,
    goal: 150000,
    donors: 567,
    description: 'Support for families displaced by recent wildfires',
    category: 'wildfire'
  },
  {
    id: 3,
    name: 'Earthquake Recovery',
    location: 'Turkey',
    date: '2024-01-05',
    status: 'active',
    raised: 75000,
    goal: 300000,
    donors: 189,
    description: 'Recovery efforts for earthquake-affected regions',
    category: 'earthquake'
  },
  {
    id: 4,
    name: 'Flood Relief Program',
    location: 'Bangladesh',
    date: '2024-01-20',
    status: 'pending',
    raised: 0,
    goal: 100000,
    donors: 0,
    description: 'Emergency response for monsoon flooding',
    category: 'flood'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'completed':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active':
      return <TrendingUp className="h-4 w-4" />;
    case 'completed':
      return <CheckCircle className="h-4 w-4" />;
    case 'pending':
      return <Clock className="h-4 w-4" />;
    default:
      return <AlertTriangle className="h-4 w-4" />;
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'hurricane':
      return '🌪️';
    case 'wildfire':
      return '🔥';
    case 'earthquake':
      return '🌋';
    case 'flood':
      return '🌊';
    default:
      return '⚠️';
  }
};

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const categories = ['all', 'hurricane', 'wildfire', 'earthquake', 'flood'];
  const statuses = ['all', 'active', 'completed', 'pending'];

  const filteredEvents = mockEvents.filter(event => {
    const categoryMatch = selectedCategory === 'all' || event.category === selectedCategory;
    const statusMatch = selectedStatus === 'all' || event.status === selectedStatus;
    return categoryMatch && statusMatch;
  });

  const totalRaised = mockEvents.reduce((sum, event) => sum + event.raised, 0);
  const totalDonors = mockEvents.reduce((sum, event) => sum + event.donors, 0);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Disaster Events</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track ongoing and completed disaster relief efforts
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Raised</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${totalRaised.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Donors</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalDonors.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Events</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {mockEvents.filter(e => e.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredEvents.map((event) => {
            const progress = (event.raised / event.goal) * 100;
            
            return (
              <div key={event.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getCategoryIcon(event.category)}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {event.name}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(event.status)}`}>
                      {getStatusIcon(event.status)}
                      <span>{event.status.charAt(0).toUpperCase() + event.status.slice(1)}</span>
                    </span>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {event.description}
                  </p>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Progress</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {progress.toFixed(1)}%
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">
                        ${event.raised.toLocaleString()} raised
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        Goal: ${event.goal.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{event.donors} donors</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <ClientOnlyDate dateString={event.date} />
                        </div>
                      </div>
                      
                      <Link href="/donate" passHref>
                        <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                          <Heart className="h-4 w-4" />
                          <span>Donate</span>
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No events found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your filters to see more events.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
} 