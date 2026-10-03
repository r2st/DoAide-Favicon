import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TextFavicon from '../text-favicon/TextFavicon';

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

describe('TextFavicon', () => {
  it('renders form controls', () => {
    render(<TextFavicon />);
    expect(screen.getByPlaceholderText('D')).toBeInTheDocument();
    expect(screen.getByText('Font')).toBeInTheDocument();
    expect(screen.getByText('Text Color')).toBeInTheDocument();
    expect(screen.getByText('Background Color')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate/i })).toBeInTheDocument();
  });

  it('limits text input to 2 characters', async () => {
    render(<TextFavicon />);
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText('D');
    await user.clear(input);
    await user.type(input, 'ABCD');
    expect(input.value.length).toBeLessThanOrEqual(2);
  });

  it('generates preview on button click', async () => {
    render(<TextFavicon />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /generate/i }));
    expect(screen.getByText('Preview')).toBeInTheDocument();
  });
});
