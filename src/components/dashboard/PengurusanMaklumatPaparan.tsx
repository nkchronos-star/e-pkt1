import React, { useState } from 'react';
import {
  useAppContext,
  DEFAULT_PENGENALAN_ITEMS,
  DEFAULT_VIDEO_KORPORAT_ITEMS,
  DEFAULT_INFO_SMAG3_ITEMS,
  DEFAULT_SUBJEK_MENENGAH_BAWAH,
  DEFAULT_SUBJEK_MENENGAH_ATAS,
  DEFAULT_PANDUAN_SYARAT_ITEMS,
  DEFAULT_PANDUAN_LANGKAH_ITEMS,
  DEFAULT_PANDUAN_DOKUMEN_ITEMS,
} from '../../store';
import {
  PengenalanItem,
  VideoKorporatItem,
  InfoSmag3Item,
  SubjekKategoriItem,
  PanduanLangkahItem,
  PanduanItem,
} from '../../types';
import { compressImageFile } from '../../lib/imageUtils';
import { normalizeYoutubeEmbedUrl } from './Utama';
import {
  BookOpen,
  Plus,
  Trash2,
  Edit,
  Check,
  X,
  RotateCcw,
  Upload,
  Video,
  Image as ImageIcon,
  GraduationCap,
  FileText,
  ExternalLink,
} from 'lucide-react';

type SubTab = 'PENGENALAN' | 'VIDEO' | 'INFO_SMAG3' | 'SUBJEK' | 'PANDUAN';

export default function PengurusanMaklumatPaparan() {
  const { settings, updateSettings, syncSettingsToServer, infographics, addInfographic, deleteInfographic } =
    useAppContext();

  const [activeSubTab, setActiveSubTab] = useState<SubTab>('PENGENALAN');
  const [notice, setNotice] = useState<string>('');

  const showSavedNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(''), 3500);
  };

  const persistPartial = async (partial: Record<string, any>, msg?: string) => {
    await updateSettings(partial);
    await syncSettingsToServer(partial);
    if (msg) showSavedNotice(msg);
  };

  // Data semasa dengan fallback default
  const pengenalanItems: PengenalanItem[] =
    Array.isArray(settings.pengenalanItems) && settings.pengenalanItems.length > 0
      ? settings.pengenalanItems
      : DEFAULT_PENGENALAN_ITEMS;

  const videoItems: VideoKorporatItem[] =
    Array.isArray(settings.videoKorporatItems) && settings.videoKorporatItems.length > 0
      ? settings.videoKorporatItems
      : DEFAULT_VIDEO_KORPORAT_ITEMS;

  const infoItems: InfoSmag3Item[] =
    Array.isArray(settings.infoSmag3Items) && settings.infoSmag3Items.length > 0
      ? settings.infoSmag3Items
      : DEFAULT_INFO_SMAG3_ITEMS;

  const subjekBawah: SubjekKategoriItem[] =
    Array.isArray(settings.subjekMenengahBawah) && settings.subjekMenengahBawah.length > 0
      ? settings.subjekMenengahBawah
      : DEFAULT_SUBJEK_MENENGAH_BAWAH;

  const subjekAtas: SubjekKategoriItem[] =
    Array.isArray(settings.subjekMenengahAtas) && settings.subjekMenengahAtas.length > 0
      ? settings.subjekMenengahAtas
      : DEFAULT_SUBJEK_MENENGAH_ATAS;

  const syaratItems: PanduanItem[] =
    Array.isArray(settings.panduanSyaratItems) && settings.panduanSyaratItems.length > 0
      ? settings.panduanSyaratItems
      : DEFAULT_PANDUAN_SYARAT_ITEMS;

  const langkahItems: PanduanLangkahItem[] =
    Array.isArray(settings.panduanLangkahItems) && settings.panduanLangkahItems.length > 0
      ? settings.panduanLangkahItems
      : DEFAULT_PANDUAN_LANGKAH_ITEMS;

  const dokumenItems: PanduanItem[] =
    Array.isArray(settings.panduanDokumenItems) && settings.panduanDokumenItems.length > 0
      ? settings.panduanDokumenItems
      : DEFAULT_PANDUAN_DOKUMEN_ITEMS;

  // =====================================================
  // 1. STATE PENGENALAN
  // =====================================================
  const [newPengenalanType, setNewPengenalanType] = useState<'PARAGRAPH' | 'LIST_ITEM'>('LIST_ITEM');
  const [newPengenalanText, setNewPengenalanText] = useState('');
  const [editingPengenalanId, setEditingPengenalanId] = useState<string | null>(null);
  const [editingPengenalanText, setEditingPengenalanText] = useState('');
  const [editingPengenalanType, setEditingPengenalanType] = useState<'PARAGRAPH' | 'LIST_ITEM'>('LIST_ITEM');

  const handleAddPengenalan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPengenalanText.trim()) return;
    const next: PengenalanItem[] = [
      ...pengenalanItems,
      {
        id: 'pg_' + Date.now(),
        type: newPengenalanType,
        text: newPengenalanText.trim(),
      },
    ];
    setNewPengenalanText('');
    await persistPartial({ pengenalanItems: next, utamaContent: '' }, 'Item Pengenalan ditambah!');
  };

  const handleSaveEditPengenalan = async (id: string) => {
    if (!editingPengenalanText.trim()) return;
    const next = pengenalanItems.map((item) =>
      item.id === id ? { ...item, text: editingPengenalanText.trim(), type: editingPengenalanType } : item
    );
    setEditingPengenalanId(null);
    await persistPartial({ pengenalanItems: next, utamaContent: '' }, 'Item Pengenalan dikemaskini!');
  };

  const handleDeletePengenalan = async (id: string) => {
    const next = pengenalanItems.filter((item) => item.id !== id);
    await persistPartial({ pengenalanItems: next, utamaContent: '' }, 'Item Pengenalan dipadam!');
  };

  // =====================================================
  // 2. STATE VIDEO KORPORAT
  // =====================================================
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [editingVideoTitle, setEditingVideoTitle] = useState('');
  const [editingVideoUrl, setEditingVideoUrl] = useState('');

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoUrl.trim()) return;
    const next: VideoKorporatItem[] = [
      ...videoItems,
      {
        id: 'vid_' + Date.now(),
        title: newVideoTitle.trim() || 'Video Korporat SMAG3',
        embedUrl: normalizeYoutubeEmbedUrl(newVideoUrl.trim()),
      },
    ];
    setNewVideoTitle('');
    setNewVideoUrl('');
    await persistPartial({ videoKorporatItems: next }, 'Video Korporat ditambah!');
  };

  const handleSaveEditVideo = async (id: string) => {
    if (!editingVideoUrl.trim()) return;
    const next = videoItems.map((v) =>
      v.id === id
        ? {
            ...v,
            title: editingVideoTitle.trim() || 'Video Korporat SMAG3',
            embedUrl: normalizeYoutubeEmbedUrl(editingVideoUrl.trim()),
          }
        : v
    );
    setEditingVideoId(null);
    await persistPartial({ videoKorporatItems: next }, 'Video Korporat dikemaskini!');
  };

  const handleDeleteVideo = async (id: string) => {
    const next = videoItems.filter((v) => v.id !== id);
    await persistPartial({ videoKorporatItems: next }, 'Video Korporat dipadam!');
  };

  // =====================================================
  // 3. STATE INFO SMAG3
  // =====================================================
  const [newInfoTitle, setNewInfoTitle] = useState('');
  const [newInfoImageUrl, setNewInfoImageUrl] = useState('');
  const [newInfoLinkUrl, setNewInfoLinkUrl] = useState('');
  const [newInfoFbUrl, setNewInfoFbUrl] = useState('https://www.facebook.com/SMAKG03/');
  const [editingInfoId, setEditingInfoId] = useState<string | null>(null);
  const [editingInfoData, setEditingInfoData] = useState<Partial<InfoSmag3Item>>({});

  const handleAddInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInfoImageUrl.trim()) return;
    const next: InfoSmag3Item[] = [
      ...infoItems,
      {
        id: 'inf_' + Date.now(),
        title: newInfoTitle.trim() || 'Infografik SMAG3',
        imageUrl: newInfoImageUrl.trim(),
        linkUrl: newInfoLinkUrl.trim(),
        facebookUrl: newInfoFbUrl.trim(),
      },
    ];
    setNewInfoTitle('');
    setNewInfoImageUrl('');
    setNewInfoLinkUrl('');
    await persistPartial({ infoSmag3Items: next }, 'Info SMAG3 ditambah!');
  };

  const handleSaveEditInfo = async (id: string) => {
    if (!editingInfoData.imageUrl?.trim()) return;
    const next = infoItems.map((inf) =>
      inf.id === id
        ? {
            ...inf,
            title: editingInfoData.title?.trim() || 'Infografik SMAG3',
            imageUrl: editingInfoData.imageUrl.trim(),
            linkUrl: editingInfoData.linkUrl?.trim() || '',
            facebookUrl: editingInfoData.facebookUrl?.trim() || '',
          }
        : inf
    );
    setEditingInfoId(null);
    await persistPartial({ infoSmag3Items: next }, 'Info SMAG3 dikemaskini!');
  };

  const handleDeleteInfo = async (id: string) => {
    const next = infoItems.filter((inf) => inf.id !== id);
    await persistPartial({ infoSmag3Items: next }, 'Info SMAG3 dipadam!');
  };

  // =====================================================
  // 4. STATE MATA PELAJARAN DITAWARKAN
  // =====================================================
  const [subjekLevelTab, setSubjekLevelTab] = useState<'BAWAH' | 'ATAS'>('BAWAH');
  const [newKategoriName, setNewKategoriName] = useState('');
  const [editingKategoriId, setEditingKategoriId] = useState<string | null>(null);
  const [editingKategoriName, setEditingKategoriName] = useState('');
  const [newSubjekInput, setNewSubjekInput] = useState<Record<string, string>>({});
  const [editingSubjekKey, setEditingSubjekKey] = useState<string | null>(null); // `${katId}_${idx}`
  const [editingSubjekValue, setEditingSubjekValue] = useState('');

  const currentSubjekList = subjekLevelTab === 'BAWAH' ? subjekBawah : subjekAtas;
  const currentSubjekField = subjekLevelTab === 'BAWAH' ? 'subjekMenengahBawah' : 'subjekMenengahAtas';

  const handleAddKategori = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKategoriName.trim()) return;
    const next: SubjekKategoriItem[] = [
      ...currentSubjekList,
      {
        id: 'kat_' + Date.now(),
        kategori: newKategoriName.trim(),
        subjek: [],
      },
    ];
    setNewKategoriName('');
    await persistPartial({ [currentSubjekField]: next }, 'Kategori mata pelajaran ditambah!');
  };

  const handleSaveKategoriName = async (katId: string) => {
    if (!editingKategoriName.trim()) return;
    const next = currentSubjekList.map((k) =>
      k.id === katId ? { ...k, kategori: editingKategoriName.trim() } : k
    );
    setEditingKategoriId(null);
    await persistPartial({ [currentSubjekField]: next }, 'Nama kategori dikemaskini!');
  };

  const handleDeleteKategori = async (katId: string) => {
    const next = currentSubjekList.filter((k) => k.id !== katId);
    await persistPartial({ [currentSubjekField]: next }, 'Kategori mata pelajaran dipadam!');
  };

  const handleAddSubjekToKategori = async (katId: string) => {
    const val = (newSubjekInput[katId] || '').trim();
    if (!val) return;
    const next = currentSubjekList.map((k) =>
      k.id === katId ? { ...k, subjek: [...(k.subjek || []), val] } : k
    );
    setNewSubjekInput((prev) => ({ ...prev, [katId]: '' }));
    await persistPartial({ [currentSubjekField]: next }, 'Mata pelajaran ditambah!');
  };

  const handleSaveSubjekInKategori = async (katId: string, idx: number) => {
    if (!editingSubjekValue.trim()) return;
    const next = currentSubjekList.map((k) => {
      if (k.id !== katId) return k;
      const updated = [...(k.subjek || [])];
      updated[idx] = editingSubjekValue.trim();
      return { ...k, subjek: updated };
    });
    setEditingSubjekKey(null);
    await persistPartial({ [currentSubjekField]: next }, 'Mata pelajaran dikemaskini!');
  };

  const handleDeleteSubjekFromKategori = async (katId: string, idx: number) => {
    const next = currentSubjekList.map((k) => {
      if (k.id !== katId) return k;
      const updated = (k.subjek || []).filter((_, i) => i !== idx);
      return { ...k, subjek: updated };
    });
    await persistPartial({ [currentSubjekField]: next }, 'Mata pelajaran dipadam!');
  };

  // =====================================================
  // 5. STATE PANDUAN PERMOHONAN KEMASUKAN
  // =====================================================
  const [newSyaratText, setNewSyaratText] = useState('');
  const [editingSyaratId, setEditingSyaratId] = useState<string | null>(null);
  const [editingSyaratText, setEditingSyaratText] = useState('');

  const [newLangkahTitle, setNewLangkahTitle] = useState('');
  const [newLangkahDesc, setNewLangkahDesc] = useState('');
  const [editingLangkahId, setEditingLangkahId] = useState<string | null>(null);
  const [editingLangkahTitle, setEditingLangkahTitle] = useState('');
  const [editingLangkahDesc, setEditingLangkahDesc] = useState('');

  const [newDokumenText, setNewDokumenText] = useState('');
  const [editingDokumenId, setEditingDokumenId] = useState<string | null>(null);
  const [editingDokumenText, setEditingDokumenText] = useState('');

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Header & Sub-Tabs */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-base sm:text-lg font-extrabold text-slate-900">
              5. Pengurusan Maklumat Paparan Portal
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Tambah, kemaskini (Edit) atau padam (Delete) kandungan rasmi pada halaman Utama dan Panduan Permohonan.
            </p>
          </div>
          {notice && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
              <Check className="w-3.5 h-3.5" /> {notice}
            </span>
          )}
        </div>

        {/* 5 Tab Bahagian Paparan */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100">
          {[
            { id: 'PENGENALAN', label: '1. Pengenalan', icon: BookOpen },
            { id: 'VIDEO', label: '2. Video Korporat', icon: Video },
            { id: 'INFO_SMAG3', label: '3. Info SMAG3', icon: ImageIcon },
            { id: 'SUBJEK', label: '4. Mata Pelajaran Ditawarkan', icon: GraduationCap },
            { id: 'PANDUAN', label: '5. Panduan Permohonan Kemasukan', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id as SubTab)}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer ${
                  active
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================
          TAB 1: PENGENALAN
         ========================================================= */}
      {activeSubTab === 'PENGENALAN' && (
        <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200/80 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h5 className="font-bold text-slate-900 text-sm sm:text-base">Pengurusan Teks &amp; Objektif Pengenalan</h5>
              <p className="text-xs text-slate-500">
                Urus perenggan pengenalan dan senarai objektif pelaksanaan KBT di halaman Utama.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                persistPartial(
                  { pengenalanItems: DEFAULT_PENGENALAN_ITEMS, utamaContent: '' },
                  'Pengenalan diset semula ke asal!'
                )
              }
              className="text-xs font-bold text-slate-600 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 px-3 py-1.5 rounded-lg flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Set Semula Asal
            </button>
          </div>

          {/* Borang Tambah Item Pengenalan */}
          <form
            onSubmit={handleAddPengenalan}
            className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="sm:w-52">
                <label className="block text-xs font-bold text-slate-700 mb-1">Jenis Kandungan</label>
                <select
                  value={newPengenalanType}
                  onChange={(e) => setNewPengenalanType(e.target.value as any)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold bg-white text-slate-800"
                >
                  <option value="PARAGRAPH">Perenggan Teks Utama</option>
                  <option value="LIST_ITEM">Senarai Bernombor (Objektif KBT)</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-700 mb-1">Teks Pengenalan / Objektif</label>
                <input
                  type="text"
                  value={newPengenalanText}
                  onChange={(e) => setNewPengenalanText(e.target.value)}
                  placeholder="Masukkan ayat pengenalan atau objektif baharu..."
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm bg-white text-slate-800"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Tambah
                </button>
              </div>
            </div>
          </form>

          {/* Senarai Item Pengenalan */}
          <div className="space-y-2.5">
            {pengenalanItems.map((item, index) => {
              const isEditing = editingPengenalanId === item.id;
              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  {isEditing ? (
                    <div className="flex-1 w-full space-y-2">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <select
                          value={editingPengenalanType}
                          onChange={(e) => setEditingPengenalanType(e.target.value as any)}
                          className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold bg-slate-50"
                        >
                          <option value="PARAGRAPH">Perenggan</option>
                          <option value="LIST_ITEM">Senarai Objektif</option>
                        </select>
                        <input
                          type="text"
                          value={editingPengenalanText}
                          onChange={(e) => setEditingPengenalanText(e.target.value)}
                          className="flex-1 border border-emerald-400 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleSaveEditPengenalan(item.id)}
                          className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" /> Simpan
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingPengenalanId(null)}
                          className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" /> Batal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start gap-3 flex-1">
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md shrink-0 mt-0.5 ${
                            item.type === 'PARAGRAPH'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {item.type === 'PARAGRAPH' ? 'Perenggan' : `Objektif #${index}`}
                        </span>
                        <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingPengenalanId(item.id);
                            setEditingPengenalanText(item.text);
                            setEditingPengenalanType(item.type);
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition cursor-pointer"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePengenalan(item.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="Padam"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 2: VIDEO KORPORAT
         ========================================================= */}
      {activeSubTab === 'VIDEO' && (
        <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200/80 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h5 className="font-bold text-slate-900 text-sm sm:text-base">Pengurusan Video Korporat</h5>
              <p className="text-xs text-slate-500">
                Tambah, tukar atau padam pautan video YouTube pada kad Video Korporat di halaman Utama.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                persistPartial({ videoKorporatItems: DEFAULT_VIDEO_KORPORAT_ITEMS }, 'Video Korporat diset semula!')
              }
              className="text-xs font-bold text-slate-600 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 px-3 py-1.5 rounded-lg flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Set Semula Asal
            </button>
          </div>

          <form
            onSubmit={handleAddVideo}
            className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end"
          >
            <div className="sm:col-span-4">
              <label className="block text-xs font-bold text-slate-700 mb-1">Tajuk Video</label>
              <input
                type="text"
                value={newVideoTitle}
                onChange={(e) => setNewVideoTitle(e.target.value)}
                placeholder="Video Korporat SMAG3"
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm bg-white"
              />
            </div>
            <div className="sm:col-span-6">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Pautan YouTube (Watch URL / Share URL / Embed URL)
              </label>
              <input
                type="text"
                value={newVideoUrl}
                onChange={(e) => setNewVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm bg-white"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Tambah
              </button>
            </div>
          </form>

          <div className="space-y-3">
            {videoItems.map((vid) => {
              const isEditing = editingVideoId === vid.id;
              return (
                <div
                  key={vid.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  {isEditing ? (
                    <div className="flex-1 w-full space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">Tajuk Video</label>
                          <input
                            type="text"
                            value={editingVideoTitle}
                            onChange={(e) => setEditingVideoTitle(e.target.value)}
                            className="w-full border border-emerald-400 rounded-lg px-3 py-1.5 text-xs sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">Pautan YouTube</label>
                          <input
                            type="text"
                            value={editingVideoUrl}
                            onChange={(e) => setEditingVideoUrl(e.target.value)}
                            className="w-full border border-emerald-400 rounded-lg px-3 py-1.5 text-xs sm:text-sm"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleSaveEditVideo(vid.id)}
                          className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" /> Simpan
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingVideoId(null)}
                          className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" /> Batal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-36 h-20 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-slate-200">
                          <iframe
                            src={normalizeYoutubeEmbedUrl(vid.embedUrl)}
                            title={vid.title}
                            className="w-full h-full pointer-events-none"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h6 className="font-bold text-slate-900 text-sm truncate">{vid.title}</h6>
                          <p className="text-xs text-slate-500 font-mono truncate mt-0.5">{vid.embedUrl}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingVideoId(vid.id);
                            setEditingVideoTitle(vid.title);
                            setEditingVideoUrl(vid.embedUrl);
                          }}
                          className="p-2 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition cursor-pointer"
                          title="Edit Video"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteVideo(vid.id)}
                          className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="Padam Video"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 3: INFO SMAG3
         ========================================================= */}
      {activeSubTab === 'INFO_SMAG3' && (
        <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200/80 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h5 className="font-bold text-slate-900 text-sm sm:text-base">Pengurusan Kad Info SMAG3</h5>
              <p className="text-xs text-slate-500">
                Urus poster infografik, pautan luar dan pautan Facebook rasmi pada kad Info SMAG3 di halaman Utama.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                persistPartial({ infoSmag3Items: DEFAULT_INFO_SMAG3_ITEMS }, 'Info SMAG3 diset semula!')
              }
              className="text-xs font-bold text-slate-600 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 px-3 py-1.5 rounded-lg flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Set Semula Asal
            </button>
          </div>

          <form
            onSubmit={handleAddInfo}
            className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tajuk Info / Poster</label>
                <input
                  type="text"
                  value={newInfoTitle}
                  onChange={(e) => setNewInfoTitle(e.target.value)}
                  placeholder="Infografik SMAG3"
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pautan Facebook Rasmi</label>
                <input
                  type="text"
                  value={newInfoFbUrl}
                  onChange={(e) => setNewInfoFbUrl(e.target.value)}
                  placeholder="https://www.facebook.com/SMAKG03/"
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  URL Gambar Poster atau Muat Naik Fail
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newInfoImageUrl}
                    onChange={(e) => setNewInfoImageUrl(e.target.value)}
                    placeholder="https://i.postimg.cc/.../infografik.png"
                    className="flex-1 border border-slate-300 rounded-xl px-3.5 py-2 text-xs bg-white"
                  />
                  <label className="cursor-pointer bg-white border border-emerald-500 text-emerald-700 hover:bg-emerald-50 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1 shrink-0">
                    <Upload className="w-3.5 h-3.5" /> Fail
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const base64 = await compressImageFile(file, 1000, 1400, 0.85);
                          if (base64) setNewInfoImageUrl(base64);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pautan Apabila Gambar Diklik (Pilihan)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newInfoLinkUrl}
                    onChange={(e) => setNewInfoLinkUrl(e.target.value)}
                    placeholder="https://tinyurl.com/..."
                    className="flex-1 border border-slate-300 rounded-xl px-3.5 py-2 text-xs bg-white"
                  />
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Tambah
                  </button>
                </div>
              </div>
            </div>
          </form>

          <div className="space-y-3">
            {infoItems.map((inf) => {
              const isEditing = editingInfoId === inf.id;
              return (
                <div
                  key={inf.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  {isEditing ? (
                    <div className="flex-1 w-full space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">Tajuk</label>
                          <input
                            type="text"
                            value={editingInfoData.title || ''}
                            onChange={(e) => setEditingInfoData((p) => ({ ...p, title: e.target.value }))}
                            className="w-full border border-emerald-400 rounded-lg px-3 py-1.5 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">Pautan Facebook</label>
                          <input
                            type="text"
                            value={editingInfoData.facebookUrl || ''}
                            onChange={(e) => setEditingInfoData((p) => ({ ...p, facebookUrl: e.target.value }))}
                            className="w-full border border-emerald-400 rounded-lg px-3 py-1.5 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">URL Gambar / Muat Naik</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={editingInfoData.imageUrl || ''}
                              onChange={(e) => setEditingInfoData((p) => ({ ...p, imageUrl: e.target.value }))}
                              className="flex-1 border border-emerald-400 rounded-lg px-3 py-1.5 text-xs"
                            />
                            <label className="cursor-pointer bg-emerald-50 border border-emerald-300 text-emerald-700 font-bold px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1 shrink-0">
                              <Upload className="w-3.5 h-3.5" /> Tukar
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const base64 = await compressImageFile(file, 1000, 1400, 0.85);
                                    if (base64) setEditingInfoData((p) => ({ ...p, imageUrl: base64 }));
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">Pautan Klik Gambar</label>
                          <input
                            type="text"
                            value={editingInfoData.linkUrl || ''}
                            onChange={(e) => setEditingInfoData((p) => ({ ...p, linkUrl: e.target.value }))}
                            className="w-full border border-emerald-400 rounded-lg px-3 py-1.5 text-xs"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleSaveEditInfo(inf.id)}
                          className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" /> Simpan
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingInfoId(null)}
                          className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" /> Batal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <img
                          src={inf.imageUrl}
                          alt={inf.title}
                          className="w-20 h-20 object-contain rounded-lg bg-slate-100 border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0 flex-1 space-y-1">
                          <h6 className="font-bold text-slate-900 text-sm">{inf.title}</h6>
                          {inf.linkUrl && (
                            <p className="text-xs text-blue-600 truncate flex items-center gap-1">
                              <ExternalLink className="w-3 h-3 shrink-0" /> {inf.linkUrl}
                            </p>
                          )}
                          {inf.facebookUrl && (
                            <p className="text-[11px] text-slate-500 truncate">FB: {inf.facebookUrl}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingInfoId(inf.id);
                            setEditingInfoData(inf);
                          }}
                          className="p-2 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition cursor-pointer"
                          title="Edit Info"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteInfo(inf.id)}
                          className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="Padam Info"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 4: MATA PELAJARAN DITAWARKAN (MENENGAH BAWAH / ATAS)
         ========================================================= */}
      {activeSubTab === 'SUBJEK' && (
        <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200/80 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSubjekLevelTab('BAWAH')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                  subjekLevelTab === 'BAWAH'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Menengah Bawah (Tingkatan 1 - 3)
              </button>
              <button
                type="button"
                onClick={() => setSubjekLevelTab('ATAS')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                  subjekLevelTab === 'ATAS'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Menengah Atas (Tingkatan 4 - 5)
              </button>
            </div>

            <button
              type="button"
              onClick={() =>
                persistPartial(
                  {
                    subjekMenengahBawah: DEFAULT_SUBJEK_MENENGAH_BAWAH,
                    subjekMenengahAtas: DEFAULT_SUBJEK_MENENGAH_ATAS,
                  },
                  'Senarai mata pelajaran diset semula!'
                )
              }
              className="text-xs font-bold text-slate-600 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 px-3 py-1.5 rounded-lg flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Set Semula Semua Subjek
            </button>
          </div>

          {/* Tambah Kategori Baharu */}
          <form onSubmit={handleAddKategori} className="flex gap-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <input
              type="text"
              value={newKategoriName}
              onChange={(e) => setNewKategoriName(e.target.value)}
              placeholder={`Tambah Kategori Baharu (${subjekLevelTab === 'BAWAH' ? 'Menengah Bawah' : 'Menengah Atas'}) cth: Elektif`}
              className="flex-1 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm bg-white"
            />
            <button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Tambah Kategori
            </button>
          </form>

          {/* Senarai Kategori & Subjek */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentSubjekList.map((kat) => {
              const isEditingKat = editingKategoriId === kat.id;
              return (
                <div
                  key={kat.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Header Kategori */}
                    <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                      {isEditingKat ? (
                        <div className="flex items-center gap-1.5 flex-1">
                          <input
                            type="text"
                            value={editingKategoriName}
                            onChange={(e) => setEditingKategoriName(e.target.value)}
                            className="w-full border border-emerald-400 rounded-lg px-2.5 py-1 text-xs font-bold bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveKategoriName(kat.id)}
                            className="p-1.5 bg-emerald-600 text-white rounded-lg cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingKategoriId(null)}
                            className="p-1.5 bg-slate-200 text-slate-600 rounded-lg cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <h6 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                            <span
                              className={`w-2 h-4 rounded-full ${
                                subjekLevelTab === 'BAWAH' ? 'bg-emerald-600' : 'bg-blue-600'
                              }`}
                            ></span>
                            {kat.kategori}
                          </h6>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingKategoriId(kat.id);
                                setEditingKategoriName(kat.kategori);
                              }}
                              className="p-1 text-slate-400 hover:text-emerald-700 rounded cursor-pointer"
                              title="Edit Kategori"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteKategori(kat.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                              title="Padam Kategori"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Senarai Subjek Dalam Kategori */}
                    <div className="space-y-1.5">
                      {(kat.subjek || []).map((subj, idx) => {
                        const key = `${kat.id}_${idx}`;
                        const isEditingSubj = editingSubjekKey === key;
                        return (
                          <div
                            key={key}
                            className="flex items-center justify-between gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200/80 text-xs"
                          >
                            {isEditingSubj ? (
                              <div className="flex items-center gap-1.5 flex-1">
                                <input
                                  type="text"
                                  value={editingSubjekValue}
                                  onChange={(e) => setEditingSubjekValue(e.target.value)}
                                  className="w-full border border-emerald-400 rounded px-2 py-1 text-xs font-semibold"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleSaveSubjekInKategori(kat.id, idx)}
                                  className="p-1 bg-emerald-600 text-white rounded cursor-pointer"
                                >
                                  <Check className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingSubjekKey(null)}
                                  className="p-1 bg-slate-200 text-slate-600 rounded cursor-pointer"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <>
                                <span className="font-semibold text-slate-700">&bull; {subj}</span>
                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingSubjekKey(key);
                                      setEditingSubjekValue(subj);
                                    }}
                                    className="p-1 text-slate-400 hover:text-emerald-700 rounded cursor-pointer"
                                    title="Edit Subjek"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteSubjekFromKategori(kat.id, idx)}
                                    className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                                    title="Padam Subjek"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Input Tambah Subjek */}
                  <div className="flex gap-1.5 pt-2 border-t border-slate-200/80">
                    <input
                      type="text"
                      value={newSubjekInput[kat.id] || ''}
                      onChange={(e) => setNewSubjekInput((p) => ({ ...p, [kat.id]: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSubjekToKategori(kat.id);
                        }
                      }}
                      placeholder="Tambah subjek..."
                      className="flex-1 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddSubjekToKategori(kat.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 5: PANDUAN PERMOHONAN KEMASUKAN
         ========================================================= */}
      {activeSubTab === 'PANDUAN' && (
        <div className="space-y-5">
          {/* A. Syarat-Syarat Permohonan Kemasukan */}
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h5 className="font-bold text-slate-900 text-sm sm:text-base">
                  A. Syarat-Syarat Permohonan Kemasukan
                </h5>
                <p className="text-xs text-slate-500">
                  Senarai syarat kelayakan yang dipaparkan pada halaman Panduan Permohonan.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  persistPartial(
                    { panduanSyaratItems: DEFAULT_PANDUAN_SYARAT_ITEMS },
                    'Syarat permohonan diset semula!'
                  )
                }
                className="text-xs font-bold text-slate-600 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 px-3 py-1.5 rounded-lg flex items-center gap-1 self-start sm:self-auto cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Set Semula Syarat
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newSyaratText}
                onChange={(e) => setNewSyaratText(e.target.value)}
                placeholder="Tambah syarat baharu..."
                className="flex-1 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm bg-slate-50 focus:bg-white"
              />
              <button
                type="button"
                onClick={async () => {
                  if (!newSyaratText.trim()) return;
                  const next = [...syaratItems, { id: 'sy_' + Date.now(), text: newSyaratText.trim() }];
                  setNewSyaratText('');
                  await persistPartial({ panduanSyaratItems: next }, 'Syarat ditambah!');
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Tambah
              </button>
            </div>

            <div className="space-y-2">
              {syaratItems.map((sy, idx) => {
                const isEditing = editingSyaratId === sy.id;
                return (
                  <div
                    key={sy.id}
                    className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3"
                  >
                    {isEditing ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          value={editingSyaratText}
                          onChange={(e) => setEditingSyaratText(e.target.value)}
                          className="flex-1 border border-emerald-400 rounded-lg px-3 py-1.5 text-xs sm:text-sm"
                        />
                        <button
                          type="button"
                          onClick={async () => {
                            if (!editingSyaratText.trim()) return;
                            const next = syaratItems.map((i) =>
                              i.id === sy.id ? { ...i, text: editingSyaratText.trim() } : i
                            );
                            setEditingSyaratId(null);
                            await persistPartial({ panduanSyaratItems: next }, 'Syarat dikemaskini!');
                          }}
                          className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                        >
                          Simpan
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingSyaratId(null)}
                          className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                        >
                          Batal
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-xs sm:text-sm text-slate-800 font-medium">
                          <strong>{idx + 1}.</strong> {sy.text}
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingSyaratId(sy.id);
                              setEditingSyaratText(sy.text);
                            }}
                            className="p-1.5 text-slate-400 hover:text-emerald-700 rounded-lg cursor-pointer"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              const next = syaratItems.filter((i) => i.id !== sy.id);
                              await persistPartial({ panduanSyaratItems: next }, 'Syarat dipadam!');
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* B. Langkah-Langkah Proses Permohonan */}
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h5 className="font-bold text-slate-900 text-sm sm:text-base">
                  B. Langkah-Langkah Proses Kemasukan
                </h5>
                <p className="text-xs text-slate-500">
                  Tambah, kemaskini atau padam langkah proses kemasukan pada halaman Panduan.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  persistPartial(
                    { panduanLangkahItems: DEFAULT_PANDUAN_LANGKAH_ITEMS },
                    'Langkah panduan diset semula!'
                  )
                }
                className="text-xs font-bold text-slate-600 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 px-3 py-1.5 rounded-lg flex items-center gap-1 self-start sm:self-auto cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Set Semula Langkah
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-4">
                  <input
                    type="text"
                    value={newLangkahTitle}
                    onChange={(e) => setNewLangkahTitle(e.target.value)}
                    placeholder="Tajuk Langkah (cth: Langkah 5: Lapor Diri)"
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm bg-white"
                  />
                </div>
                <div className="sm:col-span-6">
                  <input
                    type="text"
                    value={newLangkahDesc}
                    onChange={(e) => setNewLangkahDesc(e.target.value)}
                    placeholder="Huraian langkah..."
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm bg-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="button"
                    onClick={async () => {
                      if (!newLangkahTitle.trim() || !newLangkahDesc.trim()) return;
                      const next = [
                        ...langkahItems,
                        {
                          id: 'lk_' + Date.now(),
                          title: newLangkahTitle.trim(),
                          description: newLangkahDesc.trim(),
                        },
                      ];
                      setNewLangkahTitle('');
                      setNewLangkahDesc('');
                      await persistPartial({ panduanLangkahItems: next }, 'Langkah ditambah!');
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Tambah
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              {langkahItems.map((lk) => {
                const isEditing = editingLangkahId === lk.id;
                return (
                  <div key={lk.id} className="p-3.5 rounded-xl border border-slate-200 bg-white">
                    {isEditing ? (
                      <div className="space-y-2.5">
                        <input
                          type="text"
                          value={editingLangkahTitle}
                          onChange={(e) => setEditingLangkahTitle(e.target.value)}
                          className="w-full border border-emerald-400 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-bold"
                        />
                        <textarea
                          rows={2}
                          value={editingLangkahDesc}
                          onChange={(e) => setEditingLangkahDesc(e.target.value)}
                          className="w-full border border-emerald-400 rounded-lg px-3 py-1.5 text-xs sm:text-sm"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={async () => {
                              if (!editingLangkahTitle.trim()) return;
                              const next = langkahItems.map((i) =>
                                i.id === lk.id
                                  ? {
                                      ...i,
                                      title: editingLangkahTitle.trim(),
                                      description: editingLangkahDesc.trim(),
                                    }
                                  : i
                              );
                              setEditingLangkahId(null);
                              await persistPartial({ panduanLangkahItems: next }, 'Langkah dikemaskini!');
                            }}
                            className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                          >
                            Simpan
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingLangkahId(null)}
                            className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                          >
                            Batal
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h6 className="font-bold text-slate-900 text-sm">{lk.title}</h6>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{lk.description}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingLangkahId(lk.id);
                              setEditingLangkahTitle(lk.title);
                              setEditingLangkahDesc(lk.description);
                            }}
                            className="p-1.5 text-slate-400 hover:text-emerald-700 rounded-lg cursor-pointer"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              const next = langkahItems.filter((i) => i.id !== lk.id);
                              await persistPartial({ panduanLangkahItems: next }, 'Langkah dipadam!');
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* C. Dokumen Diperlukan Semasa Mengisi Borang */}
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h5 className="font-bold text-slate-900 text-sm sm:text-base">
                  C. Dokumen Diperlukan Semasa Mengisi Borang
                </h5>
                <p className="text-xs text-slate-500">
                  Senarai dokumen persediaan calon sebelum mengisi borang permohonan.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  persistPartial(
                    { panduanDokumenItems: DEFAULT_PANDUAN_DOKUMEN_ITEMS },
                    'Senarai dokumen diset semula!'
                  )
                }
                className="text-xs font-bold text-slate-600 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 px-3 py-1.5 rounded-lg flex items-center gap-1 self-start sm:self-auto cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Set Semula Dokumen
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newDokumenText}
                onChange={(e) => setNewDokumenText(e.target.value)}
                placeholder="Tambah dokumen diperlukan..."
                className="flex-1 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm bg-slate-50 focus:bg-white"
              />
              <button
                type="button"
                onClick={async () => {
                  if (!newDokumenText.trim()) return;
                  const next = [...dokumenItems, { id: 'dk_' + Date.now(), text: newDokumenText.trim() }];
                  setNewDokumenText('');
                  await persistPartial({ panduanDokumenItems: next }, 'Dokumen ditambah!');
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Tambah
              </button>
            </div>

            <div className="space-y-2">
              {dokumenItems.map((dk, idx) => {
                const isEditing = editingDokumenId === dk.id;
                return (
                  <div
                    key={dk.id}
                    className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3"
                  >
                    {isEditing ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          value={editingDokumenText}
                          onChange={(e) => setEditingDokumenText(e.target.value)}
                          className="flex-1 border border-emerald-400 rounded-lg px-3 py-1.5 text-xs sm:text-sm"
                        />
                        <button
                          type="button"
                          onClick={async () => {
                            if (!editingDokumenText.trim()) return;
                            const next = dokumenItems.map((i) =>
                              i.id === dk.id ? { ...i, text: editingDokumenText.trim() } : i
                            );
                            setEditingDokumenId(null);
                            await persistPartial({ panduanDokumenItems: next }, 'Dokumen dikemaskini!');
                          }}
                          className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                        >
                          Simpan
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingDokumenId(null)}
                          className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                        >
                          Batal
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-xs sm:text-sm text-slate-800 font-medium">
                          <strong>{idx + 1}.</strong> {dk.text}
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingDokumenId(dk.id);
                              setEditingDokumenText(dk.text);
                            }}
                            className="p-1.5 text-slate-400 hover:text-emerald-700 rounded-lg cursor-pointer"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              const next = dokumenItems.filter((i) => i.id !== dk.id);
                              await persistPartial({ panduanDokumenItems: next }, 'Dokumen dipadam!');
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* D. Muat Naik Gambar / Infografik Panduan */}
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200/80 shadow-2xs space-y-4">
            <div>
              <h5 className="font-bold text-slate-900 text-sm sm:text-base">
                D. Poster / Infografik Panduan Tambahan
              </h5>
              <p className="text-xs text-slate-500">
                Tambah atau padam poster carta alir pada halaman Panduan Permohonan.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const title = fd.get('title') as string;
                const file = fd.get('image') as File;
                if (title && file && file.size > 0) {
                  compressImageFile(file, 1000, 1400, 0.8)
                    .then((url) => {
                      addInfographic({ id: Math.random().toString(36).substring(7), title, url });
                      showSavedNotice('Poster panduan dimuat naik!');
                    })
                    .catch((err) => console.error('Ralat infografik:', err));
                }
                e.currentTarget.reset();
              }}
              className="flex flex-col sm:flex-row gap-3 sm:items-end bg-slate-50 p-4 rounded-xl border border-slate-200"
            >
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-600 mb-1">Tajuk Poster / Infografik</label>
                <input
                  type="text"
                  name="title"
                  required
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm bg-white"
                  placeholder="Contoh: Carta Alir Temuduga"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-600 mb-1">Pilih Fail Imej</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  required
                  className="w-full border border-slate-300 rounded-xl px-3 py-1.5 text-xs bg-white file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700"
                />
              </div>
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl text-xs sm:text-sm transition cursor-pointer shrink-0"
              >
                Muat Naik
              </button>
            </form>

            {infographics && infographics.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pt-2">
                {infographics.map((info) => (
                  <div
                    key={info.id}
                    className="relative rounded-xl overflow-hidden border border-slate-200 shadow-2xs group bg-white"
                  >
                    <img src={info.url} alt={info.title} className="w-full h-32 object-cover bg-slate-50" />
                    <div className="p-2.5 bg-white text-center">
                      <h4 className="text-xs font-bold text-slate-800 truncate">{info.title}</h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteInfographic(info.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-90 hover:opacity-100 transition-opacity cursor-pointer"
                      title="Padam Poster"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
