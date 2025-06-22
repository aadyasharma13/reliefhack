"use client"

import { useState } from 'react';
import Layout from '@/components/layout';
import ClientOnlyDate from '@/components/client-only-date';
import Link from 'next/link';
import { 
  Users, 
  Trophy, 
  Heart, 
  Star, 
  TrendingUp, 
  Award,
  MessageCircle,
  Share2,
  Calendar,
  MapPin,
  DollarSign
} from 'lucide-react';

// Mock community data
const mockMembers = [
  {
    id: 1,
    name: 'Alex Johnson',
    avatar: 'AJ',
    role: 'Top Donor',
    totalDonated: 25000,
    eventsParticipated: 8,
    joinDate: '2023-06-15',
    location: 'New York, USA',
    badges: ['gold', 'early-adopter', 'volunteer']
  },
  {
    id: 2,
    name: 'Maria Garcia',
    avatar: 'MG',
    role: 'Volunteer',
    totalDonated: 15000,
    eventsParticipated: 12,
    joinDate: '2023-08-22',
    location: 'Miami, USA',
    badges: ['silver', 'volunteer', 'community-leader']
  },
  {
    id: 3,
    name: 'David Chen',
    avatar: 'DC',
    role: 'Community Leader',
    totalDonated: 18000,
    eventsParticipated: 15,
    joinDate: '2023-05-10',
    location: 'San Francisco, USA',
    badges: ['platinum', 'community-leader', 'early-adopter']
  },
  {
    id: 4,
    name: 'Sarah Williams',
    avatar: 'SW',
    role: 'Donor',
    totalDonated: 8000,
    eventsParticipated: 5,
    joinDate: '2023-09-05',
    location: 'Chicago, USA',
    badges: ['bronze', 'volunteer']
  },
  {
    id: 5,
    name: 'Michael Brown',
    avatar: 'MB',
    role: 'Volunteer',
    totalDonated: 12000,
    eventsParticipated: 10,
    joinDate: '2023-07-18',
    location: 'Los Angeles, USA',
    badges: ['silver', 'volunteer']
  },
  {
    id: 6,
    name: 'Emma Davis',
    avatar: 'ED',
    role: 'Donor',
    totalDonated: 6000,
    eventsParticipated: 3,
    joinDate: '2023-10-12',
    location: 'Seattle, USA',
    badges: ['bronze']
  }
];

const mockRecentActivity = [
  {
    id: 1,
    type: 'donation',
    user: 'Alex Johnson',
    amount: 5000,
    event: 'Hurricane Maria Relief',
    timestamp: '2 hours ago'
  },
  {
    id: 2,
    type: 'volunteer',
    user: 'Maria Garcia',
    event: 'California Wildfire Support',
    timestamp: '4 hours ago'
  },
  {
    id: 3,
    type: 'donation',
    user: 'David Chen',
    amount: 3000,
    event: 'Earthquake Recovery',
    timestamp: '6 hours ago'
  },
  {
    id: 4,
    type: 'join',
    user: 'New Member',
    timestamp: '1 day ago'
  }
];

const getBadgeColor = (badge: string) => {
  switch (badge) {
    case 'gold':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'silver':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    case 'bronze':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    case 'platinum':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    case 'early-adopter':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'volunteer':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'community-leader':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'donation':
      return <Heart className="h-4 w-4 text-red-500" />;
    case 'volunteer':
      return <Users className="h-4 w-4 text-blue-500" />;
    case 'join':
      return <Star className="h-4 w-4 text-yellow-500" />;
    default:
      return <MessageCircle className="h-4 w-4 text-gray-500" />;
  }
};

export default function CommunityPage() {
  const [selectedRole, setSelectedRole] = useState('all');
  const [sortBy, setSortBy] = useState('donations');

  const roles = ['all', 'Top Donor', 'Volunteer', 'Community Leader', 'Donor'];
  const sortOptions = [
    { value: 'donations', label: 'Most Donations' },
    { value: 'events', label: 'Most Events' },
    { value: 'recent', label: 'Recently Joined' }
  ];

  const filteredMembers = mockMembers.filter(member => 
    selectedRole === 'all' || member.role === selectedRole
  );

  const sortedMembers = [...filteredMembers].sort((a, b) => {
    switch (sortBy) {
      case 'donations':
        return b.totalDonated - a.totalDonated;
      case 'events':
        return b.eventsParticipated - a.eventsParticipated;
      case 'recent':
        return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
      default:
        return 0;
    }
  });

  const totalMembers = mockMembers.length;
  const totalDonations = mockMembers.reduce((sum, member) => sum + member.totalDonated, 0);
  const totalEvents = mockMembers.reduce((sum, member) => sum + member.eventsParticipated, 0);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Community</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Connect with fellow disaster relief supporters and volunteers
          </p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Members</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalMembers.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Donations</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${totalDonations.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Events Participated</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalEvents.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Community Members */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Community Members</h2>
                <div className="flex space-x-4">
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {roles.map(role => (
                      <option key={role} value={role}>
                        {role === 'all' ? 'All Roles' : role}
                      </option>
                    ))}
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {sortedMembers.map((member) => (
                  <div key={member.id} className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">{member.avatar}</span>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                          {member.name}
                        </h3>
                        <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-xs font-medium rounded-full">
                          {member.role}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{member.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Joined <ClientOnlyDate dateString={member.joinDate} /></span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-gray-600 dark:text-gray-300">
                          ${member.totalDonated.toLocaleString()} donated
                        </span>
                        <span className="text-gray-600 dark:text-gray-300">
                          {member.eventsParticipated} events
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {member.badges.map((badge) => (
                        <span
                          key={badge}
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getBadgeColor(badge)}`}
                        >
                          {badge.replace('-', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {mockRecentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white">
                        <span className="font-medium">{activity.user}</span>
                        {activity.type === 'donation' && (
                          <> donated <span className="font-medium">${activity.amount?.toLocaleString()}</span> to {activity.event}</>
                        )}
                        {activity.type === 'volunteer' && (
                          <> volunteered for {activity.event}</>
                        )}
                        {activity.type === 'join' && (
                          <> joined the community</>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {activity.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Actions */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Get Involved</h2>
              <div className="space-y-3">
                <Link href="/donate" passHref>
                  <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                    <Heart className="h-5 w-5" />
                    <span>Make a Donation</span>
                  </button>
                </Link>
                <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Users className="h-5 w-5" />
                  <span>Volunteer</span>
                </button>
                <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <MessageCircle className="h-5 w-5" />
                  <span>Join Discussion</span>
                </button>
                <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  <Share2 className="h-5 w-5" />
                  <span>Share ReliefDAO</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 