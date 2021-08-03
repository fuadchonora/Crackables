import './App.css';
import Router from './router';
import { createTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

const THEME = createTheme({
	typography: {
		fontFamily: `'Poppins', sans-serif`,
		fontSize: 14,
		fontWeightLight: 300,
		fontWeightRegular: 400,
		fontWeightMedium: 500,
	},
});

function App() {
	return (
		<div className="App">
			<ThemeProvider theme={THEME}>
				<Router />
			</ThemeProvider>
		</div>
	);
}

export default App;
