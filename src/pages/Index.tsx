import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { AlertCircle, ChevronDown, ChevronUp, PlusCircle, XCircle, Trash2, Sun, Moon, Search, BarChart2, Download, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, LineChart, Line, Legend } from 'recharts';
import Tilt from 'react-parallax-tilt';
import toast, { Toaster } from 'react-hot-toast';

// Types
type Severity = 'Low' | 'Medium' | 'High';
type SortOrder = 'newest' | 'oldest';

interface Incident {
  id: number;
  title: string;
  description: string;
  severity: Severity;
  reportedAt: string;
  type?: string;
}

// Mock Data with Types
const mockIncidents: Incident[] = [
  { id: 1, title: 'Biased Recommendation Algorithm', description: 'Algorithm consistently favored certain demographics...', severity: 'Medium', reportedAt: '2025-03-15T10:00:00Z', type: 'Algorithm' },
  { id: 2, title: 'LLM Hallucination in Critical Info', description: 'LLM provided incorrect safety procedure information...', severity: 'High', reportedAt: '2025-04-01T14:30:00Z', type: 'LLM' },
  { id: 3, title: 'Minor Data Leak via Chatbot', description: 'Chatbot inadvertently exposed non-sensitive user metadata...', severity: 'Low', reportedAt: '2025-03-20T09:15:00Z', type: 'Chatbot' },
  { id: 4, title: 'Autonomous Vehicle Misidentification', description: 'Self-driving car failed to correctly identify a pedestrian...', severity: 'High', reportedAt: '2025-05-10T08:00:00Z', type: 'Autonomous' },
  { id: 5, title: 'Facial Recognition Bias', description: 'System showed lower accuracy for certain demographics...', severity: 'Medium', reportedAt: '2025-02-22T16:45:00Z', type: 'Facial' },
  { id: 6, title: 'Unexpected Medical Diagnosis', description: 'AI model gave inconsistent diagnoses for a rare condition...', severity: 'High', reportedAt: '2025-06-03T11:20:00Z', type: 'Medical' },
  { id: 7, title: 'Deepfake Disinformation Campaign', description: 'AI-generated deepfake used to spread false information...', severity: 'High', reportedAt: '2025-07-18T19:55:00Z', type: 'Deepfake' },
  { id: 8, title: 'Chatbot Misinterpretation', description: 'Chatbot misinterpreted user request and gave irrelevant information.', severity: 'Low', reportedAt: '2025-01-12T13:10:00Z', type: 'Chatbot' },
];

// Animation Variants
const incidentCardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: 'easeInOut', delay: i * 0.1 },
  }),
  exit: { opacity: 0, y: -20, scale: 0.9, transition: { duration: 0.2 } },
};

const detailViewVariants = {
  hidden: { opacity: 0, height: 0, scaleY: 0, originY: 0 },
  visible: { opacity: 1, height: 'auto', scaleY: 1, originY: 0, transition: { duration: 0.4, ease: 'easeInOut' } },
  exit: { opacity: 0, height: 0, scaleY: 0, originY: 0, transition: { duration: 0.3, ease: 'easeInOut' } },
};

// Sub-Components
const IncidentListItem = ({ incident, onDelete, index }: { incident: Incident; onDelete: (id: number) => void; index: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getIcon = (type?: string) => {
    switch (type) {
      case 'Algorithm': return '🧠';
      case 'LLM': return '💬';
      case 'Chatbot': return '🤖';
      case 'Autonomous': return '🚗';
      case 'Facial': return '😊';
      case 'Medical': return '🩺';
      case 'Deepfake': return '🎥';
      default: return '⚠️';
    }
  };

  return (
    <motion.div custom={index} variants={incidentCardVariants} initial="hidden" animate="visible" exit="exit">
      <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} glareEnable={true} glareMaxOpacity={0.3} glareColor="#ffffff" glarePosition="all">
        <Card
          className={cn(
            'group bg-white/10 backdrop-blur-lg border border-white/30 shadow-2xl',
            'transition-all duration-500',
            'hover:shadow-3xl hover:scale-[1.02] hover:border-blue-500/70',
            'overflow-hidden rounded-2xl'
          )}
        >
          <CardHeader className="space-y-2.5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-100 group-hover:text-blue-300 flex items-center gap-2">
                <span>{getIcon(incident.type)}</span> {incident.title}
              </CardTitle>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'text-xs font-medium px-2.5 py-1 rounded-full',
                    incident.severity === 'Low' && 'bg-green-500/20 text-green-300 border border-green-500/30',
                    incident.severity === 'Medium' && 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
                    incident.severity === 'High' && 'bg-red-500/20 text-red-300 border border-red-500/30'
                  )}
                >
                  {incident.severity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-gray-400 hover:text-blue-300 rounded-full group-hover:bg-white/20"
                >
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(incident.id)}
                  className="text-red-400 hover:text-red-300 rounded-full group-hover:bg-red-500/20"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
            <CardDescription className="text-gray-400 text-sm">
              Reported: {new Date(incident.reportedAt).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <AnimatePresence>
            {isExpanded && (
              <motion.div variants={detailViewVariants} initial="hidden" animate="visible" exit="exit" className="overflow-hidden">
                <CardContent className="pt-0">
                  <p className="text-gray-300 whitespace-pre-line leading-relaxed">{incident.description}</p>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </Tilt>
    </motion.div>
  );
};

const IncidentForm = ({ onSubmit }: { onSubmit: (incident: Omit<Incident, 'id' | 'reportedAt'>) => void }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<Severity>('Low');
  const [type, setType] = useState<string>('Algorithm');
  const [formErrors, setFormErrors] = useState<{ title?: string; description?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const errors: { title?: string; description?: string } = {};
    if (!title.trim()) errors.title = 'Title is required';
    if (!description.trim()) errors.description = 'Description is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSubmit({ title, description, severity, type });
      toast.success('Incident reported successfully!', { style: { background: '#1F2937', color: '#F3F4F6' } });
      setTitle('');
      setDescription('');
      setSeverity('Low');
      setType('Algorithm');
      setFormErrors({});
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium text-gray-200">
          Title <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter incident title"
          className={cn(
            'bg-black/20 text-white border-gray-700 placeholder:text-gray-400',
            formErrors.title && 'border-red-500 focus:ring-red-500 focus:border-red-500'
          )}
          disabled={isSubmitting}
        />
        {formErrors.title && (
          <p className="text-red-400 text-sm flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {formErrors.title}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium text-gray-200">
          Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter incident description"
          className={cn(
            'bg-black/20 text-white border-gray-700 placeholder:text-gray-400 min-h-[120px] resize-y',
            formErrors.description && 'border-red-500 focus:ring-red-500 focus:border-red-500'
          )}
          disabled={isSubmitting}
        />
        {formErrors.description && (
          <p className="text-red-400 text-sm flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {formErrors.description}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="type" className="text-sm font-medium text-gray-200">
          Incident Type <span className="text-red-500">*</span>
        </Label>
        <Select value={type} onValueChange={setType} disabled={isSubmitting}>
          <SelectTrigger className="bg-black/20 text-white border-gray-700">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-700">
            {['Algorithm', 'LLM', 'Chatbot', 'Autonomous', 'Facial', 'Medical', 'Deepfake'].map(t => (
              <SelectItem key={t} value={t} className="hover:bg-gray-800 text-gray-300">{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="severity" className="text-sm font-medium text-gray-200">
          Severity <span className="text-red-500">*</span>
        </Label>
        <Select value={severity} onValueChange={(value) => setSeverity(value as Severity)} disabled={isSubmitting}>
          <SelectTrigger className="bg-black/20 text-white border-gray-700">
            <SelectValue placeholder="Select severity" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-700">
            <SelectItem value="Low" className="hover:bg-gray-800 text-gray-300">Low</SelectItem>
            <SelectItem value="Medium" className="hover:bg-gray-800 text-gray-300">Medium</SelectItem>
            <SelectItem value="High" className="hover:bg-gray-800 text-gray-300">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button
        type="submit"
        className={cn(
          'w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white',
          'hover:from-blue-600 hover:to-purple-600',
          'transition-all duration-300',
          'shadow-lg hover:shadow-xl',
          'py-3 text-lg font-semibold',
          isSubmitting && 'opacity-70 cursor-not-allowed'
        )}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Reporting...
          </>
        ) : (
          'Report Incident'
        )}
      </Button>
    </form>
  );
};

const IncidentHeatmap = ({ incidents }: { incidents: Incident[] }) => {
  const data = useMemo(() => {
    const grouped = incidents.reduce((acc, incident) => {
      const date = new Date(incident.reportedAt).toLocaleString('default', { month: 'short', year: 'numeric' });
      acc[date] = acc[date] || { date, Low: 0, Medium: 0, High: 0 };
      acc[date][incident.severity]++;
      return acc;
    }, {} as Record<string, { date: string; Low: number; Medium: number; High: number }>);
    return Object.values(grouped).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [incidents]);

  return (
    <Card className="bg-white/10 backdrop-blur-lg border border-white/30 shadow-2xl rounded-2xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-200">Incident Heatmap</CardTitle>
        <CardDescription className="text-gray-400">Incidents by severity over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <XAxis dataKey="date" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip contentStyle={{ background: '#1F2937', border: 'none', color: '#F3F4F6' }} />
            <Bar dataKey="Low" stackId="a" fill="#34D399" />
            <Bar dataKey="Medium" stackId="a" fill="#FBBF24" />
            <Bar dataKey="High" stackId="a" fill="#EF4444" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const IncidentTimeline = ({ incidents }: { incidents: Incident[] }) => {
  const timelineData = useMemo(() => {
    return incidents
      .sort((a, b) => new Date(a.reportedAt).getTime() - new Date(b.reportedAt).getTime())
      .map(incident => ({
        date: new Date(incident.reportedAt).toLocaleDateString(),
        title: incident.title,
        severity: incident.severity,
      }));
  }, [incidents]);

  return (
    <Card className="bg-white/10 backdrop-blur-lg border border-white/30 shadow-2xl rounded-2xl max-h-96 overflow-y-auto">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-200">Incident Timeline</CardTitle>
        <CardDescription className="text-gray-400">Chronological view of incidents</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {timelineData.map((item, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className={cn(
                'w-3 h-3 rounded-full mt-1.5',
                item.severity === 'Low' && 'bg-green-500',
                item.severity === 'Medium' && 'bg-yellow-500',
                item.severity === 'High' && 'bg-red-500'
              )} />
              <div>
                <p className="text-sm font-medium text-gray-200">{item.date}</p>
                <p className="text-sm text-gray-400">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const SeverityTrend = ({ incidents }: { incidents: Incident[] }) => {
  const data = useMemo(() => {
    const grouped = incidents.reduce((acc, incident) => {
      const date = new Date(incident.reportedAt).toLocaleString('default', { month: 'short', year: 'numeric' });
      acc[date] = acc[date] || { date, Low: 0, Medium: 0, High: 0 };
      acc[date][incident.severity]++;
      return acc;
    }, {} as Record<string, { date: string; Low: number; Medium: number; High: number }>);
    return Object.values(grouped).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [incidents]);

  return (
    <Card className="bg-white/10 backdrop-blur-lg border border-white/30 shadow-2xl rounded-2xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-200">Severity Trend</CardTitle>
        <CardDescription className="text-gray-400">Trend of incident severities over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <XAxis dataKey="date" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip contentStyle={{ background: '#1F2937', border: 'none', color: '#F3F4F6' }} />
            <Legend />
            <Line type="monotone" dataKey="Low" stroke="#34D399" />
            <Line type="monotone" dataKey="Medium" stroke="#FBBF24" />
            <Line type="monotone" dataKey="High" stroke="#EF4444" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const QuickStats = ({ incidents, safetyScore }: { incidents: Incident[]; safetyScore: number }) => {
  const stats = useMemo(() => ({
    total: incidents.length,
    low: incidents.filter(i => i.severity === 'Low').length,
    medium: incidents.filter(i => i.severity === 'Medium').length,
    high: incidents.filter(i => i.severity === 'High').length,
    recent: incidents.filter(i => new Date(i.reportedAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length,
  }), [incidents]);

  return (
    <Card className="bg-white/10 backdrop-blur-lg border border-white/30 shadow-2xl rounded-2xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-200">Quick Stats</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-300">{stats.total}</p>
          <p className="text-sm text-gray-400">Total Incidents</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-300">{stats.low}</p>
          <p className="text-sm text-gray-400">Low Severity</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-yellow-300">{stats.medium}</p>
          <p className="text-sm text-gray-400">Medium Severity</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-red-300">{stats.high}</p>
          <p className="text-sm text-gray-400">High Severity</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-300">{stats.recent}</p>
          <p className="text-sm text-gray-400">Last 30 Days</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-yellow-400">{safetyScore}</p>
          <p className="text-sm text-gray-400">Safety Score</p>
        </div>
      </CardContent>
    </Card>
  );
};

const AIInsights = () => {
  return (
    <Card className="bg-white/10 backdrop-blur-lg border border-white/30 shadow-2xl rounded-2xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-200">AI Insights</CardTitle>
        <CardDescription className="text-gray-400">Generated insights on incident patterns</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-gray-300 text-sm">
          <li className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400" />
            High-severity incidents increased by 20% in Q2 2025.
          </li>
          <li className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400" />
            Chatbot-related issues are the most frequent low-severity incidents.
          </li>
          <li className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400" />
            Autonomous vehicle incidents peak in spring months.
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

const WelcomeModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-gray-800 border border-white/20 p-6 rounded-lg shadow-xl max-w-md w-full"
      >
        <h3 className="text-2xl font-semibold text-gray-200 mb-4">Welcome to the AI Safety Dashboard!</h3>
        <p className="text-gray-400 mb-6">
          Explore incidents, report new issues, and gain insights with our interactive tools. Use the timeline, heatmap, and filters to stay informed.
        </p>
        <Button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
        >
          Get Started
        </Button>
      </motion.div>
    </motion.div>
  );
};

// Main Component
export default function Index() {
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [selectedSeverity, setSelectedSeverity] = useState<Severity | 'All'>('All');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [isReportingFormVisible, setIsReportingFormVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [safetyScore, setSafetyScore] = useState(50);
  const incidentsPerPage = 5;

  // Persistent State
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (savedTheme) setTheme(savedTheme);
    const savedFilters = localStorage.getItem('filters');
    if (savedFilters) {
      const { severity, sort, search } = JSON.parse(savedFilters);
      setSelectedSeverity(severity);
      setSortOrder(sort);
      setSearchQuery(search);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    localStorage.setItem('filters', JSON.stringify({ severity: selectedSeverity, sort: sortOrder, search: searchQuery }));
  }, [theme, selectedSeverity, sortOrder, searchQuery]);

  const filteredAndSortedIncidents = useMemo(() => {
    return incidents
      .filter(incident =>
        (selectedSeverity === 'All' || incident.severity === selectedSeverity) &&
        (incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
         incident.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      .sort((a, b) => {
        const dateA = new Date(a.reportedAt).getTime();
        const dateB = new Date(b.reportedAt).getTime();
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
      });
  }, [incidents, selectedSeverity, sortOrder, searchQuery]);

  const paginatedIncidents = useMemo(() => {
    const start = (currentPage - 1) * incidentsPerPage;
    return filteredAndSortedIncidents.slice(start, start + incidentsPerPage);
  }, [filteredAndSortedIncidents, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedIncidents.length / incidentsPerPage);

  const handleNewIncident = (newIncident: Omit<Incident, 'id' | 'reportedAt'>) => {
    const incident: Incident = {
      ...newIncident,
      id: incidents.length > 0 ? Math.max(...incidents.map(i => i.id)) + 1 : 1,
      reportedAt: new Date().toISOString(),
    };
    setIncidents(prev => [incident, ...prev]);
    setIsReportingFormVisible(false);
    setSafetyScore(prev => Math.min(prev + 5, 100));
  };

  const handleDeleteIncident = (id: number) => {
    setIncidents(prev => prev.filter(incident => incident.id !== id));
    setDeleteConfirmId(null);
    toast.success('Incident deleted successfully!', { style: { background: '#1F2937', color: '#F3F4F6' } });
  };

  const handleClearFilters = () => {
    setSelectedSeverity('All');
    setSortOrder('newest');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Title', 'Description', 'Severity', 'Reported At', 'Type'];
    const rows = incidents.map(incident => [
      incident.id,
      `"${incident.title.replace(/"/g, '""')}"`,
      `"${incident.description.replace(/"/g, '""')}"`,
      incident.severity,
      incident.reportedAt,
      incident.type || '',
    ]);
    const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'incidents.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Incidents exported as CSV!', { style: { background: '#1F2937', color: '#F3F4F6' } });
  };

  return (
    <div className={cn(
      'min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black animate-gradient-x p-4 md:p-6 lg:p-8 relative overflow-hidden',
      theme === 'light' && 'bg-gradient-to-br from-gray-100 via-blue-100 to-white'
    )}>
      <style>
        {`
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient 15s ease infinite;
          }
          .particle {
            position: absolute;
            border-radius: 50%;
            animation: float 10s infinite ease-in-out;
          }
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
        `}
      </style>
      {theme === 'dark' && Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            background: `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
      <Toaster />
      <div className="container mx-auto py-8 space-y-8 relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="text-center flex-1">
            <h1 className={cn(
              'text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text',
              theme === 'dark' ? 'bg-gradient-to-r from-red-400 to-yellow-400' : 'bg-gradient-to-r from-blue-600 to-purple-600'
            )}>
              AI Safety Incident Dashboard
            </h1>
            <p className={cn(
              'text-lg max-w-2xl mx-auto mt-2',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              Empowering a safer AI future through real-time tracking and insights.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img src="https://avatar-placeholder.com" alt="User" className="w-8 h-8 rounded-full" />
              <span className={cn(theme === 'dark' ? 'text-gray-200' : 'text-gray-800')}>Safety Officer</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={cn(
                'rounded-full',
                theme === 'dark' ? 'text-yellow-300 hover:bg-yellow-500/20' : 'text-gray-600 hover:bg-gray-200'
              )}
            >
              {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Stats and Visualizations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <QuickStats incidents={incidents} safetyScore={safetyScore} />
          <IncidentHeatmap incidents={incidents} />
          <SeverityTrend incidents={incidents} />
          <AIInsights />
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="w-full sm:w-56">
              <span className={cn('block text-sm font-medium mb-2', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
                Filter by Severity:
              </span>
              <Select value={selectedSeverity} onValueChange={(value) => setSelectedSeverity(value as Severity | 'All')}>
                <SelectTrigger className={cn(
                  'rounded-full',
                  theme === 'dark' ? 'bg-black/20 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-300'
                )}>
                  <SelectValue placeholder="All Severities" />
                </SelectTrigger>
                <SelectContent className={cn(theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300')}>
                  <SelectItem value="All" className={cn(theme === 'dark' ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-900')}>
                    All Severities
                  </SelectItem>
                  <SelectItem value="Low" className={cn(theme === 'dark' ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-900')}>
                    Low
                  </SelectItem>
                  <SelectItem value="Medium" className={cn(theme === 'dark' ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-900')}>
                    Medium
                  </SelectItem>
                  <SelectItem value="High" className={cn(theme === 'dark' ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-900')}>
                    High
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-56">
              <span className={cn('block text-sm font-medium mb-2', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
                Sort by Date:
              </span>
              <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as SortOrder)}>
                <SelectTrigger className={cn(
                  'rounded-full',
                  theme === 'dark' ? 'bg-black/20 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-300'
                )}>
                  <SelectValue placeholder="Newest First" />
                </SelectTrigger>
                <SelectContent className={cn(theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300')}>
                  <SelectItem value="newest" className={cn(theme === 'dark' ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-900')}>
                    Newest First
                  </SelectItem>
                  <SelectItem value="oldest" className={cn(theme === 'dark' ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-900')}>
                    Oldest First
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="flex-1">
              <span className={cn('block text-sm font-medium mb-2', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
                Search:
              </span>
              <div className="relative">
                <Search className={cn(
                  'absolute left-3 top-1/2 transform -translate-y-1/2',
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                )} />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search incidents..."
                  className={cn(
                    'pl-10 rounded-full',
                    theme === 'dark' ? 'bg-black/20 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-300'
                  )}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button
                onClick={handleClearFilters}
                className={cn(
                  'rounded-full',
                  theme === 'dark' ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30' : 'bg-red-100 text-red-600 hover:bg-red-200'
                )}
              >
                Clear Filters
              </Button>
              <Button
                onClick={handleExportCSV}
                className={cn(
                  'rounded-full',
                  theme === 'dark' ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30' : 'bg-green-100 text-green-600 hover:bg-green-200'
                )}
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Incident List and Timeline */}
          <div className="lg:col-span-3 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <IncidentTimeline incidents={incidents} />
                <Card className={cn(
                  'bg-white/10 backdrop-blur-lg border border-white/30 shadow-2xl rounded-2xl',
                  theme === 'light' && 'bg-white/80 border-gray-200'
                )}>
                  <CardHeader>
                    <CardTitle className={cn('text-lg font-semibold', theme === 'dark' ? 'text-gray-200' : 'text-gray-800')}>
                      Incident List
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <AnimatePresence>
                      {paginatedIncidents.map((incident, index) => (
                        <IncidentListItem
                          key={incident.id}
                          incident={incident}
                          onDelete={() => setDeleteConfirmId(incident.id)}
                          index={index}
                        />
                      ))}
                    </AnimatePresence>
                    {filteredAndSortedIncidents.length === 0 && (
                      <div className={cn(
                        'text-center py-8 px-4 rounded-lg',
                        theme === 'dark' ? 'bg-white/5 backdrop-blur-md border border-white/10' : 'bg-white border border-gray-200'
                      )}>
                        <p className={cn(theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                          No incidents found matching the selected filters.
                        </p>
                      </div>
                    )}
                  </CardContent>
                  {totalPages > 1 && (
                    <CardFooter className="flex justify-between items-center">
                      <Button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={cn(
                          'rounded-full',
                          theme === 'dark' ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                        )}
                      >
                        Previous
                      </Button>
                      <span className={cn(theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={cn(
                          'rounded-full',
                          theme === 'dark' ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                        )}
                      >
                        Next
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              </div>
            </motion.div>
          </div>

          {/* Incident Form */}
          <div className="lg:col-span-1">
            <AnimatePresence>
              {isReportingFormVisible && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className={cn(
                    'bg-white/10 backdrop-blur-lg border border-white/30 rounded-2xl shadow-2xl p-6 sticky top-6',
                    theme === 'light' && 'bg-white/80 border-gray-200'
                  )}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className={cn(
                      'text-2xl font-semibold flex items-center gap-2',
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                    )}>
                      <PlusCircle className={cn('w-6 h-6', theme === 'dark' ? 'text-blue-400' : 'text-blue-600')} />
                      Report a New Incident
                    </h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsReportingFormVisible(false)}
                      className={cn(theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800')}
                    >
                      <XCircle className="w-6 h-6" />
                    </Button>
                  </div>
                  <IncidentForm onSubmit={handleNewIncident} />
                </motion.div>
              )}
            </AnimatePresence>
            {!isReportingFormVisible && (
              <Button
                onClick={() => setIsReportingFormVisible(true)}
                className={cn(
                  'w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white',
                  'hover:from-blue-600 hover:to-purple-600',
                  'transition-all duration-300',
                  'shadow-lg hover:shadow-xl',
                  'py-3 text-lg font-semibold rounded-2xl'
                )}
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Report New Incident
              </Button>
            )}
          </div>
        </div>

        {/* Modals */}
        <AnimatePresence>
          {deleteConfirmId !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className={cn('p-6 rounded-lg shadow-xl', theme === 'dark' ? 'bg-gray-800 border border-white/20' : 'bg-white border border-gray-200')}
              >
                <h3 className={cn('text-lg font-semibold mb-4', theme === 'dark' ? 'text-gray-200' : 'text-gray-800')}>
                  Confirm Deletion
                </h3>
                <p className={cn('mb-6', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                  Are you sure you want to delete this incident?
                </p>
                <div className="flex justify-end gap-4">
                  <Button
                    onClick={() => setDeleteConfirmId(null)}
                    className={cn(theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleDeleteIncident(deleteConfirmId)}
                    className="bg-red-500 text-white hover:bg-red-600"
                  >
                    Delete
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
          {showWelcomeModal && (
            <WelcomeModal onClose={() => setShowWelcomeModal(false)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}