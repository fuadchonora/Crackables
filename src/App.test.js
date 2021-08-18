import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Crackables link', () => {
	render(<App />);
	const linkElement = screen.getByText(/Crackables/i);
	expect(linkElement).toBeInTheDocument();
});
