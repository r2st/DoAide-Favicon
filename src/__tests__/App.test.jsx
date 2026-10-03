import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

beforeEach(() => {
  vi.spyOn(document, 'createElement').mockImplementation(function (tag) {
    if (tag === 'canvas') {
      const ctx = {
        clearRect: vi.fn(), fillRect: vi.fn(), fillText: vi.fn(),
        beginPath: vi.fn(), moveTo: vi.fn(), lineTo: vi.fn(),
        quadraticCurveTo: vi.fn(), closePath: vi.fn(),
        fill: vi.fn(), clip: vi.fn(), drawImage: vi.fn(),
        font: '', fillStyle: '', textAlign: '', textBaseline: '',
      };
      return {
        width: 0, height: 0,
        getContext: () => ctx,
        toDataURL: () => 'data:image/png;base64,test',
        toBlob: (cb) => cb(new Blob(['test'])),
      };
    }
    return Object.getPrototypeOf(document).createElement.call(document, tag);
  });
});

describe('App', () => {
  it('renders header with brand name', () => {
    render(<App />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('DoAide');
    expect(heading).toHaveTextContent('Favicon');
  });

  it('renders all tab buttons', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /text/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /emoji/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /image/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /svg/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /preview/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /package/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /url checker/i })).toBeInTheDocument();
  });

  it('shows Text Favicon by default', () => {
    render(<App />);
    expect(screen.getByText('Text to Favicon')).toBeInTheDocument();
  });

  it('switches to Emoji tab on click', async () => {
    render(<App />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /emoji/i }));
    expect(screen.getByText('Emoji Favicon')).toBeInTheDocument();
  });

  it('switches to URL Checker tab', async () => {
    render(<App />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /url checker/i }));
    expect(screen.getByText('URL Favicon Checker')).toBeInTheDocument();
  });

  it('renders footer', () => {
    render(<App />);
    expect(screen.getByText(/Made with care/)).toBeInTheDocument();
  });
});
