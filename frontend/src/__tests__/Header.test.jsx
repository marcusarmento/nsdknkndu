import { render, screen } from '@testing-library/react';
import Header from '../components/Header.jsx';
import { BrowserRouter } from 'react-router-dom';

describe('Header', () => {
  it('renders page title', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    const heading = screen.getByText(/Controle de Processos/i);
    expect(heading).toBeTruthy();
  });
});
