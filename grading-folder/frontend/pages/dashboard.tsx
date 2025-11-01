import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from '@/components/layout/Navbar';
import TaskList from '@/components/tasks/TaskList';
import TaskFilter from '@/components/tasks/TaskFilter';
import TaskForm from '@/components/tasks/TaskForm';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/axios';
import { Task } from '@/lib/types';
import { getSocket } from '@/lib/socket';
import toast from 'react-hot-toast';

function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    assignedTo: '',
    search: ''
  });

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tasks');
      setTasks(response.data.data);
      setFilteredTasks(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();

    // Listen for real-time updates
    const socket = getSocket();
    if (socket) {
      socket.on('task-updated', (updatedTask: Task) => {
        setTasks(prev => prev.map(t => t._id === updatedTask._id ? updatedTask : t));
        setFilteredTasks(prev => prev.map(t => t._id === updatedTask._id ? updatedTask : t));
      });

      socket.on('task-deleted', (data: { id: string }) => {
        setTasks(prev => prev.filter(t => t._id !== data.id));
        setFilteredTasks(prev => prev.filter(t => t._id !== data.id));
      });
    }

    return () => {
      if (socket) {
        socket.off('task-updated');
        socket.off('task-deleted');
      }
    };
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...tasks];

    if (filters.status) {
      result = result.filter(t => t.status === filters.status);
    }
    if (filters.priority) {
      result = result.filter(t => t.priority === filters.priority);
    }
    if (filters.assignedTo) {
      result = result.filter(t => t.assignedTo?._id === filters.assignedTo);
    }
    if (filters.search) {
      result = result.filter(t =>
        t.title.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredTasks(result);
  }, [filters, tasks]);

  const handleTaskCreated = (newTask: Task) => {
    setTasks(prev => [newTask, ...prev]);
    setShowTaskForm(false);
    toast.success('Task created successfully!');
  };

  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  return (
    <>
      <Head>
        <title>Dashboard - TaskFlow</title>
      </Head>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600 mt-1">Here's what's happening with your tasks today.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <p className="text-sm text-gray-600">Total Tasks</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-600">To Do</p>
              <p className="text-3xl font-bold text-gray-600">{stats.todo}</p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Tasks</h2>
            <button
              onClick={() => setShowTaskForm(!showTaskForm)}
              className="btn-primary"
            >
              {showTaskForm ? 'Cancel' : '+ New Task'}
            </button>
          </div>

          {/* Task Form */}
          {showTaskForm && (
            <div className="mb-6 animate-slide-up">
              <TaskForm onTaskCreated={handleTaskCreated} />
            </div>
          )}

          {/* Filters */}
          <TaskFilter filters={filters} setFilters={setFilters} />

          {/* Task List */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="spinner"></div>
            </div>
          ) : (
            <TaskList tasks={filteredTasks} onTaskUpdate={fetchTasks} />
          )}
        </main>
      </div>
    </>
  );
}

export default ProtectedRoute(Dashboard);