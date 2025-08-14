import { useEffect } from "react";

interface UsePageTitleProps {
  title: string;
  baseName?: string;
}

export const usePageTitle = ({
  title,
  baseName = "Demarco",
}: UsePageTitleProps) => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${baseName} - ${title}`;

    return () => {
      document.title = previousTitle;
    };
  }, [title, baseName]);
};
