import { useState, useRef } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { Button } from './button';
import { uploadImageToImgBB, validateImageFile } from '@/lib/uploadImage';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label = 'Загрузить фото' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Валидация
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Ошибка валидации файла');
      return;
    }

    setUploading(true);

    try {
      const url = await uploadImageToImgBB(file);
      onChange(url);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="w-full"
      >
        {uploading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Загрузка...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 mr-2" />
            {label}
          </>
        )}
      </Button>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {value && !uploading && (
        <div className="relative w-full h-32 rounded-lg overflow-hidden border">
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
}

