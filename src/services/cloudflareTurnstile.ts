import { CloudflareTurnstileState } from '../types/restaurant';

type Listener = (state: CloudflareTurnstileState) => void;

class CloudflareTurnstileService {
  private state: CloudflareTurnstileState = {
    status: 'unverified',
    token: null,
    cfRayId: null,
    botScore: 0.98,
    verifiedAt: null,
    challengeType: 'invisible',
  };

  private listeners: Set<Listener> = new Set();

  getState(): CloudflareTurnstileState {
    return { ...this.state };
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const current = this.getState();
    this.listeners.forEach((fn) => fn(current));
  }

  async runBackgroundChallenge(forceInteractive = false): Promise<CloudflareTurnstileState['status']> {
    this.state = {
      ...this.state,
      status: 'verifying',
    };
    this.notify();

    await new Promise((resolve) => setTimeout(resolve, 350));

    if (forceInteractive) {
      this.state = {
        ...this.state,
        status: 'challenge_required',
        challengeType: 'interactive',
      };
      this.notify();
      return 'challenge_required';
    }

    const randomRay = Math.random().toString(36).substring(2, 10).toUpperCase();
    const token = `cf-tn-${Math.random().toString(36).substring(2, 12)}-${Date.now()}`;

    this.state = {
      status: 'verified',
      token,
      cfRayId: `RAY-${randomRay}-BOM`,
      botScore: 0.99,
      verifiedAt: new Date().toLocaleTimeString(),
      challengeType: 'invisible',
    };
    this.notify();
    return 'verified';
  }

  async completeInteractiveChallenge(): Promise<boolean> {
    this.state = {
      ...this.state,
      status: 'verifying',
    };
    this.notify();

    await new Promise((resolve) => setTimeout(resolve, 500));

    const randomRay = Math.random().toString(36).substring(2, 10).toUpperCase();
    const token = `cf-int-${Math.random().toString(36).substring(2, 12)}-${Date.now()}`;

    this.state = {
      status: 'verified',
      token,
      cfRayId: `RAY-${randomRay}-DEL`,
      botScore: 0.99,
      verifiedAt: new Date().toLocaleTimeString(),
      challengeType: 'interactive',
    };
    this.notify();
    return true;
  }
}

export const cloudflareTurnstile = new CloudflareTurnstileService();
