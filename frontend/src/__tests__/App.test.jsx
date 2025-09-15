import { render, screen } from '@testing-library/react';
import App from '../App.jsx';
import { vi } from 'vitest';

vi.mock('../api', () => ({
  api: {
    processos: {
      getAll: vi.fn().mockResolvedValue({ data: [], total: 0 })
    }
  }
}));

describe('App', () => {
  it('renders dashboard heading', async () => {
    render(<App />);
    expect(await screen.findByText(/Recebidos/i)).toBeTruthy();
  });
});
