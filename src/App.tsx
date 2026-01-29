import Board from './components/Board';
import AnalyticsPanel from './components/AnalyticsPanel';
import { LayoutDashboard, Plus, Settings } from 'lucide-react';
import { useState } from 'react';
import TaskForm from './components/TaskForm';
import SettingsForm from './components/SettingsForm';
import { useBoardStore } from './store/useBoardStore';
import type { ColumnId } from './types/kanban';

const App = () => {
  const { editingTask, columns, clearEditingTask } = useBoardStore();
  const [openNewTaskModal, setOpenNewTaskModal] = useState(false);
  const [openSettingsModal, setOpenSettingsModal] = useState(false);

  const selectedTask = editingTask
    ? columns[editingTask.columnId as ColumnId].find(t => t.id === editingTask.taskId)
    : null;

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-slate-900">
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-600 rounded-lg">
            <LayoutDashboard className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Smart Kanban</h1>
        </div>
        <div className='flex items-center gap-4'>
          <button
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors shadow-sm cursor-pointer"
            onClick={() => setOpenSettingsModal(true)}
          >
            <Settings size={18} />
          </button>
          <button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-sm cursor-pointer"
            onClick={() => setOpenNewTaskModal(true)}
          >
            <Plus size={18} />
            <span>New Task</span>
          </button>
        </div>
      </header>

      {openNewTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md animate-in fade-in zoom-in duration-200">
            <TaskForm onClose={() => setOpenNewTaskModal(false)} />
          </div>
        </div>
      )}

      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md animate-in fade-in zoom-in duration-200">
            <TaskForm onClose={clearEditingTask} selectedTask={selectedTask} />
          </div>
        </div>
      )}

      {openSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md animate-in fade-in zoom-in duration-200">
            <SettingsForm onClose={() => setOpenSettingsModal(false)} />
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