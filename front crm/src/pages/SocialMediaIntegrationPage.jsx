import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Share2, Send, Clock, CheckCircle2, Sparkles, Image as ImageIcon, 
  Upload, Hash, RefreshCw, Eye, TrendingUp, BarChart3, AlertCircle, 
  Plus, Calendar, Globe, Trash2, Video, MessageSquare
} from 'lucide-react';
import { useToast } from '../components/ToastProvider';
import { useUser } from '../contexts/UserContext';

// Custom SVG Brand Icons
const InstagramIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const FacebookIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const LinkedinIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const YoutubeIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.56 49.56 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
    <path d="m10 15 5-3-5-3z"/>
  </svg>
);

const INITIAL_ACCOUNTS = [
  { id: 'acc-1', platform: 'Instagram', name: '@digi360_official', followers: '45.2K', status: 'Connected', icon: InstagramIcon, color: 'from-pink-500 to-purple-600', handle: 'digi360_official' },
  { id: 'acc-2', platform: 'Facebook', name: 'DIGI 360 Digital Agency', followers: '28.9K', status: 'Connected', icon: FacebookIcon, color: 'from-blue-600 to-indigo-700', handle: 'digi360agency' },
  { id: 'acc-3', platform: 'LinkedIn', name: 'DIGI 360 Technologies', followers: '19.4K', status: 'Connected', icon: LinkedinIcon, color: 'from-sky-600 to-blue-800', handle: 'digi360-technologies' },
  { id: 'acc-4', platform: 'YouTube', name: 'DIGI 360 Studios', followers: '12.8K', status: 'Connected', icon: YoutubeIcon, color: 'from-red-600 to-rose-700', handle: 'DIGI360Studios' }
];

const INITIAL_HISTORY = [
  {
    id: 'post-901',
    caption: '🚀 Transforming Brands with DIGI 360 Omnichannel Digital Solutions! Check out our latest client success stories.',
    platforms: ['Instagram', 'Facebook', 'LinkedIn'],
    mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    publishedAt: 'Today at 10:30 AM',
    status: 'Published',
    reach: '14,280',
    engagement: '8.4%'
  },
  {
    id: 'post-902',
    caption: '💡 5 Digital Marketing Strategies Every Agency Needs in 2026. Read full guide on our portal.',
    platforms: ['LinkedIn'],
    mediaUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
    publishedAt: 'Oct 08, 2026 04:15 PM',
    status: 'Published',
    reach: '9,420',
    engagement: '11.2%'
  },
  {
    id: 'post-903',
    caption: '🔥 Brand Reel Launch: Behind the scenes with DIGI 360 Design Team.',
    platforms: ['Instagram', 'YouTube'],
    mediaUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    publishedAt: 'Scheduled for Tomorrow at 09:00 AM',
    status: 'Scheduled',
    reach: '-',
    engagement: '-'
  }
];

export default function SocialMediaIntegrationPage() {
  const { showToast } = useToast();
  const { user } = useUser();

  const [accounts, setAccounts] = useState(INITIAL_ACCOUNTS);
  const [selectedPlatforms, setSelectedPlatforms] = useState(['Instagram', 'Facebook', 'LinkedIn']);
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState(['#DIGI360', '#DigitalAgency', '#SocialMediaMarketing', '#BrandGrowth']);
  const [mediaUrl, setMediaUrl] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80');
  const [scheduleDate, setScheduleDate] = useState('');
  const [postHistory, setPostHistory] = useState(INITIAL_HISTORY);
  const [isPublishing, setIsPublishing] = useState(false);
  const [previewPlatform, setPreviewPlatform] = useState('Instagram');

  const togglePlatform = (platformName) => {
    if (selectedPlatforms.includes(platformName)) {
      if (selectedPlatforms.length === 1) {
        showToast('At least one platform must be selected!', 'warning');
        return;
      }
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platformName));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platformName]);
    }
  };

  const handleGenerateHashtags = () => {
    const suggestions = ['#DIGI360', '#MarketingStrategy2026', '#AgencyLife', '#ContentCreation', '#GrowthHacking', '#BrandingDesign'];
    setHashtags(suggestions);
    showToast('AI Hashtags generated & appended!', 'success');
  };

  const handlePublishNow = (e) => {
    e.preventDefault();
    if (!caption.trim()) {
      showToast('Please enter a caption for your post!', 'warning');
      return;
    }

    setIsPublishing(true);

    setTimeout(() => {
      const newPost = {
        id: `post-${Date.now()}`,
        caption: `${caption} ${hashtags.join(' ')}`,
        platforms: selectedPlatforms,
        mediaUrl: mediaUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        publishedAt: scheduleDate ? `Scheduled for ${new Date(scheduleDate).toLocaleString()}` : 'Just now',
        status: scheduleDate ? 'Scheduled' : 'Published',
        reach: scheduleDate ? '-' : '1 (Live)',
        engagement: scheduleDate ? '-' : '0%'
      };

      setPostHistory([newPost, ...postHistory]);
      setIsPublishing(false);
      setCaption('');
      setScheduleDate('');

      showToast(
        scheduleDate 
          ? `📅 Post successfully scheduled across ${selectedPlatforms.join(', ')}!` 
          : `🚀 Post published live across ${selectedPlatforms.join(', ')}!`, 
        'success'
      );
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-cyan-500/20 flex items-center gap-1">
              <Sparkles size={12} /> DIGI 360 Social Publisher API
            </span>
            <span className="text-xs text-slate-400 font-semibold">Module 12</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Social Media Integration & Auto-Publishing Studio
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Connect Meta Instagram Business, Facebook Pages, LinkedIn, and YouTube channels. Schedule or auto-publish content with live cross-platform post preview.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Connected Social Accounts Row */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">
            Connected Brand Social Accounts ({accounts.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {accounts.map((acc) => {
              const IconComp = acc.icon;
              return (
                <div
                  key={acc.id}
                  className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl bg-gradient-to-tr ${acc.color} text-white shadow-md`}>
                      <IconComp size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100">{acc.name}</h4>
                      <span className="text-[10px] text-slate-400 font-semibold">{acc.followers} followers</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black rounded-full border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 size={10} /> Active
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Publisher Studio & Live Feed Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Studio Form */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Share2 size={16} className="text-cyan-500" /> Multi-Platform Content Publisher
            </h3>

            {/* Platform Select Pills */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Target Channels</label>
              <div className="flex flex-wrap gap-2">
                {accounts.map(acc => {
                  const isSelected = selectedPlatforms.includes(acc.platform);
                  const IconComp = acc.icon;
                  return (
                    <button
                      key={acc.platform}
                      type="button"
                      onClick={() => togglePlatform(acc.platform)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-cyan-600 text-white border-cyan-500 shadow-md shadow-cyan-600/20'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-cyan-500/50'
                      }`}
                    >
                      <IconComp size={14} />
                      <span>{acc.platform}</span>
                      {isSelected && <CheckCircle2 size={12} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Caption & Hashtag Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Post Caption</label>
                <button
                  type="button"
                  onClick={handleGenerateHashtags}
                  className="text-[10px] font-black text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles size={11} /> AI Hashtag Assistant
                </button>
              </div>
              <textarea
                rows={4}
                required
                placeholder="Write compelling post caption here..."
                value={caption}
                onChange={e => setCaption(e.target.value)}
                className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-semibold text-slate-900 dark:text-slate-100 outline-none focus:border-cyan-500"
              />

              {/* Hashtag chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {hashtags.map((h, i) => (
                  <span key={i} className="text-[10px] font-extrabold bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 px-2.5 py-1 rounded-lg border border-cyan-200 dark:border-cyan-800">
                    {h}
                  </span>
                ))}
              </div>
            </div>

            {/* Media Asset Preview / URL */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Media Image / Video URL</label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Paste media image URL..."
                  value={mediaUrl}
                  onChange={e => setMediaUrl(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Schedule DateTime Select */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Scheduling (Optional)</label>
              <input
                type="datetime-local"
                value={scheduleDate}
                onChange={e => setScheduleDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 outline-none focus:border-cyan-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handlePublishNow}
                disabled={isPublishing}
                className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-lg shadow-cyan-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isPublishing ? (
                  <>
                    <RefreshCw size={15} className="animate-spin" /> Publishing Content...
                  </>
                ) : scheduleDate ? (
                  <>
                    <Clock size={15} /> Schedule Post Across {selectedPlatforms.length} Channels
                  </>
                ) : (
                  <>
                    <Send size={15} /> Publish Live Now
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Live Social Feed Preview */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Eye size={14} className="text-cyan-500" /> Live Post Preview
                </h3>

                {/* Preview selector */}
                <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  {['Instagram', 'Facebook', 'LinkedIn'].map(p => (
                    <button
                      key={p}
                      onClick={() => setPreviewPlatform(p)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                        previewPlatform === p ? 'bg-cyan-600 text-white' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Simulated Mobile Feed Card */}
              <div className="bg-slate-900 text-white p-4 rounded-3xl border border-slate-800 shadow-2xl space-y-3">
                {/* Header user */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 p-0.5">
                      <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center font-bold text-[10px] text-white">
                        D360
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-black">
                        {previewPlatform === 'Instagram' ? 'digi360_official' : previewPlatform === 'Facebook' ? 'DIGI 360 Agency' : 'DIGI 360 Technologies'}
                      </h4>
                      <span className="text-[9px] text-slate-400">Sponsored • DIGI 360 Studio</span>
                    </div>
                  </div>
                  <Globe size={14} className="text-slate-500" />
                </div>

                {/* Image */}
                <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 aspect-square flex items-center justify-center">
                  <img
                    src={mediaUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Caption preview */}
                <div className="space-y-1 text-xs">
                  <p className="text-slate-200 leading-snug line-clamp-3">
                    <strong className="text-white mr-1">digi360_official</strong>
                    {caption || 'Your written post caption will render dynamically here...'}
                  </p>
                  <p className="text-[10px] text-cyan-400 font-bold">
                    {hashtags.join(' ')}
                  </p>
                </div>
              </div>
            </div>

            {/* Campaign Analytics / Reach Summary */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <TrendingUp size={14} /> Published Post Performance
                </span>
                <span className="text-[10px] text-slate-400 font-bold">Last 7 Days</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-850/60 p-3.5 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase">Total Impressions</span>
                  <p className="text-xl font-black text-white mt-0.5">23,700</p>
                </div>
                <div className="bg-slate-850/60 p-3.5 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase">Avg. Engagement</span>
                  <p className="text-xl font-black text-emerald-400 mt-0.5">9.8%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Publishing History Log Table */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Clock size={16} className="text-cyan-500" /> Recent Publication History & Scheduled Queue
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/60 dark:border-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">Content / Caption</th>
                  <th className="py-3 px-4">Channels</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date / Time</th>
                  <th className="py-3 px-4">Est. Reach</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-xs">
                {postHistory.map(post => (
                  <tr key={post.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/40 transition-colors">
                    <td className="py-3.5 px-4 max-w-sm">
                      <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{post.caption}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex gap-1">
                        {post.platforms.map(p => (
                          <span key={p} className="text-[9px] font-black bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 px-2 py-0.5 rounded-md border border-cyan-500/20">
                            {p}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                        post.status === 'Published'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                          : 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20'
                      }`}>
                        <CheckCircle2 size={11} /> {post.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-semibold">{post.publishedAt}</td>
                    <td className="py-3.5 px-4 font-black text-slate-700 dark:text-slate-200">{post.reach}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
