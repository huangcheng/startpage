import { useEffect, useMemo, useRef, useState } from 'react';
import { css, useTheme, Global } from '@emotion/react';
import { useTranslation } from 'react-i18next';
import { BrowserView } from 'react-device-detect';
import { GithubOutlined } from '@ant-design/icons';

import type { ReactElement } from 'react';

import { useDispatch } from 'hooks/store';
import { setNav } from 'reducers/category';
import { MainContent, Side } from 'layouts';
import { Logo, Search, Header } from 'components';
import { useFetchCategoriesQuery } from 'hooks/request';
import { useIsLogin } from 'hooks/store/user';

import type { Category as CategoryType } from 'types/response';
import type { Theme } from 'types/theme';
import type { Nav as CategoryNav } from 'reducers/category';

import logo from 'assets/images/logo.svg';
import { useNav } from 'hooks/store/category';

import { Category, Nav } from './components';

export default function Home(): ReactElement {
  const theme = useTheme() as Theme;
  const { containerBackgroundColor, navActiveColor, textColor } = theme;

  const { t } = useTranslation();

  const { data } = useFetchCategoriesQuery({ page: 0, size: 10_000 });

  const categories = useMemo<CategoryType[]>(() => data?.data ?? [], [data]);

  const [search, setSearch] = useState('');

  const ref = useRef<HTMLElement | null>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (categories.length > 0) {
      const result: CategoryNav = {};

      for (const { id, children = [] } of categories) {
        result[id] = children !== null && children.length > 0 ? children[0].id : id;
      }

      dispatch(setNav(result));
    }
  }, [categories, dispatch]);

  const nav = useNav();

  const isLogin = useIsLogin();

  const navWidth = 220;

  return (
    <div
      css={css`
        align-content: stretch;
        display: flex;
        height: 100vh;
        width: 100vw;
      `}
    >
      <Global
        styles={css`
          .ant-anchor::before {
            display: none !important;
          }

          .ant-anchor .ant-anchor-ink {
            inset-inline-start: unset !important;

            inset-inline-end: 0 !important;

            background-color: ${navActiveColor} !important;
          }

          .ant-anchor .ant-anchor-link {
            padding-block: 6px !important;
          }

          .ant-anchor-link-active {
            background-color: rgba(240, 240, 240, 0.27) !important;
          }

          .ant-anchor .ant-anchor-link-active > .ant-anchor-link-title {
            color: ${navActiveColor} !important;
          }
        `}
      />
      <BrowserView>
        <Side
          style={{
            backgroundColor: containerBackgroundColor,
            height: '100%',
          }}
          width={navWidth}
        >
          <div
            css={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              justifyItems: 'stretch',
              overflowY: 'auto',
              position: 'relative',
              width: navWidth,
            }}
          >
            <Logo src={logo} />
            <Nav
              style={{
                flex: 'auto',
                marginTop: 10,
              }}
              items={categories.map(({ icon, id, name, description, children = [] }) => ({
                children,
                description,
                icon,
                id,
                name,
              }))}
              getContainer={(): HTMLElement | Window => ref.current ?? window}
              onClick={(id) => {
                if (/(\d+)-(\d+)/.test(id)) {
                  const [parent, self] = id.split('-');

                  dispatch(setNav({ ...nav, [parent]: Number(self) }));
                }
              }}
            />
            <div
              css={css`
                padding: 16px;
                font-size: 12px;
                color: ${textColor};
              `}
            >
              <div>
                ©2023 {' - '} {new Date().getFullYear()}{' '}
                <a target="_blank" href="https://github.com/huangcheng" rel="noreferrer">
                  HUANG Cheng
                </a>{' '}
                All rights reserved.
              </div>
              <div
                css={css`
                  text-align: center;
                  margin-top: 8px;
                `}
              >
                <a
                  css={css`
                    color: ${textColor};
                  `}
                  target="_blank"
                  href="https://github.com/huangcheng/startpage-web"
                  rel="noreferrer"
                  title="Source Code"
                >
                  <GithubOutlined style={{ fontSize: 20 }} />
                </a>
              </div>
            </div>
          </div>
        </Side>
      </BrowserView>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          flex: auto;
          height: 100vh;
        `}
      >
        {isLogin && <Header />}
        <MainContent ref={ref}>
          <div
            css={css`
              display: flex;
              flex-direction: column;
            `}
          >
            <div
              css={css`
                align-items: center;
                display: flex;
                flex-direction: column;
              `}
            >
              <Search
                placeholder={t('PLEASE_ENTER_KEYWORDS_TO_SEARCH')}
                onSearch={(value) => {
                  setSearch(value);
                }}
              />
            </div>
            <div
              css={css`
                margin-top: 60px;
                flex: auto;
              `}
            >
              {categories.map(
                (category: Category): ReactElement => (
                  <Category
                    key={category.id}
                    category={category}
                    search={search}
                    onClick={(id: number): void => {
                      navigator.sendBeacon(`/api/site/${id}/visit`);
                    }}
                  />
                ),
              )}
            </div>
          </div>
        </MainContent>
      </div>
    </div>
  );
}
