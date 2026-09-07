import React, { useEffect, useState } from 'react';
import { 
  Star, 
  MessageSquare, 
  Eye, 
  EyeOff, 
  Trash2, 
  Filter, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Lightbulb,
  MessageCircleQuestion,
  User,
  ExternalLink
} from 'lucide-react';
import { api } from '../../lib/auth';

interface FeedbackItem {
  id: string;
  userId?: string;
  userName: string;
  userEmail?: string;
  userRole?: string;
  userAvatar?: string;
  rating: number;
  category: 'REVIEW' | 'SUGGESTION' | 'CRITIQUE';
  message: string;
  isPublished: boolean;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    institution?: string;
    avatarUrl?: string;
    plan: string;
  };
}

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    fiveStar: 0,
    published: 0,
    suggestions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRating, setFilterRating] = useState('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterPublished, setFilterPublished] = useState('ALL');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchFeedbacks = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (filterRating !== 'ALL') params.append('rating', filterRating);
    if (filterCategory !== 'ALL') params.append('category', filterCategory);
    if (filterPublished !== 'ALL') params.append('published', filterPublished);

    api(`/admin/feedbacks?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setFeedbacks(data.data);
          if (data.stats) setStats(data.stats);
        }
      })
      .catch(err => console.error('Error fetching feedbacks:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [filterRating, filterCategory, filterPublished]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFeedbacks();
  };

  const handleTogglePublish = async (item: FeedbackItem) => {
    if (item.rating !== 5 && !item.isPublished) {
      setAlertMsg({
        type: 'error',
        text: 'Hanya penilaian dengan bintang 5 penuh yang diizinkan untuk ditampilkan di Landing Page.',
      });
      return;
    }

    setActionLoadingId(item.id);
    setAlertMsg(null);

    try {
      const res = await api(`/admin/feedbacks/${item.id}/publish`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !item.isPublished }),
      });
      const data = await res.json();
      if (data.success) {
        setAlertMsg({ type: 'success', text: data.message });
        setFeedbacks(prev =>
          prev.map(f => (f.id === item.id ? { ...f, isPublished: !item.isPublished } : f))
        );
        setStats(prev => ({
          ...prev,
          published: item.isPublished ? prev.published - 1 : prev.published + 1,
        }));
      } else {
        setAlertMsg({ type: 'error', text: data.message || 'Gagal mengubah status publikasi.' });
      }
    } catch (err: any) {
      setAlertMsg({ type: 'error', text: err.message || 'Terjadi kesalahan sistem.' });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus kritik/saran ini secara permanen?')) return;

    setActionLoadingId(id);
    try {
      const res = await api(`/admin/feedbacks/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setAlertMsg({ type: 'success', text: 'Kritik/saran berhasil dihapus.' });
        setFeedbacks(prev => prev.filter(f => f.id !== id));
        setStats(prev => ({ ...prev, total: Math.max(0, prev.total - 1) }));
      } else {
        setAlertMsg({ type: 'error', text: data.message || 'Gagal menghapus item.' });
      }
    } catch (err: any) {
      setAlertMsg({ type: 'error', text: err.message || 'Terjadi kesalahan sistem.' });
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <MessageSquare className="w-6 h-6 text-emerald-400" />
            Kritik, Saran & Ulasan Pengguna
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Kelola masukan pengguna dan atur ulasan bintang 5 yang ditampilkan pada Landing Page.
          </p>
        </div>
        <a
          href="/landing#testimoni"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors w-fit"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Lihat Landing Page
        </a>
      </div>

      {/* Alert Notification */}
      {alertMsg && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between gap-3 ${
            alertMsg.type === 'success'
              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/15 border border-red-500/30 text-red-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {alertMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            )}
            <span>{alertMsg.text}</span>
          </div>
          <button
            onClick={() => setAlertMsg(null)}
            className="text-slate-400 hover:text-white text-xs px-2 py-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Total Masukan</span>
            <MessageSquare className="w-4 h-4 text-slate-500" />
          </div>
          <p className="text-2xl font-black text-white mt-2">{stats.total}</p>
          <span className="text-[10px] text-slate-500">Kritik, saran & ulasan</span>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-amber-400 text-xs font-medium">
            <span>Bintang 5 Penuh</span>
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-amber-300 mt-2">{stats.fiveStar}</p>
          <span className="text-[10px] text-slate-500">Layak tampil di Landing Page</span>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-emerald-400 text-xs font-medium">
            <span>Tayang di Landing</span>
            <Eye className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-300 mt-2">{stats.published}</p>
          <span className="text-[10px] text-slate-500">Sedang aktif dipublikasikan</span>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-sky-400 text-xs font-medium">
            <span>Saran & Ide Fitur</span>
            <Lightbulb className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-2xl font-black text-sky-300 mt-2">{stats.suggestions}</p>
          <span className="text-[10px] text-slate-500">Untuk roadmap pengembangan</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari nama, email, pesan..."
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </form>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {/* Filter Category */}
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">Semua Kategori</option>
              <option value="REVIEW">Penilaian & Ulasan</option>
              <option value="SUGGESTION">Saran Fitur</option>
              <option value="CRITIQUE">Kritik & Masukan</option>
            </select>

            {/* Filter Rating */}
            <select
              value={filterRating}
              onChange={e => setFilterRating(e.target.value)}
              className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">Semua Rating</option>
              <option value="5">5 Bintang</option>
              <option value="4">4 Bintang</option>
              <option value="3">3 Bintang</option>
              <option value="2">2 Bintang</option>
              <option value="1">1 Bintang</option>
            </select>

            {/* Filter Published */}
            <select
              value={filterPublished}
              onChange={e => setFilterPublished(e.target.value)}
              className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">Semua Status Tayang</option>
              <option value="true">Tayang di Landing Page</option>
              <option value="false">Belum / Tidak Tayang</option>
            </select>
          </div>
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-12 text-center text-slate-500 bg-slate-950 border border-slate-800 rounded-2xl">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs">Memuat data kritik & saran...</p>
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="p-12 text-center text-slate-500 bg-slate-950 border border-slate-800 rounded-2xl">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-600" />
            <p className="text-sm font-bold text-slate-300">Belum ada kritik & saran yang sesuai.</p>
            <p className="text-xs text-slate-500 mt-1">Coba sesuaikan filter pencarian di atas.</p>
          </div>
        ) : (
          feedbacks.map(item => {
            const isEligibleForLanding = item.rating === 5;
            const isBusy = actionLoadingId === item.id;

            return (
              <div
                key={item.id}
                className={`bg-slate-950 border rounded-2xl p-5 transition-all ${
                  item.isPublished
                    ? 'border-emerald-500/50 bg-emerald-950/10'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  
                  {/* Left: User info & message */}
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Rating Stars */}
                      <div className="flex items-center gap-0.5 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
                        {[1, 2, 3, 4, 5].map(starNum => (
                          <Star
                            key={starNum}
                            className={`w-3.5 h-3.5 ${
                              starNum <= item.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-700'
                            }`}
                          />
                        ))}
                        <span className="text-[11px] font-bold text-slate-200 ml-1.5">
                          {item.rating}.0
                        </span>
                      </div>

                      {/* Category Badge */}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                          item.category === 'REVIEW'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : item.category === 'SUGGESTION'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        }`}
                      >
                        {item.category === 'REVIEW' ? (
                          <>
                            <Star className="w-3 h-3 text-blue-300" />
                            <span>Penilaian & Ulasan</span>
                          </>
                        ) : item.category === 'SUGGESTION' ? (
                          <>
                            <Lightbulb className="w-3 h-3 text-amber-300" />
                            <span>Saran Fitur</span>
                          </>
                        ) : (
                          <>
                            <MessageSquare className="w-3 h-3 text-purple-300" />
                            <span>Kritik & Masukan</span>
                          </>
                        )}
                      </span>

                      {/* Landing Page Status Badge */}
                      {item.isPublished ? (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                          <Eye className="w-3 h-3" /> Tayang di Landing Page
                        </span>
                      ) : isEligibleForLanding ? (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
                          Bintang 5 (Belum Ditampilkan)
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-900/60 text-slate-500">
                          Internal Only (Rating &lt; 5)
                        </span>
                      )}

                      <span className="text-[11px] text-slate-500 ml-auto">
                        {new Date(item.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    {/* Author line */}
                    <div className="flex items-center gap-2 text-xs flex-wrap">
                      {item.userAvatar || item.user?.avatarUrl ? (
                        <img
                          src={item.userAvatar || item.user?.avatarUrl}
                          alt={item.userName}
                          className="w-7 h-7 rounded-full object-cover border border-slate-700 shadow-sm"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-emerald-900/60 text-emerald-300 flex items-center justify-center font-bold text-xs border border-emerald-800">
                          {item.userName?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                      <span className="font-bold text-slate-200">{item.userName}</span>
                      {item.userRole && (
                        <span className="text-slate-400">• {item.userRole}</span>
                      )}
                      {item.userEmail && (
                        <span className="text-slate-500 font-mono text-[11px]">({item.userEmail})</span>
                      )}
                      {(!item.userId || !item.user) && (
                        <span className="text-[10px] text-amber-400/90 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full font-medium" title="Akun pengguna sudah terhapus, namun profil ulasan tetap diabadikan">
                          Akun Terhapus (Profil Tersimpan)
                        </span>
                      )}
                    </div>

                    {/* Message Body */}
                    <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-3.5 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-normal">
                      "{item.message}"
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex md:flex-col items-center md:items-end gap-2 shrink-0 pt-2 md:pt-0">
                    {/* Landing Page Toggle Button */}
                    {isEligibleForLanding ? (
                      <button
                        onClick={() => handleTogglePublish(item)}
                        disabled={isBusy}
                        className={`w-full md:w-auto px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm ${
                          item.isPublished
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40'
                        }`}
                      >
                        {item.isPublished ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>Tarik dari Landing</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>Tayangkan ke Landing</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <div
                        title="Hanya rating bintang 5 yang dapat ditampilkan di Landing Page"
                        className="px-3 py-1.5 rounded-xl text-[10px] font-medium text-slate-500 bg-slate-900/80 border border-slate-800 text-center flex items-center justify-center gap-1.5"
                      >
                        <Star className="w-3 h-3 text-slate-600" />
                        <span>Landing Page: Khusus Bintang 5</span>
                      </div>
                    )}

                    {/* Delete button */}
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={isBusy}
                      className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-950/40 border border-transparent hover:border-red-900/50 transition-colors"
                      title="Hapus masukan ini"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
