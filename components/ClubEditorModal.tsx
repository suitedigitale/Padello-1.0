
import React, { useState, useEffect, useRef } from 'react';
import { X, Save, MapPin, Image as ImageIcon, Upload, Camera, Check } from 'lucide-react';
import { Button } from './Button';
import { Club } from '../types';

interface ClubEditorModalProps {
  club?: Club; // If provided, we are editing
  onClose: () => void;
  onSave: (clubData: Omit<Club, 'id'> & { id?: string }) => void;
}

const PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1624896740635-c3f2d2595f51?q=80&w=400&auto=format&fit=crop', // Modern Indoor
  'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=400&auto=format&fit=crop', // Classic Outdoor
  'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?q=80&w=400&auto=format&fit=crop', // Clay/Outdoor
  'https://images.unsplash.com/photo-1560012057-4372e14c5085?q=80&w=400&auto=format&fit=crop', // Blue Court
];

type ImageSource = 'gallery' | 'upload' | 'url';

export const ClubEditorModal: React.FC<ClubEditorModalProps> = ({ club, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState('');
  const [imageSource, setImageSource] = useState<ImageSource>('gallery');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (club) {
      setName(club.name);
      setLocation(club.location);
      setImage(club.image);
      // If the image is one of the presets, default to gallery, otherwise URL or detect base64 for upload
      if (PRESET_IMAGES.includes(club.image)) {
        setImageSource('gallery');
      } else if (club.image.startsWith('data:')) {
        setImageSource('upload');
      } else {
        setImageSource('url');
      }
    } else {
      setName('');
      setLocation('');
      setImage(PRESET_IMAGES[0]);
      setImageSource('gallery');
    }
  }, [club]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !location) return;

    onSave({
      id: club?.id,
      name,
      location,
      image: image || PRESET_IMAGES[0]
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-300 max-h-[95vh] overflow-y-auto no-scrollbar">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
              {club ? 'Impostazioni Circolo' : 'Nuovo Circolo'}
            </h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Gestione Identità Reale</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl transition-all">
            <X size={20} className="text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Nome del Regno</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Es. Padel Club Roma"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all shadow-sm"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Ubicazione</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Via Roma 1, Roma"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-6 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all shadow-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Stemma Reale (Immagine)</label>
              <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
                <button 
                  type="button"
                  onClick={() => setImageSource('gallery')}
                  className={`px-2 py-1 rounded-md text-[9px] font-black uppercase transition-all ${imageSource === 'gallery' ? 'bg-white dark:bg-slate-700 text-orange-500 shadow-sm' : 'text-slate-400'}`}
                >
                  Galleria
                </button>
                <button 
                  type="button"
                  onClick={() => setImageSource('upload')}
                  className={`px-2 py-1 rounded-md text-[9px] font-black uppercase transition-all ${imageSource === 'upload' ? 'bg-white dark:bg-slate-700 text-orange-500 shadow-sm' : 'text-slate-400'}`}
                >
                  File
                </button>
                <button 
                  type="button"
                  onClick={() => setImageSource('url')}
                  className={`px-2 py-1 rounded-md text-[9px] font-black uppercase transition-all ${imageSource === 'url' ? 'bg-white dark:bg-slate-700 text-orange-500 shadow-sm' : 'text-slate-400'}`}
                >
                  URL
                </button>
              </div>
            </div>

            {/* Preview Box */}
            <div className="relative h-40 w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 shadow-inner group">
              {image ? (
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                  <ImageIcon size={40} strokeWidth={1} />
                  <span className="text-[10px] font-bold mt-2">Nessuna immagine</span>
                </div>
              )}
              {imageSource === 'upload' && (
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2"
                >
                  <Camera size={32} />
                  <span className="text-xs font-black uppercase">Cambia Immagine</span>
                </button>
              )}
            </div>

            {imageSource === 'gallery' && (
              <div className="grid grid-cols-4 gap-2 animate-in slide-in-from-top-2 duration-300">
                {PRESET_IMAGES.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setImage(url)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${image === url ? 'border-orange-500 scale-95' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                    {image === url && (
                      <div className="absolute inset-0 bg-orange-500/20 flex items-center justify-center">
                        <Check size={20} className="text-white drop-shadow-md" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {imageSource === 'upload' && (
              <div className="animate-in slide-in-from-top-2 duration-300">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  accept="image/*" 
                />
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-center gap-3 text-slate-400 hover:text-orange-500 hover:border-orange-500/50 transition-all group"
                >
                  <Upload size={20} className="group-hover:bounce" />
                  <span className="text-xs font-black uppercase">Scegli file dal dispositivo</span>
                </button>
              </div>
            )}

            {imageSource === 'url' && (
              <div className="relative animate-in slide-in-from-top-2 duration-300">
                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="url"
                  value={image.startsWith('data:') ? '' : image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://immagine.jpg..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-6 text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all shadow-sm"
                />
              </div>
            )}
          </div>

          <div className="pt-4">
             <Button type="submit" fullWidth className="h-14 rounded-2xl text-lg shadow-xl shadow-orange-500/20">
               <div className="flex items-center justify-center gap-2">
                 <Save size={20} />
                 <span className="font-black uppercase tracking-widest">{club ? 'Salva Cambiamenti' : 'Crea Circolo'}</span>
               </div>
             </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
