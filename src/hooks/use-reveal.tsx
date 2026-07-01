import { useEffect, useRef, useState, type ReactNode, type ElementType } from "react";

/**
 * useReveal — dispara `is-visible` quando o elemento entra na viewport.
 * Uma única vez (once), respeitando prefers-reduced-motion via CSS.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(rootMargin = "0px 0px -10% 0px") {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            obs.disconnect();
            break;
          }
        }
      },
      { rootMargin, threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [rootMargin]);

  return { ref, visible };
}

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  stagger?: boolean;
  id?: string;
};

/**
 * Wrapper de conveniência: aplica `.reveal` (ou `.reveal-stagger`) e liga `is-visible`
 * quando entra na viewport.
 */
export function Reveal({ children, as, className = "", stagger = false, id }: RevealProps) {
  const Tag = (as ?? "div") as ElementType;
  const { ref, visible } = useReveal<HTMLElement>();
  const base = stagger ? "reveal-stagger" : "reveal";
  return (
    <Tag ref={ref} id={id} className={`${base} ${visible ? "is-visible" : ""} ${className}`.trim()}>
      {children}
    </Tag>
  );
}
