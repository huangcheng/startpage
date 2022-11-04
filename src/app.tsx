import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Global, css, ThemeProvider, useTheme } from '@emotion/react';
import i18next from 'i18next';
import { I18nextProvider } from 'react-i18next';

import { hot } from 'react-hot-loader/root';

import type { ReactElement } from 'react';

import { MainContent, Side, Head } from 'layouts';

import { useSelector, useDispatch } from 'hooks/store';
import { setLoading } from 'reducers/global';

import store from './store';
import routes from './routes';
import themes from './themes';

import type { Theme } from 'types/theme';

const i18nInstance = i18next.createInstance();

const Container = (): ReactElement => {
  const content = useRoutes(routes);
  const theme = useTheme() as Theme;
  const loading = useSelector((state: State) => state.global.loading);
  const dispatch = useDispatch();

  const { containerBackgroundColor, borderColor } = theme;

  // mock loading
  setTimeout(() => {
    dispatch(setLoading(false));
  }, 3000);

  return (
    <>
      <Global
        styles={css`
          body {
            margin: 0;
          }
        `}
      />
      {loading ? (
        'loading...'
      ) : (
        <div
          css={css`
            display: flex;
          `}
        >
          <Side style={{ backgroundColor: containerBackgroundColor }}></Side>
          <div
            css={css`
              display: flex;
              flex: auto;
              flex-direction: column;
            `}
          >
            <Head style={{ borderBottom: `1px solid ${borderColor}` }} />
            <MainContent>{content}</MainContent>
          </div>
        </div>
      )}
    </>
  );
};

const App = (): JSX.Element => {
  const theme = useSelector((state) => state.global.theme);

  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18nInstance}>
        <Router>
          <ThemeProvider theme={themes[theme]}>
            <Container />
          </ThemeProvider>
        </Router>
      </I18nextProvider>
    </Provider>
  );
};

export default hot(App);
