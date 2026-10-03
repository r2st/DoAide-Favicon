import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmojiFavicon from '../emoji-favicon/EmojiFavicon';

beforeEach(() => {
  vi.spyOn(document, 'createElement').mockImplementation(function (tag) {
    if (tag === 'canvas') {
      const ctx = {
        clearRect: vi.fn(), fillRect: vi.fn(), fillText: vi.fn(),
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

describe('EmojiFavicon', () => {
  it('renders emoji input and quick picks', () => {
    render(<EmojiFavicon />);
    expect(screen.getByPlaceholderText('🚀')).toBeInTheDocument();
    expect(screen.getByText('Quick Pick')).toBeInTheDocument();
  });

  it('selects emoji from quick pick', async () => {
    render(<EmojiFavicon />);
    const user = userEvent.setup();
    const heartBtn = screen.getByRole('button', { name: '❤️' });
    await user.click(heartBtn);
    expect(screen.getByPlaceholderText('🚀').value).toBe('❤️');
  });

  it('generates favicon on click', async () => {
    render(<EmojiFavicon />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /generate/i }));
    expect(screen.getByText('Preview')).toBeInTheDocument();
  });
});
