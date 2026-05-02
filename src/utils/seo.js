import { useEffect } from 'react';

function ensureMeta(name, attr = 'name') {
  let tag = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, name);
    document.head.appendChild(tag);
  }
  return tag;
}

export function useDocumentMeta({ title, description }) {
  useEffect(() => {
    if (title) document.title = title;
    if (description) {
      ensureMeta('description').setAttribute('content', description);
      ensureMeta('og:description', 'property').setAttribute('content', description);
    }
    if (title) ensureMeta('og:title', 'property').setAttribute('content', title);
  }, [description, title]);
}
