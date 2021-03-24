import { RefObject, useEffect } from 'react';

const useOutsideClick = (
  ref: RefObject<HTMLInputElement>,
  excludeRef: RefObject<HTMLInputElement>,
  onOutsideClick: () => void,
): void => {
  useEffect(() => {
    const handleOutsideClick = (event: any): void => {
      if (ref.current.contains(event.target) || excludeRef.current.contains(event.target)) {
        return;
      }

      event.stopPropagation();
      onOutsideClick();
    };

    document.addEventListener('click', handleOutsideClick, false);

    return (): void => {
      document.removeEventListener('click', handleOutsideClick, false);
    };
  }, [ref, excludeRef, onOutsideClick]);
};

export default useOutsideClick;
