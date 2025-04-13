export const stripHtml = (html: string) => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

export const getWordCount = (content: string) => {
  const text = stripHtml(content);
  const words = text.trim().split(/\s+/);
  return words.length > 0 && words[0] !== '' ? words.length : 0;
};

export const getCharacterCount = (content: string) => {
  const text = stripHtml(content);
  return text.length;
};

export interface WordStats {
  wordCount: number;
  characterCount: number;
  averageWordLength: number;
}

export const getWordStats = (content: string): WordStats => {
  const text = stripHtml(content);
  const wordCount = getWordCount(text);
  const characterCount = getCharacterCount(text);
  const averageWordLength = wordCount > 0 ? characterCount / wordCount : 0;

  return {
    wordCount,
    characterCount,
    averageWordLength: Math.round(averageWordLength * 10) / 10
  };
}; 