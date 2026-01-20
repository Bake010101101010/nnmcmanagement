import { useState, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import type { Project, Department } from '../../types';
import { projectsApi } from '../../api/projects';
import { useProjectStore } from '../../store/projectStore';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

interface ProjectFormModalProps {
  project?: Project;
  defaultDepartment?: Department;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProjectFormModal({
  project,
  defaultDepartment,
  onClose,
  onSuccess,
}: ProjectFormModalProps) {
  const { t, i18n } = useTranslation();
  const { departments } = useProjectStore();

  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    department: project?.department?.id?.toString() || defaultDepartment?.id?.toString() || '',
    startDate: project?.startDate || '',
    dueDate: project?.dueDate || '',
    priorityLight: project?.priorityLight || 'GREEN',
    status: project?.status || 'ACTIVE',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const data = {
        title: formData.title,
        description: formData.description,
        department: formData.department ? parseInt(formData.department) : undefined,
        startDate: formData.startDate || undefined,
        dueDate: formData.dueDate || undefined,
        priorityLight: formData.priorityLight as 'GREEN' | 'YELLOW' | 'RED',
        status: formData.status as 'ACTIVE' | 'ARCHIVED',
      };

      if (project) {
        await projectsApi.update(project.documentId, data);
      } else {
        await projectsApi.create(data);
      }

      onSuccess();
    } catch (err) {
      setError('Ошибка сохранения проекта');
    } finally {
      setIsLoading(false);
    }
  };

  const getDepartmentName = (dept: { name_ru: string; name_kz: string }) => {
    return i18n.language === 'kz' ? dept.name_kz : dept.name_ru;
  };

  const departmentOptions = departments.map((d) => ({
    value: d.id.toString(),
    label: getDepartmentName(d),
  }));

  const priorityOptions = [
    { value: 'GREEN', label: t('priority.GREEN') },
    { value: 'YELLOW', label: t('priority.YELLOW') },
    { value: 'RED', label: t('priority.RED') },
  ];

  const statusOptions = [
    { value: 'ACTIVE', label: t('status.ACTIVE') },
    { value: 'ARCHIVED', label: t('status.ARCHIVED') },
  ];

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={project ? t('project.editProject') : t('project.createProject')}
      size="lg"
    >
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={t('project.title')}
          value={formData.title}
          onChange={handleChange('title')}
          required
          placeholder="Название проекта"
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('project.description')}
          </label>
          <textarea
            value={formData.description}
            onChange={handleChange('description')}
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Описание проекта..."
          />
        </div>

        <Select
          label={t('project.department')}
          value={formData.department}
          onChange={handleChange('department')}
          options={departmentOptions}
          placeholder="Выберите отдел"
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            type="date"
            label={t('project.startDate')}
            value={formData.startDate}
            onChange={handleChange('startDate')}
          />
          <Input
            type="date"
            label={t('project.dueDate')}
            value={formData.dueDate}
            onChange={handleChange('dueDate')}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label={t('project.priority')}
            value={formData.priorityLight}
            onChange={handleChange('priorityLight')}
            options={priorityOptions}
          />
          <Select
            label={t('project.status')}
            value={formData.status}
            onChange={handleChange('status')}
            options={statusOptions}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" loading={isLoading}>
            {t('common.save')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
