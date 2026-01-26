import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ClipboardList, Save } from 'lucide-react';
import type { Task } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';

interface TaskModalProps {
  task?: Task;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    title: string;
    description: string;
    status: Task['status'];
    startDate?: string;
    endDate?: string;
  }) => Promise<void>;
  projectDueDate?: string;
}

export default function TaskModal({ task, isOpen, onClose, onSave, projectDueDate }: TaskModalProps) {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Task['status']>('TODO');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);

  const projectDeadline = projectDueDate ? projectDueDate.split('T')[0] : undefined;

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status);
      setStartDate(task.startDate || '');
      setEndDate(task.endDate || '');
    } else {
      setTitle('');
      setDescription('');
      setStatus('TODO');
      setStartDate('');
      setEndDate('');
    }
    setDateError(null);
  }, [task, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (projectDeadline) {
      if ((startDate && startDate > projectDeadline) || (endDate && endDate > projectDeadline)) {
        setDateError('Task dates cannot exceed project deadline.');
        return;
      }
    }

    setDateError(null);
    setIsLoading(true);
    try {
      await onSave({
        title: title.trim(),
        description: description.trim(),
        status,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      onClose();
    } catch (error) {
      console.error('Failed to save task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statusOptions = [
    { value: 'TODO', label: t('task.TODO') },
    { value: 'IN_PROGRESS', label: t('task.IN_PROGRESS') },
    { value: 'DONE', label: t('task.DONE') },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Редактировать задачу' : 'Новая задача'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Название задачи"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Введите название"
          required
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Описание
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Описание задачи (опционально)"
            rows={4}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
          />
        </div>

        {task && (
          <Select
            label="Статус"
            options={statusOptions}
            value={status}
            onChange={(e) => setStatus(e.target.value as Task['status'])}
          />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            type="date"
            label="Дата начала"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              if (dateError) setDateError(null);
            }}
            max={projectDeadline}
          />
          <Input
            type="date"
            label="Дата завершения"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              if (dateError) setDateError(null);
            }}
            max={projectDeadline}
          />
          </div>
          {dateError && (
            <p className="text-sm text-red-600">{dateError}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Отмена
          </Button>
          <Button type="submit" loading={isLoading} icon={<Save className="w-4 h-4" />}>
            {task ? 'Сохранить' : 'Добавить'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
