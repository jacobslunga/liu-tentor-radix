import { useEffect } from "react";

interface MetaData {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  canonical?: string;
  robots?: string;
}

export const useMetadata = (metadata: MetaData) => {
  useEffect(() => {
    const cleanup: (() => void)[] = [];

    if (metadata.title) {
      const originalTitle = document.title;
      document.title = metadata.title;
      cleanup.push(() => {
        document.title = originalTitle;
      });
    }

    const setMetaTag = (name: string, content: string, property?: boolean) => {
      const selector = property
        ? `meta[property="${name}"]`
        : `meta[name="${name}"]`;
      let tag = document.querySelector(selector) as HTMLMetaElement;
      let isNew = false;

      if (!tag) {
        tag = document.createElement("meta");
        if (property) {
          tag.setAttribute("property", name);
        } else {
          tag.setAttribute("name", name);
        }
        document.head.appendChild(tag);
        isNew = true;
      }

      const originalContent = tag.getAttribute("content");
      tag.setAttribute("content", content);

      cleanup.push(() => {
        if (isNew) {
          tag.remove();
        } else if (originalContent) {
          tag.setAttribute("content", originalContent);
        }
      });
    };

    if (metadata.description) {
      setMetaTag("description", metadata.description);
    }

    if (metadata.keywords) {
      setMetaTag("keywords", metadata.keywords);
    }

    if (metadata.ogTitle) {
      setMetaTag("og:title", metadata.ogTitle, true);
    }

    if (metadata.ogDescription) {
      setMetaTag("og:description", metadata.ogDescription, true);
    }

    if (metadata.ogType) {
      setMetaTag("og:type", metadata.ogType, true);
    }

    if (metadata.twitterCard) {
      setMetaTag("twitter:card", metadata.twitterCard);
    }

    if (metadata.twitterTitle) {
      setMetaTag("twitter:title", metadata.twitterTitle);
    }

    if (metadata.twitterDescription) {
      setMetaTag("twitter:description", metadata.twitterDescription);
    }

    if (metadata.robots) {
      setMetaTag("robots", metadata.robots);
    }

    if (metadata.canonical) {
      let canonicalTag = document.querySelector(
        'link[rel="canonical"]'
      ) as HTMLLinkElement;
      let isNewCanonical = false;

      if (!canonicalTag) {
        canonicalTag = document.createElement("link");
        canonicalTag.setAttribute("rel", "canonical");
        document.head.appendChild(canonicalTag);
        isNewCanonical = true;
      }

      const originalHref = canonicalTag.getAttribute("href");
      canonicalTag.setAttribute("href", metadata.canonical);

      cleanup.push(() => {
        if (isNewCanonical) {
          canonicalTag.remove();
        } else if (originalHref) {
          canonicalTag.setAttribute("href", originalHref);
        }
      });
    }

    return () => {
      cleanup.forEach((fn) => fn());
    };
  }, [
    metadata.title,
    metadata.description,
    metadata.keywords,
    metadata.ogTitle,
    metadata.ogDescription,
    metadata.ogType,
    metadata.twitterCard,
    metadata.twitterTitle,
    metadata.twitterDescription,
    metadata.canonical,
    metadata.robots,
  ]);
};

export const usePageTitle = (title: string) => {
  useEffect(() => {
    const originalTitle = document.title;
    document.title = title;

    return () => {
      document.title = originalTitle;
    };
  }, [title]);
};
