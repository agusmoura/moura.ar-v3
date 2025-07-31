/**
 * Client-side contact form functionality
 * Optimized for performance with lazy loading and progressive enhancement
 */

// Contact form client-side functionality - optimized for performance
import { analytics } from '@lib/analytics/umami-analytics';

// Type declarations for analytics
declare global {
  function gtag(type: string, action: string, parameters?: Record<string, any>): void;
}

// Form validation rules
interface ValidationRule {
  validate: (value: string) => string | null;
  debounceTime: number;
}

const VALIDATION_RULES: Record<string, ValidationRule> = {
  name: {
    validate: (value: string): string | null => {
      if (value.length < 2) return 'El nombre debe tener al menos 2 caracteres';
      if (value.length > 50) return 'El nombre es muy largo (máximo 50 caracteres)';
      if (!/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s'-]+$/.test(value)) {
        return 'El nombre solo puede contener letras, espacios, guiones y apostrofes';
      }
      return null;
    },
    debounceTime: 500,
  },
  email: {
    validate: (value: string): string | null => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return 'Ingresá una dirección de email válida';
      if (value.length > 254) return 'El email es muy largo';
      return null;
    },
    debounceTime: 800,
  },
  message: {
    validate: (value: string): string | null => {
      if (value.length < 20) {
        return `El mensaje debe tener al menos 20 caracteres (${value.length}/20)`;
      }
      if (value.length > 500) return 'El mensaje es muy largo (máximo 500 caracteres)';
      return null;
    },
    debounceTime: 300,
  },
};

// Debounce utility
class DebounceManager {
  private timers = new Map<string, number>();

  debounce(func: Function, delay: number, key: string): void {
    const existingTimer = this.timers.get(key);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    const timerId = setTimeout(func, delay);
    this.timers.set(key, timerId);
  }

  clear(key: string): void {
    const timer = this.timers.get(key);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(key);
    }
  }
}

// Form state manager
class ContactFormManager {
  private form: HTMLFormElement;
  private submitBtn: HTMLButtonElement;
  private debounceManager = new DebounceManager();
  private isSubmitting = false;

  constructor(form: HTMLFormElement, submitBtn: HTMLButtonElement) {
    this.form = form;
    this.submitBtn = submitBtn;
    this.init();
  }

  private init(): void {
    this.captureUTMParameters();
    this.setupValidation();
    this.setupProjectTypeValidation();
    this.setupCharacterCounter();
    this.setupFormSubmission();
    this.checkFormValidity();

    // Track form initialization
    analytics.trackFormStart('contact-form');
  }

  private captureUTMParameters(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams = [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_term',
      'utm_content',
      'utm_id',
    ];

    utmParams.forEach((param) => {
      const value = urlParams.get(param);
      const field = document.getElementById(param) as HTMLInputElement;
      if (field && value) {
        field.value = value;
      }
    });
  }

  private setupValidation(): void {
    ['name', 'email', 'message'].forEach((fieldName) => {
      const field = this.form.querySelector(`[data-validate="${fieldName}"]`) as
        | HTMLInputElement
        | HTMLTextAreaElement;

      if (!field) return;

      // Focus tracking
      field.addEventListener('focus', () => {
        analytics.trackFormFieldInteraction(fieldName, 'focus');
      });

      // Blur validation (immediate feedback)
      field.addEventListener('blur', () => {
        analytics.trackFormFieldInteraction(fieldName, 'blur');
        this.validateField(fieldName, field.value, true);
        this.checkFormValidity();
      });

      // Input validation (debounced)
      field.addEventListener('input', () => {
        const rule = VALIDATION_RULES[fieldName];
        if (rule) {
          this.debounceManager.debounce(
            () => {
              this.validateField(fieldName, field.value, true);
              this.checkFormValidity();
            },
            rule.debounceTime,
            fieldName
          );
        }
      });
    });
  }

  private validateField(fieldName: string, value: string, showErrors = true): boolean {
    const rule = VALIDATION_RULES[fieldName];
    if (!rule) return false;

    const field = this.form.querySelector(`[data-validate="${fieldName}"]`);
    if (!field) return false;

    const fieldContainer = field.closest('.form-field');
    const errorElement = fieldContainer?.querySelector('.form-error');

    const error = rule.validate(value);
    const hasValue = Boolean(value && value.trim());

    // Update visual state
    if (fieldContainer) {
      fieldContainer.classList.remove('valid', 'invalid');
      if (hasValue && !error) {
        fieldContainer.classList.add('valid');
        const validationIcon = fieldContainer.querySelector('.validation-icon');
        if (validationIcon && showErrors) {
          validationIcon.classList.remove('hidden');
        }
      } else if (hasValue && error && showErrors) {
        fieldContainer.classList.add('invalid');
        const validationIcon = fieldContainer.querySelector('.validation-icon');
        if (validationIcon) {
          validationIcon.classList.add('hidden');
        }
      }
    }

    // Update error display
    if (errorElement && showErrors) {
      if (error) {
        errorElement.classList.remove('hidden');
        errorElement.classList.add('show');
        const errorSpan = errorElement.querySelector('span');
        if (errorSpan) errorSpan.textContent = error;
        errorElement.setAttribute('aria-live', 'assertive');

        // Track validation error
        analytics.trackFormFieldInteraction(fieldName, 'error');
        analytics.trackFormValidationError(fieldName, error);
      } else {
        errorElement.classList.add('hidden');
        errorElement.classList.remove('show');
        errorElement.setAttribute('aria-live', 'polite');
      }
    }

    return !error;
  }

  private setupProjectTypeValidation(): void {
    // Just listen for changes to validate - no manual manipulation
    const checkboxes = this.form.querySelectorAll(
      'input[name="project-type"]'
    ) as NodeListOf<HTMLInputElement>;

    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', () => {
        // Track project type selection
        const selectedTypes = Array.from(
          this.form.querySelectorAll(
            'input[name="project-type"]:checked'
          ) as NodeListOf<HTMLInputElement>
        ).map((cb) => cb.value);
        analytics.trackProjectTypeSelection(selectedTypes);

        this.validateProjectTypes();
        this.checkFormValidity();
      });
    });
  }

  private validateProjectTypes(): boolean {
    const checked = this.form.querySelectorAll('input[name="project-type"]:checked');
    const fieldset = this.form.querySelector('fieldset');
    const errorElement = fieldset?.querySelector('.form-error');

    const isValid = checked.length > 0;

    if (errorElement) {
      if (!isValid) {
        errorElement.classList.remove('hidden');
        errorElement.classList.add('show');
      } else {
        errorElement.classList.add('hidden');
        errorElement.classList.remove('show');
      }
    }

    return isValid;
  }

  private setupCharacterCounter(): void {
    const messageField = this.form.querySelector('#message') as HTMLTextAreaElement;
    const counter = this.form.querySelector('.counter-text') as HTMLElement;

    if (!messageField || !counter) return;

    messageField.addEventListener('input', () => {
      const count = messageField.value.length;
      counter.textContent = `${count} / 500`;

      // Color feedback
      if (count > 450) {
        counter.style.color = '#ef4444';
      } else if (count > 400) {
        counter.style.color = '#f59e0b';
      } else {
        counter.style.color = 'var(--color-light-2)';
      }

      // Announce milestones
      if ([20, 100, 200, 400, 450].includes(count)) {
        counter.setAttribute('aria-live', 'polite');
        setTimeout(() => counter.setAttribute('aria-live', 'off'), 1000);
      }
    });
  }

  private checkFormValidity(): boolean {
    const nameField = this.form.querySelector('#name') as HTMLInputElement;
    const emailField = this.form.querySelector('#email') as HTMLInputElement;
    const messageField = this.form.querySelector('#message') as HTMLTextAreaElement;

    const name = nameField?.value.trim() || '';
    const email = emailField?.value.trim() || '';
    const message = messageField?.value.trim() || '';

    // Direct validation
    const nameValid =
      name.length >= 2 && name.length <= 50 && /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s'-]+$/.test(name);
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const messageValid = message.length >= 20 && message.length <= 500;
    const projectValid =
      this.form.querySelectorAll('input[name="project-type"]:checked').length > 0;

    const isValid = nameValid && emailValid && messageValid && projectValid;

    this.submitBtn.disabled = !isValid;
    this.submitBtn.setAttribute('aria-disabled', (!isValid).toString());

    return isValid;
  }

  private setupFormSubmission(): void {
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
  }

  private async handleSubmit(e: Event): Promise<void> {
    e.preventDefault();

    // Prevent multiple submissions
    if (this.isSubmitting) {
      console.warn('Form is already being submitted');
      return;
    }

    // Final validation
    if (!this.checkFormValidity()) {
      const firstInvalid = this.form.querySelector(
        '.form-field.invalid input, .form-field.invalid textarea'
      ) as HTMLElement;
      firstInvalid?.focus();
      return;
    }

    // Set submitting flag and show loading state
    this.isSubmitting = true;
    this.setLoadingState(true);

    // Track form submission attempt
    analytics.trackFormSubmissionAttempt();

    try {
      const formData = new FormData(this.form);

      // Check honeypot
      if (formData.get('website') || formData.get('email_confirm')) {
        throw new Error('Spam detected');
      }

      // Prepare project types
      const projectTypes: string[] = [];
      const checkedBoxes = this.form.querySelectorAll(
        'input[name="project-type"]:checked'
      ) as NodeListOf<HTMLInputElement>;
      checkedBoxes.forEach((checkbox) => {
        projectTypes.push(checkbox.value);
      });
      formData.set('project-type', projectTypes.join(', '));

      // Add timestamp
      formData.set('timestamp', Date.now().toString());

      // Submit with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        analytics.trackFormSubmissionSuccess();
        this.handleSuccess();
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.error || `HTTP ${response.status}`;
        analytics.trackFormSubmissionError(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      if (error instanceof Error) {
        analytics.trackFormSubmissionError(error.message);
      }
      this.handleError(error);
    } finally {
      this.setLoadingState(false);
      this.isSubmitting = false;
    }
  }

  private setLoadingState(loading: boolean): void {
    const buttonContent = this.submitBtn.querySelector('.button-content');
    const buttonLoader = this.submitBtn.querySelector('.button-loader');

    if (loading) {
      buttonContent?.classList.add('hidden');
      buttonLoader?.classList.remove('hidden');
      this.submitBtn.disabled = true;
      this.submitBtn.setAttribute('aria-busy', 'true');
    } else {
      buttonContent?.classList.remove('hidden');
      buttonLoader?.classList.add('hidden');
      this.submitBtn.setAttribute('aria-busy', 'false');
    }
  }

  private handleSuccess(): void {
    // Keep submitting flag as true to prevent any further submissions
    this.isSubmitting = true;

    // Disable all form inputs
    const inputs = this.form.querySelectorAll('input, textarea, button');
    inputs.forEach((input) => {
      (input as HTMLInputElement).disabled = true;
    });

    // Disable pills
    const pills = this.form.querySelectorAll('.pill-content');
    pills.forEach((pill) => {
      const pillElement = pill as HTMLElement;
      pillElement.setAttribute('tabindex', '-1');
      pillElement.style.pointerEvents = 'none';
      pillElement.style.opacity = '0.5';
    });

    // Show success in button
    const buttonContent = this.submitBtn.querySelector('.button-content');
    if (buttonContent) {
      buttonContent.innerHTML = `
        <svg class="w-5 h-5 text-green-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span class="text-green-800 font-medium">Enviado correctamente</span>
      `;
    }

    this.submitBtn.classList.add('success-state');
    this.submitBtn.setAttribute('aria-label', 'Mensaje enviado correctamente');

    // Track success
    if (typeof gtag !== 'undefined') {
      gtag('event', 'form_submit', {
        event_category: 'Contact',
        event_label: 'Success',
      });
    }
  }

  private handleError(error: unknown): void {
    console.error('Form submission error:', error);

    let errorMessage = 'Hubo un error al enviar el mensaje. Por favor, intentá nuevamente.';

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorMessage = 'El envío tardó demasiado. Verificá tu conexión e intentá nuevamente.';
      } else if (error.message === 'Spam detected') {
        errorMessage = 'Error de validación. Refrescá la página e intentá nuevamente.';
      }
    }

    // Show error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error show mt-4 p-4 bg-red-50 border border-red-200 rounded-lg';
    errorDiv.setAttribute('role', 'alert');
    errorDiv.setAttribute('aria-live', 'assertive');
    errorDiv.innerHTML = `
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span class="text-red-700 font-medium">${errorMessage}</span>
      </div>
    `;

    this.form.appendChild(errorDiv);

    // Remove error after 8 seconds
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.parentNode.removeChild(errorDiv);
      }
    }, 8000);

    // Track error
    if (typeof gtag !== 'undefined') {
      gtag('event', 'form_submit', {
        event_category: 'Contact',
        event_label: 'Error',
      });
    }
  }
}

// Prevent multiple initializations
let contactFormInitialized = false;

// Progressive enhancement initialization
export function initContactForm(): void {
  // Prevent multiple initializations
  if (contactFormInitialized) {
    console.warn('Contact form already initialized');
    return;
  }

  const form = document.getElementById('contact-form') as HTMLFormElement;
  const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement;

  if (!form || !submitBtn) {
    console.warn('Contact form elements not found');
    return;
  }

  // Initialize form manager
  new ContactFormManager(form, submitBtn);
  contactFormInitialized = true;
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initContactForm);
} else {
  initContactForm();
}
