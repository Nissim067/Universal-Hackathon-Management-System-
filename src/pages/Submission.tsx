import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send } from 'lucide-react';
import Button from '../components/ui/Button';
import { createSubmission } from '../api/submission.api';
import { useUIStore } from '../store/uiStore';
import { isNotEmpty } from '../utils/validators';

export default function Submission() {
  const navigate = useNavigate();
  const { addToast } = useUIStore();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    hackathonId: '', teamId: '', title: '', description: '', projectUrl: '', demoVideoUrl: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isNotEmpty(form.title) || !isNotEmpty(form.hackathonId) || !isNotEmpty(form.teamId)) {
      addToast('Please fill in all required fields', 'error'); return;
    }
    setIsLoading(true);
    try {
      await createSubmission(form);
      addToast('Submission successful!', 'success');
      navigate('/dashboard');
    } catch { addToast('Submission failed', 'error'); }
    finally { setIsLoading(false); }
  }

  const inputClass = 'input-field w-full';

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl font-bold text-text-primary mb-2">Submit Project</h1>
      <p className="text-text-secondary mb-8">Share your work with the world</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6 hover:translate-y-0 hover:shadow-none space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-text-secondary mb-1.5 block">Hackathon ID *</label>
              <input value={form.hackathonId} onChange={(e) => setForm({ ...form, hackathonId: e.target.value })} className={inputClass} placeholder="Hackathon ID" />
            </div>
            <div>
              <label className="text-sm font-medium text-text-secondary mb-1.5 block">Team ID *</label>
              <input value={form.teamId} onChange={(e) => setForm({ ...form, teamId: e.target.value })} className={inputClass} placeholder="Team ID" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-text-secondary mb-1.5 block">Project Title *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} placeholder="My Awesome Project" />
          </div>
          <div>
            <label className="text-sm font-medium text-text-secondary mb-1.5 block">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputClass} min-h-[100px] resize-y`} placeholder="Describe your project..." />
          </div>
          <div>
            <label className="text-sm font-medium text-text-secondary mb-1.5 block">Project URL</label>
            <input value={form.projectUrl} onChange={(e) => setForm({ ...form, projectUrl: e.target.value })} className={inputClass} placeholder="https://github.com/..." />
          </div>
          <div>
            <label className="text-sm font-medium text-text-secondary mb-1.5 block">Demo Video URL</label>
            <input value={form.demoVideoUrl} onChange={(e) => setForm({ ...form, demoVideoUrl: e.target.value })} className={inputClass} placeholder="https://youtube.com/..." />
          </div>
        </div>
        <Button type="submit" size="lg" className="w-full" isLoading={isLoading}><Send size={16} /> Submit Project</Button>
      </form>
    </div>
  );
}
