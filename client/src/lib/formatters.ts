/**
 * Membersihkan pertanyaan yang memiliki awalan rujukan materi menggantung
 * jika butir soal tersebut tidak memiliki lampiran materi bacaan.
 */
export const sanitizeOrphanQuestionText = (text: string, hasMaterial: boolean) => {
  if (!text) return '';
  if (hasMaterial) return text;

  let cleaned = text;

  // Pola: "Berdasarkan materi yang dipelajari mengenai "[Topik]", manakah pernyataan yang paling tepat menjelaskan konsep tersebut?"
  cleaned = cleaned.replace(
    /Berdasarkan\s+materi\s+yang\s+dipelajari\s+mengenai\s+["“](.*?)["”]\s*,\s*manakah\s+pernyataan\s+yang\s+paling\s+tepat\s+menjelaskan\s+konsep\s+tersebut\??/gi,
    'Manakah pernyataan yang paling tepat mengenai konsep "$1"?'
  );

  // Pola: "Berdasarkan materi yang dipelajari mengenai "[Topik]", manakah..."
  cleaned = cleaned.replace(
    /Berdasarkan\s+materi\s+yang\s+dipelajari\s+mengenai\s+["“](.*?)["”]\s*,\s*/gi,
    'Mengenai konsep "$1", '
  );

  // Pola awalan: "Berdasarkan materi yang dipelajari,\s*"
  cleaned = cleaned.replace(
    /Berdasarkan\s+materi\s+yang\s+dipelajari\s*,\s*/gi,
    ''
  );

  // Pola: "Berdasarkan teks/bacaan di atas,\s*"
  cleaned = cleaned.replace(
    /Berdasarkan\s+(teks|bacaan|materi)\s+(di\s+atas|tersebut)\s*,\s*/gi,
    ''
  );

  // Pastikan huruf pertama tetap kapital
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  return cleaned;
};

export const formatRichText = (text: string) => {
  if (!text) return '';
  let formatted = text
    // Replace excessive multiple newlines with underscores (e.g. OCR or placeholder gaps)
    .replace(/(_{3,}\s*\n*)+/g, ' ')
    // Replace consecutive underscores with a neat underline placeholder badge if inside a sentence
    .replace(/_{2,}/g, '<span class="inline-block border-b-2 border-slate-400 min-w-[40px] mx-1">&nbsp;</span>')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
  formatted = formatted.replace(/&lt;u&gt;(.*?)&lt;\/u&gt;/gi, '<u>$1</u>');
  formatted = formatted.replace(/&lt;span class="inline-block border-b-2 border-slate-400 min-w-\[40px\] mx-1"&gt;&amp;nbsp;&lt;\/span&gt;/g, '<span class="inline-block border-b-2 border-slate-400 min-w-[40px] mx-1">&nbsp;</span>');
  formatted = formatted.replace(/\n/g, '<br />');
  return formatted;
};


