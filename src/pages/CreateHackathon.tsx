import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X } from 'lucide-react';
import Button from '../components/ui/Button';
import { createHackathon } from '../api/hackathon.api';
import { useUIStore } from '../store/uiStore';
import { isNotEmpty } from '../utils/validators';

export default function CreateHackathon() {
  const navigate = useNavigate();
  const { addToast } = useUIStore();
  const [isLoading, setIsLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [form, setForm] = useState({
    title: '', description: '', startDate: '', endDate: '',
    prizePool: 0, registrationFee: 0, tags: [] as string[], coverImage: '',
  });

  function addTag() {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      setForm((f) => ({ ...f, tags: [...f.tags, tag] }));
      setTagInput('');
    }
  }

  function removeTag(tag: string) {
    setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isNotEmpty(form.title)) { addToast('Title is required', 'error'); return; }
    if (!form.startDate || !form.endDate) { addToast('Dates are required', 'error'); return; }

    setIsLoading(true);
    try {
      const h = await createHackathon({ ...form, prizePool: Number(form.prizePool), registrationFee: Number(form.registrationFee) });
      addToast('Hackathon created!', 'success');
      navigate(`/hackathon/${h.id}`);
    } catch { addToast('Failed to create hackathon', 'error'); }
    finally { setIsLoading(false); }
  }

  const inputClass = 'input-field w-full';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary mb-6">
        <ArrowLeft size={16} /> Back
      </button>
      <h1 className="font-display text-3xl font-bold text-text-primary mb-2">Create Hackathon</h1>
      <p className="text-text-secondary mb-8">Set up your hackathon and start accepting participants</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6 hover:translate-y-0 hover:shadow-none space-y-5">
          <div>
            <label className="text-sm font-medium text-text-secondary mb-1.5 block">Title *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} placeholder="My Amazing Hackathon" />
          </div>
          <div>
            <label className="text-sm font-medium text-text-secondary mb-1.5 block">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputClass} min-h-[120px] resize-y`} placeholder="Describe your hackathon..." />
          </div>
          <div>
            <label className="text-sm font-medium text-text-secondary mb-1.5 block">Cover Image URL</label>
            <input value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} className={inputClass} placeholder="https://..." />
          </div>
        </div>

        <div className="card p-6 hover:translate-y-0 hover:shadow-none space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-text-secondary mb-1.5 block">Start Date *</label>
              <input type="datetime-local" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-medium text-text-secondary mb-1.5 block">End Date *</label>
              <input type="datetime-local" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-text-secondary mb-1.5 block">Prize Pool (₹)</label>
              <input type="number" min={0} value={form.prizePool} onChange={(e) => setForm({ ...form, prizePool: Number(e.target.value) })} className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-medium text-text-secondary mb-1.5 block">Registration Fee (₹)</label>
              <input type="number" min={0} value={form.registrationFee} onChange={(e) => setForm({ ...form, registrationFee: Number(e.target.value) })} className={inputClass} />
            </div>
          </div>
        </div>

        <div className="card p-6 hover:translate-y-0 hover:shadow-none">
          <label className="text-sm font-medium text-text-secondary mb-1.5 block">Tags</label>
          <div className="flex gap-2 mb-3">
            <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }} className={`${inputClass} flex-1`} placeholder="Add a tag..." />
            <Button type="button" variant="secondary" size="sm" onClick={addTag}><Plus size={14} /></Button>
          </div>
          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-accent/10 text-accent border border-accent/20">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-danger"><X size={12} /></button>
                </span>
              ))}
            </div>
          )}
        </div>

        <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>Create Hackathon</Button>
      </form>
    </div>
  );
}
