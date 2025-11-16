import { useEffect, useRef, useState } from 'react';
import { AlertCircle, Bell, CheckCircle, Info, Volume2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const SERVICE_URL = import.meta.env.VITE_NOTIFICATION_URL ?? 'http://127.0.0.1:5001';
const MAX_NOTIFICATIONS = 50;

type Priority = 'low' | 'medium' | 'high' | 'critical';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  priority: Priority;
  timestamp: string;
  agent_id?: string;
  requires_approval?: boolean;
  status?: string;
  voice_available?: boolean;
  voice_url?: string | null;
  data?: Record<string, unknown>;
}

type VoiceEvent = {
  type: 'voice_ready';
  notification_id: string;
  voice_url?: string;
};

type StreamEvent = Notification | VoiceEvent | { type: 'keepalive' | 'connected' };

const resolveVoiceUrl = (url: string | null | undefined, id?: string) => {
  if (!url && !id) {
    return null;
  }

  const finalUrl = url ?? `/api/notifications/${id}/voice`;
  if (finalUrl.startsWith('http')) {
    return finalUrl;
  }
  return `${SERVICE_URL}${finalUrl}`;
};

const normalizeNotification = (raw: any): Notification => {
  const id = raw?.id ?? crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);
  const priority: Priority = raw?.priority ?? 'medium';

  return {
    id,
    type: raw?.type ?? 'info',
    title: raw?.title ?? 'Notification',
    message: raw?.message ?? '',
    priority,
    timestamp: raw?.created_at ?? raw?.timestamp ?? new Date().toISOString(),
    agent_id: raw?.agent_id ?? 'System',
    requires_approval: Boolean(raw?.requires_approval),
    status: raw?.status ?? (raw?.requires_approval ? 'pending' : 'delivered'),
    voice_available: Boolean(raw?.has_voice ?? raw?.voice_url),
    voice_url: resolveVoiceUrl(raw?.voice_url, id),
    data: raw?.data ?? {},
  } satisfies Notification;
};

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const connect = () => {
      const source = new EventSource(`${SERVICE_URL}/api/notifications/stream`);

      source.onopen = () => {
        setIsConnected(true);
      };

      source.onmessage = (event) => {
        if (!event.data) {
          return;
        }

        let payload: StreamEvent;
        try {
          payload = JSON.parse(event.data);
        } catch (err) {
          console.error('Failed to parse notification event', err);
          return;
        }

        if (!payload) {
          return;
        }

        if ('type' in payload && (payload.type === 'keepalive' || payload.type === 'connected')) {
          return;
        }

        if ('type' in payload && payload.type === 'voice_ready') {
          const voiceEvent = payload as VoiceEvent;
          const voiceUrl = resolveVoiceUrl(voiceEvent.voice_url, voiceEvent.notification_id);
          console.log(`🎤 Voice ready for notification ${voiceEvent.notification_id}, URL: ${voiceUrl}`);
          
          setNotifications((prev) =>
            prev.map((notification) => {
              if (notification.id === voiceEvent.notification_id) {
                const updated = { ...notification, voice_available: true, voice_url: voiceUrl };
                
                // Auto-play if high/critical priority
                if (notification.priority === 'high' || notification.priority === 'critical') {
                  console.log(`🔊 Auto-playing voice for ${notification.priority} notification`);
                  setTimeout(() => playVoice(updated, true), 500);
                }
                
                return updated;
              }
              return notification;
            })
          );
          return;
        }

        const normalized = normalizeNotification(payload);
        setNotifications((prev) => {
          const next = [normalized, ...prev].slice(0, MAX_NOTIFICATIONS);
          return next;
        });
        setUnreadCount((prev) => prev + 1);
        showToast(normalized);

        if (
          normalized.voice_available &&
          (normalized.priority === 'high' || normalized.priority === 'critical')
        ) {
          setTimeout(() => playVoice(normalized, true), 1500);
        }
      };

      source.onerror = (error) => {
        console.error('Notification stream error', error);
        setIsConnected(false);
        source.close();
        setTimeout(connect, 5000);
      };

      eventSourceRef.current = source;
    };

    connect();

    return () => {
      eventSourceRef.current?.close();
    };
  }, []);

  useEffect(() => {
    fetch(`${SERVICE_URL}/api/notifications/history?limit=${MAX_NOTIFICATIONS}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(res.statusText))))
      .then((data) => {
        const history = Array.isArray(data?.history) ? data.history : [];
        const normalized = history.map((item: any) => normalizeNotification(item));
        setNotifications(normalized);
        setUnreadCount(normalized.length);

        const urgent = normalized.find(
          (n) => n.voice_available && (n.priority === 'high' || n.priority === 'critical')
        );
        if (urgent) {
          setTimeout(() => playVoice(urgent, true), 1000);
        }
      })
      .catch((err) => console.error('Failed to load notification history', err));
  }, []);

  const showToast = (notification: Notification) => {
    toast(notification.title, {
      description: notification.message,
      duration: notification.priority === 'critical' ? 12000 : 6000,
      icon: getNotificationIcon(notification.type, notification.priority),
    });
  };

  const playVoice = async (notification: Notification, autoPlay = false) => {
    if (!notification.voice_available) {
      console.log('⚠ Voice not available for notification', notification.id);
      return;
    }

    try {
      const url = notification.voice_url ?? resolveVoiceUrl(null, notification.id);
      console.log(`🔊 Attempting to play voice from: ${url}`);
      
      const response = await fetch(url ?? '');
      if (!response.ok) {
        throw new Error(`Voice fetch failed: ${response.status}`);
      }

      const blob = await response.blob();
      console.log(`✓ Voice loaded: ${blob.size} bytes, type: ${blob.type}`);
      
      const objectUrl = URL.createObjectURL(blob);
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      audioRef.current.src = objectUrl;
      
      console.log('▶ Playing audio...');
      await audioRef.current.play();
      console.log('✓ Audio playing');
    } catch (err) {
      const error = err as Error;
      console.error(`✗ Failed to play voice (autoPlay=${autoPlay}):`, error.message);
      if (!autoPlay) {
        toast.error('Audio not available yet. Please try again.');
      }
    }
  };

  const respondToApproval = async (notification: Notification, approved: boolean) => {
    try {
      const response = await fetch(`${SERVICE_URL}/api/notifications/${notification.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved, manager_id: 'dashboard' }),
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      setNotifications((prev) =>
        prev.map((item) =>
          item.id === notification.id
            ? { ...item, status: approved ? 'approved' : 'rejected', requires_approval: false }
            : item
        )
      );

      toast.success(approved ? 'Notification approved' : 'Notification rejected');
    } catch (err) {
      console.error('Failed to respond to approval', err);
      toast.error('Manager response failed');
    }
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const markAsRead = () => setUnreadCount(0);

  return (
    <>
      <audio ref={audioRef} className="hidden" />
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => {
              setIsOpen(true);
              if (unreadCount > 0) {
                markAsRead();
              }
            }}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-[10px]" variant="destructive">
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-96 p-0">
          <div className="flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">Notifications</h3>
              {isConnected ? (
                <Badge variant="outline" className="text-green-600">
                  <span className="mr-1 h-2 w-2 animate-pulse rounded-full bg-green-600" />Live
                </Badge>
              ) : (
                <Badge variant="outline" className="text-muted-foreground">
                  Offline
                </Badge>
              )}
            </div>
            {notifications.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAll}>
                Clear all
              </Button>
            )}
          </div>
          <ScrollArea className="h-[420px]">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <Bell className="mb-3 h-12 w-12" />
                <p>No notifications yet</p>
                <p className="text-xs">Real-time events from agents will show here.</p>
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <div key={notification.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">{getNotificationIcon(notification.type, notification.priority)}</div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <Badge className={`${priorityBadge(notification.priority)} text-xs text-white`}>
                            {notification.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span>{notification.agent_id ?? 'System'}</span>
                          <Separator orientation="vertical" className="h-3" />
                          <span>{new Date(notification.timestamp).toLocaleTimeString()}</span>
                          {notification.voice_available && (
                            <>
                              <Separator orientation="vertical" className="h-3" />
                              <Button variant="ghost" size="sm" className="h-6 px-2" onClick={() => playVoice(notification)}>
                                <Volume2 className="mr-1 h-3 w-3" />Play
                              </Button>
                            </>
                          )}
                        </div>
                        {notification.requires_approval && (
                          <div className="flex gap-2 pt-1">
                            <Button size="sm" className="h-7 text-xs" onClick={() => respondToApproval(notification, true)}>
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs"
                              onClick={() => respondToApproval(notification, false)}
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                        {notification.status && !notification.requires_approval && (
                          <p className="text-xs text-muted-foreground">
                            Status: <span className="capitalize">{notification.status}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </>
  );
}

const getNotificationIcon = (type: string, priority: Priority) => {
  if (priority === 'critical') {
    return <XCircle className="h-4 w-4 text-red-500" />;
  }
  if (priority === 'high') {
    return <AlertCircle className="h-4 w-4 text-orange-500" />;
  }
  if (type === 'workflow_update') {
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  }
  if (type === 'error') {
    return <XCircle className="h-4 w-4 text-red-500" />;
  }
  return <Info className="h-4 w-4 text-blue-500" />;
};

const priorityBadge = (priority: Priority) => {
  switch (priority) {
    case 'critical':
      return 'bg-red-500';
    case 'high':
      return 'bg-orange-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'low':
    default:
      return 'bg-blue-500';
  }
};
