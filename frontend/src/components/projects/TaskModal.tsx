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
  onSave: (data: { title: string; description: string; status: Task['status'] }) => Promise<void>;
}

export default function TaskModal({ task, isOpen, onClose, onSave }: TaskModalProps) {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Task['status']>('TODO');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status);
    } else {
      setTitle('');
      setDescription('');
      setStatus('TODO');
    }
  }, [task, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      await onSave({ title: title.trim(), description: description.trim(), status });
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
      title={
        <span className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-primary-500" />
          {task ? 'Редактировать задачу' : 'Новая задача'}
        </span>
      }
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
