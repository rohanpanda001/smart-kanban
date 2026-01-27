import Board from './components/Board';
import AnalyticsPanel from './components/AnalyticsPanel';
import { LayoutDashboard, Plus } from 'lucide-react';
import { useState } from 'react';
import CreateTaskForm from './components/CreateTaskForm';

const App = () => {
  const [openNewTaskModal, setOpenNewTaskModal] = useState(false);
  return (
    <div className="flex flex-col h-screen bg-gray-50 text-slate-900">
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-600 rounded-lg">
            <LayoutDashboard className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Smart Kanban</h1>
        </div>
        <button
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-sm"
          onClick={() => setOpenNewTaskModal(true)}
        >
          <Plus size={18} />
          <span>New Task</span>
        </button>
      </header>

      {openNewTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md animate-in fade-in zoom-in duration-200">
            <CreateTaskForm onClose={() => setOpenNewTaskModal(false)} />
          </div>
        </div>
      )}

      <main className="flex flex-1 overflow-hidden">
        <section className="flex-1 overflow-x-auto">
          <Board />
        </section>
        <AnalyticsPanel />
      </main>
    </div>
  );
};

export default App;