/**
 * Page-wide analytics tracking
 * Tracks navigation, project interactions, and other page events
 */

import { analytics } from './umami-analytics';

export class PageAnalytics {
  private static instance: PageAnalytics;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): PageAnalytics {
    if (!PageAnalytics.instance) {
      PageAnalytics.instance = new PageAnalytics();
    }
    return PageAnalytics.instance;
  }

  public init(): void {
    if (this.isInitialized) return;
    
    this.setupProjectTracking();
    this.setupCVDownloadTracking();
    this.setupExternalLinkTracking();
    this.setupGenericElementTracking();
    
    this.isInitialized = true;
  }

  /**
   * Track project card clicks
   */
  private setupProjectTracking(): void {
    // Track project card clicks
    document.addEventListener('click', (e) => {
      const projectCard = (e.target as HTMLElement).closest('[data-project-id]');
      if (projectCard) {
        const projectId = projectCard.getAttribute('data-project-id');
        const projectTitle = projectCard.getAttribute('data-project-title') || 'Unknown';
        
        if (projectId) {
          analytics.trackProjectClick(projectId, projectTitle);
        }
      }
    });
  }

  /**
   * Track CV download clicks
   */
  private setupCVDownloadTracking(): void {
    document.addEventListener('click', (e) => {
      const link = (e.target as HTMLElement).closest('a[href*="cv.pdf"], a[href*="CV.pdf"], a[href*="resume"]');
      if (link) {
        analytics.trackCVDownload();
      }
    });
  }

  /**
   * Track external link clicks
   */
  private setupExternalLinkTracking(): void {
    document.addEventListener('click', (e) => {
      const link = (e.target as HTMLElement).closest('a[href]') as HTMLAnchorElement;
      if (link && link.href) {
        // Check if it's an external link
        const isExternal = link.hostname !== window.location.hostname;
        const isMailto = link.href.startsWith('mailto:');
        const isTel = link.href.startsWith('tel:');
        
        if (isExternal || isMailto || isTel) {
          const linkText = link.textContent?.trim() || link.getAttribute('aria-label') || 'No text';
          analytics.trackExternalLink(link.href, linkText);
        }
      }
    });
  }

  /**
   * Track generic elements with data-umami-event attributes
   */
  private setupGenericElementTracking(): void {
    document.addEventListener('click', (e) => {
      const element = e.target as HTMLElement;
      const trackingElement = element.closest('[data-umami-event]') as HTMLElement;
      
      if (trackingElement) {
        const eventName = trackingElement.getAttribute('data-umami-event');
        if (eventName) {
          // Collect all data-umami-event-* attributes
          const eventData: Record<string, string> = {};
          
          Array.from(trackingElement.attributes).forEach(attr => {
            if (attr.name.startsWith('data-umami-event-')) {
              const key = attr.name.replace('data-umami-event-', '');
              eventData[key] = attr.value;
            }
          });
          
          analytics.track(eventName, eventData);
        }
      }
    });
  }
}

// Auto-initialize when DOM is ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      PageAnalytics.getInstance().init();
    });
  } else {
    PageAnalytics.getInstance().init();
  }
}

export const pageAnalytics = PageAnalytics.getInstance();