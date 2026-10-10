import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, Clock, XCircle, MessageSquare, Send, Upload, 
  ExternalLink, Download, ArrowLeft, RefreshCw, Eye, ShieldCheck, 
  FileText, Image as ImageIcon, Video, ThumbsUp, AlertTriangle, Share2, Sparkles, Check, ChevronRight
} from 'lucide-react';
import { useToast } from '../components/ToastProvider';
import { useUser } from '../contexts/UserContext';
import { useNavigate, useParams } from 'react-router-dom';

const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '');

const getAuthHeaders = () => {
  const rawToken = localStorage.getItem('token');
  const token = rawToken ? rawToken.replace(/^"(.*)"$/, '$1').replace(/"/g, '').replace(/^Bearer\s+/i, '').trim() : '';
  return { 'Authorization': token ? `Bearer ${token}` : '' };
};

const INITIAL_DELIVERABLES = [
  {
    id: 'del-101',
    title: 'Brand Launch Campaign Video Reel (4K 60fps)',
    clientName: 'Nexus Global',
    projectName: 'Q4 Omnichannel Rebrand',
    version: 'v2',
    versionsAvailable: ['v1', 'v2'],
    status: 'Pending Review', // Approved, Revision Requested, Pending Review
    submittedBy: 'Videography Team',
    submittedAt: '2026-10-09 14:30',
    fileUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    fileType: 'image', // image, video, pdf
    description: 'Updated colour grading to DIGI 360 Electric Cyan (#0284c7). Adjusted typography and intro motion lower-third graph.',
    comments: [
      { id: 1, author: 'Alex Miller (Client Lead)', role: 'Client', text: 'Please ensure logo overlay is centered on frame 0:05.', timestamp: '10:14 AM', resolved: true },
      { id: 2, author: 'Sarah Jenkins (Sr. Designer)', role: 'Agency', text: 'Centered in v2 build! Please review.', timestamp: '02:30 PM', resolved: false }
    ]
  },
  {
    id: 'del-102',
    title: 'Instagram Carousel Ads Deck (10 Cards)',
    clientName: 'Starlight Academy',
    projectName: 'Admissions 2026 Drive',
    version: 'v1',
    versionsAvailable: ['v1'],
    status: 'Revision Requested',
    submittedBy: 'Graphic Design Team',
    submittedAt: '2026-10-08 11:15',
    fileUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
    fileType: 'image',
    description: 'Carousel design focused on Course offerings, campus tours, and student testimonials.',
    comments: [
      { id: 1, author: 'Dr. Rahul Sharma', role: 'Client', text: 'Slide 4 date needs to be updated to Oct 25th.', timestamp: '11:45 AM', resolved: false }
    ]
  },
  {
    id: 'del-103',
    title: 'Q4 Social Media Growth Banner Pack',
    clientName: 'DIGI 360 Internal',
    projectName: 'Agency Brand Collateral',
    version: 'Final',
    versionsAvailable: ['v1', 'v2', 'Final'],
    status: 'Approved',
    submittedBy: 'Creative Dept',
    submittedAt: '2026-10-07 09:00',
    fileUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    fileType: 'image',
    description: 'Fully approved hero banners for LinkedIn, Facebook, and Web portal.',
    comments: [
      { id: 1, author: 'Super Admin', role: 'Agency', text: 'Approved for final publishing across channels.', timestamp: '09:30 AM', resolved: true }
    ]
  }
];

export default function ClientReviewApprovalPage() {
  const { showToast } = useToast();
  const { user } = useUser();
  const navigate = useNavigate();
  const { id } = useParams();

  const [deliverables, setDeliverables] = useState(INITIAL_DELIVERABLES);
  const [selectedId, setSelectedId] = useState(id || INITIAL_DELIVERABLES[0].id);
  const [activeTab, setActiveTab] = useState('review'); // review, history, share
  
  // Comment state
  const [newComment, setNewComment] = useState('');
  const [commentFrameTime, setCommentFrameTime] = useState('');
  
  // Revision modal state
  const [revisionModalOpen, setRevisionModalOpen] = useState(false);
  const [revisionNotes, setRevisionNotes] = useState('');

  const currentDeliverable = deliverables.find(d => d.id === selectedId) || deliverables[0];

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const commentObj = {
      id: Date.now(),
      author: user?.name || 'Reviewer',
      role: user?.role === 'client' ? 'Client' : 'Agency / Lead',
      text: commentFrameTime ? `[${commentFrameTime}] ${newComment}` : newComment,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      resolved: false
    };

    setDeliverables(prev => prev.map(d => {
      if (d.id === currentDeliverable.id) {
        return { ...d, comments: [...d.comments, commentObj] };
      }
      return d;
    }));

    setNewComment('');
    setCommentFrameTime('');
    showToast('Feedback comment posted successfully!', 'success');
  };

  const handleUpdateStatus = (newStatus, notes = '') => {
    setDeliverables(prev => prev.map(d => {
      if (d.id === currentDeliverable.id) {
        return { 
          ...d, 
          status: newStatus,
          comments: notes ? [
            ...d.comments,
            {
              id: Date.now(),
              author: user?.name || 'Reviewer',
              role: 'Client Sign-off',
              text: `STATUS CHANGED TO ${newStatus.toUpperCase()}: ${notes}`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              resolved: true
            }
          ] : d.comments
        };
      }
      return d;
    }));

    if (newStatus === 'Approved') {
      showToast('🎉 Deliverable approved successfully! Final sign-off recorded.', 'success');
    } else if (newStatus === 'Revision Requested') {
      showToast('Revision request sent to creative production team.', 'info');
      setRevisionModalOpen(false);
      setRevisionNotes('');
    }
  };

  const handleCopyShareLink = () => {
    const link = `${window.location.origin}/client-review/${currentDeliverable.id}`;
    navigator.clipboard.writeText(link);
    showToast('Client Portal review link copied to clipboard!', 'success');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 size={13} /> Approved & Signed-off
          </span>
        );
      case 'Revision Requested':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <AlertTriangle size={13} /> Revision Requested
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 animate-pulse">
            <Clock size={13} /> Pending Client Review
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 p-4 md:p-8">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-cyan-500/20 flex items-center gap-1">
              <Sparkles size={12} /> DIGI 360 Client Review Portal
            </span>
            <span className="text-xs text-slate-400 font-semibold">Module 11</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Client Review & Approval Portal
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Preview creative deliverables, inspect versioning (v1, v2, Final), post timestamped frame comments, and approve or request revisions with direct sign-off.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyShareLink}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-all border border-slate-200 dark:border-slate-700 cursor-pointer"
          >
            <Share2 size={14} /> Copy Client Link
          </button>
          <button
            onClick={() => navigate('/projects')}
            className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-cyan-600/20 cursor-pointer"
          >
            <ArrowLeft size={14} /> Back to Projects
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Deliverables Selector List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4 flex items-center justify-between">
              <span>Select Deliverable Package</span>
              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-bold text-slate-600 dark:text-slate-300">
                {deliverables.length} Items
              </span>
            </h3>

            <div className="space-y-3">
              {deliverables.map(item => {
                const isSelected = item.id === currentDeliverable.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 ${
                      isSelected
                        ? 'bg-cyan-50/80 dark:bg-cyan-950/40 border-cyan-500/50 shadow-md shadow-cyan-500/5'
                        : 'bg-slate-50/50 dark:bg-slate-850/40 border-slate-200/60 dark:border-slate-800 hover:border-cyan-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                        {item.clientName}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        Version: <strong className="text-slate-700 dark:text-slate-200">{item.version}</strong>
                      </span>
                    </div>

                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 line-clamp-2">
                      {item.title}
                    </h4>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/40 dark:border-slate-800/60 text-[10px]">
                      <span className="text-slate-500 truncate max-w-[150px]">{item.projectName}</span>
                      {getStatusBadge(item.status)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Client Summary Card */}
          <div className="bg-gradient-to-br from-cyan-600 to-blue-700 text-white p-6 rounded-3xl shadow-xl space-y-3 relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
              <ShieldCheck size={140} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-md">
              DIGI 360 Quality Assurance
            </span>
            <h4 className="text-base font-black leading-tight">
              Direct External Sign-off Workflow
            </h4>
            <p className="text-xs text-cyan-100 leading-relaxed">
              Once approved by the client, deliverables are instantly unlocked for 1-click Social Media Publishing and client zip export.
            </p>
          </div>
        </div>

        {/* Right Column: Main Deliverable Stage & Comment Thread */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Stage View Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
            {/* Header info bar */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {getStatusBadge(currentDeliverable.status)}
                  <span className="text-xs font-bold text-slate-400">
                    Submitted: {currentDeliverable.submittedAt}
                  </span>
                </div>
                <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-slate-100">
                  {currentDeliverable.title}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Project: <strong className="text-slate-700 dark:text-slate-300">{currentDeliverable.projectName}</strong> ({currentDeliverable.clientName})
                </p>
              </div>

              {/* Version Switcher Pills */}
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2">
                  Version:
                </span>
                {currentDeliverable.versionsAvailable.map(v => (
                  <button
                    key={v}
                    onClick={() => {
                      setDeliverables(prev => prev.map(d => d.id === currentDeliverable.id ? { ...d, version: v } : d));
                      showToast(`Switched to deliverable view ${v}`, 'info');
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      currentDeliverable.version === v
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Media Viewer Area */}
            <div className="p-6 bg-slate-950 flex flex-col items-center justify-center min-h-[380px] relative">
              <img
                src={currentDeliverable.fileUrl}
                alt={currentDeliverable.title}
                className="max-h-[420px] w-auto object-contain rounded-2xl shadow-2xl border border-slate-800"
              />

              <div className="mt-4 flex items-center justify-between w-full max-w-xl text-slate-300 text-xs bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2">
                  <Eye size={14} className="text-cyan-400" />
                  <span>Previewing <strong>{currentDeliverable.version}</strong></span>
                </div>
                <a
                  href={currentDeliverable.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-cyan-400 hover:underline font-bold"
                >
                  Open Full Resolution <ExternalLink size={12} />
                </a>
              </div>
            </div>

            {/* Description & Action Bar */}
            <div className="p-6 bg-slate-50/50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1">Deliverable Notes</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {currentDeliverable.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setRevisionModalOpen(true)}
                  className="flex items-center gap-2 px-5 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-extrabold rounded-2xl transition-all border border-slate-300 dark:border-slate-700 cursor-pointer"
                >
                  <RefreshCw size={14} className="text-amber-500" /> Request Revisions
                </button>
                <button
                  onClick={() => handleUpdateStatus('Approved', 'Client approved deliverable for deployment.')}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black uppercase tracking-wider rounded-2xl transition-all shadow-lg shadow-emerald-600/20 cursor-pointer"
                >
                  <CheckCircle2 size={16} /> Approve Deliverable
                </button>
              </div>
            </div>
          </div>

          {/* Feedback & Frame Comment Thread */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <MessageSquare size={16} className="text-cyan-500" /> Frame & Asset Review Comments
              </span>
              <span className="text-xs text-slate-400 font-bold">
                {currentDeliverable.comments.length} Comments
              </span>
            </h3>

            {/* Comment List */}
            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
              {currentDeliverable.comments.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-6">
                  No comments yet. Leave the first feedback note below.
                </p>
              ) : (
                currentDeliverable.comments.map((c) => (
                  <div key={c.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-800 dark:text-slate-200">{c.author}</span>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                          c.role.includes('Client') ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
                        }`}>
                          {c.role}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">{c.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-medium pt-1">
                      {c.text}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Post New Comment Form */}
            <form onSubmit={handleAddComment} className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <input
                  type="text"
                  placeholder="Frame timestamp (e.g. 0:14) - Optional"
                  value={commentFrameTime}
                  onChange={e => setCommentFrameTime(e.target.value)}
                  className="md:col-span-3 px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 outline-none focus:border-cyan-500"
                />
                <input
                  type="text"
                  required
                  placeholder="Type timestamped comment or revision note..."
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  className="md:col-span-7 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  className="md:col-span-2 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-cyan-600/20 cursor-pointer"
                >
                  <Send size={13} /> Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Revision Request Modal */}
      <AnimatePresence>
        {revisionModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-amber-500 font-black text-sm">
                  <AlertTriangle size={18} /> Request Revisions for {currentDeliverable.version}
                </div>
                <button onClick={() => setRevisionModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer">
                  <XCircle size={20} />
                </button>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Specify the precise updates or corrections needed for the design/video team. The status will be updated to <strong>Revision Requested</strong>.
              </p>

              <textarea
                rows={4}
                required
                placeholder="List required changes (e.g. 1. Increase contrast on lower third text. 2. Swap background music track)..."
                value={revisionNotes}
                onChange={e => setRevisionNotes(e.target.value)}
                className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-semibold text-slate-900 dark:text-slate-100 outline-none focus:border-amber-500"
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRevisionModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus('Revision Requested', revisionNotes)}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md shadow-amber-500/20"
                >
                  Submit Revision Request
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
