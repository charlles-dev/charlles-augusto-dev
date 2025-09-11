import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsEvent {
  event_type: string;
  event_data?: Record<string, any>;
  page_path?: string;
}

export const useAnalytics = () => {
  const trackEvent = async (event: AnalyticsEvent) => {
    try {
      await supabase.from('analytics_events').insert({
        event_type: event.event_type,
        event_data: event.event_data || {},
        page_path: event.page_path || window.location.pathname,
        user_agent: navigator.userAgent,
        referrer: document.referrer,
        session_id: getSessionId(),
      });
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  };

  const trackPageView = async (path?: string) => {
    await trackEvent({
      event_type: 'page_view',
      page_path: path || window.location.pathname,
      event_data: {
        title: document.title,
        timestamp: new Date().toISOString(),
      },
    });
  };

  const trackProjectView = async (projectId: string, projectName: string) => {
    await trackEvent({
      event_type: 'project_view',
      event_data: {
        project_id: projectId,
        project_name: projectName,
      },
    });
  };

  const trackDownload = async (type: string, filename: string) => {
    await trackEvent({
      event_type: 'download',
      event_data: {
        type,
        filename,
      },
    });
  };

  const trackExternalClick = async (url: string, type: string) => {
    await trackEvent({
      event_type: 'external_click',
      event_data: {
        url,
        type, // 'github', 'linkedin', 'demo', etc.
      },
    });
  };

  return {
    trackEvent,
    trackPageView,
    trackProjectView,
    trackDownload,
    trackExternalClick,
  };
};

// Generate or retrieve session ID
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
};

// Auto-track page views
export const usePageTracking = () => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    // Track initial page load
    trackPageView();

    // Track navigation in SPA
    const handlePopState = () => {
      trackPageView();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [trackPageView]);
};