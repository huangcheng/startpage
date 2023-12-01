import { css, useTheme } from '@emotion/react';

import type { FC, ReactElement } from 'react';

import { Site } from 'components';

import type { Theme } from 'types/theme';
import type { Site as SiteType } from 'types/response';

export interface CategoryProps {
  icon: string;
  id: string;
  sites: SiteType[];
  title: string;
}

const Category: FC<CategoryProps> = (props: CategoryProps): ReactElement<CategoryProps> => {
  const { id, sites, title, icon } = props;

  const theme = useTheme() as Theme;

  const { textColor } = theme;

  return (
    <section
      id={id}
      css={css`
        margin-bottom: 48px;
      `}
    >
      <title
        css={css`
          display: flex;
          align-items: center;
          font-size: 20px;
          font-weight: bold;
          line-height: 28px;
          color: ${textColor};
        `}
      >
        <img src={icon} alt={title} width={20} height={20} />
        <span
          css={css`
            margin-left: 8px;
          `}
        >
          {title}
        </span>
      </title>
      <div
        css={css`
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          column-gap: 24px;
          row-gap: 20px;
          margin-top: 24px;
        `}
      >
        {sites.map(
          ({ id, url, description, name, icon }: SiteType): ReactElement => (
            <Site key={id} icon={icon} title={name} link={url} description={description} />
          ),
        )}
      </div>
    </section>
  );
};

Category.displayName = 'Category';

export default Category;
