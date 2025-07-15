/**
 * Advanced Umami Analytics Implementation
 * Tracks form interactions, user engagement, and conversion metrics
 */

// Umami tracking interface
declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, any>) => void;
    };
  }
}

// Analytics event types
export const ANALYTICS_EVENTS = {
  // Form tracking
  FORM_START: 'form_start',
  FORM_FIELD_FOCUS: 'form_field_focus',
  FORM_FIELD_BLUR: 'form_field_blur',
  FORM_FIELD_ERROR: 'form_field_error',
  FORM_VALIDATION_ERROR: 'form_validation_error',
  FORM_PROJECT_SELECTED: 'form_project_selected',
  FORM_SUBMIT_ATTEMPT: 'form_submit_attempt',
  FORM_SUBMIT_SUCCESS: 'form_submit_success',
  FORM_SUBMIT_ERROR: 'form_submit_error',
  FORM_ABANDON: 'form_abandon',
  
  // Navigation tracking
  SCROLL_DEPTH: 'scroll_depth',
  SECTION_VIEW: 'section_view',
  PROJECT_CLICK: 'project_click',
  CV_DOWNLOAD: 'cv_download',
  EXTERNAL_LINK: 'external_link',
  
  // Performance tracking
  PAGE_LOAD_TIME: 'page_load_time',
  FORM_COMPLETION_TIME: 'form_completion_time',
  USER_ENGAGEMENT: 'user_engagement',
  ERROR_OCCURRED: 'error_occurred',
} as const;

// Analytics data interface
interface AnalyticsData {
  [key: string]: string | number | boolean;
}

// Form tracking state
interface FormTrackingState {
  startTime: number;
  fieldsInteracted: Set<string>;
  projectTypesSelected: string[];
  errorCount: number;
  hasSubmitted: boolean;
  hasAbandoned: boolean;
}

export class UmamiAnalytics {
  private isEnabled: boolean = false;
  private formState: FormTrackingState | null = null;
  private pageLoadTime: number = Date.now();
  private scrollThresholds: Set<number> = new Set();
  private engagementTimer: number | null = null;
  private lastActivityTime: number = Date.now();

  constructor() {
    this.init();
  }

  private init(): void {
    // Check if Umami is available
    if (typeof window !== 'undefined' && window.umami) {
      this.isEnabled = true;
      this.setupPerformanceTracking();
      this.setupScrollTracking();
      this.setupEngagementTracking();
      this.track(ANALYTICS_EVENTS.PAGE_LOAD_TIME, {
        load_time: Date.now() - this.pageLoadTime,
        page: window.location.pathname,
      });
    }
  }

  /**
   * Main tracking method
   */
  public track(event: string, data: AnalyticsData = {}): void {
    if (!this.isEnabled || !window.umami) return;

    try {
      // Ensure event name is within 50 character limit
      const eventName = event.length > 50 ? event.substring(0, 50) : event;
      
      // Add timestamp and page context
      const enrichedData = {
        ...data,
        timestamp: Date.now(),
        page: window.location.pathname,
        user_agent: navigator.userAgent.substring(0, 100), // Truncate for storage
        screen_size: `${window.screen.width}x${window.screen.height}`,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
      };

      window.umami.track(eventName, enrichedData);
    } catch (error) {
      console.warn('Umami tracking error:', error);
    }
  }

  /**
   * Form tracking methods
   */
  public trackFormStart(formId: string): void {
    if (this.formState?.hasSubmitted) return; // Don't track if already submitted

    this.formState = {
      startTime: Date.now(),
      fieldsInteracted: new Set(),
      projectTypesSelected: [],
      errorCount: 0,
      hasSubmitted: false,
      hasAbandoned: false,
    };

    this.track(ANALYTICS_EVENTS.FORM_START, {
      form_id: formId,
      referrer: document.referrer,
      utm_source: this.getUTMParam('utm_source'),
      utm_medium: this.getUTMParam('utm_medium'),
      utm_campaign: this.getUTMParam('utm_campaign'),
    });
  }

  public trackFormFieldInteraction(fieldName: string, action: 'focus' | 'blur' | 'error'): void {
    if (!this.formState || this.formState.hasSubmitted) return;

    this.formState.fieldsInteracted.add(fieldName);
    
    const eventMap = {
      focus: ANALYTICS_EVENTS.FORM_FIELD_FOCUS,
      blur: ANALYTICS_EVENTS.FORM_FIELD_BLUR,
      error: ANALYTICS_EVENTS.FORM_FIELD_ERROR,
    };

    if (action === 'error') {
      this.formState.errorCount++;
    }

    this.track(eventMap[action], {
      field_name: fieldName,
      fields_interacted: this.formState.fieldsInteracted.size,
      total_errors: this.formState.errorCount,
      time_since_start: Date.now() - this.formState.startTime,
    });
  }

  public trackFormValidationError(fieldName: string, errorMessage: string): void {
    if (!this.formState || this.formState.hasSubmitted) return;

    this.formState.errorCount++;
    
    this.track(ANALYTICS_EVENTS.FORM_VALIDATION_ERROR, {
      field_name: fieldName,
      error_message: errorMessage.substring(0, 100),
      total_errors: this.formState.errorCount,
      time_since_start: Date.now() - this.formState.startTime,
    });
  }

  public trackProjectTypeSelection(selectedTypes: string[]): void {
    if (!this.formState || this.formState.hasSubmitted) return;

    this.formState.projectTypesSelected = selectedTypes;
    
    this.track(ANALYTICS_EVENTS.FORM_PROJECT_SELECTED, {
      selected_types: selectedTypes.join(','),
      selection_count: selectedTypes.length,
      time_since_start: Date.now() - this.formState.startTime,
    });
  }

  public trackFormSubmissionAttempt(): void {
    if (!this.formState || this.formState.hasSubmitted) return;

    this.track(ANALYTICS_EVENTS.FORM_SUBMIT_ATTEMPT, {
      completion_time: Date.now() - this.formState.startTime,
      fields_interacted: this.formState.fieldsInteracted.size,
      project_types: this.formState.projectTypesSelected.join(','),
      error_count: this.formState.errorCount,
    });
  }

  public trackFormSubmissionSuccess(): void {
    if (!this.formState || this.formState.hasSubmitted) return;

    this.formState.hasSubmitted = true;
    
    this.track(ANALYTICS_EVENTS.FORM_SUBMIT_SUCCESS, {
      completion_time: Date.now() - this.formState.startTime,
      fields_interacted: this.formState.fieldsInteracted.size,
      project_types: this.formState.projectTypesSelected.join(','),
      error_count: this.formState.errorCount,
    });

    // Track completion time separately for analysis
    this.track(ANALYTICS_EVENTS.FORM_COMPLETION_TIME, {
      completion_time: Date.now() - this.formState.startTime,
      success: true,
    });
  }

  public trackFormSubmissionError(errorMessage: string): void {
    if (!this.formState || this.formState.hasSubmitted) return;

    this.track(ANALYTICS_EVENTS.FORM_SUBMIT_ERROR, {
      error_message: errorMessage.substring(0, 100),
      completion_time: Date.now() - this.formState.startTime,
      fields_interacted: this.formState.fieldsInteracted.size,
      project_types: this.formState.projectTypesSelected.join(','),
      error_count: this.formState.errorCount,
    });
  }

  public trackFormAbandon(): void {
    if (!this.formState || this.formState.hasSubmitted || this.formState.hasAbandoned) return;

    this.formState.hasAbandoned = true;
    
    this.track(ANALYTICS_EVENTS.FORM_ABANDON, {
      time_spent: Date.now() - this.formState.startTime,
      fields_interacted: this.formState.fieldsInteracted.size,
      project_types: this.formState.projectTypesSelected.join(','),
      error_count: this.formState.errorCount,
      abandon_point: Array.from(this.formState.fieldsInteracted).join(','),
    });
  }

  /**
   * Navigation tracking methods
   */
  public trackProjectClick(projectId: string, projectTitle: string): void {
    this.track(ANALYTICS_EVENTS.PROJECT_CLICK, {
      project_id: projectId,
      project_title: projectTitle.substring(0, 50),
      page_section: this.getCurrentSection(),
    });
  }

  public trackCVDownload(): void {
    this.track(ANALYTICS_EVENTS.CV_DOWNLOAD, {
      download_source: this.getCurrentSection(),
      time_on_page: Date.now() - this.pageLoadTime,
    });
  }

  public trackExternalLink(url: string, linkText: string): void {
    this.track(ANALYTICS_EVENTS.EXTERNAL_LINK, {
      target_url: url,
      link_text: linkText.substring(0, 50),
      page_section: this.getCurrentSection(),
    });
  }

  /**
   * Performance tracking methods
   */
  private setupPerformanceTracking(): void {
    // Track page load performance
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        this.track(ANALYTICS_EVENTS.PAGE_LOAD_TIME, {
          load_time: navigation.loadEventEnd - navigation.loadEventStart,
          dom_content_loaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          first_paint: this.getFirstPaintTime(),
        });
      }, 100);
    });
  }

  private setupScrollTracking(): void {
    const thresholds = [25, 50, 75, 90, 100];
    
    const handleScroll = () => {
      const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
      
      thresholds.forEach(threshold => {
        if (scrollPercent >= threshold && !this.scrollThresholds.has(threshold)) {
          this.scrollThresholds.add(threshold);
          this.track(ANALYTICS_EVENTS.SCROLL_DEPTH, {
            depth_percent: threshold,
            time_to_depth: Date.now() - this.pageLoadTime,
          });
        }
      });
    };

    window.addEventListener('scroll', this.throttle(handleScroll, 250));
  }

  private setupEngagementTracking(): void {
    // Track user engagement (time spent actively on page)
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    const resetEngagementTimer = () => {
      this.lastActivityTime = Date.now();
      
      if (this.engagementTimer) {
        clearTimeout(this.engagementTimer);
      }
      
      // Track engagement every 30 seconds of activity
      this.engagementTimer = setTimeout(() => {
        this.track(ANALYTICS_EVENTS.USER_ENGAGEMENT, {
          engagement_time: 30000,
          page_section: this.getCurrentSection(),
        });
      }, 30000);
    };

    events.forEach(event => {
      document.addEventListener(event, resetEngagementTimer, { passive: true });
    });
    
    // Track when user leaves page
    window.addEventListener('beforeunload', () => {
      const totalTime = Date.now() - this.pageLoadTime;
      this.track(ANALYTICS_EVENTS.USER_ENGAGEMENT, {
        total_time: totalTime,
        active_time: Date.now() - this.lastActivityTime,
        page_section: this.getCurrentSection(),
      });
      
      // Track form abandon if applicable
      if (this.formState && !this.formState.hasSubmitted) {
        this.trackFormAbandon();
      }
    });
  }

  /**
   * Utility methods
   */
  private getCurrentSection(): string {
    const sections = document.querySelectorAll('section[id]');
    
    for (const section of sections) {
      const rect = section.getBoundingClientRect();
      if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
        return section.id;
      }
    }
    
    return 'unknown';
  }

  private getUTMParam(param: string): string {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param) || '';
  }

  private getFirstPaintTime(): number {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    return firstPaint ? firstPaint.startTime : 0;
  }

  private throttle(func: Function, delay: number): Function {
    let timeoutId: number;
    let lastExecTime = 0;
    
    return function (this: any, ...args: any[]) {
      const currentTime = Date.now();
      
      if (currentTime - lastExecTime > delay) {
        func.apply(this, args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(this, args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  }
}

// Global analytics instance
export const analytics = new UmamiAnalytics();