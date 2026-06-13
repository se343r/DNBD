import { useState, useEffect } from 'react';

export function useTypewriter(words, typeSpeed = 100, eraseSpeed = 50, delay = 2000) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!words || words.length === 0) return;

    let timer;
    const fullWord = words[currentWordIndex];

    if (!isDeleting) {
      // Typing
      timer = setTimeout(() => {
        setCurrentText(fullWord.substring(0, currentText.length + 1));
      }, typeSpeed);

      if (currentText === fullWord) {
        // Pause before deleting
        clearTimeout(timer);
        timer = setTimeout(() => setIsDeleting(true), delay);
      }
    } else {
      // Erasing
      timer = setTimeout(() => {
        setCurrentText(fullWord.substring(0, currentText.length - 1));
      }, eraseSpeed);

      if (currentText === '') {
        setIsDeleting(false);
        // Move to the next word
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
      }
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, words, typeSpeed, eraseSpeed, delay]);

  return currentText;
}
